import React, { useContext, useState, useEffect, useRef, useLayoutEffect } from 'react';
import { useRouter } from 'next/router';
import AppConfig from '@/layout/AppConfig';
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

import Loader from '@/components/Loader';

const LoginPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [companies, setCompanies] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [username, setUsename] = useState('');
    const [password, setPassword] = useState('');
    const [checked, setChecked] = useState(false);

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
            toast.error('Please select a company name.');
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
            toast.error('Username must not be empty.');
            return;
        } else if (password.length < 1) {
            const passwordElement = passwordInput.current;
            if (passwordElement && passwordElement.classList) {
                passwordElement.classList.add('p-invalid');
                passwordElement.focus();
            }
            toast.error('You must enter your password.');
            return;
        }
        if (type === 'sap') {
            setIsLoading(true);
            if (selectedCompany?.code && username.length > 0 && password.length > 0) {
                if (selectedCompany?.code) {
                    try {
                        const res = await usersApi.login(selectedCompany?.code, username, password);
                        console.log(res);
                        // Set remember-me cookie
                        // Cookies.set('user', username, { expires: 1 / 48 }); // 29 minutes and 30 seconds
                        Cookies.set('user', username, { expires: 0.125 }); // 180 phút
                        const companyInfo = await globalApi.getCompanyInfo();
                        const currencies = await globalApi.getAllCurrency();
                        console.log("Company info: ", companyInfo);
                        console.log("Currencies: ", currencies.value);
                        setCompanyInfo(companyInfo);
                        setCurrencies(currencies?.value || []);
                        toast.success('Login successfully!');
                        router.push('/');
                    } catch (error) {
                        console.error(error);
                        if (error.response?.status === 401) toast.error('Unauthorized account');
                        else toast.error(error.response?.statusText);
                        return;
                    } finally {
                        setIsLoading(false);
                    }
                } else {
                    toast.error('Your company name does not exist');
                    return;
                }
            }
        } else {
            toast('Under Development', {
                icon: '👏',
            });
            // router.push('/')
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

        document.title = 'TSC Hub - Login';

        return () => {
            document.title = 'TSC Hub';
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
                            <div className="text-900 text-3xl font-medium mb-3">Welcome to GTV</div>
                            <span className="text-600 font-medium">Sign in to continue</span>
                        </div>

                        <div>
                            <label
                                htmlFor="companyName"
                                className="block text-900 text-xl font-medium mb-2"
                            >
                                Company name <span className="text-red-700">*</span>
                            </label>
                            <Dropdown
                                ref={select}
                                value={selectedCompany}
                                id="companyName"
                                onChange={(e) => setSelectedCompany(e.value)}
                                options={companies}
                                optionLabel="name"
                                placeholder="Select your company"
                                filter
                                valueTemplate={selectedCompanyTemplate}
                                itemTemplate={companyOptionTemplate}
                                className="w-full mb-5"
                            />

                            <label
                                htmlFor="username"
                                className="block text-900 text-xl font-medium mb-2"
                            >
                                Username <span className="text-red-700">*</span>
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
                                Password <span className="text-red-700">*</span>
                            </label>
                            <Password
                                inputRef={passwordInput}
                                id="password"
                                inputid="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
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
                                    <label className="cursor-pointer" htmlFor="remember-me">Remember me</label>
                                </div>
                                <a
                                    className="font-medium no-underline ml-2 text-right cursor-pointer"
                                    style={{ color: 'var(--primary-color)' }}
                                >
                                    Forgot password?
                                </a>
                            </div>
                            <Button
                                label="Sign In With SAP B1 Account"
                                className="w-full p-2.5 text-xl mb-3"
                                onClick={() => handleSignIn('sap')}
                            ></Button>
                            <Button
                                label="Sign In With Company Account"
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

LoginPage.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
            <AppConfig simple />
        </React.Fragment>
    );
};
export default LoginPage;
