import smtplib
from email.mime.text import MIMEText

EMAIL = "seuemail@gmail.com"
APP_PASSWORD = "SENHA_DO_APP_AQUI"

def enviar_email(destinatario, assunto, mensagem):
    try:
        msg = MIMEText(mensagem)
        msg["Subject"] = assunto
        msg["From"] = EMAIL
        msg["To"] = destinatario

        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
            smtp.login(EMAIL, APP_PASSWORD)
            smtp.send_message(msg)

        return True

    except Exception as e:
        return str(e)
