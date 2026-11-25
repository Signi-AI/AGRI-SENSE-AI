import logging
import smtplib
from email.message import EmailMessage

from app.core.config import settings

logger = logging.getLogger(__name__)


def send_security_email(to: str, subject: str, body: str) -> bool:
    """Send a transactional email. Returns False when SMTP is not configured."""
    if not settings.SMTP_HOST:
        logger.warning("SMTP is not configured; security email to %s was not sent", to)
        return False

    message = EmailMessage()
    message["From"] = settings.EMAIL_FROM
    message["To"] = to
    message["Subject"] = subject
    message.set_content(body)

    try:
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=15) as server:
            server.starttls()
            if settings.SMTP_USER:
                server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.send_message(message)
        return True
    except Exception:
        logger.exception("Could not send security email")
        return False
