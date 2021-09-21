from fastapi import APIRouter, status, Form, HTTPException, Depends, Header
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from tortoise.timezone import make_aware
from app.db import redis_session
from app.db.models import Article, PydanticArticle, PydanticPreviewArticle, User, PydanticUser, Timeline, Comment, \
    PydanticComment
from app.utils import auth, comm
from app.schemas import CommModel
from app.schemas.article import ArticlePaginationModel, ArticleInfoModel
from app.routers.comment import generate_nest_comments
from typing import List, Optional
from datetime import datetime, timedelta
from uuid import uuid4
from config import configs
import warnings

router = APIRouter()


@router.post('/article', summary='新建文章, 获取aid', response_model=CommModel)
async def create_article(uid: str = Depends(auth.validate_access_token)):
    user = await User.get(uid=uid)
    inactive_article = await user.articles.filter(is_active=False).first()
    if inactive_article:
        return JSONResponse(content={'data': str(inactive_article.aid), 'msg': '文章创建成功.', 'code': comm.BUSINESS.OK},
                            status_code=status.HTTP_201_CREATED)
    article = await Article.create(aid=uuid4(), author_id=user.uid)
    return JSONResponse(content={'data': str(article.aid), 'msg': '文章创建成功.', 'code': comm.BUSINESS.OK},
                        status_code=status.HTTP_201_CREATED)


@router.get('/article', summary='获取文章列表', response_model=ArticlePaginationModel)
async def article_list(page: int, start: str, end: str):
    # 使用 datetime 比较过滤时间会引起 warning, 目前暂未找到解决方案, 希望有大佬能够解决
    warnings.filterwarnings("ignore")
    if page <= 0:
        raise HTTPException(detail={'msg': '页码错误.', 'code': comm.BUSINESS.PARAMS_ERROR},
                            status_code=status.HTTP_400_BAD_REQUEST)
    page_size = configs.PAGE_SIZE
    try:
        start = make_aware(datetime.strptime(start, "%Y-%m-%d"))
    except ValueError:
        start = make_aware(datetime.strptime('1970-1-1', "%Y-%m-%d"))
    try:
        end = make_aware(datetime.strptime(end, "%Y-%m-%d") + timedelta(days=1))
    except ValueError:
        end = make_aware(datetime.strptime('2099-12-31', "%Y-%m-%d"))
    total_count = await Article.filter(status=3).filter(publish_at__gte=start).filter(publish_at__lte=end).count()
    articles = await PydanticPreviewArticle.from_queryset(
        Article.filter(status=3).filter(publish_at__gte=start).filter(
            publish_at__lte=end).offset((page - 1) * page_size).limit(page_size))
    json_compatible_articles: List[dict] = jsonable_encoder(articles)
    results = []
    for json_compatible_article in json_compatible_articles:
        author = await PydanticUser.from_queryset_single(
            (await Article.get(aid=json_compatible_article.get('aid'))).author)
        results.append({
            **json_compatible_article,
            'author': {
                'username': author.username,
                'avatar': author.avatar_url,
            }
        })
    next_page = page + 1 if page * page_size < total_count else None
    previous_page = page - 1 if page > 1 else None
    return JSONResponse(
        content={
            'data': {
                'count': total_count,
                'next': next_page,
                'previous': previous_page,
                'results': jsonable_encoder(results),
            },
            'code': comm.BUSINESS.OK,
        },
        status_code=status.HTTP_200_OK)


@router.put('/article/{aid}', summary='发表 / 修改 文章', response_model=CommModel)
async def publish_article(aid: str, title: str = Form(...), desc: str = Form(...), lang: str = Form(...),
                          file: str = Form(default=None), content: str = Form(...), s: int = Form(...),
                          uid: str = Depends(auth.validate_access_token)):
    """
    :param aid:
    :param title:
    :param desc:
    :param lang:
    :param content:
    :param file:
    :param s:  0: 保存文章, 1: 发布文章
    :param uid:
    :return:
    """
    if s not in [0, 1]:
        raise HTTPException(detail={'msg': '查询条件错误.', 'code': comm.BUSINESS.PARAMS_ERROR},
                            status_code=status.HTTP_400_BAD_REQUEST)
    user = await User.get(uid=uid)
    article = await user.articles.filter(aid=aid).first()
    if article:
        if article.title == title and article.desc == desc and article.lang == lang and article.content == content and (
                await article.file) == file:
            raise HTTPException(detail={'msg': '无修改内容.', 'code': comm.BUSINESS.PARAMS_ERROR},
                                status_code=status.HTTP_400_BAD_REQUEST)
        article_dict = {'title': title, 'desc': desc, 'lang': lang, 'content': content, 'is_active': '1',
                        'file_id': file}
        msg = '文章保存成功.'
        publish_at = article.publish_at if article.publish_at else make_aware(datetime.utcnow())
        if s == 1:
            await Timeline.create(creator_id=uid, action=8 if article.publish_at else 7, article_id=aid)
            msg = '文章发布成功.'
            article_dict.update(status=s, publish_at=publish_at)
        else:
            if article.publish_at:
                await Timeline.create(creator_id=uid, action=8, article_id=aid)
        await article.update_from_dict(article_dict)
        await article.save()
        return JSONResponse(content={'data': aid, 'msg': msg, 'code': comm.BUSINESS.OK}, status_code=status.HTTP_200_OK)
    raise HTTPException(detail={'msg': '非法操作, 阻断请求.', 'code': comm.BUSINESS.ILLEGAL_OPERATION},
                        status_code=status.HTTP_423_LOCKED)


