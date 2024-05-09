import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";

import { parseCookies, destroyCookie } from "nookies";

import { AuthTokenError } from "../services/errors/AuthTokenError";



//função para paginas só usuario logado pode ter acesso

export function canSSRAuth<P>(fn: GetServerSideProps<P>){

    return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {

        const cookies = parseCookies(ctx);

        const token = cookies['@nextauth.token'];

        // caso o usuário não esteja logado, retorna para a tela de login
        if (!token){
            return {
                redirect:{
                    destination: '/',
                    permanent: false
                }
            }
        }

        // Com o try verifica se estiver ok
        // com o catch, se der algum erro ele destroi o cookie e redireciona pra tela de login
        try{
            return await fn(ctx);


        }catch(error){
            if(error instanceof AuthTokenError){
                destroyCookie(ctx, '@nextauth.token');
                return {
                    redirect:{
                        destination: '/',
                        permanent: false
                    }
                }
            }
        }


    }
}
