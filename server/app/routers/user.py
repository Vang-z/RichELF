from fastapi import APIRouter, status, Form, HTTPException, Depends, Query, Header
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from tortoise.models import Q
from tortoise.queryset import Count
from app.db import redis_session
from app.db.models import User, PydanticUser, Article, PydanticPreviewArticle, Timeline
from app.utils import auth, mail, comm
from app.schemas import CommModel
from app.schemas.user import TokenModel
from app.schemas import PaginationModel
from typing import Optional, List
from pydantic import EmailStr, HttpUrl
from uuid import uuid4
from datetime import datetime
import pickle
from config import configs

router = APIRouter()


@router.get('/user', summary='用户展示列表', response_model=CommModel)
async def user_list(size: str):
    users = jsonable_encoder(await PydanticUser.from_queryset(
        User.all().annotate(timelines_count=Count('timelines')).order_by('timelines_count')))
    if size.lower() == 'medium':
        results = [user.get('avatar_url') for user in users[:12]]
        total = len(users) - 12
    else:
        results = [user.get('avatar_url') for user in users[:3]]
        total = len(users) - 3
    total = f'{str(total // 1000)}k' if total > 1000 else str(total) if total > 0 else ''
    return JSONResponse(
        content={
            'data': {
                'total': total,
                'results': results
            },
            'msg': '查询成功.',
            'code': comm.BUSINESS.OK
        },
        status_code=status.HTTP_200_OK
    )


