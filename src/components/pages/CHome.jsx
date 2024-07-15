import React, { useContext, useEffect, useRef, useState } from 'react';
// import { Button } from 'primereact/button';
// import { Icon } from '@iconify-icon/react';
import { Chart } from 'primereact/chart';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Menu } from 'primereact/menu';
// import { ProductService } from '@/demo/service/ProductService';
import { useLayoutStore } from '@/stores/layoutStore';
import { shallow } from 'zustand/shallow';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import withAuth from '@/utils/withAuth';
import { capitalizeWords } from '@/utils/text';
import toast from 'react-hot-toast';
import { formatNumberWithComma } from '@/utils/number';

const CHome = () => {
    const [products, setProducts] = useState(null);
    const [documentQuantity, setDocumentQuantity] = useState({
        salesQuotationCount: 0,
        salesOrderCount: 0,
        deliveryCount: 0,
        purchaseQuotationCount: 0,
        purchaseOrderCount: 0,
        goodsReceiptCount: 0,
        goodsReceiptPOCount: 0
    });

    const menu1 = useRef(null);
    const menu2 = useRef(null);
    const [lineOptions, setLineOptions] = useState(null);
    const layoutConfig = useLayoutStore((state) => state.layoutConfig, shallow);

    const tG = useTranslations('General');
    const t = useTranslations('Home');

    const applyLightTheme = () => {
        const lineOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#495057',
                    },
                },
            },
            scales: {
                x: {
                    ticks: {
                        color: '#495057',
                    },
                    grid: {
                        color: '#ebedef',
                    },
                },
                y: {
                    ticks: {
                        color: '#495057',
                    },
                    grid: {
                        color: '#ebedef',
                    },
                },
            },
        };

        setLineOptions(lineOptions);
    };

    const applyDarkTheme = () => {
        const lineOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#ebedef',
                    },
                },
            },
            scales: {
                x: {
                    ticks: {
                        color: '#ebedef',
                    },
                    grid: {
                        color: 'rgba(160, 167, 181, .3)',
                    },
                },
                y: {
                    ticks: {
                        color: '#ebedef',
                    },
                    grid: {
                        color: 'rgba(160, 167, 181, .3)',
                    },
                },
            },
        };

        setLineOptions(lineOptions);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const salesQuotationFetch = await fetch('/api/sales/get-sales-quotation-count', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include'
                });
                const salesQuotationCount = await salesQuotationFetch.json();
                setDocumentQuantity(prev => ({...prev, salesQuotationCount}))

                const salesOrderFetch = await fetch('/api/sales/get-sales-order-count', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include'
                });
                const salesOrderCount = await salesOrderFetch.json();
                setDocumentQuantity(prev => ({...prev, salesOrderCount}))

                const deliverFetch = await fetch('/api/sales/get-delivery-count', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include'
                });
                const deliveryCount = await deliverFetch.json();
                setDocumentQuantity(prev => ({...prev, deliveryCount}))

                const purchaseQuotationFetch = await fetch('/api/purchase/get-purchase-quotation-count', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include'
                });
                const purchaseQuotationCount = await purchaseQuotationFetch.json();
                setDocumentQuantity(prev => ({...prev, purchaseQuotationCount}))

                const purchaseOrderFetch = await fetch('/api/purchase/get-purchase-order-count', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include'
                });
                const purchaseOrderCount = await purchaseOrderFetch.json();
                setDocumentQuantity(prev => ({...prev, purchaseOrderCount}))

                const goodsReceiptPOFetch = await fetch('/api/purchase/get-goods-receipt-po-count', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include'
                });
                const goodsReceiptPOCount = await goodsReceiptPOFetch.json();
                setDocumentQuantity(prev => ({...prev, goodsReceiptPOCount}))

                const goodsReceiptFetch = await fetch('/api/inventory/get-goods-receipt', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include'
                });
                const goodsReceipts = await goodsReceiptFetch.json();
                const goodsReceiptCount = goodsReceipts?.value?.length;
                setDocumentQuantity(prev => ({...prev, goodsReceiptCount}))

                const goodsIssueFetch = await fetch('/api/inventory/get-goods-issue', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include'
                });
                const goodsIssues = await goodsIssueFetch.json();
                const goodsIssueCount = goodsIssues?.value?.length;

                setDocumentQuantity(prev => ({...prev, goodsIssueCount}))

            } catch (error) {
                console.error(error);
                toast.error(error.message);
            }
        }

        fetchData();
    }, []);

    useEffect(() => {
        if (layoutConfig.colorScheme === 'light') {
            applyLightTheme();
        } else {
            applyDarkTheme();
        }
    }, [layoutConfig.colorScheme]);

    const formatCurrency = (value) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    const menuList = [
        {
            id: 1,
            name: "Sales Quotation",
            href: "/sales/sales-quotation",
            title: capitalizeWords(tG('salesQuotation')),
            type: "list"
        },
        {
            id: 2,
            name: "Create Sales Quotation",
            href: "/sales/sales-quotation/create",
            title: capitalizeWords(tG('create')) + ' ' + capitalizeWords(tG('salesQuotation')),
            type: "create"
        },
        {
            id: 3,
            name: "Sales Order",
            href: "/sales/sales-order",
            title: capitalizeWords(tG('salesOrder'))
        },
        {
            id: 4,
            name: "Create Sales Order",
            href: "/sales/sales-order/create",
            title: capitalizeWords(tG('create')) + ' ' + capitalizeWords(tG('salesOrder'))
        },
        {
            id: 5,
            name: "Delivery",
            href: "/sales/delivery",
            title: capitalizeWords(tG('delivery'))
        },
        {
            id: 6,
            name: "Create Delivery",
            href: "/sales/delivery/create",
            title: capitalizeWords(tG('create')) + ' ' + capitalizeWords(tG('delivery'))
        },
        {
            id: 7,
            name: "Purchase Order",
            href: "/purchasing/purchase-order",
            title: capitalizeWords(tG('purchaseOrder'))
        },
        {
            id: 8,
            name: "Create Purchase Order",
            href: "/purchasing/purchase-order/create",
            title: capitalizeWords(tG('create')) + ' ' + capitalizeWords(tG('purchaseOrder'))
        },
        {
            id: 9,
            name: "Create Goods Receipt PO",
            href: "/purchasing/goods-receipt-po",
            title: capitalizeWords(tG('purchaseOrder'))
        },
    ]

    return (
        <div className="flex flex-col gap-5">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5">
                <Link href="/sales/sales-quotation" className="card mb-0 hover:cursor-pointer min-h-[200px]"
                >
                    <div className="flex justify-content-between mb-3">
                        <h3>{capitalizeWords(tG('salesQuotation'))}</h3>
                    </div>
                    <div className="flex justify-end items-center gap-4">
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round h-full w-3">
                            <i className="pi pi-file text-blue-500 text-[32px] p-2 px-2 h-full" />
                        </div>
                        <div className="h-full">
                            <div className="text-900 font-normal text-[40px]">{formatNumberWithComma(documentQuantity?.salesQuotationCount) || 0}</div>
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <div>
                            <i className="pi pi-undo text-green-500 text-lg mr-1" />
                            <span className="text-green-500 font-medium">24 minutes ago</span>
                        </div>
                        <span className="text-500">Open</span>
                    </div>
                </Link>

                <Link href="/sales/sales-quotation/create" className="card mb-0 hover:cursor-pointer min-h-[200px]">
                    <div className="flex justify-content-between mb-3">
                        <h3>{capitalizeWords(tG('create')) + ' ' + capitalizeWords(tG('salesQuotation'))}</h3>
                        <div
                            className="flex align-items-center justify-content-center bg-purple-100 border-round"
                            style={{ width: '2.5rem', height: '2.5rem' }}
                        >
                            <i className="pi pi-plus-circle text-purple-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">85 </span>
                    <span className="text-500">responded</span>
                </Link>

                <Link href="/sales/sales-order" className="card mb-0 hover:cursor-pointer min-h-[200px]"
                >
                    <div className="flex justify-content-between mb-3">
                        <h3>{capitalizeWords(tG('salesOrder'))}</h3>
                    </div>
                    <div className="flex justify-end items-center gap-4">
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round h-full w-3">
                            <i className="pi pi-file text-blue-500 text-[32px] p-2 px-2 h-full" />
                        </div>
                        <div className="h-full">
                            <div className="text-900 font-normal text-[40px]">{formatNumberWithComma(documentQuantity?.salesOrderCount) || 0}</div>
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <div>
                            <i className="pi pi-undo text-green-500 text-lg mr-1" />
                            <span className="text-green-500 font-medium">24 minutes ago</span>
                        </div>
                        <span className="text-500">Open</span>
                    </div>
                </Link>

                <Link href="/sales/sales-order/create" className="card mb-0 hover:cursor-pointer min-h-[200px]">
                    <div className="flex justify-content-between mb-3">
                        <h3>{capitalizeWords(tG('create')) + ' ' + capitalizeWords(tG('salesOrder'))}</h3>
                        <div
                            className="flex align-items-center justify-content-center bg-purple-100 border-round"
                            style={{ width: '2.5rem', height: '2.5rem' }}
                        >
                            <i className="pi pi-plus-circle text-purple-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">85 </span>
                    <span className="text-500">responded</span>
                </Link>

                <Link href="/sales/delivery" className="card mb-0 hover:cursor-pointer min-h-[200px]"
                >
                    <div className="flex justify-content-between mb-3">
                        <h3>{capitalizeWords(tG('delivery'))}</h3>
                    </div>
                    <div className="flex justify-end items-center gap-4">
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round h-full w-3">
                            <i className="pi pi-file text-blue-500 text-[32px] p-2 px-2 h-full" />
                        </div>
                        <div className="h-full">
                            <div className="text-900 font-normal text-[40px]">{formatNumberWithComma(documentQuantity?.deliveryCount) || 0}</div>
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <div>
                            <i className="pi pi-undo text-green-500 text-lg mr-1" />
                            <span className="text-green-500 font-medium">24 minutes ago</span>
                        </div>
                        <span className="text-500">Open</span>
                    </div>
                </Link>

                <Link href="/sales/delivery/create" className="card mb-0 hover:cursor-pointer min-h-[200px]">
                    <div className="flex justify-content-between mb-3">
                        <h3>{capitalizeWords(tG('create')) + ' ' + capitalizeWords(tG('delivery'))}</h3>
                        <div
                            className="flex align-items-center justify-content-center bg-purple-100 border-round"
                            style={{ width: '2.5rem', height: '2.5rem' }}
                        >
                            <i className="pi pi-plus-circle text-purple-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">85 </span>
                    <span className="text-500">responded</span>
                </Link>

                <Link href="/purchasing/purchase-quotation" className="card mb-0 hover:cursor-pointer min-h-[200px]">
                    <div className="flex justify-content-between mb-3">
                        <h3>{capitalizeWords(tG('purchaseQuotation'))}</h3>
                    </div>
                    <div className="flex justify-end items-center gap-4">
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round h-full w-3">
                            <i className="pi pi-file text-blue-500 text-[32px] p-2 px-2 h-full" />
                            {/* <Icon name="employee" className="text-blue-500 text-[16px] p-2" /> */}
                        </div>
                        <div className="h-full">
                            <div className="text-900 font-normal text-[40px]">{formatNumberWithComma(documentQuantity.purchaseQuotationCount) || 0}</div>
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <div>
                            <i className="pi pi-undo text-blue-500 text-green-500 text-lg mr-1" />
                            <span className="text-green-500 font-medium">24 minutes ago</span>
                        </div>
                        <span className="text-500">Open</span>
                    </div>
                </Link>

                <Link href="/purchasing/purchase-quotation/create" className="card mb-0 hover:cursor-pointer min-h-[200px]">
                    <div className="flex justify-content-between mb-3">
                        <h3>{capitalizeWords(tG('create')) + ' ' + capitalizeWords(tG('purchaseQuotation'))}</h3>
                        <div
                            className="flex align-items-center justify-content-center bg-purple-100 border-round"
                            style={{ width: '2.5rem', height: '2.5rem' }}
                        >
                            <i className="pi pi-plus-circle text-purple-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">85 </span>
                    <span className="text-500">responded</span>
                </Link>

                <Link href="/purchasing/purchase-order" className="card mb-0 hover:cursor-pointer min-h-[200px]">
                    <div className="flex justify-content-between mb-3">
                        <h3>{capitalizeWords(tG('purchaseOrder'))}</h3>
                    </div>
                    <div className="flex justify-end items-center gap-4">
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round h-full w-3">
                            <i className="pi pi-file text-blue-500 text-[32px] p-2 px-2 h-full" />
                            {/* <Icon name="employee" className="text-blue-500 text-[16px] p-2" /> */}
                        </div>
                        <div className="h-full">
                            <div className="text-900 font-normal text-[40px]">{formatNumberWithComma(documentQuantity.purchaseOrderCount) || 0}</div>
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <div>
                            <i className="pi pi-undo text-blue-500 text-green-500 text-lg mr-1" />
                            <span className="text-green-500 font-medium">24 minutes ago</span>
                        </div>
                        <span className="text-500">Open</span>
                    </div>
                </Link>

                <Link href="/purchasing/purchase-order/create" className="card mb-0 hover:cursor-pointer min-h-[200px]">
                    <div className="flex justify-content-between mb-3">
                        <h3>{capitalizeWords(tG('create')) + ' ' + capitalizeWords(tG('purchaseOrder'))}</h3>
                        <div
                            className="flex align-items-center justify-content-center bg-purple-100 border-round"
                            style={{ width: '2.5rem', height: '2.5rem' }}
                        >
                            <i className="pi pi-plus-circle text-purple-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">85 </span>
                    <span className="text-500">responded</span>
                </Link>

                <Link href="/purchasing/goods-receipt-po" className="card mb-0 hover:cursor-pointer min-h-[200px]">
                    <div className="flex justify-content-between mb-3">
                        <h3>{capitalizeWords(tG('goodsReceiptPO'))}</h3>
                    </div>
                    <div className="flex justify-end items-center gap-4">
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round h-full w-3">
                            <i className="pi pi-file text-blue-500 text-[32px] p-2 px-2 h-full" />
                            {/* <Icon name="employee" className="text-blue-500 text-[16px] p-2" /> */}
                        </div>
                        <div className="h-full">
                            <div className="text-900 font-normal text-[40px]">{formatNumberWithComma(documentQuantity.goodsReceiptPOCount) || 0}</div>
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <div>
                            <i className="pi pi-undo text-blue-500 text-green-500 text-lg mr-1" />
                            <span className="text-green-500 font-medium">24 minutes ago</span>
                        </div>
                        <span className="text-500">Open</span>
                    </div>
                </Link>

                <Link href="/purchasing/goods-receipt-po/create" className="card mb-0 hover:cursor-pointer min-h-[200px]">
                    <div className="flex justify-content-between mb-3">
                        <h3>{capitalizeWords(tG('create')) + ' ' + capitalizeWords(tG('goodsReceiptPO'))}</h3>
                        <div
                            className="flex align-items-center justify-content-center bg-purple-100 border-round"
                            style={{ width: '2.5rem', height: '2.5rem' }}
                        >
                            <i className="pi pi-plus-circle text-purple-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">85 </span>
                    <span className="text-500">responded</span>
                </Link>

                <Link href="/inventory/goods-issue" className="card mb-0 hover:cursor-pointer min-h-[200px]">
                    <div className="flex justify-content-between mb-3">
                        <h3>{capitalizeWords(tG('goodsIssue'))}</h3>
                    </div>
                    <div className="flex justify-end items-center gap-4">
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round h-full w-3">
                            <i className="pi pi-file text-blue-500 text-[32px] p-2 px-2 h-full" />
                            {/* <Icon name="employee" className="text-blue-500 text-[16px] p-2" /> */}
                        </div>
                        <div className="h-full">
                            <div className="text-900 font-normal text-[40px]">{formatNumberWithComma(documentQuantity.goodsIssueCount) || 0}</div>
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <div>
                            <i className="pi pi-undo text-blue-500 text-green-500 text-lg mr-1" />
                            <span className="text-green-500 font-medium">24 minutes ago</span>
                        </div>
                        <span className="text-500">Open</span>
                    </div>
                </Link>

                <Link href="/inventory/goods-issue/create" className="card mb-0 hover:cursor-pointer min-h-[200px]">
                    <div className="flex justify-content-between mb-3">
                        <h3>{capitalizeWords(tG('create')) + ' ' + capitalizeWords(tG('goodsIssue'))}</h3>
                        <div
                            className="flex align-items-center justify-content-center bg-purple-100 border-round"
                            style={{ width: '2.5rem', height: '2.5rem' }}
                        >
                            <i className="pi pi-plus-circle text-purple-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">85 </span>
                    <span className="text-500">responded</span>
                </Link>

                <Link href="/inventory/goods-receipt" className="card mb-0 hover:cursor-pointer min-h-[200px]">
                    <div className="flex justify-content-between mb-3">
                        <h3>{capitalizeWords(tG('goodsReceipt'))}</h3>
                    </div>
                    <div className="flex justify-end items-center gap-4">
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round h-full w-3">
                            <i className="pi pi-file text-blue-500 text-[32px] p-2 px-2 h-full" />
                            {/* <Icon name="employee" className="text-blue-500 text-[16px] p-2" /> */}
                        </div>
                        <div className="h-full">
                            <div className="text-900 font-normal text-[40px]">{formatNumberWithComma(documentQuantity.goodsReceiptCount) || 0}</div>
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <div>
                            <i className="pi pi-undo text-blue-500 text-green-500 text-lg mr-1" />
                            <span className="text-green-500 font-medium">24 minutes ago</span>
                        </div>
                        <span className="text-500">Open</span>
                    </div>
                </Link>

                <Link href="/inventory/goods-receipt/create" className="card mb-0 hover:cursor-pointer min-h-[200px]">
                    <div className="flex justify-content-between mb-3">
                        <h3>{capitalizeWords(tG('create')) + ' ' + capitalizeWords(tG('goodsReceipt'))}</h3>
                        <div
                            className="flex align-items-center justify-content-center bg-purple-100 border-round"
                            style={{ width: '2.5rem', height: '2.5rem' }}
                        >
                            <i className="pi pi-plus-circle text-purple-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">85 </span>
                    <span className="text-500">responded</span>
                </Link>
            </div>
        </div>
    );
};

export default withAuth(CHome);
// export default CHome;
