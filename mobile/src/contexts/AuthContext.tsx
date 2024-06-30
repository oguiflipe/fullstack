import React, {useState, createContext, ReactNode, useEffect} from "react";

//api para ter acesso ao banco de dados criado
import { api } from "../services/api";

//importando o async para manter o usuario logado pelo token e abrir o app logado dps do primeiro login
import AsyncStorage from "@react-native-async-storage/async-storage";

type AuthContextData = {
    user: UserProps;
    isAuthenticated: boolean;
    signIn: (credentials: SignInProps) => Promise<void>
    loadingAuth: boolean;
    loading: boolean;
    signOut: () => Promise<void>;
}

type UserProps = {
    id: string,
    name: string,
    email: string,
    token: string
}

type AuthProviderProps = {
    children: ReactNode;
}

type SignInProps = {
    email: string,
    password: string;
}

export const AuthContext = createContext({} as AuthContextData);


export function AuthProvider({children}: AuthProviderProps){

    const [user, setUser] = useState<UserProps>({
        id: '',
        name: '',
        email: '',
        token: ''
    })

    const [loadingAuth, setLoadingAuth] = useState(false);

    const [loading, setLoading] = useState(true);

    const isAuthenticated = !!user.name; 

    //permanecendo com o usuário logado após o login
    useEffect(() => {
        async function getUser(){
            //pegando os dados salvos do usuário
            const userInfo = await AsyncStorage.getItem('@userPizzaria');

            //caso o usuário não tenha feito login, retorna vazio.
            let hasUser: UserProps = JSON.parse(userInfo || '{}');

            //verificando se recebemos os dados do usuário
            if(Object.keys(hasUser).length > 0){
                //informando por padrão o token
                api.defaults.headers.common['Authorization'] = `Bearer ${hasUser.token}`;

                setUser({
                    id: hasUser.id,
                    name: hasUser.name,
                    email: hasUser.email,
                    token: hasUser.token
                })
            }
            setLoading(false)
        }

        getUser();
    }, []);

    // Metodo de login - validando os dados do usuário 
    async function signIn({email, password}: SignInProps){
        setLoadingAuth(true)

        try {
            const response = await api.post('/session', {
                email,
                password
            })

            //console.log(response.data)

            //pegando as informações do usuário: - dados de retorno
            const {id, name, token} = response.data;

            //convertendo os dados para string
            const data = {
                ...response.data
            }

            //salvando os dados no mobile
            await AsyncStorage.setItem('@userPizzaria', JSON.stringify(data))

            //informando por padrão o token
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            setUser({
                id,
                name,
                email,
                token
            })

        } catch (error) {
            console.log('Erro ao acessar ' + error);
            setLoadingAuth(false);
        }
    }


    //metodo de logout 
    async function signOut() {
        await AsyncStorage.clear()
        .then(() => {
            setUser({
                id: '',
                name: '',
                email: '',
                token: ''
            })
        })
    }


    return(
        // Todas as paginas dentro do AuthContext
        <AuthContext.Provider 
            value={{
                user,
                isAuthenticated, 
                signIn, 
                signOut, 
                loading, 
                loadingAuth
            }}>
            {children}
        </AuthContext.Provider>
    )
}