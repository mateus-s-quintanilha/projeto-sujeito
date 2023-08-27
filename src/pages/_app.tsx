import React from 'react'
import type { AppProps } from 'next/app'
import '@/styles/global.scss'
import { Header } from '@/components/Header'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <React.Fragment>
      <Header />
      <Component {...pageProps} />
    </React.Fragment>
  )
}