@router.get('/article/{aid}', summary='获取文章详情', response_model=ArticleInfoModel)
async def get_article(aid: str, authorization: Optional[str] = Header(None)):
    article = await Article.filter(aid=aid, status=3).first()
    if article:
        if authorization:
            token = authorization.split()
            if len(token) == 2 and token[0].lower() == 'bearer':
                uid = auth.decode_access_token(token[1])
                if uid and not redis_session.get(f'views_article_{aid}_{uid}'):
                    await Timeline.create(creator_id=uid, action=1, article_id=aid)
                    redis_session.setex(name=f'views_article_{aid}_{uid}', time=60 * 60 * 24, value=1)
        article.views += 1
        await article.save()
        await article.fetch_related('author')
        author = await PydanticUser.from_tortoise_orm(article.author)
        json_compatible_article: dict = jsonable_encoder(await PydanticArticle.from_tortoise_orm(article))
        comments_list = []
        raw_comments = Comment.filter(article_id=aid)
        await raw_comments.prefetch_related('comments', 'author')
        async for comment in raw_comments:
            comment_author = jsonable_encoder(await PydanticUser.from_tortoise_orm(await comment.author))
            comments_list.append({
                **jsonable_encoder(await PydanticComment.from_tortoise_orm(comment)),
                'author': {
                    'username': comment_author.get('username'),
                    'avatar': comment_author.get('avatar_url'),
                },
                # 使用 generate_nest_comments 递归函数进行嵌套查询
                'comments': await generate_nest_comments(comment)
            })
        related_file = await article.file
        file = {
            'filesize': int(related_file.filesize),
            'filename': str(related_file),
            'fid': str(related_file.fid),
        } if related_file else {}
        return JSONResponse(content={'data': {
            **json_compatible_article,
            'author': {
                'username': author.username,
                'avatar': author.avatar_url,
            },
            'file': file,
            'comments': comments_list
        }, 'code': comm.BUSINESS.OK},
            status_code=status.HTTP_200_OK)
    raise HTTPException(detail={'msg': '文章不存在.', 'code': comm.BUSINESS.NOT_EXIST},
                        status_code=status.HTTP_404_NOT_FOUND)


@router.get('/article/{aid}/base', summary='获取可修改的文章详情', response_model=ArticleInfoModel)
async def edit_article(aid: str, uid: str = Depends(auth.validate_access_token)):
    article = await Article.filter(aid=aid, status__lt=4).first()
    if article:
        await article.fetch_related('author', 'file')
        if str(article.author.uid) == uid:
            json_compatible_article: dict = jsonable_encoder(await PydanticArticle.from_tortoise_orm(article))
            file = {
                'filesize': int(article.file.filesize),
                'filename': str(article.file),
                'fid': str(article.file.fid),
            } if article.file else {}
            return JSONResponse(content={'data': {
                **json_compatible_article,
                'file': file
            }, 'code': comm.BUSINESS.OK},
                status_code=status.HTTP_200_OK)
    raise HTTPException(detail={'msg': '请求参数错误.', 'code': comm.BUSINESS.PARAMS_ERROR},
                        status_code=status.HTTP_400_BAD_REQUEST)


@router.delete('/article/{aid}', summary='删除文章', response_model=CommModel)
async def delete_article(aid: str, uid: str = Depends(auth.validate_access_token)):
    user = await User.get(uid=uid)
    article = await user.articles.filter(aid=aid).first()
    if article and article.status != 4:
        await Timeline.create(creator_id=uid, action=9, article_id=aid)
        await article.update_from_dict({'status': 4})
        await article.save()
        return JSONResponse(content={'data': aid, 'msg': '文章删除成功.', 'code': comm.BUSINESS.OK},
                            status_code=status.HTTP_200_OK)
    raise HTTPException(detail={'msg': '文章不存在.', 'code': comm.BUSINESS.NOT_EXIST},
                        status_code=status.HTTP_404_NOT_FOUND)


@router.post('/article/{aid}/star', summary='点赞文章', response_model=CommModel)
async def star_article(aid: str, uid: str = Depends(auth.validate_access_token)):
    await User.get(uid=uid)
    article = await Article.filter(aid=aid).first()
    if article and article.status == 3:
        if await Timeline.filter(creator=uid, action=4, article_id=aid).first():
            raise HTTPException(detail={'msg': '您已经点过赞啦.', 'code': comm.BUSINESS.ILLEGAL_OPERATION},
                                status_code=status.HTTP_400_BAD_REQUEST)
        await Timeline.create(creator_id=uid, action=4, article_id=aid)
        article.stars += 1
        await article.save()
        return JSONResponse(content={'data': aid, 'msg': '点赞成功.', 'code': comm.BUSINESS.OK},
                            status_code=status.HTTP_200_OK)
    raise HTTPException(detail={'msg': '文章不存在.', 'code': comm.BUSINESS.NOT_EXIST},
                        status_code=status.HTTP_404_NOT_FOUND)
