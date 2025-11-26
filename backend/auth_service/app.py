# Finance-Smart/backend/auth_service/app.py
from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from user_service import cadastrar_usuario, login_usuario, buscar_usuario_por_email, excluir_usuario_completo, editar_usuario, buscar_usuario_por_id, atualizar_senha
from jwt_utils import gerar_jwt, gerar_token_reset, validar_jwt
import requests
import os
import sys

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

# --- SEGURANÇA ---
security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Valida o token JWT e retorna o payload do usuário."""
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

# --- ENDPOINTS ---

@app.post("/register")
def register_user(body: Register):
    """Registra um novo usuário no sistema."""
    result = cadastrar_usuario(body.nome, body.email, body.senha)
    if result is True:
        return {"status": "ok", "message": "Usuário registrado com sucesso"}
    else:
        raise HTTPException(status_code=400, detail=result)

@app.post("/login")
def login_user(body: Login):
    """Autentica o usuário e retorna o token JWT."""
    user = login_usuario(body.email, body.senha)
    if not user:
        raise HTTPException(status_code=401, detail="Credenciais inválidas")
    
    token = gerar_jwt(user["id"], body.email)
    nome_user = user.get("nome") or user.get("NOME") or user.get("Nome") or "Usuário"
    return {"token": token, "nome": nome_user, "email": user["email"]}

@app.post("/forgot-password")
def forgot_password(body: ForgotPassword):
    """
    Inicia o fluxo de recuperação de senha.
    """
    print(f"--- [DEBUG] Iniciando /forgot-password para: {body.email} ---", flush=True)

    user = buscar_usuario_por_email(body.email)
    
    if not user:
        return {"status": "ok", "message": "Se o e-mail estiver cadastrado, você receberá um link de redefinição."}

    try:
        user_id = user.get("id") or user.get("ID")
        if not user_id:
            raise Exception("ID do usuário não encontrado no objeto retornado pelo banco.")

        token = gerar_token_reset(user_id, body.email)
        
        # CORREÇÃO 1: Alterado de /redefinir-senha para /reset-password para corresponder ao AppRouter.tsx
        link_reset = f"http://localhost:5173/reset-password?token={token}"
        
        email_service_url = os.getenv("EMAIL_SERVICE", "http://email_service:8003/send-email")
        
        nome_usuario = user.get("nome") or user.get("NOME") or user.get("Nome") or "Prezado(a)"
        
        # CORREÇÃO 2: Utilizamos o campo link_acao para gerar o botão no e-mail
        # A mensagem fica mais limpa, pois o botão será inserido automaticamente pelo template
        payload_email = {
            "destinatario": body.email,
            "assunto": "Recuperação de Senha - Finance Smart",
            "mensagem": f"Olá {nome_usuario},\n\nRecebemos uma solicitação para redefinir sua senha. Clique no botão abaixo para criar uma nova senha:",
            "link_acao": link_reset
        }
        
        print(f"--- [DEBUG] Enviando payload para {email_service_url}... ---", flush=True)
        
        response = requests.post(email_service_url, json=payload_email, timeout=10)
        
        if response.status_code != 200:
            print(f"--- [ERRO] O Email Service retornou erro: {response.text} ---", flush=True)
            
    except Exception as e:
        print(f"--- [ERRO CRÍTICO] Exceção ao processar envio: {str(e)} ---", flush=True)

    return {"status": "ok", "message": "Se o e-mail estiver cadastrado, você receberá um link de redefinição."}

@app.post("/reset-password")
def reset_password_endpoint(body: ResetPassword):
    """
    Finaliza o fluxo de recuperação.
    """
    payload = validar_jwt(body.token)
    if not payload:
        raise HTTPException(status_code=400, detail="Token inválido ou expirado")
        
    user_id = payload["user_id"]
    
    # Implementação da atualização de senha
    # Importante: Certifique-se de importar 'atualizar_senha' do user_service no topo
    resultado = atualizar_senha(user_id, body.nova_senha)

    if resultado is True:
        return {"status": "ok", "message": "Senha alterada com sucesso."}
    else:
        raise HTTPException(status_code=500, detail=f"Erro ao atualizar senha: {resultado}")

# --- GESTÃO DE USUÁRIO ---

@app.get("/user/me")
def get_my_profile(user = Depends(get_current_user)):
    user_id = user["user_id"]
    dados_usuario = buscar_usuario_por_id(user_id)
    if not dados_usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return dados_usuario

@app.put("/user/me")
def update_my_profile(body: UserUpdate, user = Depends(get_current_user)):
    user_id = user["user_id"]
    resultado = editar_usuario(user_id, body.nome, body.email)
    
    if resultado is True:
        return {"status": "ok", "message": "Perfil atualizado com sucesso"}
    else:
        raise HTTPException(status_code=400, detail=str(resultado))

@app.delete("/user/me")
def delete_my_account(user = Depends(get_current_user)):
    user_id = user["user_id"]
    sucesso = excluir_usuario_completo(user_id)
    
    if sucesso:
        return {"status": "ok", "message": "Conta excluída permanentemente"}
    else:
        raise HTTPException(status_code=500, detail="Erro ao excluir conta")