@router.post('/user', summary='注册账号', response_model=TokenModel)
async def register(email: EmailStr = Form(...), password: str = Form(..., min_length=6)):
    redis_user = redis_session.get(f'register_user_{email}')
    if redis_user:
        raise HTTPException(detail={'msg': '该账号已注册, 但尚未激活, 请直接激活此账号.', 'code': comm.BUSINESS.ACCOUNT_EXISTED},
                            status_code=status.HTTP_400_BAD_REQUEST)
    password_hash = auth.generate_password_hash(auth.base64decode(password))
    user = await User.filter(email=email).first()
    if user:
        raise HTTPException(detail={'msg': '该账号已注册, 请直接登陆.', 'code': comm.BUSINESS.ACCOUNT_EXISTED},
                            status_code=status.HTTP_400_BAD_REQUEST)
    user_dict = {
        'uid': uuid4(),
        'avatar': 'static/uploads/users/default_avatar.png',
        'email': email,
        'username': auth.generate_username(),
        'password': password_hash
    }
    json_compatible_user: dict = jsonable_encoder(user_dict)
    subject = '欢迎加入RichELF'
    key = auth.base64encode(json_compatible_user.get('email'))
    # 请勿格式化换行 content, 如必须格式化 请用 \ 连接, 确保文本中没有多余的换行符
    content = f"""<table role="presentation" style="box-shadow: 1px 1px 6px #ddd; width: 100%; max-width: 600px; margin-left: auto; margin-right: auto; padding-left: 20px; padding-right: 20px; color: #333332; line-height: 1.4"><tbody><tr><td style="position: absolute;"><svg><g transform="matrix(1.2,0,0,1.2,0,10)" fill="#000"><path d="M4.2773 40 q-0.80078125 0 -1.3671875 -0.56640625 t-0.56641 -1.3672 l0 -12.07 q0 -0.80078125 0.56640625 -1.376953125 t1.3672 -0.57617 l10.469 0 q1.9140625 0 3.0078125 -1.2109375 q1.015625 -1.23046875 1.015625 -2.87109375 q0 -0.76171875 -0.3515625 -1.728515625 t-1.2207 -1.6699 t-2.4512 -0.70313 q-0.80078125 0 -1.3671875 -0.56640625 t-0.56641 -1.3672 t0.56641 -1.3672 t1.3672 -0.56641 q2.578125 0 4.3359375 1.162109375 t2.6563 2.9883 t0.89844 3.8184 q0 3.06640625 -1.97265625 5.4296875 q-0.5078125 0.5859375 -1.30859375 1.162109375 t-1.9434 0.97656 t-2.666 0.40039 l-8.5156 0 l0 10.137 q0 0.80078125 -0.576171875 1.3671875 t-1.377 0.56641 z M20.684 40 q-1.07421875 0 -1.73828125 -1.09375 l-2.5586 -5.1758 q-0.1953125 -0.44921875 -0.1953125 -0.87890625 q0 -1.15234375 1.07421875 -1.71875 q0.4296875 -0.1953125 0.87890625 -0.1953125 q1.171875 0 1.73828125 1.09375 l2.5391 5.1758 q0.1953125 0.44921875 0.1953125 0.87890625 q0 1.15234375 -1.07421875 1.71875 q-0.4296875 0.1953125 -0.859375 0.1953125 z M28.08589375 40 q0.80078125 0 1.3671875 -0.56640625 t0.56641 -1.3672 l0 -24.141 q0 -0.80078125 -0.56640625 -1.3671875 t-1.3672 -0.56641 t-1.3672 0.56641 t-0.56641 1.3672 l0 24.141 q0 0.80078125 0.56640625 1.3671875 t1.3672 0.56641 z M48.32028125 40 q3.73046875 0 7.0703125 -1.9140625 q3.14453125 -1.875 5.01953125 -5 q0.25390625 -0.46875 0.25390625 -0.9765625 q0 -1.07421875 -0.9375 -1.6796875 q-0.48828125 -0.25390625 -0.9765625 -0.25390625 q-1.09375 0 -1.69921875 0.95703125 q-1.38671875 2.32421875 -3.720703125 3.65234375 t-5.0098 1.3281 q-2.79296875 0 -5.087890625 -1.3671875 t-3.6719 -3.6621 t-1.377 -5.0879 q0 -2.8125 1.376953125 -5.107421875 t3.6719 -3.6719 t5.0879 -1.377 q0.8203125 0 1.62109375 0.15625 l0.29297 0.019531 q0.64453125 0 1.2109375 -0.41015625 q0.7421875 -0.52734375 0.7421875 -1.5234375 q0 -0.625 -0.41015625 -1.201171875 t-1.2109 -0.71289 q-1.11328125 -0.1953125 -2.24609375 -0.1953125 q-3.84765625 0 -7.03125 1.904296875 t-5.0781 5.0781 t-1.8945 7.041 q0 3.84765625 1.89453125 7.03125 t5.0781 5.0781 t7.0313 1.8945 z M66.8944875 40 q-0.80078125 0 -1.3671875 -0.56640625 t-0.56641 -1.3672 l0 -24.141 q0 -0.80078125 0.56640625 -1.3671875 t1.3672 -0.56641 t1.3672 0.56641 t0.56641 1.3672 l0 24.141 q0 0.80078125 -0.56640625 1.3671875 t-1.3672 0.56641 z M85.0971875 40 q-0.80078125 0 -1.3671875 -0.56640625 t-0.56641 -1.3672 l0 -24.141 q0 -0.80078125 0.56640625 -1.3671875 t1.3672 -0.56641 t1.3672 0.56641 t0.56641 1.3672 l0 24.141 q0 0.80078125 -0.56640625 1.3671875 t-1.3672 0.56641 z M75.8591875 27.93 q-0.8203125 0 -1.38671875 -0.56640625 t-0.56641 -1.3672 t0.56641 -1.377 t1.3867 -0.57617 q0.80078125 0 1.3671875 0.576171875 t0.56641 1.377 t-0.56641 1.3672 t-1.3672 0.56641 z M109.063 40 l-15.41 0 q-0.80078125 0 -1.3671875 -0.56640625 t-0.56641 -1.3672 q0 -0.8203125 0.56640625 -1.38671875 t1.3672 -0.56641 l15.41 0 q0.80078125 0 1.3671875 0.56640625 t0.56641 1.3867 q0 0.80078125 -0.56640625 1.3671875 t-1.3672 0.56641 z M109.063 15.859000000000002 l-15.41 0 q-0.80078125 0 -1.3671875 -0.56640625 t-0.56641 -1.3672 t0.56641 -1.3672 t1.3672 -0.56641 l15.41 0 q0.80078125 0 1.3671875 0.56640625 t0.56641 1.3672 t-0.56641 1.3672 t-1.3672 0.56641 z M109.063 27.93 l-15.41 0 q-0.80078125 0 -1.3671875 -0.56640625 t-0.56641 -1.3672 t0.56641 -1.377 t1.3672 -0.57617 l15.41 0 q0.80078125 0 1.3671875 0.576171875 t0.56641 1.377 t-0.56641 1.3672 t-1.3672 0.56641 z M131.13290625 40 q0.80078125 0 1.3671875 -0.56640625 t0.56641 -1.3672 q0 -0.8203125 -0.56640625 -1.38671875 t-1.3672 -0.56641 l-7.8906 0 q-4.43359375 0 -4.47265625 -6.38671875 l0 -15.801 q0 -0.80078125 -0.56640625 -1.3671875 t-1.3672 -0.56641 t-1.3672 0.56641 t-0.56641 1.3672 l0 15.801 q0 4.296875 1.81640625 6.97265625 q2.32421875 3.30078125 6.5234375 3.30078125 l7.8906 0 z M154.90284375 15.859000000000002 l-15.41 0 q-0.80078125 0 -1.3671875 -0.56640625 t-0.56641 -1.3672 t0.56641 -1.3672 t1.3672 -0.56641 l15.41 0 q0.80078125 0 1.3671875 0.56640625 t0.56641 1.3672 t-0.56641 1.3672 t-1.3672 0.56641 z M139.49214375 40 q-0.80078125 0 -1.3671875 -0.56640625 t-0.56641 -1.3672 l0 -12.07 q0 -0.80078125 0.56640625 -1.376953125 t1.3672 -0.57617 l15.41 0 q0.80078125 0 1.3671875 0.576171875 t0.56641 1.377 t-0.56641 1.3672 t-1.3672 0.56641 l-13.457 0 l0 10.137 q0 0.80078125 -0.56640625 1.3671875 t-1.3867 0.56641 z"></path></g></svg></td></tr><tr><td style="min-width: 100%; width: 100%; padding: 84px 12px 6px"><div><p style="margin-top: 0; margin-bottom: 20px;"><small>感谢您的认可加入 RichELF, 请点击下方按钮完成激活.</small></p><p style="margin-top: 0; margin-bottom: 20px;"><small>请在 2 小时内完成激活, 否则本次注册是无效的, 您需要重新注册.</small></p><p style="margin-top: 0; margin-bottom: 20px; text-align: center;"><a href="{configs.DOMAIN}/user/activation/{key}" style="color: #ffffff; text-decoration: none; display: inline-block; position: relative; height: 38px; line-height: 38px; padding: 0 24px;border: 0; outline: 0; background-color: #13a7e5; font-size: 14px; font-style: normal; font-weight: 400; text-align: center; cursor: pointer; white-space: nowrap; text-rendering: optimizeLegibility; -webkit-font-smoothing: antialiased; user-select: none; border-radius: 99em;" rel="noopener">激&nbsp;&nbsp;&nbsp;&nbsp;活</a></p><div style="font-size: 14px;"><small>如果按钮不起作用, 请将下方链接复制到浏览器打开:</small><p style="margin-top: 0; margin-bottom: 20px;"><a href="{configs.DOMAIN}/user/activation/{key}" style="color: #333332; text-decoration: underline;" rel="noopener" target="_blank"><small>{configs.DOMAIN}/user/activation/{key}</small></a></p></div><div style="font-size: 14px; text-align: end;"><small>此致</small><p style="margin-bottom: 0"><a href="https://richelf.tech" style="color: unset; text-decoration: none;" rel="noopener" target="_blank"><small>RichELF</small></a></p></div><div style="color: #b3b3b1; font-size: 14px; margin: 24px 0 0; text-align: center;"><small>如果您从未发起过注册请求, 请放心忽略本邮件, 对您带来的不便请谅解.</small></div></div></td></tr></tbody></table>"""
    result = await mail.send_email(email=email, subject=subject, content=content)
    if not result:
        raise HTTPException(detail={'msg': '邮件系统异常, 无法发送邮件, 请稍后重试.', 'code': comm.BUSINESS.CODE_SEND_ERROR},
                            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)
    redis_session.setex(name=f'register_user_{json_compatible_user.get("email")}', time=60 * 60 * 2,
                        value=pickle.dumps(json_compatible_user))
    del json_compatible_user['password']
    del json_compatible_user['avatar']
    return JSONResponse(
        content={
            'access_token': auth.generate_access_token({
                **json_compatible_user,
                'bio': None,
                'link': None,
                'create_at': None,
                'is_staff': False,
                'is_superuser': False,
                'avatar_url': f'{configs.DOMAIN}/static/uploads/users/default_avatar.png',
                'mobile_hash': ''
            }),
            'token_type': 'bearer'
        },
        status_code=status.HTTP_201_CREATED
    )


