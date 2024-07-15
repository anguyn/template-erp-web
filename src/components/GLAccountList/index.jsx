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

const GLAccountList = (props) => {
    const { glAccountSelectModalOpen, setGLAccountSelectModalOpen, glAccountList, selectedItemRow, setAccount, setGLAccountList } = props;
    // const [glAccountList, setGLAccountList] = useState(ItemList);
    const [dataList, setDataList] = useState(glAccountList || [])
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    const handleConfirmModal = () => {
        toast.success("Confirm");
        // const choosenItem = { ...selectedItem };
        console.log({...selectedItem})
        setAccount({...selectedItem});
        setGLAccountSelectModalOpen(false);
        setSelectedItem(null);
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
                <Button label="OK" icon="pi pi-check" onClick={handleConfirmModal} autoFocus />
            </div>
        )
    };

    const handleHideModal = () => {
        setGLAccountSelectModalOpen(false)
        setSelectedItem(null);
    }

    useEffect(() => {
        if (selectedItemRow && selectedItemRow.GLAccount) {
            //     console.log("bà: ", selectedItemRow);
            setSelectedItem(glAccountList?.find(gl => gl.AcctCode == selectedItemRow.GLAccount));
        }
    }, [selectedItemRow])

    // useEffect(() => {
    //     if (selectedItem) {
    //         handleConfirmModal();
    //     }
    // }, [selectedItem]);


    useEffect(() => {
        if (glAccountSelectModalOpen && glAccountList?.length < 1 && !loading) {
            (async () => {
                try {
                    setLoading(true);
                    const queryProps = {
                        select: ['AcctCode', 'AcctName', 'FrgnName', 'CurrTotal', 'EndTotal', 'ActCurr']
                    };
                    const res = await fetch('/api/company/get-document-coa', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include',
                        body: JSON.stringify(queryProps)
                    });
                    const dataResult = await res.json();
                    setGLAccountList(dataResult.value);
                    setDataList(dataResult.value);
                } catch (error) {
                    console.error(error);
                    toast.error("Có lỗi khi lấy gl account.")
                } finally {
                    setLoading(false);
                }
            })()
        }
    }, [glAccountSelectModalOpen])

    return (
        <Dialog
            header="Select G/L Account"
            visible={glAccountSelectModalOpen}
            onHide={handleHideModal}
            maximizable
            style={{ width: '80vw', minHeight: '80vh' }}
            className='!max-h-full'
            baseZIndex={10000}
            contentStyle={{ height: '80vh' }}
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
                    value={dataList}
                    showGridlines
                    tableStyle={{ minWidth: '50rem' }}
                    selection={selectedItem}
                    onSelectionChange={(e) => {console.log("Dô hong: ", e.value); setSelectedItem(e.value)}}
                    dataKey="AcctCode"
                >
                    <Column selectionMode="single" headerStyle={{ width: '3rem' }}></Column>
                    <Column field="AcctCode" header="Account Code"></Column>
                    <Column field="AcctName" header="Account Name"></Column>
                    <Column field="FrgnName" header="Account Name (en)"></Column>
                    <Column field="CurrTotal" header="Current Total" body={(rowData) => (<>{formatNumberWithComma(rowData.CurrTotal)}</>)}></Column>
                    <Column field="EndTotal" header="End Total" body={(rowData) => (<>{formatNumberWithComma(rowData.EndTotal)}</>)}></Column>
                    <Column field="ActCurr" header="Account Currency"></Column>
                </DataTable>
            </div>
        </Dialog>
    )
}

export default GLAccountList