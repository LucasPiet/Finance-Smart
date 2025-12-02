from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import HTTPBearer
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from jwt_utils import validar_jwt
import transacoes

app = FastAPI(title="Finance Service - Transações")

# --- CONFIGURAÇÃO DE CORS ---
# Permite que o Frontend (porta 5173) faça pedidos a este serviço
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
    date: str | None = None

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
    novo_id = transacoes.inserir_transacao(
        user_id,
        body.tipo,
        body.categoria,
        body.valor,
        body.date
    )
    # Verifica se a transação foi inserida com sucesso
    # Se novo_id for None, significa que houve um erro
    if not novo_id:
         raise HTTPException(500, "Erro ao criar transação no banco de dados.")
    # Retorna o ID da nova transação
    return {"status": "ok", "id": novo_id}
#-- Fim do Endpoint de Criação --#
@app.get("/transacoes") # Listar transações do utilizador logado    
def listar(user = Depends(get_user)): # Dependência para obter o utilizador logado          
    # Retorna a lista de transações do utilizador logado
    return transacoes.listar_transacoes(user["user_id"])

@app.get("/saldo") # Obter o saldo do utilizador logado     
def get_saldo(user = Depends(get_user)): # Dependência para obter o utilizador logado   
    # Retorna o resumo completo (saldo, receitas, despesas)
    return transacoes.obter_resumo(user["user_id"]) #-- Fim do Endpoint de Saldo --#

@app.delete("/transacoes/{id_transacao}") # Deletar transação pelo ID   
def deletar(id_transacao: int, user = Depends(get_user)):   # Dependência para obter o utilizador logado
    sucesso = transacoes.deletar_transacao(id_transacao, user["user_id"])       # Tenta deletar a transação
     # Se não for bem-sucedido, lança um erro 404
    # Retorna mensagem de sucesso
    if not sucesso:
        raise HTTPException(404, "Transação não encontrada ou permissão negada")# -- Fim do Endpoint de Deleção --#
    
    return {"status": "ok", "message": "Transação removida"} #-- Fim do Endpoint de Deleção --#

@app.put("/transacoes/{id_transacao}") # Atualizar transação pelo ID    
def atualizar(id_transacao: int, body: Transacao, user = Depends(get_user)):  # Dependência para obter o utilizador logado
    if body.tipo not in ["C", "D"]:
        raise HTTPException(400, "Tipo deve ser C ou D")  # Tenta atualizar a transação
     # Se não for bem-sucedido, lança um erro 404
    sucesso = transacoes.atualizar_transacao(
        id_transacao,
        user["user_id"],
        body.tipo,
        body.categoria,
        body.valor
    )
    # Retorna mensagem de sucesso
    if not sucesso:
        raise HTTPException(404, "Erro ao atualizar. Transação não encontrada.") # -- Fim do Endpoint de Atualização --#

    return {"status": "ok", "message": "Transação atualizada"} #-- Fim do Endpoint de Atualização --#