import prismaCliente from "../../prisma";

interface ProductRequest{
    name: string;
    price: string;
    description: string;
    banner: string;
    cartegory_id: string;
}

class CreateProductsService{
    async execute({name, price, description, banner, cartegory_id}: ProductRequest){
        
        const product = await prismaCliente.product.create({
            data:{
                name: name,
                price: price,
                description: description,
                banner: banner,
                category_id: cartegory_id
            }
        })


        return product;

    }
}


export {CreateProductsService};