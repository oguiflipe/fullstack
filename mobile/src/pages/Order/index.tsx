import React, {useEffect, useState} from "react";

import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity,
    TextInput,
    Modal,
    FlatList
} from "react-native";

import {Feather} from "@expo/vector-icons"

// necessário para coletar os dados passados pela tela anterior
import { useRoute, RouteProp, useNavigation} from "@react-navigation/native";

//importando a navegação 
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParmsList } from "../../Routes/app.routes";

//importando api
import { api } from "../../services/api";

//importando o componente
import { ModalPicker } from "../../components/ModalPicker";
//importando o flatlist
import { ListItem } from "../../components/ListItem";

//criando uma tipagem
type RoutDetailParams = {
    Order: {
        number: string | number;
        order_id: string;
    }
}
type OrderRouteProps = RouteProp<RoutDetailParams, "Order">;

//tipagem para informar os itens da categoria
export type CategoryProps = {
    id: string;
    name: string;
}

//tipagem dos produtos no modal
type ProductsProps = {
    id: string;
    name: string;
}

//tipagem para a lista.
type ItemProps = {
    id: String;
    product_id: String;
    name: String;
    amount: String | number;
} 


export default function Order(){
    //pegando as informações da tela anterior
    const route = useRoute<OrderRouteProps>();

    //navegando de volta para a tela anterior
    const navigation = useNavigation<NativeStackNavigationProp<StackParmsList>>();

    //criando estados para armazenar as listagens
    const [category, setCategory] = useState<CategoryProps[] | []>([]);
    //estado para armazenar qual está selecionada atualmente
    const [categorySelected, setCategorySelected] = useState<CategoryProps | undefined>()
    // controlando o modal
    const [modalCaterogyVisible, setModalCaterogyVisible] = useState(false)


    //criando estados para as categorias
    const [products, setProducts] = useState<ProductsProps[] | []>([])
    //produto slecionado
    const [productSelected, setProductSelected] = useState<ProductsProps | undefined>()
    //controle do modal
    const [modalProductVisible, setModalProductVisible] = useState(false)

    //salvando o que está sendo digitado no input da quantidade
    const [amount, setAmount] = useState('1')

    //criando estado para armazenar os dados da lista de produtos
    const [items, setItems] = useState<ItemProps[]>([])

    //buscando as categorias
    useEffect(() => {
        async function loadInfo() {
            const response = await api.get('/category')

            //colocando dentro do array do state\
            setCategory(response.data)
            setCategorySelected(response.data[0])

        }

        //chamando a função para ser executada
        loadInfo();
    }, [])

    //useEffect para controlar a categoria que é apresentada no modal
    useEffect(() => {
        //existe dependencia
        async function loadProducs() {
            const response = await api.get('/category/product', {
                params:{
                    category_id: categorySelected?.id
                }
            })
            
            setProducts(response.data);
            setProductSelected(response.data[0]);
        }

        loadProducs();

    }, [categorySelected])

    //Função para realizar o fechamento da mesa.
    async function handleCloseOrder() {
        try {
            await api.delete("/order", {
                params: {
                    order_id: route.params?.order_id
                }
            })
            //voltando uma tela para trás
            navigation.goBack();
        } catch (error) {
             console.log(error)
        }
    }

    //recebendo as informações e alterando o modal"
    function handleChangeCategory(item: CategoryProps){
        setCategorySelected(item);
    }

    //recebendo as informações do modal
    function handleChangeProduct(item: ProductsProps){
        setProductSelected(item)
    }

    //função para adicionar os pedidos
    async function handleAdd() {
        const response = await api.post('/order/add', {
            order_id: route.params?.order_id,
            product_id: productSelected?.id,
            amount: Number(amount)
        })

        let data = {
            id: response.data.id,
            product_id: productSelected?.id as string,
            name: productSelected?.name as string,
            amount: amount
        }

        setItems(oldArray => [...oldArray, data])
    }

    //função para avançar com a order
    async function handleFinishOrder() {
        navigation.navigate('FinishOrder', {
            number: route.params.number, 
            order_id: route.params?.order_id
        })
    }

    //deletando produtos do pedido
    async function handleDeleteItem(item_id: string) {
        await api.delete('/order/remove', {
            params:{
                item_id: item_id
            }
        })

        //apos remover removemos o item da lista 
        let removeItems = items.filter(item => {
            return (item.id !== item_id)
        })

        setItems(removeItems)
    }

    return(
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Mesa {route.params.number}</Text>
                {items.length === 0 && (
                    <TouchableOpacity onPress={handleCloseOrder}>
                        <Feather name="trash-2" size={28} color="#ff3f4b" />
                    </TouchableOpacity>
                )} 
            </View>
        
            {category.length !== 0 && (
                <TouchableOpacity style={styles.input} onPress={() => setModalCaterogyVisible(true)}>
                    <Text style={{color: "#fff"}}>
                        {categorySelected?.name}
                    </Text>
                </TouchableOpacity>
            )}
            
            {products.length !== 0 && (
                <TouchableOpacity style={styles.input} onPress={() => setModalProductVisible(true)}>
                    <Text style={{color: "#fff"}}>
                        {productSelected?.name}
                    </Text>
                </TouchableOpacity>
            )}

            <View style={styles.qtdContainer}>
                <Text style={styles.qtdTitle}>Quantidade</Text>

                <TextInput 
                    style={[styles.input, {width: '60%', textAlign: "center"}]}
                    value={amount}
                    onChangeText={setAmount}
                    placeholderTextColor="#f0f0f0"
                    keyboardType="numeric"
                />
            </View>

            <View style={styles.actions}>
                <TouchableOpacity style={styles.buttonAdd} onPress={handleAdd}>
                    <Text style={styles.buttonText}>+</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.button, {opacity: items.length === 0 ? 0.3 : 1}]}
                    disabled={items.length === 0}
                    onPress={handleFinishOrder}
                >
                    <Text style={styles.buttonText}>Avançar</Text>
                </TouchableOpacity>
            </View>

            <FlatList 
                showsVerticalScrollIndicator={false}
                style={{flex: 1, marginTop: 24}}
                data={items}
                keyExtractor={(item) => item.id}
                renderItem={ ({ item }) => <ListItem data={item} deleteItem={handleDeleteItem} /> }
            
            />


            <Modal
            transparent={true}
            visible={modalCaterogyVisible}
            animationType="slide"
            >
                <ModalPicker 
                    handleCloseModal={ () => setModalCaterogyVisible(false)}
                    options={category}
                    selectedItem={handleChangeCategory}
                />
            </Modal>

            <Modal
            transparent={true}
            visible={modalProductVisible}
            animationType="slide"
            >
                <ModalPicker 
                    handleCloseModal={ () => setModalProductVisible(false)}
                    options={products}
                    selectedItem={handleChangeProduct}
                />
            </Modal>


           
        </View>
    )

}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        paddingVertical: "5%",
        backgroundColor: "#1d1d2e",
        paddingEnd: "4%",
        paddingStart: "4%",
    },
    header:{
        flexDirection: "row",
        marginBottom: 12,
        alignItems: "center",
        marginTop: 24
    }, 
    title:{
        fontSize: 30,
        fontWeight: "bold",
        color: "#fff",
        marginRight: 14
    },
    input:{
        backgroundColor: "#101026",
        borderRadius: 4,
        width: '100%',
        height: 40,
        marginBottom: 12,
        justifyContent: "center",
        paddingHorizontal: 8,
        color: '#fff',
        fontSize: 20
    },
    qtdContainer: {
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: 'space-between',
        paddingTop: 15
    },
    qtdTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFF'
    },
    actions: {
        flexDirection: "row",
        width: '100%',
        justifyContent: 'space-between',
        paddingTop: 15
    },
    buttonAdd: {
        width: '20%',
        backgroundColor: '#3fd1ff',
        borderRadius: 4,
        height: 40,
        justifyContent: "center",
        alignItems: "center"
    },
    buttonText:{
        color: "#fff",
        fontSize: 18,
        fontWeight: 'bold'
    },
    button: {
        backgroundColor: '#3fffa3',
        borderRadius: 4,
        height: 40,
        width: '75%',
        alignItems: "center",
        justifyContent: "center",
    }
})