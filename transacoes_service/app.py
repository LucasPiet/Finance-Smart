from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import HTTPBearer
from pydantic import BaseModel
from auth_service import validar_jwt
from transacoes_service import transacoes

app = FastAPI(title="Finance Service")

security = HTTPBearer()

class Transacao(BaseModel):
    tipo: str
    categoria: str
    descricao: str | None = None
    valor: float

def get_user(credentials = Depends(security)):
    token = credentials.credentials
    payload = validar_jwt(token)

    if not payload:
        raise HTTPException(401, "Token inválido")

    return payload

@app.post("/transacoes")
def criar_transacao(body: Transacao, user = Depends(get_user)):
    user_id = user["user_id"]

    if body.tipo not in ["C", "D"]:
        raise HTTPException(400, "Tipo deve ser C ou D")

    novo_id = transacoes.inserir_transacao(
        user_id,
        body.tipo,
        body.categoria,
        body.descricao,
        body.valor
    )

    return {"status": "ok", "id": novo_id}

@app.get("/transacoes")
def listar(user = Depends(get_user)):
    return transacoes.listar_transacoes(user["user_id"])

@app.get("/saldo")
def get_saldo(user = Depends(get_user)):
    return {"saldo": transacoes.saldo(user["user_id"])}
