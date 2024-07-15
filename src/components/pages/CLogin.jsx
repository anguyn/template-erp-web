import React, { useContext, useState, useEffect, useRef, useLayoutEffect } from 'react';
import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';
// import AppConfig from '@/layout/AppConfig';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { useLayoutStore } from '@/stores/layoutStore';
import { useCompanyStore } from '@/stores/companyStore';
import { shallow } from 'zustand/shallow';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { classNames } from 'primereact/utils';

import toast from 'react-hot-toast';
import Cookies from 'js-cookie';

import { Company } from '@/service/GeneralData/Company';
import usersApi from '@/service/ServiceLayer/authApi';
import globalApi from '@/service/ServiceLayer/globalApi';
import { capitalizeWords } from '@/utils/text';

import Loader from '@/components/Loader';

const CLogin = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [companies, setCompanies] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [username, setUsename] = useState('');
    const [password, setPassword] = useState('');
    const [checked, setChecked] = useState(false);

    const t = useTranslations('Auth');
    const tG = useTranslations('General');

    const { layoutConfig } = useLayoutStore((state) => state, shallow);
    const { setCompanyInfo, setCurrencies } = useCompanyStore((state) => state, shallow);

    const router = useRouter();

    const select = useRef();
    const usernameInput = useRef();
    const passwordInput = useRef();

    const containerClassName = classNames(
        'surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden relative',
        { 'p-input-filled': layoutConfig.inputStyle === 'filled' }
    );

    const selectedCompanyTemplate = (option, props) => {
        if (option) {
            return (
                <div className="flex align-items-center">
                    <img
                        alt={option.name}
                        src="https://primefaces.org/cdn/primereact/images/flag/flag_placeholder.png"
                        className={`mr-2 flag flag-${option.country.toLowerCase()}`}
                        style={{ width: '18px' }}
                    />
                    <div>{option.name}</div>
                </div>
            );
        }

        return <span>{props.placeholder}</span>;
    };

    const companyOptionTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <img
                    alt={option.name}
                    src="https://primefaces.org/cdn/primereact/images/flag/flag_placeholder.png"
                    className={`mr-2 flag flag-${option.country.toLowerCase()}`}
                    style={{ width: '18px' }}
                />
                <div>{option.name}</div>
            </div>
        );
    };

    const handleSignIn = async (type) => {
        if (!selectedCompany) {
            toast.error(t('pleaseSelectACompanyName'));
            if (select.current) {
                select.current.show();
            }
            return;
        } else if (username.length < 1) {
            const usernameElement = usernameInput.current;
            if (usernameElement && usernameElement.classList) {
                usernameElement.classList.add('p-invalid');
                usernameElement.focus();
            }
            toast.error(t('usernameEmpty'));
            return;
        } else if (password.length < 1) {
            const passwordElement = passwordInput.current;
            if (passwordElement && passwordElement.classList) {
                passwordElement.classList.add('p-invalid');
                passwordElement.focus();
            }
            toast.error(t('enterPassword'));
            return;
        }
    
        if (type === 'sap') {
            setIsLoading(true);
    
            try {
                const loginResult = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        company: selectedCompany?.code,
                        username,
                        password,
                    }),
                    credentials: 'include'
                });
    
                // Kiểm tra phản hồi
                if (!loginResult.ok) {
                    console.log("bị gì: ", loginResult)
                    const errorData = await loginResult.json();
                    throw new Error(errorData.message || 'Login failed');
                }
    
                // Đặt cookie nhớ người dùng nếu cần
                Cookies.set('user', username, { expires: 0.125 }); // 3 giờ (0.125 ngày)
    
                const companyInfoResult = await fetch('/api/company/get-company-info', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include'
                });
    
                if (!companyInfoResult.ok) {
                    throw new Error('Failed to fetch company info');
                }
    
                const companyInfo = await companyInfoResult.json();
    
                const currencyResult = await fetch('/api/company/get-all-currency', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include'
                });
    
                if (!currencyResult.ok) {
                    throw new Error('Failed to fetch currency data');
                }
    
                const currencies = await currencyResult.json();
    
                // Cập nhật thông tin công ty và tiền tệ
                setCompanyInfo(companyInfo);
                setCurrencies(currencies?.value || []);
                toast.success(t('signInSuccessfully'));
                router.push('/');
            } catch (error) {
                console.error('Login error:', error.message);
                // if (error.message.includes('Unauthorized')) {
                //     toast.error(t('invalidCredentials'));
                // } else {
                    toast.error(t('signInFailed') + ' ' + t('pleaseTryAgainLater'));
                // }
            } finally {
                setIsLoading(false);
            }
        } else {
            toast('Under Development', {
                icon: '👏',
            });
        }
    };
    
    // const handleSignIn = async () => {
    //     try {
    //         const response = await fetch('/api/ssb1s', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({
    //                 CompanyDB: selectedCompany?.code,
    //                 Password: username,
    //                 UserName: password,
    //             }),
    //         });

    //         if (!response.ok) {
    //             throw new Error(`HTTP error! status: ${response.status}`);
    //         }

    //         const data = await response.json();
    //         console.log('Login successful:', data);
    //     } catch (error) {
    //         console.error('Login failed:', error);
    //     }
    // };

    const handleFormKeyPress = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleSignIn('sap');
        }
    };

    useEffect(() => {
        const isAuthenticated = !!Cookies.get('user');
        if (isAuthenticated) router.replace('/');
        // else document.documentElement.style.display = 'block';

        Company.getCompany().then((companies) => {
            setCompanies(companies);
        });

        document.title = 'SAP B1 Web Client - Login';

        return () => {
            document.title = 'SAP B1 Web Client';
        };
    }, []);

    //   useEffect(() => {
    //     if (username.length < 5 && username.length > 1 ) usernameInput.current.classList.add('p-invalid');
    //     else if (username.length >= 5) usernameInput.current.classList.remove('p-invalid');

    //     if (password.length < 4 && password.length > 1) passwordInput.current.classList.add('p-invalid');
    //     else if (password.length >= 4) passwordInput.current.classList.remove('p-invalid');

    //     if (selectedCompany) select.current.classList.remove('p-invalid');
    //   }, [username, password, selectedCompany]);

    return (
        <div className={containerClassName}>
            <form
                onSubmit={(e) => e.preventDefault()}
                onKeyPress={handleFormKeyPress}
                className="flex flex-column align-items-center justify-content-center"
            >
                <img
                    src={`/images/grant-thornton-white-logo.png`}
                    alt="Grant Thornton Logo"
                    className={`${layoutConfig.colorScheme === 'dark' ? 'invert' : null
                        } mb-5 w-2 flex-shrink-0`}
                />
                <div
                    style={{
                        borderRadius: '56px',
                        padding: '0.3rem',
                        background:
                            'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)',
                    }}
                >
                    <div
                        className="w-full surface-card py-4 px-5 sm:px-8"
                        style={{ borderRadius: '53px' }}
                    >
                        <div className="text-center mb-5">
                            <div className="text-900 text-3xl font-medium mb-3">{t('welcome')}</div>
                            <span className="text-600 font-medium">{t("signIntoContinue")}</span>
                        </div>

                        <div>
                            <label
                                htmlFor="companyName"
                                className="block text-900 text-xl font-medium mb-2"
                            >
                                {t('companyName')} <span className="text-red-700">*</span>
                            </label>
                            <Dropdown
                                ref={select}
                                value={selectedCompany}
                                id="companyName"
                                onChange={(e) => setSelectedCompany(e.value)}
                                options={companies}
                                optionLabel="name"
                                placeholder={t("selectYourCompany")}
                                filter
                                valueTemplate={selectedCompanyTemplate}
                                itemTemplate={companyOptionTemplate}
                                className="w-full mb-5"
                            />

                            <label
                                htmlFor="username"
                                className="block text-900 text-xl font-medium mb-2"
                            >
                                {t("username")} <span className="text-red-700">*</span>
                            </label>
                            <InputText
                                ref={usernameInput}
                                id="username"
                                inputid="username"
                                type="text"
                                placeholder="eg. manager"
                                className="w-full mb-5 p-3"
                                value={username}
                                onChange={(e) => setUsename(e.target.value)}
                            />

                            <label
                                htmlFor="password"
                                className="block text-900 font-medium text-xl mb-2"
                            >
                                {t("password")} <span className="text-red-700">*</span>
                            </label>
                            <Password
                                inputRef={passwordInput}
                                id="password"
                                inputid="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder={t("password")}
                                toggleMask
                                feedback={false}
                                className="w-full mb-5"
                                inputClassName="w-full p-3"
                            ></Password>

                            <div className="flex align-items-center justify-content-between mb-5 gap-5">
                                <div className="flex align-items-center">
                                    <Checkbox
                                        inputId="remember-me"
                                        checked={checked}
                                        onChange={(e) => setChecked(e.checked)}
                                        className="mr-2"
                                    ></Checkbox>
                                    <label className="cursor-pointer" htmlFor="remember-me">{t("rememberMe")}</label>
                                </div>
                                <a
                                    className="font-medium no-underline ml-2 text-right cursor-pointer"
                                    style={{ color: 'var(--primary-color)' }}
                                >
                                    {t("forgotPassword")}
                                </a>
                            </div>
                            
                            <Button
                                label={t("signInWithSAPB1Account")}
                                className="w-full p-2.5 text-xl mb-3"
                                onClick={() => handleSignIn('sap')}
                            ></Button>
                            <Button
                                label={t("signInWithCompanyAccount")}
                                className="w-full p-2.5 text-xl"
                                onClick={() => handleSignIn('company')}
                                severity="secondary"
                            >
                                {' '}
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
            {isLoading && (
                <>
                    <div className="absolute top-0 left-0 w-full h-full backdrop-blur-lg bg-[rgba(202,202,202,0.65)]"></div>
                    <Loader />
                </>
            )}
        </div>
    );
};

// CLogin.getLayout = function getLayout(page) {
//     return (
//         <React.Fragment>
//             {page}
//             <AppConfig simple />
//         </React.Fragment>
//     );
// };
export default CLogin;
