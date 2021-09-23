from dotenv import dotenv_values
from pydantic import BaseSettings, Field
from typing import Optional
from functools import lru_cache


class Settings(BaseSettings):
    # 运行环境
    ENVIRONMENT: Optional[str] = Field(None, env='ENVIRONMENT')
    # API版本号
    API_V1_STR = "/api/v1"
    # token过期时间
    ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7

    # 加载.env文件的配置
    class Config:
        env_file = dotenv_values('.env').get('ENVIRONMENT')
        case_sensitive = True


class Config(Settings):
    # 服务配置
    HOST: Optional[str] = Field(None, env="HOST")
    PORT: Optional[str] = Field(None, env="PORT")
    DOMAIN: Optional[str] = Field(None, env="DOMAIN")
    STATIC_FILE_PATH: Optional[str] = Field(None, env="STATIC_FILE_PATH")

    # 基础配置
    PAGE_SIZE: Optional[int] = Field(None, env="PAGE_SIZE")

    # 系统秘钥
    SECRET_KEY: Optional[str] = Field(None, env="SECRET_KEY")
    # 加密算法
    ALGORITHM: Optional[str] = Field(None, env="ALGORITHM")

    # 邮箱配置
    EMAIL_HOST: Optional[str] = Field(None, env="EMAIL_HOST")
    EMAIL_PORT: Optional[str] = Field(None, env="EMAIL_PORT")
    EMAIL_HOST_USER: Optional[str] = Field(None, env="EMAIL_HOST_USER")
    EMAIL_HOST_PASSWORD: Optional[str] = Field(None, env="EMAIL_HOST_PASSWORD")

    # redis
    REDIS_HOST: Optional[str] = Field(None, env="REDIS_HOST")
    REDIS_PORT: Optional[int] = Field(None, env="REDIS_PORT")
    REDIS_USER: Optional[str] = Field(None, env="REDIS_USER")
    REDIS_PASSWORD: Optional[str] = Field(None, env="REDIS_PASSWORD")
    REDIS_DB_NAME: Optional[int] = Field(None, env="REDIS_DB_NAME")

    # Mysql
    MYSQL_HOST: Optional[str] = Field(None, env="MYSQL_HOST")
    MYSQL_PORT: Optional[int] = Field(None, env="MYSQL_PORT")
    MYSQL_USER: Optional[str] = Field(None, env="MYSQL_USER")
    MYSQL_PASSWORD: Optional[str] = Field(None, env="MYSQL_PASSWORD")
    MYSQL_DB_NAME: Optional[str] = Field(None, env="MYSQL_DB_NAME")


class FactoryConfig:
    def __init__(self, env_state: Optional[str]):
        self.env_state = env_state

    def __call__(self):
        return Config()


@lru_cache()
def get_configs():
    from dotenv import load_dotenv
    load_dotenv(encoding='utf-8')
    return FactoryConfig(Settings().ENVIRONMENT)()


configs = get_configs()

if __name__ == '__main__':
    print(configs)
