from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from user_service import cadastrar_usuario, login_usuario, buscar_usuario_por_email, excluir_usuario_completo, editar_usuario
from jwt_utils import gerar_jwt, gerar_token_reset, validar_jwt
from user_service import cadastrar_usuario, login_usuario, buscar_usuario_por_email, excluir_usuario_completo, editar_usuario, buscar_usuario_por_id
import requests
import os

app = FastAPI(title="Auth Service")

# --- CORS ---
origins = ["http://localhost:5173", "http://127.0.0.1:5173"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- SEGURANÇA (Para proteger as rotas de deletar/editar) ---
security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    payload = validar_jwt(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Token inválido ou expirado")
    return payload

# --- MODELS ---
class Register(BaseModel):
    nome: str
    email: str
    senha: str

class Login(BaseModel):
    email: str
    senha: str

class ForgotPassword(BaseModel):
    email: str

class ResetPassword(BaseModel):
    token: str
    nova_senha: str

class UserUpdate(BaseModel):
    nome: str
    email: str

# --- ENDPOINTS EXISTENTES ---
# (Mantenha /register, /login, /forgot-password, /reset-password como estavam)
# ... [CÓDIGO ANTERIOR AQUI] ...
# Vou colocar apenas os NOVOS endpoints abaixo para não ficar gigante, 
# mas certifique-se de manter os de login/registro acima.

@app.post("/register")
def register_user(body: Register):
    result = cadastrar_usuario(body.nome, body.email, body.senha)
    if result is True:
        return {"status": "ok", "message": "Usuário registrado"}
    else:
        raise HTTPException(status_code=400, detail=result)

@app.post("/login")
def login_user(body: Login):
    user = login_usuario(body.email, body.senha)
    if not user:
        raise HTTPException(status_code=401, detail="Credenciais inválidas")
    token = gerar_jwt(user["id"], body.email)
    return {"token": token}

@app.post("/forgot-password")
def forgot_password(body: ForgotPassword):
    # ... (Mantenha a lógica de envio de email que já fizemos) ...
    return {"status": "ok", "message": "Email enviado (Simulado)"} 

# --- NOVOS ENDPOINTS (Delete e Edit) ---

@app.delete("/user/me")
def delete_my_account(user = Depends(get_current_user)):
    """Apaga a conta do usuário logado e todos os seus dados"""
    user_id = user["user_id"]
    sucesso = excluir_usuario_completo(user_id)
    
    if sucesso:
        return {"status": "ok", "message": "Conta excluída permanentemente"}
    else:
        raise HTTPException(status_code=500, detail="Erro ao excluir conta")

@app.put("/user/me")
def update_my_profile(body: UserUpdate, user = Depends(get_current_user)):
    """Atualiza nome e email do usuário logado"""
    user_id = user["user_id"]
    resultado = editar_usuario(user_id, body.nome, body.email)
    
    if resultado is True:
        return {"status": "ok", "message": "Perfil atualizado com sucesso"}
    else:
        # Se resultado for uma string, é uma mensagem de erro (ex: email duplicado)
        raise HTTPException(status_code=400, detail=str(resultado))
    
@app.get("/user/me")
def get_my_profile(user = Depends(get_current_user)):
    """Retorna os dados do usuário logado"""
    dados_usuario = buscar_usuario_por_id(user["user_id"])
    if not dados_usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return dados_usuario