@router.put('/token/activation/{key}', summary='激活账号', response_model=TokenModel)
async def activate(key: str):
    email = auth.base64decode(key)
    user = await User.filter(email=email).first()
    if user:
        raise HTTPException(detail={'msg': '该账号已注册, 请直接登陆此账号.', 'code': comm.BUSINESS.ACCOUNT_EXISTED},
                            status_code=status.HTTP_400_BAD_REQUEST)
    redis_user = redis_session.get(f'register_user_{email}')
    if not redis_user:
        raise HTTPException(detail={'msg': '该账号不存在, 请重新注册.', 'code': comm.BUSINESS.NOT_EXIST},
                            status_code=status.HTTP_400_BAD_REQUEST)
    user = await User.create(**pickle.loads(redis_user))
    await Timeline.create(creator_id=user.uid, action=0)
    redis_session.delete(f'register_user_{email}')
    json_compatible_user: dict = jsonable_encoder(await PydanticUser.from_queryset_single(User.get(email=email)))
    return JSONResponse(
        content={
            'access_token': auth.generate_access_token({**json_compatible_user}),
            'token_type': 'bearer'
        },
        status_code=status.HTTP_200_OK)


@router.post('/token', summary='登陆账号, 获取token', response_model=TokenModel)
async def login(username: EmailStr = Form(...), password: str = Form(..., min_length=6)):
    """
    :param username: 若要使用 Swagger UI 的 OAuth2 功能, 则改参数名称必须为 username
    :param password: 若要使用 Swagger UI 的 OAuth2 功能, 则改参数名称必须为 password
    此处可以使用 from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordRequestFormStrict 中的两种 form 表单进行参数接受 username = form.username, password = form.password
    :return:
    """
    email = username
    password = auth.base64decode(password)
    redis_user = redis_session.get(f'register_user_{email}')
    if redis_user:
        user = pickle.loads(redis_user)
        json_compatible_user: dict = jsonable_encoder(user)
        if not auth.verify_password(password, json_compatible_user.get('password')):
            raise HTTPException(detail={'msg': '账户或密码错误, 请重试.', 'code': comm.BUSINESS.USERNAME_OR_PASSWORD_ERROR},
                                status_code=status.HTTP_400_BAD_REQUEST)
        del json_compatible_user['password']
        return JSONResponse(
            content={
                'access_token': auth.generate_access_token({
                    **json_compatible_user,
                    "mobile": None,
                    "join_date": None,
                    "is_staff": False,
                    "is_superuser": False}),
                'token_type': 'bearer',
            },
            status_code=status.HTTP_200_OK)
    user = await User.filter(email=email).first()
    if user:
        password_hash = user.password
        json_compatible_user: dict = jsonable_encoder(await PydanticUser.from_tortoise_orm(user))
        if not auth.verify_password(password, password_hash):
            raise HTTPException(detail={'msg': '账户或密码错误, 请重试.', 'code': comm.BUSINESS.USERNAME_OR_PASSWORD_ERROR},
                                status_code=status.HTTP_400_BAD_REQUEST)
        return JSONResponse(
            content={
                'access_token': auth.generate_access_token({**json_compatible_user}),
                'token_type': 'bearer',
            },
            status_code=status.HTTP_200_OK)
    raise HTTPException(detail={'msg': '该账号不存在, 请重新注册.', 'code': comm.BUSINESS.NOT_EXIST},
                        status_code=status.HTTP_400_BAD_REQUEST)


