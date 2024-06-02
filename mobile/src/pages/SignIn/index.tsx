import React, { useContext, useState} from "react";

import { 
    View, 
    Text, 
    StyleSheet,
    Image,
    TextInput,
    TouchableOpacity
} from "react-native";

import { AuthContext } from "../../contexts/AuthContext";


export default function SignIn(){

    const { signIn} = useContext(AuthContext);


    //armazenando as informações em um estado
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Validando se o usuário digitou algo no input
    async function handleLogin(){
        if(email === '' || password === ''){
            return;
        }

        // Logando usuário
        await signIn({email, password})
    }


    return(
        <View style={styles.container}>
            <Image 
                style={styles.logo} 
                source={require("../../assets/logo.png")}
            />

            <View style={styles.inputContainer}>
                <TextInput 
                style={styles.input}
                placeholder="Digite seu e-mail"
                placeholderTextColor='#f0f0f0'
                value={email}
                onChangeText={setEmail}
                />
                <TextInput 
                style={styles.input}
                placeholder="Digite sua senha"
                placeholderTextColor='#f0f0f0'
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
                />

                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.textButton}>Entrar</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#1d1d2e'
    },
    logo:{
        marginBottom: 18,
    },
    inputContainer:{
        width: '95%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 32,
        paddingHorizontal: 14
    },
    input:{
        width: '95%',
        height: 40,
        backgroundColor: '#101025',
        marginBottom: 12,
        borderRadius: 4,
        paddingHorizontal: 8,
        color: '#fff'
    },
    button:{
        justifyContent: "center",
        alignItems: "center",
        width: '95%',
        height: 40,
        backgroundColor: "#3fffa3",
        borderRadius: 4
    },
    textButton:{
        color: "#101026",
        fontWeight: 'bold',
        fontSize: 18
    }
})