import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { InputText  } from 'primereact/inputtext';
import { FilterMatchMode, FilterService } from 'primereact/api'
import { nanoid } from 'nanoid';
import toast from 'react-hot-toast';

const ItemList = (props) => {
    const { itemSelectModalOpen, setItemSelectModalOpen, itemList: ItemList, selectedItemRow, setItem } = props;
    const [itemList, setItemList] = useState(ItemList);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    const handleConfirmModal = () => {
        toast.success("Confirm");
        const choosenItem = {...selectedItem};
        setItem(choosenItem);
        setItemSelectModalOpen(false);

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

    const renderDFooter =  () => {return (
        <div>
            <Button label="Cancel" icon="pi pi-times" onClick={() => setItemSelectModalOpen(false)} className="p-button-text" />
            <Button label="Yes" disabled={!selectedItem} icon="pi pi-check" onClick={handleConfirmModal} autoFocus />
        </div>
    )};

    useEffect(() => {
        if (selectedItemRow) {
            setSelectedItem(selectedItemRow);
        }
    }, [selectedItemRow])

    return (
        <Dialog header="Select Item" visible={itemSelectModalOpen} onHide={() => setItemSelectModalOpen(false)}
            style={{ width: '75vw' }} breakpoints={{ '960px': '80vw', '641px': '100vw' }} footer={renderDFooter}>
            <div>
                <DataTable header={renderTHeader} paginator rows={10} rowsPerPageOptions={[10, 25, 50, 100]} filters={filters} loading={loading} selectionMode={'radiobutton'} className="list-table" value={itemList} showGridlines tableStyle={{ minWidth: '50rem' }} selection={selectedItem} onSelectionChange={(e) => setSelectedItem(e.value)} dataKey="id">
                    <Column selectionMode="single" headerStyle={{ width: '3rem' }}></Column>
                    <Column field="id" header="Code"></Column>
                    <Column field="name" header="Name"></Column>
                    <Column field="category" header="Category"></Column>
                    <Column field="vendor" header="Vendor"></Column>
                </DataTable>
            </div>
        </Dialog>
    )
}

export default ItemList