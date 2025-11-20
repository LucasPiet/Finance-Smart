# send_email.py
import os
import smtplib
from email.mime.text import MIMEText
from dotenv import load_dotenv

load_dotenv()  # Garante que as variáveis do .env sejam carregadas

EMAIL_USER = os.getenv("EMAIL_USER")
EMAIL_PASS = os.getenv("EMAIL_PASS")
EMAIL_HOST = os.getenv("EMAIL_HOST", "smtp.gmail.com")
EMAIL_PORT = int(os.getenv("EMAIL_PORT", 587))

def enviar_email(destinatario: str, assunto: str, mensagem: str):
    try:
        msg = MIMEText(mensagem, "html")
        msg["Subject"] = assunto
        msg["From"] = EMAIL_USER
        msg["To"] = destinatario

        with smtplib.SMTP(EMAIL_HOST, EMAIL_PORT) as server:
            server.starttls()
            server.login(EMAIL_USER, EMAIL_PASS)
            server.send_message(msg)

        return True
    except smtplib.SMTPAuthenticationError as e:
        return f"Erro de autenticação SMTP: {e}"
    except Exception as e:
        return f"Erro ao enviar email: {e}"
