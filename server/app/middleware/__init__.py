from starlette.middleware.cors import CORSMiddleware
from fastapi import FastAPI

# 指定允许跨域请求的url
origins = ["*"]


def init_middleware(app: FastAPI):
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
