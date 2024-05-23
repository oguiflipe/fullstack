
import { useState } from "react"

//import da funcionalidade que valida se o usuário está logado.
import { canSSRAuth } from "@/src/utils/canSSRAuth"
//import da api
import { setupAPIClient } from "@/src/services/api"

//import do Head para alterar o titulo da pagina
import Head from "next/head"

//importando a biblioteca para criação do modal
import Modal from "react-modal";

//importando o modal
import { ModalOrder } from "@/src/components/ModalOrder";
//import do menu 
import { Header } from "@/src/components/Header"
//import do estilo
import styles from "./styles.module.scss"
//import do icone
import { FiRefreshCcw } from "react-icons/fi"

//tipando os dados que são passados typescript
type OrderProps = {
    id: string;
    table: string | number;
    status: boolean;
    draft: boolean;
    name: string | null;
}
//recebendo os dados tipados e informando que vamos receber uma lista
interface HomeProps{
    orders: OrderProps[];
}

//tipagem para o modal item
export type OrderItemProps = {
    id: string;
    amount: number;
    order_id: string;
    product_id: string;
    product:{
        id: string;
        name: string;
        description: string;
        price: string;
        banner: string;
    }
    order:{
        id: string;
        table: string | number;
        status: boolean;
        name: string | null;
    }
}




//importante ** sempre passar os dados coletados pela api na função da pagina ex: dashboard
export default function Dashboard({orders}: HomeProps){
    const [orderList, setOrderList] = useState(orders || []);


    //guardando as informações do pedido no usestate
    const [modalItem, setModalItem] = useState<OrderItemProps[]>();
    //useState para controlar se o modal está aberto ou não.
    const [modalVisible, setModalVisible] = useState(false);

    //função para fechar o modal
    function handleCloseModal(){
        setModalVisible(false);
    }

    //criando a função para chamar o modal após clicar na mesa:
    async function handleOpenModalView(id: string){

        const apiClient = setupAPIClient();
        const response = await apiClient.get('/orders/details', {
            params:{
                order_id: id,
            }
        })

        setModalItem(response.data);

        setModalVisible(true);
    }

    //finalizando o pedido:
    async function handleFinishItem(id: string){
        //alert('Fechar o pedido: ' + id)
        const apiClient = setupAPIClient();
        await apiClient.put('/order/finish', {
            order_id: id,
        })

        //atualizando a lista com os ultimos pedidos na tela do dash
        const response = await apiClient.get('/orders');
        setOrderList(response.data)

        //realizando o fechamento do modal
        setModalVisible(false);
    }

    //Função para recarregar os pedidos:
    async function handleRefreshOrders(){
        const apiClient = setupAPIClient();
        const response = await apiClient.get('/orders');

        //passando a lista para o useState mudar o estado da aplicação para atualizar pedidos
        setOrderList(response.data);
    }



    Modal.setAppElement('#__next')


    return(
        <>
            <Head>
                <title>Painel - Pizzaria </title>    
            </Head>


            <div>
                <Header />

                <main className={styles.container}>
                    <div className={styles.containerHeader}>
                        <h1>Pedidos</h1>
                        <button onClick={() => handleRefreshOrders()}><FiRefreshCcw color="#3fffa3" size={25}/></button>
                    </div>

                    <article className={styles.listOrders}>

                        {orderList.length === 0 && (
                            //verificando se existe pedido, caso contrário a mensagem abaixo será exibida.
                            <span className={styles.emptyList}>Aguardando pedido!</span>
                        )}
                        
                        {orderList.map( item => (
                            /* Listando as ordens  */
                            <section key={item.id} className={styles.orderItem}>
                                <button onClick={ () => handleOpenModalView(item.id)}>
                                    <div className={styles.tag}></div>
                                    <span>Mesa {item.table}</span>
                                </button>
                            </section>
                        ))}
                    </article>
                </main>  

                {modalVisible && (
                    /* Quando clicar no botão para abrir os detalhes da mesa, mostrar o modal com os pedidos */
                    <ModalOrder 
                        isOpen={modalVisible}
                        onRequestClose={handleCloseModal}
                        order={modalItem}
                        handleFinishOrder={handleFinishItem}
                    />
                )}
            </div>
            
            
        </>
    )
}


// função para impedir que usuários não logados acessem a pagina de dash
export const getServerSideProps = canSSRAuth(async (ctx) => {

    //fazer a requisição
    const apiClient = setupAPIClient(ctx);
    const response = await apiClient.get('/orders');

    //console.log(response.data)




    return {
        props:{
            orders: response.data
        }
    }
})