import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="zh">
      <Head>
        <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />

        <meta property="og:site_name" content="可莉档案袋" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="zh_CN" />
        <meta property="og:image" content="/avatar.svg" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:image" content="/avatar.svg" />

        <link rel="icon" href="/avatar.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;700;900&family=Noto+Serif+SC:wght@400;500;700&display=swap" rel="stylesheet" />
        <link rel="alternate" type="application/rss+xml" title="RSS Feed" href="/rss.xml" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
} 
