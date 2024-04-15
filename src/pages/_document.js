import Document, { Head, Html, Main, NextScript } from 'next/document';

class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx);
        console.log(initialProps)
        return { ...initialProps };
    }

    render() {
        return (
            <Html lang="en" suppressHydrationWarning={true}>
                <Head>
                    <link
                        id="theme-css"
                        href={`/themes/lara-light-indigo/theme.css`}
                        rel="stylesheet"
                    ></link>
                </Head>
                <body suppressHydrationWarning={true}>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
