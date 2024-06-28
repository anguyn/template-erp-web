import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode, FilterService } from 'primereact/api'
import { nanoid } from 'nanoid';
import toast from 'react-hot-toast';

import { formatNumberWithComma } from '@/utils/number';

const ItemList = (props) => {
    const { itemSelectModalOpen, setItemSelectModalOpen, itemList: ItemList, selectedItemRow, setItem } = props;
    // const [itemList, setItemList] = useState(ItemList);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedItem, setSelectedItem] = useState([]);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    const handleConfirmModal = () => {
        toast.success("Confirm");
        // const choosenItem = { ...selectedItem };
        console.log([...selectedItem])
        setItem([...selectedItem]);
        setItemSelectModalOpen(false);
        setSelectedItem([]);
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
        return (
            <div>
                <Button label="Cancel" icon="pi pi-times" onClick={handleHideModal} className="p-button-text" />
                <Button label="Choose" disabled={selectedItem?.length <= 0} icon="pi pi-check" onClick={handleConfirmModal} autoFocus />
            </div>
        )
    };

    const handleHideModal = () => {
        setItemSelectModalOpen(false)
        setSelectedItem([]);
    }

    useEffect(() => {
        if (selectedItemRow && selectedItemRow.ItemCode) {
            //     console.log("bà: ", selectedItemRow);
            setSelectedItem([selectedItemRow]);
        }
    }, [selectedItemRow])

    return (
        <Dialog
            header="Select Item"
            visible={itemSelectModalOpen}
            onHide={handleHideModal}
            maximizable
            style={{ width: '75vw', minHeight: '75vh' }}
            contentStyle={{ height: '75vh' }}
            breakpoints={{ '960px': '80vw', '641px': '100vw' }}
            footer={renderDFooter}>
            <div>
                <DataTable
                    header={renderTHeader}
                    paginator
                    rows={10}
                    scrollable
                    scrollHeight="flex"
                    rowsPerPageOptions={[10, 25, 50, 100]}
                    filters={filters}
                    loading={loading}
                    selectionMode={'checkbox'}
                    className="list-table"
                    value={ItemList}
                    showGridlines
                    tableStyle={{ minWidth: '50rem' }}
                    selection={selectedItem}
                    onSelectionChange={(e) => setSelectedItem(e.value)}
                    dataKey="ItemCode"
                >
                    <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                    <Column field="ItemCode" header="Item Code"></Column>
                    <Column field="ItemName" header="Item Name"></Column>
                    <Column field="ItemClass" header="Item Class" body={(rowData) => (<>{rowData.ItemClass.substring(3)}</>)}></Column>
                    <Column field="QuantityOnStock" header="On Stock" body={(rowData) => (<>{formatNumberWithComma(rowData.QuantityOnStock)}</>)}></Column>
                </DataTable>
            </div>
        </Dialog>
    )
}

export default ItemList