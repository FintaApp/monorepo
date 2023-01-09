import Document, { Html, Head, Main, NextScript } from 'next/document'
import { AnalyticsBrowser } from '@segment/analytics-next';
import * as snippet from '@segment/snippet';
const analytics = AnalyticsBrowser.load({ writeKey: process.env.NEXT_PUBLIC_SEGMENT_KEY! });

class MyDocument extends Document {
  static async getInitialProps(ctx: any) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  renderSnippet() {
    const opts = {
      apiKey: process.env.NEXT_PUBLIC_SEGMENT_KEY!,
      page: true
    }

    return snippet.min(opts)
  }

  render() {
    return (
      <Html>
        <Head>
          <script dangerouslySetInnerHTML = {{ __html: this.renderSnippet() }} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument