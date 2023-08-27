import styles from '@/components/Header/styles.module.scss'
import Image from 'next/image'
import logo from '../../../public/images/logo.svg'
import Link from 'next/link'

import { ActiveLink } from '../ActiveLink'


export function Header() {
    return (
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <Link href={'/'}>
                    <Image src={logo} alt='Sujeito Programador Logo' />
                </Link>

                <nav>
                    <ActiveLink href={'/'} activeClassName={styles.active} label={'Home'} />

                    <ActiveLink href={'/posts'} activeClassName={styles.active} label={'Conteúdos'} />

                    <ActiveLink href={'/sobre'} activeClassName={styles.active} label={'Quem somos?'} />
                </nav>

                <a href="https://sujeitoprogramador.com" type='button' className={styles.readyButton}>Começar</a>
            </div>
        </header>
    )
}