import express, {Request, Response, NextFunction} from "express";
// esse import das tratativas de erros, sempre fica em segundo.
import 'express-async-errors';
import cors from 'cors';
import path from 'path';
import {router} from './routes';


//criando a variável para criar o servidor.
const app = express();

//informando ao express que estamos usando o json.
app.use(express.json());

//liberando mais ips para acessar e realizar requisição na api.
app.use(cors());

//chamando o arquivo de rotas
app.use(router);

//verificando as fotos da pasta temp
app.use(
    '/files',
    express.static(path.resolve(__dirname, '..', 'tmp'))
)


//tratativa de erros.
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if(err instanceof Error){
        // se for uma instancia do tipo error
        return res.status(400).json({
            error: err.message
        });
    }

    return res.status(500).json({
        status: 'error',
        message: 'Internal Server Error.'
    });
});

//fim da tratativa de erros.

//criando a porta para iniciar o servidor.
app.listen(3333, () => {
    console.log("Servidor online")
});