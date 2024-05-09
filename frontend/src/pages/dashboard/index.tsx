import { canSSRAuth } from "@/src/utils/canSSRAuth"




export default function Dashboard(){
    return(
        <div>
            <h1>Bem-vindo ao painel</h1>
        </div>
    )
}


// função para impedir que usuários não logados acessem a pagina de dash
export const getServerSideProps = canSSRAuth(async (ctx) => {
    return {
        props:{}
    }
})