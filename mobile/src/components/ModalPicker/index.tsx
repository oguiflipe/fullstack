import React from "react";
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    Dimensions,
    ScrollView
} from "react-native";

import { CategoryProps } from "../../pages/Order";

//tipagem para o modal
interface ModalPickerProps{
    options: CategoryProps[];
    handleCloseModal: () => void;
    selectedItem: (item: CategoryProps) => void;
}

//pegando a dimenção da tela do usuário
const {width: WHIDTH, height: HEIGHT} = Dimensions.get("window")


export function ModalPicker({options, handleCloseModal, selectedItem}: ModalPickerProps){
    
    function onPressItem(item: CategoryProps){
        selectedItem(item)
        handleCloseModal();
    }

    //acessando informações 
    const option = options.map((item, index) => (
        <TouchableOpacity 
        key={index} 
        style={styles.option}
        onPress={() => onPressItem(item)}
        >
            <Text style={styles.item}>{item?.name}</Text>
        </TouchableOpacity>
        )
    )
    
    return(
    <TouchableOpacity onPress={handleCloseModal} style={styles.container}>
        <View style={styles.content}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {option}
            </ScrollView>
        </View>
    </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    content: {
        width: WHIDTH - 20,
        height: HEIGHT / 2,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#8a8a8a',
        borderRadius: 4
    },
    option:{
        alignItems: "flex-start",
        borderTopWidth: 0.8,
        borderColor: "#8a8a8a"
    },
    item:{
        margin: 18,
        fontSize: 14,
        fontWeight: "bold",
        color: '#101026'
    }
})