import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode, FilterService } from 'primereact/api'
import { nanoid } from 'nanoid';
import toast from 'react-hot-toast';

import { formatNumberWithComma } from '@/utils/number';

const CustomerList = (props) => {
    const { customerSelectModalOpen, setCustomerSelectModalOpen, customerList: CustomerList, orignalSelectedCustomer, setCustomer } = props;
    // const [itemList, setItemList] = useState(ItemList);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    const dialogRef = useRef(null);

    const handleConfirmModal = () => {
        setCustomer(selectedCustomer.CardCode);
        setCustomerSelectModalOpen(false);
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
            <div className="flex justify-content-end">
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
                </span>
            </div>
        );
    };

    const renderDFooter = () => {
        // !Problem: Xử lý trigger click close button
        // console.log("Hì: ", dialogRef.current.getCloseButton.click());

        return (
            <div>
                <Button label="Cancel" icon="pi pi-times" onClick={(e) => handleHideModal()} className="p-button-text" />
                <Button label="Choose" disabled={!selectedCustomer} icon="pi pi-check" onClick={handleConfirmModal} autoFocus />
            </div>
        )
    };

    const handleHideModal = () => {
        setCustomerSelectModalOpen(false)
        setSelectedCustomer(orignalSelectedCustomer);
    }

    useEffect(() => {
        if (orignalSelectedCustomer) {
            setSelectedCustomer(orignalSelectedCustomer);
        }
    }, [orignalSelectedCustomer])

    return (
        <Dialog ref={dialogRef} header="Select Customer" visible={customerSelectModalOpen} onHide={handleHideModal} maximizable
            style={{ width: '75vw', minHeight: '75vh' }} contentStyle={{ height: '75vh' }} breakpoints={{ '960px': '80vw', '641px': '100vw' }} footer={renderDFooter}>
            <div>
                <DataTable header={renderTHeader} paginator rows={10} scrollable scrollHeight="flex" rowsPerPageOptions={[10, 25, 50, 100]} filters={filters} loading={loading} selectionMode={null} className="list-table" value={CustomerList} showGridlines tableStyle={{ minWidth: '50rem' }} selection={selectedCustomer} onSelectionChange={(e) =>  {setSelectedCustomer(e.value)}} dataKey="CardCode">
                    <Column selectionMode="single" headerStyle={{ width: '3rem' }}></Column>
                    <Column field="CardCode" header="Customer Code"></Column>
                    <Column field="CardName" header="Customer Name"></Column>
                    <Column header="Customer Balance" body={(rowData) => (<>{formatNumberWithComma(rowData.CurrentAccountBalance) + " " + rowData.Currency}</>)}></Column>
                    <Column field="Currency" header="Currency" body={(rowData) => (<>{rowData.Currency}</>)}></Column>
                </DataTable>
            </div>
        </Dialog>
    )
}

export default CustomerList