import Head from 'next/head'
import styles from '@/pages/posts/styles.module.scss'
import Link from 'next/link'
import Image from 'next/image'
import { FiChevronLeft, FiChevronsLeft, FiChevronRight, FiChevronsRight } from 'react-icons/fi'
import { GetStaticProps } from 'next'
import { getPrismicClient } from '@/services/prismic'
import Prismic from '@prismicio/client'
import { RichText } from 'prismic-dom'
import { useState } from 'react'

type Post = {
  slug: string;
  title: string;
  cover: string;
  description: string;
  updatedAt: string;
}

interface PostsProps {
  posts: Post[];
  page: string;
  totalPage: string;
}


export default function Posts({ posts: postsBlog, page, totalPage }: PostsProps) {
  const [currentPage, setCurrentPage] = useState(Number(page))
  const [posts, setPosts] = useState(postsBlog || [])

  function getPaginationPages(pageNumber: number) {
    const prismic = getPrismicClient()

    const response = prismic.query([
      Prismic.Predicates.at('document.type', 'post')
    ], {
      orderings: '[document.last_publication_date desc]',  
      fetch: ['post.title', 'post.description', 'post.cover'],
      pageSize: 1,
      page: String(pageNumber)
    })

    return response
  }

  async function handlePagination(pageNumber: number) {
    const response = await getPaginationPages(pageNumber)
    
    if(response.results.length === 0) {
      return console.log('entrou aq');
    }

    const getPosts = response.results.map(post => {
      return {
        slug: post.uid,
        title: RichText.asText(post.data.title),
        description: post.data.description.find((content: any) => content.type === 'paragraph')?.text ?? '',
        cover: post.data.cover.url,
        updateAt: new Date(post.last_publication_date as string).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        })
      }
    })

    setCurrentPage(pageNumber)
    setPosts(getPosts as any)
  }

  return (
    <>
      <Head>
        <title>Blog - Sujeito programador</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>

          {posts.map((post) => (
            <Link key={post.slug} href={`posts/${post.slug}`}>
              <Image
                src={post.cover}
                alt='Post título 1'
                width={720}
                height={410}
                quality={100}
                placeholder='blur'
                blurDataURL='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mO0qAcAAPUAuT9a4OoAAAAASUVORK5CYII='
              />
              <strong>{post.title}</strong>
              <time>{post.updatedAt}</time>
              <p>{post.description}</p>
            </Link>
          ))}

          <div className={styles.buttonNavigate}>
            {Number(currentPage) === 1 ? (
              <div>
                <button style={{ opacity: .5 }}>
                  <FiChevronsLeft size={25} color="#FFF" />
                </button>

                <button style={{ opacity: .5 }}>
                  <FiChevronLeft size={25} color="#FFF" />
                </button>
              </div>
            ) : (
              <div>
                <button onClick={() => handlePagination(1)}>
                  <FiChevronsLeft size={25} color="#FFF" />
                </button>

                <button onClick={() => handlePagination(Number(currentPage - 1))} >
                  <FiChevronLeft size={25} color="#FFF" />
                </button>
              </div>
            )}

            { currentPage === Number(totalPage) ? (
              <div>
                <button style={{opacity: .5}} >
                  <FiChevronRight size={25} color="#FFF" />
                </button>

                <button style={{opacity: .5}} >
                  <FiChevronsRight size={25} color="#FFF" />
                </button>
              </div>
            ) : (
              <div>
                <button onClick={() => handlePagination(Number(currentPage + 1))}>
                  <FiChevronRight size={25} color="#FFF" />
                </button>

                <button onClick={() => handlePagination(Number(totalPage))}>
                  <FiChevronsRight size={25} color="#FFF" />
                </button>
              </div>
            )}
          </div>

        </div>
      </main>
    </>
  )
}


export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient()

  const response = await prismic.query([
    Prismic.Predicates.at('document.type', 'post')
  ], {
    orderings: '[document.last_publication_date desc]',  // Ordenar pelo mais novo
    fetch: ['post.title', 'post.description', 'post.cover'],
    pageSize: 1
  })

  const posts = response.results.map(post => {
    return {
      slug: post.uid,
      title: RichText.asText(post.data.title),
      description: post.data.description.find((content: any) => content.type === 'paragraph')?.text ?? '',
      cover: post.data.cover.url,
      updateAt: new Date(post.last_publication_date as string).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
    }
  })

  return {
    props: {
      posts,
      page: response.page,
      totalPage: response.total_pages
    },
    revalidate: 60 * 30   // Atualiza a cada 30 min
  }
}