@router.put('/user', summary='修改个人信息', response_model=TokenModel)
async def update_user_info(username: str = Form(...), avatar: HttpUrl = Form(...),
                           bio: str = Form(default='', max_length=255), link: str = Form(default=''),
                           uid: str = Depends(auth.validate_access_token)):
    avatar_path = '/'.join(avatar.split('/')[3:])
    if not avatar_path.startswith('static/uploads/users/'):
        raise HTTPException(detail={'msg': '非法操作, 阻断请求.', 'code': comm.BUSINESS.ILLEGAL_OPERATION},
                            status_code=status.HTTP_423_LOCKED)
    await User.filter(uid=uid).update(username=username, avatar=avatar_path, bio=bio, link=link)
    json_compatible_user: dict = jsonable_encoder(await PydanticUser.from_queryset_single(User.get(uid=uid)))
    return JSONResponse(
        content={
            'access_token': auth.generate_access_token({**json_compatible_user}),
            'token_type': 'bearer',
        },
        status_code=status.HTTP_200_OK)


@router.get('/user/{username}', summary='查询个人信息', response_model=CommModel)
async def get_user_info(username: str, authorization: Optional[str] = Header(None)):
    uid = ''
    if authorization:
        token = authorization.split()
        if len(token) == 2 and token[0].lower() == 'bearer':
            uid = auth.decode_access_token(token[1])
    user = await User.filter(username=username).first()
    if user:
        await user.fetch_related('followings', 'followers', 'articles')
        is_followed = await user.followers.filter(uid=uid).first()
        json_compatible_user: dict = jsonable_encoder(await PydanticUser.from_tortoise_orm(user))
        return JSONResponse(content={
            'data': {
                **json_compatible_user,
                'articles': len(await user.articles.filter(status=3)),
                'followings': len(user.followings),
                'followers': len(user.followers),
                'is_followed': bool(is_followed),
            }, 'msg': '查询成功.', 'code': comm.BUSINESS.OK}, status_code=status.HTTP_200_OK)
    raise HTTPException(detail={'msg': '用户不存在.', 'code': comm.BUSINESS.NOT_EXIST},
                        status_code=status.HTTP_400_BAD_REQUEST)


@router.put('/user/password', summary='修改密码', response_model=TokenModel)
async def update_password(password: str = Form(default='', description='未设置密码时留空'), new_password: str = Form(...),
                          uid: str = Depends(auth.validate_access_token)):
    password = auth.base64decode(password)
    new_password = auth.base64decode(new_password)
    user = await User.filter(uid=uid).first()
    if not auth.verify_password(password, user.password):
        raise HTTPException(detail={'msg': '密码验证失败, 请重试.', 'code': comm.BUSINESS.PASSWORD_ERROR},
                            status_code=status.HTTP_400_BAD_REQUEST)
    password_hash = auth.generate_password_hash(new_password)
    await User.filter(uid=uid).update(password=password_hash)
    json_compatible_user: dict = jsonable_encoder(await PydanticUser.from_queryset_single(User.get(uid=uid)))
    return JSONResponse(
        content={
            'access_token': auth.generate_access_token({**json_compatible_user}),
            'token_type': 'bearer',
        },
        status_code=status.HTTP_200_OK)


