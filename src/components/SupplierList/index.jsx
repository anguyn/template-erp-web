import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode, FilterService } from 'primereact/api'
import { nanoid } from 'nanoid';
import toast from 'react-hot-toast';
import { useTranslations } from 'next-intl';

import { formatNumberWithComma } from '@/utils/number';
import { capitalizeWords } from '@/utils/text';

const SupplierList = (props) => {
    const t = useTranslations("CreateGoodsReceiptPO");
    const tD = useTranslations("Dialog");
    const { supplierSelectModalOpen, setSupplierSelectModalOpen, supplierList, orignalSelectedSupplier, setSupplier, setSupplierList, setSupplierListOptions } = props;
    // const [itemList, setItemList] = useState(ItemList);
    const controller = new AbortController();
    const signal = controller.signal;

    const [businessBPList, setBusinessBPList] = useState(supplierList || []);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    const dialogRef = useRef(null);

    const handleConfirmModal = () => {
        setSupplier(selectedSupplier.CardCode);
        setSupplierSelectModalOpen(false);
        toast.success("Confirm");
    }

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const renderTHeader = () => {
        return (
            <div className="flex items-center gap-4 justify-content-end">
                <Button disabled={loading} icon="pi pi-refresh" rounded raised onClick={handleRefresh} />
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
                </span>
            </div>
        );
    };

    const renderTFooter = () => {
        return (
            <div className='flex gap-4 items-center'>
                <span><b>Total Supplier</b></span>
                <Badge className='text-base' value={businessBPList?.length || 0}></Badge>
            </div>
        )
    }

    const renderDFooter = () => {
        // !Problem: Xử lý trigger click close button
        // console.log("Hì: ", dialogRef.current.getCloseButton.click());

        return (
            <div>
                <Button label={tD('cancel')} icon="pi pi-times" onClick={(e) => handleHideModal()} className="p-button-text" />
                {/* <Button label="Choose" disabled={!selectedSupplier} icon="pi pi-check" onClick={handleConfirmModal} autoFocus /> */}
            </div>
        )
    };

    const handleHideModal = () => {
        setSupplierSelectModalOpen(false);
        setSelectedSupplier(orignalSelectedSupplier);
    }

    const fetchData = async () => {
        try {
            setLoading(true);
            const queryProps = {
                select: ['BPCurrenciesCollection', 'BPPaymentMethods', 'CardCode', 'CardName', 'CardForeignName', 'CardType', 'Currency', 'ContactEmployees', 'ContactPerson', 'CurrentAccountBalance', 'DefaultCurrency', 'PayTermsGrpCode', 'VatGroup'],
                filter: ["CardType eq 'cSupplier'"]
            };
            const res = await fetch('/api/partner/get-partners', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(queryProps),
                signal
            });
            const dataResult = await res.json();

            setBusinessBPList(dataResult.value);
            setSupplierList(dataResult.value);
            setSupplierListOptions(dataResult.value?.map(val => ({ name: val.CardName, code: val.CardCode })))

        } catch (error) {
            console.error(error);
            toast.error("Có lỗi khi lấy supplier.")
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (orignalSelectedSupplier) {
            setSelectedSupplier(orignalSelectedSupplier);
        }
    }, [orignalSelectedSupplier])

    useEffect(() => {
        if (supplierSelectModalOpen && supplierList?.length < 1 && !loading) {
            fetchData();
            // Cleanup function to abort fetch if component unmounts or modal closes
            return () => {
                controller.abort();
            };
        }
    }, [supplierSelectModalOpen]);

    useEffect(() => {
        if (selectedSupplier) {
            handleConfirmModal();
        }
    }, [selectedSupplier])

    // Refresh button handler
    const handleRefresh = () => {
        fetchData();
    }

    return (
        <Dialog ref={dialogRef}
            header={capitalizeWords(tD('select')) + ' ' + capitalizeWords(tD('supplier'))}
            visible={supplierSelectModalOpen}
            onHide={handleHideModal}
            maximizable
            style={{ width: '80vw', minHeight: '80vh', minWidth: '20vw' }}
            className='!max-h-full'
            contentStyle={{ height: '80vh' }}
            baseZIndex={10000}
            breakpoints={{ '960px': '80vw', '641px': '100vw' }}
            footer={renderDFooter}
        >
            <div>
                <DataTable
                    header={renderTHeader}
                    footer={renderTFooter}
                    paginator
                    rows={10}
                    scrollable
                    scrollHeight="flex"
                    rowsPerPageOptions={[10, 25, 50, 100]}
                    filters={filters}
                    loading={loading}
                    selectionMode={null}
                    className="list-table !max-h-full"
                    value={businessBPList}
                    showGridlines
                    tableStyle={{ minWidth: '50rem' }}
                    selection={selectedSupplier}
                    onSelectionChange={(e) => { setSelectedSupplier(e.value) }}
                    dataKey="CardCode"
                >
                    <Column selectionMode="single" headerStyle={{ width: '3rem' }}></Column>
                    <Column headerStyle={{ width: '3rem' }} body={(rowData, row) => (<>{row.rowIndex + 1}</>)}></Column>
                    <Column field="CardCode" header={tD('supplierCode')}></Column>
                    <Column field="CardName" header={tD('supplierName')}></Column>
                    <Column header={tD('supplierBalance')} body={(rowData) => (<>{formatNumberWithComma(rowData.CurrentAccountBalance)}</>)}></Column>
                    <Column field="Currency" header={tD('currency')} body={(rowData) => (<>{rowData.Currency}</>)}></Column>
                </DataTable>
            </div>
        </Dialog>
    )
}

export default SupplierList