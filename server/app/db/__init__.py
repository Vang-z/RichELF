import redis
from tortoise.contrib.fastapi import register_tortoise
from fastapi import FastAPI
from config import configs

MYSQL_USER = configs.MYSQL_USER
MYSQL_PASSWORD = configs.MYSQL_PASSWORD
MYSQL_HOST = configs.MYSQL_HOST
MYSQL_PORT = configs.MYSQL_PORT
MYSQL_DB_NAME = configs.MYSQL_DB_NAME
CHARSET = 'utf8mb4'
POOL_RECYCLE = 3600

REDIS_PASSWORD = configs.REDIS_PASSWORD
REDIS_HOST = configs.REDIS_HOST
REDIS_PORT = configs.REDIS_PORT
REDIS_DB_NAME = configs.REDIS_DB_NAME

MYSQL_CONFIG = {
    'engine': 'tortoise.backends.mysql',
    'credentials': {
        'host': MYSQL_HOST,
        'port': MYSQL_PORT,
        'user': MYSQL_USER,
        'password': MYSQL_PASSWORD,
        'database': MYSQL_DB_NAME,
        'charset': CHARSET,
        'pool_recycle': POOL_RECYCLE
    }
}

# Mysql 迁移配置
TORTOISE_ORM = {
    "connections": {
        'default': MYSQL_CONFIG
    },
    "apps": {
        "models": {
            "models": ["aerich.models", "app.db.models"],
            "default_connection": "default",
        },
    },
}


def init_db(app: FastAPI):
    register_tortoise(
        app,
        add_exception_handlers=True,
        config={
            'connections': {
                'default': MYSQL_CONFIG
            },
            'apps': {
                'models': {
                    'models': ['app.db.models'],
                    'default_connection': 'default',
                }
            },
            "use_tz": True,
            "timezone": "Asia/Shanghai",
        }
    )


# Redis 链接配置
pool = redis.ConnectionPool(
    host=REDIS_HOST,
    port=REDIS_PORT,
    password=REDIS_PASSWORD,
    db=REDIS_DB_NAME,
)
redis_session = redis.Redis(connection_pool=pool)
