import prismaCliente from "../../prisma";

interface ProductRequest{
    category_id: string;
}

class ListByCategoryService{
    async execute({category_id}: ProductRequest){

        // Listando todos os produtos do banco
        const findeByCategory = await prismaCliente.product.findMany({
            where:{
                category_id: category_id
            }
        })

        // Retornando para o controller
        return findeByCategory;
    }
}

export {ListByCategoryService}