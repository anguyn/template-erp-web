"use client"
import React, { useCallback, useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation'
import { Column } from 'primereact/column';
import { Checkbox } from 'primereact/checkbox';
import { Calendar } from 'primereact/calendar';
import { DataTable } from 'primereact/datatable';
import { Divider } from 'primereact/divider';
import { MultiSelect } from 'primereact/multiselect';
import { Fieldset } from 'primereact/fieldset';
import { ListBox } from 'primereact/listbox';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';

import withAuth from '@/utils/withAuth';
import inventoryApi from '@/service/ServiceLayer/inventoryApi';
import toast from 'react-hot-toast';
import { isoToDateFormat } from '@/utils/date';
import { formatNumberWithComma } from '@/utils/number';
import { capitalizeWords } from '@/utils/text'

import purchaseApi from '@/service/ServiceLayer/purchaseApi';

const GoodsReceipt = () => {
    const [selectedFilterOption, setSelectedFilterOption] = useState(null);

    const [filterOptions, setFilterOptions] = useState([
        { name: 'Search', code: 'search', selected: true },
        { name: 'Document No.', code: 'docNo', selected: true },
        { name: 'Posting Date', code: 'postingDate', selected: true },
        { name: 'User Code', code: 'userCode', selected: true },
        { name: 'Actual Days', code: 'actualDays', selected: false },
        { name: 'APInvoice eNo', code: 'apInvEno', selected: false },
        { name: 'Document Total', code: 'docTotal', selected: false },
    ]);

    const router = useRouter();
    const goodsReceiptColumns = useMemo(
        () => [
            {
                header: 'Document No.',
                field: 'DocNum',
                sortable: true,
                className: 'text-center',
                minWidth: '12rem',
                filterField: 'DocNum',
                filter: true,
                showFilterMatchModes: true,
                filterElement: ''
            },
            {
                header: "Vendor Code",
                field: 'CardCode',
                sortable: true,
                className: 'text-center',
                minWidth: '12rem',
                filterField: 'CardCode',
                filter: true,
                showFilterMatchModes: true,
                body: '',
                filterElement: ''
            },
            {
                header: "Vendor Name",
                field: 'CardName',
                sortable: true,
                className: 'text-center',
                minWidth: '12rem',
                filterField: 'CardName',
                filter: true,
                showFilterMatchModes: true,
                body: '',
                filterElement: ''
            },
            {
                header: 'Posting Date',
                field: 'DocDate',
                sortable: true,
                className: 'text-center',
                minWidth: '12rem',
                filterField: 'DocDate',
                filter: true,
                showFilterMatchModes: true,
                body: (product) => <>{isoToDateFormat(product?.DocDate)}</>,
                filterElement: ''
            },
            {
                header: 'Document Date',
                field: 'DocDueDate',
                sortable: true,
                className: 'text-center',
                minWidth: '14rem',
                filterField: 'DocDueDate',
                filter: true,
                showFilterMatchModes: false,
                body: (product) => <>{isoToDateFormat(product?.DocDueDate)}</>,
                filterElement: ''
            },
            {
                header: 'Document Total',
                field: 'DocTotal',
                sortable: true,
                className: 'text-right',
                minWidth: '14rem',
                filterField: 'DocTotal',
                filter: true,
                showFilterMatchModes: true,
                body: (product) => <>{formatNumberWithComma(product?.DocTotal)}</>,
                filterElement: ''
            },
        ],
        []
    );

    const [grFilters, setGRFilters] = useState({
        // global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        // DocNo: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        // PostingDate: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        // DocumentDate: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        // DocumentTotal: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        // DocumentDate: { value: null, matchMode: FilterMatchMode.IN },
        // status: { value: null, matchMode: FilterMatchMode.EQUALS },
    });
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

    const [goodsReceiptData, setGoodsReceiptData] = useState([]);
    const [selectedGoodsReceipt, setSelectedGoodsReceipt] = useState(null);
    const [searchInput, setSearchInput] = useState('');
    const [menuIsOpen, setMenuIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [visibleGRColumns, setVisibleGRColumns] = useState(goodsReceiptColumns);

    const exportMenu = useRef(null);
    const goodsReceiptT = useRef(null);
    const filterListRef = useRef(null);

    const markNavigatedRow = useCallback(
        (row) => {
            return selectedGoodsReceipt?.id === row.id;
        },
        [selectedGoodsReceipt]
    );

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...grFilters };
        _filters['global'].value = value;

        setGRFilters(_filters);
        setGlobalFilterValue(value);
    };

    const filterOptionTemplate = (option) => {
        return (
            <>
                <div className="flex align-items-center gap-2">
                    <Checkbox checked={option.selected}></Checkbox>
                    <div>{option.name}</div>
                </div>
            </>
        );
    };

    const codeBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <span style={{ verticalAlign: 'middle' }}>{rowData.ItemCode}</span>
            </React.Fragment>
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

    const onRowSelect = (e) => {
        setSelectedRow(e.detail.row);
    };

    const onColumnToggle = (e) => {
        let selectedColumns = e.value;
        let orderedSelectedColumns = goodsReceiptColumns.filter((col) => selectedColumns.some((sCol) => sCol.field === col.field));

        setVisibleGRColumns(orderedSelectedColumns);
    };

    const initGRFilters = () => {
        setGRFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            DocNo: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
            PostingDate: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
            DocumentDate: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
            DocumentTotal: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        });
        setGlobalFilterValue('');
    };

    const renderHeader = () => {
        return (
            <div className="flex flex-col sm:flex-row gap-3 justify-content-between py-2">
                <div className="flex flex-col sm:flex-row gap-3 sm:items-center gap-2">
                    <Button
                        type="button"
                        icon="pi pi-filter-slash"
                        label="Clear"
                        outlined
                        className="h-[2.8rem]"
                        // size="small"
                        onClick={() => initGRFilters()}
                    />
                    <MultiSelect value={visibleGRColumns} options={goodsReceiptColumns} optionLabel="header" onChange={onColumnToggle} className="p-inputtext-sm w-full sm:w-20rem text-sm" display="chip" />
                </div>
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText
                        className="p-inputtext-sm text-base h-[2.8rem] w-full sm:w-auto"
                        value={globalFilterValue}
                        onChange={onGlobalFilterChange}
                        placeholder="Keyword Search"
                    />
                </span>
            </div>
        );
    };

    const header = renderHeader();

    const getAllGoodsReceipt = async () => {
        try {
            setLoading(true);
            const res = await purchaseApi.getAllGoodReceiptPODoc();
            setGoodsReceiptData(res?.value);
            console.log("Ga gì: ", res?.value)
        } catch (e) {
            console.error(e);
            toast.error("There is an error occured.")
        } finally {
            setLoading(false);
        }
    }

    // Export Functions
    const exportCsv = (selectionOnly) => {
        goodsReceiptT.current.exportCSV({ selectionOnly });
    };

    const exportPdf = () => {
        import('jspdf').then((jsPDF) => {
            import('jspdf-autotable').then(() => {
                const doc = new jsPDF.default(0, 0);

                doc.autoTable(goodsReceiptColumns.map((col) => ({ title: col.header, dataKey: col.field })), goodsReceiptData);
                doc.save('Goods-Receipt.pdf');
            });
        });
    };

    const exportExcel = () => {
        import('xlsx').then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(goodsReceiptData);
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
                // console.log(goodsReceiptT.current.getTable());
                const data = goodsReceiptData;
                const jsonData = JSON.stringify(data);
                const blob = new Blob([jsonData], { type: 'application/json;charset=utf-8' });
                saveAs(blob, 'Goods-Receipt.json');
            }
        });
    }

    const exportOptions = [
        {
            label: 'File',
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
            label: 'Data',
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

    // const handleSearchFilter = (e) => {
    //     const newValue = e.value;
    //     console.log("Hello: ", newValue);
    //     console.log(filterListRef.current);
    // }

    useEffect(() => {
        getAllGoodsReceipt();
        initGRFilters();
    }, []);

    // useEffect(() => {
    //     console.log("Hello", selectedFilterOption);
    // }, [selectedFilterOption])

    return (
        <div id="custom-section" className="flex flex-col relative" >
            <div className="w-full">
                <div className="card">
                    <h3>Goods Receipt</h3>
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 p-[10px]">
                        {
                            filterOptions.find(option => option.code === 'search')?.selected && (
                                <div className="flex flex-column gap-2">
                                    <label className="font-semibold">Search key word</label>
                                    <InputText placeholder="Enter key word" className="p-inputtext-sm text-base" />
                                </div>
                            )
                        }

                        {
                            filterOptions.find(option => option.code === 'docNo')?.selected && (
                                <div className="flex flex-column gap-2">
                                    <label className="font-semibold">Document No</label>
                                    <InputText placeholder="Enter document no" className="p-inputtext-sm text-base" />
                                </div>
                            )
                        }

                        {
                            filterOptions.find(option => option.code === 'postingDate')?.selected && (
                                <div className="flex flex-column gap-2">
                                    <label className="font-semibold">Posting Date</label>
                                    <Calendar className="p-inputtext-sm text-base" showIcon />
                                </div>
                            )
                        }

                        {
                            filterOptions.find(option => option.code === 'userCode')?.selected && (
                                <div className="flex flex-column gap-2">
                                    <label className="font-semibold">User Code</label>
                                    <InputText placeholder="Enter user code" className="p-inputtext-sm text-base" />
                                </div>
                            )
                        }

                        {
                            filterOptions.find(option => option.code === 'actualDays')?.selected && (
                                <div className="flex flex-column gap-2">
                                    <label className="font-semibold">Actual Days</label>
                                    <InputText placeholder="Enter user code" className="p-inputtext-sm text-base" />
                                </div>
                            )
                        }

                        {
                            filterOptions.find(option => option.code === 'apInvEno')?.selected && (
                                <div className="flex flex-column gap-2">
                                    <label className="font-semibold">APInvoice eNo</label>
                                    <InputText placeholder="Enter user code" className="p-inputtext-sm text-base" />
                                </div>
                            )
                        }

                        {
                            filterOptions.find(option => option.code === 'docTotal')?.selected && (
                                <div className="flex flex-column gap-2">
                                    <label className="font-semibold">Document Total</label>
                                    <InputText placeholder="Enter user code" className="p-inputtext-sm text-base" />
                                </div>
                            )
                        }
                    </div>

                    <div className="flex justify-end gap-2 mt-2">
                        <div>
                            <Button
                                label="Create"
                                severity="create"
                                outlined
                                onClick={() => router.push('/inventory/goods-receipt/create')}
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
                                label="Export"
                                // size="small"
                                onClick={(event) => exportMenu.current.toggle(event)}
                                aria-controls="export-menu"
                                aria-haspopup
                            />
                        </div>
                        <div>
                            <Button
                                label="Filter"
                                className="mr-2"
                                severity="filter"
                                icon="pi pi-filter"
                                outlined
                                onClick={() => setIsFilterModalOpen(true)}
                            />
                        </div>
                    </div>
                    <section className="mt-4">
                        <DataTable
                            ref={goodsReceiptT}
                            id="goods-receipt-table"
                            value={goodsReceiptData}
                            className="p-datatable-gridlines"
                            paginator
                            showGridlines
                            rows={8}
                            rowsPerPageOptions={[20, 50, 100, 200]}
                            selectionMode={'checkbox'}
                            selection={selectedGoodsReceipt}
                            onSelectionChange={(e) => {
                                const currentValue = e.value;
                                setSelectedGoodsReceipt(e.value)
                            }}
                            globalFilterFields={['DocNo', 'PostingDate', 'DocumentDate', 'DocumentTotal']}
                            dataKey="DocNo"
                            stripedRows={false}
                            filters={grFilters}
                            columnResizeMode="expand"
                            resizableColumns
                            filterDisplay="row"
                            loading={loading}
                            responsiveLayout="scroll"
                            sortMode="multiple"
                            removableSort
                            emptyMessage="No goods receipt found."
                            header={header}
                        >
                            <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                            {
                                visibleGRColumns && visibleGRColumns.length > 0 && visibleGRColumns.map((col) => (
                                    <Column
                                        header={col.header}
                                        field={col.field}
                                        filter={col.filter}
                                        filterField={col.field}
                                        sortable={col.field}
                                        showFilterMatchModes={col.field}
                                        style={{ minWidth: col.minWidth }}
                                        className="text-right"
                                        filterElement={col.filterElement}
                                    // body={stockBodyTemplate}
                                    // filter
                                    // filterElement={representativeFilterTemplate}
                                    />
                                ))
                            }

                        </DataTable>
                    </section>
                </div>
            </div>
            {/* This is modal section */}
            <Dialog header="Filter option" visible={isFilterModalOpen} onHide={() => setIsFilterModalOpen(false)}
                style={{ width: '50vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
                <div clasName="m-0 p-2 pt-1">
                    {/* <div className="p-inputgroup flex-1 mt-1">
                        <InputText placeholder="Keyword" onChange={handleSearchFilter} />
                        <Button icon="pi pi-search" />
                    </div> */}
                    <ListBox filter ref={filterListRef} listStyle={{ height: '400px' }} multiple value={filterOptions.filter(option => option.selected == true)} itemTemplate={filterOptionTemplate} onChange={handleSelectFitlerList} options={filterOptions.length > 0 && filterOptions} optionLabel="filter-option" className="w-full mt-3" />
                </div>
            </Dialog>
        </div>
    );
};

export default withAuth(GoodsReceipt);
// export default GoodsReceipt;
