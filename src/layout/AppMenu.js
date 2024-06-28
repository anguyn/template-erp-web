'use client';

import { MenuProvider } from './context/menucontext';
import AppMenuItem from './AppMenuItem';
import Link from 'next/link';

const AppMenu = () => {
    const model = [
        {
            label: 'Home',
            items: [{ label: 'My Home', icon: 'pi pi-fw pi-home', to: '/' }],
        },
        {
            label: 'Administration',
            items: [
                {
                    label: 'Dashboard',
                    icon: 'pi pi-fw pi-id-card',
                    to: '/administration/dashboard',
                },
                {
                    label: 'Contract',
                    icon: 'pi pi-fw pi-check-square',
                    to: '/administration/contract',
                },
                { label: 'Report', icon: 'pi pi-fw pi-bookmark', to: '/administration/report' },
            ],
        },
        {
            label: 'Modules',
            items: [
                {
                    label: 'CRM',
                    icon: 'pi pi-fw pi-user',
                    items: [
                        {
                            label: 'Business Partners',
                            icon: 'pi pi-fw pi-sign-in',
                            to: '/crm/business-partners',
                        },
                        {
                            label: 'Create Business Partner',
                            icon: 'pi pi-fw pi-times-circle',
                            to: '/crm/business-partners/create',
                        },
                        {
                            label: 'Activities',
                            icon: 'pi pi-fw pi-lock',
                            to: '/crm/activities',
                        },
                        {
                            label: 'Create Activity',
                            icon: 'pi pi-fw pi-lock',
                            to: '/crm/activities/create',
                        },
                        {
                            label: 'Opportunities',
                            icon: 'pi pi-fw pi-sign-in',
                            to: '/crm/opportunities',
                        },
                        {
                            label: 'Create Opportunity',
                            icon: 'pi pi-fw pi-sign-in',
                            to: '/crm/opportunities/create',
                        },
                    ],
                },
                {
                    label: 'Sales',
                    icon: 'pi pi-fw pi-user',
                    items: [
                        {
                            label: 'Sales Quotation',
                            icon: 'pi pi-fw pi-sign-in',
                            to: '/crm/business-partners',
                        },
                        {
                            label: 'Create Salees Quotation',
                            icon: 'pi pi-fw pi-times-circle',
                            to: '/crm/business-partners/create',
                        },
                        {
                            label: 'Sales Order',
                            icon: 'pi pi-fw pi-lock',
                            to: '/crm/activities',
                        },
                        {
                            label: 'Create Sales Order',
                            icon: 'pi pi-fw pi-lock',
                            to: '/crm/activities/create',
                        },
                    ],
                },
            ],
        },
        {
            label: 'Inventory',
            items: [
                { label: 'Item', icon: 'pi pi-fw pi-shopping-bag', to: '/inventory/item' },
                {
                    label: 'Goods Receipt',
                    icon: 'pi pi-fw pi-box',
                    to: '/inventory/goods-receipt',
                },
                {
                    label: 'Goods Receipt PO',
                    icon: 'pi pi-fw pi-box',
                    to: '/inventory/goods-receipt-po',
                },
                {
                    label: 'Delivery',
                    icon: 'pi pi-fw pi-send',
                    to: '/inventory/delivery',
                },
                {
                    label: 'Bin Location',
                    // icon: 'pi pi-fw pi-warehouse',
                    iconify: 'material-symbols:warehouse-outline',
                    to: '/inventory/binlocation',
                },
                { label: 'Goods Issue', icon: 'pi pi-fw pi-bookmark', to: '/inventory/goodsissue' },
                {
                    label: 'Transfer Request',
                    icon: 'pi pi-fw pi-mobile',
                    to: '/inventory/transferrequest',
                    class: 'rotated-icon',
                },
                { label: 'Transfer', icon: 'pi pi-fw pi-table', to: '/transfer' },
                {
                    label: 'Inventory Revaluation',
                    icon: 'pi pi-fw pi-list',
                    to: '/inventory/revalutation',
                },
                {
                    label: 'Item Serial Numbers',
                    icon: 'pi pi-fw pi-tablet',
                    to: '/inventory/itemserialnumbers',
                },
                { label: 'Batches', icon: 'pi pi-fw pi-clone', to: '/inventory/batches' },
            ],
        },
        {
            label: 'Hierarchy',
            items: [
                {
                    label: 'Submenu 1',
                    icon: 'pi pi-fw pi-bookmark',
                    items: [
                        {
                            label: 'Submenu 1.1',
                            icon: 'pi pi-fw pi-bookmark',
                            items: [
                                { label: 'Submenu 1.1.1', icon: 'pi pi-fw pi-bookmark' },
                                { label: 'Submenu 1.1.2', icon: 'pi pi-fw pi-bookmark' },
                                { label: 'Submenu 1.1.3', icon: 'pi pi-fw pi-bookmark' },
                            ],
                        },
                        {
                            label: 'Submenu 1.2',
                            icon: 'pi pi-fw pi-bookmark',
                            items: [{ label: 'Submenu 1.2.1', icon: 'pi pi-fw pi-bookmark' }],
                        },
                    ],
                },
                {
                    label: 'Submenu 2',
                    icon: 'pi pi-fw pi-bookmark',
                    items: [
                        {
                            label: 'Submenu 2.1',
                            icon: 'pi pi-fw pi-bookmark',
                            items: [
                                { label: 'Submenu 2.1.1', icon: 'pi pi-fw pi-bookmark' },
                                { label: 'Submenu 2.1.2', icon: 'pi pi-fw pi-bookmark' },
                            ],
                        },
                        {
                            label: 'Submenu 2.2',
                            icon: 'pi pi-fw pi-bookmark',
                            items: [{ label: 'Submenu 2.2.1', icon: 'pi pi-fw pi-bookmark' }],
                        },
                    ],
                },
            ],
        },
    ];

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item.seperator ? (
                        <AppMenuItem item={item} root={true} index={i} key={item.label} />
                    ) : (
                        <li className="menu-separator"></li>
                    );
                })}

                <Link href="/" target="_blank" className="cursor-pointer">
                    <img
                        alt="ERP Illustration"
                        className="w-full my-3"
                        src={`/layout/images/erp-illustration.png`}
                    />
                </Link>
                <div className="layout-footer">
                    <span className="font-medium mx-1">PrimeReact</span>
                    <span>- Powered by an 🐼 </span>
                </div>
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
