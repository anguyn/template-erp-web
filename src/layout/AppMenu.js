'use client';
import { useState, useEffect, useMemo } from 'react';
import { MenuProvider } from './context/menucontext';
import AppMenuItem from './AppMenuItem';
import Link from 'next/link';
import Image from 'next/image';
import { PanelMenu } from 'primereact/panelmenu';
import { classNames } from 'primereact/utils';
import { TabMenu } from 'primereact/tabmenu';
import { useTranslations } from 'next-intl';
import { capitalizeWords } from '@/utils/text';
import { useCompanyStore } from '@/stores/companyStore';
import { shallow } from 'zustand/shallow';
import { useRouter } from 'next/router';

import AdministrationIcon from "../../public/images/icons/SAP.svg";
import FinancialIcon from "../../public/images/icons/Slice.svg";
import SalesIcon from "../../public/images/icons/Fund Accounting.svg";
import PurchasingIcon from "../../public/images/icons/Buying.svg";
import InventoryIcon from "../../public/images/icons/Products Pile.svg";
import ProductionIcon from "../../public/images/icons/Manufacturing.svg";

const AppMenu = () => {
    const router = useRouter();
    const { companyInfo } = useCompanyStore(
        (state) => state,
        shallow
    );
    const [activeTabIndex, setActiveTabIndex] = useState(0);
    const [selectedPanel, setSelectedPanel] = useState('home');
    const [selectedRoute, setSelectedRoute] = useState('home');
    const t = useTranslations('Navigation');

    const panelItemRenderer = (item, options) => (
        <a className="flex align-items-center px-3 py-2 cursor-pointer" onClick={options.onClick}>
            <Image priority className='w-1' alt={item?.label} src={item.icon} />
            <span className={`mx-2 ${item.items && 'font-semibold'}`}>{item.label}</span>
        </a>
    );

    const items = [
        { key: 'module', label: capitalizeWords(t('modules')) },
        { key: 'relation', label: capitalizeWords(t('relations')) }
    ]

    const model = useMemo(() => [
        {
            label: capitalizeWords(t('menu')),
            expanded: selectedPanel === 'home',
            items: [
                {
                    label: capitalizeWords(t('home')),
                    icon: 'pi pi-fw pi-home',
                    to: '/',
                    className: classNames( 'p-ripple', {'active-route': selectedRoute == 'home'}),
                    command: () => {
                        router.push('/');
                    }
                }
            ],
        },
        {
            label: capitalizeWords(t('administration')),
            template: panelItemRenderer,
            icon: AdministrationIcon,
            expanded: selectedPanel === 'administration',
            items: [
                {
                    label: capitalizeWords(t('dashboard')),
                    icon: 'pi pi-fw pi-id-card',
                    to: '/administration/dashboard',
                    className: classNames( 'p-ripple', {'active-route': selectedRoute == 'dashboard'}),
                    command: () => {
                        router.push('/administration/dashboard');
                    }
                },
                {
                    label: capitalizeWords(t('report')),
                    icon: 'pi pi-fw pi-bookmark',
                    to: '/administration/report',
                    className: classNames( 'p-ripple', {'active-route': selectedRoute == 'report'}),
                    command: () => {
                        router.push('/administration/report');
                    }
                },
            ],
        },
        {
            label: capitalizeWords(t('financial')),
            template: panelItemRenderer,
            icon: FinancialIcon,
            expanded: selectedPanel === 'financial',
            items: [
                {
                    label: capitalizeWords(t('je')),
                    icon: 'pi pi-fw pi-file',
                    to: '/financial/journal-entry',
                    className: classNames( 'p-ripple', {'active-route': selectedRoute == 'journal-entry'}),
                    command: () => {
                        router.push('/financial/journal-entry');
                    }
                },
            ],
        },
        {
            label: capitalizeWords(t('purchasing')),
            template: panelItemRenderer,
            icon: PurchasingIcon,
            expanded: selectedPanel === 'purchasing',
            items: [
                {
                    label: capitalizeWords(t('purchaseOrder')),
                    icon: 'pi pi-fw pi-table',
                    to: '/purchasing/purchase-order',
                    className: classNames( 'p-ripple', {'active-route': selectedRoute == 'purchase-order'}),
                    command: () => {
                        router.push('/purchasing/purchase-order');
                    }
                },
                {
                    label: capitalizeWords(t('goodsReceiptPO')),
                    icon: 'pi pi-fw pi-table',
                    to: '/purchasing/goods-receipt-po',
                    className: classNames( 'p-ripple', {'active-route': selectedRoute == 'goods-receipt-po'}),
                    command: () => {
                        router.push('/purchasing/goods-receipt-po');
                    }
                },
            ],
        },
        {
            label: capitalizeWords(t('sales')),
            template: panelItemRenderer,
            icon: SalesIcon,
            expanded: selectedPanel === 'sales',
            items: [
                {
                    label: capitalizeWords(t('salesQuotation')),
                    icon: 'pi pi-fw pi-table',
                    to: '/sales/sales-quotation',
                    className: classNames( 'p-ripple', {'active-route': selectedRoute == 'sales-quotation'}),
                    command: () => {
                        router.push('/sales/sales-quotation');
                    }
                },
                {
                    label: capitalizeWords(t('salesOrder')),
                    icon: 'pi pi-fw pi-table',
                    to: '/sales/sales-order',
                    className: classNames( 'p-ripple', {'active-route': selectedRoute == 'sales-order'}),
                    command: () => {
                        router.push('/sales/sales-order');
                    }
                },
                {
                    label: capitalizeWords(t('delivery')),
                    icon: 'pi pi-fw pi-table',
                    to: '/sales/delivery',
                    className: classNames( 'p-ripple', {'active-route': selectedRoute == 'delivery'}),
                    command: () => {
                        router.push('/sales/delivery');
                    }
                },
            ],
        },
        {
            label: capitalizeWords(t('inventory')),
            template: panelItemRenderer,
            icon: InventoryIcon,
            expanded: selectedPanel === 'inventory',
            items: [
                {
                    label: capitalizeWords(t('goodsIssue')),
                    icon: 'pi pi-fw pi-table',
                    to: '/inventory/goods-issue',
                    className: classNames( 'p-ripple', {'active-route': selectedRoute == 'goods-issue'}),
                    command: () => {
                        router.push('/inventory/goods-issue');
                    }
                },
                {
                    label: capitalizeWords(t('goodsReceipt')),
                    icon: 'pi pi-fw pi-table',
                    to: '/inventory/goods-receipt',
                    className: classNames( 'p-ripple', {'active-route': selectedRoute == 'goods-receipt'}),
                    command: () => {
                        router.push('/inventory/goods-receipt');
                    }
                },
            ],
        },
        {
            label: capitalizeWords(t('production')),
            template: panelItemRenderer,
            icon: ProductionIcon,
            expanded: selectedPanel === 'production',
            items: [
                {
                    label: capitalizeWords(t('issueForProduction')),
                    icon: 'pi pi-fw pi-table',
                    to: '/production/issue-for-production',
                    command: () => {
                        router.push('/production/issue-for-production');
                    }
                },
                {
                    label: capitalizeWords(t('receiptFromProduction')),
                    icon: 'pi pi-fw pi-table',
                    to: '/production/receipt-from-production',
                    command: () => {
                        router.push('/production/receipt-from-production');
                    }
                },
            ],
        },
    ], [selectedPanel, selectedRoute, t, router]);

    useEffect(() => {
        const path = router.pathname;
        const [, extracted] = path.match(/^\/([^\/]+)/) || [];
        const [, , secondSegment] = path.match(/^\/([^\/]+)\/([^\/]+)/) || [];
        console.log("Hình như sai: ", extracted);
        console.log("route", secondSegment);
        setSelectedPanel(extracted || 'home');
        setSelectedRoute(secondSegment || 'home');
    }, [router]);

    return (
        <MenuProvider>
            <ul className="layout-menu">
                <p className='text-lg p-2 leading-7'>{companyInfo?.CompanyName}</p>
                {/* {model.map((item, i) => {
                    return !item.seperator ? (
                        <AppMenuItem expanded={false} item={item} root={true} index={i} key={item.label} />
                    ) : (
                        <li className="menu-separator"></li>
                    );
                })} */}

                <TabMenu model={items} className='mb-3' activeIndex={activeTabIndex} onTabChange={(e) => setActiveTabIndex(e.index)} />

                {
                    activeTabIndex == 0 ?
                        (<PanelMenu model={model} />) : (
                            <p>Tab 2 chưa có nội dung</p>
                        )
                }


                <Link href="/" target="_blank" className="cursor-pointer">
                    <img
                        alt="ERP Illustration"
                        className="w-full my-3"
                        src={`/layout/images/erp-illustration.png`}
                    />
                </Link>
                <div className="layout-footer">
                    <span className="font-medium mx-1">Web Client</span>
                    <span>- Powered by TSC 🐼 </span>
                </div>
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
