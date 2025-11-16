import Head from 'next/head'
import { api } from '../lib/ghost'

export default function Post({ post }: { post: any }) {
  return (
    <main style={{ maxWidth: 760, margin: '40px auto', padding: '0 16px' }}>
      <Head>
        <title>{post.title}</title>
        <meta name="description" content={post.excerpt || ''} />
        <link rel="canonical" href={post.url} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt || ''} />
        {post.feature_image ? <meta property="og:image" content={post.feature_image} /> : null}
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <h1>{post.title}</h1>
      <article dangerouslySetInnerHTML={{ __html: post.html }} />
    </main>
  )
}

export async function getStaticPaths() {
  const posts = await api.posts.browse({ limit: 50 })
  const paths = posts.map((p: any) => ({ params: { slug: p.slug } }))
  return { paths, fallback: 'blocking' }
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const post = await api.posts.read({ slug: params.slug }, { include: ['tags', 'authors'] })
  return { props: { post }, revalidate: 300 }
}