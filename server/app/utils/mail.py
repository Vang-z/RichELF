from aioyagmail import AIOSMTP
from config import configs


async def send_email(email: str, subject: str, content: str):
    async with AIOSMTP(
            user=configs.EMAIL_HOST_USER,
            password=configs.EMAIL_HOST_PASSWORD,
            host=configs.EMAIL_HOST,
            port=configs.EMAIL_PORT,
    ) as yag:
        try:
            await yag.send(to=email, subject=subject, contents=content)
            return True
        except:
            return False
 