@router.put('/user/email', summary='修改 / 绑定 邮箱', response_model=TokenModel)
async def update_email(password: str = Form(default='', description='未设置密码时留空'), email: EmailStr = Form(...),
                       code: str = Form(default='', description='留空发送验证码'),
                       uid: str = Depends(auth.validate_access_token)):
    password = auth.base64decode(password)
    user = await User.filter(uid=uid).first()
    if not auth.verify_password(password, user.password):
        raise HTTPException(detail={'msg': '密码验证失败, 请重试.', 'code': comm.BUSINESS.PASSWORD_ERROR},
                            status_code=status.HTTP_400_BAD_REQUEST)
    if await User.filter(email=email).first():
        raise HTTPException(detail={'msg': '当前邮箱已注册, 请更换其他邮箱进行绑定.', 'code': comm.BUSINESS.PASSWORD_ERROR},
                            status_code=status.HTTP_400_BAD_REQUEST)
    code = auth.base64decode(code).lower()
    if not code:
        # 发送验证码
        code = auth.generate_code()
        subject = 'RichELF'
        content = f"""<table role="presentation" style="box-shadow: 1px 1px 6px #ddd; width: 100%; max-width: 600px; margin-left: auto; margin-right: auto; padding-left: 20px; padding-right: 20px; color: #333332; line-height: 1.4"><tbody><tr><td style="position: absolute;"><svg><g transform="matrix(1.2,0,0,1.2,0,10)" fill="#000"><path d="M4.2773 40 q-0.80078125 0 -1.3671875 -0.56640625 t-0.56641 -1.3672 l0 -12.07 q0 -0.80078125 0.56640625 -1.376953125 t1.3672 -0.57617 l10.469 0 q1.9140625 0 3.0078125 -1.2109375 q1.015625 -1.23046875 1.015625 -2.87109375 q0 -0.76171875 -0.3515625 -1.728515625 t-1.2207 -1.6699 t-2.4512 -0.70313 q-0.80078125 0 -1.3671875 -0.56640625 t-0.56641 -1.3672 t0.56641 -1.3672 t1.3672 -0.56641 q2.578125 0 4.3359375 1.162109375 t2.6563 2.9883 t0.89844 3.8184 q0 3.06640625 -1.97265625 5.4296875 q-0.5078125 0.5859375 -1.30859375 1.162109375 t-1.9434 0.97656 t-2.666 0.40039 l-8.5156 0 l0 10.137 q0 0.80078125 -0.576171875 1.3671875 t-1.377 0.56641 z M20.684 40 q-1.07421875 0 -1.73828125 -1.09375 l-2.5586 -5.1758 q-0.1953125 -0.44921875 -0.1953125 -0.87890625 q0 -1.15234375 1.07421875 -1.71875 q0.4296875 -0.1953125 0.87890625 -0.1953125 q1.171875 0 1.73828125 1.09375 l2.5391 5.1758 q0.1953125 0.44921875 0.1953125 0.87890625 q0 1.15234375 -1.07421875 1.71875 q-0.4296875 0.1953125 -0.859375 0.1953125 z M28.08589375 40 q0.80078125 0 1.3671875 -0.56640625 t0.56641 -1.3672 l0 -24.141 q0 -0.80078125 -0.56640625 -1.3671875 t-1.3672 -0.56641 t-1.3672 0.56641 t-0.56641 1.3672 l0 24.141 q0 0.80078125 0.56640625 1.3671875 t1.3672 0.56641 z M48.32028125 40 q3.73046875 0 7.0703125 -1.9140625 q3.14453125 -1.875 5.01953125 -5 q0.25390625 -0.46875 0.25390625 -0.9765625 q0 -1.07421875 -0.9375 -1.6796875 q-0.48828125 -0.25390625 -0.9765625 -0.25390625 q-1.09375 0 -1.69921875 0.95703125 q-1.38671875 2.32421875 -3.720703125 3.65234375 t-5.0098 1.3281 q-2.79296875 0 -5.087890625 -1.3671875 t-3.6719 -3.6621 t-1.377 -5.0879 q0 -2.8125 1.376953125 -5.107421875 t3.6719 -3.6719 t5.0879 -1.377 q0.8203125 0 1.62109375 0.15625 l0.29297 0.019531 q0.64453125 0 1.2109375 -0.41015625 q0.7421875 -0.52734375 0.7421875 -1.5234375 q0 -0.625 -0.41015625 -1.201171875 t-1.2109 -0.71289 q-1.11328125 -0.1953125 -2.24609375 -0.1953125 q-3.84765625 0 -7.03125 1.904296875 t-5.0781 5.0781 t-1.8945 7.041 q0 3.84765625 1.89453125 7.03125 t5.0781 5.0781 t7.0313 1.8945 z M66.8944875 40 q-0.80078125 0 -1.3671875 -0.56640625 t-0.56641 -1.3672 l0 -24.141 q0 -0.80078125 0.56640625 -1.3671875 t1.3672 -0.56641 t1.3672 0.56641 t0.56641 1.3672 l0 24.141 q0 0.80078125 -0.56640625 1.3671875 t-1.3672 0.56641 z M85.0971875 40 q-0.80078125 0 -1.3671875 -0.56640625 t-0.56641 -1.3672 l0 -24.141 q0 -0.80078125 0.56640625 -1.3671875 t1.3672 -0.56641 t1.3672 0.56641 t0.56641 1.3672 l0 24.141 q0 0.80078125 -0.56640625 1.3671875 t-1.3672 0.56641 z M75.8591875 27.93 q-0.8203125 0 -1.38671875 -0.56640625 t-0.56641 -1.3672 t0.56641 -1.377 t1.3867 -0.57617 q0.80078125 0 1.3671875 0.576171875 t0.56641 1.377 t-0.56641 1.3672 t-1.3672 0.56641 z M109.063 40 l-15.41 0 q-0.80078125 0 -1.3671875 -0.56640625 t-0.56641 -1.3672 q0 -0.8203125 0.56640625 -1.38671875 t1.3672 -0.56641 l15.41 0 q0.80078125 0 1.3671875 0.56640625 t0.56641 1.3867 q0 0.80078125 -0.56640625 1.3671875 t-1.3672 0.56641 z M109.063 15.859000000000002 l-15.41 0 q-0.80078125 0 -1.3671875 -0.56640625 t-0.56641 -1.3672 t0.56641 -1.3672 t1.3672 -0.56641 l15.41 0 q0.80078125 0 1.3671875 0.56640625 t0.56641 1.3672 t-0.56641 1.3672 t-1.3672 0.56641 z M109.063 27.93 l-15.41 0 q-0.80078125 0 -1.3671875 -0.56640625 t-0.56641 -1.3672 t0.56641 -1.377 t1.3672 -0.57617 l15.41 0 q0.80078125 0 1.3671875 0.576171875 t0.56641 1.377 t-0.56641 1.3672 t-1.3672 0.56641 z M131.13290625 40 q0.80078125 0 1.3671875 -0.56640625 t0.56641 -1.3672 q0 -0.8203125 -0.56640625 -1.38671875 t-1.3672 -0.56641 l-7.8906 0 q-4.43359375 0 -4.47265625 -6.38671875 l0 -15.801 q0 -0.80078125 -0.56640625 -1.3671875 t-1.3672 -0.56641 t-1.3672 0.56641 t-0.56641 1.3672 l0 15.801 q0 4.296875 1.81640625 6.97265625 q2.32421875 3.30078125 6.5234375 3.30078125 l7.8906 0 z M154.90284375 15.859000000000002 l-15.41 0 q-0.80078125 0 -1.3671875 -0.56640625 t-0.56641 -1.3672 t0.56641 -1.3672 t1.3672 -0.56641 l15.41 0 q0.80078125 0 1.3671875 0.56640625 t0.56641 1.3672 t-0.56641 1.3672 t-1.3672 0.56641 z M139.49214375 40 q-0.80078125 0 -1.3671875 -0.56640625 t-0.56641 -1.3672 l0 -12.07 q0 -0.80078125 0.56640625 -1.376953125 t1.3672 -0.57617 l15.41 0 q0.80078125 0 1.3671875 0.576171875 t0.56641 1.377 t-0.56641 1.3672 t-1.3672 0.56641 l-13.457 0 l0 10.137 q0 0.80078125 -0.56640625 1.3671875 t-1.3867 0.56641 z"></path></g></svg></td></tr><tr><td style="min-width: 100%; width: 100%; padding: 84px 12px 6px"><div><p style="margin-top: 0; margin-bottom: 20px;"><small>尊敬的 用户 您好, 您申请的邮箱验证码是: </small></p><p style="margin-top: 0; margin-bottom: 20px; text-align: center;"><a href="#" style="letter-spacing: 6px; color: #ffffff; text-decoration: none; display: inline-block; position: relative; height: 38px; line-height: 38px; padding: 0 12px;border: 0; outline: 0; background-color: #13a7e5; font-size: 24px; font-style: normal; font-weight: 600; text-align: center; cursor: pointer; white-space: nowrap; text-rendering: optimizeLegibility; -webkit-font-smoothing: antialiased; user-select: none; border-radius: 5px;" rel="noopener">{code}</a></p><div style="font-size: 14px;"><p style="margin-top: 0; margin-bottom: 20px;"><small>请在 15 分钟内使用验证码, 否则验证码将过期.</small></p><div style="font-size: 14px; text-align: end;"><small>此致</small><p style="margin-bottom: 0"><a href="{configs.DOMAIN}" style="color: unset; text-decoration: none;" rel="noopener" target="_blank"><small>RichELF</small></a></p></div><div style="color: #b3b3b1; font-size: 14px; margin: 24px 0 0; text-align: center;"><small>如果您从未发起过注册请求, 请放心忽略本邮件, 对您带来的不便请谅解.</small></div></div></div></td></tr></tbody></table>"""
        result = await mail.send_email(email=email, subject=subject, content=content)
        if not result:
            raise HTTPException(detail={'msg': '邮件系统异常, 无法发送邮件, 请稍后重试.', 'code': comm.BUSINESS.CODE_SEND_ERROR},
                                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)
        redis_session.setex(name=f'code_user_{uid}', time=60 * 15, value=code.lower())
        raise HTTPException(detail={'msg': '邮件发送成功.', 'code': comm.BUSINESS.CODE_SEND_SUCCESS},
                            status_code=status.HTTP_200_OK)
    else:
        # 验证验证码
        redis_code = redis_session.get(f'code_user_{uid}')
        if redis_code:
            if redis_code.decode('utf-8') == code:
                await User.filter(uid=uid).update(email=email)
                redis_session.delete(f'code_user_{uid}')
                json_compatible_user: dict = jsonable_encoder(
                    await PydanticUser.from_queryset_single(User.get(uid=uid)))
                return JSONResponse(
                    content={
                        'access_token': auth.generate_access_token({**json_compatible_user}),
                        'token_type': 'bearer',
                    },
                    status_code=status.HTTP_200_OK)
            raise HTTPException(detail={'msg': '验证码错误, 请重新获取验证码.', 'code': comm.BUSINESS.CODE_ERROR},
                                status_code=status.HTTP_400_BAD_REQUEST)
        raise HTTPException(detail={'msg': '验证码已过期, 请重新获取验证码.', 'code': comm.BUSINESS.CODE_ERROR},
                            status_code=status.HTTP_400_BAD_REQUEST)


