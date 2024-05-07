import styles from "./styles.module.scss";

import { InputHTMLAttributes, TextareaHTMLAttributes} from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement>{}

// utiliza-se o rest para repasar as propriedades
export function Input({...rest}: InputProps){
    return(
        <input className={styles.input} {...rest}/>
    )
}


interface textAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement>{}


export function TextArea({...rest}: textAreaProps){
    return(
        <textarea className={styles.input} {...rest}></textarea>
    )
}