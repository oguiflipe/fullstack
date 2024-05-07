import prismaCliente from "../../prisma";

interface CategoryRequest{
    name: string;
}

class CreateCategoryServices{
    async execute({name}: CategoryRequest){
       
        //realizando o cadastro:
        //Validando se o campo está preenchido
        if(name === ''){
            throw new Error("Name invalid")
        }

        const category = await prismaCliente.category.create({
            data:{
                name: name,
            },
            select:{
                id: true,
                name: true
            }
        })

        return category;

    }
}

export { CreateCategoryServices }