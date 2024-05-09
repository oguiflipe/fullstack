import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";

import { parseCookies } from "nookies";


//função para paginas de visitantes = não logados


export function canSSRGuest<P>(fn: GetServerSideProps<P>){
    return async (ctx: GetServerSidePropsContext)
    : Promise<GetServerSidePropsResult<P>> => {

        //caso tente acessar já com o login, redirecionamos.
        const cookies = parseCookies(ctx);
        //const token = ;
    

        if(cookies['@nextauth.token']){
            return {
                redirect:{
                    destination:'/dashboard',
                    permanent: false,
                }
            }
        }

        return await fn(ctx);
    }
}


