import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useResizeDetector } from 'react-resize-detector';

import inventoryApi from '@/service/ServiceLayer/inventoryApi';
import withAuth from '@/utils/withAuth';
import toast from 'react-hot-toast';
import { nanoid } from 'nanoid';

import { classNames } from 'primereact/utils';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Checkbox } from "primereact/checkbox";
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Divider } from 'primereact/divider';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import { Calendar } from 'primereact/calendar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Icon } from '@iconify/react';
import { FileUpload } from 'primereact/fileupload';
import { ProgressBar } from 'primereact/progressbar';
import { Panel } from 'primereact/panel';
import { Slider } from 'primereact/slider';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';
import { Tag } from 'primereact/tag';


import ItemList from '@/components/ItemList';

import FeatureBar from '@/components/FeatureBar';

const CreateDelivery = () => {
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [selectedContactPerson, setSelectedContactPerson] = useState(null);
    const [selectedSeriesNo, setSelectedSeriesNo] = useState(null);
    const [selectedCurrency, setSelectedCurrency] = useState(null);
    const [selectedItemType, setSelectedItemType] = useState(null);
    const [selectedSalesEmployee, setSelectedSalesEmployee] = useState(null);
    const [selectedOwner, setSelectedOwner] = useState(null);
    const [selectedPaymentTerm, setSelectedPaymentTerm] = useState(null);
    const [selectedShippedGoodsAccount, setSelectedShippedGoodsAccount] = useState(null);
    const [selectedBPProject, setSelectedBPProject] = useState(null);
    const [selectedShipToBPAddress, setSelectedShipToBPAddress] = useState(null);
    const [selectedBillToBPAddress, setSelectedBillToBPAddress] = useState(null);
    const [customerListOptions, setCustomerListOptions] = useState([
        { name: 'Customer 01', code: 'customer1' },
        { name: 'Customer 02', code: 'customer2' },
        { name: 'Customer 03', code: 'customer3' },
        { name: 'Customer 04', code: 'customer4' },
        { name: 'Customer 05', code: 'customer5' },
        { name: 'Customer 06', code: 'customer6' },
        { name: 'Customer 07', code: 'customer7' },
        { name: 'Customer 08', code: 'customer8' },
        { name: 'Customer 09', code: 'customer9' },
        { name: 'Customer 10', code: 'customer10' },
    ]);
    const [contactPersonListOptions, setContactPersonListOptions] = useState([
        { name: 'Person 01', code: 'person1' },
        { name: 'Person 02', code: 'person2' },
        { name: 'Person 03', code: 'person3' },
        { name: 'Person 04', code: 'person4' },
        { name: 'Person 05', code: 'person5' },
        { name: 'Person 06', code: 'person6' },
        { name: 'Person 07', code: 'person7' },
        { name: 'Person 08', code: 'person8' },
        { name: 'Person 09', code: 'person9' },
        { name: 'Person 10', code: 'person10' },
    ]);
    const [salesEmployeeListOptions, setSalesEmployeeListOptions] = useState([
        { name: 'Employee 01', code: 'employee1' },
        { name: 'Employee 02', code: 'employee2' },
        { name: 'Employee 03', code: 'employee3' },
        { name: 'Employee 04', code: 'employee4' },
        { name: 'Employee 05', code: 'employee5' },
        { name: 'Employee 06', code: 'employee6' },
        { name: 'Employee 07', code: 'employee7' },
        { name: 'Employee 08', code: 'employee8' },
        { name: 'Employee 09', code: 'employee9' },
        { name: 'Employee 10', code: 'employee10' },
    ]);
    const [userListOptions, setUserListOptions] = useState([
        { name: 'User 01', code: 'user1' },
        { name: 'User 02', code: 'user2' },
        { name: 'User 03', code: 'user3' },
        { name: 'User 04', code: 'user4' },
        { name: 'User 05', code: 'user5' },
        { name: 'User 06', code: 'user6' },
        { name: 'User 07', code: 'user7' },
        { name: 'User 08', code: 'user8' },
        { name: 'User 09', code: 'user9' },
        { name: 'User 10', code: 'user10' },
    ]);
    const [paymentTermOptions, setPaymentTermOptions] = useState([
        { name: 'Net 0', code: 'net0' },
        { name: 'Net 7', code: 'net7' },
        { name: 'Net 10', code: 'net10' },
        { name: 'Net 15', code: 'net15' },
        { name: 'Net 20', code: 'net20' },
        { name: 'Net 45', code: 'net45' },
        { name: 'Net 60', code: 'net60' },
        { name: 'Net 90', code: 'net90' },
        { name: 'Payment in advance', code: 'paymentinadvance' },
    ]);
    const [paymentMethodOptions, setPaymentMethodOptions] = useState([]);
    const [yesNoOption, setYesNoOption] = useState([
        { name: 'Yes', code: '1' },
        { name: 'No', code: '0' },
    ]);
    const [bpProjectOptions, setBPProjectOptions] = useState([]);

    const [shipToBPAddressOptions, setShipToBPAddressOptions] = useState([
        { name: 'Ship To', code: 'shipto' },
    ]);
    const [billToBPAddressOptions, setBillToBPAddressOptions] = useState([
        { name: 'Bill To', code: 'billto' },
    ]);
    const [stateListOptions, setStateListOptions] = useState([]);
    const [countryListOptions, setCountryListOptions] = useState([
        { name: 'Viet Nam', code: 'vi' },
        { name: 'England', code: 'en' },
        { name: 'United State', code: 'us' },
        { name: 'China', code: 'cn' },
        { name: 'Japan', code: 'jp' },
        { name: 'Korea', code: 'kr' },
    ]);
    const [seriesNoOptions, setSeriesNoOptions] = useState([
        { name: 'Primary', code: 'primary' },
        { name: 'Manual', code: 'manual' }
    ]);
    const [warehouseOptions, setWarehouseOptions] = useState([
        { name: 'Warehouse 1', code: 'warehouse1' },
        { name: 'Warehouse 2', code: 'warehouse2' }
    ]);
    const [currencyOptions, setCurrencyOptions] = useState([
        { name: 'Local Currency', code: 'localCurrency' },
        { name: 'System Currency', code: 'systemCurrency' },
        { name: 'BP Currency', code: 'bpCurrency' },
    ]);
    const [itemTypeOptions, setItemTypeOptions] = useState([
        { name: 'Item', code: 'item' },
        { name: 'Service', code: 'service' }
    ]);
    const [gradeOptions, setGradeOptions] = useState([
        { name: 'Low', code: '01' },
        { name: 'Middle', code: '02' },
        { name: 'High', code: '03' },
    ]);
    const [systemOptions, setSystemOptions] = useState([
        { name: 'Option 1', code: '1' },
        { name: 'Option 2', code: '2' },
        { name: 'Option 3', code: '3' },
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
            UoMCode: '',
            DescriptionEn: '',
            DescriptionVi: '',
            System: '',
            ActualDays: '',
            StandardDays: '',
            Grade: '',
            Remark: '',
            ItemDetail: '',
            APInvoiceENo: '',
        }
    ]);
    const [freightChargeData, setFreightChargeData] = useState([
        {
            id: nanoid(6),
            FreightName: 'Test',
            Remarks: '12',
            TaxGroup: 'GTGT',
            TaxPercent: '8%',
            TaxAmount: '10000',
            TotalTaxAmount: '150000',
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
    const [selectedFreightChargeRow, setSelectedFreightChargeRow] = useState(null);
    const [isRounding, setIsRounding] = useState(false);

    const [whichEditAddressModalOpen, setWhichEditAddressModalOpen] = useState(null);

    const [totalSize, setTotalSize] = useState(0);
    const fileUploadRef = useRef(null);

    const contentTableRef = useRef(null);
    const freightChargeTableRef = useRef(null);

    const ItemNoTemplate = (product, columntWidth) => {
        const handleEditItemNo = (e) => {
            setContentData(prev => (prev.map(content => ({ ...content, ItemNo: e.target.value }))));
        }
        return <div className="p-inputtext p-inputtext-sm p-component w-full p-0 flex justify-between items-center border-r-0">
            <div className="p-2">
                <p className={`truncate`}>{product.ItemNo && product.ItemNo}
                    {product.Item.name && " - " + product.Item.name}</p>
            </div>
            <Button icon="pi pi-list" aria-label="Choose" onClick={() => { setSelectedItemRow(product); setItemSelectModalOpen(true) }} />
        </div>;
    };

    const ItemDescriptionTemplate = (product) => {
        const handleEditItemDescription = (e) => {
            setContentData(prev => (prev.map(content => {
                if (content.id == product.id) {
                    return { ...content, ItemDescription: e.target.value }
                } else return content
            })));
        }
        return <InputText className="w-full p-inputtext-sm" value={product.ItemDescription} onChange={handleEditItemDescription} />;
    };

    const ItemQuantityTemplate = (product) => {
        const handleEditItemQuantity = (e) => {
            setContentData(prev => (prev.map(content => {
                if (content.id == product.id) {
                    return { ...content, Quantity: e.target.value }
                } else return content;
            })));
        }
        return <InputNumber inputId="integeronly" className="w-full text-right p-inputtext-sm" min={1} showButtons value={product.Quantity} onValueChange={handleEditItemQuantity} />
    };

    const ItemDiscountPercentTemplate = (product) => {
        const handleEditItemDiscountPercent = (e) => {
            setContentData(prev => (prev.map(content => {
                if (content.id == product.id)
                    return { ...content, DiscountPercent: e.target.value }
                else return content
            })));
        }
        return <InputNumber inputId="integeronly" className="w-full text-right p-inputtext-sm" min={0} suffix="%" value={product.DiscountPercent} onValueChange={handleEditItemDiscountPercent} />
    };

    const ItemPriceAfterDiscountTemplate = (product) => {
        const handleEditItemPriceAfterDiscount = (e) => {
            setContentData(prev => (prev.map(content => {
                if (content.id == product.id)
                    return { ...content, PriceAfterDiscount: e.target.value }
                else return content
            })));
        }
        return <InputNumber inputId="integeronly" className="w-full text-right p-inputtext-sm" min={1} value={product.PriceAfterDiscount} onValueChange={handleEditItemPriceAfterDiscount} />
    };

    const ItemTotalTemplate = (product) => {
        const handleEditItemTotal = (e) => {
            setContentData(prev => (prev.map(content => {
                if (content.id == product.id)
                    return { ...content, Total: e.target.value }
                else return content
            })));
        }
        return <InputNumber inputId="integeronly" className="w-full text-right p-inputtext-sm" min={1} value={product.Total} onValueChange={handleEditItemTotal} />
    };

    const ItemWarehouseTemplate = (product) => {
        const handleEditItemWarehouse = (e) => {
            setContentData(prev => (contentData.map(content => {
                if (content.id == product.id)
                    return { ...content, Warehouse: e.target.value }
                else return content;
            })));
        }
        return (
            <>
                <Dropdown
                    showClear filter
                    value={product.Warehouse}
                    options={warehouseOptions}
                    onChange={handleEditItemWarehouse}
                    optionLabel="name"
                    placeholder="Select a warehouse"
                    className="p-inputtext-sm w-full"
                />
            </>

        );
    };

    const BodyDescriptionTemplate = (product, lang) => {
        const handleEditItemDescription = (e) => {
            setContentData(prev => (contentData.map(content => {
                if (content.id == product.id) {
                    if (lang == 'vi') return { ...content, DescriptionVi: e.target.value };
                    else return { ...content, DescriptionEn: e.target.value };
                } else return content;
            })));
        }
        return (
            <div className="flex items-center">
                <InputTextarea className="w-full p-inputtext-sm" value={lang == 'vi' ? product.DescriptionVi : product.DescriptionEn} autoresize={true} rows={1} onChange={handleEditItemDescription} />
            </div>

        );
    };

    const ItemGradeTemplate = (product) => {
        const handleEditItemGrade = (e) => {
            setContentData(prev => (contentData.map(content => {
                if (content.id == product.id)
                    return { ...content, Grade: e.target.value }
                else return content;
            })));
        }
        return (
            <>
                <Dropdown
                    showClear
                    filter
                    value={product.Grade}
                    options={gradeOptions}
                    onChange={handleEditItemGrade}
                    optionLabel="name"
                    placeholder="Select a grade"
                    className="p-inputtext-sm w-full"
                />
            </>
        );
    };

    const ItemSystemTemplate = (product) => {
        const handleEditItemSystem = (e) => {
            setContentData(prev => (contentData.map(content => {
                if (content.id == product.id)
                    return { ...content, System: e.target.value }
                else return content;
            })));
        }
        return (
            <>
                <Dropdown
                    value={product.System}
                    options={systemOptions}
                    onChange={handleEditItemSystem}
                    optionLabel="name"
                    placeholder="Select a system"
                    className="p-inputtext-sm w-full"
                />
            </>

        );
    };

    const ItemActualDaysTemplate = (product) => {
        const handleEditActualDays = (e) => {
            setContentData(prev => (prev.map(content => {
                if (content.id == product.id) {
                    return { ...content, ActualDays: e.target.value }
                } else return content;
            })));
        }
        return <InputNumber inputId="integeronly" className="w-full text-right p-inputtext-sm" min={1} showButtons value={product.ActualDays} onValueChange={handleEditActualDays} />
    };

    const ItemStandardDaysTemplate = (product) => {
        const handleEditActualDays = (e) => {
            setContentData(prev => (prev.map(content => {
                if (content.id == product.id) {
                    return { ...content, StandardDays: e.target.value }
                } else return content;
            })));
        }
        return <InputNumber inputId="integeronly" className="w-full text-right p-inputtext-sm" min={1} showButtons value={product.ActualDays} onValueChange={handleEditActualDays} />
    };

    const UoMCodeTemplate = (product) => {
        const handleEditUoMCode = (e) => {
            setContentData(prev => (contentData.map(content => ({ ...content, UoMCode: e.target.value }))));
        }
        return <InputText inputStyle={{ textAlign: 'right' }} className="w-full p-inputtext-sm" value={product.UoMCode} onChange={handleEditUoMCode} />;
    };

    const ItemRemarkTemplate = (product) => {
        const handleEditItemRemark = (e) => {
            setContentData(prev => (contentData.map(content => ({ ...content, Remark: e.target.value }))));
        }
        return (
            <div className="flex items-center">
                <InputTextarea className="w-full p-inputtext-sm" value={product.Remark} onChange={handleEditItemRemark} autoresize={true} rows={1} />
            </div>

        );
    };

    const ItemDetailTemplate = (product) => {
        const handleEditItemDetail = (e) => {
            setContentData(prev => (contentData.map(content => ({ ...content, ItemDetail: e.target.value }))));
        }
        return (
            <div className="flex items-center">
                <InputTextarea className="w-full p-inputtext-sm" value={product.ItemDetail} onChange={handleEditItemDetail} autoresize={true} rows={1} />
            </div>

        );
    };

    const APInvoiceENoTemplate = (product) => {
        const handleEditAPInvoiceENo = (e) => {
            setContentData(prev => (contentData.map(content => ({ ...content, APInvoiceENo: e.target.value }))));
        }
        return <InputText inputStyle={{ textAlign: 'right' }} className="w-full p-inputtext-sm" value={product.APInvoiceENo} onChange={handleEditAPInvoiceENo} />;
    };

    const addressModalFooter =  () => {
        return (
            <div>
                <Button label="Cancel" icon="pi pi-times" onClick={() => setWhichEditAddressModalOpen(null)} className="p-button-text" />
                <Button label="Yes" icon="pi pi-check" onClick={handleConfirmAddressModal} autoFocus />
            </div>
    )};

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
            {
                header: 'Description VN',
                field: 'DescriptionVi',
                className: 'text-right',
                minWidth: '14rem',
                body: (product) => BodyDescriptionTemplate(product, 'vi')
            },
            {
                header: 'Description EN',
                field: 'DescriptionEn',
                className: 'text-right',
                minWidth: '14rem',
                body: (product) => BodyDescriptionTemplate(product, 'en')
            },
            {
                header: 'System',
                field: 'System',
                className: 'text-right',
                minWidth: '14rem',
                body: ItemSystemTemplate
            },
            {
                header: 'Actual Days',
                field: 'ActualDays',
                className: 'text-center',
                minWidth: '14rem',
                body: ItemActualDaysTemplate
            },
            {
                header: 'Standard Days',
                field: 'StandardDays',
                className: 'text-center',
                minWidth: '14rem',
                body: ItemStandardDaysTemplate
            },
            {
                header: 'Grade',
                field: 'Grade',
                className: 'text-right',
                minWidth: '14rem',
                body: ItemGradeTemplate
            },
            {
                header: 'Remark',
                field: 'Remark',
                className: 'text-right',
                minWidth: '14rem',
                body: ItemRemarkTemplate
            },
            {
                header: 'Item/Service Detail',
                field: 'ItemDetail',
                className: 'text-right',
                minWidth: '14rem',
                body: ItemDetailTemplate
            },
            {
                header: 'APInvoice eNo.',
                field: 'APInvoiceENo',
                className: 'text-right',
                minWidth: '14rem',
                body: APInvoiceENoTemplate
            },
        ],
        []
    );

    const freightChargesColumns = useMemo(
        () => [
            {
                header: 'Freight Name',
                field: 'FreightName',
                className: 'text-center',
                minWidth: '12rem'
            },
            {
                header: 'Remarks',
                field: 'Remarks',
                className: 'text-center',
                minWidth: '12rem'
            },
            {
                header: 'Tax Group',
                field: 'TaxGroup',
                className: 'text-center',
                minWidth: '14rem'
            },
            {
                header: 'Tax %',
                field: 'TaxPercent',
                className: 'text-right',
                minWidth: '14rem',
            },
            {
                header: 'Tax Amount',
                field: 'TaxAmount',
                className: 'text-center',
                minWidth: '14rem'
            },
            {
                header: 'Total Tax Amount',
                field: 'TotalTaxAmount',
                className: 'text-center',
                minWidth: '14rem'
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

    const freightChargeTHeader = (
        <div className="flex justify-between items-center">
            <h5 className="mb-0">Freight Charge Table List</h5>
            <div className="flex gap-2">
                <Button type="button" disabled={!selectedContentRow || selectedContentRow?.length < 1 || selectedContentRow?.length == contentData.length} icon="pi pi-sync" severity="danger" rounded outlined data-pr-tooltip="Delete" tooltip="Delete" tooltipOptions={{ position: 'bottom', mouseTrack: true, mouseTrackTop: 15 }} onClick={handleDeleteItems} />
            </div>
        </div>
    )

    const contentTFooter = (
        <div onClick={handleAddNewRow} className="flex items-center justify-center cursor-pointer">
            + Add a new row
        </div>
    )

    const summaryHeaderTemplate = (options) => {
        const className = `${options.className} justify-content-space-between`;

        return (
            <div className={className}>
                <div className="flex align-items-center gap-2">
                    <span className="font-bold text-lg py-2">Total Summary</span>
                </div>
            </div>
        );
    };

    const onTemplateSelect = (e) => {
        let _totalSize = totalSize;
        let files = e.files;

        Object.keys(files).forEach((key) => {
            _totalSize += files[key].size || 0;
        });

        setTotalSize(_totalSize);
    };

    const onTemplateUpload = (e) => {
        let _totalSize = 0;

        e.files.forEach((file) => {
            _totalSize += file.size || 0;
        });

        setTotalSize(_totalSize);
        toast.current.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
    };

    const onTemplateRemove = (file, callback) => {
        setTotalSize(totalSize - file.size);
        callback();
    };

    const onTemplateClear = () => {
        setTotalSize(0);
    };

    const uploadHeaderTemplate = (options) => {
        const { className, chooseButton, uploadButton, cancelButton } = options;
        const value = totalSize / 10000;
        const formatedValue = fileUploadRef && fileUploadRef.current ? fileUploadRef.current.formatSize(totalSize) : '0 B';

        return (
            <div className={className} style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center' }}>
                {chooseButton}
                {cancelButton}
                <div className="flex align-items-center gap-3 ml-auto">
                    <span>{formatedValue} / 5 MB</span>
                    <ProgressBar value={value} showValue={false} style={{ width: '10rem', height: '12px' }}></ProgressBar>
                </div>
            </div>
        );
    };

    const uploadItemTemplate = (file, props) => {
        return (
            <div className="flex align-items-center flex-wrap">
                <div className="flex align-items-center" style={{ width: '40%' }}>
                    <img alt={file.name} role="presentation" src={file.objectURL || "/images/document-icon.png"} width={40} />
                    <span className="flex flex-column text-left ml-3">
                        {file.name}
                        <small>{new Date().toLocaleDateString()}</small>
                    </span>
                </div>
                <Tag value={props.formatSize} severity="warning" className="px-3 py-2" />
                <Button type="button" icon="pi pi-times" className="p-button-outlined p-button-rounded p-button-danger ml-auto" onClick={() => onTemplateRemove(file, props.onRemove)} />
            </div>
        );
    };

    const emptyTemplate = () => {
        return (
            <div className="flex align-items-center flex-column">
                <i className="pi pi-image mt-3 p-5" style={{ fontSize: '5em', borderRadius: '50%', backgroundColor: 'var(--surface-b)', color: 'var(--surface-d)' }}></i>
                <span style={{ fontSize: '1.2em', color: 'var(--text-color-secondary)' }} className="my-5">
                    Drag and Drop File Here
                </span>
            </div>
        );
    };

    const handleConfirmAddressModal = () => {
        toast("Developing.");
        setWhichEditAddressModalOpen(null)
    }

    const chooseOptions = { icon: 'pi pi-fw pi-cloud-upload', iconOnly: true, className: 'custom-choose-btn p-button-rounded p-button-outlined' };
    const cancelOptions = { icon: 'pi pi-fw pi-times', iconOnly: true, className: 'custom-cancel-btn p-button-danger p-button-rounded p-button-outlined' };

    return (
        <>
            <div ref={containerRef} className="flex flex-col min-h-[calc(100vh-9rem)] mb-[75px]">
                <div className="w-full">
                    <div className="card">
                        <h3>Create Document</h3>
                        <div className="flex justify-center sm:justify-start flex-col sm:flex-row py-2 gap-2 sm:gap-0">
                            <div className="flex gap-3 sm:gap-0 sm:flex-col">
                                <span className="flex items-center font-bold">Document Type</span>
                                <span className="font-bold text-xl sm:text-2xl text-indigo-500">Delivery</span>
                            </div>
                            <Divider className="hidden sm:block px-3" layout="vertical" />
                            <div className="flex gap-3 sm:gap-0 sm:flex-col">
                                <span className="flex items-center font-bold">Document No.</span>
                                <span className="font-bold text-xl sm:text-2xl text-indigo-500">0001</span>
                            </div>
                            <Divider className="hidden sm:block px-3" layout="vertical" />
                            <div className="flex gap-3 sm:gap-0 sm:flex-col">
                                <span className="flex items-center font-bold">Status</span>
                                <span className="font-bold text-xl sm:text-2xl text-indigo-500">Open</span>
                            </div>
                        </div>
                        <section>
                            <div className='mb-2.5 mt-4'>
                                <h5 className='mb-0 font-bold text-indigo-600 uppercase'>General Information</h5>
                                <Divider className="my-2" />
                            </div>
                            <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 md:grid-cols-4 p-[7px]">
                                <div className="flex flex-column gap-2">
                                    <label className='font-semibold'>Customer <span className="text-red-700 font-semibold">*</span></label>
                                    <Dropdown showClear filter options={customerListOptions} value={selectedCustomer} optionLabel="name"
                                        placeholder="Select customer" onChange={(e) => setSelectedCustomer(e.value)} className="w-full" />
                                </div>
                                <div className="flex flex-column gap-2">
                                    <label className='font-semibold'>Customer Name</label>
                                    <div className="w-full p-inputtext p-component flex-1 !min-h-[42px]"><span className="h-[21px]"></span></div>
                                </div>
                                <div className="flex flex-column gap-2">
                                    <label className='font-semibold'>Contact Person</label>
                                    <Dropdown showClear filter options={contactPersonListOptions} value={selectedContactPerson} optionLabel="name"
                                        placeholder="Select contact person" onChange={(e) => setSelectedContactPerson(e.value)} className="w-full" />
                                </div>
                                <div className="flex flex-column gap-2">
                                    <label className='font-semibold'>Customer Ref No.</label>
                                    <InputText aria-describedby="customer-ref-no" />
                                </div>
                                <div className="flex flex-column gap-2">
                                    <label className='font-semibold'>Series/No</label>
                                    <div className="flex gap-2">
                                        <Dropdown showClear filter value={selectedSeriesNo?.type} onChange={(e) => setSelectedSeriesNo({ type: e.value, value: 11 })} options={seriesNoOptions} optionLabel="name"
                                            placeholder="Select series number" className="w-full flex-1" />
                                        {
                                            selectedSeriesNo && (
                                                <InputText className="w-1/6" aria-describedby="manual-series-no" disabled={selectedSeriesNo?.type != 'manual'} value={selectedSeriesNo?.value} onChange={(e) => setSelectedSeriesNo(prev => ({ ...prev, value: e.target.value }))} />
                                            )
                                        }
                                    </div>
                                </div>
                                <div className="flex flex-column gap-2">
                                    <label className='font-semibold'>Posting Date</label>
                                    <Calendar className="text-base" showIcon />
                                </div>
                                <div className="flex flex-column gap-2">
                                    <label className='font-semibold'>Delivery Date <span className="text-red-700 font-semibold">*</span></label>
                                    <Calendar className="text-base" showIcon />
                                </div>
                                <div className="flex flex-column gap-2">
                                    <label className='font-semibold'>Document Date</label>
                                    <Calendar className="text-base" showIcon />
                                </div>
                            </div>

                            <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 md:grid-cols-4 p-[7px] mt-2">
                                <div className="flex flex-column gap-2">
                                    <label className='font-semibold'>Remark</label>
                                    <InputTextarea autoresize={true} rows={2} />
                                </div>
                                <div className="flex flex-column gap-2">
                                    <label className='font-semibold'>Sales Employee</label>
                                    <Dropdown showClear filter value={selectedSalesEmployee} onChange={(e) => setSelectedSalesEmployee(e.value)} options={salesEmployeeListOptions} optionLabel="name"
                                        placeholder="Select a sales employee" className="w-full" />

                                </div>
                                <div className="flex flex-column gap-2">
                                    <label className='font-semibold'>Owner</label>
                                    <Dropdown filter showClear value={selectedOwner} onChange={(e) => setSelectedOwner(e.value)} options={userListOptions} optionLabel="name"
                                        placeholder="Select an owner" className="w-full" />
                                    {/* <InputText aria-describedby="price-list-help" /> */}
                                </div>
                            </div>
                        </section>
                        <section>
                            <div className='mb-2.5 mt-4'>
                                <h5 className='mb-0 font-bold uppercase text-indigo-600'>Content</h5>
                                <Divider className="my-2" />
                            </div>
                            <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 md:grid-cols-4 p-[7px] mt-2">
                                <div className="flex flex-column gap-2">
                                    <label className='font-semibold'>Currency</label>
                                    <Dropdown value={selectedCurrency} filter showClear onChange={(e) => setSelectedCurrency(e.value)} options={currencyOptions} optionLabel="name"
                                        placeholder="Select a currency" className="w-full" />
                                    {/* <InputText aria-describedby="price-list-help" /> */}
                                </div>
                                <div className="flex flex-column gap-2">
                                    <label className='font-semibold'>Item/Service Type</label>
                                    <Dropdown value={selectedItemType} showClear onChange={(e) => setSelectedItemType(e.value)} options={itemTypeOptions} optionLabel="name"
                                        placeholder="Select an item/service type" className="w-full" />
                                    {/* <InputText aria-describedby="price-list-help" /> */}
                                </div>
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
                                    selectionAutoFocus={false}
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
                            <div className="mt-4">
                                <DataTable
                                    ref={freightChargeTableRef}
                                    reorderableRows
                                    value={freightChargeData}
                                    className="list-table p-datatable-gridlines"
                                    editMode
                                    header={freightChargeTHeader}
                                    showGridlines
                                    // onColumnResizeEnd={handleResizeColumn}
                                    selectionAutoFocus={false}
                                    // rows={8}
                                    // rowsPerPageOptions={[20, 50, 100, 200]}
                                    selectionMode={'checkbox'}
                                    selection={selectedContentRow}
                                    onSelectionChange={(e) => {
                                        const currentValue = e.value;
                                        setSelectedFreightChargeRow(e.value)
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
                                    emptyMessage="No freight charge found."
                                // header={header}
                                >
                                    <Column rowReorder style={{ width: '3rem' }} />
                                    <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                                    {
                                        freightChargesColumns && freightChargesColumns.length > 0 && freightChargesColumns.map((col, index) => (
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
                            <div className="mt-4 flex w-full justify-end">
                                <div className="md:!w-[40%] w-full">
                                    {/* <div className="w-full md:w-1/2"> */}
                                    <Panel headerTemplate={summaryHeaderTemplate}>
                                        <ul className="list-none p-0 m-0">
                                            <li className="flex items-center justify-between pb-1.5 px-2 border-300 flex-wrap">
                                                <div className="text-500 w-6 md:w-4 font-medium">Total Before Discount</div>
                                                {/* <div className="text-900 w-full md:w-4 md:flex-order-0 flex-order-1">Heat</div> */}
                                                <div className="w-6 md:w-4 flex justify-content-end">
                                                    10,000,000 VND
                                                </div>
                                            </li>
                                            <li className="flex items-center justify-between py-1.5 px-2 border-top-1 border-300 flex-wrap">
                                                <div className="text-500 w-6 md:w-4 font-medium">Discount</div>
                                                <div className="text-900 w-full md:w-4 md:flex-order-0 flex-order-1"><InputNumber inputId="percent" className='w-full text-right p-inputtext-sm' min={0} max={100} suffix="%" />
                                                </div>
                                                <div className="w-6 md:w-4 flex justify-content-end">
                                                    10,000,000 VND
                                                </div>
                                            </li>
                                            <li className="flex items-center justify-between py-1.5 px-2 border-top-1 border-300 flex-wrap">
                                                <div className="text-500 w-6 md:w-4 font-medium">Rounding</div>
                                                <div className="text-900 w-full md:w-4 md:flex-order-0 flex-order-1"><Checkbox onChange={e => setIsRounding(e.checked)} checked={isRounding}></Checkbox></div>
                                                <div className="w-6 md:w-4 flex justify-content-end">
                                                    {
                                                        isRounding ? <InputNumber inputId="integeronly" className="w-full text-right p-inputtext-sm" min={0} suffix=" VND" /> : '10,000,000 VND'
                                                    }
                                                </div>
                                            </li>
                                            <li className="flex items-center justify-between py-1.5 px-2 border-top-1 border-300 flex-wrap">
                                                <div className="text-500 w-4 md:w-4 font-medium">Tax</div>
                                                <div className="text-900 w-full md:w-4 md:flex-order-0 flex-order-1"></div>
                                                <div className="w-6 md:w-4 flex justify-content-end">10,000,000 VND</div>
                                            </li>
                                            <li className="flex items-center justify-between py-1.5 px-2 border-top-1 border-300 flex-wrap">
                                                <div className="text-500 w-4 md:w-2 font-medium">Total</div>
                                                <div className="text-900 w-full md:w-4 md:flex-order-0 flex-order-1 line-height-3"></div>
                                                <div className="w-6 md:w-4 flex justify-content-end">10,000,000 VND</div>
                                            </li>
                                        </ul>
                                    </Panel>
                                    {/* </div> */}
                                </div>
                            </div>
                        </section>
                        <section>
                            <div className='mb-2.5 mt-4'>
                                <h5 className='mb-0 font-bold uppercase text-indigo-600'>Logistics</h5>
                                <Divider className="my-2" />
                            </div>
                            <Accordion style={{ marginTop: '1rem' }} multiple activeIndex={[0, 1, 2, 3]}>
                                <AccordionTab header={
                                    <span className="font-bold text-md">
                                        Ship-to Address
                                    </span>
                                }>
                                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 md:grid-cols-4 p-[7px] mt-2">
                                        <div className="flex flex-column gap-2">
                                            <label className='font-semibold'>BP Address</label>
                                            <Dropdown value={selectedShipToBPAddress} onChange={(e) => setSelectedShipToBPAddress(e.value)} options={shipToBPAddressOptions} optionLabel="name"
                                                placeholder="Select a BP address" className="w-full" />
                                        </div>
                                        <div className="flex flex-column gap-2 md:col-span-2">
                                            <label className='font-semibold'>Address Summary</label>
                                            <div className="flex">
                                                Test địa chỉ nè Test địa chỉ nè Test địa chỉ nè Test địa chỉ nè Test địa chỉ nè
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="my-auto block">
                                                <Button label="Edit" icon="pi pi-pencil" size="small" onClick={() => setWhichEditAddressModalOpen("shipToEdit")} />
                                            </div>
                                            <div className="my-auto block">
                                                <Button label=" New" icon="pi pi-plus" size="small"onClick={() => setWhichEditAddressModalOpen("shipToDefine")} />
                                            </div>
                                        </div>
                                    </div>
                                </AccordionTab>
                                <AccordionTab header={
                                    <span className="font-bold text-md">
                                        Bill-to Address
                                    </span>
                                }>
                                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 md:grid-cols-4 p-[7px] mt-2">
                                        <div className="flex flex-column gap-2">
                                            <label className='font-semibold'>BP Address</label>
                                            <Dropdown value={selectedBillToBPAddress} onChange={(e) => setSelectedBillToBPAddress(e.value)} options={billToBPAddressOptions} optionLabel="name"
                                                placeholder="Select a BP address" className="w-full" />
                                        </div>
                                        <div className="flex flex-column gap-2 md:col-span-2">
                                            <label className='font-semibold'>Address Summary</label>
                                            <div className="flex">
                                                Test địa chỉ nè Test địa chỉ nè Test địa chỉ nè Test địa chỉ nè Test địa chỉ nè
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="my-auto block">
                                                <Button label="Edit" icon="pi pi-pencil" size="small" onClick={() => setWhichEditAddressModalOpen("billToEdit")} />
                                            </div>
                                            <div className="my-auto block">
                                                <Button label=" New" icon="pi pi-plus" size="small"onClick={() => setWhichEditAddressModalOpen("billToDefine")} />
                                            </div>
                                        </div>
                                    </div>
                                </AccordionTab>
                                <AccordionTab header={
                                    <span className="font-bold text-md">
                                        Preferences
                                    </span>
                                }>
                                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 md:grid-cols-4 p-[7px] mt-2">
                                        <div className="flex flex-column gap-2">
                                            <label className='font-semibold'>Shipping Type</label>
                                            <Dropdown value={selectedCurrency} onChange={(e) => setSelectedCurrency(e.value)} options={currencyOptions} optionLabel="name"
                                                placeholder="Select a currency" className="w-full" />
                                            {/* <InputText aria-describedby="price-list-help" /> */}
                                        </div>
                                    </div>
                                </AccordionTab>
                                <AccordionTab header={
                                    <span className="font-bold text-md">
                                        Additional Information
                                    </span>
                                }>
                                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 md:grid-cols-4 p-[7px] mt-2">
                                        <div className="flex flex-column gap-2">
                                            <label className='font-semibold'>Stamp No.</label>
                                            <Dropdown value={selectedCurrency} onChange={(e) => setSelectedCurrency(e.value)} options={currencyOptions} optionLabel="name"
                                                placeholder="Enter a stamp number" className="w-full" />
                                            {/* <InputText aria-describedby="price-list-help" /> */}
                                        </div>
                                    </div>
                                </AccordionTab>
                            </Accordion>
                        </section>
                        <section>
                            <div className='mb-2.5 mt-4'>
                                <h5 className='mb-0 font-bold uppercase text-indigo-600'>Accounting</h5>
                                <Divider className="my-2" />
                            </div>
                            <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 md:grid-cols-4 p-[7px]">
                                <div className="flex flex-column gap-2">
                                    <label className='font-semibold'>Journal Remark</label>
                                    <InputText aria-describedby="customer-ref-no" />
                                </div>
                                <div className="flex flex-column gap-2">
                                    <label className='font-semibold'>Payment Term</label>
                                    <Dropdown showClear filter options={paymentTermOptions} value={selectedPaymentTerm} optionLabel="name"
                                        onChange={(e) => setSelectedPaymentTerm(e.value)} placeholder="Select payment term" className="w-full" />
                                </div>
                                <div className="flex flex-column gap-2">
                                    <label className='font-semibold'>Payment Method</label>
                                    <Dropdown showClear filter options={paymentMethodOptions} optionLabel="name"
                                        onChange={(e) => setSelectedPaymentMethod(e.value)} placeholder="Select payment method" className="w-full" />
                                </div>
                                <div className="flex flex-column gap-2">
                                    <label className='font-semibold'>Cash Discount Date Offset</label>
                                    <InputNumber inputId="integeronly" className="w-full text-right p-inputtext-sm" min={0} />
                                </div>
                                <div className="flex flex-column gap-2">
                                    <label className='font-semibold'>BP Project</label>
                                    <Dropdown showClear filter options={bpProjectOptions} value={selectedBPProject} optionLabel="name"
                                        onChange={(e) => setSelectedBPProject(e.value)} placeholder="Select BP project" className="w-full" />
                                </div>
                                <div className="flex flex-column gap-2">
                                    <label className='font-semibold'>Create QR Code From</label>
                                    <InputTextarea autoresize={true} rows={2} />
                                </div>
                                <div className="flex flex-column gap-2">
                                    <label className='font-semibold'>Federal Tax ID</label>
                                    <InputText aria-describedby="federal-tax-id" />
                                </div>
                                <div className="flex flex-column gap-2">
                                    <label className='font-semibold'>Use Shipped Goods Account</label>
                                    <Dropdown showClear filter value={selectedShippedGoodsAccount} options={yesNoOption} optionLabel="name"
                                        onChange={(e) => setSelectedShippedGoodsAccount(e.value)} placeholder="Select whether use shipped goods account" className="w-full" />
                                </div>
                            </div>
                        </section>
                        <section>
                            <div className='mb-2.5 mt-4'>
                                <h5 className='mb-0 font-bold uppercase text-indigo-600'>Attachment</h5>
                                <Divider className="my-2" />
                            </div>
                            <div className="mt-4">
                                <FileUpload ref={fileUploadRef} name="demo[]" url="/api/upload" multiple accept=".doc, .docx, .xls, .xlsx, .pdf, image/*" maxFileSize={5000000}
                                    onUpload={onTemplateUpload} onSelect={onTemplateSelect} onError={onTemplateClear} onClear={onTemplateClear}
                                    headerTemplate={uploadHeaderTemplate} itemTemplate={uploadItemTemplate} emptyTemplate={emptyTemplate}
                                    chooseOptions={chooseOptions} cancelOptions={cancelOptions} />
                            </div>
                        </section>
                    </div>
                </div>
            </div>
            <FeatureBar style={{ width: `${containerWidth}px`, maxWidth: `${containerWidth}px` }} className={`!max-w-[${containerWidth}px] !w-[${containerWidth}px]`} />
            <ItemList itemSelectModalOpen={itemSelectModalOpen} setItemSelectModalOpen={(value) => setItemSelectModalOpen(value)} itemList={itemList} selectedItemRow={selectedItemRow?.Item} setItem={handleSetItem} />
            {/* <Dialog header="Delete items" visible={visible} position={position} style={{ width: '50vw' }} onHide={() => setVisible(false)} footer={footerContent} draggable={false} resizable={false}>
                <h5 className="m-0">
                    Are you sure want to delete {selectedContentRow} items? This action cannot be reverted.
                </h5>
            </Dialog> */}
            <Dialog header={["shipToEdit", "billToEdit"].includes(whichEditAddressModalOpen) ? "Edit Address" : "Define New Address"} blockScroll visible={whichEditAddressModalOpen} onHide={() => setWhichEditAddressModalOpen(null)}
                style={{ width: '70vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }} footer={addressModalFooter}>
                <div className='mb-2.5 mt-4'>
                    <h5 className='mb-0 font-bold text-indigo-600 uppercase'>General Information</h5>
                    <Divider className="my-2" />
                </div>
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 p-[7px]">
                    <div className="flex flex-column gap-2">
                        <label className='font-semibold'>Street/PO Box</label>
                        <InputText className="p-inputtext-sm" aria-describedby="street-po-box" />
                    </div>
                    <div className="flex flex-column gap-2">
                        <label className='font-semibold'>Street No.</label>
                        <InputText className="p-inputtext-sm" aria-describedby="street-no" />
                    </div>
                    <div className="flex flex-column gap-2">
                        <label className='font-semibold'>Block</label>
                        <InputText className="p-inputtext-sm" aria-describedby="block" />
                    </div>
                    <div className="flex flex-column gap-2">
                        <label className='font-semibold'>City</label>
                        <InputText aria-describedby="block" />
                    </div>
                    <div className="flex flex-column gap-2">
                        <label className='font-semibold'>Zip Code</label>
                        <InputText aria-describedby="zip-code" />
                    </div>
                    <div className="flex flex-column gap-2">
                        <label className='font-semibold'>County</label>
                        <InputText aria-describedby="county" />
                    </div>
                    <div className="flex flex-column gap-2">
                        <label className='font-semibold'>State</label>
                        <Dropdown showClear filter options={stateListOptions} optionLabel="name"
                            placeholder="Select state" className="w-full" />   
                    </div>
                    <div className="flex flex-column gap-2">
                        <label className='font-semibold'>Country/Region</label>
                        <Dropdown showClear filter options={countryListOptions} optionLabel="name"
                            placeholder="Select country" className="w-full" />   
                    </div>
                    <div className="flex flex-column col-span-2 gap-2">
                        <label className='font-semibold'>Building/Floor/Room</label>
                        <InputTextarea aria-describedby="building-floor-room" />
                    </div>
                    <div className="flex flex-column gap-2">
                        <label className='font-semibold'>Address Name 2</label>
                        <InputText aria-describedby="address-name-2" />
                    </div>
                    <div className="flex flex-column gap-2">
                        <label className='font-semibold'>Address Name 3</label>
                        <InputText aria-describedby="address-name-3" />
                    </div>
                    <div className="flex flex-column gap-2">
                        <label className='font-semibold'>GLN</label>
                        <InputText aria-describedby="gln" />
                    </div>
                    <div className="flex flex-column gap-2">
                        <label className='font-semibold'>Update Existing Rows</label>
                        <Dropdown showClear filter value={selectedShippedGoodsAccount} options={yesNoOption} optionLabel="name"
                            className="w-full" />
                    </div>
                    <div className="flex flex-column gap-2">
                        <label className='font-semibold'>Update BP Master Data</label>
                        <Dropdown showClear filter value={selectedShippedGoodsAccount} options={yesNoOption} optionLabel="name"
                            className="w-full" />
                    </div>
                </div>
            </Dialog>
        </>
    );
};

export default withAuth(CreateDelivery);
// export default CreateDelivery;
