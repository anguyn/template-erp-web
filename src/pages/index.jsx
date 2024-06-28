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
import withAuth from '@/utils/withAuth';

const lineData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
        {
            label: 'First Dataset',
            data: [65, 59, 80, 81, 56, 55, 40],
            fill: false,
            backgroundColor: '#2f4860',
            borderColor: '#2f4860',
            tension: 0.4,
        },
        {
            label: 'Second Dataset',
            data: [28, 48, 40, 19, 86, 27, 90],
            fill: false,
            backgroundColor: '#00bb7e',
            borderColor: '#00bb7e',
            tension: 0.4,
        },
    ],
};

const MyHome = () => {
    const [products, setProducts] = useState(null);
    const menu1 = useRef(null);
    const menu2 = useRef(null);
    const [lineOptions, setLineOptions] = useState(null);
    const layoutConfig = useLayoutStore((state) => state.layoutConfig, shallow);

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

    // useEffect(() => {
    //     ProductService.getProductsSmall().then((data) => setProducts(data));
    // }, []);

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

    return (
        <div className="flex flex-col gap-5">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-5">
                <Link
                    href="/modules/sales/sales-quotation"
                    className="card mb-0 hover:cursor-pointer"
                >
                    <div className="flex justify-content-between mb-3">
                        <h3>Sales Quotation</h3>
                    </div>
                    <div className="flex justify-end items-center gap-4">
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round h-full w-3">
                            <i className="pi pi-file text-blue-500 text-[32px] p-2 px-2 h-full" />
                        </div>
                        <div className="h-full">
                            <div className="text-900 font-normal text-[40px]">0</div>
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

                <Link href="/modules/sales/sales-order" className="card mb-0 hover:cursor-pointer">
                    <div className="flex justify-content-between mb-3">
                        <h3>Sales Order</h3>
                    </div>
                    <div className="flex justify-end items-center gap-4">
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round h-full w-3">
                            <i className="pi pi-file text-blue-500 text-[32px] p-2 px-2 h-full" />
                            {/* <Icon name="employee" className="text-blue-500 text-[16px] p-2" /> */}
                        </div>
                        <div className="h-full">
                            <div className="text-900 font-normal text-[40px]">0</div>
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

                <div className="card mb-0 hover:cursor-pointer">
                    <div className="flex justify-content-between mb-3">
                        <h3>Purchase Order</h3>
                    </div>
                    <div className="flex justify-end items-center gap-4">
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round h-full w-3">
                            <i className="pi pi-file text-blue-500 text-[32px] p-2 px-2 h-full" />
                            {/* <Icon name="employee" className="text-blue-500 text-[16px] p-2" /> */}
                        </div>
                        <div className="h-full">
                            <div className="text-900 font-normal text-[40px]">0</div>
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <div>
                            <i className="pi pi-undo text-blue-500 text-green-500 text-lg mr-1" />
                            <span className="text-green-500 font-medium">24 minutes ago</span>
                        </div>
                        <span className="text-500">Open</span>
                    </div>
                </div>

                <div className="card mb-0 hover:cursor-pointer">
                    <div className="flex justify-content-between mb-3">
                        <h3>Sales Order</h3>
                    </div>
                    <div className="flex justify-end items-center gap-4">
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round h-full w-3">
                            <i className="pi pi-file text-blue-500 text-[32px] p-2 px-2 h-full" />
                            {/* <Icon name="employee" className="text-blue-500 text-[16px] p-2" /> */}
                        </div>
                        <div className="h-full">
                            <div className="text-900 font-normal text-[40px]">0</div>
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <div>
                            <i className="pi pi-undo text-blue-500 text-green-500 text-lg mr-1" />
                            <span className="text-green-500 font-medium">24 minutes ago</span>
                        </div>
                        <span className="text-500">Open</span>
                    </div>
                </div>

                <div className="card mb-0 hover:cursor-pointer">
                    <div className="flex justify-content-between mb-3">
                        <h3>Create Sales Order</h3>
                    </div>
                    <div className="flex justify-end items-center gap-4">
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round h-full w-3">
                            <i className="pi pi-file text-blue-500 text-[32px] p-2 px-2 h-full" />
                            {/* <Icon name="employee" className="text-blue-500 text-[16px] p-2" /> */}
                        </div>
                        <div className="h-full">
                            <div className="text-900 font-normal text-[40px]">0</div>
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <div>
                            <i className="pi pi-undo text-blue-500 text-green-500 text-lg mr-1" />
                            <span className="text-green-500 font-medium">24 minutes ago</span>
                        </div>
                        <span className="text-500">Open</span>
                    </div>
                </div>

                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <h3>Create Sales Order</h3>
                        <div
                            className="flex align-items-center justify-content-center bg-purple-100 border-round"
                            style={{ width: '2.5rem', height: '2.5rem' }}
                        >
                            <i className="pi pi-plus-circle text-purple-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">85 </span>
                    <span className="text-500">responded</span>
                </div>
            </div>

            {/* <div className="grid gap-4 grid-cols-1 xl:grid-cols-2">
                <div className="">
                    <div className="card">
                        <h5>Recent Sales</h5>
                        <DataTable value={products} rows={5} paginator responsiveLayout="scroll">
                            <Column
                                header="Image"
                                body={(data) => (
                                    <img
                                        className="shadow-2"
                                        src={`/demo/images/product/${data.image}`}
                                        alt={data.image}
                                        width="50"
                                    />
                                )}
                            />
                            <Column field="name" header="Name" sortable style={{ width: '35%' }} />
                            <Column
                                field="price"
                                header="Price"
                                sortable
                                style={{ width: '35%' }}
                                body={(data) => formatCurrency(data.price)}
                            />
                            <Column
                                header="View"
                                style={{ width: '15%' }}
                                body={() => (
                                    <>
                                        <Button icon="pi pi-search" type="button" text />
                                    </>
                                )}
                            />
                        </DataTable>
                    </div>
                    <div className="card">
                        <div className="flex justify-content-between align-items-center mb-5">
                            <h5>Best Selling Products</h5>
                            <div>
                                <Button
                                    type="button"
                                    icon="pi pi-ellipsis-v"
                                    className="p-button-rounded p-button-text p-button-plain"
                                    onClick={(event) => menu1.current.toggle(event)}
                                />
                                <Menu
                                    ref={menu1}
                                    popup
                                    model={[
                                        { label: 'Add New', icon: 'pi pi-fw pi-plus' },
                                        { label: 'Remove', icon: 'pi pi-fw pi-minus' },
                                    ]}
                                />
                            </div>
                        </div>
                        <ul className="list-none p-0 m-0">
                            <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                                <div>
                                    <span className="text-900 font-medium mr-2 mb-1 md:mb-0">
                                        Space T-Shirt
                                    </span>
                                    <div className="mt-1 text-600">Clothing</div>
                                </div>
                                <div className="mt-2 md:mt-0 flex align-items-center">
                                    <div
                                        className="surface-300 border-round overflow-hidden w-10rem lg:w-6rem"
                                        style={{ height: '8px' }}
                                    >
                                        <div
                                            className="bg-orange-500 h-full"
                                            style={{ width: '50%' }}
                                        />
                                    </div>
                                    <span className="text-orange-500 ml-3 font-medium">%50</span>
                                </div>
                            </li>
                            <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                                <div>
                                    <span className="text-900 font-medium mr-2 mb-1 md:mb-0">
                                        Portal Sticker
                                    </span>
                                    <div className="mt-1 text-600">Accessories</div>
                                </div>
                                <div className="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                                    <div
                                        className="surface-300 border-round overflow-hidden w-10rem lg:w-6rem"
                                        style={{ height: '8px' }}
                                    >
                                        <div
                                            className="bg-cyan-500 h-full"
                                            style={{ width: '16%' }}
                                        />
                                    </div>
                                    <span className="text-cyan-500 ml-3 font-medium">%16</span>
                                </div>
                            </li>
                            <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                                <div>
                                    <span className="text-900 font-medium mr-2 mb-1 md:mb-0">
                                        Supernova Sticker
                                    </span>
                                    <div className="mt-1 text-600">Accessories</div>
                                </div>
                                <div className="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                                    <div
                                        className="surface-300 border-round overflow-hidden w-10rem lg:w-6rem"
                                        style={{ height: '8px' }}
                                    >
                                        <div
                                            className="bg-pink-500 h-full"
                                            style={{ width: '67%' }}
                                        />
                                    </div>
                                    <span className="text-pink-500 ml-3 font-medium">%67</span>
                                </div>
                            </li>
                            <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                                <div>
                                    <span className="text-900 font-medium mr-2 mb-1 md:mb-0">
                                        Wonders Notebook
                                    </span>
                                    <div className="mt-1 text-600">Office</div>
                                </div>
                                <div className="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                                    <div
                                        className="surface-300 border-round overflow-hidden w-10rem lg:w-6rem"
                                        style={{ height: '8px' }}
                                    >
                                        <div
                                            className="bg-green-500 h-full"
                                            style={{ width: '35%' }}
                                        />
                                    </div>
                                    <span className="text-green-500 ml-3 font-medium">%35</span>
                                </div>
                            </li>
                            <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                                <div>
                                    <span className="text-900 font-medium mr-2 mb-1 md:mb-0">
                                        Mat Black Case
                                    </span>
                                    <div className="mt-1 text-600">Accessories</div>
                                </div>
                                <div className="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                                    <div
                                        className="surface-300 border-round overflow-hidden w-10rem lg:w-6rem"
                                        style={{ height: '8px' }}
                                    >
                                        <div
                                            className="bg-purple-500 h-full"
                                            style={{ width: '75%' }}
                                        />
                                    </div>
                                    <span className="text-purple-500 ml-3 font-medium">%75</span>
                                </div>
                            </li>
                            <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                                <div>
                                    <span className="text-900 font-medium mr-2 mb-1 md:mb-0">
                                        Robots T-Shirt
                                    </span>
                                    <div className="mt-1 text-600">Clothing</div>
                                </div>
                                <div className="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                                    <div
                                        className="surface-300 border-round overflow-hidden w-10rem lg:w-6rem"
                                        style={{ height: '8px' }}
                                    >
                                        <div
                                            className="bg-teal-500 h-full"
                                            style={{ width: '40%' }}
                                        />
                                    </div>
                                    <span className="text-teal-500 ml-3 font-medium">%40</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="">
                    <div className="card">
                        <h5>Sales Overview</h5>
                        <Chart type="line" data={lineData} options={lineOptions} />
                    </div>
                    <div className="card">
                        <div className="flex align-items-center justify-content-between mb-4">
                            <h5>Notifications</h5>
                            <div>
                                <Button
                                    type="button"
                                    icon="pi pi-ellipsis-v"
                                    className="p-button-rounded p-button-text p-button-plain"
                                    onClick={(event) => menu2.current.toggle(event)}
                                />
                                <Menu
                                    ref={menu2}
                                    popup
                                    model={[
                                        { label: 'Add New', icon: 'pi pi-fw pi-plus' },
                                        { label: 'Remove', icon: 'pi pi-fw pi-minus' },
                                    ]}
                                />
                            </div>
                        </div>

                        <span className="block text-600 font-medium mb-3">TODAY</span>
                        <ul className="p-0 mx-0 mt-0 mb-4 list-none">
                            <li className="flex align-items-center py-2 border-bottom-1 surface-border">
                                <div className="w-3rem h-3rem flex align-items-center justify-content-center bg-blue-100 border-circle mr-3 flex-shrink-0">
                                    <i className="pi pi-dollar text-xl text-blue-500" />
                                </div>
                                <span className="text-900 line-height-3">
                                    Richard Jones
                                    <span className="text-700">
                                        {' '}
                                        has purchased a blue t-shirt for{' '}
                                        <span className="text-blue-500">79$</span>
                                    </span>
                                </span>
                            </li>
                            <li className="flex align-items-center py-2">
                                <div className="w-3rem h-3rem flex align-items-center justify-content-center bg-orange-100 border-circle mr-3 flex-shrink-0">
                                    <i className="pi pi-download text-xl text-orange-500" />
                                </div>
                                <span className="text-700 line-height-3">
                                    Your request for withdrawal of{' '}
                                    <span className="text-blue-500 font-medium">2500$</span> has
                                    been initiated.
                                </span>
                            </li>
                        </ul>

                        <span className="block text-600 font-medium mb-3">YESTERDAY</span>
                        <ul className="p-0 m-0 list-none">
                            <li className="flex align-items-center py-2 border-bottom-1 surface-border">
                                <div className="w-3rem h-3rem flex align-items-center justify-content-center bg-blue-100 border-circle mr-3 flex-shrink-0">
                                    <i className="pi pi-dollar text-xl text-blue-500" />
                                </div>
                                <span className="text-900 line-height-3">
                                    Keyser Wick
                                    <span className="text-700">
                                        {' '}
                                        has purchased a black jacket for{' '}
                                        <span className="text-blue-500">59$</span>
                                    </span>
                                </span>
                            </li>
                            <li className="flex align-items-center py-2 border-bottom-1 surface-border">
                                <div className="w-3rem h-3rem flex align-items-center justify-content-center bg-pink-100 border-circle mr-3 flex-shrink-0">
                                    <i className="pi pi-question text-xl text-pink-500" />
                                </div>
                                <span className="text-900 line-height-3">
                                    Jane Davis
                                    <span className="text-700">
                                        {' '}
                                        has posted a new questions about your product.
                                    </span>
                                </span>
                            </li>
                        </ul>
                    </div>
                    <div
                        className="px-4 py-5 shadow-2 flex flex-column md:flex-row md:align-items-center justify-content-between mb-3"
                        style={{
                            borderRadius: '1rem',
                            background:
                                'linear-gradient(0deg, rgba(0, 123, 255, 0.5), rgba(0, 123, 255, 0.5)), linear-gradient(92.54deg, #1C80CF 47.88%, #FFFFFF 100.01%)',
                        }}
                    >
                        <div>
                            <div className="text-blue-100 font-medium text-xl mt-2 mb-3">
                                TAKE THE NEXT STEP
                            </div>
                            <div className="text-white font-medium text-5xl">Try PrimeBlocks</div>
                        </div>
                        <div className="mt-4 mr-auto md:mt-0 md:mr-0">
                            <Link
                                href="https://blocks.primereact.org"
                                className="p-button font-bold px-5 py-3 p-button-warning p-button-rounded p-button-raised"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </div> */}
        </div>
    );
};

export async function getStaticProps(context) {
    return {
        props: {
            // You can get the messages from anywhere you like. The recommended
            // pattern is to put them in JSON files separated by locale and read
            // the desired one based on the `locale` received from Next.js.
            messages: (await import(`../../messages/${context.locale}.json`)).default
        }
    };
}

export default withAuth(MyHome);
// export default MyHome;
