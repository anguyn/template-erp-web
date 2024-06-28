import React, { useEffect } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import {useRouter} from 'next/router';
import dynamic from 'next/dynamic';
import { ThemeProvider as NextThemeProvider } from 'next-themes';
import PrimeReact from 'primereact/api';
import { useLayoutStore } from '@/stores/layoutStore';
import { shallow } from 'zustand/shallow';
import '@ui5/webcomponents-icons/dist/AllIcons.js';
import Layout from '@/layout/layout';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import '@/styles/globals.css';
import '@/styles/demo/Demos.scss';
import '@/styles/layout/layout.scss';

const Toaster = dynamic(() => import('react-hot-toast').then((c) => c.Toaster), {
    ssr: false,
});

export default function MyApp({ Component, pageProps }) {
    const router = useRouter();
    const layoutConfig = useLayoutStore((state) => state.layoutConfig, shallow);

    useEffect(() => {
        const currentLayoutStore = JSON.parse(localStorage.getItem('Layout Store'));
        if (currentLayoutStore) {
            const currentTheme = currentLayoutStore?.state?.layoutConfig?.theme;
            PrimeReact.changeTheme('lara-light-indigo', currentTheme, 'theme-css', () => {
                console.log('Theme changed successfully!');
            });
        }
    }, []);

    if (Component.getLayout) {
        return (
            <NextIntlClientProvider
                locale={router.locale}
                timeZone="Europe/Vienna"
                messages={pageProps.messages}
            >
                {Component.getLayout(
                    <NextThemeProvider>
                        <>
                            <Component {...pageProps} />
                            <Toaster
                                position="top-center"
                                reverseOrder={false}
                                gutter={8}
                                containerClassName=""
                                containerStyle={{}}
                                toastOptions={{
                                    className: '',
                                    duration: 3000,
                                    style: {
                                        background: '#363636',
                                        color: '#fff',
                                    },
                                    success: {
                                        duration: 3000,
                                        theme: {
                                            primary: 'green',
                                            secondary: 'black',
                                        },
                                    },
                                }}
                            />
                        </>
                    </NextThemeProvider>
                )}
            </NextIntlClientProvider>
        );
    } else {
        return (
            <NextIntlClientProvider
                locale={router.locale}
                timeZone="Europe/Vienna"
                messages={pageProps.messages}
            >
                <NextThemeProvider>
                    <Layout>
                        <Component {...pageProps} />
                        <Toaster
                            position="top-center"
                            reverseOrder={false}
                            gutter={8}
                            containerClassName=""
                            containerStyle={{}}
                            toastOptions={{
                                className: '',
                                duration: 3000,
                                style: {
                                    background: '#363636',
                                    color: '#fff',
                                },
                                success: {
                                    duration: 3000,
                                    theme: {
                                        primary: 'green',
                                        secondary: 'black',
                                    },
                                },
                            }}
                        />
                    </Layout>
                </NextThemeProvider>
            </NextIntlClientProvider>
        );
    }
}
