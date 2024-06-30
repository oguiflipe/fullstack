import React, {useContext} from "react";

import { View, ActivityIndicator } from "react-native";

import AppRoutes from "./app.routes";
import AuthRoutes from "./auth.routes";

import { AuthContext } from "../contexts/AuthContext";

function Routes(){

    const {isAuthenticated, loading} = useContext(AuthContext)



    // Carregando e mostrando o login para o usuário
    if(loading){
        return(
            <View style={
                {flex: 1, 
                backgroundColor: '#1d1d2e',
                justifyContent: 'center',
                alignItems: 'center'
                }}
            >
                <ActivityIndicator  size={60} color="#fffafa"/>
            </View>
        )
    }


    return(
        isAuthenticated ? <AppRoutes/> : <AuthRoutes/>
    )
}

export default Routes;