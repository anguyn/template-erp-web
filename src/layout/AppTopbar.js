import React, { forwardRef, useContext, useImperativeHandle, useRef } from 'react';
import Link from 'next/link';
import { Menu } from 'primereact/menu';
import Router, { useRouter } from 'next/router';
import { classNames } from 'primereact/utils';
import usersApi from '@/service/ServiceLayer/authApi';
import { useLayoutStore } from '@/stores/layoutStore';
import { shallow } from 'zustand/shallow';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';

const AppTopbar = forwardRef((props, ref) => {
    const { layoutState, layoutConfig, onMenuToggle, showProfileSidebar } = useLayoutStore(
        (state) => state,
        shallow
    );

    const router = useRouter();

    const menubuttonRef = useRef(null);
    const topbarmenuRef = useRef(null);
    const topbarmenubuttonRef = useRef(null);
    const topbarbackbuttonRef = useRef(null);

    const menuRight = useRef(null);

    const handleSignOut = async () => {
        try {
            const res = await fetch('/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });
            Cookies.remove('user');
            Cookies.remove('B1SESSION');
            Cookies.remove('ROUTEID');
            toast.success("Log out successfully.");
            router.push(('/auth/login'))
        } catch (error) {
            console.error(error);
            toast.error("Error");
        }
    }

    const toggleFullScreen = () => {
        if (!isFullScreen) {
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if (document.documentElement.mozRequestFullScreen) { /* Firefox */
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
                document.documentElement.webkitRequestFullscreen();
            } else if (document.documentElement.msRequestFullscreen) { /* IE/Edge */
                document.documentElement.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) { /* Firefox */
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) { /* IE/Edge */
                document.msExitFullscreen();
            }
        }
        setIsFullScreen(!isFullScreen);
    };

    const items = [
        {
            label: 'Options',
            items: [
                {
                    label: 'Update',
                    icon: 'pi pi-refresh',
                    command: () => {
                        console.log('Update');
                    },
                },
                {
                    label: 'Delete',
                    icon: 'pi pi-times',
                    command: () => {
                        console.log('Delete');
                    },
                },
            ],
        },
        {
            label: 'User',
            items: [
                {
                    label: 'Sign Out',
                    icon: 'pi pi-fw pi-sign-in',
                    command: () => {
                        handleSignOut();
                    },
                },
            ],
        },
    ];

    const backPreviousPage = () => {
        router.back();
    }

    const reloadPage = () => {
        router.reload();
    }

    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current,
        topbarmenu: topbarmenuRef.current,
        topbarmenubutton: topbarmenubuttonRef.current,
        topbarbackbutton: topbarbackbuttonRef.current
    }));

    const isHomePage = router.pathname === '/';

    return (
        <div className="layout-topbar">
            <Link href="/" className="layout-topbar-logo items-center justify-center">
                <img
                    src={`/images/grant-thornton-${layoutConfig.colorScheme !== 'light' ? 'dark' : 'white'}-logo.png`}
                    alt="Grant Thornton Logo"
                    className={`flex-shrink-0 self-center`}
                />
            </Link>

            <button
                ref={menubuttonRef}
                type="button"
                className="p-link layout-menu-button layout-topbar-button"
                onClick={onMenuToggle}
            >
                <i className="pi pi-bars" />
            </button>

            <button
                ref={topbarmenubuttonRef}
                type="button"
                className="p-link layout-topbar-menu-button layout-topbar-button"
                onClick={showProfileSidebar}
            >
                <i className="pi pi-ellipsis-v" />
            </button>

            {
                !isHomePage && (
                    <button
                        ref={topbarbackbuttonRef}
                        type="button"
                        className="p-link layout-menu-button layout-topbar-button ml-1"
                        onClick={backPreviousPage}
                    >
                        <i className="pi pi-arrow-circle-left" />
                    </button>
                )
            }

            <button
                // ref={topbarreloadbuttonRef}
                type="button"
                className="p-link layout-menu-button layout-topbar-button ml-1"
                onClick={reloadPage}
            >
                <i className="pi pi-refresh" />
            </button>

            <button
                // ref={topbarreloadbuttonRef}
                type="button"
                className="p-link layout-menu-button layout-topbar-button ml-1"
                onClick={toggleFullScreen}
            >
                <i className="pi pi-window-maximize" />
            </button>


            <div
                ref={topbarmenuRef}
                className={classNames('layout-topbar-menu', {
                    'layout-topbar-menu-mobile-active': layoutState.profileSidebarVisible,
                })}
            >
                <button type="button" className="p-link layout-topbar-button">
                    <i className="pi pi-calendar"></i>
                    <span>Calendar</span>
                </button>
                <Menu
                    model={items}
                    popup
                    ref={menuRight}
                    id="popup_menu_right"
                    popupalignment="right"
                />
                <button
                    type="button"
                    className="p-link layout-topbar-button"
                    onClick={(event) => menuRight.current.toggle(event)}
                    aria-controls="popup_menu_right"
                    aria-haspopup
                >
                    <i className="pi pi-user"></i>
                    <span>Profile</span>
                </button>
                <Link href="/documentation">
                    <button type="button" className="p-link layout-topbar-button">
                        <i className="pi pi-cog"></i>
                        <span>Settings</span>
                    </button>
                </Link>
            </div>
        </div>
    );
});

export default AppTopbar;