@router.post('/user/friendship/{uid}', summary='关注用户', response_model=CommModel)
async def make_friendship(uid: str, token_uid: str = Depends(auth.validate_access_token)):
    if uid == token_uid:
        raise HTTPException(detail={'msg': '你无时无刻都在关注着自己.', 'code': comm.BUSINESS.ILLEGAL_OPERATION},
                            status_code=status.HTTP_400_BAD_REQUEST)
    token_user = await User.get(uid=token_uid)
    if not await token_user.followings.filter(uid=uid):
        await Timeline.create(creator_id=token_uid, action=2, user_id=uid)
        user = await User.get(uid=uid)
        await token_user.followings.add(user)
        return JSONResponse(
            content={
                'data': uid,
                'msg': '关注成功',
                'code': comm.BUSINESS.OK,
            },
            status_code=status.HTTP_201_CREATED)
    raise HTTPException(detail={'msg': '无法重复关注.', 'code': comm.BUSINESS.ILLEGAL_OPERATION},
                        status_code=status.HTTP_400_BAD_REQUEST)


@router.delete('/user/friendship/{uid}', summary='取关用户', response_model=CommModel)
async def remove_friendship(uid: str, token_uid: str = Depends(auth.validate_access_token)):
    token_user = await User.get(uid=token_uid)
    if await token_user.followings.filter(uid=uid):
        await Timeline.create(creator_id=token_uid, action=3, user_id=uid)
        user = await User.get(uid=uid)
        await token_user.followings.remove(user)
        return JSONResponse(
            content={
                'data': uid,
                'msg': '取关成功',
                'code': comm.BUSINESS.OK,
            },
            status_code=status.HTTP_200_OK)
    raise HTTPException(detail={'msg': '无法取关未关注用户.', 'code': comm.BUSINESS.ILLEGAL_OPERATION},
                        status_code=status.HTTP_400_BAD_REQUEST)


