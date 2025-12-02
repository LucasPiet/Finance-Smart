from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import HTTPBearer
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from jwt_utils import validar_jwt
import transacoes

app = FastAPI(title="Finance Service - Transações")

# --- CONFIGURAÇÃO DE CORS ---
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Sistema de Autenticação (Bearer Token)
security = HTTPBearer()

# Modelo de Dados para Validação (Pydantic)
class Transacao(BaseModel):
    tipo: str                  # 'C' para Crédito, 'D' para Débito
    categoria: str
    descricao: str | None = None
    valor: float
    # --- ALTERAÇÃO: Campo 'data' opcional (formato string YYYY-MM-DD ou ISO)
    data: str | None = None

# Dependência para obter o utilizador logado a partir do Token
def get_user(credentials = Depends(security)):
    token = credentials.credentials
    payload = validar_jwt(token)

    if not payload:
        raise HTTPException(401, "Token inválido ou expirado")

    return payload

# --- ENDPOINTS ---

@app.post("/transacoes")
def criar_transacao(body: Transacao, user = Depends(get_user)):
    user_id = user["user_id"]

    if body.tipo not in ["C", "D"]:
        raise HTTPException(400, "Tipo deve ser C (Crédito) ou D (Débito)")
    
    # --- ALTERAÇÃO: Passamos body.data para a função
    novo_id = transacoes.inserir_transacao(
        user_id,
        body.tipo,
        body.categoria,
        body.descricao, # Passando descrição que faltava na chamada original
        body.valor,
        body.data 
    )

    if not novo_id:
         raise HTTPException(500, "Erro ao criar transação no banco de dados.")
         
    return {"status": "ok", "id": novo_id}

@app.get("/transacoes")
def listar(user = Depends(get_user)):          
    return transacoes.listar_transacoes(user["user_id"])

@app.get("/saldo")    
def get_saldo(user = Depends(get_user)):   
    return transacoes.obter_resumo(user["user_id"])

@app.delete("/transacoes/{id_transacao}")
def deletar(id_transacao: int, user = Depends(get_user)):
    sucesso = transacoes.deletar_transacao(id_transacao, user["user_id"])
    
    if not sucesso:
        raise HTTPException(404, "Transação não encontrada ou permissão negada")
    
    return {"status": "ok", "message": "Transação removida"}

@app.put("/transacoes/{id_transacao}")
def atualizar(id_transacao: int, body: Transacao, user = Depends(get_user)):
    if body.tipo not in ["C", "D"]:
        raise HTTPException(400, "Tipo deve ser C ou D")
    
    sucesso = transacoes.atualizar_transacao(
        id_transacao,
        user["user_id"],
        body.tipo,
        body.categoria,
        body.descricao, # Faltava passar descrição no update também
        body.valor
    )

    if not sucesso:
        raise HTTPException(404, "Erro ao atualizar. Transação não encontrada.")

    return {"status": "ok", "message": "Transação atualizada"}