Script para iniciar o projeto em desenvolvimento:
    yarn dev


OBS:
    Backend feito com TypeScript
    Utilizando o Postgresql como banco de dados.
    postbird para ver as tabelas:
        https://github.com/Paxa/postbird?tab=readme-ov-file

    ou utilizar o Beekeeper Studio.

Iniciando projeto:
    yarn install -y




Bibliotecas:

    Como dependência de desenvolvimento:
        yarn add typescript -D

    Express para API:
        yarn add express
            Instalando as tipagens: (Ter alto complete e facilitar o desenvolvimento)
                yarn add @types/express -D

    Biblioteca para rodar o projeto backend no typescript:
        yarn add ts-node-dev -D

    Iniciando projeto: (TSC)
        yarn tsc --init

    biblioteca para tratar erros:
        yarn add express-async-errors

    biblioteca para qualquer ip acessar:
        yarn add cors
        yarn add @types/cors -D

    Prisma para facilitar a conexão com o banco de dados.
        yarn add prisma 
        yarn add @prisma/client
            precisa iniciar o projeto para criar a configuração base.
                npx prisma init
    
    Precisa alterar o env do prisma para o banco que foi criado.
        Criando uma Migration:
            yarn prisma migrate dev

    biblioteca para criptografar as senhas do usuário no banco.
        yarn add bcryptjs
        yarn add @types/bcryptjs -D
    
    Instalar o JWT: token
        yarn add jsonwebtoken
        yarn add @types/jsonwebtoken -D
    
    Instalar o DOTENV
        yarn add dotenv

    Instalar o Multer = para trabalhar com imagens 
        yarn add multer 
        yarn add @types/multer -D

Scripts:

    "scripts":{
        "dev": "ts-node-dev src/server.ts"
    },