@router.get('/user/{username}/friendship', summary='查询用户 关注 / 粉丝 详情', response_model=PaginationModel)
async def friendship_list(username: str, page: int, q: str, sort: str = Query(default='create_at'),
                          keywords: str = Query(default=None), authorization: Optional[str] = Header(None)):
    if q not in ['followings', 'followers']:
        raise HTTPException(detail={'msg': '查询条件错误.', 'code': comm.BUSINESS.PARAMS_ERROR},
                            status_code=status.HTTP_400_BAD_REQUEST)
    if page <= 0:
        raise HTTPException(detail={'msg': '页码错误.', 'code': comm.BUSINESS.PARAMS_ERROR},
                            status_code=status.HTTP_400_BAD_REQUEST)
    page_size = configs.PAGE_SIZE
    uid = ''
    if authorization:
        token = authorization.split()
        if len(token) == 2 and token[0].lower() == 'bearer':
            uid = auth.decode_access_token(token[1])
    user = await User.filter(username=username).first()
    if user:
        await user.fetch_related(q)
        if q == 'followings':
            orm = user.followings.filter(
                Q(username__icontains=keywords) | Q(bio__icontains=keywords) if keywords else Q())
            total_count = await orm.all().count()
            users = await PydanticUser.from_queryset(orm.offset((page - 1) * page_size).limit(page_size))
        else:
            orm = user.followers.filter(
                Q(username__icontains=keywords) | Q(bio__icontains=keywords) if keywords else Q())
            total_count = await orm.all().count()
            users = await PydanticUser.from_queryset(orm.offset((page - 1) * page_size).limit(page_size))
        json_compatible_users: list = jsonable_encoder(users)
        results = []
        for json_compatible_user in json_compatible_users:
            user = await User.get(uid=json_compatible_user['uid'])
            await user.fetch_related('followers', 'followings', 'articles')
            is_followed = await user.followers.filter(uid=uid).first()
            results.append({
                **json_compatible_user,
                'followers': len(user.followers),
                'followings': len(user.followings),
                'articles': len(await user.articles.filter(status=3)),
                'is_followed': bool(is_followed)
            })
        if sort == 'followers':
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
                'code': comm.BUSINESS.OK,
            },
            status_code=status.HTTP_200_OK)
    raise HTTPException(detail={'msg': '用户不存在.', 'code': comm.BUSINESS.NOT_EXIST},
                        status_code=status.HTTP_400_BAD_REQUEST)


