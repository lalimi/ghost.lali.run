import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="uk">
      <Head>
        <script src="https://analytics.ahrefs.com/analytics.js" data-key={process.env.NEXT_PUBLIC_AHREFS_ANALYTICS_KEY || 'T5uvrdFYZyEqK2g1QYCwBg'} async />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}