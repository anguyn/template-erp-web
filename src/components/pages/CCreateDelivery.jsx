
import Head from 'next/head'
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useResizeDetector } from 'react-resize-detector';
import { useRouter } from 'next/router'
import { useTranslations } from 'next-intl';
import { shallow } from 'zustand/shallow';

import withAuth from '@/utils/withAuth';
import toast from 'react-hot-toast';
import { nanoid } from 'nanoid';

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
import { Icon } from '@iconify/react';
import { FileUpload } from 'primereact/fileupload';
import { ListBox } from 'primereact/listbox';
import { Message } from 'primereact/message';
import { ProgressBar } from 'primereact/progressbar';
import { Panel } from 'primereact/panel';
import { Tag } from 'primereact/tag';
import { Skeleton } from 'primereact/skeleton';
import { BlockUI } from 'primereact/blockui';
import { MultiSelect } from 'primereact/multiselect';

import ItemList from '@/components/ItemList';
import CustomerList from '@/components/CustomerList';
import SalesTaxCodeList from '@/components/TaxCodeList/Sales';
import BatchSerialCreation from "@/components/BatchSerial/Create"
// import GRPOHelper from '@/components/Dialog/Helpers/Delivery';
import FeatureBar from '@/components/FeatureBar';
import Loader from '@/components/Loader';

import { formatNumberWithComma } from '@/utils/number';
import { capitalizeWords } from '@/utils/text';

import { useCompanyStore } from '@/stores/companyStore';
import useStore from '@/stores/useStore';
import GLAccountList from '../GLAccountList';

const SELECT = ["AttachmentEntry", "DefaultWarehouse", "ItemCode", "ItemClass", "ItemName", "ForeignName",
    "ItemWarehouseInfoCollection", "ItemPrices", "IssueMethod", "ItemType", "ItemDistributionRules", "Picture",
    "ManageBatchNumbers", "ManageByQuantity", "ManageSerialNumbers", "ManageStockByWarehouse", "QuantityOnStock",
    "SalesItem", "SalesVATGroup", "SalesUnit", "PurchaseItem", "PurchaseUnit", "PurchaseVATGroup"];

