from fastapi import APIRouter, status, HTTPException
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from app.db.models import PydanticTimeline, User
from app.utils import comm
from app.schemas.timeline import TimelinePaginationModel
from config import configs

router = APIRouter()


@router.get('/timeline/{username}', summary='获取用户时间线', response_model=TimelinePaginationModel)
async def user_timeline(username: str, page: int):
    if page <= 0:
        raise HTTPException(detail={'msg': '页码错误.', 'code': comm.BUSINESS.PARAMS_ERROR},
                            status_code=status.HTTP_400_BAD_REQUEST)
    page_size = configs.PAGE_SIZE
    user = await User.filter(username=username).first()
    if user:
        await user.fetch_related('timelines')
        total_count = await user.timelines.all().count()
        timelines = user.timelines.offset((page - 1) * page_size).limit(page_size)
        json_compatible_timelines: list = jsonable_encoder(await PydanticTimeline.from_queryset(timelines))
        # tortoise 官方没有明确例子, 源码也没有给出详细说明, 不能通过 fetch_related 直接得到时间线的外键数据, 所以自己造轮子, 若有更好的方法欢迎补充
        results = []
        for index, value in enumerate(json_compatible_timelines):
            user = await (await timelines)[index].user
            article = await (await timelines)[index].article
            file = await (await timelines)[index].file
            obj = f'user$_${user.username}' if user else f'article$_${file.filename}$_${article.aid}' if file else f'article$_${article.title}$_${article.aid}' if article else None
            results.append({
                **value,
                'obj': obj
            })
        return JSONResponse(
            content={
                'data': {
                    'count': total_count,
                    'next': page + 1 if page * page_size < total_count else None,
                    'previous': page - 1 if page > 1 else None,
                    'results': results,
                },
                'code': comm.BUSINESS.OK,
            },
            status_code=status.HTTP_200_OK)
    raise HTTPException(detail={'msg': '用户不存在.', 'code': comm.BUSINESS.NOT_EXIST},
                        status_code=status.HTTP_400_BAD_REQUEST)