@router.get('/user/{username}/repository', summary='查询用户仓库信息', response_model=PaginationModel)
async def article(username: str, page: int, sort: str = Query(default='publish_at'), keywords: str = Query(default=''),
                  authorization: Optional[str] = Header(None)):
    """
    :param username:
    :param page:
    :param sort: 'publish_at': 最新发布, 'stars': 最多点赞, 'views': 最多浏览, 'comments': 最多评论
    :param keywords:
    :param authorization:
    :return:
    """
    if page <= 0:
        raise HTTPException(detail={'msg': '页码错误.', 'code': comm.BUSINESS.PARAMS_ERROR},
                            status_code=status.HTTP_400_BAD_REQUEST)
    page_size = configs.PAGE_SIZE
    if sort == 'stars':
        order_by = '-stars'
    elif sort == 'views':
        order_by = '-views'
    elif sort == 'comments':
        order_by = '-comment_count'
    else:
        order_by = '-publish_at'
    is_self = False
    user = await User.get(username=username)
    if authorization:
        token = authorization.split()
        if len(token) == 2 and token[0].lower() == 'bearer':
            is_self = (str(user.uid) == auth.decode_access_token(token[1]))
    # 此处冗余度很高可以进行优化, 目前暂不作任何处理
    if is_self:
        orm = Article.filter(is_active=True).filter(
            Q(Q(Q(status=0) | Q(status=1) | Q(status=2) | Q(status=3)), author_id=user.uid)).filter(
            Q(title__icontains=keywords) | Q(desc__icontains=keywords) | Q(
                content__icontains=keywords) if keywords else Q())
        total_count = await orm.count()
        articles = await PydanticPreviewArticle.from_queryset(
            orm.order_by(order_by).offset((page - 1) * page_size).limit(page_size))
    else:
        orm = Article.filter(is_active=True).filter(status=3, author_id=user.uid).filter(
            Q(title__icontains=keywords) | Q(desc__icontains=keywords) | Q(
                content__icontains=keywords) if keywords else Q())
        total_count = await orm.count()
        articles = await PydanticPreviewArticle.from_queryset(
            orm.order_by(order_by).offset((page - 1) * page_size).limit(page_size))
    json_compatible_articles: List[dict] = jsonable_encoder(articles)
    json_compatible_articles = [
        {**json_compatible_article,
         'author': str(user)}
        for json_compatible_article in json_compatible_articles]
    next_page = page + 1 if page * page_size < total_count else None
    previous_page = page - 1 if page > 1 else None
    return JSONResponse(
        content={
            'data': {
                'count': total_count,
                'next': next_page,
                'previous': previous_page,
                'results': json_compatible_articles,
            },
            'code': comm.BUSINESS.OK,
        },
        status_code=status.HTTP_200_OK)


@router.get('/user/{username}/repository/popular', summary='查询用户杰出贡献信息', response_model=CommModel)
async def popular_article(username: str):
    user = await User.get(username=username)
    articles = await PydanticPreviewArticle.from_queryset(
        Article.filter(status=3, author_id=user.uid).order_by('-stars', '-comment_count', '-views').limit(2))
    json_compatible_articles: List[dict] = jsonable_encoder(articles)
    return JSONResponse(
        content={
            'data': json_compatible_articles,
            'msg': '查询成功.',
            'code': comm.BUSINESS.OK,
        },
        status_code=status.HTTP_200_OK)


@router.get('/user/{username}/contribution', summary='查询用户贡献信息', response_model=CommModel)
async def contribution(username: str):
    user = await User.get(username=username)
    if user:
        await user.fetch_related('timelines')
        contribution = await user.timelines.all().annotate(date=comm.TruncDay('create_at', '%Y/%m/%d')).all().group_by(
            'date').annotate(count=Count('date')).values('date', 'count')
        continuance = 0
        continuances = []
        dates = [datetime.strptime(d['date'], "%Y/%m/%d") for d in contribution]
        match_date = dates.pop(0)
        for date in dates:
            if abs((date - match_date).days) == 1:
                continuance += 1
            else:
                continuances.append(continuance)
                continuance = 0
            match_date = date
        continuances.append(continuance)
        return JSONResponse(
            content={
                'data': {
                    'value': contribution,
                    'info': {
                        'total': sum([i['count'] for i in contribution]),
                        'continuance': max(continuances)
                    }
                },
                'msg': '查询成功.',
                'code': comm.BUSINESS.OK,
            },
            status_code=status.HTTP_200_OK)