const CCreateDelivery = ({ initialData, messages }) => {
    // console.log("Haizz: ", messages);
    const { data } = initialData;
    // const hasHydrated = useHydration(useCompanyStore);
    // const { companyInfo, currencies } = useCompanyStore((state) => state);
    const companyInfo = useStore(useCompanyStore, (state) => state.companyInfo);
    const currencies = useStore(useCompanyStore, (state) => state.currencies);
    // console.log("Dô chién nài: ", initialData);
    // console.log("Hè", companyInfo)
    // console.log("Hè 2", currencies)

    // if (!hasHydrated) {
    //     return <div>Loading...</div>
    // }
    // console.log("Hè: ", companyInfo);

    const router = useRouter();
    const { query, locale } = router;
    const t = useTranslations('Delivery');
    const tG = useTranslations('General');
    const tM = useTranslations('Messages');
    /** Skeleton */
    const exampleItems = Array.from({ length: 1 }, (v, i) => i);
    /** Main */
    const [isHelperOpen, setIsHelperOpen] = useState(false);
    const [clipboard, setClipboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isPosting, setIsPosting] = useState(false);
    // const [generalInfo, setGeneralInfo] = useState(null);
    const [copyDocument, setCopyDocument] = useState(null);
    const [generalInfo, setGeneralInfo] = useState({
        DocNumType: "Primary",
        DocNum: null,
        // DocCurrency: currencies.find(c => c.Code == companyInfo?.LocalCurrency),
        DocCurrency: null,
        NumAtCard: null,
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
        JournalRemark: '',
        CashDiscountDateOffset: null,
        CreateQRCodeFrom: null,
        FederalTaxID: null,
        ImportFileNum: 0,
    });
    const [docNum, setDocNum] = useState(null);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [selectedContactPerson, setSelectedContactPerson] = useState(null);
    const [selectedSeriesNo, setSelectedSeriesNo] = useState(null);
    const [selectedCurrency, setSelectedCurrency] = useState(null);
    // const [selectedCurrency, setSelectedCurrency] = useState({ name: 'Local Currency', code: 'localCurrency', currency: companyInfo?.LocalCurrency });
    const [selectedDocType, setSelectedDocType] = useState({ name: 'Item', code: 'dDocument_Items' });
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
    const [salesEmployeeList, setSalesEmployeeList] = useState(data?.salesEmployee || []);
    const [salesEmployeeListOptions, setSalesEmployeeListOptions] = useState(data?.salesEmployee?.map(val => ({ name: val.SalesEmployeeName, code: val.SalesEmployeeCode })) || []);
    const [employeeList, setEmployeeList] = useState(data?.employee || []);
    const [employeeListOption, setEmployeeListOption] = useState(data?.employee?.map(val => ({ name: `${val.FirstName ?? ''} ${val.MiddleName ?? ''} ${val.LastName ?? ''}`.trim(), code: val.EmployeeID })) || []);
    const [vatGroups, setVatGroups] = useState(data?.vatGroup || []);
    const [selectCurrencyOptions, setSelectCurrencyOptions] = useState([]);
    // const [selectCurrencyOptions, setSelectCurrencyOptions] = useState(currencies);
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

    const documentTypeOptions = useMemo(() => [
        { name: t("item"), code: 'dDocument_Items' },
        { name: t('service'), code: 'dDocument_Service' }
    ], [locale]);

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
            AccountCode: '',
            AccountName: '',
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
            UoMName: '',
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
    const [freightChargeData, setFreightChargeData] = useState(data?.additionalExpense || []);
    const [freightChargeOptions, setFreightChargeOptions] = useState(data?.additionalExpense?.map(item => ({
        Name: item.Name,
        ExpenseCode: item.ExpensCode
    })) || []);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [itemList, setItemList] = useState([]);
    const [glAccountList, setGLAccountList] = useState([]);
    const [warehouseList, setWarehouseList] = useState([]);
    const [selectedItemRow, setSelectedItemRow] = useState(null);
    const [itemSelectModalOpen, setItemSelectModalOpen] = useState(false);
    const [glAccountSelectModalOpen, setGLAccountSelectModalOpen] = useState(false);
    const [taxCodeSelectModalOpen, setTaxCodeSelectModalOpen] = useState(false);
    const [batchSerialModalOpen, setBatchSerialModalOpen] = useState(false);
    const [selectedContentRows, setSelectedContentRows] = useState(null);
    const [selectedFreightChargeRow, setSelectedFreightChargeRow] = useState(null);
    const [isRounding, setIsRounding] = useState(false);

    const [itemServiceWarningVisible, setItemServiceWarningVisible] = useState(false);
    const [savingConfirmVisible, setSavingConfirmVisible] = useState(false);

    const [whichColumnTableModalOpen, setWhichColumnTableModalOpen] = useState(null);
    const [whichEditAddressModalOpen, setWhichEditAddressModalOpen] = useState(null);

    const [visibleItemColumns, setVisibleItemColumns] = useState(null);
    const [visibleServiceColumns, setVisibleServiceColumns] = useState(null);
    const [visibleFreightColumns, setVisibleFreightColumns] = useState(null);

    const [totalSize, setTotalSize] = useState(0);
    const fileUploadRef = useRef(null);

    const contentItemTableRef = useRef(null);
    const contentServiceTableRef = useRef(null);
    const freightChargeTableRef = useRef(null);
    // const creationListRef = useRef(null)

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
        const fetchItems = async (top = 1000, skip = 0) => {
            const props = {
                select: SELECT,
                top,
                skip,
                filter: ["PurchaseItem eq 'tYES'"]
            }

            console.log("Xin tì: ", props)
            const res = await fetch('/api/inventory/get-item', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(props),
            });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const dataResult = await res.json();
            return dataResult.value;
        };

        // Function to handle fetching all items in batches and updating state
        const fetchAllItemsInBatches = async (count) => {
            const numberOfBatches = Math.ceil(count / 1000);
            const fetchPromises = [];
            for (let i = 0; i < numberOfBatches; i++) {
                fetchPromises.push(fetchItems(1000, i * 1000));
            }

            try {
                // As soon as any batch returns data, setLoading to false
                const results = await Promise.allSettled(fetchPromises);
                const allResults = results
                    .filter(result => result.status === 'fulfilled')
                    .map(result => result.value)
                    .flat();

                // If any data is returned, set loading to false to allow interaction
                if (allResults.length > 0) {
                    setLoading(false);
                }

                return allResults;
            } catch (error) {
                console.error("Error fetching items in batches", error);
                return [];
            }
        };
        const fetchData = async () => {
            try {
                // Hàm async 0: Lấy count của delivery
                const fetchDeliveryDocQuanty = async () => {
                    const res = await fetch('/api/sales/get-delivery-count', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include'
                    });
                    const dataResult = await res.json();

                    // const dataResult = await purchaseApi.getDeliveryDocQuantity();
                    console.log("Ra gì: ", dataResult);
                    const currentDocNum = dataResult?.data ? Number(dataResult?.data) + 1 : dataResult ? Number(dataResult) + 1 : "Undefined";
                    setDocNum(currentDocNum);
                    setGeneralInfo(prev => ({ ...prev, DocNum: currentDocNum }));
                };

                // Hàm async 1: Trường hợp link duplicate
                const fetchCurrentDelivery = async () => {
                    if (query?.docEntry && query?.base) {
                        // Fetch the initial item count
                        const countRes = await fetch('/api/inventory/get-item-count', {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            credentials: 'include',
                        });

                        const countData = await countRes.json();
                        // const fetchedItemCount = countData.count;
                        // setItemCount(fetchedItemCount);
                        console.log("Khùm hẻn: ", countData);
                        console.log("Khùm hẻn 2: ", itemList);

                        if (itemList?.length < 1) {
                            // Case when item list is initially empty
                            if (countData > 1000) {
                                const combinedResults = await fetchAllItemsInBatches(countData);
                                setItemList(combinedResults);
                                setDataList(combinedResults);
                            } else {
                                const items = await fetchItems(countData);
                                console.log("List of items: ", items)
                                setItemList(items);
                            }
                        } else if (itemList?.length > 1 && itemList?.length !== countData) {
                            // Case when item list is not empty but length doesn't match count
                            if (countData > 1000) {
                                const combinedResults = await fetchAllItemsInBatches(countData);
                                setItemList(combinedResults);
                            } else {
                                const items = await fetchItems(countData);
                                setItemList(items);
                            }
                        }

                        const { docEntry, base } = query;

                        const res = await fetch(`/api/purchase/get-delivery?id=${docEntry}`, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            credentials: 'include'
                        });
                        const dataResult = await res.json();
                        setCopyDocument(dataResult);
                    }
                    // const res = await fetch(`/api/purchase/get-delivery/`, {
                    //     method: 'GET',
                    //     headers: {
                    //         'Content-Type': 'application/json',
                    //     },
                    //     credentials: 'include'
                    // });
                    // const dataResult = await res.json();

                    // // const dataResult = await purchaseApi.getDeliveryDocQuantity();
                    // console.log("Ra gì: ", dataResult);
                    // const currentDocNum = dataResult?.data ? Number(dataResult?.data) + 1 : dataResult ? Number(dataResult) + 1 : "Undefined";
                    // setDocNum(currentDocNum);
                    // setGeneralInfo(prev => ({ ...prev, DocNum: currentDocNum }));
                };

                // Hàm async 1: Lấy danh sách customer
                // const fetchCustomer = async () => {
                //     const queryProps = {
                //         filter: ["CardType eq 'cCustomer'"]
                //     };
                //     const dataResult = await partnersApi.getAllPartners(queryProps);
                //     setCustomerList(dataResult.value);
                //     setCustomerListOptions(dataResult.value?.map(val => ({ name: val.CardName, code: val.CardCode })))

                //     console.log("Customer nè: ", dataResult.value);
                // };

                // Hàm async 2: Lấy danh sách các item
                // const fetchItems = async () => {
                //     const queryProps = {
                //         filter: ["PurchaseItem eq 'Y'"]
                //     };
                //     const dataResult = await inventoryApi.getAllItems(queryProps);
                //     setItemList(dataResult.value);

                //     console.log("Item nè: ", dataResult.value);
                // };

                // Hàm async 3: Lấy danh sách các warehouse
                const fetchWarehouses = async () => {
                    const queryProps = {};
                    const res = await fetch('/api/inventory/get-warehouses', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include',
                        body: JSON.stringify(queryProps),
                    });
                    const dataResult = await res.json();
                    // const dataResult = await inventoryApi.getAllWarehouse(queryProps);

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
                // const fetchSalesEmployee = async () => {
                //     const queryProps = {};
                //     const dataResult = await salesApi.getAllSalesPerson(queryProps);
                //     setSalesEmployeeList(dataResult.value);
                //     setSalesEmployeeListOptions(dataResult.value?.map(val => ({ name: val.SalesEmployeeName, code: val.SalesEmployeeCode })));
                //     const defaultSalesEmployee = dataResult.value.find(val => val.SalesEmployeeCode == -1)
                //     if (defaultSalesEmployee)
                //         setSelectedSalesEmployee({
                //             name: defaultSalesEmployee?.SalesEmployeeName,
                //             code: defaultSalesEmployee?.SalesEmployeeCode
                //         })
                //     console.log("Sales Employee nè: ", dataResult.value);
                // };

                // Set giá trị mặc định của sales employee
                const defaultSalesEmployee = data?.salesEmployee?.find(val => val.SalesEmployeeCode == -1)
                if (defaultSalesEmployee)
                    setSelectedSalesEmployee({
                        name: defaultSalesEmployee?.SalesEmployeeName,
                        code: defaultSalesEmployee?.SalesEmployeeCode
                    })



                // Hàm async 4: Lấy danh sách employee
                // const fetchEmployee = async () => {
                //     const queryProps = {};
                //     const dataResult = await employeeApi.getAllEmployee(queryProps);
                //     setEmployeeList(dataResult.value);
                //     setEmployeeListOption(dataResult.value?.map(val => ({ name: `${val.FirstName ?? ''} ${val.MiddleName ?? ''} ${val.LastName ?? ''}`.trim(), code: val.EmployeeID })));
                //     console.log("Employee nè: ", dataResult.value);
                // };

                // const fetchAdditionalExpenses = async () => {
                //     const dataResult = await salesApi.getAdditionalExpenses();
                //     setFreightChargeData(dataResult.value);
                //     setFreightChargeOptions(dataResult.value?.map(item => ({
                //         Name: item.Name,
                //         ExpenseCode: item.ExpensCode
                //     })));
                //     console.log("Freight: ", dataResult.value?.map(item => ({
                //         name: item.Name,
                //         code: item.ExpensCode
                //     })));
                // };

                // const fetchVatGroups = async () => {
                //     const queryProps = {};
                //     const res = await fetch('/api/purchase/get-input-vat-list', {
                //         method: 'GET',
                //         headers: {
                //             'Content-Type': 'application/json',
                //         },
                //         credentials: 'include'
                //     });
                //     const dataResult = await res.json();
                //     console.log("Vat Group: ", dataResult.value);
                //     setVatGroups(dataResult.value);
                //     // setFreightChargeOptions(dataResult.value?.map(item => ({
                //     //     Name: item.Name,
                //     //     ExpenseCode: item.ExpensCode
                //     // })));
                //     // console.log("Freight: ", dataResult.value?.map(item => ({
                //     //     name: item.Name,
                //     //     code: item.ExpensCode
                //     // })));
                // };

                const fetchPaymentTerm = async () => {
                    const queryProps = {};

                    const res = await fetch('/api/sales/get-payment-terms', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include',
                        body: JSON.stringify(queryProps),
                    });

                    const dataResult = await res.json();

                    // const dataResult = await salesApi.getAllPaymentTerm();
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
                    fetchCurrentDelivery(),
                    // fetchCustomer(),
                    // fetchItems(),
                    fetchWarehouses(),
                    // fetchSalesEmployee(),
                    // fetchEmployee(),
                    // fetchAdditionalExpenses(),
                    // fetchVatGroups(),
                    fetchPaymentTerm()
                ]);

            } catch (error) {
                console.error("Error fetching data: ", error);
            } finally {
                console.log("Done!")
                setDataLoaded(true);
            }
        };
        setCurrencyOptions([
            { name: 'Local Currency', code: 'localCurrency', currency: companyInfo?.LocalCurrency },
            { name: 'System Currency', code: 'systemCurrency', currency: companyInfo?.SystemCurrency },
            { name: 'BP Currency', code: 'bpCurrency', currency: null }
        ])
        fetchData();
    }, []);

    useEffect(() => {
        if (copyDocument) {
            let newContentData = [];
            let newFreightRows = [];

            const copyLines = copyDocument.DocumentLines;
            const freightLines = copyDocument.DocumentAdditionalExpenses;

            if (copyLines.length > 0) {
                newContentData = copyLines.map(({ LineNum, DocEntry, Status, WarehouseCode, ...rest }) => {
                    const currentItem = itemList.find(item => item.ItemCode == rest.ItemCode);
                    return {
                        id: nanoid(6),
                        Item: currentItem,
                        // BaseDocType: DocumentType,
                        // BaseDocLine: LineNum,
                        // BaseDocEntry: DocEntry,
                        // BaseDocumentReferenceL: DocEntry,
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

            if (freightLines.length > 0) {
                newFreightRows = freightLines.map(({ LineNum, DocEntry, LineStatus, BaseOpenQuantity, ...rest }) => {
                    return {
                        id: nanoid(6),
                        // BaseDocType: DocumentType,
                        // BaseDocLine: LineNum,
                        // BaseDocEntry: DocEntry,
                        ...rest
                    };
                });
            }

            if (newContentData.length > 0) {
                const lastItem = contentData[contentData.length - 1];
                setContentData([...newContentData, lastItem]);
            }

            if (newFreightRows.length) {
                const lastItem = generalInfo.FreightCharges[generalInfo.FreightCharges.length - 1];
                setGeneralInfo(prev => ({
                    ...prev,
                    FreightCharges: [...newFreightRows, lastItem]
                }));
            }

        }
    }, [copyDocument])

    useEffect(() => {
        console.log("Quá là mệt mỏi thiệt lun á chài: ", contentData)
        summarizeTotal();
    }, [contentData, generalInfo?.RoundingAmount, generalInfo?.DiscountPercent]);

    useEffect(() => {
        const handleWindowClose = (e) => {
            if (contentData.length > 1) {
                const confirmationMessage = tM("unsave");
                e.returnValue = confirmationMessage; // Standard for most browsers
                return confirmationMessage; // For some browsers
            }
        };

        const handleRouteChange = (url) => {
            console.log("Sao nó khum có vị 2: ", contentData);
            if (contentData.length > 1 && !confirm(tM("unsave"))) {
                router.events.emit('routeChangeError');
                throw 'Abort route change. Please ignore this error.';
            }
        };

        window.addEventListener('beforeunload', handleWindowClose);
        router.events.on('routeChangeStart', handleRouteChange);

        return () => {
            window.removeEventListener('beforeunload', handleWindowClose);
            router.events.off('routeChangeStart', handleRouteChange);
        };
    }, [contentData]);

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

    const ItemGLAccountCodeTemplate = (product, row) => {
        return <div className="p-inputtext p-inputtext-sm p-component w-full p-0 flex justify-between items-center border-r-0">
            <div className="p-2">
                <p className={`truncate`}>{product?.AccountCode}</p>
            </div>
            <Button icon="pi pi-list" onClick={() => { setSelectedItemRow({ ...product, rowIndex: row.rowIndex }); setGLAccountSelectModalOpen(true) }} />
        </div>;
    };

    const ItemGLAccountNameTemplate = (product) => {
        return <div className="w-full p-inputtext p-inputtext-sm p-component p-inline-message p-inline-message-info block align-baseline min-h-[33.47px]">
            {/* <span className="h-[21px]">&nbsp;{product?.AccountCode}</span> */}
            <p className={`truncate`}>&nbsp;{product?.AccountName}</p>
        </div>;
    }

    const ItemDescriptionTemplate = (product, row) => {
        const handleEditItemDescription = (e) => {
            setContentData(prev => (prev.map(content => {
                if (content.id == product?.id) {
                    return { ...content, ItemDescription: e.target.value }
                } else return content
            })));
            if (row.rowIndex == contentData?.length - 1) {
                handleAddNewContentRow();
            }
        }
        return <InputText className="w-full p-inputtext-sm" value={product?.ItemDescription} onChange={handleEditItemDescription} />;
    };

    const ItemQuantityTemplate = (product) => {
        const handleEditItemQuantity = (e) => {
            // Nếu là item thì tính theo công thức,
            // Nếu là service thì ghi nhận thông tin.
            if (selectedDocType?.code == 'dDocument_Items') {
                setContentData(prev => (prev.map(content => {
                    if (content.id == product?.id) {
                        const currentTotalPrice = content.UnitPrice * e.target.value * (1 - content.DiscountPercent / 100);
                        const taxAmount = currentTotalPrice * content.TaxRate / 100;
                        const currentGrossTotalPrice = currentTotalPrice + taxAmount;
                        return { ...content, Quantity: e.target.value, Total: currentTotalPrice, TaxAmount: taxAmount, GrossTotal: currentGrossTotalPrice }
                    } else return content;
                })));
            } else {
                setContentData(prev => (prev.map(content => {
                    if (content.id == product?.id) {
                        return { ...content, Quantity: e.target.value }
                    } else return content;
                })));
            }

        }
        return <InputNumber inputId="integeronly" className="w-full text-right p-inputtext-sm" min={1} showButtons value={product?.Quantity} onValueChange={handleEditItemQuantity} />
    };

    const ItemDiscountPercentTemplate = (product) => {
        const handleEditItemDiscountPercent = (e) => {
            const currentDiscount = parseFloat(e.target.value.replace('%', '').trim());
            setContentData(prev => (prev.map(content => {
                if (content.id == product?.id) {
                    const currentTotalPrice = selectedDocType?.code == 'dDocument_Items' ? content.Quantity * content.UnitPrice * (1 - currentDiscount / 100) : content.UnitPrice * (1 - currentDiscount / 100);
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

    const RowNumberTemplate = (product, row) => {
        return <>&nbsp;{(Number(row.rowIndex) + 1) || "1"}</>;
    }

    const ItemRateTemplate = (product) => {
        return <div className="w-full p-inputtext p-inputtext-sm p-component block align-baseline min-h-[33.47px]"><span className="h-[21px]">&nbsp;{product.Rate && (formatNumberWithComma(product.Rate))}</span></div>
            ;
    }

    const ItemTaxCodeTemplate = (product, row) => {
        return <div className="p-inputtext p-inputtext-sm p-component w-full p-0 flex justify-between items-center border-r-0">
            <div className="p-2 ">
                <p className={`truncate`}>{product?.TaxCode}</p>
            </div>
            <Button icon="pi pi-list" onClick={() => { setSelectedItemRow({ ...product, rowIndex: row.rowIndex }); setTaxCodeSelectModalOpen(true) }} />
        </div>;
    }

    const ItemTaxRateTemplate = (product) => {
        return <div className="w-full p-inputtext p-inputtext-sm p-component p-inline-message p-inline-message-info block align-baseline"><span className="h-[21px]">&nbsp;{product.TaxRate && (product.TaxRate + '%')}</span></div>
            ;
    }

    const ItemTaxAmountTemplate = (product) => {
        return <div className="w-full p-inputtext p-inputtext-sm p-component p-inline-message p-inline-message-info block align-baseline min-h-[33.47px]"><span className="h-[21px]">&nbsp;{product.TaxAmount && (formatNumberWithComma(product.TaxAmount) + ' ' + generalInfo?.DocCurrency?.Code)}</span></div>
            ;
    }

    const ItemGrossTotalTemplate = (product) => {
        return <div className="w-full p-inputtext p-inputtext-sm p-component p-inline-message p-inline-message-info block align-baseline min-h-[33.47px]"><span className="h-[21px]">&nbsp;{product.GrossTotal && (formatNumberWithComma(product.GrossTotal) + ' ' + generalInfo?.DocCurrency?.Code)}</span></div>
            ;
    }

    const ItemUnitPriceTemplate = (product) => {
        const handleEditItemUnitPrice = (e) => {
            setContentData(prev => (prev.map(content => {
                if (content.id == product?.id) {
                    const currentTotalPrice = selectedDocType?.code == 'dDocument_Items' ? content.Quantity * e.target.value * (1 - content.DiscountPercent / 100) : e.target.value * (1 - content.DiscountPercent / 100);
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

    const ItemTotalTemplate = (product, row) => {
        // const handleEditItemTotal = (e) => {
        //     setContentData(prev => (prev.map(content => {

        //         if (content.id == product?.id)
        //             return { ...content, Total: e.target.value }
        //         else return content
        //     })));
        // }
        const handleEditItemTotal = (e) => {
            const newTotal = e.target.value;

            setContentData(prev => (prev.map(content => {
                if (content.id === product?.id) {
                    const unitPrice = content.UnitPrice;
                    let calculatedTotal;
                    let discountPercent;

                    if (selectedDocType?.code === 'dDocument_Items') {
                        const quantity = content.Quantity;
                        calculatedTotal = quantity * unitPrice;
                        discountPercent = (calculatedTotal - newTotal) / calculatedTotal * 100;
                    } else {
                        calculatedTotal = unitPrice;
                        discountPercent = (calculatedTotal - newTotal) / calculatedTotal * 100;
                    }

                    if (discountPercent < 0 || discountPercent > 100) {
                        console.log("Discount percent: ", discountPercent);
                        console.log("Event nè: ", e.target);
                        toast(tM("checkInput"))
                        // Keep the input focused and data unchanged
                        return { ...content };
                    } else {
                        const currentTotalPrice = newTotal;
                        const taxAmount = currentTotalPrice * content.TaxRate / 100;
                        const currentGrossTotalPrice = currentTotalPrice + taxAmount;
                        return {
                            ...content,
                            Total: newTotal,
                            DiscountPercent: discountPercent,
                            UnitPrice: selectedDocType?.code === 'dDocument_Items' ? content.UnitPrice : newTotal,
                            TaxAmount: taxAmount,
                            GrossTotal: currentGrossTotalPrice
                        };
                    }
                } else {
                    return content;
                }
            })));

            if (row.rowIndex == contentData?.length - 1) {
                handleAddNewContentRow();
            }
        };
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
                    filter
                    value={product?.Warehouse}
                    options={warehouseOptions}
                    onChange={handleEditItemWarehouse}
                    optionLabel="name"
                    placeholder={t("selectWarehouse")}
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

        const isDisabled = ManageByQuantity || (!ManageByQuantity && !ManageBatchNumbers && !ManageSerialNumbers);
        // console.log("Test 4: ", isDisabled);

        const handleChangeSelections = (e) => {
            console.log("Change batch, serial 1: ", e.value);
            const newCodes = e.value.map(val => val.code);
            console.log("Change batch, serial 2: ", newCodes);

            if (ManageBatchNumbers) {
                const newArray = contentData.map((item, idx) => {
                    if (idx == row.rowIndex) {
                        return { ...item, BatchNumbers: item.BatchNumbers.filter(b => newCodes.includes(b.BatchNumber)) }
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
                setContentData(newArray)
            }
        }

        const currentOptions = ManageBatchNumbers ? contentData[row.rowIndex]?.BatchNumbers?.map(batch => ({ name: `${batch.BatchNumber} (${formatNumberWithComma(batch.Quantity)})`, code: batch.BatchNumber })) : contentData[row.rowIndex]?.SerialNumbers?.map(serial => ({ name: serial.IntrSerial, code: serial.IntrSerial }))

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
                    return { ...content, U_Grade: e.target.value }
                else return content;
            })));
        }
        return (
            <>
                <Dropdown
                    showClear
                    filter
                    value={product?.U_Grade}
                    options={gradeOptions}
                    onChange={handleEditItemGrade}
                    optionLabel="name"
                    placeholder={t("selectGrade")}
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
                    placeholder={t("selectSystem")}
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
        return <InputNumber inputId="integeronly" className="w-full text-right p-inputtext-sm" min={1} showButtons value={product?.U_StandardDays} onValueChange={handleEditStandardDays} />
    };

    const UoMNameTemplate = (product) => {
        const handleEditUoMName = (e) => {
            setContentData(prev => (prev.map(content => {
                if (content.id == product?.id) {
                    return { ...content, UoMName: e.target.value }
                } else return content;
            })));
        }
        return <InputText inlinestyle={{ textAlign: 'right' }} className="w-full p-inputtext-sm" value={product?.UoMName} onChange={handleEditUoMName} />;
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
                    return { ...content, U_APInvoiceNo: e.target.value }
                } else return content;
            })));
        }
        return <InputText inputstyle={{ textAlign: 'right' }} className="w-full p-inputtext-sm" value={product?.U_APInvoiceNo} onChange={handleEditAPInvoiceENo} />;
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
                            placeholder={t("selectExpense")}
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
                <p className={`truncate`}>{product?.TaxCode}</p>
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

    const TableColumnOptionTemplate = (option) => {
        return (
            <>
                <div className="flex align-items-center gap-2">
                    <div>{option?.header}</div>
                </div>
            </>
        );
    }

    const addressModalFooter = () => {
        return (
            <div>
                <Button label={tG("cancel")}  icon="pi pi-times" onClick={() => setWhichEditAddressModalOpen(null)} className="p-button-text" />
                <Button label={tG("yes")} icon="pi pi-check" onClick={handleConfirmAddressModal} autoFocus />
            </div>
        )
    };

    const contentColumns = useMemo(
        () => [
            {
                header: '#',
                field: 'No.',
                className: 'text-center',
                minWidth: '3rem',
                body: RowNumberTemplate
            },
            {
                header: capitalizeWords(t("itemNo")),
                field: 'ItemNo',
                className: 'text-center',
                minWidth: '12rem',
                body: ItemNoTemplate
            },
            {
                header: capitalizeWords(t("itemDescription")),
                field: 'ItemDescription',
                className: 'text-center',
                minWidth: '12rem',
                body: ItemDescriptionTemplate
            },
            {
                header: capitalizeWords(t("quantity")),
                field: 'Quantity',
                className: 'text-center',
                minWidth: '14rem',
                body: ItemQuantityTemplate
            },
            {
                header: capitalizeWords(t("unitPrice")),
                field: 'UnitPrice',
                className: 'text-right',
                minWidth: '14rem',
                body: ItemUnitPriceTemplate
            },
            {
                header: capitalizeWords(t("discountPercent")),
                field: 'DiscountPercent',
                className: 'text-right',
                minWidth: '14rem',
                body: ItemDiscountPercentTemplate
            },
            {
                header: capitalizeWords(t("rate")),
                field: 'Rate',
                className: 'text-right',
                minWidth: '14rem',
                body: ItemRateTemplate
            },
            {
                header: capitalizeWords(t("totalAfterDiscount")),
                field: 'Total',
                className: 'text-right',
                minWidth: '14rem',
                body: ItemTotalTemplate
            },
            {
                header: capitalizeWords(t("taxCode")),
                className: 'text-right',
                minWidth: '14rem',
                body: ItemTaxCodeTemplate
            },
            {
                header: capitalizeWords(t("taxRate")),
                className: 'text-right',
                minWidth: '14rem',
                body: ItemTaxRateTemplate
            },
            {
                header: capitalizeWords(t("taxAmount")),
                className: 'text-right',
                minWidth: '14rem',
                body: ItemTaxAmountTemplate
            },
            {
                header: capitalizeWords(t("grossTotalAfterDiscount")),
                className: 'text-right',
                minWidth: '14rem',
                body: ItemGrossTotalTemplate
            },
            {
                header: capitalizeWords(t("warehouse")),
                field: 'Warehouse',
                className: 'text-right',
                minWidth: '14rem',
                body: ItemWarehouseTemplate
            },
            {
                header: capitalizeWords(t("batchSerialNumber")),
                className: 'text-left',
                minWidth: '14rem',
                body: ItemBatchSerialTemplate
            },
            {
                header: capitalizeWords(t("uomName")),
                field: 'UoMName',
                className: 'text-right',
                minWidth: '14rem',
                body: UoMNameTemplate
            },
            {
                header: capitalizeWords(t("system")),
                field: 'U_System',
                className: 'text-right',
                minWidth: '14rem',
                body: ItemSystemTemplate
            },
            {
                header: capitalizeWords(t("actualDays")),
                field: 'U_ActualDays',
                className: 'text-center',
                minWidth: '14rem',
                body: ItemActualDaysTemplate
            },
            {
                header: capitalizeWords(t("standardDays")),
                field: 'U_StandardDays',
                className: 'text-center',
                minWidth: '14rem',
                body: ItemStandardDaysTemplate
            },
            {
                header: capitalizeWords(t("grade")),
                field: 'U_Grade',
                className: 'text-right',
                minWidth: '14rem',
                body: ItemGradeTemplate
            },
            {
                header: capitalizeWords(t("remark")),
                field: 'U_Remark',
                className: 'text-right',
                minWidth: '14rem',
                body: ItemRemarkTemplate
            },
            {
                header: capitalizeWords(t("itemServiceDetail")),
                field: 'U_Detail',
                className: 'text-right',
                minWidth: '14rem',
                body: ItemDetailTemplate
            },
            {
                header: capitalizeWords(t("apInvoiceENo")),
                field: 'U_APInvoiceNo',
                className: 'text-right',
                minWidth: '14rem',
                body: APInvoiceENoTemplate
            },
        ],
        [itemList, warehouseOptions, contentData, locale]
    );

    const serviceColumns = useMemo(
        () => [
            {
                header: '#',
                field: 'No.',
                className: 'text-center',
                minWidth: '3rem',
                body: RowNumberTemplate
            },
            {
                header: capitalizeWords(t("description")),
                field: 'ItemDescription',
                className: 'text-center',
                minWidth: '12rem',
                body: ItemDescriptionTemplate
            },
            {
                header: capitalizeWords(t("quantity")),
                field: 'Quantity',
                className: 'text-center',
                minWidth: '14rem',
                body: ItemQuantityTemplate
            },
            {
                header: capitalizeWords(t("unitPrice")),
                field: 'UnitPrice',
                className: 'text-right',
                minWidth: '14rem',
                body: ItemUnitPriceTemplate
            },
            {
                header: capitalizeWords(t("glAccountCode")),
                field: 'GLAccount',
                className: 'text-right',
                minWidth: '14rem',
                body: ItemGLAccountCodeTemplate
            },
            {
                header: capitalizeWords(t("glAccountName")),
                field: 'GLAccountName',
                className: 'text-right',
                minWidth: '14rem',
                body: ItemGLAccountNameTemplate
            },
            {
                header: capitalizeWords(t("discountPercent")),
                field: 'DiscountPercent',
                className: 'text-right',
                minWidth: '14rem',
                body: ItemDiscountPercentTemplate
            },
            {
                header: capitalizeWords(t("totalAfterDiscount")),
                field: 'Total',
                className: 'text-right',
                minWidth: '14rem',
                body: ItemTotalTemplate
            },
            {
                header: capitalizeWords(t("taxCode")),
                className: 'text-right',
                minWidth: '14rem',
                body: ItemTaxCodeTemplate
            },
            {
                header: capitalizeWords(t("taxRate")),
                className: 'text-right',
                minWidth: '14rem',
                body: ItemTaxRateTemplate
            },
            {
                header: capitalizeWords(t("taxAmount")),
                className: 'text-right',
                minWidth: '14rem',
                body: ItemTaxAmountTemplate
            },
            {
                header: capitalizeWords(t("grossTotalAfterDiscount")),
                className: 'text-right',
                minWidth: '14rem',
                body: ItemGrossTotalTemplate
            },
            {
                header: capitalizeWords(t("uomName")),
                field: 'UoMName',
                className: 'text-right',
                minWidth: '14rem',
                body: UoMNameTemplate
            },
            {
                header: capitalizeWords(t("system")),
                field: 'U_System',
                className: 'text-right',
                minWidth: '14rem',
                body: ItemSystemTemplate
            },
            {
                header: capitalizeWords(t("actualDays")),
                field: 'U_ActualDays',
                className: 'text-center',
                minWidth: '14rem',
                body: ItemActualDaysTemplate
            },
            {
                header: capitalizeWords(t("standardDays")),
                field: 'U_StandardDays',
                className: 'text-center',
                minWidth: '14rem',
                body: ItemStandardDaysTemplate
            },
            {
                header: capitalizeWords(t("grade")),
                field: 'U_Grade',
                className: 'text-right',
                minWidth: '14rem',
                body: ItemGradeTemplate
            },
            {
                header: capitalizeWords(t("remark")),
                field: 'U_Remark',
                className: 'text-right',
                minWidth: '14rem',
                body: ItemRemarkTemplate
            },
            {
                header: capitalizeWords(t("itemServiceDetail")),
                field: 'U_Detail',
                className: 'text-right',
                minWidth: '14rem',
                body: ItemDetailTemplate
            },
            {
                header: capitalizeWords(t("apInvoiceENo")),
                field: 'U_APInvoiceNo',
                className: 'text-right',
                minWidth: '14rem',
                body: APInvoiceENoTemplate
            },
        ],
        [contentData, locale]
    );

    const freightChargesColumns = useMemo(
        () => [
            {
                header: '#',
                field: 'No.',
                className: 'text-center',
                minWidth: '3rem',
                body: RowNumberTemplate
            },
            {
                header: capitalizeWords(t("freightName")),
                field: 'Name',
                className: 'text-left',
                minWidth: '12rem',
                body: FreightNameTemplate
            },
            {
                header: capitalizeWords(t("remark")),
                field: 'Remarks',
                className: 'text-left',
                minWidth: '12rem',
                body: FreightRemarkTemplate
            },
            {
                header: capitalizeWords(t("taxCode")),
                field: 'TaxCode',
                className: 'text-center',
                minWidth: '14rem',
                body: FreightTaxCodeTemplate
            },
            {
                header: capitalizeWords(t("taxRate")),
                className: 'text-right',
                minWidth: '14rem',
                body: FreightTaxRateTemplate
            },
            {
                header: capitalizeWords(t("taxAmount")),
                field: 'TaxAmount',
                className: 'text-right',
                minWidth: '14rem'
            },
            {
                header: capitalizeWords(t("totalTaxAmount")),
                field: 'TotalTaxAmount',
                className: 'text-right',
                minWidth: '14rem'
            },
            {
                header: capitalizeWords(t("netAmount")),
                field: 'NetAmount',
                className: 'text-right',
                minWidth: '14rem',
                body: FreightNetAmountTemplate
            },
            {
                header: capitalizeWords(t("grossAmount")),
                field: 'GrossAmount',
                className: 'text-right',
                minWidth: '14rem',
                body: FreightGrossAmountTemplate
            },
        ],
        [freightChargeOptions, generalInfo, locale]
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
        console.log("Customer: ", selectedValue);
        setSelectedCustomer(selectedValue);
        // Contact person
        const currentContactPersonList = selectedValue?.ContactEmployees;
        const currentContactPersonName = selectedValue?.ContactPerson;

        // Check default currency xem có giống với local currency khum
        const defaultCurrency = selectedValue?.DefaultCurrency;

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
            setContactPersonListOptions(currentContactPersonList.map(item => {
                const names = [item.FirstName, item.MiddleName, item.LastName];
                const fullName = names.filter(name => name !== null && name !== undefined && name !== '').join(' ');
                return { name: item.Name + ' - ' + fullName, code: item.InternalCode }
            }))
            setSelectedContactPerson({ name: currentContactPerson.Name, code: currentContactPerson.InternalCode });
        }

        const currentPaymentTerm = paymentTermOptions.find(p => p.code == selectedValue?.PayTermsGrpCode)
        // console.log("Current Payment Term: ", currentPaymentTerm);
        setSelectedPaymentTerm(currentPaymentTerm);
        setPaymentMethodOptions(selectedValue.BPPaymentMethods);
        // console.log("Lại bị gì nữa: ", selectedValue.BPPaymentMethods[0]);

        // Chỗ này phải lấy vat mặc định cho purchase
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

        setGeneralInfo(prev => ({
            ...prev,
            JournalRemark: 'Delivery - ' + selectedValue.CardCode,
            TaxCode: customerTaxCode,
            TaxRate: customerTaxRate,
            FederalTaxID: selectedValue.FederalTaxID
        }));
        setSelectedPaymentMethod(selectedValue.BPPaymentMethods[0] || null);
    }

    const handleAddNewContentRow = () => {
        // Validate các trường thông tin, xem đầy đủ chưa
        const lastDataItemIndex = contentData.length - 1;
        if (selectedDocType?.code == 'dDocument_Items') {
            if (!contentData[lastDataItemIndex].ItemCode) {
                setContentData(prev => ([...prev, {
                    id: nanoid(6),
                    ItemCode: '',
                    Item: {},
                    ItemDescription: '',
                    Quantity: '',
                    UnitPrice: null,
                    Currency: null,
                    AccountCode: '',
                    AccountName: '',
                    DiscountPercent: '',
                    ManageBatchNumbers: false,
                    ManageByQuantity: false,
                    ManageSerialNumbers: false,
                    BatchNumbers: [],
                    SerialNumbers: [],
                    TaxCode: generalInfo.TaxCode,
                    TaxRate: generalInfo.TaxRate,
                    TaxAmount: 0,
                    Total: null,
                    GrossTotal: 0,
                    Warehouse: '',
                    UoMName: '',
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
        } else {
            setContentData(prev => ([...prev, {
                id: nanoid(6),
                ItemCode: '',
                Item: {},
                ItemDescription: '',
                Quantity: '',
                UnitPrice: null,
                Currency: null,
                AccountCode: '',
                AccountName: '',
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
                UoMName: '',
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
    //     if (currentType?.code == 'dDocument_Items') {
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
    //                 UoMName: '',
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
    //     setSelectedDocType(currentType);
    // }

    const acceptChangeItemServiceType = (currentType) => {
        setContentData(prev => (
            [{
                id: nanoid(6),
                ItemCode: '',
                Item: {},
                ItemDescription: '',
                Quantity: '',
                UnitPrice: null,
                Currency: null,
                AccountCode: '',
                AccountName: '',
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
                UoMName: '',
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
            }]
        ));
        setSelectedDocType(currentType);
    }

    const handleChangeItemServiceType = (e) => {
        const currentType = e.value;
        if (contentData.length > 1) {
            setItemServiceWarningVisible(true)
        } else {
            acceptChangeItemServiceType(currentType)
        }
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
                const vatCode = item.PurchaseVATGroup || generalInfo.TaxCode;
                const vatRate = vatGroups.find(vat => vat.Code == vatCode)?.VatGroups_Lines[0]?.Rate || generalInfo.TaxRate;


                return {
                    id: nanoid(6),
                    ItemCode: item.ItemCode,
                    Item: item,
                    ItemDescription: item.ItemName,
                    Quantity: 1,
                    UnitPrice: item.ItemPrices[0]?.Price,
                    Currency: item.ItemPrices[0]?.Currency,
                    AccountCode: '',
                    AccountName: '',
                    DiscountPercent: 0,
                    ManageBatchNumbers: item.ManageBatchNumbers === 'tYES',
                    ManageByQuantity: item.ManageByQuantity === 'tYES',
                    ManageSerialNumbers: item.ManageSerialNumbers === 'tYES',
                    BatchNumbers: [],
                    SerialNumbers: [],
                    TaxCode: vatCode,
                    TaxRate: vatRate,
                    TaxAmount: vatRate * item.ItemPrices[0]?.Price * 1 / 100,
                    Total: item.ItemPrices[0]?.Price * 1,
                    GrossTotal: (item.ItemPrices[0]?.Price * 1) + (vatRate * item.ItemPrices[0]?.Price * 1 / 100),
                    Warehouse: warehouseCode
                        ? warehouseOptions.find(warehouse => warehouse.code === warehouseCode)
                        : null,
                    UoMName: item.InventoryUOM || '',
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
        handleAddNewContentRow();
    };

    const handleSetAccount = (account) => {
        console.log("Ra account: ", account);
        const selectedItemRowIndex = selectedItemRow.rowIndex;
        const newArray = contentData.map((item, idx) => {
            if (idx == selectedItemRowIndex) {
                if (account)
                    return { ...item, AccountCode: account.AcctCode, AccountName: account.AcctName }
                else
                    return { ...item, AccountCode: '', AccountName: '' }
            } else return item
        });
        console.log("Ra khum vị trời: ", newArray)
        setContentData(newArray);
    }

    const handleSetTaxCode = (taxCode) => {
        if (selectedFreightChargeRow) {
            const selectedFreightRowIndex = selectedFreightChargeRow.rowIndex;
            const newArray = generalInfo.FreightCharges.map((item, idx) => {
                if (idx == selectedFreightRowIndex) {
                    console.log("New array: ", newArray);
                    return { ...item, TaxCode: taxCode.Code, TaxRate: taxCode.Rate }
                } else return item
            });
            setGeneralInfo(prev => ({ ...prev, FreightCharges: newArray }))
        } else {
            const selectedItemRowIndex = selectedItemRow.rowIndex;
            const newArray = contentData.map((item, idx) => {
                if (idx == selectedItemRowIndex) {
                    const currentTotalPrice = item.UnitPrice * item.Quantity * (1 - item.DiscountPercent / 100);
                    const taxAmount = currentTotalPrice * taxCode.VatGroups_Lines[0]?.Rate / 100;
                    const currentGrossTotalPrice = currentTotalPrice + taxAmount;
                    return { ...item, TaxCode: taxCode.Code, TaxRate: taxCode.VatGroups_Lines[0]?.Rate, TaxAmount: taxAmount, GrossTotal: currentGrossTotalPrice }
                } else return item
            });
            setContentData(newArray);
        }
        // console.log("Test tax code ", taxCode);
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
            AccountCode: '',
            AccountName: '',
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
            UoMName: '',
            U_DescriptionEn: '',
            U_DescriptionVi: '',
            U_System: '',
            U_ActualDays: '',
            U_StandardDays: '',
            U_Grade: '',
            U_Remark: '',
            U_Detail: '',
            U_APInvoiceNo: '',
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
        toast.success(tM("successfulDeleted"));
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
            BaseDocType: -1,
            BaseDocEntry: null,
            BaseDocLine: null
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
        toast.success(tM("successfulDeleted"));
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
                                BaseType: DocumentType,
                                BaseLine: LineNum,
                                BaseEntry: DocEntry,
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

    const onChangeSelectAllColumn = () => {
        if (whichColumnTableModalOpen) {
            switch (whichColumnTableModalOpen) {
                case "item":
                    setVisibleItemColumns(contentColumns);

                    break;
                case "service":
                    setVisibleServiceColumns(serviceColumns);
                    break;
                case "freight":
                    setVisibleFreightColumns(freightChargesColumns);
                    break;

                default:
                    break;
            }
        }
    }

    const onTableColumnToggle = (e) => {
        const selectedColumns = e.value;
        let orderedSelectedColumns;

        switch (whichColumnTableModalOpen) {
            case "item":
                orderedSelectedColumns = contentColumns.filter((col) => selectedColumns.some((sCol) => sCol.field === col.field));
                setVisibleItemColumns(orderedSelectedColumns);

                break;
            case "service":
                orderedSelectedColumns = serviceColumns.filter((col) => selectedColumns.some((sCol) => sCol.field === col.field));
                setVisibleServiceColumns(orderedSelectedColumns);
                break;
            case "freight":
                orderedSelectedColumns = freightChargesColumns.filter((col) => selectedColumns.some((sCol) => sCol.field === col.field));
                setVisibleFreightColumns(orderedSelectedColumns);
                break;

            default:
                break;
        }
    }

    const contentTHeader = (
        <div className="flex justify-between items-center">
            <h5 className="mb-0">{selectedDocType?.code == 'dDocument_Items' ? capitalizeWords(t("itemTableList")) : capitalizeWords(t("serviceTableList"))}</h5>
            <div className="flex gap-2">
                <Button
                    type="button"
                    icon="pi pi-copy"
                    disabled={!selectedContentRows || selectedContentRows?.length < 1}
                    rounded
                    outlined
                    data-pr-tooltip={tG("copy")}
                    tooltip={tG("copy")}
                    tooltipOptions={{ position: 'bottom', mouseTrack: true, mouseTrackTop: 15 }}
                    onClick={handleCopyItems}
                />
                <button
                    type="button"
                    className="paste-btn p-button p-component p-button-icon-only p-button-outlined p-button-rounded"
                    data-pr-tooltip={tG("paste")}
                    tooltip={tG("paste")}
                    disabled={(clipboard?.length == 0) || (selectedContentRows?.length > 1)}
                    onClick={handlePasteItems}
                >
                    <Icon icon="icons8:paste" width="1.5rem" height="1.5rem" />
                </button>
                <Tooltip target=".paste-btn" mouseTrack position={'bottom'} mouseTrackTop={15} />
                <Button
                    type="button"
                    disabled={!selectedContentRows || selectedContentRows?.length < 1}
                    icon="pi pi-trash"
                    severity="danger"
                    rounded
                    outlined
                    data-pr-tooltip={tG("delete")}
                    tooltip={tG("delete")}
                    tooltipOptions={{ position: 'bottom', mouseTrack: true, mouseTrackTop: 15 }}
                    onClick={handleDeleteItems}
                />
                <Button
                    type="button"
                    icon="pi pi-cog"
                    rounded
                    outlined
                    data-pr-tooltip={tG("setting")}
                    tooltip={tG("setting")}
                    tooltipOptions={{ position: 'bottom', mouseTrack: true, mouseTrackTop: 15 }}
                    onClick={() => setWhichColumnTableModalOpen(selectedDocType?.code == 'dDocument_Items' ? "item" : "service")}
                />
            </div>
        </div>
    )

    const freightChargeTHeader = (
        <div className="flex justify-between items-center">
            <h5 className="mb-0">{capitalizeWords(t("freightChargeTableList"))}</h5>
            <div className="flex gap-2">
                <Button type="button" disabled={!selectedFreightChargeRow || selectedFreightChargeRow?.length < 1} icon="pi pi-trash" severity="danger" rounded outlined data-pr-tooltip="Delete" tooltip="Delete" tooltipOptions={{ position: 'bottom', mouseTrack: true, mouseTrackTop: 15 }} onClick={handleDeleteFreights} />
                <Button
                    type="button"
                    icon="pi pi-cog"
                    rounded
                    outlined
                    data-pr-tooltip={tG("setting")}
                    tooltip={tG("setting")}
                    tooltipOptions={{ position: 'bottom', mouseTrack: true, mouseTrackTop: 15 }}
                    onClick={() => setWhichColumnTableModalOpen(selectedDocType?.code == 'dDocument_Items' ? "item" : "service")}
                />
                {/* <Button type="button" disabled={generalInfo?.FreightCharges?.filter(f => f.ExpenseCode).length < 1} icon="pi pi-sync" severity="danger" rounded outlined data-pr-tooltip="Delete" tooltip="Refresh" tooltipOptions={{ position: 'bottom', mouseTrack: true, mouseTrackTop: 15 }} onClick={handleRefresh} /> */}
            </div>
        </div>
    )

    const summaryHeaderTemplate = (options) => {
        const className = `${options.className} justify-content-space-between`;

        return (
            <div className={className}>
                <div className="flex align-items-center gap-2">
                    <span className="font-bold text-lg py-2">{t("totalSummary")}</span>
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
                    {capitalizeWords(tG("drag&drop"))}
                </span>
            </div>
        );
    };

    const handleConfirmAddressModal = () => {
        toast("Developing.");
        setWhichEditAddressModalOpen(null)
    }

    const handleBatchCreation = (selections) => {
        if (selectedItemRow.id) {
            setContentData(prev => (prev.map(item =>
                item.id === selectedItemRow.id ? { ...item, BatchNumbers: selections } : item)))
        }
    };

    const handleSerialCreation = (selections) => {
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
                    toast.error(`${tM("batchNumberRequired")} ${item.id}`);
                    return false;
                }
            }

            if (item.ManageSerialNumbers) {
                if (item.SerialNumbers.length === 0) {
                    toast.error(`${tM("serialNumberRequired")} ${item.id}`);
                    return false;
                }
            }
        }

        return true;
    };

    const uploadFileAttachments = async () => {
        const files = fileUploadRef.current.getFiles(); // Lấy danh sách file từ ref

        if (files.length > 0) {
            const formData = new FormData(); // Tạo FormData để đính kèm file

            files.forEach((file) => {
                formData.append('files', file); // Đính kèm từng file vào FormData
                formData.append('Override', 'Y'); // Thêm thuộc tính Override vào FormData
            });

            console.log("Form data 1: ", formData);

            try {
                // NextJS api handler không fix được bug tạo form data server-side

                // const response = await fetch('/api/purchase/upload-attachment', {
                //     // const response = await fetch('/api/file-upload', {
                //     method: 'POST',
                //     body: formData, // Gửi FormData trực tiếp mà không thiết lập Content-Type
                //     credentials: 'include' // Gửi cookies cùng với request
                // });

                const response = await fetch('https://localhost:50000/b1s/v1/Attachments2', {
                    // const response = await fetch('/api/file-upload', {
                    method: 'POST',
                    body: formData, // Gửi FormData trực tiếp mà không thiết lập Content-Type
                    credentials: 'include' // Gửi cookies cùng với request
                });

                if (!response.ok) { // Kiểm tra phản hồi có ok không
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const dataResult = await response.json(); // Chuyển đổi phản hồi thành JSON

                console.log('Upload thành công:', dataResult); // Log dữ liệu kết quả từ phản hồi
                toast.success('Upload thành công!'); // Hiển thị thông báo thành công
                return dataResult.AbsoluteEntry; // Trả về giá trị AbsoluteEntry
            } catch (error) { // Xử lý lỗi trong quá trình fetch
                console.error('Lỗi khi upload:', error); // Log lỗi ra console
                toast.error('Lỗi khi upload.'); // Hiển thị thông báo lỗi
                return false; // Trả về false khi gặp lỗi
            }
        }
        return null; // Trả về null nếu không có file nào để upload
    };

    const handleAddAndView = async () => {
        // Validate dữ liệu
        setIsPosting(true);
        console.log("Test: ", contentData);
        if (contentData.length == 1) {
            toast.error(tM("chooseItem"));
            setIsPosting(false);
            return;
        } else {
            const validation = validateContentData();
            if (!validation) { setIsPosting(false); return; }
        }

        let documentLines = [];
        let documentAdditionalExpenses = [];
        let currentContentData;
        if (selectedDocType?.code == 'dDocument_Items') {
            currentContentData = contentData.filter(f => f.ItemCode);
        } else {
            currentContentData = contentData.filter(f => f.ItemDescription || f.AccountCode || (f.Total !== undefined && f.Total !== null && f.Total !== 0));
        }
        console.log("Kết quả: ", currentContentData);

        if (currentContentData.length > 0) {
            documentLines = currentContentData.map(item => {
                const lineItem = {
                    ItemCode: item.ItemCode,
                    ItemDescription: item.ItemDescription,
                    Quantity: item.Quantity,
                    TaxCode: item.TaxCode,
                    BatchNumbers: item.BatchNumbers.length > 0 ? item.BatchNumbers.map(batch => ({
                        BatchNumber: batch.BatchNumber,
                        ItemCode: item.ItemCode,
                        Quantity: batch.Quantity,
                        ManufacturerSerialNumber: batch.BatchAttribute1,
                        InternalSerialNumber: batch.BatchAttribute2,
                        AddmisionDate: batch.AdmissionDate,
                        ManufacturingDate: batch.ManufacturingDate,
                        ExpiryDate: batch.ExpirationDate,
                        Location: batch.Location,
                        Notes: batch.Details
                    })) : [],
                    SerialNumbers: item.SerialNumbers.length > 0 ? item.SerialNumbers.map(batch => ({
                        InternalSerialNumber: batch.IntrSerial,
                        MfrSerialNo: serial.ManufacturerSerialNumber,
                        BatchID: serial.LotNumber,
                        ReceptionDate: serial.AdmissionDate,
                        ManufactureDate: serial.ManufacturingDate,
                        ExpiryDate: serial.ExpirationDate,
                        WarrantyStart: serial.MfrWarrantyStart,
                        WarrantyEnd: serial.MfrWarrantyEnd,
                        Location: serial.Location,
                        Notes: serial.Details,
                        Quantity: 1
                    })) : [],
                    UnitPrice: item.UnitPrice,
                    LineTotal: item.Total,
                    DiscountPercent: item.DiscountPercent,
                    MeasureUnit: item.UoMName,
                    BaseType: item.BaseType,
                    BaseEntry: item.BaseEntry,
                    BaseLine: item.BaseLine
                };

                if (selectedDocType?.code !== 'dDocument_Items') {
                    lineItem.AccountCode = item.AccountCode;
                }

                return lineItem;
            });
        }

        const currentFreightCharges = generalInfo.FreightCharges.filter(f => f.ExpenseCode);

        if (currentFreightCharges.length > 0) {
            documentAdditionalExpenses = currentFreightCharges.map(freight => {
                return {
                    ExpenseCode: freight.ExpenseCode,
                    Remarks: freight.Remarks,
                    TaxCode: freight.TaxCode,
                    LineTotal: freight.NetAmount,
                    LineGross: freight.GrossAmount
                }
            });
        }

        console.log("Test: ", documentAdditionalExpenses)

        const finalData = {
            DocType: selectedDocType?.code,
            CardCode: selectedCustomer.CardCode,
            NumAtCard: generalInfo.NumAtCard,
            ContactPersonCode: selectedContactPerson ? selectedContactPerson.code : '',
            SalesPersonCode: selectedSalesEmployee ? selectedSalesEmployee.code : '',
            DocDate: generalInfo.PostingDate,
            DocDueDate: generalInfo.DeliveryDate,
            TaxDate: generalInfo.DocumentDate,
            DiscountPercent: generalInfo.DiscountPercent,
            Rounding: generalInfo.Rounding ? "tYES" : "tNO",
            RoundingDiffAmount: generalInfo.RoundingAmount,
            Comments: generalInfo.Remark,
            JournalRemark: generalInfo.JournalRemark,
            DocumentLines: documentLines,
            DocumentAdditionalExpenses: documentAdditionalExpenses,
            PaymentGroupCode: selectedPaymentTerm?.code,
            CashDiscountDateOffset: generalInfo.CashDiscountDateOffset,
            CreateQRCodeFrom: generalInfo.CreateQRCodeFrom,
            FederalTaxID: generalInfo.FederalTaxID,
            ImportFileNum: generalInfo.ImportFileNum,
        };

        console.log("Submit: ", data);

        // Upload file attachments và lấy AbsoluteEntry
        const absoluteEntry = await uploadFileAttachments();

        if (absoluteEntry === false) {
            setIsPosting(false);
            return;
        }
        console.log("Plè 1: ", absoluteEntry);

        // Thêm AbsoluteEntry vào data
        finalData.AttachmentEntry = absoluteEntry;

        try {
            console.log("Plè 2: ", finalData);
            // Thực hiện createDelivery
            const res = await fetch('/api/sales/create-delivery', {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify(finalData)
            });
            const data = await res.json();
            console.log("Kết qỉa: ", data);
            if (data.DocEntry) {
                router.push("/sales/delivery/" + data.DocEntry)
            }

            // const res = await purchaseApi.createDelivery(JSON.stringify(data));
            toast.success(tM("successfulCreated"));
        } catch (error) {
            console.error("Lỗi khi tạo Delivery:", error);
            // const errorString = error?.response?.data?.error;
            // if (errorString) {
            // toast.error(errorString);
            // } else 
            toast.error(tM(errorOccured));

            // Nếu create goods receipt po không thành công, xóa attachment đã upload
            if (absoluteEntry) {
                try {
                    const res = await fetch('/api/purchase/delete-attachment', {
                        method: 'DELETE',
                        credentials: 'include'
                    });
                    // await purchaseApi.deleteAttachment({ AbsoluteEntry: absoluteEntry });
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

    useEffect(() => {
        setVisibleItemColumns(contentColumns);
        setVisibleServiceColumns(serviceColumns);
        setVisibleFreightColumns(freightChargesColumns);
    }, [contentColumns, serviceColumns, freightChargesColumns]);

    const chooseOptions = { icon: 'pi pi-fw pi-cloud-upload', iconOnly: true, className: 'custom-choose-btn p-button-rounded p-button-outlined' };
    const cancelOptions = { icon: 'pi pi-fw pi-times', iconOnly: true, className: 'custom-cancel-btn p-button-danger p-button-rounded p-button-outlined' };

    return (
        <>
            <Head>
                <title>{capitalizeWords(`${tG('create')} ${tG('delivery')}`)}</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            {
                !loading ?
                    (
                        <div>
                            <div ref={containerRef} className="flex flex-col min-h-[calc(100vh-9rem)] mb-[75px]">
                                <div className="w-full">
                                    <div className="card p-2 sm:p-4 relative">
                                        <h3>{tG('createDocument')}</h3>
                                        <Button className="absolute top-1 right-1 scale-75 sm:scale-50" icon="pi pi-question" rounded outlined size="small" severity="secondary" aria-label="Helper" onClick={() => setIsHelperOpen(true)} />

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
                                                        <Dropdown checkmark filter options={dataLoaded ? customerListOptions : []} value={customerListOptions?.find(val => val.code == selectedCustomer?.CardCode)}
                                                            valueTemplate={CustomerDropdownValueTemplate} itemTemplate={CustomerDropdownItemTemplate}
                                                            optionLabel="name" placeholder={t('selectCustomer')} onChange={(e) => handleChangeSelectedCustomer(e.value.code)} className="w-full" />
                                                        <Button icon="pi pi-list" onClick={() => { setCustomerSelectModalOpen(true) }} />
                                                    </div>
                                                </div>
                                                <div className="flex flex-column gap-2">
                                                    <label className='font-semibold'>{t('customerName')}</label>
                                                    <div className="w-full p-inputtext p-variant-filled p-component flex-1 !min-h-[42px]"><span className="h-[21px]">{selectedCustomer?.CardName || ""}</span></div>
                                                </div>
                                                <div className="flex flex-column gap-2">
                                                    <label className='font-semibold'>{t('contactPerson')}</label>
                                                    <Dropdown filter showClear checkmark options={contactPersonListOptions} value={selectedContactPerson} optionLabel="name"
                                                        placeholder={t("selectContactPerson")} onChange={(e) => setSelectedContactPerson(e.value)} className="w-full" />
                                                </div>
                                                <div className="flex flex-column gap-2">
                                                    <label className='font-semibold'>{t('customerRefNo')}</label>
                                                    <InputText value={generalInfo.NumAtCard} onChange={() => setGeneralInfo(prev => ({ ...prev, NumAtCard: e.target.value }))} variant="filled" aria-describedby="customer-ref-no" />
                                                </div>
                                                {/* <div className="flex flex-column gap-2">
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
                                        </div> */}
                                                <div className="flex flex-column gap-2">
                                                    <label className='font-semibold'>{t('postingDate')}</label>
                                                    <Calendar value={generalInfo.PostingDate} maxDate={new Date()} onChange={(e) => setGeneralInfo(prev => ({ ...prev, PostingDate: e.value }))} className="text-base" showIcon dateFormat="dd/mm/yy" />
                                                </div>
                                                <div className="flex flex-column gap-2">
                                                    <label className='font-semibold'>{t('dueDate')} <span className="text-red-700 font-semibold">*</span></label>
                                                    <Calendar value={generalInfo.DeliveryDate} onChange={(e) => setGeneralInfo(prev => ({ ...prev, DeliveryDate: e.value }))} className="text-base" showIcon dateFormat="dd/mm/yy" />
                                                </div>
                                                <div className="flex flex-column gap-2">
                                                    <label className='font-semibold'>{t('documentDate')}</label>
                                                    <Calendar value={generalInfo.DocumentDate} onChange={(e) => setGeneralInfo(prev => ({ ...prev, DocumentDate: e.value }))} className="text-base" showIcon dateFormat="dd/mm/yy" />
                                                </div>
                                            </div>

                                            <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 md:grid-cols-4 p-[7px] mt-2">
                                                <div className="flex flex-column gap-2">
                                                    <label className='font-semibold'>{capitalizeWords(t('remark'))}</label>
                                                    <InputTextarea autoResize rows={2} value={generalInfo?.Remark} onChange={(e) => setGeneralInfo(prev => ({ ...prev, Remark: e.value }))} />
                                                </div>
                                                <div className="flex flex-column gap-2">
                                                    <label className='font-semibold'>{capitalizeWords(t('buyer'))}</label>
                                                    <Dropdown filter value={selectedSalesEmployee} onChange={(e) => setSelectedSalesEmployee(e.value)} options={salesEmployeeListOptions} optionLabel="name"
                                                        placeholder={t("selectBuyer")} className="w-full" />

                                                </div>
                                                <div className="flex flex-column gap-2">
                                                    <label className='font-semibold'>{capitalizeWords(t('owner'))}</label>
                                                    <Dropdown filter showClear value={selectedOwner} onChange={(e) => setSelectedOwner(e.value)} options={employeeListOption} optionLabel="name"
                                                        placeholder={t("selectOwner")} className="w-full" />
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
                                                    <label className='font-semibold'>{capitalizeWords(t("currencyType"))}</label>
                                                    <Dropdown value={selectedCurrency} filter onChange={handleChangeSelectedCurrency} options={currencyOptions} dataKey="code" optionLabel="name"
                                                        placeholder={t("selectCurrency")} className="w-full" />
                                                </div>
                                                <div className="flex flex-column gap-2">
                                                    <label className='font-semibold'>{capitalizeWords(t("currency"))}</label>
                                                    {
                                                        selectedCurrency?.code !== "bpCurrency" && selectedCurrency?.currency && (
                                                            <div className="w-full p-inputtext p-inputtext-sm p-component p-inline-message p-inline-message-info block align-baseline min-h-[33.47px]">
                                                                <p className={`truncate`}>&nbsp;{selectedCurrency?.currency}</p>
                                                            </div>
                                                        )
                                                    }
                                                    {
                                                        selectedCurrency?.code == "bpCurrency" && (
                                                            <Dropdown value={generalInfo?.DocCurrency} onChange={handleChangeDocCurrency} options={selectCurrencyOptions} dataKey="Code" optionLabel="Name"
                                                                placeholder={t('selectCurrency')}className="w-full md:w-14rem" checkmark highlightOnSelect={false} />
                                                        )
                                                    }
                                                </div>
                                                <div className="flex flex-column gap-2">
                                                    <label className='font-semibold'>{capitalizeWords(t("itemServiceType"))}</label>
                                                    <Dropdown value={selectedDocType} onChange={(e) => handleChangeItemServiceType(e)} options={documentTypeOptions} optionLabel="name" dataKey="code"
                                                        placeholder={t("selectItemService")} className="w-full" />
                                                </div>
                                            </div>
                                            <div className="mt-4">
                                                {dataLoaded ?
                                                    (
                                                        <BlockUI autoZIndex={false} baseZIndex={1000} blocked={!selectedCustomer} template={<i className="pi pi-lock" style={{ fontSize: '3rem' }}></i>}>
                                                            <DataTable
                                                                ref={contentItemTableRef}
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
                                                            emptyMessage={t("noDelivery")}
                                                            // header={header}
                                                            >
                                                                <Column rowReorder style={{ width: '3rem' }} />
                                                                <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                                                                {
                                                                    selectedDocType?.code == 'dDocument_Items' && visibleItemColumns && visibleItemColumns.length > 0 && visibleItemColumns.map((col, index) => (
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
                                                                {
                                                                    selectedDocType?.code == 'dDocument_Service' && visibleServiceColumns && visibleServiceColumns.length > 0 && visibleServiceColumns.map((col, index) => (
                                                                        <Column
                                                                            key={index}
                                                                            header={col.header}
                                                                            field={col.field}
                                                                            style={{ minWidth: col.minWidth }}
                                                                            className={col.className}
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
                                                                    selectedDocType?.code == 'dDocument_Items' && visibleItemColumns && visibleItemColumns.length > 0 && visibleItemColumns.map((col, index) => (
                                                                        <Column
                                                                            key={index}
                                                                            header={col.header}
                                                                            field={col.field}
                                                                            style={{ minWidth: col.minWidth }}
                                                                            // className="text-right"
                                                                            body={<Skeleton />}
                                                                        />
                                                                    ))
                                                                }
                                                                {
                                                                    selectedDocType?.code == 'dDocument_Service' && visibleServiceColumns && visibleServiceColumns.length > 0 && visibleServiceColumns.map((col, index) => (
                                                                        <Column
                                                                            key={index}
                                                                            header={col.header}
                                                                            field={col.field}
                                                                            style={{ minWidth: col.minWidth }}
                                                                            className={col.className}
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
                                                        <BlockUI autoZIndex={false} baseZIndex={1000} blocked={!selectedCustomer} template={<i className="pi pi-lock" style={{ fontSize: '3rem' }}></i>}>
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
                                                                selection={selectedFreightChargeRow}
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
                                                                emptyMessage={t("noFreight")}
                                                            // header={header}
                                                            >
                                                                <Column rowReorder style={{ width: '3rem' }} />
                                                                <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
                                                                {
                                                                    visibleFreightColumns && visibleFreightColumns.length > 0 && visibleFreightColumns.map((col, index) => (
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
                                                                visibleFreightColumns && visibleFreightColumns.length > 0 && visibleFreightColumns.map((col, index) => (
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
                                                                <div className="text-500 w-6 md:w-4 font-medium">{capitalizeWords(t("totalBeforeDiscount"))}</div>
                                                                {/* <div className="text-900 w-full md:w-4 md:flex-order-0 flex-order-1">Heat</div> */}
                                                                <div className="w-6 md:w-4 flex justify-content-end">
                                                                    {formatNumberWithComma(generalInfo.TotalBeforeDiscount)} {' '} {`${generalInfo?.DocCurrency?.Code}`}
                                                                </div>
                                                            </li>
                                                            <li className="flex items-center justify-between py-1.5 px-2 border-top-1 border-300 flex-wrap">
                                                                <div className="text-500 w-6 md:w-4 font-medium">{capitalizeWords(t("discount"))}</div>
                                                                <div className="text-900 w-full md:w-4 md:flex-order-0 flex-order-1"><InputNumber inputId="percent" className='w-full text-right p-inputtext-sm' min={0} max={100} suffix=" %" value={generalInfo.DiscountPercent} onChange={(e) => setGeneralInfo(prev => ({ ...prev, DiscountPercent: e.value }))} />
                                                                </div>
                                                                <div className="w-6 md:w-4 flex justify-content-end">
                                                                    {formatNumberWithComma(generalInfo.DiscountAmount)} {' '} {`${generalInfo?.DocCurrency?.Code}`}
                                                                </div>
                                                            </li>
                                                            <li className="flex items-center justify-between py-1.5 px-2 border-top-1 border-300 flex-wrap">
                                                                <div className="text-500 w-4 md:w-4 font-medium">{capitalizeWords(t("freight"))}</div>
                                                                <div className="text-900 w-full md:w-4 md:flex-order-0 flex-order-1"></div>
                                                                <div className="w-6 md:w-4 flex justify-content-end">{formatNumberWithComma(generalInfo.FreightAmount)} {' '} {`${generalInfo?.DocCurrency?.Code}`}</div>
                                                            </li>
                                                            <li className="flex items-center justify-between py-1.5 px-2 border-top-1 border-300 flex-wrap">
                                                                <div className="text-500 w-6 md:w-4 font-medium">{capitalizeWords(t("rounding"))}</div>
                                                                <div className="text-900 w-full md:w-4 md:flex-order-0 flex-order-1"><Checkbox onChange={e => setGeneralInfo(prev => ({ ...prev, Rounding: e.checked }))} checked={generalInfo.Rounding}></Checkbox></div>
                                                                <div className="w-6 md:w-4 flex justify-content-end">
                                                                    {
                                                                        generalInfo.Rounding ? <InputNumber inputId="integeronly" value={generalInfo.RoundingAmount} onChange={e => setGeneralInfo(prev => ({ ...prev, RoundingAmount: e.value }))} className="w-full text-right p-inputtext-sm" min={0} suffix={` ${generalInfo?.DocCurrency?.Code || ""}`} /> : `${formatNumberWithComma(generalInfo.RoundingAmount)} ${generalInfo?.DocCurrency?.Code}`
                                                                    }
                                                                </div>
                                                            </li>
                                                            <li className="flex items-center justify-between py-1.5 px-2 border-top-1 border-300 flex-wrap">
                                                                <div className="text-500 w-4 md:w-4 font-medium">{capitalizeWords(t("tax"))}</div>
                                                                <div className="text-900 w-full md:w-4 md:flex-order-0 flex-order-1"></div>
                                                                <div className="w-6 md:w-4 flex justify-content-end">{formatNumberWithComma(generalInfo.TaxAmount)} {' '} {`${generalInfo?.DocCurrency?.Code}`}</div>
                                                            </li>
                                                            <li className="flex items-center justify-between py-1.5 px-2 border-top-1 border-300 flex-wrap">
                                                                <div className="text-500 w-4 md:w-2 font-medium">{capitalizeWords(t("total"))}</div>
                                                                <div className="text-900 w-full md:w-4 md:flex-order-0 flex-order-1 line-height-3"></div>
                                                                <div className="w-6 md:w-4 flex justify-content-end">{formatNumberWithComma(generalInfo.TotalAmount)} {' '} {`${generalInfo?.DocCurrency?.Code}`}</div>
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
                                            <Accordion style={{ marginTop: '1rem' }} multiple activeIndex={[]}>
                                                <AccordionTab header={
                                                    <span className="font-bold text-md">
                                                        {capitalizeWords(t('shipToAddress'))}
                                                    </span>
                                                }>
                                                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 md:grid-cols-4 p-[7px] mt-2">
                                                        <div className="flex flex-column gap-2">
                                                            <label className='font-semibold'>{capitalizeWords(t("bpAddress"))}</label>
                                                            <Dropdown value={selectedShipToBPAddress} onChange={(e) => setSelectedShipToBPAddress(e.value)} options={shipToBPAddressOptions} optionLabel="name"
                                                                placeholder={t("selectBpAddress")} className="w-full" />
                                                        </div>
                                                        <div className="flex flex-column gap-2 md:col-span-2">
                                                            <label className='font-semibold'>{capitalizeWords(t("addressSummary"))}</label>
                                                            <div className="flex">
                                                                Test địa chỉ nè Test địa chỉ nè Test địa chỉ nè Test địa chỉ nè Test địa chỉ nè
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <div className="my-auto block">
                                                                <Button label={tG("edit")} icon="pi pi-pencil" size="small" onClick={() => setWhichEditAddressModalOpen("shipToEdit")} />
                                                            </div>
                                                            <div className="my-auto block">
                                                                <Button label={tG("new")} icon="pi pi-plus" size="small" onClick={() => setWhichEditAddressModalOpen("shipToDefine")} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </AccordionTab>
                                                <AccordionTab header={
                                                    <span className="font-bold text-md">
                                                        {capitalizeWords(t('billToAddress'))}
                                                    </span>
                                                }>
                                                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 md:grid-cols-4 p-[7px] mt-2">
                                                        <div className="flex flex-column gap-2">
                                                            <label className='font-semibold'>{capitalizeWords(t('bpAddress'))}</label>
                                                            <Dropdown value={selectedBillToBPAddress} onChange={(e) => setSelectedBillToBPAddress(e.value)} options={billToBPAddressOptions} optionLabel="name"
                                                                placeholder={t("selectBpAddress")} className="w-full" />
                                                        </div>
                                                        <div className="flex flex-column gap-2 md:col-span-2">
                                                            <label className='font-semibold'>{capitalizeWords(t('addressSummary'))}</label>
                                                            <div className="flex">
                                                                Test địa chỉ nè Test địa chỉ nè Test địa chỉ nè Test địa chỉ nè Test địa chỉ nè
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <div className="my-auto block">
                                                                <Button label={tG("edit")}  icon="pi pi-pencil" size="small" onClick={() => setWhichEditAddressModalOpen("billToEdit")} />
                                                            </div>
                                                            <div className="my-auto block">
                                                                <Button label={tG("new")}  icon="pi pi-plus" size="small" onClick={() => setWhichEditAddressModalOpen("billToDefine")} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </AccordionTab>
                                                <AccordionTab header={
                                                    <span className="font-bold text-md">
                                                        {capitalizeWords(t('preferences'))}
                                                    </span>
                                                }>
                                                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 md:grid-cols-4 p-[7px] mt-2">
                                                        <div className="flex flex-column gap-2">
                                                            <label className='font-semibold'>{capitalizeWords(t('shippingType'))}</label>
                                                            <Dropdown value={selectedCurrency} onChange={(e) => setSelectedCurrency(e.value)} options={currencyOptions} optionLabel="name"
                                                                placeholder={t("selectCurrency")} className="w-full" />
                                                            {/* <InputText aria-describedby="price-list-help" /> */}
                                                        </div>
                                                    </div>
                                                </AccordionTab>
                                                <AccordionTab header={
                                                    <span className="font-bold text-md">
                                                        {capitalizeWords(t('additionalInfo'))}
                                                    </span>
                                                }>
                                                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 md:grid-cols-4 p-[7px] mt-2">
                                                        <div className="flex flex-column gap-2">
                                                            <label className='font-semibold'>{capitalizeWords(t('stampNo'))}</label>
                                                            <Dropdown value={selectedCurrency} onChange={(e) => setSelectedCurrency(e.value)} options={currencyOptions} optionLabel="name"
                                                                placeholder={t("enterStampNo")} className="w-full" />
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
                                                    <label className='font-semibold'>{capitalizeWords(t("journalRemark"))}</label>
                                                    <InputText aria-describedby="customer-ref-no" value={generalInfo.JournalRemark} onChange={(e) => setGeneralInfo(prev => ({ ...prev, JournalRemark: e.value }))} />
                                                </div>
                                                <div className="flex flex-column gap-2">
                                                    <label className='font-semibold'>{capitalizeWords(t("paymentTerm"))}</label>
                                                    <Dropdown loading={!dataLoaded} checkmark filter options={paymentTermOptions} value={selectedPaymentTerm} optionLabel="name"
                                                        placeholder={!dataLoaded ?  tG("loading") + ' ' + t("paymentTerm").toLocaleLowerCase() +'...' : t("selectPaymentTerm")} onChange={(e) => setSelectedPaymentTerm(e.value)} className="w-full" />
                                                </div>
                                                <div className="flex flex-column gap-2">
                                                    <label className='font-semibold'>{capitalizeWords(t("paymentMethod"))}</label>
                                                    <Dropdown showClear loading={!dataLoaded} filter options={paymentMethodOptions} value={selectedPaymentMethod} optionLabel="PaymentMethodCode" dataKey='PaymentMethodCode'
                                                        onChange={(e) => setSelectedPaymentMethod(e.value)} placeholder={!dataLoaded ? tG("loading") + ' ' + t("paymentMethod").toLocaleLowerCase() +'...' : t("selectPaymentMethod")} className="w-full" />
                                                </div>
                                                <div className="flex flex-column gap-2">
                                                    <label className='font-semibold'>{capitalizeWords(t("cashDiscountDateOffset"))}</label>
                                                    <InputNumber inputId="integeronly" className="w-full text-right p-inputtext-sm" value={generalInfo.CashDiscountDateOffset} onChange={(e) => setGeneralInfo(prev => ({ ...prev, CashDiscountDateOffset: e.value }))} />
                                                </div>
                                                {/* <div className="flex flex-column gap-2">
                                            <label className='font-semibold'>BP Project</label>
                                            <Dropdown showClear filter options={bpProjectOptions} value={selectedBPProject} optionLabel="name"
                                                onChange={(e) => setSelectedBPProject(e.value)} placeholder="Select BP project" className="w-full" />
                                        </div> */}
                                                <div className="flex flex-column gap-2">
                                                    <label className='font-semibold'>{capitalizeWords(t("createQRCodeFrom"))}</label>
                                                    <InputTextarea autoResize rows={2} value={generalInfo.CreateQRCodeFrom} onChange={(e) => setGeneralInfo(prev => ({ ...prev, CreateQRCodeFrom: e.target.value }))} />
                                                </div>
                                                <div className="flex flex-column gap-2">
                                                    <label className='font-semibold'>{capitalizeWords(t("federalTaxID"))}</label>
                                                    <InputText aria-describedby="federal-tax-id" value={generalInfo.FederalTaxID} onChange={(e) => setGeneralInfo(prev => ({ ...prev, FederalTaxID: e.target.value }))} />
                                                </div>
                                                <div className="flex flex-column gap-2">
                                                    <label className='font-semibold'>{capitalizeWords(t("orderNumber"))}</label>
                                                    <InputNumber inputId="integeronly" className="w-full text-right p-inputtext-sm" value={generalInfo.ImportFileNum} onChange={(e) => setGeneralInfo(prev => ({ ...prev, ImportFileNum: e.value }))} />
                                                </div>
                                                {/* <div className="flex flex-column gap-2">
                                            <label className='font-semibold'>Use Shipped Goods Account</label>
                                            <Dropdown showClear filter value={selectedShippedGoodsAccount} options={yesNoOption} optionLabel="name"
                                                onChange={(e) => setSelectedShippedGoodsAccount(e.value)} placeholder="Select whether use shipped goods account" className="w-full" />
                                        </div> */}

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
                                mode="create"
                                fatherLoading={loading}
                                currentContentLength={contentData?.length}
                                docType="Delivery"
                                selectedBPCode={selectedCustomer?.CardCode}
                                style={{ width: `${containerWidth}px`, maxWidth: `${containerWidth}px` }}
                                className={`!max-w-[${containerWidth}px] !w-[${containerWidth}px]`}
                                handleAddAndView={() => setSavingConfirmVisible(true)}
                                handleCopyFrom={handleCopyFrom}
                            />
                            <CustomerList customerSelectModalOpen={customerSelectModalOpen} setCustomerSelectModalOpen={(value) => setCustomerSelectModalOpen(value)} customerList={customerList} orignalSelectedCustomer={selectedCustomer} setCustomer={handleChangeSelectedCustomer} setCustomerList={setCustomerList} setCustomerListOptions={setCustomerListOptions} />
                            <ItemList docType="purchase" itemSelectModalOpen={itemSelectModalOpen} setItemSelectModalOpen={(value) => setItemSelectModalOpen(value)} itemList={itemList} selectedItemRow={selectedItemRow?.Item} setItem={handleSetItems} setItemList={setItemList} />
                            <GLAccountList glAccountSelectModalOpen={glAccountSelectModalOpen} setGLAccountSelectModalOpen={(value) => setGLAccountSelectModalOpen(value)} selectedItemRow={selectedItemRow?.Item} setAccount={handleSetAccount} glAccountList={glAccountList} setGLAccountList={setGLAccountList} />
                            {/* <BatchSerialSelection batchSerialModalOpen={batchSerialModalOpen} item={selectedItemRow} setBatchSerialModalOpen={setBatchSerialModalOpen} setBatchSelections={handleBatchSelections} setSerialSelections={handleSerialSelections} /> */}
                            <BatchSerialCreation mode="create" batchSerialModalOpen={batchSerialModalOpen} item={selectedItemRow} setBatchSerialModalOpen={setBatchSerialModalOpen} setBatchCreations={handleBatchCreation} setSerialCreations={handleSerialCreation} />
                            <SalesTaxCodeList taxCodeSelectModalOpen={taxCodeSelectModalOpen} setTaxCodeSelectModalOpen={(value) => setTaxCodeSelectModalOpen(value)} taxCodeList={vatGroups} selectedTaxCodeRow={selectedItemRow || selectedFreightChargeRow} setTaxCode={handleSetTaxCode} />

                            <Dialog header={["shipToEdit", "billToEdit"].includes(whichEditAddressModalOpen) ? "Edit Address" : "Define New Address"} blockScroll visible={whichEditAddressModalOpen} onHide={() => setWhichEditAddressModalOpen(null)}
                                style={{ width: '70vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }} footer={addressModalFooter}>
                                <div className='mb-2.5 mt-4'>
                                    <h5 className='mb-0 font-bold text-indigo-600 uppercase'>General Information</h5>
                                    <Divider className="my-2" />
                                </div>
                                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 p-[7px]">
                                    <div className="flex flex-column gap-2">
                                        <label className='font-semibold'>{capitalizeWords(tG("streetPOBox"))}</label>
                                        <InputText className="p-inputtext-sm" aria-describedby="street-po-box" />
                                    </div>
                                    <div className="flex flex-column gap-2">
                                        <label className='font-semibold'>{capitalizeWords(tG("streetNo"))}</label>
                                        <InputText className="p-inputtext-sm" aria-describedby="street-no" />
                                    </div>
                                    <div className="flex flex-column gap-2">
                                        <label className='font-semibold'>{capitalizeWords(tG("block"))}</label>
                                        <InputText className="p-inputtext-sm" aria-describedby="block" />
                                    </div>
                                    <div className="flex flex-column gap-2">
                                        <label className='font-semibold'>{capitalizeWords(tG("city"))}</label>
                                        <InputText aria-describedby="block" />
                                    </div>
                                    <div className="flex flex-column gap-2">
                                        <label className='font-semibold'>{capitalizeWords(tG("zipCode"))}</label>
                                        <InputText aria-describedby="zip-code" />
                                    </div>
                                    <div className="flex flex-column gap-2">
                                        <label className='font-semibold'>{capitalizeWords(tG("county"))}</label>
                                        <InputText aria-describedby="county" />
                                    </div>
                                    <div className="flex flex-column gap-2">
                                        <label className='font-semibold'>{capitalizeWords(tG("state"))}</label>
                                        <Dropdown showClear filter options={stateListOptions} optionLabel="name"
                                            placeholder={tG("selectState")} className="w-full" />
                                    </div>
                                    <div className="flex flex-column gap-2">
                                        <label className='font-semibold'>{capitalizeWords(tG("country"))}/{capitalizeWords(tG("region"))}</label>
                                        <Dropdown showClear filter options={countryListOptions} optionLabel="name"
                                            placeholder={tG("selectCountry")} className="w-full" />
                                    </div>
                                    <div className="flex flex-column col-span-2 gap-2">
                                        <label className='font-semibold'>{capitalizeWords(tG("building"))}/{capitalizeWords(tG("floor"))}/{capitalizeWords(tG("room"))}</label>
                                        <InputTextarea aria-describedby="building-floor-room" />
                                    </div>
                                    <div className="flex flex-column gap-2">
                                        <label className='font-semibold'>{capitalizeWords(tG("address2"))}</label>
                                        <InputText aria-describedby="address-name-2" />
                                    </div>
                                    <div className="flex flex-column gap-2">
                                        <label className='font-semibold'>{capitalizeWords(tG("address3"))}</label>
                                        <InputText aria-describedby="address-name-3" />
                                    </div>
                                    <div className="flex flex-column gap-2">
                                        <label className='font-semibold'>GLN</label>
                                        <InputText aria-describedby="gln" />
                                    </div>
                                    <div className="flex flex-column gap-2">
                                        <label className='font-semibold'>{capitalizeWords(tG("updateExistingRows"))}</label>
                                        <Dropdown showClear filter value={selectedShippedGoodsAccount} options={yesNoOption} optionLabel="name"
                                            className="w-full" />
                                    </div>
                                    <div className="flex flex-column gap-2">
                                        <label className='font-semibold'>{capitalizeWords(tG("updateBPMasterData"))}</label>
                                        <Dropdown showClear filter value={selectedShippedGoodsAccount} options={yesNoOption} optionLabel="name"
                                            className="w-full" />
                                    </div>
                                </div>
                            </Dialog>

                            <Dialog
                                header={capitalizeWords(t("columnDisplaySelection"))}
                                blockScroll
                                visible={whichColumnTableModalOpen}
                                onHide={() => setWhichColumnTableModalOpen(null)}
                                style={{ width: '50vw' }}
                                breakpoints={{ '960px': '75vw', '641px': '100vw' }}
                            >
                                <div clasName="m-0 p-2 pt-1">
                                    <div className="flex gap-2 justify-between">
                                        <span className="text-lg">{whichColumnTableModalOpen == "item" ? visibleItemColumns?.length : whichColumnTableModalOpen == "service" ? visibleServiceColumns?.length : visibleFreightColumns?.length} column(s) selected</span>
                                        <Button label={capitalizeWords(t("selectAll"))} onClick={onChangeSelectAllColumn} text disabled={whichColumnTableModalOpen == "item" ? (contentColumns?.length == visibleItemColumns?.length) : whichColumnTableModalOpen == "service" ? (serviceColumns?.length == visibleServiceColumns?.length) : freightChargesColumns?.length == visibleFreightColumns} />
                                    </div>
                                    <ListBox
                                        filter
                                        listStyle={{ height: '400px' }}
                                        multiple
                                        value={whichColumnTableModalOpen == "item" ? visibleItemColumns : whichColumnTableModalOpen == "service" ? visibleServiceColumns : visibleFreightColumns}
                                        itemTemplate={TableColumnOptionTemplate}
                                        onChange={onTableColumnToggle}
                                        options={whichColumnTableModalOpen == "item" ? contentColumns : whichColumnTableModalOpen == "service" ? serviceColumns : freightChargesColumns}
                                        optionLabel="header"
                                        className="w-full mt-3" />
                                </div>
                            </Dialog>

                            <ConfirmDialog group="itemservice" key="itemservicewarning"
                                visible={itemServiceWarningVisible}
                                onHide={() => setItemServiceWarningVisible(false)}
                                message={tM("changeType")}
                                header={capitalizeWords(tG("confirmation"))}
                                icon="pi pi-exclamation-triangle"
                                accept={() => acceptChangeItemServiceType(documentTypeOptions.find(type => type.code != selectedDocType.code))}
                            />

                            <ConfirmDialog group="save" key="savewarning"
                                visible={savingConfirmVisible}
                                onHide={() => setSavingConfirmVisible(false)}
                                message={tM("save")}
                                header={capitalizeWords(tG("confirmation"))}
                                icon="pi pi-exclamation-triangle"
                                accept={() => handleAddAndView()}
                            />

                            {/* <Dialog header={` Creation Table Columns`} blockScroll visible={isFilterModalOpen} onHide={() => setIsFilterModalOpen(false)}
                        style={{ width: '50vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
                        <div clasName="m-0 p-2 pt-1">
                            <ListBox filter ref={creationListRef} listStyle={{ height: '400px' }} multiple value={filterOptions.filter(option => option.selected == true)} itemTemplate={filterOptionTemplate} onChange={handleSelectFitlerList} options={filterOptions.length > 0 && filterOptions} optionLabel="filter-option" className="w-full mt-3" />
                        </div>
                    </Dialog> */}

                            {
                                isPosting && (
                                    <>
                                        <div className="absolute top-0 left-0 w-full h-full backdrop-blur-lg bg-[rgba(202,202,202,0.65)]"></div>
                                        <Loader />
                                    </>
                                )
                            }
                            {/* <GRPOHelper visible={isHelperOpen} onHide={() => setIsHelperOpen(false)} /> */}
                        </div>
                    ) : (
                        <Loader />
                    )
            }
        </>
    );
};

export default withAuth(CCreateDelivery);
// export default CreateDelivery;