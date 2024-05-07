// Prisma: Conexão com o banco de dados.
import prismaClient from "../../prisma";

// Hash: Criptografia da senha informada pelo usuário.
import { hash } from "bcryptjs";

// interface para realizar a desconstrução.
interface UserRequest{
    name: string;
    email: string;
    password: string;
}


class CreateUserService{
    async execute({name, email, password}: UserRequest){
        // Verificar se enviou um e-mail válido.
        if(!email){
            throw new Error("Email incorrect.")
        }
        
        // verificar se o e-mail está cadastrado na plataforma:
        const userAlreadyExists = await prismaClient.user.findFirst({
            where:{
                email: email
            }
        });
        if(userAlreadyExists){
            throw new Error("User already exists.")
        }

        //criptografando a senha do usuário.
        const passwordHash = await hash(password, 8);

        //Cadastrando o usuário no banco.
        const user = await prismaClient.user.create({
            data:{
                name: name,
                email: email,
                password: passwordHash,
            },
            //mostrando somente o que o usuário precisa saber, evitando enviar a senha e data de criação.
            select:{
                id: true,
                email: true,
                name: true,
            }
        })

        return user;
    }
}   

export { CreateUserService};