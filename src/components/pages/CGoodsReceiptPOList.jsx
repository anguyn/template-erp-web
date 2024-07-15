import Head from 'next/head';
import React, { useCallback, useState, useEffect, useRef, useMemo, lazy } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { nanoid } from 'nanoid';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { Calendar } from 'primereact/calendar';
import { Chip } from 'primereact/chip';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode, FilterService } from 'primereact/api';
import { ListBox } from 'primereact/listbox';
import { Menu } from 'primereact/menu';
import { Tag } from 'primereact/tag';
import { Skeleton } from 'primereact/skeleton';
import { Message } from 'primereact/message';

import { useLayoutStore } from '@/stores/layoutStore';
import { shallow } from 'zustand/shallow';

import withAuth from '@/utils/withAuth';
import toast from 'react-hot-toast';

import { isoToDateFormat, convertToISO } from '@/utils/date';
import { formatNumberWithComma } from '@/utils/number';
import { capitalizeWords } from '@/utils/text';
import { InputNumber } from 'primereact/inputnumber';
import GRPOHelper from '../Dialog/Helpers/GoodsReceiptPO';

const DOCUMENT_STATUS = {
    'bost_Open': 'Open',
    'bost_Close': 'Closed'
}

const statusListOptions = Object.entries(DOCUMENT_STATUS).map(([key, value]) => ({
    code: key,
    name: value
}));

const operatorSwitcher = {
    'contains': 'contains(X,Y)',
    'notContains': 'not contains(X,Y)',
    'startsWith': 'startswith(X,Y)',
    'endsWith': 'endswith(X,Y)',
    'equals': 'X eq Y',
    'notEquals': 'X ne Y',
    'between': ['X ge FROM', 'X le TO'],
}

const SELECT = ['DocEntry', 'DocNum', 'CardCode', 'CardName', 'DocDate', 'DocDueDate', 'DocumentStatus', 'DocCurrency', 'DocTotal', 'DocTotalFc', 'DocTotalSys', 'VatSum', 'VatSumFc', 'VatSumSys']

const defaultLazyState = {
    first: 0,
    rows: 100,
    page: 1,
    sortField: null,
    sortOrder: null,
    filters: {
        'global': { value: '', matchMode: FilterMatchMode.CONTAINS },
        'DocNum': { value: '', matchMode: FilterMatchMode.CONTAINS },
        'CardCode': { value: '', matchMode: FilterMatchMode.CONTAINS },
        'CardName': { value: '', matchMode: FilterMatchMode.CONTAINS },
        'DocDate': { value: '', matchMode: FilterMatchMode.CUSTOM },
        'DocDueDate': { value: '', matchMode: FilterMatchMode.CUSTOM },
        'DocumentStatus': { value: '', matchMode: FilterMatchMode.EQUALS },
        'DocCurrency': { value: '', matchMode: FilterMatchMode.EQUALS },
        'DocTotal': { value: '', matchMode: FilterMatchMode.CONTAINS },
        'DocTotalFc': { value: '', matchMode: FilterMatchMode.CONTAINS },
        'DocTotalSys': { value: '', matchMode: FilterMatchMode.CONTAINS },
        'VatSum': { value: '', matchMode: FilterMatchMode.CONTAINS },
        'VatSumFc': { value: '', matchMode: FilterMatchMode.CONTAINS },
        'VatSumSys': { value: '', matchMode: FilterMatchMode.CONTAINS },
        // 'GrossTotal': { value: '', matchMode: FilterMatchMode.CONTAINS },
        // 'GrossTotalFC': { value: '', matchMode: FilterMatchMode.CONTAINS }
    }
}

const defaultFilter = {
    'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'DocNum': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'CardCode': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'CardName': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'DocDate': { value: null, matchMode: FilterMatchMode.CUSTOM },
    'DocDueDate': { value: null, matchMode: FilterMatchMode.CUSTOM },
    'DocumentStatus': { value: null, matchMode: FilterMatchMode.EQUALS },
    'DocCurrency': { value: null, matchMode: FilterMatchMode.EQUALS },
    'DocTotal': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'DocTotalFc': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'DocTotalSys': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'VatSum': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'VatSumFc': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'VatSumSys': { value: null, matchMode: FilterMatchMode.CONTAINS },
}

FilterService.register('custom_DocDate', (value, filters) => {
    const [from, to] = filters ?? [null, null];

    const dateValue = new Date(value);

    if (from === null && to === null) return true;

    const fromDate = from ? new Date(from) : null;
    const toDate = to ? new Date(to) : null;

    if (fromDate !== null && toDate === null) return fromDate <= dateValue;
    if (fromDate === null && toDate !== null) return dateValue <= toDate;
    return fromDate <= dateValue && dateValue <= toDate;
});

FilterService.register('custom_DocDueDate', (value, filters) => {
    const [from, to] = filters ?? [null, null];

    const dateValue = new Date(value);

    if (from === null && to === null) return true;

    const fromDate = from ? new Date(from) : null;
    const toDate = to ? new Date(to) : null;

    if (fromDate !== null && toDate === null) return fromDate <= dateValue;
    if (fromDate === null && toDate !== null) return dateValue <= toDate;
    return fromDate <= dateValue && dateValue <= toDate;
});

