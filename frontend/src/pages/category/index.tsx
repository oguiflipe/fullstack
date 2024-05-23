import { useState, FormEvent } from "react"

import { Header } from "@/src/components/Header"
import Head from "next/head"

import { canSSRAuth } from "@/src/utils/canSSRAuth"
import { setupAPIClient } from "@/src/services/api"

import styles from "./styles.module.scss"
import { toast } from "react-toastify"

export default function Catergory(){

    const [name, setName] = useState('')

    //Função para realizar o cadastro da categoria no banco de dados
    async function handleRegister(event: FormEvent){
        event.preventDefault();

        if(name === ''){
            return;
        }

        const apiCliente = setupAPIClient();
        await apiCliente.post('/category', {
            name: name
        })

        toast.success('Categoria cadastrada com sucesso.')

        setName('');
    }


    return(
        <>
            <Head>
                <title>Nova categoria - Pizzaria</title>
            </Head>

            <div>
            <Header/>
                <main className={styles.container}>
                    <h1>Cadastrar categorias</h1>

                    <form 
                        className={styles.form}
                        onSubmit={handleRegister}    
                    >
                        <input 
                            type="text" 
                            placeholder="Digite o nome da categoria"
                            className={styles.input}
                            value={name}
                            onChange={ (e) => setName(e.target.value)}
                        />

                        <button 
                        type="submit"
                        className={styles.button}
                        >
                            Cadastrar
                        </button>
                    </form>

                    
                </main>
            </div>
        </>
    )
}


export const getServerSideProps = canSSRAuth(async (ctx) =>{
    return {
        props: {}
    }
})