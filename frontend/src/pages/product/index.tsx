
import { useState, ChangeEvent, FormEvent } from "react";
//import titulo da pagina
import Head from "next/head";


//importanto o controle de acesso as rotas
import { canSSRAuth } from "@/src/utils/canSSRAuth"
//importando o header para navegação
import { Header } from "@/src/components/Header";
//importando a api
import { setupAPIClient } from "@/src/services/api";


// import do estilo da pagina
import styles from './styles.module.scss';
//importando icone
import { FiUpload } from "react-icons/fi";
//importando o toast 
import { toast } from "react-toastify";


//criando tipagem
type ItemProps = {
    id: string;
    name: string;
}
//tipando e informando que é um aray
type CategoryProps = {
    categoryList: ItemProps[];
}

/* Category list foi passado e criado uma tipagem para o typescript identificar as propriedades */
export default function Product({categoryList}: CategoryProps){

    //armazenando os dados enviados pelo usuário em no useState;
    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const [description, setDescription] = useState('')


    //testando se o dado está sendo enviado ao front-end
    //console.log(categoryList)
    //criando use state para armazenar os dados da aray
    const [categories, setCategories] = useState(categoryList || [])
    const [categorySelected, setCategorySelected] = useState(0)

    //armazenar a imagem e mostrar no preview
    const [avatarUrl, setAvatarUrl] = useState('');

    //armazenando no state para guardar no banco
    const [imageAvatar, setImageAvatar] = useState(null);


    // Função para validar as imagens enviadas pelo front-end
    function handleFile(e: ChangeEvent<HTMLInputElement>){

        //verificando se a imagem foi enviada pelo usuário
        if(!e.target.files){
            return;
        }

        //guardando a informação da imagem anexada no upload
        const image = e.target.files[0];

        // verificando se a imagem não está inclusa
        if(!image){
            return;
        }

        //validando se o formato das imagens estão corretos ante de enviar pro banco
        if(image.type === 'image/jpeg' || image.type === 'image/png'){
            //salvando a imagem se for png ou jpeg
            setImageAvatar(image);
            //mostrando o preview
            setAvatarUrl(URL.createObjectURL(e.target.files[0]))
        }
    }

    //quando seleciona uma nova categoria na lista
    function handleChangeCategory(event){
        //console.log("Posição da categoria selecionada: ", event.target.value)
        //console.log("categoria selecionada: ", categories[event.target.value])

        //mudando a posição do item selecionado
        setCategorySelected(event.target.value);
    }

    //função que envia os dados coletados para o banco de dados via api
    async function handleRegister(event: FormEvent){
        //usado para não atualizar a página quando preenchida
        event.preventDefault();

        try {
            
            const data = new FormData();

            //validando se o usuário preencheu todos os dados corretamente.
            if(name === '' || price === '' || description === '' || imageAvatar === null){
                toast.error("Preencha todos os campos");
                return;
            }

            //Coletando e adicionando os dados informados pelo usuário
            data.append('name', name);
            data.append('price', price);
            data.append('description', description);
            //enviando o id da categoria selecionada para incluir corretamente no banco
            data.append('category_id', categories[categorySelected].id);
            data.append('file', imageAvatar);

            //criando a requisição
            const apiClient = setupAPIClient();
            //enviando a requisição e aguardando o retorno
            await apiClient.post('/product', data);
            //mensagem de ok após a finalização do envio para o banco de dados
            toast.success('Produto cadastrado com sucesso.')

        } catch (error) {
            console.log(error)
            toast.error("Erro ao cadastrar.")
        }

        //zerando os inputs
        setName('');
        setPrice('');
        setDescription('');
        setImageAvatar(null);
        setAvatarUrl('');
    }


    return(
        <>
            <Head>
                <title>Cadastrar produtos</title>
            </Head>

            <div>
                <Header/>
                
                <main className={styles.container}>
                    <h1>Novo produto</h1>

                    <form className={styles.form} onSubmit={handleRegister}>
                        <label className={styles.labelAvatar}>
                            <span>
                                <FiUpload size={30} color="#fff"/>
                            </span>
                            
                            <input 
                            /* Bloco de código criado para filtrar as imagens que serão enviadas pelo usuário do front */
                                type="file"  
                                accept="image/png, image/jpeg" 
                                onChange={handleFile}
                            />
                            {
                            /* Bloco de código criado para não ficar mostrando img quebrada para o usuário */
                            avatarUrl && (
                                <img  
                                className={styles.preview}
                                src={avatarUrl} 
                                alt="Foto do produto" 
                                width={250}
                                height={250}
                            />
                            )}
                        </label>
                        
                        <select 
                            value={categorySelected}
                            onChange={handleChangeCategory}
                        >
                            {
                            /* Bloco de código criado para realizar um map nas categorias do banco e retornar no front */
                            categories.map((item, index) => {
                                return(
                                    <option key={item.id} value={index}>
                                        {item.name}
                                    </option>
                                )
                            })}
                        </select>
                        
                        <input 
                            type="text"
                            placeholder="Digite o nome do produto"
                            className={styles.input}
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value)
                            }}
                        />
                        <input 
                            type="text"
                            placeholder="Digite o preço do produto"
                            className={styles.input}
                            value={price}
                            onChange={(e) => {
                                setPrice(e.target.value)
                            }}
                        />

                        <textarea 
                            placeholder="Descreva seu produto: " 
                            className={styles.input}
                            value={description}
                            onChange={(e) => {
                                setDescription(e.target.value)
                            }}
                        />

                        <button className={styles.buttonAdd} type="submit">
                            Cadastrar
                        </button>
                    </form>

                </main>
            </div>
        </>
    )
}

// Configuração de controle de rota
export const getServerSideProps = canSSRAuth( async (ctx) => {
    //guardando os dados da requisição na api
    const apiClient = setupAPIClient(ctx);

    //realizando a requisição
    const response = await apiClient.get('/category')
    //console.log(response.data)

    //retornando os dados coletados na api para o front
    return{
        props: {
            categoryList: response.data
        }
    }
})
