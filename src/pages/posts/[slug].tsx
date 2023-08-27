import styles from '@/pages/posts/post.module.scss'
import { getPrismicClient } from '@/services/prismic'
import { GetServerSideProps } from 'next'
import Prismic from '@prismicio/client'
import { RichText } from 'prismic-dom'
import Head from 'next/head'
import Image from 'next/image'

interface PostProps {
    post: {
        slug: string;
        title: string;
        description: string,
        cover: string;
        updatedAt: string;
    }
}

export default function Post({ post }: PostProps) {

    return (
        <>
            <Head>
                <title>{post.title}</title>
            </Head>
            <main className={styles.container}>
                <article className={styles.post}>
                    <Image 
                     src={post.cover}
                     height={410}
                     width={720}
                     alt={post.title}
                     placeholder='blur'
                     blurDataURL='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mO0qAcAAPUAuT9a4OoAAAAASUVORK5CYII='
                    />

                    <h1>{post.title}</h1>
                    <time>{post.updatedAt}</time>
                    <div className={styles.postContent} dangerouslySetInnerHTML={{__html: post.description}}>

                    </div>
                </article>
            </main>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {
    const prismic = getPrismicClient(req)
    const { slug }: any = params

    console.log('slug aq: ', slug);
    

    const response = await prismic.getByUID('post', String(slug), {})

    if(!response) {
        return {
            redirect: {
                destination: '/posts',
                permanent: false
            }
        }
    }

    const post = {
        slug: slug,
        title: RichText.asText(response.data.title),
        description: RichText.asHtml(response.data.description),
        cover: response.data.cover.url,
        updatedAt: new Date(response.last_publication_date as string).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        })
    }

    return {
        props: {
            post
        }
    }
}