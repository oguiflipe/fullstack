import prismaCliente from "../../prisma";


class ListCategoryService{
    async execute(){
        
        //buscando as informações do banco de categorias.
        const category = await prismaCliente.category.findMany({
            select: {
                id: true,
                name: true,
            }
        })

        return category;
    }
}


export { ListCategoryService }