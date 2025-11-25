# Estágio 1: Build da aplicação React
FROM node:18-alpine as build

WORKDIR /app

# Copia os ficheiros de configuração de pacotes
COPY package.json package-lock.json ./

# Instala as dependências
RUN npm install

# Copia todo o código fonte
COPY . .

# Executa o build de produção (Gera a pasta /dist)
RUN npm run build

# Estágio 2: Servidor Web (Nginx)
FROM nginx:stable-alpine

# Copia os ficheiros compilados do estágio anterior para o diretório do Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Configuração personalizada do Nginx para suportar React Router (SPA)
# Isso redireciona todas as requisições para o index.html, evitando erros 404 ao recarregar a página
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]