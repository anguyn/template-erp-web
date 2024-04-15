import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useResizeDetector } from 'react-resize-detector';

import inventoryApi from '@/service/ServiceLayer/inventoryApi';
import withAuth from '@/utils/withAuth';
import toast from 'react-hot-toast';
import { nanoid } from 'nanoid';

import { classNames } from 'primereact/utils';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Divider } from 'primereact/divider';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import { Calendar } from 'primereact/calendar';
import { Dialog } from 'primereact/dialog';
import { Slider } from 'primereact/slider';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Icon } from '@iconify/react';
import ItemList from '@/components/ItemList';

import FeatureBar from '@/components/FeatureBar';

const CreateGoodsReceipt = () => {
    const [selectedPriceList, setSelectedPriceList] = useState(null);
    const [selectedSeriesNo, setSelectedSeriesNo] = useState(null);
    const [priceListOptions, setPriceListOptions] = useState([
        { name: 'Price List 01', code: 'priceList1' },
        { name: 'Price List 02', code: 'priceList2' },
        { name: 'Price List 03', code: 'priceList3' },
        { name: 'Price List 04', code: 'priceList4' },
        { name: 'Price List 05', code: 'priceList5' },
        { name: 'Price List 06', code: 'priceList6' },
        { name: 'Price List 07', code: 'priceList7' },
        { name: 'Price List 08', code: 'priceList8' },
        { name: 'Price List 09', code: 'priceList9' },
        { name: 'Price List 10', code: 'priceList10' },
        { name: 'Last Purchase Price', code: 'lastPP' },
        { name: 'Last Evaluated, Price', code: 'lastEP' },
    ]);
    const [seriesNoOptions, setSeriesNoOptions] = useState([
        { name: 'Primary', code: 'primary' },
        { name: 'Secondary', code: 'secondary' }
    ]);
    const [warehouseOptions, setWarehouseOptions] = useState([
        { name: 'Warehouse 1', code: 'warehouse1' },
        { name: 'Warehouse 2', code: 'warehouse2' }
    ]);
    const [contentData, setContentData] = useState([
        {
            id: nanoid(6),
            ItemNo: '',
            Item: {},
            ItemDescription: '',
            Quantity: '',
            DiscountPercent: '',
            PriceAfterDiscount: '',
            Total: '',
            Warehouse: '',
            UoMCode: ''
        }
    ]);
    const [loading, setLoading] = useState(false);
    const [itemList, setItemList] = useState([{
        id: nanoid(6),
        name: "Mặt hàng A",
        category: "Service",
        vendor: "Công ty TNHH A",
    }, {
        id: nanoid(6),
        name: "Mặt hàng B",
        category: "Service",
        vendor: "Công ty TNHH A",
    }, {
        id: nanoid(6),
        name: "Mặt hàng B",
        category: "Service",
        vendor: "Công ty TNHH A",
    }, {
        id: nanoid(6),
        name: "Mặt hàng C",
        category: "Service",
        vendor: "Công ty TNHH B",
    }, {
        id: nanoid(6),
        name: "Mặt hàng C",
        category: "Service",
        vendor: "Công ty TNHH B",
    }, {
        id: nanoid(6),
        name: "Mặt hàng C",
        category: "Service",
        vendor: "Công ty TNHH B",
    }, {
        id: nanoid(6),
        name: "Mặt hàng C",
        category: "Service",
        vendor: "Công ty TNHH B",
    }, {
        id: nanoid(6),
        name: "Mặt hàng C",
        category: "Service",
        vendor: "Công ty TNHH B",
    }, {
        id: nanoid(6),
        name: "Mặt hàng C",
        category: "Service",
        vendor: "Công ty TNHH B",
    }, {
        id: nanoid(6),
        name: "Mặt hàng C",
        category: "Service",
        vendor: "Công ty TNHH B",
    }, {
        id: nanoid(6),
        name: "Mặt hàng C",
        category: "Service",
        vendor: "Công ty TNHH B",
    }, {
        id: nanoid(6),
        name: "Mặt hàng C",
        category: "Service",
        vendor: "Công ty TNHH B",
    }, {
        id: nanoid(6),
        name: "Mặt hàng C",
        category: "Service",
        vendor: "Công ty TNHH B",
    }, {
        id: nanoid(6),
        name: "Mặt hàng C",
        category: "Service",
        vendor: "Công ty TNHH B",
    }, {
        id: nanoid(6),
        name: "Mặt hàng C",
        category: "Service",
        vendor: "Công ty TNHH B",
    }])
    const [selectedItemRow, setSelectedItemRow] = useState(null);
    const [itemSelectModalOpen, setItemSelectModalOpen] = useState(false);
    const [selectedContentRow, setSelectedContentRow] = useState(null);

    const contentTableRef = useRef(null);

    const ItemNoTemplate = (product, columntWidth) => {
        const handleEditItemNo = (e) => {
            setContentData(prev => (prev.map(content => ({ ...content, ItemNo: e.target.value }))));
        }
        return <div className="p-inputtext p-component p-0 flex justify-between items-center border-r-0">
            <div className="p-2">
                <p className={`truncate`}>{product.ItemNo && product.ItemNo}
                    {product.Item.name && " - " + product.Item.name}</p>
            </div>
            <Button icon="pi pi-list" aria-label="Choose" onClick={() => { setSelectedItemRow(product); setItemSelectModalOpen(true) }} />
        </div>;
    };

    const ItemDescriptionTemplate = (product) => {
        const handleEditItemDescription = (e) => {
            setContentData(prev => (prev.map(content => ({ ...content, ItemDescription: e.target.value }))));
        }
        return <InputText className="w-full p-inputtext-sm" value={product.ItemDescription} onChange={handleEditItemDescription} />;
    };

    const ItemQuantityTemplate = (product) => {
        const handleEditItemQuantity = (e) => {
            setContentData(prev => (prev.map(content => ({ ...content, Quantity: e.target.value }))));
        }
        return <InputNumber inputId="integeronly" className="w-full text-right p-inputtext-sm" min={1} showButtons value={product.Quantity} onValueChange={handleEditItemQuantity} />
    };

    const ItemDiscountPercentTemplate = (product) => {
        const handleEditItemDiscountPercent = (e) => {
            setContentData(prev => (prev.map(content => ({ ...content, DiscountPercent: e.target.value }))));
        }
        return <InputNumber inputId="integeronly" className="w-full text-right p-inputtext-sm" min={0} suffix="%" value={product.DiscountPercent} onValueChange={handleEditItemDiscountPercent} />
    };

    const ItemPriceAfterDiscountTemplate = (product) => {
        const handleEditItemPriceAfterDiscount = (e) => {
            setContentData(prev => (prev.map(content => ({ ...content, PriceAfterDiscount: e.target.value }))));
        }
        return <InputNumber inputId="integeronly" className="w-full text-right p-inputtext-sm" min={1} value={product.PriceAfterDiscount} onValueChange={handleEditItemPriceAfterDiscount} />
    };

    const ItemTotalTemplate = (product) => {
        const handleEditItemTotal = (e) => {
            setContentData(prev => (prev.map(content => ({ ...content, Total: e.target.value }))));
        }
        return <InputNumber inputId="integeronly" className="w-full text-right p-inputtext-sm" min={1} value={product.Total} onValueChange={handleEditItemTotal} />
    };

    const ItemWarehouseTemplate = (product) => {
        const handleEditItemWarehouse = (e) => {
            setContentData(prev => (contentData.map(content => ({ ...content, Warehouse: e.target.value }))));
        }
        return (
            <Dropdown
                value={product.Warehouse}
                options={warehouseOptions}
                onChange={handleEditItemWarehouse}
                placeholder="Select a warehouse"
                className="p-inputtext-sm w-full"
            />
        );
    };

    const UoMCodeTemplate = (product) => {
        const handleEditUoMCode = (e) => {
            setContentData(prev => (contentData.map(content => ({ ...content, UoMCode: e.target.value }))));
        }
        return <InputText inputStyle={{ textAlign: 'right' }} className="w-full p-inputtext-sm" value={product.UoMCode} onChange={handleEditUoMCode} />;
    };

    const contentColumns = useMemo(
        () => [
            {
                header: 'Item No.',
                field: 'ItemNo',
                className: 'text-center',
                minWidth: '12rem',
                body: ItemNoTemplate
            },
            {
                header: 'Item Description',
                field: 'ItemDescription',
                className: 'text-center',
                minWidth: '12rem',
                body: ItemDescriptionTemplate
            },
            {
                header: 'Quantity',
                field: 'Quantity',
                className: 'text-center',
                minWidth: '14rem',
                body: ItemQuantityTemplate
            },
            {
                header: 'Discount %',
                field: 'DiscountPercent',
                className: 'text-right',
                minWidth: '14rem',
                body: ItemDiscountPercentTemplate
            },
            {
                header: 'Price after Discount',
                field: 'PriceAfterDiscount',
                className: 'text-right',
                minWidth: '14rem',
                body: ItemPriceAfterDiscountTemplate
            },
            {
                header: 'Total',
                field: 'Total',
                className: 'text-right',
                minWidth: '14rem',
                body: ItemTotalTemplate
            },
            {
                header: 'Warehouse',
                field: 'Warehouse',
                className: 'text-right',
                minWidth: '14rem',
                body: ItemWarehouseTemplate
            },
            {
                header: 'UoM Code',
                field: 'UoMCode',
                className: 'text-right',
                minWidth: '14rem',
                body: UoMCodeTemplate
            },
        ],
        []
    );

    const { width: containerWidth, height: containerHeight, ref: containerRef } = useResizeDetector();

    const handleAddNewRow = () => {
        // Validate các trường thông tin, xem đầy đủ chưa
        setContentData(prev => ([...prev, {
            id: nanoid(6),
            ItemNo: '',
            Item: {},
            ItemDescription: '',
            Quantity: '',
            DiscountPercent: '',
            PriceAfterDiscount: '',
            Total: '',
            Warehouse: '',
            UoMCode: ''
        }]));
    }

    const handleResizeColumn = (target) => {
        const value = target.element;
        if (value?.cellIndex && value?.cellIndex == 1) {
            const columnWidth = value.clientWidth;
            // setClientWidth({...clientWidths, column1: columnWidth});
        }
    }

    const handleSetItem = (item) => {
        const selectedItemId = selectedItemRow.id;
        const newItemId = item.id;
        setContentData((prev) => {
            const newData = prev.map((i) => {
                if (i.id == selectedItemId) {
                    return {
                        ...i,
                        ItemNo: item.id,
                        Item: item
                    }
                } else return i
            });
            console.log(newData);
            return newData
        })
        console.log("Item id: ", selectedItemId);
        console.log("Item: ", newItemId);
    }

    const handleDeleteItems = () => {
        // Validate lại một lần nữa nhé
        toast.success("Thành công.");
    }

    const contentTHeader = (
        <div className="flex justify-between items-center">
            <h5 className="mb-0">Item Table List</h5>
            <div className="flex gap-2">
                <Button type="button" icon="pi pi-copy" rounded outlined data-pr-tooltip="Copy" tooltip="Copy" tooltipOptions={{ position: 'bottom', mouseTrack: true, mouseTrackTop: 15 }} />
                <button type="button" className="paste-btn p-button p-component p-button-icon-only p-button-outlined p-button-rounded" data-pr-tooltip="Paste" tooltip="Paste" >
                    <Icon icon="icons8:paste" width="1.5rem" height="1.5rem" />
                </button>
                <Tooltip target=".paste-btn" mouseTrack position={'bottom'} mouseTrackTop={15} />
                <Button type="button" disabled={!selectedContentRow || selectedContentRow?.length < 1 || selectedContentRow?.length == contentData.length} icon="pi pi-trash" severity="danger" rounded outlined data-pr-tooltip="Delete" tooltip="Delete" tooltipOptions={{ position: 'bottom', mouseTrack: true, mouseTrackTop: 15 }} onClick={handleDeleteItems} />
            </div>
        </div>
    )

    const contentTFooter = (
        <div onClick={handleAddNewRow} className="flex items-center justify-center cursor-pointer">
            +
        </div>
    )

    return (
        <>
            <div ref={containerRef} className="flex flex-col min-h-[calc(100vh-9rem)] mb-[75px]">
                <div className="w-full">
                    <div className="card">
                        <h3>Create Document</h3>
                        <div className="flex py-2">
                            <div className="flex flex-col">
                                <span className="font-bold">Document Type</span>
                                <span className="font-bold text-2xl text-indigo-500">Goods Receipt</span>
                            </div>
                            <Divider className="px-3" layout="vertical" />
                            <div className="flex flex-col">
                                <span className="font-bold">Document No.</span>
                                <span className="font-bold text-2xl text-indigo-500">0001</span>
                            </div>
                        </div>
                        <section>
                            <div className='mb-2.5 mt-4'>
                                <h6 className='mb-0 font-bold uppercase'>General Information</h6>
                                <Divider className="my-2" />
                            </div>
                            <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 md:grid-cols-4 p-[7px]">
                                <div className="flex flex-column gap-2">
                                    <label className='font-semibold'>Price List</label>
                                    <Dropdown value={selectedPriceList} onChange={(e) => setSelectedPriceList(e.value)} options={priceListOptions} optionLabel="price-list"
                                        placeholder="Select price list" className="w-full" />
                                </div>
                                <div className="flex flex-column gap-2">
                                    <label className='font-semibold'>Series/No</label>
                                    <Dropdown value={selectedSeriesNo} onChange={(e) => setSelectedSeriesNo(e.value)} options={seriesNoOptions} optionLabel="price-list"
                                        placeholder="Select price list" className="w-full" />
                                    {/* <InputText aria-describedby="price-list-help" /> */}
                                </div>
                                <div className="flex flex-column gap-2">
                                    <label className='font-semibold'>Document Date</label>
                                    <Calendar className="p-inputtext-sm text-base" showIcon />
                                </div>
                                <div className="flex flex-column gap-2">
                                    <label className='font-semibold'>Posting Date</label>
                                    <Calendar className="p-inputtext-sm text-base" showIcon />
                                </div>
                                <div className="flex flex-column gap-2">
                                    <label className='font-semibold'>Ref 2.</label>
                                    <InputText aria-describedby="ref-2" />
                                </div>
                            </div>

                            <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 md:grid-cols-4 p-[7px] mt-2">
                                <div className="flex flex-column gap-2">
                                    <label className='font-semibold'>Remark</label>
                                    <InputTextarea autoresize rows={2} />
                                </div>
                                <div className="flex flex-column gap-2">
                                    <label className='font-semibold'>Journal Remark</label>
                                    <InputTextarea autoresize rows={2} />
                                </div>
                            </div>
                        </section>
                        <section>
                            <div className='mb-2.5 mt-4'>
                                <h6 className='mb-0 font-bold uppercase'>Content</h6>
                                <Divider className="my-2" />
                            </div>
                            <div className="mt-4">
                                <DataTable
                                    ref={contentTableRef}
                                    reorderableRows
                                    value={contentData}
                                    className="list-table p-datatable-gridlines"
                                    editMode
                                    header={contentTHeader}
                                    footer={contentTFooter}
                                    showGridlines
                                    onColumnResizeEnd={handleResizeColumn}
                                    // rows={8}
                                    // rowsPerPageOptions={[20, 50, 100, 200]}
                                    selectionMode={'checkbox'}
                                    selection={selectedContentRow}
                                    onSelectionChange={(e) => {
                                        const currentValue = e.value;
                                        setSelectedContentRow(e.value)
                                    }}
                                    // globalFilterFields={['DocNo', 'PostingDate', 'DocumentDate', 'DocumentTotal']}
                                    dataKey="id"
                                    stripedRows={false}
                                    // filters={grFilters}
                                    columnResizeMode="expand"
                                    resizableColumns
                                    // filterDisplay="row"
                                    loading={loading}
                                    responsiveLayout="scroll"
                                    sortMode="multiple"
                                    removableSort
                                    onRowReorder={(e) => setContentData(e.value)}
                                // emptyMessage="No goods receipt found."
                                // header={header}
                                >
                                    <Column rowReorder style={{ width: '3rem' }} />
                                    <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                                    {
                                        contentColumns && contentColumns.length > 0 && contentColumns.map((col, index) => (
                                            <Column
                                                key={index}
                                                // ref={index === 1 ? columnRef : null}
                                                header={col.header}
                                                field={col.field}
                                                style={{ minWidth: col.minWidth }}
                                                className="text-right"
                                                body={col.body}
                                            />
                                        ))
                                    }

                                </DataTable>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
            <FeatureBar style={{ width: `${containerWidth}px`, maxWidth: `${containerWidth}px` }} className={`!max-w-[${containerWidth}px] !w-[${containerWidth}px]`} />
            <ItemList itemSelectModalOpen={itemSelectModalOpen} setItemSelectModalOpen={(value) => setItemSelectModalOpen(value)} itemList={itemList} selectedItemRow={selectedItemRow?.Item} setItem={handleSetItem} />
            <Dialog header="Delete items" visible={visible} position={position} style={{ width: '50vw' }} onHide={() => setVisible(false)} footer={footerContent} draggable={false} resizable={false}>
                <h5 className="m-0">
                    Are you sure want to delete {selectedContentRow} items? This action cannot be reverted.
                </h5>
            </Dialog>
        </>
    );
};

// export default withAuth(CreateGoodsReceipt);
export default CreateGoodsReceipt;
