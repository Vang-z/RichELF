from fastapi import APIRouter, status, HTTPException, Form, Header, Query
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from tortoise.models import Q
from tortoise.queryset import Count
from app.db.models import Article, PydanticPreviewArticle, User, PydanticUser, Keyword, PydanticKeyword
from app.utils import comm, auth
from app.schemas import CommModel
from typing import List, Optional
from config import configs

router = APIRouter()


@router.post('/search/keyword', summary='添加搜索关键字')
async def keyword(content: str = Form(...)):
    if len(content) > 4:
        k = await Keyword.filter(content=content).first()
        if k:
            k.hot += 1
            await k.save()
        else:
            await Keyword.create(content=content)
    return JSONResponse(status_code=status.HTTP_204_NO_CONTENT)


@router.get('/search/tending', summary='推荐搜索', response_model=CommModel)
async def tending():
    k = await PydanticKeyword.from_queryset(Keyword.all().limit(5))
    json_compatible_keywords = jsonable_encoder(k)
    users = await PydanticUser.from_queryset(
        User.all().annotate(timelines_count=Count('timelines')).order_by('-timelines_count').limit(20))
    json_compatible_users = jsonable_encoder(users)
    return JSONResponse(content={
        'data': {
            'keywords': json_compatible_keywords,
            'users': json_compatible_users
        },
        'msg': '查询成功.',
        'code': comm.BUSINESS.OK
    })


@router.get('/search/pre/{keywords}', summary='预搜索', response_model=CommModel)
async def pre_search(keywords: str):
    # todo: 将 fulltext 索引替换为 AI 搜索引擎
    articles = await PydanticPreviewArticle.from_queryset(
        Article.filter(status=3).filter(Q(title__icontains=keywords) | Q(desc__icontains=keywords)).limit(5))
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
    users = await PydanticUser.from_queryset(
        User.filter(is_active=True).filter(Q(username__icontains=keywords) | Q(bio__icontains=keywords)))
    return JSONResponse(
        content={
            'data': {
                'articles': results,
                'users': jsonable_encoder(users)
            },
            'msg': '查询成功.',
            'code': comm.BUSINESS.OK
        },
        status_code=status.HTTP_201_CREATED
    )


@router.get('/search/{category}/{keywords}', summary='精确搜索', response_model=CommModel)
async def search(category: str, keywords: str, page: int = Query(...), sort: str = Query(default='updated'),
                 authorization: Optional[str] = Header(None)):
    """
    :param category:
    :param keywords:
    :param page:
    :param sort: article: 'updated_at': 最新发布, 'stars': 最多点赞, 'views': 最多浏览, 'comments': 最多评论,
    :param sort: user:    'popular': 最活跃, 'followers': 关注最多, 'followings': 粉丝最多
    :param authorization:
    :return:
    """
    if page <= 0:
        raise HTTPException(detail={'msg': '页码错误.', 'code': comm.BUSINESS.PARAMS_ERROR},
                            status_code=status.HTTP_400_BAD_REQUEST)
    page_size = configs.PAGE_SIZE
    if category not in ['article', 'user']:
        raise HTTPException(detail={'msg': '查询条件错误.', 'code': comm.BUSINESS.PARAMS_ERROR},
                            status_code=status.HTTP_400_BAD_REQUEST)
    if category == 'article':
        if sort == 'stars':
            order_by = '-stars'
        elif sort == 'views':
            order_by = '-views'
        elif sort == 'comments':
            order_by = '-comment_count'
        else:
            order_by = '-updated_at'
        total_count = await Article.filter(status=3).filter(
            Q(title__icontains=keywords) | Q(desc__icontains=keywords) | Q(content__icontains=keywords)).count()
        # todo: 目前使用的 contains 方法进行匹配, 但是数据库存放的是富文本内容, 如此会出现一些冗余的信息, 比如 html 标签, 后期替换为 AI 搜索引擎
        articles = await PydanticPreviewArticle.from_queryset(
            Article.filter(status=3).filter(
                Q(title__icontains=keywords) | Q(desc__icontains=keywords) | Q(content__icontains=keywords)).order_by(
                order_by).offset((page - 1) * page_size).limit(page_size))
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
    else:
        uid = ''
        if authorization:
            token = authorization.split()
            if len(token) == 2 and token[0].lower() == 'bearer':
                uid = auth.decode_access_token(token[1])
        total_count = await User.filter(is_active=True).filter(
            Q(username__icontains=keywords) | Q(bio__icontains=keywords)).count()
        users = await PydanticUser.from_queryset(
            User.filter(is_active=True).filter(Q(username__icontains=keywords) | Q(bio__icontains=keywords)).offset(
                (page - 1) * page_size).limit(page_size))
        json_compatible_users: List[dict] = jsonable_encoder(users)
        results = []
        for json_compatible_user in json_compatible_users:
            user = await User.get(uid=json_compatible_user.get('uid'))
            await user.fetch_related('followings', 'followers', 'articles', 'timelines')
            is_followed = await user.followers.filter(uid=uid).first()
            results.append({
                **json_compatible_user,
                'followings': len(user.followings),
                'followers': len(user.followers),
                'articles': len(user.articles),
                'is_followed': bool(is_followed),
            })
        if sort == 'popular':
            results.sort(key=lambda x: x['followers'] + x['articles'], reverse=True)
        elif sort == 'followers':
            results.sort(key=lambda x: x['followers'], reverse=True)
        elif sort == 'followings':
            results.sort(key=lambda x: x['followings'], reverse=True)
    next_page = page + 1 if page * page_size < total_count else None
    previous_page = page - 1 if page > 1 else None
    return JSONResponse(
        content={
            'data': {
                'count': total_count,
                'next': next_page,
                'previous': previous_page,
                'results': results,
            },
            'msg': '查询成功.',
            'code': comm.BUSINESS.OK,
        },
        status_code=status.HTTP_200_OK)


@router.get('/recommend', summary='热门推荐', response_model=CommModel)
async def recommend():
    # todo: 目前通过 点赞 浏览 进行无差别推荐, 后期使用 AI 推荐算法
    results = []
    articles = await PydanticPreviewArticle.from_queryset(
        Article.filter(status=3).order_by('-stars', '-views').limit(3))
    json_compatible_articles: List[dict] = jsonable_encoder(articles)
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
    return JSONResponse(
        content={
            'data': results,
            'msg': '查询成功.',
            'code': comm.BUSINESS.OK,
        },
        status_code=status.HTTP_200_OK)
