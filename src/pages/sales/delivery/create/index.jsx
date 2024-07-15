import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useResizeDetector } from 'react-resize-detector';
import { useRouter } from 'next/router'
import { useTranslations } from 'next-intl';
import { GetStaticPropsContext } from 'next';
import { shallow } from 'zustand/shallow';

import inventoryApi from '@/service/ServiceLayer/inventoryApi';
import partnersApi from '@/service/ServiceLayer/partnersApi';
import salesApi from '@/service/ServiceLayer/salesApi';
import employeeApi from '@/service/ServiceLayer/employeeApi';
import globalApi from '@/service/ServiceLayer/globalApi';

import withAuth from '@/utils/withAuth';
import toast from 'react-hot-toast';
import { nanoid } from 'nanoid';
import pick from "@/utils/pick"

import { classNames } from 'primereact/utils';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Checkbox } from "primereact/checkbox";
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
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
import { FileUpload } from 'primereact/fileupload';
import { Icon } from '@iconify/react';
import { Message } from 'primereact/message';
import { ProgressBar } from 'primereact/progressbar';
import { Panel } from 'primereact/panel';
import { Slider } from 'primereact/slider';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';
import { Tag } from 'primereact/tag';
import { Skeleton } from 'primereact/skeleton';
import { BlockUI } from 'primereact/blockui';
import { MultiSelect } from 'primereact/multiselect';

import ItemList from '@/components/ItemList';
import CustomerList from '@/components/CustomerList';
import BatchSerialSelection from '@/components/BatchSerial/Select';
import SalesTaxCodeList from '@/components/TaxCodeList/Sales';

import FeatureBar from '@/components/FeatureBar';
import Loader from '@/components/Loader';
import { formatNumberWithComma } from '@/utils/number';

import { useCompanyStore } from '@/stores/companyStore';
import { useHydration } from '@/utils/useHydration';
import useStore from '@/stores/useStore';

