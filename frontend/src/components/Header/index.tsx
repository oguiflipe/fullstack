import { useContext } from "react"

import styles from "./styles.module.scss"
import Link from "next/link"
import { FiLogOut } from "react-icons/fi"


import { AuthContext } from "@/src/contexts/AuthContext"


export function Header(){

    const {user, singOut} = useContext(AuthContext);

    return(
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <Link href={"/dashboard"}>
                    <img src="/logopizzaria.png" width={80} height={80}/>
                </Link>
                
                <div className={styles.headerUser}>
                    <p>Usuário logado:</p>
                    <h1>{user?.name}</h1>
                </div>
                

                <nav className={styles.headerNav}>
                    <Link legacyBehavior href="/category">
                        <a>Categoria</a>
                    </Link>

                    <Link legacyBehavior href="/product">
                        <a>Cardapio</a>
                    </Link>

                    <button onClick={singOut}>
                        <FiLogOut color="#fff" size={24}/>
                    </button>
                </nav>
            </div>
        </header>
    )
}


