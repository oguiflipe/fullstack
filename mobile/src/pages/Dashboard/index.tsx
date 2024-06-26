import React, {useContext, useState} from "react"
import { SafeAreaView, TouchableOpacity, TextInput,StyleSheet, Text } from "react-native"

//navegação 
import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types"
//importanto tipagem da navegação
import { StackParmsList } from "../../Routes/app.routes"

//importando a api
import { api } from "../../services/api"

//importando o contexto
import { AuthContext } from "../../contexts/AuthContext"

export default function Dashboard() {

    const navigation = useNavigation<NativeStackNavigationProp<StackParmsList>>();

    const {signOut} = useContext(AuthContext)

    //coletando os dados da mesa e salvando
    const [number, setNumber] = useState('')

    async function openOrder() {
        //se não for digitado algo na mesa, retorna 
        if(number === ''){
            return;
        }

        //se sim, precisa abrir a mesa e redirecionar para a próxima tela.
        const response = await api.post('/order', {
            table: Number(number)
        })

        navigation.navigate('Order', {number: number, order_id: response.data.id})
        
        setNumber("")
    }
    
    return(
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Novo Pedido</Text>

            <TextInput 
                placeholder="Número da mesa"
                placeholderTextColor="#f0f0f0"
                style={styles.input}
                keyboardType="numeric"
                value={number}
                onChangeText={setNumber}
            />

            <TouchableOpacity style={styles.button} onPress={openOrder}>
                <Text style={styles.buttonText}>Abrir mesa</Text>
            </TouchableOpacity>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 15,
        backgroundColor: "#1d1d2e"
    },
    title:{
        fontSize: 30, 
        fontWeight: "bold",
        color : "#fff",
        marginBottom: 24
    },
    input: {
        width: '90%',
        height: 60,
        backgroundColor: '#101026',
        borderRadius: 4,
        paddingHorizontal: 8,
        textAlign: "center",
        fontSize: 22,
        color: "#fff"
    },
    button:{
        width: "90%",
        height: 40,
        backgroundColor: "#3fffa3",
        borderRadius: 4,
        marginVertical: 12,
        justifyContent: "center",
        alignItems: "center"
    },
    buttonText: {
        fontSize: 18,
        color: "#101026",
        fontWeight: "bold"
    }
})