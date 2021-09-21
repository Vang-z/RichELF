from pypika import CustomFunction
from tortoise.expressions import F
from tortoise.functions import Function
from config import configs


def generate_base_url():
    schema = 'https' if configs.SSL == '1' else 'http'
    return f'{schema}://{configs.HOST}:{configs.PORT}'


def update_dict(d: dict, params: dict) -> dict:
    """
    :param d: 待更新的字典
    :param params: 更新参数
    :return: 因为直接使用 dict.update() -> None, 列表推导式嵌套字典推导式更加繁琐, 该函数将更新完后的字典返回, 适用于列表推导式.
    """
    d.update(params)
    return d


class TruncDay(Function):
    database_func = CustomFunction("DATE_FORMAT", ["name", "dt_format"])


class BUSINESS(object):
    OK = 20000  # 操作成功, 'OK'
    INVALID_TOKEN = 20001  # 无效的token, 'Invalid token'
    ACCESS_TOKEN_EXPIRED = 20002  # access token过期, 'Access token expired'
    AUTHORIZATION_ERROR = 20004  # authorization字段错误, 'Authorization error'

    PHONE_ERROR = 20010  # 手机号格式不符合规则, 'Wrong format of mobile phone number'
    PHONE_EXISTED = 20011  # 手机号已被使用, 'Phone existed'
    EMAIL_ERROR = 20012  # 邮箱地址不符合规则, 'Wrong format of email address'
    EMAIL_EXISTED = 20013  # 邮箱地址已被使用, 'Email existed'
    PASSWORD_ERROR = 20014  # 密码不符合规则, 'Wrong format of password'
    USERNAME_OR_PASSWORD_ERROR = 20015  # 账户或密码错误, 'Wrong account or password'
    ACCOUNT_LOCKED = 20016  # 账户已被锁定, 'Account has been locked'
    ACCOUNT_EXISTED = 20017  # 账号已被使用, 'Account existed'
    NOT_EXIST = 20018  # 结果不存在, 'Result does not exist'
    ILLEGAL_OPERATION = 20019  # 非法操作, 'Illegal operation'

    CODE_ERROR = 20020  # 验证码错误, 'Wrong code'
    CODE_SEND_SUCCESS = 20021  # 发送验证码成功, 'Send code success'
    CODE_SEND_ERROR = 20022  # 发送验证码失败, 'Send code failed'
    CODE_RESEND_ERROR = 20023  # 60s内不能重复发送验证码, '60s needed for resend'
    FILE_NOT_EXIST = 20024  # 文件不存在, 'File not found'
    FILE_ALREADY_EXIST = 20026  # 文件以存在, 'File already exist'
    EMPTY_FILE = 20026  # 文件为空, 'Empty file'
    FILE_FORMAT_ERROR = 20027  # 上传的文件格式不正确, 'Wrong pic format'
    PARAMS_ERROR = 20028  # 参数错误, 'Params error'
