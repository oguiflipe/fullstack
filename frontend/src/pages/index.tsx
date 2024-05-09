import { useContext, FormEvent, useState } from "react";

import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import styles from '@/src/styles/home.module.scss'
import logoImg from '../../public/logopizzaria.png';

//components
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/button";

//impoirtando o contexto para controle de acesso da aplicação
import { AuthContext } from "../contexts/AuthContext";

//importando lib de notificações
import { toast } from "react-toastify";

//importando funcionalidade para validar o login
import { canSSRGuest } from "../utils/canSSRGuest";



export default function Home() {
  
  //constante para armazenar a chamada do backend
  const { signIn } = useContext(AuthContext)

  //armazenando os estados das senhas e emails
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [loading, setLoading] = useState(false)
  

  //função para realizar o login na aplicação.
  async function handeLogin(event: FormEvent) {
    event.preventDefault();

    // Verificando se o usuário enviou alguma coisa no corpo do body
    if(email === '' || password === ''){
      toast.error("Preencha os campos de e-mail e senha.")
      return;
    }

    // configurando a animação do login.
    setLoading(true);

    //variavel para armazenar os dados passados pelo usuário.
    let data = {
      email,
      password
    }
    //aguuardando os dados enviados pelo body e enviando para o backend
    await signIn(data);

    //após o envio dos dados a animação de loading é desativada
    setLoading(false);
  }

  return (
    <>
      <Head>
        <title>Faça seu login</title>
      </Head>
      <div className={styles.containerCenter}>
        <Image className={styles.image} src={logoImg} alt="Logo da pizzaria" />

        <div className={styles.login}>  
          <form onSubmit={handeLogin}>
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
              Acessar
            </Button>
          </form>

          <Link legacyBehavior href="/signup" >
            <a className={styles.text}>Não possui uma conta? Cadastre-se.</a>
          </Link>

        </div>

      </div>

    </>
  );
}



export const getServerSideProps = canSSRGuest(async (ctx) => {

  return{
    props:{}
  }
});