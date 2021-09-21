from fastapi import APIRouter, Depends, Form, HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from app.db.models import User, PydanticUser, Comment, PydanticComment, Timeline, Article
from app.utils import auth, comm
from app.schemas import CommModel

router = APIRouter()


@router.post('/comment', summary='发布评论', response_model=CommModel)
async def create_comment(aid: str = Form(default=None), cid: str = Form(default=None),
                         content: str = Form(...), uid: str = Depends(auth.validate_access_token)):
    if bool(aid) + bool(cid) != 1:
        raise HTTPException(detail={'msg': '参数错误.', 'code': comm.BUSINESS.PARAMS_ERROR},
                            status_code=status.HTTP_400_BAD_REQUEST)
    user = await User.get(uid=uid)
    comment = await Comment.create(content=content, article_id=aid, comment_id=cid, author_id=user.uid)
    if aid:
        article = await Article.filter(aid=aid).first()
    else:
        raw_cid = cid
        while raw_cid:
            root_cid = raw_cid
            raw_comment = await Comment.filter(cid=raw_cid).first()
            raw_cid = await raw_comment.comment
        root_comment = await Comment.filter(cid=root_cid).first()
        article = await root_comment.article
    if article:
        article.comment_count += 1
        await article.save()
    json_compatible_comment: dict = jsonable_encoder(await PydanticComment.from_tortoise_orm(comment))
    await Timeline.create(creator_id=uid, action=6, article_id=article.aid)
    return JSONResponse(content={'data': {
        **json_compatible_comment,
        'uid': uid
    }, 'msg': '评论成功.', 'code': comm.BUSINESS.OK},
        status_code=status.HTTP_201_CREATED)


# 使用递归查询所有的嵌套评论, 不推荐使用该方法, 该方法可能会出现各种内存问题, 但为了简化代码本站使用了递归查询, 建议将递归改为循环
async def generate_nest_comments(comment: Comment) -> list:
    comments = []
    await comment.fetch_related('comments')
    raw_comments = comment.comments
    if not raw_comments:
        return []
    for comment in raw_comments:
        nest_comments = await generate_nest_comments(comment)
        author = jsonable_encoder(await PydanticUser.from_tortoise_orm(await comment.author))
        comments.append({
            **jsonable_encoder(await PydanticComment.from_tortoise_orm(comment)),
            'author': {
                'username': author.get('username'),
                'avatar': author.get('avatar_url'),
            },
            'comments': nest_comments
        })
    return comments
