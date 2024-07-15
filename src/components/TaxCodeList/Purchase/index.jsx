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

const PurchaseTaxCodeList = (props) => {
  const { taxCodeSelectModalOpen, setTaxCodeSelectModalOpen, taxCodeList: TaxCodeList, selectedTaxCodeRow, setTaxCode } = props;
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedTaxCode, setSelectedTaxCode] = useState([]);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const handleConfirmModal = () => {
    // toast.success("Confirm");
    // const choosenTaxCode = { ...selectedTaxCode };
    // console.log([...selectedTaxCode])
    setTaxCode({ ...selectedTaxCode });
    setTaxCodeSelectModalOpen(false);
    setSelectedTaxCode(null);
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
        <Button label="Cancel" icon="pi pi-times" onClick={() => setTaxCodeSelectModalOpen(false)} className="p-button-text" />
        <Button label="Choose" disabled={!selectedTaxCode} icon="pi pi-check" onClick={handleConfirmModal} autoFocus />
      </div>
    )
  };

  const handleHideModal = () => {
    setTaxCodeSelectModalOpen(false)
    setSelectedTaxCode(null);
  }

  useEffect(() => {
    if (selectedTaxCodeRow && selectedTaxCodeRow.TaxCodeCode) {
      //     console.log("bà: ", selectedTaxCodeRow);
      setSelectedTaxCode(TaxCodeList?.find(tax => tax.Code == selectedTaxCodeRow.TaxCode));
    }
  }, [selectedTaxCodeRow])

  return (
    <Dialog
      header="Select Tax Code"
      visible={taxCodeSelectModalOpen}
      onHide={handleHideModal}
      maximizable
      style={{ width: '75vw', minHeight: '75vh' }}
      contentStyle={{ height: '75vh' }}
      breakpoints={{ '960px': '80vw', '641px': '100vw' }}
      footer={renderDFooter}
      blockScroll
    >
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
          value={TaxCodeList}
          showGridlines
          tableStyle={{ minWidth: '50rem' }}
          selection={selectedTaxCode}
          onSelectionChange={(e) => setSelectedTaxCode(e.value)}
          dataKey="TaxCode"
        >
          <Column selectionMode="single" headerStyle={{ width: '3rem' }}></Column>
          <Column field="Code" header="Tax Code"></Column>
          <Column field="Name" header="Tax Name"></Column>
          <Column field="Rate" header="Rate" body={(tax) => (<>{tax?.VatGroups_Lines[0]?.Rate ? tax?.VatGroups_Lines[0]?.Rate + " %" : ""}</>)}></Column>
          {/* <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
          <Column field="TaxCode" header="Tax Code"></Column>
          <Column field="TaxCodeName" header="TaxCode Name"></Column>
          <Column field="TaxCodeClass" header="TaxCode Class" body={(rowData) => (<>{rowData.TaxCodeClass.substring(3)}</>)}></Column>
          <Column field="QuantityOnStock" header="On Stock" body={(rowData) => (<>{formatNumberWithComma(rowData.QuantityOnStock)}</>)}></Column> */}
        </DataTable>
      </div>
    </Dialog>
  )
}

export default PurchaseTaxCodeList