const CreateDelivery = () => {
    // const hasHydrated = useHydration(useCompanyStore);
    // const { companyInfo, currencies } = useCompanyStore((state) => state, shallow);
    // if (!hasHydrated) {
    //     return <p>Loading...</p>
    // }
    const companyInfo = useStore(useCompanyStore, (state) => state.companyInfo);
    const currencies = useStore(useCompanyStore, (state) => state.currencies);

    const { locale } = useRouter();
    const t = useTranslations('CreateDelivery');
    const tG = useTranslations('General');
    // console.log("Hè: ", t)
    /** Skeleton */
    const exampleItems = Array.from({ length: 1 }, (v, i) => i);
    /** Main */
    const [clipboard, setClipboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isPosting, setIsPosting] = useState(false);
    const [generalInfo, setGeneralInfo] = useState({
        DocNumType: "Primary",
        DocNum: null,
        DocCurrency: null,
        PostingDate: new Date(),
        DeliveryDate: new Date(),
        DocumentDate: new Date(),
        Remark: '',
        TotalBeforeDiscount: 0,
        DiscountPercent: 0,
        DiscountAmount: 0,
        FreightAmount: 0,
        Rounding: false,
        RoundingAmount: 0,
        TaxCode: null,
        TaxRate: 0,
        TaxAmount: 0,
        TotalAmount: 0,
        FreightCharges: [{
            ExpenseCode: null,
            Name: null,
            Remarks: null,
            NetAmount: null,
            GrossAmount: null,
            TaxGroup: null,
            TaxCode: null,
            TaxRate: null,
            TaxAmount: null,
            TotalTaxAmount: 0,
            BaseDocType: -1,
            BaseDocEntry: null,
            BaseDocLine: null
        }],
        JournalRemark: ''
    });
    const [docNum, setDocNum] = useState(null);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [selectedContactPerson, setSelectedContactPerson] = useState(null);
    const [selectedSeriesNo, setSelectedSeriesNo] = useState(null);
    const [selectedCurrency, setSelectedCurrency] = useState({ name: 'Local Currency', code: 'localCurrency', currency: companyInfo?.LocalCurrency });
    const [selectedItemType, setSelectedItemType] = useState({ name: 'Item', code: 'item' },);
    const [selectedSalesEmployee, setSelectedSalesEmployee] = useState(null);
    const [selectedOwner, setSelectedOwner] = useState(null);
    const [selectedPaymentTerm, setSelectedPaymentTerm] = useState(null);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
    const [selectedShippedGoodsAccount, setSelectedShippedGoodsAccount] = useState(null);
    const [selectedBPProject, setSelectedBPProject] = useState(null);
    const [selectedShipToBPAddress, setSelectedShipToBPAddress] = useState(null);
    const [selectedBillToBPAddress, setSelectedBillToBPAddress] = useState(null);
    const [customerList, setCustomerList] = useState([]);
    const [customerSelectModalOpen, setCustomerSelectModalOpen] = useState(false);
    const [customerListOptions, setCustomerListOptions] = useState([]);
    const [contactPersonList, setContactPersonList] = useState([]);
    const [contactPersonListOptions, setContactPersonListOptions] = useState([]);
    const [salesEmployeeList, setSalesEmployeeList] = useState([]);
    const [salesEmployeeListOptions, setSalesEmployeeListOptions] = useState([]);
    const [employeeList, setEmployeeList] = useState([]);
    const [employeeListOption, setEmployeeListOption] = useState([]);
    const [vatGroups, setVatGroups] = useState([]);
    const [selectCurrencyOptions, setSelectCurrencyOptions] = useState([]);
    // const [salesTaxCodeList, setSalesTaxCodeList] = useState([]);
    const [paymentTermList, setPaymentTermList] = useState([]);
    const [paymentTermOptions, setPaymentTermOptions] = useState([]);
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
        {
            code: 1,
            name: "Warehouse 01"
        }
    ]);
    const [currencyOptions, setCurrencyOptions] = useState([]);
    // const [currencyOptions, setCurrencyOptions] = useState([
    //     { name: 'Local Currency', code: 'localCurrency', currency: companyInfo?.LocalCurrency },
    //     { name: 'System Currency', code: 'systemCurrency', currency: companyInfo?.SystemCurrency },
    //     { name: 'BP Currency', code: 'bpCurrency', currency: null }
    // ]);
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
            ItemCode: '',
            Item: {},
            ItemDescription: '',
            Quantity: '',
            UnitPrice: null,
            Currency: null,
            DiscountPercent: '',
            ManageBatchNumbers: false,
            ManageByQuantity: false,
            ManageSerialNumbers: false,
            BatchNumbers: [],
            SerialNumbers: [],
            TaxCode: null,
            TaxRate: 0,
            TaxAmount: 0,
            Total: 0,
            GrossTotal: 0,
            Warehouse: '',
            UoMCode: '',
            U_DescriptionEn: '',
            U_DescriptionVi: '',
            U_System: '',
            U_ActualDays: '',
            U_StandardDays: '',
            U_Grade: '',
            U_Remark: '',
            U_Detail: '',
            U_APInvoiceNo: '',
            BaseType: -1,
            BaseEntry: null,
            BaseLine: null
        }
    ]);
    const [freightChargeData, setFreightChargeData] = useState([
        {
            id: nanoid(6),
            FreightName: 'Test',
            Remarks: '12',
            TaxGroup: 'GTGT',
            TaxRate: '8%',
            TaxAmount: '10000',
            TotalTaxAmount: '150000',
        }
    ]);
    const [freightChargeOptions, setFreightChargeOptions] = useState([]);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [itemList, setItemList] = useState([]);
    const [warehouseList, setWarehouseList] = useState([]);
    const [selectedItemRow, setSelectedItemRow] = useState(null);
    const [itemSelectModalOpen, setItemSelectModalOpen] = useState(false);
    const [taxCodeSelectModalOpen, setTaxCodeSelectModalOpen] = useState(false);
    const [batchSerialModalOpen, setBatchSerialModalOpen] = useState(false);
    const [selectedContentRows, setSelectedContentRows] = useState(null);
    const [selectedFreightChargeRow, setSelectedFreightChargeRow] = useState(null);
    const [isRounding, setIsRounding] = useState(false);

    const [whichEditAddressModalOpen, setWhichEditAddressModalOpen] = useState(null);

    const [totalSize, setTotalSize] = useState(0);
    const fileUploadRef = useRef(null);

    const contentTableRef = useRef(null);
    const freightChargeTableRef = useRef(null);

    useEffect(() => {
        setLoading(false);
        setSelectCurrencyOptions(currencies);
        setGeneralInfo({
            DocNumType: "Primary",
            DocNum: null,
            DocCurrency: currencies?.find(c => c.Code == companyInfo?.LocalCurrency),
            PostingDate: new Date(),
            DeliveryDate: new Date(),
            DocumentDate: new Date(),
            Remark: '',
            TotalBeforeDiscount: 0,
            DiscountPercent: 0,
            DiscountAmount: 0,
            FreightAmount: 0,
            Rounding: false,
            RoundingAmount: 0,
            TaxCode: null,
            TaxRate: 0,
            TaxAmount: 0,
            TotalAmount: 0,
            FreightCharges: [{
                ExpenseCode: null,
                Name: null,
                Remarks: null,
                NetAmount: null,
                GrossAmount: null,
                TaxGroup: null,
                TaxCode: null,
                TaxRate: null,
                TaxAmount: null,
                TotalTaxAmount: 0,
                BaseDocType: -1,
                BaseDocEntry: null,
                BaseDocLine: null
            }],
            JournalRemark: ''
        });
        setSelectedCurrency({ name: 'Local Currency', code: 'localCurrency', currency: companyInfo?.LocalCurrency });
    }, [companyInfo, currencies])

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Hàm async 0: Lấy count của delivery
                const fetchDeliveryDocQuanty = async () => {
                    const dataResult = await salesApi.getDeliveryDocQuantity();
                    const currentDocNum = dataResult?.data ? Number(dataResult?.data) + 1 : dataResult ? Number(dataResult) + 1 : "Undefined";
                    setDocNum(currentDocNum);
                    setGeneralInfo(prev => ({ ...prev, DocNum: currentDocNum }));
                };
                // Hàm async 1: Lấy danh sách customer
                const fetchCustomer = async () => {
                    const queryProps = {
                        filter: ["CardType eq 'cCustomer'"]
                    };
                    const dataResult = await partnersApi.getAllPartners(queryProps);
                    setCustomerList(dataResult.value);
                    setCustomerListOptions(dataResult.value?.map(val => ({ name: val.CardName, code: val.CardCode })))

                    console.log("Customer nè: ", dataResult.value);
                };

                // Hàm async 2: Lấy danh sách các item
                const fetchItems = async () => {
                    const queryProps = {
                        filter: ["ItemType eq 'itItems'", "SalesItem eq 'Y'"]
                    };
                    const dataResult = await inventoryApi.getAllItems(queryProps);
                    setItemList(dataResult.value);

                    console.log("Item nè: ", dataResult.value);
                };

                // Hàm async 3: Lấy danh sách các warehouse
                const fetchWarehouses = async () => {
                    const queryProps = {};
                    const dataResult = await inventoryApi.getAllWarehouse(queryProps);

                    setWarehouseOptions(dataResult.value?.map(item => ({
                        name: item.WarehouseName,
                        code: item.WarehouseCode
                    })));
                    setWarehouseList(dataResult.value);
                    // console.log("Warehouse: ", dataResult.value?.map(item => ({
                    //     name: item.WarehouseName,
                    //     code: item.WarehouseCode
                    // })));
                };

                // Hàm async 4: Lấy danh sách sales employee
                const fetchSalesEmployee = async () => {
                    const queryProps = {
                        filter: ["Active eq 'tYES'"]
                    };
                    const dataResult = await salesApi.getAllSalesPerson(queryProps);
                    setSalesEmployeeList(dataResult.value);
                    setSalesEmployeeListOptions(dataResult.value?.map(val => ({ name: val.SalesEmployeeName, code: val.SalesEmployeeCode })));
                    const defaultSalesEmployee = dataResult.value.find(val => val.SalesEmployeeCode == -1)
                    if (defaultSalesEmployee) {
                        console.log("Vô default sales employerr không? ", defaultSalesEmployee)
                        setSelectedSalesEmployee({
                            name: defaultSalesEmployee?.SalesEmployeeName,
                            code: defaultSalesEmployee?.SalesEmployeeCode
                        })
                    }
                    console.log("Sales Employee nè: ", dataResult.value);
                };

                // Hàm async 4: Lấy danh sách employee
                const fetchEmployee = async () => {
                    const queryProps = {};
                    const dataResult = await employeeApi.getAllEmployee(queryProps);
                    setEmployeeList(dataResult.value);
                    setEmployeeListOption(dataResult.value?.map(val => ({ name: `${val.FirstName ?? ''} ${val.MiddleName ?? ''} ${val.LastName ?? ''}`.trim(), code: val.EmployeeID })));
                    console.log("Employee nè: ", dataResult.value);
                };


                const fetchAdditionalExpenses = async () => {
                    const dataResult = await salesApi.getAdditionalExpenses();
                    setFreightChargeData(dataResult.value);
                    setFreightChargeOptions(dataResult.value?.map(item => ({
                        Name: item.Name,
                        ExpenseCode: item.ExpensCode
                    })));
                    // console.log("Freight: ", dataResult.value?.map(item => ({
                    //     name: item.Name,
                    //     code: item.ExpensCode
                    // })));
                };

                const fetchSalesTaxCode = async () => {
                    const dataResult = await salesApi.getAllTaxCode();
                    console.log("Tax code: ", dataResult.value);
                    setSalesTaxCodeList(dataResult.value);
                    // setFreightChargeOptions(dataResult.value?.map(item => ({
                    //     Name: item.Name,
                    //     ExpenseCode: item.ExpensCode
                    // })));
                    // console.log("Freight: ", dataResult.value?.map(item => ({
                    //     name: item.Name,
                    //     code: item.ExpensCode
                    // })));
                };

                const fetchVatGroups = async () => {
                    const queryProps = {
                        filter: ["Category eq 'bovcOutputTax'"]
                    };
                    const dataResult = await globalApi.getVatGroups(queryProps);
                    console.log("Vat Group: ", dataResult.value);
                    setVatGroups(dataResult.value);
                    // setFreightChargeOptions(dataResult.value?.map(item => ({
                    //     Name: item.Name,
                    //     ExpenseCode: item.ExpensCode
                    // })));
                    // console.log("Freight: ", dataResult.value?.map(item => ({
                    //     name: item.Name,
                    //     code: item.ExpensCode
                    // })));
                };

                const fetchPaymentTerm = async () => {
                    const dataResult = await salesApi.getAllPaymentTerm();
                    setPaymentTermList(dataResult.value);
                    setPaymentTermOptions(dataResult.value?.map(item => ({
                        name: item.PaymentTermsGroupName,
                        code: item.GroupNumber
                    })));

                    console.log("Payment Term: ", dataResult.value?.map(item => ({
                        Name: item.PaymentTermsGroupName,
                        Code: item.GroupNumber
                    })))
                    // console.log("Freight: ", dataResult.value?.map(item => ({
                    //     name: item.Name,
                    //     code: item.ExpensCode
                    // })));
                };

                await Promise.all([
                    fetchDeliveryDocQuanty(),
                    fetchCustomer(),
                    fetchItems(),
                    fetchWarehouses(),
                    fetchSalesEmployee(),
                    fetchEmployee(),
                    fetchAdditionalExpenses(),
                    fetchSalesTaxCode(),
                    fetchPaymentTerm()]);

            } catch (error) {
                console.error("Error fetching data: ", error);
            } finally {
                console.log("Done!")
                setDataLoaded(true);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        summarizeTotal();
    }, [contentData, generalInfo.RoundingAmount, generalInfo.DiscountPercent]);

    const summarizeTotal = () => {
        const prices = {
            priceBeforeDiscount: 0,
            discountAmount: 0,
            priceBeforeTax: 0,
            taxAmount: 0,
            totalPrice: 0
        }
        prices.priceBeforeDiscount = Number(contentData.reduce((acc, item) => {
            // Kiểm tra và cộng chỉ khi Total có giá trị
            if (item.TaxAmount != null && !isNaN(item.TaxAmount)) prices.taxAmount += item.TaxAmount;
            if (item.Total != null && !isNaN(item.Total)) {
                return acc + item.Total;
            }
            return acc;
        }, 0));

        if (generalInfo.DiscountPercent) {
            prices.discountAmount = prices.priceBeforeDiscount * generalInfo.DiscountPercent / 100;
        }

        prices.priceBeforeTax = prices.priceBeforeDiscount + prices.discountAmount;

        const customerTaxCode = generalInfo.TaxCode;

        // if (customerTaxCode) {
        //     const customerTax = vatGroups.find(s => s.Code == customerTaxCode);
        //     if (customerTax) {
        //         prices.taxAmount = customerTax.Rate * prices.priceBeforeTax / 100;
        //     }
        // }

        prices.totalPrice = prices.priceBeforeTax + prices.taxAmount

        if (generalInfo.Rounding) {
            prices.totalPrice += generalInfo.RoundingAmount
        }

        if (generalInfo.FreightAmount) {
            prices.totalPrice += generalInfo.FreightAmount;
        }

        console.log("Quài luôn đó má:", contentData)
        // console.log("Freight nữa:", generalInfo.FreightAmount)

        // console.log("Summarize: ", prices);

        setGeneralInfo(prev => ({
            ...prev, TotalBeforeDiscount: prices.priceBeforeDiscount,
            DiscountAmount: prices.discountAmount,
            TaxAmount: prices.taxAmount,
            TotalAmount: prices.totalPrice
        }))
    }

    const CustomerDropdownItemTemplate = (option, props) => {
        return (
            <>{option?.code + ' - ' + option?.name}</>
        );
    }

    const CustomerDropdownValueTemplate = (option, props) => {
        if (option) {
            return (
                <>{option?.code}</>
            );
        }
        return <>{props.placeholder}</>;
    }

    const ItemNoTemplate = (product, row) => {
        return <div className="p-inputtext p-inputtext-sm p-component w-full p-0 flex justify-between items-center border-r-0">
            <div className="p-2">
                <p className={`truncate`}>{product?.ItemCode}</p>
            </div>
            <Button icon="pi pi-list" onClick={() => { setSelectedItemRow({ ...product, rowIndex: row.rowIndex }); setItemSelectModalOpen(true) }} />
        </div>;
    };

    const ItemDescriptionTemplate = (product) => {
        const handleEditItemDescription = (e) => {
            setContentData(prev => (prev.map(content => {
                if (content.id == product?.id) {
                    return { ...content, ItemDescription: e.target.value }
                } else return content
            })));
        }
        return <InputText className="w-full p-inputtext-sm" value={product?.ItemDescription} onChange={handleEditItemDescription} />;
    };

    const ItemQuantityTemplate = (product) => {
        const handleEditItemQuantity = (e) => {
            setContentData(prev => (prev.map(content => {
                if (content.id == product?.id) {
                    const currentTotalPrice = content.UnitPrice * e.target.value * (1 - content.DiscountPercent / 100);
                    const taxAmount = currentTotalPrice * content.TaxRate / 100;
                    const currentGrossTotalPrice = currentTotalPrice + taxAmount;
                    return { ...content, Quantity: e.target.value, Total: currentTotalPrice, TaxAmount: taxAmount, GrossTotal: currentGrossTotalPrice }
                } else return content;
            })));
        }
        return <InputNumber inputId="integeronly" className="w-full text-right p-inputtext-sm" min={1} showButtons value={product?.Quantity} onValueChange={handleEditItemQuantity} />
    };

    const ItemDiscountPercentTemplate = (product) => {
        const handleEditItemDiscountPercent = (e) => {
            const currentDiscount = parseFloat(e.target.value.replace('%', '').trim());
            setContentData(prev => (prev.map(content => {
                if (content.id == product?.id) {
                    const currentTotalPrice = content.Quantity * content.UnitPrice * (1 - currentDiscount / 100);
                    const taxAmount = currentTotalPrice * content.TaxRate / 100;
                    const currentGrossTotalPrice = currentTotalPrice + taxAmount;
                    return { ...content, DiscountPercent: currentDiscount, Total: currentTotalPrice, TaxAmount: taxAmount, GrossTotal: currentGrossTotalPrice }
                } else return content
            })));
        }
        return <InputNumber minFractionDigits={2} className="w-full text-right p-inputtext-sm" suffix=" %" value={product?.DiscountPercent} onBlur={handleEditItemDiscountPercent}
        // onValueChange={handleEditItemDiscountPercent} 
        />
    };

    const ItemTaxCodeTemplate = (product, row) => {
        return <div className="p-inputtext p-inputtext-sm p-component w-full p-0 flex justify-between items-center border-r-0">
            <div className="p-2">
                <p className={`truncate`}>{product?.TaxCode}</p>
            </div>
            <Button icon="pi pi-list" onClick={() => { setSelectedItemRow({ ...product, rowIndex: row.rowIndex }); setTaxCodeSelectModalOpen(true) }} />
        </div>;
    }

    const ItemTaxRateTemplate = (product) => {
        return <div className="w-full p-inputtext p-component flex-1 !min-h-[42px]"><span className="h-[21px]">{product.TaxRate && (product.TaxRate + '%')}</span></div>
            ;
    }

    const ItemTaxAmountTemplate = (product) => {
        return <div className="w-full p-inputtext p-component flex-1 !min-h-[42px]"><span className="h-[21px]">{product.TaxAmount && (formatNumberWithComma(product.TaxAmount) + ' $')}</span></div>
            ;
    }

    const ItemGrossTotalTemplate = (product) => {
        return <div className="w-full p-inputtext p-component flex-1 !min-h-[42px]"><span className="h-[21px]">{product.GrossTotal && (formatNumberWithComma(product.GrossTotal) + ' $')}</span></div>
            ;
    }

    const ItemUnitPriceTemplate = (product) => {
        const handleEditItemUnitPrice = (e) => {
            setContentData(prev => (prev.map(content => {
                if (content.id == product?.id) {
                    const currentTotalPrice = content.Quantity * e.target.value * (1 - content.DiscountPercent / 100);
                    const taxAmount = currentTotalPrice * content.TaxRate / 100;
                    const currentGrossTotalPrice = currentTotalPrice + taxAmount;
                    return { ...content, UnitPrice: e.target.value, Total: currentTotalPrice, TaxAmount: taxAmount, GrossTotal: currentGrossTotalPrice };
                }
                else return content
            })));
        }
        return <InputNumber inputId="integeronly" className="w-full text-right p-inputtext-sm" min={0} suffix={` ${product?.Currency}`} value={product?.UnitPrice} onValueChange={handleEditItemUnitPrice} />
    };

    // const ItemPriceAfterDiscountTemplate = (product) => {
    //     const handleEditItemPriceAfterDiscount = (e) => {
    //         setContentData(prev => (prev.map(content => {
    //             if (content.id == product?.id)
    //                 return { ...content, PriceAfterDiscount: e.target.value }
    //             else return content
    //         })));
    //     }
    //     return <InputNumber inputId="integeronly" className="w-full text-right p-inputtext-sm" min={1} value={product?.PriceAfterDiscount} onValueChange={handleEditItemPriceAfterDiscount} />
    // };

    const ItemTotalTemplate = (product) => {
        const handleEditItemTotal = (e) => {
            setContentData(prev => (prev.map(content => {
                if (content.id == product?.id)
                    return { ...content, Total: e.target.value }
                else return content
            })));
        }
        return <InputNumber inputId="integeronly" className="w-full text-right p-inputtext-sm" min={0} suffix={` ${product?.Currency ?? ''}`} value={product?.Total} onValueChange={handleEditItemTotal} />
    };

    const ItemWarehouseTemplate = (product) => {
        const handleEditItemWarehouse = (e) => {
            setContentData(prev => (contentData.map(content => {
                if (content.id == product?.id)
                    return { ...content, Warehouse: e.target.value }
                else return content;
            })));
        }
        return (
            <>
                <Dropdown
                    showClear filter
                    value={product?.Warehouse}
                    options={warehouseOptions}
                    onChange={handleEditItemWarehouse}
                    optionLabel="name"
                    placeholder="Select a warehouse"
                    className="p-inputtext-sm w-full"
                />
            </>

        );
    };

    const ItemBatchSerialTemplate = (product, row) => {
        const { ManageBatchNumbers, ManageSerialNumbers, ManageByQuantity, BatchNumbers, SerialNumbers } = product;
        // console.log("Test 1: ", ManageBatchNumbers);
        // console.log("Test 2: ", ManageSerialNumbers);
        // console.log("Test 3: ", ManageByQuantity);
        // console.log("Khùm đin: ", no)

        const isDisabled = ManageByQuantity || (!ManageByQuantity && !ManageBatchNumbers && !ManageSerialNumbers);
        // console.log("Test 4: ", isDisabled);

        const handleChangeSelections = (e) => {
            console.log(e.value);
            const newCodes = e.value.map(val => val.code);

            if (ManageBatchNumbers) {
                const newArray = contentData.map((item, idx) => {
                    if (idx == row.rowIndex) {
                        return { ...item, BatchNumbers: item.BatchNumbers.filter(b => newCodes.includes(b.BatchNum)) }
                    } else return item
                });
                setContentData(newArray)
            }

            if (ManageSerialNumbers) {
                const newArray = contentData.map((item, idx) => {
                    if (idx == row.rowIndex) {
                        return { ...item, SerialNumbers: item.SerialNumbers.filter(b => newCodes.includes(b.IntrSerial)) }
                    } else return item
                });
                setContentData(contentData.map((item, idx) =>
                    idx == row.rowIndex ? { ...item, SerialNumbers: e.value } : item))
            }
        }

        const currentOptions = ManageBatchNumbers ? contentData[row.rowIndex]?.BatchNumbers?.map(batch => ({ name: `${batch.BatchNum} (${batch.SelectedQuantity})`, code: batch.BatchNum })) : contentData[row.rowIndex]?.SerialNumbers?.map(serial => ({ name: serial.IntrSerial, code: serial.IntrSerial }))

        return (
            <div className="p-inputtext p-inputtext-sm p-component w-full p-0 flex justify-between items-center border-r-0">
                <MultiSelect
                    value={currentOptions}
                    onChange={handleChangeSelections}
                    options={currentOptions}
                    disabled={isDisabled}
                    optionLabel="name"
                    display="chip"
                    placeholder=""
                    className="w-full md:w-20rem border-none" />
                <Button icon="pi pi-list" disabled={isDisabled} onClick={() => { setSelectedItemRow({ ...product, rowIndex: row.rowIndex }); setBatchSerialModalOpen(true) }} />
            </div>
        )
    }

    const BodyDescriptionTemplate = (product, lang) => {
        const handleEditItemDescription = (e) => {
            setContentData(prev => (contentData.map(content => {
                if (content.id == product?.id) {
                    if (lang == 'vi') return { ...content, U_DescriptionVi: e.target.value };
                    else return { ...content, U_DescriptionEn: e.target.value };
                } else return content;
            })));
        }
        return (
            <div className="flex items-center">
                <InputTextarea className="w-full p-inputtext-sm" value={lang == 'vi' ? product?.U_DescriptionVi : product?.U_DescriptionEn} autoResize rows={1} onChange={handleEditItemDescription} />
            </div>

        );
    };

    const ItemGradeTemplate = (product) => {
        const handleEditItemGrade = (e) => {
            setContentData(prev => (contentData.map(content => {
                if (content.id == product?.id)
                    return { ...content, Grade: e.target.value }
                else return content;
            })));
        }
        return (
            <>
                <Dropdown
                    showClear
                    filter
                    value={product?.Grade}
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
                if (content.id == product?.id)
                    return { ...content, U_System: e.target.value }
                else return content;
            })));
        }
        return (
            <>
                <Dropdown
                    value={product?.U_System}
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
                if (content.id == product?.id) {
                    return { ...content, U_ActualDays: e.target.value }
                } else return content;
            })));
        }
        return <InputNumber inputId="integeronly" className="w-full text-right p-inputtext-sm" min={1} showButtons value={product?.U_ActualDays} onValueChange={handleEditActualDays} />
    };

    const ItemStandardDaysTemplate = (product) => {
        const handleEditStandardDays = (e) => {
            setContentData(prev => (prev.map(content => {
                if (content.id == product?.id) {
                    return { ...content, U_StandardDays: e.target.value }
                } else return content;
            })));
        }
        return <InputNumber inputId="integeronly" className="w-full text-right p-inputtext-sm" min={1} showButtons value={product?.StandardDays} onValueChange={handleEditStandardDays} />
    };

    const UoMCodeTemplate = (product) => {
        const handleEditUoMCode = (e) => {
            setContentData(prev => (prev.map(content => {
                if (content.id == product?.id) {
                    return { ...content, UoMCode: e.target.value }
                } else return content;
            })));
        }
        return <InputText inlinestyle={{ textAlign: 'right' }} className="w-full p-inputtext-sm" value={product?.UoMCode} onChange={handleEditUoMCode} />;
    };

    const ItemRemarkTemplate = (product) => {
        const handleEditItemRemark = (e) => {
            setContentData(prev => (prev.map(content => {
                if (content.id == product?.id) {
                    return { ...content, U_Remark: e.target.value }
                } else return content;
            })));
        }
        return (
            <div className="flex items-center">
                <InputTextarea className="w-full p-inputtext-sm" value={product?.U_Remark} onChange={handleEditItemRemark} autoResize rows={1} />
            </div>

        );
    };

    const ItemDetailTemplate = (product) => {
        const handleEditItemDetail = (e) => {
            setContentData(prev => (prev.map(content => {
                if (content.id == product?.id) {
                    return { ...content, U_Detail: e.target.value }
                } else return content;
            })));
        }
        return (
            <div className="flex items-center">
                <InputTextarea className="w-full p-inputtext-sm" value={product?.U_Detail} onChange={handleEditItemDetail} autoResize={true} rows={1} />
            </div>

        );
    };

    const APInvoiceENoTemplate = (product) => {
        const handleEditAPInvoiceENo = (e) => {
            setContentData(prev => (prev.map(content => {
                if (content.id == product?.id) {
                    return { ...content, U_APInvoiceENo: e.target.value }
                } else return content;
            })));
        }
        return <InputText inputstyle={{ textAlign: 'right' }} className="w-full p-inputtext-sm" value={product?.U_APInvoiceENo} onChange={handleEditAPInvoiceENo} />;
    };

    const FreightNameTemplate = (item, row) => {
        const handleEditFreight = (e) => {
            console.log(generalInfo.FreightCharges);
            console.log("Test:", item)
            const currentValue = e.value;
            const newFreight = generalInfo.FreightCharges.map((val, idx) => {
                if (idx == row.rowIndex) {
                    return { ...val, ExpenseCode: currentValue.ExpenseCode, Name: currentValue.Name }
                } else return val
            });
            const newFreightOptions = freightChargeOptions.filter(f => f.ExpenseCode != currentValue.ExpenseCode);
            setFreightChargeOptions(newFreightOptions);
            if (newFreightOptions.length > 0) {
                newFreight.push({
                    ExpenseCode: null,
                    Name: null,
                    Remarks: null,
                    NetAmount: null,
                    GrossAmount: null,
                    TaxGroup: null,
                    TaxCode: null,
                    TaxRate: null,
                    TaxAmount: null,
                    TotalTaxAmount: 0,
                    BaseDocType: -1,
                    BaseDocEntry: null,
                    BaseDocLine: null
                })
            }
            // setGeneralInfo(prev => ({ ...prev, FreightCharges: newFreight }));
            setGeneralInfo(prev => ({ ...prev, FreightCharges: newFreight }))
        }
        return (
            <>
                {
                    !generalInfo.FreightCharges[row?.rowIndex].ExpenseCode ? (
                        <Dropdown
                            filter
                            value={generalInfo.FreightCharges[row?.rowIndex]}
                            disabled={generalInfo.FreightCharges[row?.rowIndex].ExpenseCode}
                            options={freightChargeOptions}
                            onChange={handleEditFreight}
                            optionLabel="Name"
                            dataKey="ExpenseCode"
                            placeholder="Select an expense"
                            className="p-inputtext-sm w-full"
                        />
                    ) : (
                        <div className="w-full p-inputtext p-component flex-1 !min-h-[42px]"><span className="h-[21px]">{generalInfo.FreightCharges[row?.rowIndex].Name}</span></div>
                    )
                }

            </>

        );
    };

    const FreightRemarkTemplate = (product, row) => {
        const handleEditFreightRemark = (e) => {
            const newArray = generalInfo.FreightCharges.map((item, idx) => {
                if (idx == row.rowIndex) {
                    return { ...item, Remarks: e.target.value }
                } else return item
            });
            setGeneralInfo(prev => ({ ...prev, FreightCharges: newArray }))
        }
        return (
            <div className="flex items-center">
                <InputTextarea className="w-full p-inputtext-sm" value={product?.Remark} onChange={handleEditFreightRemark} autoResize rows={1} />
            </div>

        );
    };

    const FreightTaxCodeTemplate = (product, row) => {
        // const handleEditFreightRemark = (e) => {
        //     const newArray = generalInfo.FreightCharges.map((item, idx) => {
        //         if (idx == row.rowIndex) {
        //             return { ...item, Remarks: e.target.value }
        //         } else return item
        //     });
        //     setGeneralInfo(prev => ({...prev, FreightCharges: newArray}))
        // }

        return <div className="p-inputtext p-inputtext-sm p-component w-full p-0 flex justify-between items-center border-r-0">
            <div className="p-2">
                <p className={`truncate`}>{product?.TaxGroup}</p>
            </div>
            <Button icon="pi pi-list" onClick={() => { setSelectedFreightChargeRow({ ...product, rowIndex: row.rowIndex }); setTaxCodeSelectModalOpen(true) }} />
        </div>;
    };

    const FreightTaxRateTemplate = (product) => {
        return <div className="w-full p-inputtext p-component flex-1 !min-h-[42px]"><span className="h-[21px]">{product.TaxRate}</span></div>
            ;
    };

    const FreightNetAmountTemplate = (product, row) => {
        const handleEditItemNetAmount = (e) => {
            let totalGrossAmoumt = 0;
            const newArray = generalInfo.FreightCharges.map((item, idx) => {
                if (idx == row.rowIndex) {
                    totalGrossAmoumt += e.target.value;
                    return { ...item, NetAmount: e.target.value, GrossAmount: e.target.value }
                } else {
                    totalGrossAmoumt += item.GrossAmount;
                    return item
                }
            });
            setGeneralInfo(prev => ({ ...prev, FreightAmount: totalGrossAmoumt, FreightCharges: newArray }))
        }
        return <InputNumber minFractionDigits={2} className="w-full text-right p-inputtext-sm" min={0} suffix={` ${''}`} value={product?.NetAmount} onValueChange={handleEditItemNetAmount} />
    };

    const FreightGrossAmountTemplate = (product, row) => {
        const handleEditItemGrossAmount = (e) => {
            let totalGrossAmoumt = 0;
            const newArray = generalInfo.FreightCharges.map((item, idx) => {
                if (idx == row.rowIndex) {
                    totalGrossAmoumt += e.target.value;
                    return { ...item, NetAmount: e.target.value, GrossAmount: e.target.value }
                } else {
                    totalGrossAmoumt += item.GrossAmount;
                    return item
                }
            });
            setGeneralInfo(prev => ({ ...prev, FreightAmount: totalGrossAmoumt, FreightCharges: newArray }))
        }
        return <InputNumber minFractionDigits={2} className="w-full text-right p-inputtext-sm" min={0} suffix={` ${''}`} value={product?.GrossAmount} onValueChange={handleEditItemGrossAmount} />
    };

    const addressModalFooter = () => {
        return (
            <div>
                <Button label="Cancel" icon="pi pi-times" onClick={() => setWhichEditAddressModalOpen(null)} className="p-button-text" />
                <Button label="Yes" icon="pi pi-check" onClick={handleConfirmAddressModal} autoFocus />
            </div>
        )
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
                header: 'Unit Price',
                field: 'UnitPrice',
                className: 'text-right',
                minWidth: '14rem',
                body: ItemUnitPriceTemplate
            },
            {
                header: 'Discount %',
                field: 'DiscountPercent',
                className: 'text-right',
                minWidth: '14rem',
                body: ItemDiscountPercentTemplate
            },
            {
                header: 'Total After Discount',
                field: 'Total',
                className: 'text-right',
                minWidth: '14rem',
                body: ItemTotalTemplate
            },
            {
                header: 'Tax Code',
                className: 'text-right',
                minWidth: '14rem',
                body: ItemTaxCodeTemplate
            },
            {
                header: 'Tax Rate',
                className: 'text-right',
                minWidth: '14rem',
                body: ItemTaxRateTemplate
            },
            {
                header: 'Tax Amount',
                className: 'text-right',
                minWidth: '14rem',
                body: ItemTaxAmountTemplate
            },
            {
                header: 'Warehouse',
                field: 'Warehouse',
                className: 'text-right',
                minWidth: '14rem',
                body: ItemWarehouseTemplate
            },
            {
                header: 'Batch/Serial Number',
                className: 'text-left',
                minWidth: '14rem',
                body: ItemBatchSerialTemplate
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
                field: 'U_DescriptionVi',
                className: 'text-right',
                minWidth: '14rem',
                body: (product) => BodyDescriptionTemplate(product, 'vi')
            },
            {
                header: 'Description EN',
                field: 'U_DescriptionEn',
                className: 'text-right',
                minWidth: '14rem',
                body: (product) => BodyDescriptionTemplate(product, 'en')
            },
            {
                header: 'Gross Total After Discount',
                className: 'text-right',
                minWidth: '14rem',
                body: ItemGrossTotalTemplate
            },
            {
                header: 'System',
                field: 'U_System',
                className: 'text-right',
                minWidth: '14rem',
                body: ItemSystemTemplate
            },
            {
                header: 'Actual Days',
                field: 'U_ActualDays',
                className: 'text-center',
                minWidth: '14rem',
                body: ItemActualDaysTemplate
            },
            {
                header: 'Standard Days',
                field: 'U_StandardDays',
                className: 'text-center',
                minWidth: '14rem',
                body: ItemStandardDaysTemplate
            },
            {
                header: 'Grade',
                field: 'U_Grade',
                className: 'text-right',
                minWidth: '14rem',
                body: ItemGradeTemplate
            },
            {
                header: 'Remark',
                field: 'U_Remark',
                className: 'text-right',
                minWidth: '14rem',
                body: ItemRemarkTemplate
            },
            {
                header: 'Item/Service Detail',
                field: 'U_Detail',
                className: 'text-right',
                minWidth: '14rem',
                body: ItemDetailTemplate
            },
            {
                header: 'APInvoice eNo.',
                field: 'U_APInvoiceENo',
                className: 'text-right',
                minWidth: '14rem',
                body: APInvoiceENoTemplate
            },
        ],
        [itemList, warehouseOptions, contentData]
    );

    const freightChargesColumns = useMemo(
        () => [
            {
                header: 'Freight Name',
                field: 'Name',
                className: 'text-left',
                minWidth: '12rem',
                body: FreightNameTemplate
            },
            {
                header: 'Remarks',
                field: 'Remarks',
                className: 'text-left',
                minWidth: '12rem',
                body: FreightRemarkTemplate
            },
            {
                header: 'Tax Code',
                className: 'text-center',
                minWidth: '14rem',
                body: FreightTaxCodeTemplate
            },
            {
                header: 'Tax %',
                className: 'text-right',
                minWidth: '14rem',
                body: FreightTaxRateTemplate
            },
            {
                header: 'Tax Amount',
                field: 'TaxAmount',
                className: 'text-right',
                minWidth: '14rem'
            },
            {
                header: 'Total Tax Amount',
                field: 'TotalTaxAmount',
                className: 'text-right',
                minWidth: '14rem'
            },
            {
                header: 'Net Amount',
                field: 'NetAmount',
                className: 'text-right',
                minWidth: '14rem',
                body: FreightNetAmountTemplate
            },
            {
                header: 'Gross Amount',
                field: 'GrossAmount',
                className: 'text-right',
                minWidth: '14rem',
                body: FreightGrossAmountTemplate
            },
        ],
        [freightChargeOptions, generalInfo]
    );

    const { width: containerWidth, height: containerHeight, ref: containerRef } = useResizeDetector();

    const handleToggleDocNo = () => {
        if (generalInfo.DocNumType == "Primary") {
            setGeneralInfo(prev => ({ ...prev, DocNumType: "Manual" }))
        } else {
            setGeneralInfo(prev => ({ ...prev, DocNumType: "Primary", DocNum: docNum }))
        }
    }

    const handleChangeSelectedCustomer = (cardCode) => {
        const selectedValue = customerList.find(val => val.CardCode == cardCode)
        console.log(selectedValue);
        setSelectedCustomer(selectedValue);
        // Contact person
        const currentContactPersonList = selectedValue?.ContactEmployees;
        const currentContactPersonName = selectedValue?.ContactPerson;

        // Check default currency xem có giống với local currency khum
        const defaultCurrency = selectedValue.DefaultCurrency;

        if (defaultCurrency && defaultCurrency != companyInfo.LocalCurrency) {
            console.log("Lạ nhen: ", defaultCurrency);
            const currentDefaultCurrency = currencies?.find(c => c.Code == defaultCurrency);
            setGeneralInfo(prev => ({ ...prev, DocCurrency: currentDefaultCurrency }));
            setSelectedCurrency({ name: 'BP Currency', code: 'bpCurrency', value: defaultCurrency })
        }

        // Check và bỏ ra những currency BP không có 
        const bpCurrencyCollection = selectedValue?.BPCurrenciesCollection;
        if (bpCurrencyCollection && bpCurrencyCollection?.length > 0) {
            const uniqueCodes = [...new Set(bpCurrencyCollection
                .filter(curr => curr.Include === 'tYES')
                .map(curr => curr.CurrencyCode))];

            console.log("Unique Codes:", uniqueCodes);

            const filteredCurrencies = currencies?.filter(currency => uniqueCodes.includes(currency.Code));
            setSelectCurrencyOptions(filteredCurrencies);
        }

        // Kiểm tra xem content data có copy từ bất kì chứng từ nào với khách hàng trước đó chưa
        if (contentData?.length > 1) {
            const updatedContentData = contentData?.map(item => {
                if (item.BaseType !== -1 || item.BaseEntry !== null || item.BaseLine !== null) {
                    return {
                        ...item,
                        BaseType: -1,
                        BaseEntry: null,
                        BaseLine: null,
                    };
                }
                return item;
            });

            setContentData(updatedContentData);
        }

        if (currentContactPersonList.length > 0 && currentContactPersonName) {
            const currentContactPerson = currentContactPersonList.find(val => val.Name == currentContactPersonName);
            console.log("Selected contact person: ", currentContactPerson)
            setContactPersonList(currentContactPersonList);
            setContactPersonListOptions(currentContactPersonList.map(item => ({ name: item.Name, code: item.InternalCode })))
            setSelectedContactPerson({ name: currentContactPerson.Name, code: currentContactPerson.InternalCode });
        }

        const currentPaymentTerm = paymentTermOptions.find(p => p.code == selectedValue?.PayTermsGrpCode)
        setSelectedPaymentTerm(currentPaymentTerm);
        setPaymentMethodOptions(selectedValue.BPPaymentMethods);
        // console.log("Lại bị gì nữa: ", selectedValue.BPPaymentMethods[0]);

        // Chỗ này phải lấy vat mặc định cho sales
        const customerTaxCode = (selectedValue?.VatGroup) || (companyInfo.TaxGroupforPurchaseItem);
        // const customerTaxCode = selectedValue?.BPAddresses.find(i => i.AddressType == "bo_ShipTo");
        let customerTaxRate = 0;

        if (customerTaxCode) {
            const customerTax = vatGroups.find(s => s.Code == customerTaxCode);
            if (customerTax) {
                customerTaxRate = customerTax?.VatGroups_Lines[0]?.Rate
                console.log("Test tax nha: ", customerTaxRate)
            }
        }

        setGeneralInfo(prev => ({ ...prev, JournalRemark: 'Delivery - ' + selectedValue.CardCode, TaxCode: customerTaxCode, TaxRate: customerTaxRate }));
        setSelectedPaymentMethod(selectedValue.BPPaymentMethods[0] || null);
    }

    const handleAddNewRow = () => {
        // Validate các trường thông tin, xem đầy đủ chưa
        const lastDataItemIndex = contentData.length - 1;
        if (!contentData[lastDataItemIndex].ItemCode) {
            setContentData(prev => ([...prev, {
                id: nanoid(6),
                ItemCode: '',
                Item: {},
                ItemDescription: '',
                Quantity: '',
                UnitPrice: null,
                Currency: null,
                DiscountPercent: '',
                ManageBatchNumbers: false,
                ManageByQuantity: false,
                ManageSerialNumbers: false,
                BatchNumbers: [],
                SerialNumbers: [],
                TaxCode: null,
                TaxRate: 0,
                TaxAmount: 0,
                Total: null,
                GrossTotal: 0,
                Warehouse: '',
                UoMCode: '',
                U_DescriptionEn: '',
                U_DescriptionVi: '',
                U_System: '',
                U_ActualDays: '',
                U_StandardDays: '',
                U_Grade: '',
                U_Remark: '',
                U_Detail: '',
                U_APInvoiceNo: '',
                BaseType: -1,
                BaseEntry: null,
                BaseLine: null
            }]));
        }
    }

    const handleResizeColumn = (target) => {
        const value = target.element;
        if (value?.cellIndex && value?.cellIndex == 1) {
            const columnWidth = value.clientWidth;
            // setClientWidth({...clientWidths, column1: columnWidth});
        }
    }


    const handleChangeSelectedCurrency = (e) => {
        const currentCurrency = e.value;
        setSelectedCurrency(currentCurrency);
        // if (currentCurrency.code == "BP Currency") {

        // }
        console.log("Currency: ", currentCurrency);
    }

    const handleChangeDocCurrency = (e) => {
        const currentCurrency = e.value;
        if (currentCurrency.Code !== companyInfo.LocalCurrency) {
            toast("Vui lòng nhập tỉ giá ở phần mềm SAP B1.");
            return;
        } else {
            setGeneralInfo(prev => ({ ...prev, DocCurrency: e.value }))
        }
    }

    // const handleConfirmChangeItemServiceType = (currentType) => {
    //     if (currentType?.code == 'item') {
    //         setContentData([
    //             {
    //                 id: nanoid(6),
    //                 ItemCode: '',
    //                 Item: {},
    //                 ItemDescription: '',
    //                 Quantity: '',
    //                 UnitPrice: null,
    //                 Currency: null,
    //                 DiscountPercent: '',
    //                 ManageBatchNumbers: false,
    //                 ManageByQuantity: false,
    //                 ManageSerialNumbers: false,
    //                 BatchNumbers: [],
    //                 SerialNumbers: [],
    //                 TaxCode: null,
    //                 TaxRate: 0,
    //                 TaxAmount: 0,
    //                 Total: 0,
    //                 GrossTotal: 0,
    //                 Warehouse: '',
    //                 UoMCode: '',
    //                 U_DescriptionEn: '',
    //                 U_DescriptionVi: '',
    //                 U_System: '',
    //                 U_ActualDays: '',
    //                 U_StandardDays: '',
    //                 U_Grade: '',
    //                 U_Remark: '',
    //                 U_Detail: '',
    //                 U_APInvoiceNo: '',
    //                 BaseType: -1,
    //                 BaseEntry: null,
    //                 BaseLine: null
    //             }
    //         ])
    //     } else {
    //         setContentData([
    //             {
    //                 id: nanoid(6),
    //                 ItemDescription: '',
    //                 BaseType: -1,
    //                 BaseEntry: null,
    //                 BaseLine: null
    //             }
    //         ])
    //     }
    //     setSelectedItemType(currentType);
    // }

    const handleChangeItemServiceType = (e) => {
        const currentType = e.value;
        if (currentType.code == 'service') {
            toast("Developing...");
            return;
        }
        setSelectedItemType(currentType);

        // if (contentData?.length > 1) {
        // confirmDialog({
        //     message: 'This action will delete all your content list. Are you sure you want to proceed?',
        //     header: 'Confirmation',
        //     icon: 'pi pi-exclamation-triangle',
        //     defaultFocus: 'reject',
        //     accept: handleConfirmChangeItemServiceType(currentType)
        // });
        // } else {
        // handleConfirmChangeItemServiceType(currentType);
        // }
    }

    const handleSetItems = (items) => {
        const selectedRowId = selectedItemRow.id;

        setContentData((prev) => {
            // Tìm vị trí của phần tử có id bằng selectedRowId
            const startIndex = prev.findIndex((i) => i.id === selectedRowId);

            if (startIndex === -1) {
                // Nếu không tìm thấy phần tử nào với id này, không làm gì cả
                return prev;
            }

            // Chia mảng prev thành ba phần
            const beforeSlice = prev.slice(0, startIndex);
            let afterSlice = prev.slice(startIndex + 1);

            // Bỏ phần tử cuối của mảng nếu không chứa thông tin Item
            if (afterSlice.length > 0) {
                const lastElement = afterSlice[afterSlice.length - 1];
                if (!lastElement.ItemCode) {
                    afterSlice = afterSlice.slice(0, -1);
                }
            }

            // Tạo mảng mới từ phần trước, mảng items (cập nhật với dữ liệu mới), và phần sau
            const updatedSlice = items.map((item, index) => {
                const warehouseCode = item.DefaultWarehouse || item?.ItemWarehouseInfoCollection[0]?.WarehouseCode;

                return {
                    id: nanoid(6),  // Sử dụng id từ prev hoặc tạo mới nếu cần
                    ItemCode: item.ItemCode,
                    Item: item,
                    ItemDescription: item.ItemName,
                    Quantity: 1,
                    UnitPrice: item.ItemPrices[0]?.Price,
                    Currency: item.ItemPrices[0]?.Currency,
                    DiscountPercent: 0,
                    ManageBatchNumbers: item.ManageBatchNumbers === 'tYES',
                    ManageByQuantity: item.ManageByQuantity === 'tYES',
                    ManageSerialNumbers: item.ManageSerialNumbers === 'tYES',
                    BatchNumbers: [],
                    SerialNumbers: [],
                    TaxCode: generalInfo.TaxCode,
                    TaxRate: generalInfo.TaxRate,
                    TaxAmount: generalInfo.TaxRate * item.ItemPrices[0]?.Price * 1 / 100,
                    Total: item.ItemPrices[0]?.Price * 1,
                    GrossTotal: (item.ItemPrices[0]?.Price * 1) + (generalInfo.TaxRate * item.ItemPrices[0]?.Price * 1 / 100),
                    Warehouse: warehouseCode
                        ? warehouseOptions.find(warehouse => warehouse.code === warehouseCode)
                        : null,
                    UoMCode: '',
                    U_DescriptionEn: '',
                    U_DescriptionVi: '',
                    U_System: '',
                    U_ActualDays: '',
                    U_StandardDays: '',
                    U_Grade: '',
                    U_Remark: '',
                    U_Detail: '',
                    U_APInvoiceNo: '',
                    BaseType: -1,
                    BaseEntry: null,
                    BaseLine: null
                };
            });

            // Kết hợp các phần lại để tạo ra mảng mới
            const newData = [...beforeSlice, ...updatedSlice, ...afterSlice];
            return newData;
        });

        setSelectedItemRow(null);
        handleAddNewRow();
    };

    const handleSetTaxCode = (taxCode) => {
        if (selectedFreightChargeRow) {
            const selectedFreightRowIndex = selectedFreightChargeRow.rowIndex;
            const newArray = generalInfo.FreightCharges.map((item, idx) => {
                if (idx == selectedFreightRowIndex) {
                    return { ...item, TaxCode: taxCode.Code, TaxRate: taxCode.Rate }
                } else return item
            });
            setGeneralInfo(prev => ({ ...prev, FreightCharges: newArray }))
        } else {
            const selectedItemRowIndex = selectedItemRow.rowIndex;
            const newArray = contentData.map((item, idx) => {
                if (idx == selectedItemRowIndex) {
                    const currentTotalPrice = item.UnitPrice * item.Quantity * (1 - item.DiscountPercent / 100);
                    const taxAmount = currentTotalPrice * item.TaxRate
                    const currentGrossTotalPrice = currentTotalPrice + taxAmount;
                    return { ...item, TaxCode: taxCode.Code, TaxRate: taxCode.Rate, TaxAmount: taxAmount, GrossTotal: currentGrossTotalPrice }
                } else return item
            });
            setContentData(newArray);
        }
        console.log("Test tax code ", taxCode);
    };

    const handleDeleteItems = () => {
        // Validate lại một lần nữa nhé
        const newRow = {
            id: nanoid(6),
            ItemCode: '',
            Item: {},
            ItemDescription: '',
            Quantity: '',
            UnitPrice: null,
            Currency: null,
            DiscountPercent: '',
            ManageBatchNumbers: false,
            ManageByQuantity: false,
            ManageSerialNumbers: false,
            BatchNumbers: [],
            SerialNumbers: [],
            TaxCode: null,
            TaxRate: 0,
            TaxAmount: 0,
            Total: null,
            GrossTotal: 0,
            Warehouse: '',
            UoMCode: '',
            U_DescriptionEn: '',
            U_DescriptionVi: '',
            U_System: '',
            U_ActualDays: '',
            U_StandardDays: '',
            U_Grade: '',
            U_Remark: '',
            U_Detail: '',
            U_APInvoiceNo: '',
            BaseType: -1,
            BaseEntry: null,
            BaseLine: null
        };
        if (selectedContentRows.length == contentData.length) {
            setContentData([{ ...newRow }]);
        } else {
            const selectedIds = new Set(selectedContentRows.map(item => item.id));
            let lastIncluded = false;
            if (selectedIds.has(contentData[contentData.length - 1].id)) lastIncluded = true;
            const newContentData = contentData.filter((item) => !selectedIds.has(item.id));
            if (lastIncluded) {
                setContentData([...newContentData, { ...newRow }]);
            } else {
                setContentData([...newContentData]);
            }
        }
        toast.success("Deleted successfully!");
    }

    const handleCopyItems = () => {
        setClipboard(selectedContentRows);
        console.log('Copied:', selectedContentRows);
    }

    const handlePasteItems = () => {
        if (clipboard.length > 0 && selectedContentRows.length === 1) {
            const selectedRow = selectedContentRows[0];
            const selectedRowIndex = contentData.findIndex(item => item.id === selectedRow.id);

            const newData = [
                ...contentData.slice(0, selectedRowIndex + 1),
                ...clipboard.map(row => ({ ...row, id: nanoid(6) })),
                ...contentData.slice(selectedRowIndex + 1)
            ];

            setContentData(newData);
            setClipboard([]);
            console.log('Pasted:', clipboard);
        }
    }

    const handleDeleteFreights = () => {
        // Validate lại một lần nữa nhé
        const newRow = {
            ExpenseCode: null,
            Name: null,
            Remarks: null,
            NetAmount: null,
            GrossAmount: null,
            TaxGroup: null,
            TaxCode: null,
            TaxRate: null,
            TaxAmount: null,
            TotalTaxAmount: 0,
            BaseType: -1,
            BaseEntry: null,
            BaseLine: null
        };
        if (selectedFreightChargeRow.length == freightChargeData.length) {
            setGeneralInfo(prev => ({
                ...prev,
                FreightCharges: [{ ...newRow }]
            }));
            setFreightChargeOptions(freightChargeData?.map(item => ({
                Name: item.Name,
                ExpenseCode: item.ExpensCode
            })));
        } else {
            const selectedExpenseCodes = new Set(selectedFreightChargeRow.map(item => item.ExpenseCode));
            let lastIncluded = false;
            if (selectedExpenseCodes.has(generalInfo.FreightCharges[contentData.length - 1].ExpenseCode)) lastIncluded = true;
            const newContentData = generalInfo.FreightCharges.filter((item) => !selectedExpenseCodes.has(item.ExpenseCode));
            const updatedFreightChargeOptions = freightChargeData.filter(item =>
                selectedExpenseCodes.has(item.ExpensCode) ||
                freightChargeOptions.some(option => option.ExpenseCode === item.ExpensCode)
            );
            setFreightChargeOptions(updatedFreightChargeOptions);
            if (lastIncluded) {
                setGeneralInfo(prev => ({
                    ...prev,
                    FreightCharges: [...newContentData, { ...newRow }]
                }));
            } else {
                setGeneralInfo(prev => ({
                    ...prev,
                    FreightCharges: [...newContentData]
                }));
            }
        }
        toast.success("Deleted successfully!");
    }

    const handleCopyFrom = (data) => {
        const { DocumentName, DocumentType, Documents, Replace } = data;
        console.log("Đưng bị gì nữa: ", Documents);
        console.log("Đừng mà: ", DocumentType);
        if (Documents && Documents.length > 0) {
            // Validate thông tin nè
            const uniqueDocNums = Documents.map(doc => doc.DocNum);

            const uniqueDocNumSet = new Set(uniqueDocNums);

            const hasDifferentContentBaseType = contentData.some(item => item.BaseType !== -1 && item.BaseType !== DocumentType);
            const hasDifferentFreightBaseType = generalInfo.FreightCharges.some(item => item.BaseDocType !== -1 && item.BaseDocType !== DocumentType);

            const differentBaseTypeItems = contentData.filter(
                (item) => item.BaseType !== -1 && item.BaseType !== DocumentType
            );
            console.log("Chưa test: ", differentBaseTypeItems);
            console.log("Test: ", uniqueDocNumSet)
            console.log("Test 0: ", contentData);
            console.log("Test 1: ", hasDifferentContentBaseType)
            console.log("Test 2: ", hasDifferentFreightBaseType)

            if (hasDifferentContentBaseType || hasDifferentFreightBaseType) {
                toast.error('Error: There is an object with a BaseType different from the DocumentType');
                return;
            }

            // Lọc ra các phần tử không thỏa mãn điều kiện
            const currentContentData = contentData.filter(item => {
                return !(uniqueDocNumSet.has(item.BaseEntry) && item.BaseType === DocumentType);
            });

            const currentFreightCharges = generalInfo.FreightCharges.filter(item => {
                return !(uniqueDocNumSet.has(item.BaseDocEntry) && item.BaseDocType === DocumentType);
            });

            // Add thêm vào content, freight
            let newContentData = [];
            let newFreightRows = [];


            if (Documents.length > 0) {
                Documents.forEach((document) => {
                    // Trước hết là copy line
                    const documentLines = document.DocumentLines;
                    if (documentLines.length > 0) {
                        newContentData = documentLines.map(({ LineNum, DocEntry, Status, WarehouseCode, ...rest }) => {
                            const currentItem = itemList.find(item => item.ItemCode == rest.ItemCode);
                            return {
                                id: nanoid(6),
                                Item: currentItem,
                                BaseDocType: DocumentType,
                                BaseDocLine: LineNum,
                                BaseDocEntry: DocEntry,
                                BaseDocumentReferenceL: DocEntry,
                                ManageBatchNumbers: currentItem.ManageBatchNumbers === 'tYes',
                                ManageByQuantity: currentItem.ManageByQuantity == 'tYes',
                                ManageSerialNumbers: currentItem.ManageSerialNumbers == 'tYes',
                                TaxCode: rest.VatGroup,
                                TaxRate: vatGroups.find(v => v.Code == rest.VatGroup)?.VatGroups_Lines[0]?.Rate || 0,
                                TaxAmount: rest.NetTaxAmount,
                                Total: rest.LineTotal,
                                GrossTota: rest.GrossTotal,
                                Warehouse: warehouseOptions.find(w => w.code == WarehouseCode),
                                ...rest
                            };
                        });
                    }
                    // Copy luôn freight nếu có
                    const documentAdditionalExpenses = document.DocumentAdditionalExpenses;
                    if (documentAdditionalExpenses.length > 0) {
                        newFreightRows = documentAdditionalExpenses.map(({ LineNum, DocEntry, LineStatus, BaseOpenQuantity, ...rest }) => {
                            return {
                                id: nanoid(6),
                                BaseDocType: DocumentType,
                                BaseDocLine: LineNum,
                                BaseDocEntry: DocEntry,
                                ...rest
                            };
                        });
                    }
                });
            }

            if (newContentData.length > 0) {
                const lastItem = contentData[contentData.length - 1];
                if (Replace) {
                    setContentData([...newContentData, lastItem]);
                }
                else {
                    setContentData([...currentContentData.slice(0, -1), ...newContentData, lastItem]);
                }
            }

            if (newFreightRows.length) {
                const lastItem = generalInfo.FreightCharges[generalInfo.FreightCharges.length - 1];
                if (Replace)
                    setGeneralInfo(prev => ({
                        ...prev,
                        FreightCharges: [...newFreightRows, lastItem]
                    }));
                else
                    setGeneralInfo(prev => ({
                        ...prev,
                        FreightCharges: [...currentFreightCharges.slice(0, -1), ...newFreightRows, lastItem]
                    }))
            }

            let resultString;

            if (uniqueDocNumSet.size === 1) {
                const singleDocNum = Array.from(uniqueDocNumSet)[0];
                resultString = `Based On ${DocumentName} ${singleDocNum}`;
            } else if (uniqueDocNumSet.size > 1) {

                const docNumArray = Array.from(uniqueDocNumSet);
                const docNumString = docNumArray.join(', ');
                resultString = `Based On ${DocumentName}s ${docNumString}`;
            }

            setGeneralInfo(prev => ({
                ...prev,
                Remark: resultString
            }));
        }

    }

    const contentTHeader = (
        <div className="flex justify-between items-center">
            <h5 className="mb-0">Item Table List</h5>
            <div className="flex gap-2">
                <Button
                    type="button"
                    icon="pi pi-copy"
                    disabled={!selectedContentRows || selectedContentRows?.length < 1}
                    rounded
                    outlined
                    data-pr-tooltip="Copy"
                    tooltip="Copy"
                    tooltipOptions={{ position: 'bottom', mouseTrack: true, mouseTrackTop: 15 }}
                    onClick={handleCopyItems}
                />
                <button
                    type="button"
                    className="paste-btn p-button p-component p-button-icon-only p-button-outlined p-button-rounded"
                    data-pr-tooltip="Paste"
                    tooltip="Paste"
                    disabled={(clipboard?.length == 0) && (selectedContentRows?.length > 1)}
                    onClick={handlePasteItems}
                >
                    <Icon icon="icons8:paste" width="1.5rem" height="1.5rem" />
                </button>
                <Tooltip target=".paste-btn" mouseTrack position={'bottom'} mouseTrackTop={15} />
                <Button type="button" disabled={!selectedContentRows || selectedContentRows?.length < 1 || selectedContentRows?.length == contentData.length} icon="pi pi-trash" severity="danger" rounded outlined data-pr-tooltip="Delete" tooltip="Delete" tooltipOptions={{ position: 'bottom', mouseTrack: true, mouseTrackTop: 15 }} onClick={handleDeleteItems} />
                <Button type="button" icon="pi pi-cog" rounded outlined data-pr-tooltip="Setting" tooltip="Setting" tooltipOptions={{ position: 'bottom', mouseTrack: true, mouseTrackTop: 15 }} />
            </div>
        </div>
    )

    const freightChargeTHeader = (
        <div className="flex justify-between items-center">
            <h5 className="mb-0">Freight Charge Table List</h5>
            <div className="flex gap-2">
                <Button type="button" disabled={!selectedFreightChargeRow || selectedFreightChargeRow?.length < 1} icon="pi pi-trash" severity="danger" rounded outlined data-pr-tooltip="Delete" tooltip="Delete" tooltipOptions={{ position: 'bottom', mouseTrack: true, mouseTrackTop: 15 }} onClick={handleDeleteFreights} />
                {/* <Button type="button" disabled={!selectedContentRows || selectedContentRows?.length < 1 || selectedContentRows?.length == contentData.length} icon="pi pi-sync" severity="danger" rounded outlined data-pr-tooltip="Delete" tooltip="Delete" tooltipOptions={{ position: 'bottom', mouseTrack: true, mouseTrackTop: 15 }} onClick={handleDeleteItems} /> */}
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

        console.log("Test file: ", _totalSize);
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
        const value = totalSize / 50000;
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
                <i className="pi pi-file-arrow-up mt-3 p-5" style={{ fontSize: '5em', borderRadius: '50%', backgroundColor: 'var(--surface-b)', color: 'var(--surface-d)' }}></i>
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

    const handleBatchSelections = (selections) => {
        if (selectedItemRow.id) {
            setContentData(prev => (prev.map(item =>
                item.id === selectedItemRow.id ? { ...item, BatchNumbers: selections } : item)))
        }
    };

    const handleSerialSelections = (selections) => {
        if (selectedItemRow.id) {
            setContentData(prev => (prev.map(item =>
                item.id === selectedItemRow.id ? { ...item, SerialNumbers: selections } : item)))
        }
    }

    /** 
     *  Handle Process Submit
     */

    const validateContentData = () => {
        for (const item of contentData) {
            if (item.ManageBatchNumbers) {
                if (item.BatchNumbers.length === 0) {
                    toast.error(`Batch numbers are required for item with id ${item.id}`);
                    return false;
                }
            }

            if (item.ManageSerialNumbers) {
                if (item.SerialNumbers.length === 0) {
                    toast.error(`Serial numbers are required for item with id ${item.id}`);
                    return false;
                }
            }
        }

        return true;
    };

    const uploadFileAttachments = async () => {
        const files = fileUploadRef.current.getFiles();

        if (files.length > 0) {
            const formData = new FormData();

            files.forEach((file) => {
                formData.append('files', file);
                formData.append('Override', 'Y');
            });

            try {
                const response = await salesApi.uploadAttachment(formData);
                console.log('Upload thành công:', response);
                toast.success('Upload thành công!');
                return response.AbsoluteEntry;
            } catch (error) {
                console.error('Lỗi khi upload:', error);
                toast.error('Lỗi khi upload.');
                return false;
            }
        }
        return null;
    }

    const handleAddAndView = async () => {
        // Validate dữ liệu
        // setLoading(true);
        setIsPosting(true);
        if (contentData.length == 1) {
            toast.error("Please choose at least one item.");
            setIsPosting(false);
            return;
        } else {
            const validation = validateContentData();
            if (!validation) { setIsPosting(false); return; }
        }

        let documentLines = [];
        let documentAdditionalExpenses = [];

        const currentContentData = contentData.filter(f => f.ItemCode);
        console.log("Kết quả: ", contentData);

        if (currentContentData.length > 0) {
            documentLines = currentContentData.map(item => {
                return {
                    ItemCode: item.ItemCode,
                    Quantity: item.Quantity,
                    TaxCode: item.TaxCode,
                    BatchNumbers: item.BatchNumbers.length > 0 ? item.BatchNumbers.map(batch => ({
                        BatchNumber: batch.BatchNum,
                        ItemCode: batch.ItemCode,
                        Quantity: batch.SelectedQuantity
                    })) : [],
                    SerialNumbers: item.SerialNumbers.length > 0 ? item.SerialNumbers.map(batch => ({
                        InternalSerialNumber: batch.IntrSerial,
                        Quantity: 1
                    })) : [],
                }
            });
        }

        const currentFreightCharges = generalInfo.FreightCharges.filter(f => f.ExpenseCode);

        if (currentFreightCharges.length > 0) {
            documentAdditionalExpenses = currentFreightCharges.map(freight => {
                return {
                    ExpenseCode: freight.ExpenseCode,
                    Remarks: freight.Remarks,
                    TaxCode: freight.TaxCode,
                    LineTotal: freight.Totalamount,
                    LineGross: freight.NetAmount
                }
            });
        }

        const data = {
            CardCode: selectedCustomer.CardCode,
            DocDate: generalInfo.PostingDate,
            DocDueDate: generalInfo.DeliveryDate,
            DocumentDate: generalInfo.DocumentDate,
            Comments: generalInfo.Remark,
            DocumentLines: documentLines,
            DocumentAdditionalExpenses: documentAdditionalExpenses
        };

        console.log("Submit: ", data);

        // Upload file attachments và lấy AbsoluteEntry
        const absoluteEntry = await uploadFileAttachments();

        if (absoluteEntry === false) {
            setIsPosting(false);
            return;
        }

        // Thêm AbsoluteEntry vào data
        data.AttachmentEntry = absoluteEntry;

        try {
            // Thực hiện createDelivery
            const res = await salesApi.createDelivery(JSON.stringify(data));
            toast.success("Created successfully.");
        } catch (error) {
            console.error("Lỗi khi tạo Delivery:", error);
            // const errorString = error?.response?.data?.error;
            // if (errorString) {
            //     toast.error(errorString);
            // } else 
            toast.error("There was an error occurred");

            // Nếu createDelivery không thành công, xóa attachment đã upload
            if (absoluteEntry) {
                try {
                    await salesApi.deleteAttachment({ AbsoluteEntry: absoluteEntry });
                    console.log("Attachment đã được xóa.");
                } catch (deleteError) {
                    console.error("Lỗi khi xóa Attachment:", deleteError);
                    setIsPosting(false);
                }
            }
        } finally {
            setIsPosting(false);
        }
    }

    const chooseOptions = { icon: 'pi pi-fw pi-cloud-upload', iconOnly: true, className: 'custom-choose-btn p-button-rounded p-button-outlined' };
    const cancelOptions = { icon: 'pi pi-fw pi-times', iconOnly: true, className: 'custom-cancel-btn p-button-danger p-button-rounded p-button-outlined' };

    return (
        !loading ?
            (
                <>
                    <div ref={containerRef} className="flex flex-col min-h-[calc(100vh-9rem)] mb-[75px]">
                        <div className="w-full">
                            <div className="card">
                                <h3>{tG('createDocument')}</h3>
                                <div className="flex justify-center sm:justify-start flex-col sm:flex-row py-2 gap-2 sm:gap-0">
                                    <div className="flex gap-3 sm:gap-0 sm:flex-col">
                                        <span className="flex items-center font-bold">{tG('documentType')}</span>
                                        <span className="font-bold text-xl sm:text-2xl text-indigo-500">{tG('delivery')}</span>
                                    </div>
                                    <Divider className="hidden sm:block px-3" layout="vertical" />
                                    <div className="flex gap-3">
                                        <div className="flex gap-3 justify-between sm:gap-0 sm:flex-col">
                                            <span className="flex items-center font-bold">{tG('documentNo')}</span>
                                            {
                                                !generalInfo.DocNum ? (<Skeleton className="h-5/6 mb-1" borderRadius="16px"></Skeleton>)
                                                    : generalInfo.DocNumType == 'Primary' ? (<span className="font-bold text-xl sm:text-2xl text-indigo-500">{generalInfo.DocNum}</span>) : (<InputNumber inputId="integeronly" value={generalInfo.DocNum} onChange={e => setGeneralInfo(prev => ({ ...prev, DocNum: e.value }))} className="w-full text-right p-inputtext-sm" min={0} />)
                                            }
                                        </div>
                                        <Button disabled={!generalInfo.DocNum} icon={`pi ${generalInfo.DocNumType == "Primary" ? 'pi-user-edit' : 'pr-times'}`} size="small" className='!h-[28px] !w-[28px] self-end' rounded text severity="secondary" aria-label="Edit Code" onClick={handleToggleDocNo} />
                                    </div>
                                    <Divider className="hidden sm:block px-3" layout="vertical" />
                                    <div className="flex gap-3 sm:gap-0 sm:flex-col">
                                        <span className="flex items-center font-bold">{tG('status')}</span>
                                        <span className="font-bold text-xl sm:text-2xl text-indigo-500">Open</span>
                                    </div>
                                </div>
                                <section>
                                    <div className='mb-2.5 mt-4'>
                                        <h5 className='mb-0 font-bold text-indigo-600 uppercase'>{tG('generalInfo')}</h5>
                                        <Divider className="my-2" />
                                    </div>
                                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 md:grid-cols-4 p-[7px]">
                                        <div className="flex flex-column gap-2">
                                            <label className='font-semibold'>{t('customer')} <span className="text-red-700 font-semibold">*</span></label>
                                            <div className="flex">
                                                <Dropdown loading={!dataLoaded} checkmark={true} filter options={dataLoaded ? customerListOptions : []} value={customerListOptions.find(val => val.code == selectedCustomer?.CardCode)}
                                                    valueTemplate={CustomerDropdownValueTemplate} itemTemplate={CustomerDropdownItemTemplate}
                                                    optionLabel="name" placeholder={!dataLoaded ? "Loading customer... " : "Select customer"} onChange={(e) => handleChangeSelectedCustomer(e.value.code)} className="w-full" />
                                                <Button disabled={!dataLoaded} icon="pi pi-list" onClick={() => { setCustomerSelectModalOpen(true) }} />
                                            </div>
                                        </div>
                                        <div className="flex flex-column gap-2">
                                            <label className='font-semibold'>{t('customerName')}</label>
                                            <div className="w-full p-inputtext p-component flex-1 !min-h-[42px]"><span className="h-[21px]">{selectedCustomer?.CardName || ""}</span></div>
                                        </div>
                                        <div className="flex flex-column gap-2">
                                            <label className='font-semibold'>{t('contactPerson')}</label>
                                            <Dropdown filter checkmark={true} options={contactPersonListOptions} value={selectedContactPerson} optionLabel="name"
                                                placeholder="Select contact person" onChange={(e) => setSelectedContactPerson(e.value)} className="w-full" />
                                        </div>
                                        <div className="flex flex-column gap-2">
                                            <label className='font-semibold'>{t('customerRefNo')}</label>
                                            <InputText aria-describedby="customer-ref-no" />
                                        </div>
                                        <div className="flex flex-column gap-2">
                                            <label className='font-semibold'>{t('seriesNo')}</label>
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
                                            <label className='font-semibold'>{t('postingDate')}</label>
                                            <Calendar value={generalInfo.PostingDate} maxDate={new Date()} onChange={(e) => setGeneralInfo(prev => ({ ...prev, PostingDate: e.value }))} className="text-base" showIcon dateFormat="dd/mm/yy" />
                                        </div>
                                        <div className="flex flex-column gap-2">
                                            <label className='font-semibold'>{t('deliveryDate')} <span className="text-red-700 font-semibold">*</span></label>
                                            <Calendar value={generalInfo.DeliveryDate} onChange={(e) => setGeneralInfo(prev => ({ ...prev, DeliveryDate: e.value }))} className="text-base" showIcon dateFormat="dd/mm/yy" />
                                        </div>
                                        <div className="flex flex-column gap-2">
                                            <label className='font-semibold'>{t('documentDate')}</label>
                                            <Calendar value={generalInfo.DocumentDate} onChange={(e) => setGeneralInfo(prev => ({ ...prev, DocumentDate: e.value }))} className="text-base" showIcon dateFormat="dd/mm/yy" />
                                        </div>
                                    </div>

                                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 md:grid-cols-4 p-[7px] mt-2">
                                        <div className="flex flex-column gap-2">
                                            <label className='font-semibold'>{t('remark')}</label>
                                            <InputTextarea autoResize rows={2} onChange={(e) => setGeneralInfo(prev => ({ ...prev, Remark: e.value }))} />
                                        </div>
                                        <div className="flex flex-column gap-2">
                                            <label className='font-semibold'>{t('salesEmployee')}</label>
                                            <Dropdown showClear filter value={selectedSalesEmployee} onChange={(e) => setSelectedSalesEmployee(e.value)} options={salesEmployeeListOptions} optionLabel="name"
                                                placeholder="Select a sales employee" className="w-full" />

                                        </div>
                                        <div className="flex flex-column gap-2">
                                            <label className='font-semibold'>{t('owner')}</label>
                                            <Dropdown filter showClear value={selectedOwner} onChange={(e) => setSelectedOwner(e.value)} options={employeeListOption} optionLabel="name"
                                                placeholder="Select an owner" className="w-full" />
                                            {/* <InputText aria-describedby="price-list-help" /> */}
                                        </div>
                                    </div>
                                </section>
                                <section>
                                    <div className='mb-2.5 mt-4'>
                                        <h5 className='mb-0 font-bold uppercase text-indigo-600'>{tG('content')}</h5>
                                        <Divider className="my-2" />
                                    </div>
                                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 md:grid-cols-4 p-[7px] mt-2">
                                        <div className="flex flex-column gap-2">
                                            <label className='font-semibold'>Currency Type</label>
                                            <Dropdown value={selectedCurrency} filter onChange={handleChangeSelectedCurrency} options={currencyOptions} dataKey="code" optionLabel="name"
                                                placeholder="Select a currency" className="w-full" />
                                        </div>
                                        <div className="flex flex-column gap-2">
                                            <label className='font-semibold'>Currency</label>
                                            {
                                                selectedCurrency?.code !== "bpCurrency" && selectedCurrency?.currency && (
                                                    <Message text={selectedCurrency?.currency} />
                                                )
                                            }
                                            {
                                                selectedCurrency?.code == "bpCurrency" && (
                                                    <Dropdown value={generalInfo?.DocCurrency} onChange={handleChangeDocCurrency} options={selectCurrencyOptions} dataKey="Code" optionLabel="Name"
                                                        placeholder="Select a currency" className="w-full md:w-14rem" checkmark highlightOnSelect={false} />
                                                )
                                            }
                                        </div>
                                        <div className="flex flex-column gap-2">
                                            <label className='font-semibold'>Item/Service Type</label>
                                            <Dropdown value={selectedItemType} onChange={handleChangeItemServiceType} options={itemTypeOptions} optionLabel="name"
                                                placeholder="Select item/service type" className="w-full" />
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        {dataLoaded ?
                                            (
                                                <BlockUI blocked={!selectedCustomer} template={<i className="pi pi-lock" style={{ fontSize: '3rem' }}></i>}>
                                                    <DataTable
                                                        ref={contentTableRef}
                                                        reorderableRows
                                                        value={contentData}
                                                        className="list-table p-datatable-gridlines"
                                                        editMode
                                                        header={contentTHeader}
                                                        // footer={contentTFooter}
                                                        showGridlines
                                                        onColumnResizeEnd={handleResizeColumn}
                                                        selectionAutoFocus={false}
                                                        // rows={8}
                                                        // rowsPerPageOptions={[20, 50, 100, 200]}
                                                        selectionMode={'checkbox'}
                                                        selection={selectedContentRows}
                                                        onSelectionChange={(e) => {
                                                            const currentValue = e.value;
                                                            setSelectedContentRows(e.value)
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
                                                                    header={col.header}
                                                                    field={col.field}
                                                                    style={{ minWidth: col.minWidth }}
                                                                    // className="text-right"
                                                                    body={col.body}
                                                                />
                                                            ))
                                                        }
                                                    </DataTable>
                                                </BlockUI>
                                            ) : (
                                                <DataTable value={exampleItems} className="list-table p-datatable-gridlines"
                                                    header={contentTHeader}>
                                                    <Column body={<Skeleton />} style={{ width: '3rem' }} />
                                                    <Column body={<Skeleton />} headerStyle={{ width: '3rem' }} />
                                                    {
                                                        contentColumns && contentColumns.length > 0 && contentColumns.map((col, index) => (
                                                            <Column
                                                                key={index}
                                                                // ref={index === 1 ? columnRef : null}
                                                                header={col.header}
                                                                field={col.field}
                                                                style={{ minWidth: col.minWidth }}
                                                                // className="text-right"
                                                                body={<Skeleton />}
                                                            />
                                                        ))
                                                    }
                                                </DataTable>
                                            )
                                        }
                                    </div>
                                    <div className="mt-4">
                                        {dataLoaded ?
                                            (
                                                <BlockUI blocked={!selectedCustomer} template={<i className="pi pi-lock" style={{ fontSize: '3rem' }}></i>}>
                                                    <DataTable
                                                        ref={freightChargeTableRef}
                                                        reorderableRows
                                                        value={generalInfo.FreightCharges}
                                                        className="list-table p-datatable-gridlines"
                                                        editMode
                                                        header={freightChargeTHeader}
                                                        showGridlines
                                                        // onColumnResizeEnd={handleResizeColumn}
                                                        selectionAutoFocus={false}
                                                        // rows={8}
                                                        // rowsPerPageOptions={[20, 50, 100, 200]}
                                                        selectionMode={'checkbox'}
                                                        selection={selectedContentRows}
                                                        onSelectionChange={(e) => {
                                                            const currentValue = e.value;
                                                            setSelectedFreightChargeRow(e.value)
                                                        }}
                                                        // globalFilterFields={['DocNo', 'PostingDate', 'DocumentDate', 'DocumentTotal']}
                                                        dataKey="ExpenseCode"
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
                                                        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
                                                        {
                                                            freightChargesColumns && freightChargesColumns.length > 0 && freightChargesColumns.map((col, index) => (
                                                                <Column
                                                                    key={index}
                                                                    // ref={index === 1 ? columnRef : null}
                                                                    header={col.header}
                                                                    field={col.field}
                                                                    style={{ minWidth: col.minWidth }}
                                                                    body={col.body}
                                                                />
                                                            ))
                                                        }
                                                    </DataTable>
                                                </BlockUI>
                                            ) :
                                            (
                                                <DataTable value={exampleItems} className="list-table p-datatable-gridlines"
                                                    header={freightChargeTHeader}>
                                                    <Column body={<Skeleton />} style={{ width: '3rem' }} />
                                                    <Column body={<Skeleton />} headerStyle={{ width: '3rem' }} />
                                                    {
                                                        freightChargesColumns && freightChargesColumns.length > 0 && freightChargesColumns.map((col, index) => (
                                                            <Column
                                                                key={index}
                                                                // ref={index === 1 ? columnRef : null}
                                                                header={col.header}
                                                                field={col.field}
                                                                style={{ minWidth: col.minWidth }}
                                                                className="text-right"
                                                                body={<Skeleton />}
                                                            />
                                                        ))
                                                    }
                                                </DataTable>
                                            )
                                        }
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
                                                            {formatNumberWithComma(generalInfo.TotalBeforeDiscount)} {' '} {'$'}
                                                        </div>
                                                    </li>
                                                    <li className="flex items-center justify-between py-1.5 px-2 border-top-1 border-300 flex-wrap">
                                                        <div className="text-500 w-6 md:w-4 font-medium">Discount</div>
                                                        <div className="text-900 w-full md:w-4 md:flex-order-0 flex-order-1"><InputNumber inputId="percent" className='w-full text-right p-inputtext-sm' min={0} max={100} suffix=" %" value={generalInfo.DiscountPercent} onChange={(e) => setGeneralInfo(prev => ({ ...prev, DiscountPercent: e.value }))} />
                                                        </div>
                                                        <div className="w-6 md:w-4 flex justify-content-end">
                                                            {formatNumberWithComma(generalInfo.DiscountAmount)} {' '} {'$'}
                                                        </div>
                                                    </li>
                                                    <li className="flex items-center justify-between py-1.5 px-2 border-top-1 border-300 flex-wrap">
                                                        <div className="text-500 w-4 md:w-4 font-medium">Freight</div>
                                                        <div className="text-900 w-full md:w-4 md:flex-order-0 flex-order-1"></div>
                                                        <div className="w-6 md:w-4 flex justify-content-end">{formatNumberWithComma(generalInfo.FreightAmount)} {' '} {'$'}</div>
                                                    </li>
                                                    <li className="flex items-center justify-between py-1.5 px-2 border-top-1 border-300 flex-wrap">
                                                        <div className="text-500 w-6 md:w-4 font-medium">Rounding</div>
                                                        <div className="text-900 w-full md:w-4 md:flex-order-0 flex-order-1"><Checkbox onChange={e => setGeneralInfo(prev => ({ ...prev, Rounding: e.checked }))} checked={generalInfo.Rounding}></Checkbox></div>
                                                        <div className="w-6 md:w-4 flex justify-content-end">
                                                            {
                                                                generalInfo.Rounding ? <InputNumber inputId="integeronly" value={generalInfo.RoundingAmount} onChange={e => setGeneralInfo(prev => ({ ...prev, RoundingAmount: e.value }))} className="w-full text-right p-inputtext-sm" min={0} suffix=" $" /> : `${formatNumberWithComma(generalInfo.RoundingAmount)} $`
                                                            }
                                                        </div>
                                                    </li>
                                                    <li className="flex items-center justify-between py-1.5 px-2 border-top-1 border-300 flex-wrap">
                                                        <div className="text-500 w-4 md:w-4 font-medium">Tax</div>
                                                        <div className="text-900 w-full md:w-4 md:flex-order-0 flex-order-1"></div>
                                                        <div className="w-6 md:w-4 flex justify-content-end">{formatNumberWithComma(generalInfo.TaxAmount)} {' '} {'$'}</div>
                                                    </li>
                                                    <li className="flex items-center justify-between py-1.5 px-2 border-top-1 border-300 flex-wrap">
                                                        <div className="text-500 w-4 md:w-2 font-medium">Total</div>
                                                        <div className="text-900 w-full md:w-4 md:flex-order-0 flex-order-1 line-height-3"></div>
                                                        <div className="w-6 md:w-4 flex justify-content-end">{formatNumberWithComma(generalInfo.TotalAmount)} {' '} {'$'}</div>
                                                    </li>
                                                </ul>
                                            </Panel>
                                            {/* </div> */}
                                        </div>
                                    </div>
                                </section>
                                <section>
                                    <div className='mb-2.5 mt-4'>
                                        <h5 className='mb-0 font-bold uppercase text-indigo-600'>{tG('logistics')}</h5>
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
                                                        <Button label=" New" icon="pi pi-plus" size="small" onClick={() => setWhichEditAddressModalOpen("shipToDefine")} />
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
                                                        <Button label=" New" icon="pi pi-plus" size="small" onClick={() => setWhichEditAddressModalOpen("billToDefine")} />
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
                                        <h5 className='mb-0 font-bold uppercase text-indigo-600'>{tG('accounting')}</h5>
                                        <Divider className="my-2" />
                                    </div>
                                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 md:grid-cols-4 p-[7px]">
                                        <div className="flex flex-column gap-2">
                                            <label className='font-semibold'>Journal Remark</label>
                                            <InputText aria-describedby="customer-ref-no" value={generalInfo.JournalRemark} onChange={(e) => setGeneralInfo(prev => ({ ...prev, JournalRemark: e.value }))} />
                                        </div>
                                        <div className="flex flex-column gap-2">
                                            <label className='font-semibold'>Payment Term</label>
                                            <Dropdown loading={!dataLoaded} checkmark filter options={paymentTermOptions} value={selectedPaymentTerm} optionLabel="name"
                                                placeholder={!dataLoaded ? "Loading payment term... " : "Select payment term"} onChange={(e) => setSelectedPaymentTerm(e.value)} className="w-full" />
                                        </div>
                                        <div className="flex flex-column gap-2">
                                            <label className='font-semibold'>Payment Method</label>
                                            <Dropdown showClear loading={!dataLoaded} filter options={paymentMethodOptions} value={selectedPaymentMethod} optionLabel="PaymentMethodCode" dataKey='PaymentMethodCode'
                                                onChange={(e) => setSelectedPaymentMethod(e.value)} placeholder={!dataLoaded ? "Loading payment method... " : "Select payment method"} className="w-full" />
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
                                            <InputTextarea autoResize rows={2} />
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
                                        <h5 className='mb-0 font-bold uppercase text-indigo-600'>{tG('attachment')}</h5>
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
                    <FeatureBar
                        fatherLoading={loading}
                        docType="Delivery"
                        selectedBPCode={selectedCustomer?.CardCode}
                        style={{ width: `${containerWidth}px`, maxWidth: `${containerWidth}px` }}
                        className={`!max-w-[${containerWidth}px] !w-[${containerWidth}px]`}
                        handleAddAndView={handleAddAndView}
                        handleCopyFrom={handleCopyFrom}
                    />
                    <CustomerList customerSelectModalOpen={customerSelectModalOpen} setCustomerSelectModalOpen={(value) => setCustomerSelectModalOpen(value)} customerList={customerList} orignalSelectedCustomer={selectedCustomer} setCustomer={handleChangeSelectedCustomer} />
                    <ItemList itemSelectModalOpen={itemSelectModalOpen} setItemSelectModalOpen={(value) => setItemSelectModalOpen(value)} itemList={itemList} selectedItemRow={selectedItemRow?.Item} setItem={handleSetItems} />
                    <BatchSerialSelection batchSerialModalOpen={batchSerialModalOpen} item={selectedItemRow} setBatchSerialModalOpen={setBatchSerialModalOpen} setBatchSelections={handleBatchSelections} setSerialSelections={handleSerialSelections} />
                    <SalesTaxCodeList taxCodeSelectModalOpen={taxCodeSelectModalOpen} setTaxCodeSelectModalOpen={(value) => setTaxCodeSelectModalOpen(value)} taxCodeList={vatGroups} selectedTaxCodeRow={selectedItemRow || selectedFreightChargeRow} setTaxCode={handleSetTaxCode} />

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
                    <ConfirmDialog />
                    {/* {
                        isPosting && ( */}
                    <>
                        <div className="absolute top-0 left-0 w-full h-full backdrop-blur-lg bg-[rgba(202,202,202,0.65)]"></div>
                        <Loader />
                    </>
                    {/* ) */}
                    {/* } */}
                </>
            ) : (
                <Loader />
            )
    );
};

CreateDelivery.messages = ['CreateDelivery', 'General'];

export async function getServerSideProps({ locale }) {
    return {
        props: {
            messages: pick(
                (await import(`../../../../../messages/${locale}.json`)).default,
                CreateDelivery.messages
            ),
        }
    };
}

export default withAuth(CreateDelivery);
// export default CreateDelivery;