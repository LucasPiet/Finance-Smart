# Finance-Smart/backend/email_service/app.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
from send_email import enviar_email

app = FastAPI(title="Email Service")

class EmailRequest(BaseModel):
    destinatario: str
    assunto: str
    mensagem: str
    link_acao: Optional[str] = None  # Novo campo opcional

@app.post("/send-email")
def send_email_endpoint(body: EmailRequest):
    # Passamos o link_acao para a função de envio
    result = enviar_email(
        body.destinatario,
        body.assunto,
        body.mensagem,
        body.link_acao 
    )

    if result is True:
        return {"status": "ok", "message": "Email enviado com sucesso!"}
    else:
        raise HTTPException(500, f"Erro ao enviar email: {result}")