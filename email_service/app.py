from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from send_email import enviar_email

app = FastAPI(title="Email Service")

class EmailRequest(BaseModel):
    destinatario: str
    assunto: str
    mensagem: str

@app.post("/send-email")
def send_email_endpoint(body: EmailRequest):
    result = enviar_email(
        body.destinatario,
        body.assunto,
        body.mensagem
    )

    if result is True:
        return {"status": "ok", "message": "Email enviado com sucesso!"}
    else:
        raise HTTPException(500, f"Erro ao enviar email: {result}")
