from passlib.context import CryptContext
from config import configs
from datetime import datetime, timedelta
from jose import JWTError, jwt
from fastapi import HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer
from base64 import b64encode, b64decode
from time import time
from app.utils.comm import BUSINESS
import random

SECRET_KEY = configs.SECRET_KEY
ALGORITHM = configs.ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES = configs.ACCESS_TOKEN_EXPIRE_MINUTES

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{configs.API_V1_STR}/token")


def generate_username() -> str:
    timestamp = ''.join(str(time()).split('.'))
    return f'用户{timestamp[1:]}'


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def generate_password_hash(password):
    if len(password) >= 6:
        return pwd_context.hash(password)
    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail={'msg': '密码无效, 请重新输入密码.', 'code': BUSINESS.PASSWORD_ERROR},
    )


def generate_empty_password_hash():
    return pwd_context.hash('')


def generate_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def validate_access_token(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail={'msg': 'token 无效, 请重新授权.', 'code': BUSINESS.INVALID_TOKEN},
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        # 该处存在潜在隐患, 若用户拥有一个合法 jwt 但数据库删除了该 jwt 对应的用户数据后依旧能够通过校验, 目前暂不解决
        # 需要校验请自行使用 User.get 判定该 uid 是否存在于数据库中
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        uid: str = payload.get("uid")
        if uid is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    return uid


def decode_access_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        uid: str = payload.get("uid")
        create_at: str = payload.get("create_at")
        if uid is None or create_at is None:
            return ''
    except JWTError:
        return ''
    return uid


def base64encode(value: str) -> str:
    return b64encode(value.encode('utf-8')).decode()


def base64decode(value: str) -> str:
    try:
        return b64decode(value.encode('utf-8')).decode()
    except:
        return ''


def generate_code() -> str:
    chars = [
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i',
        'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B',
        'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U',
        'V', 'W', 'X', 'Y', 'Z'
    ]
    return ''.join(random.choices(chars, k=6))


if __name__ == '__main__':
    pwd = '7bnex2'
    pwd_hash = '$2b$12$kFb4f1dUTvIrvS2FVRvKc.NKgwSFZHmL3Mpwa88n.0Z677T3Ro4b2'
    print(generate_empty_password_hash())
    print(verify_password(pwd, generate_empty_password_hash()))
    print(base64encode(pwd))
    print(base64decode('d3poMDkyOCE='))
    print(base64decode('MTIzNDU2'))
    print(base64decode(''))
