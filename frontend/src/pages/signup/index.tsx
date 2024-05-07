import { useState, FormEvent, useContext } from "react";

import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import styles from '@/src/styles/home.module.scss'
import logoImg from '../../../public/logopizzaria.png';

//components
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/button";


//chamando o serviço para cadastrar o usuário
import { AuthContext, singOut } from "@/src/contexts/AuthContext";

//importando lib de notificações
import { toast } from "react-toastify";

export default function SignUp(){

  //chamando o backend
  const {signUp} = useContext(AuthContext);

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [loading, setLoading] = useState(false)


  //função para cadastrar o usuário no sistema.
  async function handleSignUp(event: FormEvent){
    event.preventDefault();

    //verificando se algo foi digitado
    if(name === '' || email === '' || password === ''){
      toast.error('Ensira todos os dados solicitados.')
      return;
    }

    setLoading(true);

    let data = {
      name,
      email,
      password
    }
    
    await signUp(data);


    setLoading(false);
    
  }

  return (
    <>
      <Head>
        <title>Faça seu cadastro!</title>
      </Head>
      <div className={styles.containerCenter}>
        <Image className={styles.image} src={logoImg} alt="Logo da pizzaria" />

        

        <div className={styles.login}>  
          <form onSubmit={handleSignUp}>
            <h1>Criando sua conta.</h1>
            <Input 
              placeholder="Digite seu nome"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input 
              placeholder="Digite seu e-mail"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input 
              placeholder="Digite sua senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button 
            type="submit"
            loading={loading}
            >
              Cadastrar
            </Button>
          </form>

          <Link legacyBehavior href="/" >
            <a id="link" className={styles.text}>Já possui uma conta? Faça o login.</a>
          </Link>
          
        </div>

      </div>

    </>
  );
}
