import React, { useState, useEffect } from 'react';
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

const SELECT = ["AttachmentEntry", "DefaultWarehouse", "ItemCode", "ItemClass", "ItemName", "ForeignName",
    "ItemWarehouseInfoCollection", "ItemPrices", "IssueMethod", "ItemType", "ItemDistributionRules", "Picture",
    "ManageBatchNumbers", "ManageByQuantity", "ManageSerialNumbers", "ManageStockByWarehouse", "QuantityOnStock",
    "SalesItem", "SalesVATGroup", "SalesUnit", "PurchaseItem", "PurchaseUnit", "PurchaseVATGroup"]

const docTypeFilters = {
    "sales": ["SalesItem eq 'tYES'"],
    "purchase": ["PurchaseItem eq 'tYES'"]
}
const ItemList = (props) => {
    const { docType, itemSelectModalOpen, setItemSelectModalOpen, itemList, selectedItemRow, setItem, setItemList } = props;
    // const [itemList, setItemList] = useState(ItemList);
    const controller = new AbortController();
    const signal = controller.signal;

    const tD = useTranslations("Dialog");
    const tG = useTranslations("General");

    const [dataList, setDataList] = useState(itemList || [])
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedItem, setSelectedItem] = useState([]);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    const handleConfirmModal = () => {
        // toast.success("Confirm");
        // const choosenItem = { ...selectedItem };
        console.log([...selectedItem])
        setItem([...selectedItem]);
        setItemSelectModalOpen(false);
        setSelectedItem([]);
        setGlobalFilterValue("");
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
            <div className="flex justify-content-end gap-4 items-center">
                <Button disabled={loading} icon="pi pi-refresh" rounded raised onClick={handleRefresh} />
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder={capitalizeWords(tG("keywordSearch"))} />
                </span>
            </div>
        );
    };

    const renderTFooter = () => {
        return (
            <div className='flex gap-4 items-center'>
                <div className='flex gap-2 items-center'>
                    <span><b>{capitalizeWords(tD("totalSelected"))}</b></span>
                    <Badge className='text-base' severity="success" value={selectedItem?.length || 0}></Badge>
                </div>
                <div className='flex gap-2 items-center'>
                    <span><b>{capitalizeWords(tD("totalItem"))}</b></span>
                    <Badge className='text-base' value={dataList?.length || 0}></Badge>
                </div>
            </div>
        )
    }

    const renderDFooter = () => {
        return (
            <div>
                <Button label={tG("cancel")} icon="pi pi-times" onClick={handleHideModal} className="p-button-text" />
                <Button label={tG("choose")} disabled={selectedItem?.length <= 0} icon="pi pi-check" onClick={handleConfirmModal} autoFocus />
            </div>
        )
    };

    const handleHideModal = () => {
        setItemSelectModalOpen(false)
        setSelectedItem([]);
        setGlobalFilterValue("");
    }

    useEffect(() => {
        if (selectedItemRow && selectedItemRow.ItemCode) {
            //     console.log("bà: ", selectedItemRow);
            setSelectedItem([selectedItemRow]);
        }
    }, [selectedItemRow])

    // useEffect(() => {
    //     if (itemSelectModalOpen && itemList?.length < 1 && !loading) {
    //         const controller = new AbortController(); // Tạo AbortController để hủy yêu cầu nếu cần
    //         const signal = controller.signal; // Lấy signal để truyền vào fetch

    //         (async () => {
    //             try {
    //                 setLoading(true);
    //                 const queryProps = {};
    //                 const res = await fetch('/api/inventory/get-item', {
    //                     method: 'POST',
    //                     headers: {
    //                         'Content-Type': 'application/json',
    //                     },
    //                     credentials: 'include',
    //                     // body: JSON.stringify(queryProps)
    //                     signal
    //                 });

    //                 if (!res.ok) {
    //                     throw new Error(`HTTP error! status: ${res.status}`);
    //                 }

    //                 const dataResult = await res.json();
    //                 setItemList(dataResult.value);
    //                 setDataList(dataResult.value);
    //             } catch (error) {
    //                 if (error.name !== 'AbortError') {
    //                     // Chỉ log lỗi nếu không phải là lỗi Abort
    //                     console.error(error);
    //                     toast.error("Có lỗi khi lấy supplier.");
    //                 }
    //             } finally {
    //                 setLoading(false);
    //             }
    //         })();

    //         // Cleanup function để hủy yêu cầu fetch nếu component unmount hoặc modal bị đóng
    //         return () => {
    //             controller.abort();
    //         };
    //     }
    // }, [itemSelectModalOpen]);

    // Helper function to fetch items with optional top and skip parameters

    const fetchItems = async (top = 1000, skip = 0) => {
        const props = {
            select: SELECT,
            top,
            skip
        }

        if (docType) {
            props.filter = docTypeFilters[docType]
        }

        console.log("Xin tì: ", props)
        const res = await fetch('/api/inventory/get-item', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(props),
            signal
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

    // Function to handle the full fetch logic
    const fetchData = async () => {
        try {
            setLoading(true);

            // Fetch the initial item count
            const countRes = await fetch('/api/inventory/get-item-count', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                signal
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
                    setDataList(items);
                    setLoading(false);
                }
            } else if (itemList?.length > 1 && itemList?.length !== countData) {
                // Case when item list is not empty but length doesn't match count
                if (countData > 1000) {
                    const combinedResults = await fetchAllItemsInBatches(countData);
                    setItemList(combinedResults);
                    setDataList(combinedResults);
                } else {
                    const items = await fetchItems(countData);
                    setItemList(items);
                    setDataList(items);
                    setLoading(false);
                }
            }
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error(error);
                // toast.error("Có lỗi khi lấy dữ liệu.");
            }
        } finally {
            // if (itemList?.length >= itemCount || itemCount <= 1000) {
            setLoading(false);
            // }
        }
    };

    // useEffect to handle initial data fetching
    useEffect(() => {
        if (itemSelectModalOpen) {
            fetchData();

            // Cleanup function to abort fetch if component unmounts or modal closes
            return () => {
                controller.abort();
            };
        }
    }, [itemSelectModalOpen]);

    // Refresh button handler
    const handleRefresh = () => {
        fetchData();
    }

    return (
        <Dialog
            header={capitalizeWords(tD("selectItem"))}
            visible={itemSelectModalOpen}
            onHide={handleHideModal}
            maximizable
            style={{ width: '80vw', minHeight: '80vh' }}
            contentStyle={{ height: '80vh' }}
            className='!max-h-full'
            baseZIndex={10000}
            breakpoints={{ '960px': '80vw', '641px': '100vw' }}
            footer={renderDFooter}
            blockScroll
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
                    selectionMode={'checkbox'}
                    className="list-table"
                    value={dataList}
                    showGridlines
                    tableStyle={{ minWidth: '50rem' }}
                    selection={selectedItem}
                    onSelectionChange={(e) => setSelectedItem(e.value)}
                    dataKey="ItemCode"
                >
                    <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                    <Column headerStyle={{ width: '3rem' }} body={(rowData, row) => (<>{row.rowIndex + 1}</>)}></Column>
                    <Column field="ItemCode" header={capitalizeWords(tD("itemCode"))}></Column>
                    <Column field="ItemName" header={capitalizeWords(tD("itemName"))}></Column>
                    <Column field="ItemClass" header={capitalizeWords(tD("itemClass"))} body={(rowData) => (<>{rowData.ItemClass.substring(3)}</>)}></Column>
                    <Column field="QuantityOnStock" header={capitalizeWords(tD("onStock"))} body={(rowData) => (<>{formatNumberWithComma(rowData.QuantityOnStock)}</>)}></Column>
                </DataTable>
            </div>
        </Dialog>
    )
}

export default ItemList