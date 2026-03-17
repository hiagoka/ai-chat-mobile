import { useState } from "react"
import { View, TextInput, TouchableOpacity } from "react-native"

import {MaterialIcons} from '@expo/vector-icons'

import { styles } from "./styles"
import { Colors } from "@/constants/theme"

type Props = {
    onSend: (text: string) => void
}

export function ChatInput({onSend}: Props){
    const [text, setText] = useState("")

    const handleSend = () => {
        if (!text.trim()) return;

        onSend(text)
        setText("")
    }

    return (
        <View style={styles.container}>
            <TextInput 
            style= {styles.input}
            placeholder="Digite uma mensagem..."
            placeholderTextColor={Colors.placeholder}
            value={text}
            onChangeText={setText}
            onSubmitEditing={handleSend}
            returnKeyType="send"
            />
            <TouchableOpacity onPress={handleSend}>
                <MaterialIcons name="send" size={35} color= {Colors.primary}/>
            </TouchableOpacity>
        </View>
    )
}