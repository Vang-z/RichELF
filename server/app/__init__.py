from fastapi import FastAPI
from config import configs
from app.middleware import init_middleware
from app.routers import init_router
from app.db import init_db


def init_app() -> FastAPI:
    app = FastAPI(
        title="RichELF_API",
        description="RichELF接口文档",
        version="0.1.0",
    )

    # 加载配置, 生产环境关闭 swagger 文档、debug 模式
    if configs.ENVIRONMENT == '.env.prod':
        app.docs_url = None
        app.redoc_url = None
        app.debug = False

    # 初始化中间件
    init_middleware(app)

    # 初始化路由
    init_router(app)

    # 初始化数据库
    init_db(app)

    return app
