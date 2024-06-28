import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Button } from 'primereact/button';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Menu } from 'primereact/menu';
import { SplitButton } from 'primereact/splitbutton';

import toast from 'react-hot-toast';
import { useRouter } from 'next/router';

import purchaseApi from '@/service/ServiceLayer/purchaseApi';
import salesApi from '@/service/ServiceLayer/salesApi';

import { isoToDateFormat } from '@/utils/date';
import { formatNumberWithComma } from '@/utils/number';

const FeatureBar = (props) => {
    const { fatherLoading, currentContentLength, docType, selectedBPCode, className, style, handleCopyFrom, handleAddAndView } = props;

    // console.log("Mệtmệt: ", docType);
    // console.log("Dô: ", selectedBPCode);
    const copyFromBtnRef = useRef();
    const documentListRef = useRef();

    const functionGroup1 = [
        {
            label: 'Add & View',
            icon: 'pi pi-eye',
            command: () => {
                handleClickAddAndView();
            }
        },
        {
            label: 'Add & New',
            icon: 'pi pi-plus-circle',
            command: () => {
                handleClickAddAndNew()
            }
        },
        {
            label: 'Add & Back',
            icon: 'pi pi-chevron-circle-left',
            command: () => {
                handleClickAddAndBack();
            }
        },
    ];

    const documentType = {
        "Sales Quotaion": 23,
        "Sales Order": 17,
        "Purchase Quotation": 540000006,
        "Purchase Order": 22,
    }

    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [documentListDialogOpen, setDocumentListDialogOpen] = useState(false);
    const [selectedDocType, setSelectedDocType] = useState(null);
    const [contentData, setContentData] = useState([]);
    const [selectedDocuments, setSelectedDocuments] = useState([]);
    const [copyFunctionGroup, setCopyFunctionGroup] = useState([]);
    const [addFunctionGroup, setAddFunctionGroup] = useState(functionGroup1);

    const purchaseOrderColumns = useMemo(
        () => [
            {
                header: 'Purchase Order No.',
                field: 'DocNum',
                className: 'text-center',
                minWidth: '12rem'
            },
            {
                header: 'Posting Date',
                field: 'DocDate',
                className: 'text-center',
                minWidth: '12rem',
                body: (product) => <>{product?.DocDate ? isoToDateFormat(product.DocDate) : ''}</>,
            },
            {
                header: 'Document Date',
                field: 'TaxDate',
                className: 'text-right',
                minWidth: '14rem',
                body: (product) => <>{product?.TaxDate ? isoToDateFormat(product.TaxDate) : ''}</>,
            },
            {
                header: 'Due Date',
                field: 'DocDueDate',
                className: 'text-right',
                minWidth: '14rem',
                body: (product) => <>{product?.DocDueDate ? isoToDateFormat(product.DocDueDate) : ''}</>,

            },
            {
                header: 'Discount %',
                field: 'DiscountPercent',
                className: 'text-right',
                minWidth: '14rem',
                body: (product) => <span className='text-center'>{product?.DiscountPercent + ' %'}</span>,
            },
            {
                header: 'Discount Amount',
                field: 'TotalDiscount',
                className: 'text-right',
                minWidth: '14rem',
                body: (product) => <span className=''>{formatNumberWithComma(product?.TotalDiscount) + ' ' + product?.DocCurrency}</span>,
            },
            {
                header: 'Discount Amount (FC)',
                field: 'TotalDiscountFC',
                className: 'text-right',
                minWidth: '14rem',
                body: (product) => <span className=''>{formatNumberWithComma(product?.TotalDiscountFC) + ' ' + product?.DocCurrency}</span>,
            },
            {
                header: 'Discount Amount (SC)',
                field: 'TotalDiscountSC',
                className: 'text-right',
                minWidth: '14rem',
                body: (product) => <span className=''>{formatNumberWithComma(product?.TotalDiscountSC) + ' ' + product?.DocCurrency}</span>,
            },
            {
                header: 'Document Total',
                field: 'TotalDiscount',
                className: 'text-right',
                minWidth: '14rem',
                body: (product) => <span className=''>{formatNumberWithComma(product?.DocTotal) + ' ' + product?.DocCurrency}</span>,
            },
            {
                header: 'Document Total (FC)',
                field: 'DocTotalSys',
                className: 'text-right',
                minWidth: '14rem',
                body: (product) => <span className=''>{formatNumberWithComma(product?.DocTotalFc) + ' ' + product?.DocCurrency}</span>,
            },
            {
                header: 'Document Total (SC)',
                field: 'DocTotalSys',
                className: 'text-right',
                minWidth: '14rem',
                body: (product) => <span className=''>{formatNumberWithComma(product?.DocTotalSys) + ' ' + product?.DocCurrency}</span>,
            },
            {
                header: 'Tax Amount',
                field: 'VatSum',
                className: 'text-right',
                minWidth: '14rem',
                body: (product) => <span className=''>{formatNumberWithComma(product?.VatSum) + ' ' + product?.DocCurrency}</span>,
            },
            {
                header: 'Tax Amount (FC)',
                field: 'VatSumFc',
                className: 'text-right',
                minWidth: '14rem',
                body: (product) => <span className=''>{formatNumberWithComma(product?.VatSumFc) + ' ' + product?.DocCurrency}</span>,
            },
            {
                header: 'Tax Amount (SC)',
                field: 'VatSumSys',
                className: 'text-right',
                minWidth: '14rem',
                body: (product) => <span className=''>{formatNumberWithComma(product?.VatSumSys) + ' ' + product?.DocCurrency}</span>,
            },
            // {
            //     header: 'Freight',
            //     field: 'Freight',
            //     className: 'text-right',
            //     minWidth: '14rem'
            // },
            // {
            //     header: 'Freight (FC)',
            //     field: 'FreightFC',
            //     className: 'text-right',
            //     minWidth: '14rem'
            // },
            // {
            //     header: 'Freight (SC)',
            //     field: 'FreightSC',
            //     className: 'text-right',
            //     minWidth: '14rem'
            // },
        ],
        []
    );

    const purchaseQuotationColumns = useMemo(
        () => [
            {
                header: 'Purchase Quotation No.',
                field: 'DocNum',
                className: 'text-center',
                minWidth: '12rem'
            },
            {
                header: 'Posting Date',
                field: 'DocDate',
                className: 'text-center',
                minWidth: '12rem',
                body: (product) => <>{product?.DocDate ? isoToDateFormat(product.DocDate) : ''}</>,
            },
            {
                header: 'Document Date',
                field: 'DocumentDate',
                className: 'text-right',
                minWidth: '14rem',
                body: (product) => <>{product?.DocumentDate ? isoToDateFormat(product.DocumentDate) : ''}</>,
            },
            {
                header: 'Due Date',
                field: 'DocDueDate',
                className: 'text-right',
                minWidth: '14rem',
                body: (product) => <>{isoToDateFormat(product?.DocDueDate)}</>,
            },
            {
                header: 'Discount %',
                field: 'DiscountPercent',
                className: 'text-right',
                minWidth: '14rem'
            },
            {
                header: 'Discount Amount',
                field: 'DiscountAmount',
                className: 'text-right',
                minWidth: '14rem'
            },
            {
                header: 'Discount Amount (FC)',
                field: 'DiscountAmountFC',
                className: 'text-right',
                minWidth: '14rem'
            },
            {
                header: 'Discount Amount (SC)',
                field: 'DiscountAmountSC',
                className: 'text-right',
                minWidth: '14rem'
            },
            {
                header: 'Document Total',
                field: 'DocumentTotal',
                className: 'text-right',
                minWidth: '14rem'
            },
            {
                header: 'Document Total (FC)',
                field: 'DocumentTotalFC',
                className: 'text-right',
                minWidth: '14rem'
            },
            {
                header: 'Document Total (SC)',
                field: 'DocumentTotalSC',
                className: 'text-right',
                minWidth: '14rem'
            },
            {
                header: 'Tax Amount',
                field: 'TaxAmount',
                className: 'text-right',
                minWidth: '14rem'
            },
            {
                header: 'Tax Amount (FC)',
                field: 'TaxAmountFC',
                className: 'text-right',
                minWidth: '14rem'
            },
            {
                header: 'Tax Amount (SC)',
                field: 'TaxAmountSC',
                className: 'text-right',
                minWidth: '14rem'
            },
            {
                header: 'Freight',
                field: 'Freight',
                className: 'text-right',
                minWidth: '14rem'
            },
            {
                header: 'Freight (FC)',
                field: 'FreightFC',
                className: 'text-right',
                minWidth: '14rem'
            },
            {
                header: 'Freight (SC)',
                field: 'FreightSC',
                className: 'text-right',
                minWidth: '14rem'
            },
        ],
        []
    );

    const contentColumns = useMemo(() => {
        switch (selectedDocType) {
            case 'Purchase Order':
                return purchaseOrderColumns;
            case 'Purchase Quotation':
                return purchaseQuotationColumns;
            // case 'Sales Order':
            // return salesOrderColumns;
            // case 'Sales Quotation':
            // return salesQuotationColumns;
            default:
                return [];
        }
    }, [selectedDocType])

    const handleClickAddAndView = () => {
        handleAddAndView();
    }

    const handleClickAddAndNew = () => {
        toast.success("Add and View")
    }

    const handleClickAddAndBack = () => {
        toast.success("Add and Back")
    }

    const handleRollBack = () => {
        router.back();
    };

    const handleClickPurchaseQuotations = () => {
        setDocumentListDialogOpen(true);
    }

    const handleCloseDocumentModal = () => {
        setSelectedDocuments([]);
        setDocumentListDialogOpen(false);
    }

    const handleConfirmDocumentModal = ({ replace }) => {
        const result = {
            DocumentType: documentType[selectedDocType] || -1,
            DocumentName: selectedDocType,
            Documents: selectedDocuments,
            Replace: replace,
        }
        console.log("Result: ", result);
        handleCopyFrom(result);
        setSelectedDocuments([]);
        setDocumentListDialogOpen(false);
    }

    const handleConfirmReplaceData = () => {
        confirmDialog({
            group: "templating",
            message: 'Your document already has content data, do you want to keep your current data?',
            header: 'Confirmation',
            icon: 'pi pi-info-circle',
            // defaultFocus: 'accept',
            // acceptClassName: 'p-button-danger',
            // accept: handleCopyFrom({ replace: true })
        });
    }

    const documentDFooterContent = (
        <div>
            <Button label="Cancel" icon="pi pi-times" onClick={handleCloseDocumentModal} className="p-button-text" />
            <Button label="Confirm" icon="pi pi-check" disabled={selectedDocuments?.length < 1}
                onClick={() => {
                    if (currentContentLength > 1) {
                        setConfirmDialogOpen(true);
                    } else
                        handleConfirmDocumentModal({ replace: true });
                }}
                autoFocus
            />
        </div>
    );

    useEffect(() => {
        if (selectedBPCode) {
            let functionGroup = [];
            switch (docType) {
                case "Delivery":
                    functionGroup = [
                        {
                            label: 'Sales Quotations',
                            icon: 'pi pi-eye',
                            command: () => {
                                setSelectedDocType("Sales Quotation");
                                setDocumentListDialogOpen(true);
                            }
                        },
                        {
                            label: 'Sales Orders',
                            icon: 'pi pi-plus-circle',
                            command: () => {
                                setSelectedDocType("Sales Order");
                                setDocumentListDialogOpen(true);
                            }
                        }
                    ];
                    break;

                case "Goods Receipt PO":
                    functionGroup = [
                        {
                            label: 'Purchase Quotations',
                            icon: 'pi pi-eye',
                            command: () => {
                                setSelectedDocType("Purchase Quotation");
                                setDocumentListDialogOpen(true);
                            }
                        },
                        {
                            label: 'Purchase Orders',
                            icon: 'pi pi-plus-circle',
                            command: () => {
                                setSelectedDocType("Purchase Order");
                                setDocumentListDialogOpen(true);
                            }
                        }
                    ]
                    break;
            }

            setCopyFunctionGroup(functionGroup);
        } else {
            setCopyFunctionGroup([]);
        }
    }, [selectedBPCode]);

    useEffect(() => {
        console.log("Dô đi: ", selectedDocType);
        if (selectedBPCode && selectedDocType) {
            (async () => {
                try {
                    setLoading(true);
                    let res = null;
                    const queryProps = {
                        filter: [`CardCode eq '${selectedBPCode}'`, "DocumentStatus eq 'bost_Open'"]
                    };
                    console.log("mỉnh gỡ từ từ: ", queryProps)
                    switch (selectedDocType) {
                        case "Purchase Quotation":
                            res = await purchaseApi.getAllPurchaseQuotation(queryProps);
                            break;
                        case "Purchase Order":
                            res = await purchaseApi.getAllPurchaseOrder(queryProps);
                            break;
                        case "Sales Quotation":
                            res = await salesApi.getAllSalesQuotation(queryProps);
                            break;
                        case "Sales Order":
                            res = await salesApi.getAllSalesOrder(queryProps);
                            break;
                    }
                    console.log("Res nè má: ", res);
                    setContentData(res?.value);
                } catch (error) {
                    console.error(error);
                    toast.error("There was an error");
                } finally {
                    setLoading(false);
                }
            })()
        }
    }, [selectedDocType, selectedBPCode])

    return (
        <>
            <div style={style} className={`card fixed bottom-0 right-[2rem] shadow-2xl flex gap-2 justify-end items-center py-2 ${className}`}>
                {
                    docType && selectedBPCode && (
                        <div>
                            <div className="block">
                                <Menu model={copyFunctionGroup} popup ref={copyFromBtnRef} id="copy-from-menu" popupAlignment="right" />
                                <Button label="Copy From" icon="pi pi-copy" className="mr-2" onClick={(event) => copyFromBtnRef.current.toggle(event)} aria-controls="copy-from-menu" aria-haspopup />
                            </div>
                        </div>
                    )
                }
                <div>
                    <div className="hidden sm:block">
                        <SplitButton label="Add & View" disabled={fatherLoading} onClick={handleClickAddAndView} model={addFunctionGroup} />
                    </div>
                    <div className="block sm:hidden">
                        <SplitButton label="Add" disabled={fatherLoading} onClick={handleClickAddAndView} model={addFunctionGroup} />
                    </div>
                </div>

                {/* <div className="hidden sm:block">
                    <SplitButton label="Save as Draft & View" onClick={handleClickFunctGroup2} model={functionGroup2} />
                </div> */}
                {/* <div className="block sm:hidden">
                    <SplitButton label="Save" onClick={handleClickFunctGroup2} model={functionGroup2} />
                </div> */}
                {/* <div className="block sm:hidden">
                    <Button label="Cancel" severity="cancel" text onClick={handleRollBack} />
                </div> */}
            </div>
            <ConfirmDialog
                group="declarative"
                visible={confirmDialogOpen}
                message='Your document already has content data, do you want to keep your current data?'
                header='Confirmation'
                onHide={() => setConfirmDialogOpen(false)}
                icon="pi pi-exclamation-triangle"
                accept={() => {
                    handleConfirmDocumentModal({ replace: false });
                    setConfirmDialogOpen(false);
                }}
                reject={() => {
                    handleConfirmDocumentModal({ replace: true });
                    setConfirmDialogOpen(false);
                }}
            // style={{ width: '50vw' }}
            // breakpoints={{ '1100px': '75vw', '960px': '100vw' }}
            />

            <Dialog
                header="Select Document To Copy"
                blockScroll
                visible={documentListDialogOpen}
                onHide={() => { setDocumentListDialogOpen(false); setSelectedDocuments([]) }}
                maximizable
                footer={documentDFooterContent}
                style={{ width: '50vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}
            >
                <div className="m-0 p-2 pt-1">
                    <DataTable
                        className="list-table p-datatable-gridlines"
                        showGridlines
                        value={contentData}
                        selectionAutoFocus={false}
                        selectionMode={'checkbox'}
                        dataKey="DocNum"
                        stripedRows={false}
                        // filters={grFilters}
                        columnResizeMode="expand"
                        resizableColumns
                        // loading={loading}
                        sortMode="multiple"
                        removableSort
                        loading={loading}
                        paginator
                        rows={8}
                        rowsPerPageOptions={[20, 50, 100, 200]}
                        selection={selectedDocuments}
                        onSelectionChange={(e) => {
                            const currentValue = e.value;
                            setSelectedDocuments(currentValue)
                        }}
                        emptyMessage={`No ${selectedDocType ? selectedDocType.toLowerCase() : ""} documents found.`}
                    >
                        <Column rowReorder style={{ width: '3rem' }} />
                        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
                        {
                            contentColumns && contentColumns.length > 0 && contentColumns.map((col, index) => (
                                <Column
                                    key={index}
                                    header={col.header}
                                    field={col.field}
                                    style={{ minWidth: col.minWidth }}
                                    body={col.body}
                                />
                            ))
                        }
                    </DataTable>
                </div>
            </Dialog>
        </>
    )
}

export default FeatureBar;

