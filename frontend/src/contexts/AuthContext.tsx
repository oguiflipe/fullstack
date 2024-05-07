import { createContext, ReactNode, useState } from "react";

import { destroyCookie, setCookie, parseCookies } from "nookies";
import Router from "next/router";

//importando a api
import { api } from "../services/apiClient";

// importando lib de notificação
import { toast } from "react-toastify";


type AuthContextData = {
    user: UserProps;
    isAuthenticated: boolean;
    signIn: (credentials: SignInProps) => Promise<void>;
    singOut: () => void;
    signUp: (credentials: SignUpProps) => Promise<void>;
}

type UserProps = {
    id: string;
    name: string;
    email: string;
}

type SignInProps = {
    email: string;
    password: string;
}

type SignUpProps = {
    name: string;
    email: string;
    password: string;
}

type AuthProviderProps ={
    children: ReactNode;
}


export const AuthContext = createContext({} as AuthContextData)

export function singOut(){
    try {
        destroyCookie(undefined, '@nextauth.token')
        Router.push('/')
    } catch (error) {
        console.log("Erro ao tentar sair.")
    }
}

export function AuthProvider({children}: AuthProviderProps){

    const [user, setUser] = useState<UserProps>()
    const isAuthenticated = !!user;

    // função de login na aplicação
    async function signIn({email, password}: SignInProps){
        try {
            const response = await api.post('/session', {
                email,
                password
            })
            //console.log(response.data)

            //salvando os dados do usuário no cookie
            const {id, name, token} = response.data;
            setCookie(undefined, '@nextauth.token', token, {
                maxAge: 60 * 60 * 24 * 30, // dados do cookie expiram em 1 mês
                path: '/' // Quais caminhos tem acesso ao cookie
            })

            setUser({
                id,
                name,
                email,
            })

            //passar para as próximas requisições o token
            api.defaults.headers['Authorizarion'] = `Bearer ${token}`

            //Personalizando alerta
            toast.success('Bem-vindo');

            //redirecionar o usuário para a pagina inicial
            Router.push('/dashboard')

        } catch (error) {
            toast.error('Verifique os dados inseridos e tente acessar novamente.')
            console.log("erro ao acessar o sistema. ", error)
        }
    }


    //função de cadastro do usuário no banco de dados.
    async function signUp({name, email, password}: SignUpProps){
        try {
            const response = api.post('/users', {
                name,
                email,
                password
            });

            toast.success('Usuário cadastrado com sucesso!');
            
            Router.push('/');

        } catch (error) {
            toast.error('Erro ao tentar realizar o cadastro.')
            console.log('Erro ao cadastrar usuário ', error)
        }
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, signIn, singOut, signUp}}>
            {children}
        </AuthContext.Provider>
    )
}