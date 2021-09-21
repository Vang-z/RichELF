from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from .user import router as user_router
from .article import router as article_router
# from .dataset import router as dataset_router
from .comment import router as comment_router
from .timeline import router as timeline_router
from .search import router as search_router
from .file import router as file_router
from config import configs


def init_router(app: FastAPI):
    app.mount("/static", StaticFiles(directory="static"), name="static")
    app.include_router(
        router=user_router,
        tags=["用户api_v1"],
        prefix=configs.API_V1_STR,
    )
    app.include_router(
        router=article_router,
        tags=["文章api_v1"],
        prefix=configs.API_V1_STR,
    )
    app.include_router(
        router=comment_router,
        tags=["评论api_v1"],
        prefix=configs.API_V1_STR,
    )
    app.include_router(
        router=timeline_router,
        tags=["时间线api_v1"],
        prefix=configs.API_V1_STR,
    )
    app.include_router(
        router=search_router,
        tags=["搜索api_v1"],
        prefix=configs.API_V1_STR,
    )
    app.include_router(
        router=file_router,
        tags=["文件api_v1"],
        prefix=configs.API_V1_STR,
    )
