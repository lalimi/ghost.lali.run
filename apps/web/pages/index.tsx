import Link from 'next/link'
import { api } from '../lib/ghost'

export default function Home({ posts }: { posts: any[] }) {
  return (
    <main style={{ maxWidth: 760, margin: '40px auto', padding: '0 16px' }}>
      <h1>Блог</h1>
      <ul>
        {posts.map((p) => (
          <li key={p.id} style={{ marginBottom: 20 }}>
            <h2>
              <Link href={`/${p.slug}`}>{p.title}</Link>
            </h2>
            <p>{p.excerpt}</p>
          </li>
        ))}
      </ul>
    </main>
  )
}

export async function getStaticProps() {
  const posts = await api.posts.browse({ limit: 'all', include: ['tags', 'authors'] })
  return { props: { posts }, revalidate: 120 }
}