const CGoodsReceiptPOList = ({ initialData }) => {
    const router = useRouter();
    const { lang, layoutConfig } = useLayoutStore(
        (state) => state,
        shallow
    );
    // const pageListStyle = layoutConfig?.pageListStyle;

    const t = useTranslations('GoodsReceiptPOList');
    const tG = useTranslations('General');

    const [isHelperOpen, setIsHelperOpen] = useState(false);
    const [totalRecord, setTotalRecord] = useState(initialData?.count || 0)
    const [dataList, setDataList] = useState([]);
    const [selectedFilterOption, setSelectedFilterOption] = useState(null);
    // const [rowNumber, setRowNumber] = useState(10);
    const [statuses, setStatuses] = useState(Object.values(DOCUMENT_STATUS));
    const [statusOptions, setStatusOptions] = useState(statusListOptions || []);
    const [filterOptions, setFilterOptions] = useState([
        { name: 'Search', code: 'search', selected: true },
        { name: 'Document No.', code: 'docNo', selected: true },
        { name: 'Supplier Code', code: 'supplierCode', selected: true },
        { name: 'Supplier Name', code: 'supplierName', selected: true },
        { name: 'Posting Date', code: 'postingDate', selected: false },
        { name: 'Due Date', code: 'dueDate', selected: true },
        { name: 'Sales Employee Name', code: 'salesEmployeeName', selected: true },
        { name: 'Status', code: 'status', selected: true },
        { name: 'Document Total', code: 'docTotal', selected: false },
        { name: 'Document Total (FC)', code: 'docTotalFC', selected: false },
        { name: 'Gross Profit Total', code: 'grossProfitTotal', selected: false },
        { name: 'Gross Profit Total (FC)', code: 'grossProfitTotalFC', selected: false },
    ]);
    const [selectionAll, setSelectionAll] = useState(false);


    // Template
    const codeBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <span style={{ verticalAlign: 'middle' }}>{rowData.ItemCode}</span>
            </React.Fragment>
        );
    };

    const filterOptionTemplate = (option) => {
        // return (
        //     <>
        //         <div className="flex align-items-center gap-2">
        //             <Checkbox checked={option.selected}></Checkbox>
        //             <div>{option.name}</div>
        //         </div>
        //     </>
        // );
        return (
            <>
                <div className="flex align-items-center gap-2">
                    <div>{option?.header}</div>
                </div>
            </>
        );
    };

    const descriptionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <span style={{ verticalAlign: 'middle' }}>{rowData.ItemName}</span>
            </React.Fragment>
        );
    };

    const stockBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <span style={{ verticalAlign: 'middle' }}>{rowData.QuantityOnStock}</span>
            </React.Fragment>
        );
    };

    const statusBodyTemplate = (rowData) => {
        return <Tag value={DOCUMENT_STATUS[rowData.DocumentStatus]} severity={getSeverity(DOCUMENT_STATUS[rowData.DocumentStatus])} />;
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button link onClick={() => router.push(`/purchasing/goods-receipt-po/${rowData.DocEntry}`)} icon="pi pi-eye" rounded aria-label="View" />
            </>
        )
    };

    const getSeverity = (status) => {
        switch (status) {
            // case 'Unqualified':
            //     return 'danger';

            case 'Open':
                return 'success';

            // case 'New':
            //     return 'info';

            case 'Closed':
                return 'warning';

            case 'Renewal':
                return null;
        }
    };

    const statusItemTemplate = (option) => {
        return <Tag value={option} severity={getSeverity(option)} />;
    };

    const loadingItemTemplate = (options) => {
        return (
            <div className="flex align-items-center" style={{ height: '17px', flexGrow: '1', overflow: 'hidden' }}>
                <Skeleton width='60%' height="1rem" />
            </div>
        );
    };

    const statusRowFilterTemplate = (options) => {
        return (
            <Dropdown value={statusOptions.find(el => el.code == options.value)} dataKey="code" optionLabel="name" showClear={false} options={statusOptions} onChange={(e) => { options.filterApplyCallback(e.value.code) }} itemTemplate={(option) => statusItemTemplate(option.name)} />
        );
    };

    const stringRowFilterTemplate = (options) => {
        return (
            <InputText value={options.value} onChange={(e) => { options.filterApplyCallback(e.target.value) }} />
        );
    };

    const numberRowFilterTemplate = (options) => {
        return (
            <InputNumber value={options.value} onChange={(e) => options.filterApplyCallback(e.target.value)} />
        );
    };

    const documentDateRowFilterTemplate = (options) => {
        const [from, to] = options.value ?? [null, null];

        return (
            <div className="flex gap-1">
                <Calendar id="buttondisplay" dateFormat="dd/mm/yy" value={from} onChange={(e) => options.filterApplyCallback([e.target.value, to])} showIcon placeholder={t("fromDate")} />
                <Calendar id="buttondisplay" dateFormat="dd/mm/yy" value={to} onChange={(e) => options.filterApplyCallback([from, e.target.value])} showIcon placeholder={t("toDate")} />
            </div>
        );
    };

    const [goodsReceiptPOData, setGoodsReceiptPOData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [exampleData, setExampleData] = useState([]);

    // useMemo
    // const goodsReceiptPOColumns =
    const goodsReceiptPOColumns = useMemo(
        () =>
            [
                {
                    header: capitalizeWords(tG("documentNo")),
                    field: 'DocNum',
                    sortable: true,
                    className: 'text-center',
                    minWidth: '12rem',
                    filterField: 'DocNum',
                    filter: true,
                    showFilterMatchModes: true,
                    body: '',
                    filterElement: stringRowFilterTemplate,
                    filterMatchMode: 'contains',
                    sortable: true,
                },
                {
                    header: capitalizeWords(tG("supplierCode")),
                    field: 'CardCode',
                    sortable: true,
                    className: 'text-left',
                    minWidth: '12rem',
                    filterField: 'CardCode',
                    filter: true,
                    showFilterMatchModes: true,
                    body: '',
                    filterElement: stringRowFilterTemplate,
                    filterMatchMode: 'contains',
                    sortable: true,
                },
                {
                    header: capitalizeWords(tG("supplierName")),
                    field: 'CardName',
                    sortable: true,
                    className: 'text-left',
                    minWidth: '12rem',
                    filterField: 'CardName',
                    filter: true,
                    showFilterMatchModes: true,
                    body: '',
                    filterMatchMode: 'contains',
                    filterElement: stringRowFilterTemplate,
                },
                {
                    header: capitalizeWords(tG("postingDate")),
                    field: 'DocDate',
                    sortable: true,
                    className: 'text-center',
                    minWidth: '25rem',
                    filterField: 'DocDate',
                    filter: true,
                    body: (product) => <>{isoToDateFormat(product?.DocDate)}</>,
                    sortable: true,
                    filterElement: documentDateRowFilterTemplate,
                    showFilterMenu: false,
                    showFilterMatchModes: false,
                    filterMatchMode: 'custom',
                    filterMatchModeOptions: [
                        {
                            label: "Between",
                            value: "custom"
                        },
                    ],
                },
                {
                    header: capitalizeWords(tG("dueDate")),
                    field: 'DocDueDate',
                    sortable: true,
                    className: 'text-center',
                    minWidth: '25rem',
                    filterField: 'DocDueDate',
                    filter: true,
                    body: (product) => <>{isoToDateFormat(product?.DocDueDate)}</>,
                    sortable: true,
                    filterElement: documentDateRowFilterTemplate,
                    showFilterMenu: false,
                    showFilterMatchModes: false,
                    filterMatchMode: 'custom',
                    filterMatchModeOptions: [
                        {
                            label: "Between",
                            value: "custom"
                        },
                    ],
                },
                {
                    header: capitalizeWords(tG("status")),
                    field: 'DocumentStatus',
                    sortable: true,
                    className: 'text-center',
                    minWidth: '14rem',
                    filterField: 'DocumentStatus',
                    filter: true,
                    showFilterMatchModes: true,
                    showFilterMenu: true,
                    body: statusBodyTemplate,
                    sortable: false,
                    filterElement: statusRowFilterTemplate,
                    filterMatchMode: 'equals',
                    filterMatchModeOptions: [
                        {
                            label: "Equal",
                            value: "equals"
                        },
                        {
                            label: "Not equal",
                            value: "notEquals"
                        },
                    ],
                },
                {
                    header: capitalizeWords(tG("currency")),
                    field: 'DocCurrency',
                    sortable: true,
                    className: 'text-right',
                    minWidth: '14rem',
                    filterField: 'DocCurrency',
                    filter: true,
                    showFilterMatchModes: true,
                    filterMatchMode: 'contains',
                    sortable: true,
                },
                {
                    header: capitalizeWords(tG("documentTotal")),
                    field: 'DocTotal',
                    sortable: true,
                    className: 'text-right',
                    minWidth: '14rem',
                    filterField: 'DocTotal',
                    filter: true,
                    showFilterMatchModes: true,
                    body: (product) => <>{formatNumberWithComma(product?.DocTotal)}</>,
                    filterElement: numberRowFilterTemplate,
                    filterMatchMode: 'contains',
                    sortable: true,
                },
                {
                    header: capitalizeWords(tG("documentTotalFC")),
                    field: 'DocTotalFc',
                    sortable: true,
                    className: 'text-right',
                    minWidth: '14rem',
                    filterField: 'DocTotalFc',
                    filter: true,
                    showFilterMatchModes: true,
                    body: (product) => <>{formatNumberWithComma(product?.DocTotalFc)}</>,
                    filterElement: numberRowFilterTemplate,
                    filterMatchMode: 'contains',
                    sortable: true,
                },
                {
                    header: capitalizeWords(tG("documentTotalSys")),
                    field: 'DocTotalSys',
                    sortable: true,
                    className: 'text-right',
                    minWidth: '14rem',
                    filterField: 'DocTotalSys',
                    filter: true,
                    showFilterMatchModes: true,
                    body: (product) => <>{formatNumberWithComma(product?.DocTotalSys)}</>,
                    filterElement: numberRowFilterTemplate,
                    filterMatchMode: 'contains',
                    sortable: true,
                },
                {
                    header: capitalizeWords(tG("vatSum")),
                    field: 'VatSum',
                    sortable: true,
                    className: 'text-right',
                    minWidth: '14rem',
                    filterField: 'VatSum',
                    filter: true,
                    showFilterMatchModes: true,
                    body: (product) => <>{formatNumberWithComma(product?.VatSum)}</>,
                    filterElement: numberRowFilterTemplate,
                    filterMatchMode: 'contains',
                    sortable: true,
                },
                {
                    header: capitalizeWords(tG("vatSumFC")),
                    field: 'VatSumFc',
                    sortable: true,
                    className: 'text-right',
                    minWidth: '14rem',
                    filterField: 'VatSumFc',
                    filter: true,
                    showFilterMatchModes: true,
                    body: (product) => <>{formatNumberWithComma(product?.VatSumFc)}</>,
                    filterElement: numberRowFilterTemplate,
                    filterMatchMode: 'contains',
                    sortable: true,
                },
                {
                    header: capitalizeWords(tG("vatSumSys")),
                    field: 'VatSumSys',
                    sortable: true,
                    className: 'text-right',
                    minWidth: '14rem',
                    filterField: 'VatSumSys',
                    filter: true,
                    showFilterMatchModes: true,
                    body: (product) => <>{formatNumberWithComma(product?.VatSumSys)}</>,
                    filterElement: numberRowFilterTemplate,
                    filterMatchMode: 'contains',
                    sortable: true,
                },
            ]
        , [lang]
    );

    const tableInfoMessage = useMemo(
        () => (
            <div className="flex align-items-center">
                <div className="ml-2">{`Tip: Bạn đang ở chế độ ${layoutConfig.pageListStyle}. Có thể điều chỉnh tại cài đặt`}</div>
            </div>
        ), [layoutConfig?.pageListStyle]
    );

    const [grFilters, setGRFilters] = useState(null);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

    const [selectedGoodsReceiptPO, setSelectedGoodsReceiptPO] = useState(null);
    const [searchInput, setSearchInput] = useState('');
    const [menuIsOpen, setMenuIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [visibleGRColumns, setVisibleGRColumns] = useState([]);
    const [lazyState, setLazyState] = useState(defaultLazyState);
    const exportMenu = useRef(null);
    const goodsReceiptPOT = useRef(null);
    const filterListRef = useRef(null);

    const onPageChange = (e) => {
        console.log("Dô đây hả", e)
        // setLazyState(e);
    }

    const markNavigatedRow = useCallback(
        (row) => {
            return selectedGoodsReceiptPO?.id === row.id;
        },
        [selectedGoodsReceiptPO]
    );

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        setGlobalFilterValue(value);

        if (layoutConfig?.pageListStyle == 'pagination') {
            let _filters = { ...lazyState.filters };
            _filters['global'].value = value;
            setLazyState(prev => ({ ...prev, filters: _filters }));
        }
        else {
            console.log("Moẹ 112:", value);
            console.log("Moẹ 113:", grFilters);
            setGRFilters(prev => ({ ...prev, global: value }));
        }

    };

    const onRowSelect = (e) => {
        setSelectedRow(e.detail.row);
    };

    const onColumnToggle = (e) => {
        let selectedColumns = e.value;
        let orderedSelectedColumns = goodsReceiptPOColumns.filter((col) => selectedColumns.some((sCol) => sCol.field === col.field));

        setVisibleGRColumns(orderedSelectedColumns);
    };

    const onSelectAllChange = (event) => {
        const selectAll = event.checked;

        if (selectAll) {
            //   CustomerService.getCustomers().then((data) => {
            setSelectionAll(true);
            // setSelectedGoodsReceiptPO(data.customers);
            //   });
        } else {
            setSelectionAll(false);
            setSelectedGoodsReceiptPO([]);
        }
    };

    const handleRefresh = () => {
        setLazyState(defaultLazyState)
    }


    const renderHeader = () => {
        return (
            <div className="flex flex-col sm:flex-row gap-3 justify-content-between py-2">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <Button
                        type="button"
                        icon="pi pi-refresh"
                        label={tG("refresh")}
                        outlined
                        className="h-[2.8rem]"
                        // size="small"
                        // onClick={handleRefresh}
                        onClick={() => { console.log("Ref nè m: ", goodsReceiptPOT.current) }}
                    />
                    <Button
                        type="button"
                        icon="pi pi-sliders-h"
                        label={t("column")}
                        outlined
                        className="h-[2.8rem]"
                        // size="small"
                        onClick={() => setIsFilterModalOpen(true)}
                    />

                    {/* <MultiSelect value={visibleGRColumns} options={goodsReceiptPOColumns} optionLabel="header" onChange={onColumnToggle} className="p-inputtext-sm w-full sm:w-20rem text-sm" display="chip" /> */}
                </div>
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText
                        className="p-inputtext-sm text-base h-[2.8rem] w-full sm:w-auto"
                        value={globalFilterValue}
                        disabled={loading}
                        onChange={onGlobalFilterChange}
                        placeholder={tG("keywordSearch")}
                    />
                </span>
            </div>
        );
    };

    const pFooter = useMemo(
        () => {
            return (
                <div className='flex flex-col sm:flex-row gap-3 sm:justify-between py-2'>
                    <span>{tG("displayQuantity", { from: lazyState?.first + 1, to: lazyState?.first + 100, amount: totalRecord })}</span>
                    <span>{tG("defaultPageNumber", { pageNumber: lazyState?.rows })}</span>
                </div>
            )
        }, [lazyState, totalRecord]
    )
    const sFooter = useMemo(
        () => {
            return (
                <div className='flex flex-col sm:flex-row gap-3 justify-center py-2'>
                    <span>{tG("displayCurrentQuantity", { current: filteredData?.length, amount: totalRecord })}</span>
                </div>
            )
        }, [filteredData, totalRecord]
    )

    const header = renderHeader();
    // const pFooter = renderPFooter;
    // const sFooter = renderSFooter;

    // Export Functions
    const exportCsv = (selectionOnly) => {
        goodsReceiptPOT.current.exportCSV({ selectionOnly });
    };

    const exportPdf = () => {
        import('jspdf').then((jsPDF) => {
            import('jspdf-autotable').then(() => {
                const doc = new jsPDF.default(0, 0);

                doc.autoTable(goodsReceiptPOColumns.map((col) => ({ title: col.header, dataKey: col.field })), goodsReceiptPOData);
                doc.save('Goods-Receipt.pdf');
            });
        });
    };

    const exportExcel = () => {
        import('xlsx').then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(goodsReceiptPOData);
            const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
            const excelBuffer = xlsx.write(workbook, {
                bookType: 'xlsx',
                type: 'array'
            });

            saveAsExcelFile(excelBuffer, 'Goods-Receipt');
        });
    };

    const saveAsExcelFile = (buffer, fileName) => {
        import('file-saver').then((module) => {
            if (module && module.default) {
                let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
                let EXCEL_EXTENSION = '.xlsx';
                const data = new Blob([buffer], {
                    type: EXCEL_TYPE
                });

                module.default.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
            }
        });
    };

    const exportJson = () => {
        import('file-saver').then((module) => {
            if (module && module.default) {
                const { saveAs } = module.default;
                // console.log(deliveryT.current.getTable());
                const data = goodsReceiptPOData;
                const jsonData = JSON.stringify(data);
                const blob = new Blob([jsonData], { type: 'application/json;charset=utf-8' });
                saveAs(blob, 'Goods-Receipt.json');
            }
        });
    }

    const exportOptions = [
        {
            label: t("file"),
            items: [
                {
                    label: 'Excel',
                    icon: 'pi pi-file-excel',
                    command: () => {
                        exportExcel();
                    }
                },
                {
                    label: 'PDF',
                    icon: 'pi pi-file-pdf',
                    command: () => {
                        exportPdf();
                    }
                },
            ],
        },
        {
            label: t("data"),
            items: [
                {
                    label: 'JSON',
                    icon: 'pi pi-file',
                    command: () => {
                        exportJson();
                    }
                },
                {
                    label: 'CSV',
                    icon: 'pi pi-file',
                    command: () => {
                        exportCsv(false);
                    }
                },

            ],
        },
    ];

    // Function for modal
    const handleSelectFitlerList = (e) => {
        const newValue = e.value;
        const updatedOptions = filterOptions.map(option => ({
            ...option,
            selected: newValue.some(item => item.code === option.code)
        }));
        if (newValue.length > 0) {
            setFilterOptions(updatedOptions);
        } else {
            toast("There must be at least one filter criteria.")
            return;
        }
    }

    useEffect(() => {
        // if (layoutConfig?.pageListStyle == 'scroll') loadLazyData();
        loadLazyData()
        // initGRFilters();
        setVisibleGRColumns(goodsReceiptPOColumns)
    }, []);

    useEffect(() => {
        setVisibleGRColumns(prevColumns =>
            prevColumns.map(col => {
                const updatedCol = goodsReceiptPOColumns.find(gc => gc.field === col.field);
                return updatedCol ? { ...col, header: updatedCol.header, filterElement: updatedCol.filterElement } : col;
            })
        );
    }, [goodsReceiptPOColumns]);

    // useEffect(() => {
    //     console.log("lạ l: ", goodsReceiptPOData)

    // }, [goodsReceiptPOData]);

    const handlePageChange = (event) => {
        // console.log('Page Change Event:', event);
        // console.log("Row number: ", event.rows);
        setLazyState(event);
        // // `rows` là số lượng hàng trên mỗi trang
        // setRowNumber(event.rows);
    };

    const handlePageSort = (event) => {
        setLazyState(event);
    }

    const handlePageFilter = (event) => {
        event["first"] = 0;
        setLazyState(event);
    }

    let networkTimeout = null;

    const loadLazyData = () => {
        if (networkTimeout) {
            clearTimeout(networkTimeout);
        }

        (async () => {
            try {
                setExampleData(Array.from({ length: 20 }, (_, index) => index))
                setLoading(true);
                goodsReceiptPOT.current.clearState();
                const { first, rows, page, sortField, sortOrder, filters } = lazyState;
                const payload = {
                    top: [lazyState.rows || 100],
                    skip: [first || 0],
                    select: SELECT,
                    inlinecount: 'allpages'
                }

                if (sortField) {
                    payload['orderby'] = []; // Khởi tạo mảng orderby nếu chưa tồn tại

                    // multiSortMeta.forEach(el => {
                    const order = sortOrder === -1 ? ' desc' : ' asc'; // Xác định hướng sắp xếp

                    // Thêm vào mảng orderby của payload
                    payload['orderby'].push(`${sortField}${order}`);
                    // });
                }

                const filterCriterias = Object.entries(filters)
                    .filter(([key, filter]) => filter.value !== "" && filter.value !== null && filter.value !== undefined)
                    .map(([key, filter]) => ({ field: key, ...filter }));

                if (filterCriterias?.length > 0) {
                    const filterStrings = filterCriterias.map(criteria => {
                        const { field, value, matchMode } = criteria;
                        // Chỗ này cân nhắc lại nha !!
                        const operatorTemplate = operatorSwitcher[matchMode] ? operatorSwitcher[matchMode] : operatorSwitcher['between'];

                        // Lọc global
                        if (field == "global") {
                            const globalValue = value;
                            const globalFilterStrings = Object.keys(filters)
                                .filter(key => key !== 'global')
                                .map(key => `contains(${key},'${globalValue}')`);

                            return globalFilterStrings.join(' or ');
                        }

                        // if (matchMode === 'between' && Array.isArray(value) && value.length === 2) {
                        if (Array.isArray(value) && value.length === 2) {
                            const filterParts = [];

                            const [from, to] = value;
                            const [fromTemplate, toTemplate] = operatorTemplate;

                            console.log("Gì v mẹ: ", operatorTemplate)
                            console.log("From: ", from);
                            console.log("To: ", to);

                            if (from) {
                                filterParts.push(fromTemplate.replace('X', field).replace('FROM', `'${convertToISO(from)}'`));
                            }
                            if (to) {
                                filterParts.push(toTemplate.replace('X', field).replace('TO', `'${convertToISO(to)}'`));
                            }


                            return filterParts;
                        } else {
                            let formattedValue;
                            formattedValue = `'${value}'`;
                            return operatorTemplate.replace('X', field).replace('Y', formattedValue);
                        }
                    });

                    payload['filter'] = [...filterStrings];
                }

                console.log("payload của mẹ: ", payload)

                networkTimeout = await fetch('http://localhost:3000/api/purchase/get-all-goods-receipt-po', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(layoutConfig?.pageListStyle == 'pagination' ? payload : { select: SELECT, inlinecount: 'allpages' }),
                    credentials: 'include'
                });

                const data = await networkTimeout.json();

                console.log("Haizz: ", data)

                setTotalRecord(data?.['odata.count']);
                setGoodsReceiptPOData(data?.value);
            } catch (error) {
                console.error(error);
                toast.error(error);
            } finally {
                setLoading(false);
                setGRFilters(defaultFilter);
                setExampleData([])
            }
        })()
    };

    const msgs = useRef(null);

    useEffect(() => {
        // console.log("Lazy State: ", lazyState)
        // if (layoutConfig?.pageListStyle == 'pagination')
        loadLazyData();
    }, [lazyState, layoutConfig?.pageListStyle]);

    return (
        <>
            <Head>
                <title>{capitalizeWords(t('goodsReceiptPOList'))}</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <div id="custom-section" className="flex flex-col relative" >
                <div className="w-full">
                    <div className="card p-2 sm:p-4 relative">
                        <div className='flex gap-4 items-center'>
                            <h3 className='m-0'>{capitalizeWords(t('goodsReceiptPOList'))}</h3>
                            <Chip label={`${totalRecord} ${totalRecord > 1 ? t("documents").toLowerCase() : t("document").toLowerCase()}`} />
                        </div>
                        <Button className="absolute top-1 right-1 scale-75 sm:scale-50" icon="pi pi-question" rounded outlined size="small" severity="secondary" aria-label="Helper" onClick={() => setIsHelperOpen(true)} />

                        {/* <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 p-[10px]">
                        {
                            filterOptions.find(option => option.code === 'search')?.selected && (
                                <div className="flex flex-column gap-2">
                                    <label className="font-semibold">{capitalizeWords(tG("searchKeyWord"))}</label>
                                    <InputText placeholder={tG("enterKeyWord")} className="p-inputtext-sm text-base" />
                                </div>
                            )
                        }

                        {
                            filterOptions.find(option => option.code === 'docNo')?.selected && (
                                <div className="flex flex-column gap-2">
                                    <label className="font-semibold">{capitalizeWords(tG("documentNo"))}</label>
                                    <InputText placeholder={tG("enterDocumentNo")} className="p-inputtext-sm text-base" />
                                </div>
                            )
                        }

                        {
                            filterOptions.find(option => option.code === 'supplierCode')?.selected && (
                                <div className="flex flex-column gap-2">
                                    <label className="font-semibold">{capitalizeWords(tG("supplierCode"))}</label>
                                    <InputText placeholder={tG("enterSupplierCode")} className="p-inputtext-sm text-base" />
                                </div>
                            )
                        }

                        {
                            filterOptions.find(option => option.code === 'supplierName')?.selected && (
                                <div className="flex flex-column gap-2">
                                    <label className="font-semibold">{capitalizeWords(tG("supplierName"))}</label>
                                    <InputText placeholder={tG("enterSupplierName")} className="p-inputtext-sm text-base" />
                                </div>
                            )
                        }

                        {
                            filterOptions.find(option => option.code === 'postingDate')?.selected && (
                                <div className="flex flex-column gap-2">
                                    <label className="font-semibold">{capitalizeWords(tG("postingDate"))}</label>
                                    <Calendar className="p-inputtext-sm text-base" showIcon />
                                </div>
                            )
                        }

                        {
                            filterOptions.find(option => option.code === 'dueDate')?.selected && (
                                <div className="flex flex-column gap-2">
                                    <label className="font-semibold">{capitalizeWords(tG("dueDate"))}</label>
                                    <Calendar className="p-inputtext-sm text-base" showIcon />
                                </div>
                            )
                        }

                        {
                            filterOptions.find(option => option.code === 'status')?.selected && (
                                <div className="flex flex-column gap-2">
                                    <label className="font-semibold">{capitalizeWords(tG("status"))}</label>
                                    <Dropdown options={statuses} itemTemplate={statusItemTemplate} placeholder={tG("selectStatus")} className="p-column-filter p-inputtext-sm text-base" showClear />
                                </div>
                            )
                        }

                        {
                            filterOptions.find(option => option.code === 'docTotal')?.selected && (
                                <div className="flex flex-column gap-2">
                                    <label className="font-semibold">{capitalizeWords(tG("documentTotal"))}</label>
                                    <InputText placeholder={tG("enterDocumentTotal")} className="p-inputtext-sm text-base" />
                                </div>
                            )
                        }

                        {
                            filterOptions.find(option => option.code === 'docTotalFC')?.selected && (
                                <div className="flex flex-column gap-2">
                                    <label className="font-semibold">{capitalizeWords(tG("documentTotalFC"))}</label>
                                    <InputText placeholder={tG("enterDocumentTotalFC")} className="p-inputtext-sm text-base" />
                                </div>
                            )
                        }

                        {
                            filterOptions.find(option => option.code === 'grossProfitTotal')?.selected && (
                                <div className="flex flex-column gap-2">
                                    <label className="font-semibold">{capitalizeWords(tG("grossProfitTotal"))}</label>
                                    <InputText placeholder={tG("enterGrossTotal")} className="p-inputtext-sm text-base" />
                                </div>
                            )
                        }

                        {
                            filterOptions.find(option => option.code === 'grossProfitTotalFC')?.selected && (
                                <div className="flex flex-column gap-2">
                                    <label className="font-semibold">{capitalizeWords(tG("grossProfitTotalFC"))}</label>
                                    <InputText placeholder={tG("enterGrossTotalFC")} className="p-inputtext-sm text-base" />
                                </div>
                            )
                        }
                    </div> */}

                        <div className="flex justify-end gap-2 mt-2">
                            <div>
                                <Button
                                    label={capitalizeWords(tG("create"))}
                                    severity="create"
                                    outlined
                                    onClick={() => router.push('/purchasing/goods-receipt-po/create')}
                                />
                            </div>
                            <div className="">
                                <Menu
                                    model={exportOptions}
                                    popup
                                    ref={exportMenu}
                                    id="export-menu"
                                    popupAlignment="right"
                                />
                                <Button
                                    label={capitalizeWords(tG("export"))}
                                    disabled={loading}
                                    onClick={(event) => exportMenu.current.toggle(event)}
                                    aria-controls="export-menu"
                                    aria-haspopup
                                />
                            </div>
                            {/* <div>
                            <Button
                                label={capitalizeWords(tG("filter"))}
                                className="mr-2"
                                severity="filter"
                                icon="pi pi-filter"
                                outlined
                                onClick={() => setIsFilterModalOpen(true)}
                            />
                        </div> */}
                        </div>

                        <section className="mt-4">
                            <Message
                                style={{
                                    border: 'solid #696cff',
                                    borderWidth: '0 0 0 6px',
                                    color: '#696cff'
                                }}
                                className="border-primary w-full justify-content-start mb-2"
                                severity="info"
                                content={tableInfoMessage}
                            />
                            {
                                // loading ? (
                                //     <DataTable
                                //         id='example-table'
                                //         value={exampleData}
                                //         className="p-datatable-gridlines"
                                //         scrollable
                                //         scrollHeight='600px'
                                //         paginator
                                //         showGridlines
                                //         rows={20}
                                //         rowsPerPageOptions={[20, 50, 100, 200]}
                                //         dataKey="DocNum"
                                //         stripedRows={false}
                                //         columnResizeMode="expand"
                                //         resizableColumns
                                //         filterDisplay="row"
                                //         responsiveLayout="scroll"
                                //         sortMode="multiple"
                                //         filters={grFilters}
                                //         removableSort
                                //         emptyMessage={capitalizeWords(t("empty"))}
                                //         header={header}
                                //         reorderableColumns
                                //     >
                                //         <Column key={nanoid(6)} columnKey={nanoid(6)} body={loadingItemTemplate} headerStyle={{ width: '3rem' }}></Column>
                                //         <Column key={nanoid(6)} columnKey={nanoid(6)} body={loadingItemTemplate} header={capitalizeWords(tG("actions"))} headerStyle={{ width: '3rem' }} className='text-center' />
                                //         {
                                //             visibleGRColumns && visibleGRColumns.length > 0 && visibleGRColumns.map((col, idx) => (
                                //                 <Column
                                //                     key={nanoid(6)}
                                //                     columnKey={nanoid(6)}
                                //                     header={col.header}
                                //                     body={loadingItemTemplate}
                                //                 />
                                //             ))
                                //         }

                                //     </DataTable>
                                // ) :
                                (layoutConfig?.pageListStyle == 'pagination') ? (
                                    <DataTable
                                        ref={goodsReceiptPOT}
                                        lazy
                                        scrollable
                                        scrollHeight='600px'
                                        totalRecords={totalRecord || initialData?.count}
                                        id="goods-receipt-po-table"
                                        value={goodsReceiptPOData}
                                        className="p-datatable-gridlines"
                                        paginator
                                        showGridlines
                                        rows={100}
                                        rowsPerPageOptions={[10, 20, 50, 100, 200]}
                                        selectionMode={'checkbox'}
                                        selection={selectedGoodsReceiptPO}
                                        onSelectionChange={(e) => {
                                            const currentValue = e.value;
                                            setSelectedGoodsReceiptPO(currentValue)
                                            setSelectionAll(currentValue.length === totalRecord)
                                        }}
                                        onPage={handlePageChange}
                                        onSort={handlePageSort}
                                        sortField={lazyState.sortField}
                                        sortOrder={lazyState.sortOrder}
                                        filters={lazyState.filters}
                                        onFilter={handlePageFilter}
                                        selectAll={selectionAll}
                                        onSelectAllChange={onSelectAllChange}
                                        globalFilterFields={['DocNum', 'CardCode', 'CardName', 'DocDueDate', 'DocDate', 'DocumentStatus', 'DocTotal', 'DocTotalFc', 'DocTotal']}
                                        dataKey="DocNum"
                                        stripedRows={true}
                                        first={lazyState.first}
                                        // filters={lazyState.filters}
                                        columnResizeMode="expand"
                                        resizableColumns
                                        filterDisplay="row"
                                        loading={loading}
                                        responsiveLayout="scroll"
                                        sortMode="single"
                                        removableSort
                                        emptyMessage={capitalizeWords(t("empty"))}
                                        header={header}
                                        footer={pFooter}
                                        reorderableColumns
                                    >
                                        <Column key={nanoid(6)} columnKey={nanoid(6)} resizeable={false} reorderable={false} frozen selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                                        <Column key={nanoid(6)} columnKey={nanoid(6)} resizeable={false} reorderable={false} frozen header={capitalizeWords(tG("actions"))} headerStyle={{ width: '3rem' }} body={actionBodyTemplate} />
                                        {
                                            visibleGRColumns && visibleGRColumns.length > 0 && visibleGRColumns.map((col, idx) => (
                                                <Column
                                                    key={nanoid(6)}
                                                    columnKey={nanoid(6)}
                                                    header={col.header}
                                                    field={col.field}
                                                    filter={col.filter}
                                                    filterField={col.field}
                                                    sortable={col.sortable}
                                                    showFilterMatchModes={col.showFilterMatchModes}
                                                    style={{ minWidth: col.minWidth }}
                                                    className={col.className}
                                                    filterElement={col.filterElement}
                                                    showFilterMenu={col.showFilterMenu}
                                                    body={col.body}
                                                    filterMatchMode={col.filterMatchMode}
                                                    filterMatchModeOptions={col.filterMatchModeOptions}
                                                    headerStyle={{ textAlign: 'center' }}
                                                // filter
                                                // filterElement={representativeFilterTemplate}
                                                />
                                            ))
                                        }

                                    </DataTable>
                                ) : (
                                    <DataTable
                                        ref={goodsReceiptPOT}
                                        value={goodsReceiptPOData}
                                        className="p-datatable-gridlines"
                                        scrollable
                                        scrollHeight='600px'
                                        virtualScrollerOptions={{ itemSize: 46 }}
                                        showGridlines
                                        // paginator
                                        // rows={20}
                                        // rowsPerPageOptions={[20, 50, 100, 200]}
                                        dataKey="DocNum"
                                        stripedRows={false}
                                        columnResizeMode="expand"
                                        resizableColumns
                                        filterDisplay="row"
                                        loading={loading}
                                        responsiveLayout="scroll"
                                        sortMode="multiple"
                                        filters={grFilters}
                                        removableSort
                                        emptyMessage={capitalizeWords(t("empty"))}
                                        header={header}
                                        footer={sFooter}
                                        reorderableColumns
                                    // onValueChange={handleValueChange}
                                    >
                                        <Column key={nanoid(6)} columnKey={nanoid(6)} resizeable={false} reorderable={false} frozen selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                                        <Column key={nanoid(6)} columnKey={nanoid(6)} resizeable={false} reorderable={false} frozen header={capitalizeWords(tG("actions"))} headerStyle={{ width: '3rem' }} className='text-center' body={actionBodyTemplate} />
                                        {
                                            visibleGRColumns && visibleGRColumns.length > 0 && visibleGRColumns.map((col, idx) => (
                                                <Column
                                                    key={nanoid(6)}
                                                    columnKey={nanoid(6)}
                                                    header={col.header}
                                                    field={col.field}
                                                    filter={col.filter}
                                                    filterField={col.field}
                                                    sortable={col.field}
                                                    showFilterMatchModes={col.field}
                                                    style={{ minWidth: col.minWidth }}
                                                    className={col.className}
                                                    filterElement={col.filterElement}
                                                    showFilterMenu={col.showFilterMenu}
                                                    body={col.body}
                                                    // filterMatchMode={col.filterMatchMode}
                                                    filterMatchModeOptions={col.filterMatchModeOptions}
                                                    headerStyle={{ textAlign: 'center' }}
                                                />
                                            ))
                                        }

                                    </DataTable>
                                )
                            }
                        </section>
                    </div>
                </div>
                {/* This is modal section */}
                {/* <Dialog header={tG("filterOption")} blockScroll visible={isFilterModalOpen} onHide={() => setIsFilterModalOpen(false)}
                style={{ width: '50vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
                <div clasName="m-0 p-2 pt-1">
                    <ListBox filter ref={filterListRef} listStyle={{ height: '400px' }} multiple value={filterOptions.filter(option => option.selected == true)} itemTemplate={filterOptionTemplate} onChange={handleSelectFitlerList} options={filterOptions.length > 0 && filterOptions} optionLabel="filter-option" className="w-full mt-3" />
                </div>
            </Dialog> */}
                <Dialog
                    header={tG("filterOption")}
                    blockScroll
                    visible={isFilterModalOpen}
                    onHide={() => setIsFilterModalOpen(false)}
                    style={{ width: '50vw' }}
                    breakpoints={{ '960px': '75vw', '641px': '100vw' }}
                >
                    <div clasName="m-0 p-2 pt-1">
                        <ListBox filter ref={filterListRef} listStyle={{ height: '400px' }} multiple value={visibleGRColumns} itemTemplate={filterOptionTemplate} onChange={onColumnToggle} options={goodsReceiptPOColumns} optionLabel="header" className="w-full mt-3" />
                    </div>
                </Dialog>
                <GRPOHelper visible={isHelperOpen} onHide={() => setIsHelperOpen(false)} />
            </div>
        </>
    );
};


export default withAuth(CGoodsReceiptPOList);
// export default GoodsReceiptPO;
