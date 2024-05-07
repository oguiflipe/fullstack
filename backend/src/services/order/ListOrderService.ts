import prismaCliente from "../../prisma";

class ListOrderService{
    async execute(){

        //buscando todos os pedidos presentes no banco de dados.
        const orders = await prismaCliente.order.findMany({
            where:{
                draft: false,
                status: false,
            },
            orderBy:{
                created_at: 'desc'
            }
        })

        return orders;
    }
}

export {ListOrderService}