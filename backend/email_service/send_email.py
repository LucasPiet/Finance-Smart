# Finance-Smart/backend/email_service/send_email.py
import os
import smtplib
from email.mime.text import MIMEText
from dotenv import load_dotenv

load_dotenv()

EMAIL_USER = os.getenv("EMAIL_USER")
EMAIL_PASS = os.getenv("EMAIL_PASS")
EMAIL_HOST = os.getenv("EMAIL_HOST", "smtp.gmail.com")
EMAIL_PORT = int(os.getenv("EMAIL_PORT", 587))

def criar_template_html(assunto: str, mensagem: str, link_acao: str = None) -> str:
    """
    Gera o template HTML estilizado conforme o padrão solicitado (fundo cinza, container branco, botão verde).
    """
    # Lógica do Botão: Só renderiza se o link for enviado
    botao_html = ""
    if link_acao:
        botao_html = f"""
            <div style="text-align: center; margin: 30px 0;">
                <a href="{link_acao}"
                   style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; font-family: Arial, sans-serif;">
                   CLIQUE AQUI
                </a>
            </div>
        """

    html = f"""
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f7; padding: 20px; margin: 0;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            
            <h2 style="color: #333333; text-align: center; margin-top: 0;">{assunto}</h2>
            
            <p style="color: #555555; font-size: 16px; line-height: 1.6;">
                {mensagem}
            </p>
            
            {botao_html}
            
            <hr style="border: none; border-top: 1px solid #eeeeee; margin: 20px 0;">
            
            <p style="color: #999999; font-size: 12px; text-align: center;">
                Se você não solicitou esta ação, por favor ignore este e-mail.
                <br>
                &copy; 2025 Finance Smart.
            </p>
        </div>
    </body>
    </html>
    """
    return html

def enviar_email(destinatario: str, assunto: str, mensagem: str, link_acao: str = None):
    try:
        corpo_email = criar_template_html(assunto, mensagem, link_acao)
        
        msg = MIMEText(corpo_email, "html")
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