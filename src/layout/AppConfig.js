import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import pick from "@/utils/pick";
import PrimeReact from 'primereact/api';
import { Button } from 'primereact/button';
import { InputSwitch } from 'primereact/inputswitch';
import { RadioButton } from 'primereact/radiobutton';
import { Sidebar } from 'primereact/sidebar';
import { classNames } from 'primereact/utils';
import { ListBox } from 'primereact/listbox';
import { useLayoutStore } from '@/stores/layoutStore';
import { shallow } from 'zustand/shallow';
import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';
import { capitalizeWords } from '@/utils/text';

const AppConfig = (props) => {
    const tL = useTranslations('Languages');
    const tP = useTranslations('PageLayout');

    const languages = [
        { name: capitalizeWords(tL('english')), code: 'en' },
        { name: capitalizeWords(tL('vietnamese')), code: 'vi' },
        { name: capitalizeWords(tL('france')), code: 'fr' }
    ];

    const pageListStyles = [
        { name: capitalizeWords(tP('Pagination')), code: 'pagination' },
        { name: capitalizeWords(tP('VerticalScroll')), code: 'scroll' },
    ];

    const router = useRouter();
    const { locale, locales, route } = router;
    const [scales] = useState([12, 13, 14, 15, 16]);

    const { layoutState, layoutConfig, globalLoader, setLayoutState, setLang, setLayoutConfig } = useLayoutStore(
        (state) => state,
        shallow
    );

    const onConfigButtonClick = () => {
        setLayoutState({ configSidebarVisible: true });
    };

    const onConfigSidebarHide = () => {
        setLayoutState({ configSidebarVisible: false });
    };

    // const changeInputStyle = (e) => {
    //     setLayoutConfig({ inputStyle: e.value });
    // };

    // const changeRipple = (e) => {
    //     PrimeReact.ripple = e.value;
    //     setLayoutConfig({ ripple: e.value });
    // };

    const changeMenuMode = (e) => {
        setLayoutConfig({ menuMode: e.value });
    };

    const changeTheme = (theme, colorScheme) => {
        PrimeReact.changeTheme(layoutConfig.theme, theme, 'theme-css', () => {
            setLayoutConfig({ theme, colorScheme });
        });
    };

    const decrementScale = () => {
        setLayoutConfig({ scale: layoutConfig.scale - 1 });
    };

    const incrementScale = () => {
        setLayoutConfig({ scale: layoutConfig.scale + 1 });
    };

    const applyScale = () => {
        document.documentElement.style.fontSize = layoutConfig.scale + 'px';
    };

    const handleNavigation = useCallback((lang) => {
        router.push({
            pathname: route,
            query: router.query,
        }, undefined, { locale: lang });
    }, [router, route]);

    const handleChangePageListStyle = (value) => {
        setLayoutConfig({ pageListStyle: value });
    }

    useEffect(() => {
        applyScale();
    }, [layoutConfig.scale]);

    useEffect(() => {
        setLang(locale);
    }, [locale])

    return (
        <>
            <button
                className="layout-config-button p-link"
                type="button"
                onClick={onConfigButtonClick}
            >
                <i className="pi pi-cog"></i>
            </button>

            <Sidebar
                visible={layoutState.configSidebarVisible}
                onHide={onConfigSidebarHide}
                position="right"
                className="layout-config-sidebar w-20rem z-[4206]"
            >
                {!props.simple && (
                    <>
                        <h5>{capitalizeWords(tP('Scale'))}</h5>
                        <div className="flex align-items-center">
                            <Button
                                icon="pi pi-minus"
                                type="button"
                                onClick={decrementScale}
                                rounded
                                text
                                className="w-2rem h-2rem mr-2"
                                disabled={layoutConfig.scale === scales[0]}
                            ></Button>
                            <div className="flex gap-2 align-items-center">
                                {scales.map((item) => {
                                    return (
                                        <i
                                            className={classNames('pi pi-circle-fill', {
                                                'text-primary-500': item === layoutConfig.scale,
                                                'text-300': item !== layoutConfig.scale,
                                            })}
                                            key={item}
                                        ></i>
                                    );
                                })}
                            </div>
                            <Button
                                icon="pi pi-plus"
                                type="button"
                                onClick={incrementScale}
                                rounded
                                text
                                className="w-2rem h-2rem ml-2"
                                disabled={layoutConfig.scale === scales[scales.length - 1]}
                            ></Button>
                        </div>

                        <h5>{capitalizeWords(tP('MenuType'))}</h5>
                        <div className="flex">
                            <div className="field-radiobutton flex-1">
                                <RadioButton
                                    name="menuMode"
                                    value={'static'}
                                    checked={layoutConfig.menuMode === 'static'}
                                    onChange={(e) => changeMenuMode(e)}
                                    inputId="mode1"
                                ></RadioButton>
                                <label htmlFor="mode1">{capitalizeWords(tP('Static'))}</label>
                            </div>
                            <div className="field-radiobutton flex-1">
                                <RadioButton
                                    name="menuMode"
                                    value={'overlay'}
                                    checked={layoutConfig.menuMode === 'overlay'}
                                    onChange={(e) => changeMenuMode(e)}
                                    inputId="mode2"
                                ></RadioButton>
                                <label htmlFor="mode2">{capitalizeWords(tP('Overlay'))}</label>
                            </div>
                        </div>
                    </>
                )}

                <h5>{capitalizeWords(tP('Theme'))}</h5>
                <div className="grid grid-rows-4 grid-flow-col gap-2">
                    <div className="flex gap-2 p-2">
                        <button
                            className="flex flex-1 items-center gap-2 p-link w-2 h-2"
                            onClick={() => changeTheme('bootstrap4-light-blue', 'light')}
                        >
                            <img
                                src="/layout/images/themes/bootstrap4-light-blue.svg"
                                className="w-2 h-2"
                                alt="Bootstrap Light Blue"
                            />
                            <span className='text-sm'>{capitalizeWords(tP('LightBlue'))}</span>
                        </button>
                        <button
                            className="flex flex-1 items-center gap-2 p-link w-2 h-2"
                            onClick={() => changeTheme('bootstrap4-dark-blue', 'dark')}
                        >
                            <img
                                src="/layout/images/themes/bootstrap4-dark-blue.svg"
                                className="w-2 h-2"
                                alt="Bootstrap Dark Blue"
                            />
                            <span className='text-sm'>{capitalizeWords(tP('DarkBlue'))}</span>
                        </button>
                    </div>
                    <div className="flex gap-2 p-2">
                        <button
                            className="flex flex-1 items-center gap-2 p-link w-2 h-2"
                            onClick={() => changeTheme('bootstrap4-light-purple', 'light')}
                        >
                            <img
                                src="/layout/images/themes/bootstrap4-light-purple.svg"
                                className="w-2 h-2"
                                alt="Bootstrap Light Purple"
                            />
                            <span className='text-sm'>{capitalizeWords(tP('LightPurple'))}</span>
                        </button>
                        <button
                            className="flex flex-1 items-center gap-2 p-link w-2 h-2"
                            onClick={() => changeTheme('bootstrap4-dark-purple', 'dark')}
                        >
                            <img
                                src="/layout/images/themes/bootstrap4-dark-purple.svg"
                                className="w-2 h-2"
                                alt="Bootstrap Dark Purple"
                            />
                            <span className='text-sm'>{capitalizeWords(tP('DarkPurple'))}</span>
                        </button>
                    </div>
                    <div className="flex gap-2 p-2">
                        <button
                            className="flex flex-1 items-center gap-2 p-link w-2 h-2"
                            onClick={() => changeTheme('mdc-light-indigo', 'light')}
                        >
                            <img
                                src="/layout/images/themes/md-light-indigo.svg"
                                className="w-2 h-2"
                                alt="Material Light Indigo"
                            />
                            <span className='text-sm'>{capitalizeWords(tP('LightIndigo'))}</span>
                        </button>
                        <button
                            className="flex flex-1 items-center gap-2 p-link w-2 h-2"
                            onClick={() => changeTheme('mdc-light-deeppurple', 'light')}
                        >
                            <img
                                src="/layout/images/themes/md-light-deeppurple.svg"
                                className="w-2 h-2"
                                alt="Material Light Deep Purple"
                            />
                            <span className='text-sm'>{capitalizeWords(tP('LightPurple2'))}</span>
                        </button>
                    </div>
                    <div className="flex gap-2 p-2">
                        <button
                            className="flex flex-1 items-center gap-2 p-link w-2 h-2"
                            onClick={() => changeTheme('mdc-dark-indigo', 'dark')}
                        >
                            <img
                                src="/layout/images/themes/md-dark-indigo.svg"
                                className="w-2 h-2"
                                alt="Material Dark Indigo"
                            />
                            <span className='text-sm'>{capitalizeWords(tP('DarkIndigo'))}</span>
                        </button>
                        <button
                            className="flex flex-1 items-center gap-2 p-link w-2 h-2"
                            onClick={() => changeTheme('mdc-dark-deeppurple', 'dark')}
                        >
                            <img
                                src="/layout/images/themes/md-dark-deeppurple.svg"
                                className="w-2 h-2"
                                alt="Material Dark Deep Purple"
                            />
                            <span className='text-sm'>{capitalizeWords(tP('DarkPurple2'))}</span>
                        </button>
                    </div>
                    <div className="flex gap-2 p-2">
                        <button
                            className="flex flex-1 items-center gap-2 p-link w-2 h-2"
                            onClick={() => changeTheme('lara-light-blue', 'light')}
                        >
                            <img
                                src="/layout/images/themes/lara-light-blue.png"
                                className="w-2 h-2"
                                alt="Material Dark Indigo"
                            />
                            <span className='text-sm'>{capitalizeWords(tP('LightBlue2'))}</span>
                        </button>
                        <button
                            className="flex flex-1 items-center gap-2 p-link w-2 h-2"
                            onClick={() => changeTheme('lara-dark-blue', 'dark')}
                        >
                            <img
                                src="/layout/images/themes/lara-dark-blue.png"
                                className="w-2 h-2"
                                alt="Material Dark Deep Purple"
                            />
                            <span className='text-sm'>{capitalizeWords(tP('DarkBlue2'))}</span>
                        </button>
                    </div>
                </div>

                <h5>{capitalizeWords(tP('Language'))}</h5>
                <div className="flex flex-column gap-3">
                    {languages.map((lang) => {
                        return (
                            <div key={lang.code} className="flex align-items-center">
                                <RadioButton inputId={lang.code} name="lang" value={lang.code} checked={locale === lang.code} onChange={(e) => handleNavigation(e.value)} />
                                <label htmlFor={lang.code} className="ml-2 hover:cursor-pointer">{lang.name}</label>
                            </div>
                        );
                    })}
                </div>

                <h5>{capitalizeWords(tP('PageListStyle'))}</h5>
                <div className="flex flex-column gap-3">
                    {pageListStyles.map((el) => {
                        return (
                            <div key={el.code} className="flex align-items-center">
                                <RadioButton inputId={el.code} name="el" value={el.code} checked={layoutConfig?.pageListStyle == el.code} onChange={(e) => {console.log("Do6:0"); handleChangePageListStyle(e.value)}} />
                                <label htmlFor={el.code} className="ml-2 hover:cursor-pointer">{el.name}</label>
                            </div>
                        );
                    })}
                </div>

            </Sidebar>
        </>
    );
};

export default AppConfig;
