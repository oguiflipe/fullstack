import prismaClient from "../../prisma";

// utilizando o 'compare' para verificar se a senha do usuário está igual a do banco.
import { compare } from "bcryptjs";

import {sign} from 'jsonwebtoken';


// 
interface AuthRequest{
    email: string;
    password: string;
}


class AuthUserService{
    async execute({email, password}: AuthRequest){
        
        // Verificar se o email existe
        const user = await prismaClient.user.findFirst({
            where:{
                email: email
            }
        });

        if(!user){
            throw new Error("User/Passord incorrect.")
        }

        // Verificando se a senha está correta.
        const passwordMatch = await compare(password, user.password);

        if(!passwordMatch){
            throw new Error("User/Passord incorrect.")
        }

        // Gerar um token JWT e devolver os dados do usuario como id, name e email;
        // Se deu tudo certo: gerar o token
        const token = sign(
            {
                name: user.name,
                email: user.email
            },
            process.env.JWT_SECRET,{
                subject: user.id,
                expiresIn: '30d'
            }
        )

        //retornando as informações coletadas 
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            token: token
        }
    }
}

export {AuthUserService};