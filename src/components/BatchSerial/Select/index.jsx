import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Fieldset } from 'primereact/fieldset';
import { FilterMatchMode, FilterService } from 'primereact/api';
import { PickList } from 'primereact/picklist';
import { Skeleton } from 'primereact/skeleton';

import { nanoid } from 'nanoid';
import toast from 'react-hot-toast';

import salesApi from '@/service/ServiceLayer/salesApi';

import { formatNumberWithComma } from '@/utils/number';

function BatchSerialSelection(props) {
    const { batchSerialModalOpen, documentRow, item, warehouse, rowInfo, setBatchSerialModalOpen, setBatchSelections, setSerialSelections } = props
    // const { ManageSerialNumbers, ManageBatchNumbers, ManageByQuantity } = item;
    console.log("Ngứa: ", item);
    const [originalBatchList, setOriginalBatchList] = useState([]);
    const [exampleBatchList, setExampleBatchList] = useState(Array.from({ length: 5 }, (v, i) => i));
    const [batchList, setBatchList] = useState(Array.from({ length: 5 }, (v, i) => i));

    const [originalBatchListSerialSource, setOriginalSerialSource] = useState([]);
    const [serialSource, setSerialSource] = useState([]);
    const [serialTarget, setSerialTarget] = useState((item && item.SerialNumbers) || []);
    const [totalAllocatedQuantity, setTotalAllocatedQuantity] = useState(0);
    const [loading, setLoading] = useState(true);

    const handleHideModal = () => {
        setBatchSerialModalOpen(false);
        setSerialTarget([]);
    }

    const handleSelectAutomatically = () => {
        if (item?.ManageBatchNumbers) {
            if (totalAllocatedQuantity === item?.Quantity) {
                return;
            }

            // Kiểm tra tổng Quantity của toàn bộ batchList có >= item?.Quantity không
            const totalQuantity = batchList.reduce((sum, batch) => sum + batch.Quantity, 0);
            if (totalQuantity < item?.Quantity) {
                toast.error("There is not enough serial number for selection.");
                return;
            }

            // Bắt đầu phân bổ
            let remainingToAllocate = item?.Quantity - totalAllocatedQuantity; // Số lượng cần phân bổ thêm

            // Duyệt qua batchList và cập nhật SelectedQuantity
            const updatedBatchList = batchList.map(batch => {
                if (remainingToAllocate > 0) {
                    // Tính số lượng có thể thêm vào SelectedQuantity mà không vượt quá Quantity
                    const availableToAllocate = batch.Quantity - batch.SelectedQuantity;
                    const allocation = Math.min(remainingToAllocate, availableToAllocate);

                    // Cập nhật SelectedQuantity của batch
                    remainingToAllocate -= allocation;
                    return { ...batch, SelectedQuantity: batch.SelectedQuantity + allocation };
                }
                return batch; // Trả lại batch không thay đổi nếu không cần phân bổ thêm
            });

            setBatchList(updatedBatchList);

            toast.success("Batch number automatically selected.");

            return;
        }
        if (item?.ManageSerialNumbers) {
            if (serialTarget.length === item?.Quantity) {
                return;
            }

            if (serialTarget.length > item?.Quantity) {
                // Tìm số lượng phần tử thừa
                const excessCount = serialTarget.length - item?.Quantity;

                // Chuyển phần tử thừa từ serialTarget về serialSource
                const itemsToReturn = serialTarget.slice(-excessCount);
                const updatedSerialTarget = serialTarget.slice(0, item?.Quantity);

                // Cập nhật state
                setSerialSource([...serialSource, ...itemsToReturn]);
                setSerialTarget(updatedSerialTarget);

                toast.success("Serial numbers automatically adjusted.");
                return;
            }

            if (serialSource.length < item?.Quantity - serialTarget.length) {
                toast.error("There is not enough serial number for selection.");
                return;
            }

            // Số lượng phần tử cần chuyển từ serialSource vào serialTarget
            const neededCount = item?.Quantity - serialTarget.length;

            // Chuyển `neededCount` phần tử từ serialSource sang serialTarget
            const itemsToTransfer = serialSource.slice(0, neededCount);
            const updatedSerialSource = serialSource.slice(neededCount);

            // Cập nhật state
            setSerialSource(updatedSerialSource);
            setSerialTarget([...serialTarget, ...itemsToTransfer]);

            toast.success("Serial numbers automatically selected.");
            return;
        }

    }

    const handleConfirmModal = () => {
        if (totalAllocatedQuantity > item?.Quantity) {
            toast.error("Please allocate items with correct quantity.");
            return;
        }
        if (item?.ManageBatchNumbers) {
            setBatchSelections(batchList.filter(b => b.SelectedQuantity));
            toast.success("Batch numbers have been allocated.");
            setBatchSerialModalOpen(false);
            return;
        }
        if (item?.ManageSerialNumbers) {
            setSerialSelections(serialTarget);
            setSerialTarget([]);
            toast.success("Serial numbers have been allocated.");
            setBatchSerialModalOpen(false);
            return;
        }
        const choosenItem = [...serialTarget];
        // setSelections(choosenItem);
    }

    const renderDFooter = () => {
        return (
            <div>
                <Button label="Select Automatically" icon="pi pi-list-check" severity="help" outlined className="p-button-text" onClick={handleSelectAutomatically} />
                <Button label="Cancel" icon="pi pi-times" onClick={() => setBatchSerialModalOpen(false)} className="p-button-text" />
                <Button label="Choose" disabled={!totalAllocatedQuantity} icon="pi pi-check" onClick={handleConfirmModal} autoFocus />
            </div>
        )
    };

    const onSerialChange = (event) => {
        setSerialSource(event.source);
        setSerialTarget(event.target);
    };

    const BatchSelectedQuantityTemplate = (product) => {
        const handleEditSelectedQuantity = (e) => {
            setBatchList(prev => (prev.map(content => {
                if (content.BatchNum == product.BatchNum) {
                    return { ...content, SelectedQuantity: e.target.value }
                } else return content;
            })));
        }
        return <InputNumber inputId="integeronly" className="w-full text-right p-inputtext-sm" min={0} max={product?.Quantity} showButtons value={product.SelectedQuantity} onValueChange={handleEditSelectedQuantity} />
    };

    const serialItemTemplate = (item) => {
        return (
            <div className="flex flex-wrap p-2 align-items-center gap-3">
                <span className="font-bold text-900">{item.IntrSerial}</span>
                {/* <div className="flex-1 flex flex-column gap-2">
                    <span className="font-bold">{item.SerialNumber}</span>
                </div> */}
            </div>
        );
    };

    useEffect(() => {
        const total = batchList.reduce((acc, curr) => {
            return acc + (curr.SelectedQuantity || 0);
        }, 0);
        setTotalAllocatedQuantity(total);
    }, [batchList])

    useEffect(() => {
        setTotalAllocatedQuantity(serialTarget?.length);
    }, [serialTarget])

    useEffect(() => {
        if (item?.Warehouse && item?.ItemCode && batchSerialModalOpen) {
            (async () => {
                try {
                    if (item?.ManageBatchNumbers) {
                        const queryProps = {
                            filter: [`ItemCode eq '${item?.ItemCode}'`, `WhsCode eq '${item?.Warehouse?.code}'`]
                        };
                        const res = await salesApi.getAllBatchNumber(queryProps);
                        const batchList = res.value;
                        let mergedArray;
                        if (item?.BatchNumbers.length > 0) {
                            const test2Map = new Map(item?.BatchNumbers.map(item => [item.BatchNum, item]));
                            mergedArray = batchList.map(item => {
                                const matchingItem = test2Map.get(item.BatchNum);
                                return {
                                    ...item,
                                    SelectedQuantity: matchingItem ? matchingItem.SelectedQuantity : null
                                };
                            });
                        } else mergedArray = [...batchList];
                        setBatchList(mergedArray);
                        console.log("Res: ", res.value)
                    } else {
                        const queryProps = {
                            filter: [`ItemCode eq '${item?.ItemCode}'`, `WhsCode eq '${item?.Warehouse?.code}'`]
                        };
                        const res = await salesApi.getAllSerialNumber(queryProps);
                        const serialList = res?.value;
                        console.log("Moẹ 1: ", serialList);

                        if (item?.SerialNumbers.length > 0) {
                            const serialMap = new Map(item?.SerialNumbers.map(serial => [serial.IntrSerial, serial.IntrSerial]));
                            console.log("Test: ", serialMap);
                            const updatedSerialSource = [];
                            const updatedSerialTarget = [];

                            serialList.forEach(serialItem => {
                                if (serialMap.has(serialItem.IntrSerial)) {
                                    updatedSerialTarget.push(serialItem);
                                } else {
                                    updatedSerialSource.push(serialItem);
                                }
                            });
                            console.log("Moẹ 2: ", updatedSerialSource)

                            console.log("Moẹ 3: ", updatedSerialTarget);

                            // Cập nhật state
                            setSerialSource(updatedSerialSource);
                            setSerialTarget([...serialTarget, ...updatedSerialTarget]);

                            toast.success("Serial numbers updated based on item selection.");
                        } else {
                            // Nếu không có serial numbers trong item, giữ nguyên toàn bộ trong serialSource
                            setSerialSource(serialList);
                        }

                        console.log("Serial Res: ", res.value);
                    }
                } catch (error) {
                    console.error(error);
                    toast.error("There was an error occurred.");
                    return;
                } finally {
                    setLoading(false);
                }
            })();
        }
    }, [item, batchSerialModalOpen])

    return (
        <Dialog header="Select Batch/Serial Number" visible={batchSerialModalOpen} onHide={handleHideModal} maximizable
            style={{ width: '75vw', minHeight: '75vh' }} contentStyle={{ height: '75vh' }} breakpoints={{ '960px': '80vw', '641px': '100vw' }} footer={renderDFooter}>
            {
                item?.ManageBatchNumbers && (
                    <div className='flex flex-col h-full'>
                        <Fieldset
                            legend="Item Information"
                        // className='card'
                        >
                            <div className='flex flex-row gap-2'>
                                <div className='basis-1/2 flex flex-col gap-4'>
                                    <div className='flex flex-row'>
                                        <label className='basis-1/2 text-lg'>Document Row</label>
                                        <span className='text-lg'>{formatNumberWithComma(item.rowIndex + 1)}</span>
                                    </div>
                                    <div className='flex flex-row'>
                                        <label className='basis-1/2 text-lg'>Item Code</label>
                                        <span className='text-lg'>{item?.ItemCode || '-'}</span>
                                    </div>
                                    <div className='flex flex-row'>
                                        <label className='basis-1/2 text-lg'>Item Description</label>
                                        <span className='text-lg'>{item?.ItemDescription || '-'}</span>
                                    </div>
                                    <div className='flex flex-row'>
                                        <label className='basis-1/2 text-lg'>Warehouse Code</label>
                                        <span className='text-lg'>{item?.Warehouse?.code || '-'}</span>
                                    </div>
                                </div>

                                <div className='basis-1/2 flex flex-col gap-4'>
                                    <div className='flex flex-row'>
                                        <label className='basis-1/2 text-lg'>Warehouse Name</label>
                                        <span className='text-lg'>{item?.Warehouse?.name || '-'}</span>
                                    </div>
                                    <div className='flex flex-row'>
                                        <label className='basis-1/2 text-lg'>Quantity</label>
                                        <span className='text-lg'>{formatNumberWithComma(item?.Quantity) || 0}</span>
                                    </div>
                                    <div className='flex flex-row'>
                                        <label className={`basis-1/2 text-lg ${(totalAllocatedQuantity > item?.Quantity) && 'font-semibold text-red-600'}`}>Allocated Total</label>
                                        <span className={`text-lg ${(totalAllocatedQuantity > item?.Quantity) && 'font-semibold text-red-600'}`}>{formatNumberWithComma(totalAllocatedQuantity)}</span>
                                    </div>
                                    <div className='flex flex-row'>
                                        <label className='basis-1/2 text-lg'>Display Quantites By</label>
                                        <span className='text-lg'>1</span>
                                    </div>
                                </div>
                            </div>
                        </Fieldset>
                        <Fieldset
                            legend="Batch Allocation"
                            className='mt-4 flex-1'
                        >
                            {!loading ? (
                                <DataTable
                                    id="batch-selection-table"
                                    className="list-table p-datatable-gridlines"
                                    showGridlines
                                    value={batchList}
                                    tableStyle={{ minWidth: '50rem' }}
                                    dataKey="id__"
                                    stripedRows={true}
                                    resizableColumns
                                    columnResizeMode="expand"
                                    scrollable
                                    scrollHeight="500px"
                                    virtualScrollerOptions={{ itemSize: 46 }}
                                >
                                    <Column header="No." body={(rowData, row) => (<>{row.rowIndex + 1 || 0}</>)}></Column>
                                    <Column field="BatchNum" header="Batch"></Column>
                                    <Column field="Quantity" header="Available Quantity" body={item => (<>{formatNumberWithComma(item?.Quantity)}</>)}></Column>
                                    <Column header="Selected Quantity" body={BatchSelectedQuantityTemplate}></Column>
                                </DataTable>
                            ) : (
                                <DataTable
                                    id="batch-selection-example-table"
                                    className="list-table p-datatable-gridlines"
                                    showGridlines
                                    value={exampleBatchList}
                                    tableStyle={{ minWidth: '50rem' }}
                                    dataKey="id__"
                                    stripedRows={true}
                                    resizableColumns
                                    columnResizeMode="expand"
                                    scrollable
                                    scrollHeight="500px"
                                    virtualScrollerOptions={{ itemSize: 46 }}
                                >
                                    <Column header="No." body={<Skeleton />}></Column>
                                    <Column field="BatchNum" header="Batch" body={<Skeleton />}></Column>
                                    <Column field="Quantity" header="Available Quantity" body={<Skeleton />}></Column>
                                    <Column header="Selected Quantity" body={<Skeleton />}></Column>
                                </DataTable>
                            )}
                        </Fieldset>
                    </div>
                )
            }
            {
                item?.ManageSerialNumbers && (
                    <div className='flex flex-col h-full'>
                        <Fieldset
                            legend="Item Information"
                        // className='card'
                        >
                            <div className='flex flex-row gap-2'>
                                <div className='basis-1/2 flex flex-col gap-4'>
                                    <div className='flex flex-row'>
                                        <label className='basis-1/2 text-lg'>Document Row</label>
                                        <span className='text-lg'>{formatNumberWithComma(item.rowIndex + 1)}</span>
                                    </div>
                                    <div className='flex flex-row'>
                                        <label className='basis-1/2 text-lg'>Item Code</label>
                                        <span className='text-lg'>{item?.ItemCode || '-'}</span>
                                    </div>
                                    <div className='flex flex-row'>
                                        <label className='basis-1/2 text-lg'>Item Description</label>
                                        <span className='text-lg'>{item?.ItemDescription || '-'}</span>
                                    </div>
                                    <div className='flex flex-row'>
                                        <label className='basis-1/2 text-lg'>Warehouse Code</label>
                                        <span className='text-lg'>{item?.Warehouse?.code || '-'}</span>
                                    </div>
                                </div>

                                <div className='basis-1/2 flex flex-col gap-4'>
                                    <div className='flex flex-row'>
                                        <label className='basis-1/2 text-lg'>Warehouse Name</label>
                                        <span className='text-lg'>{item?.Warehouse?.name || '-'}</span>
                                    </div>
                                    <div className='flex flex-row'>
                                        <label className='basis-1/2 text-lg'>Quantity</label>
                                        <span className='text-lg'>{formatNumberWithComma(item?.Quantity) || 0}</span>
                                    </div>
                                    <div className='flex flex-row'>
                                        <label className={`basis-1/2 text-lg ${(totalAllocatedQuantity > item?.Quantity) && 'font-semibold text-red-600'}`}>Allocated Total</label>
                                        <span className={`text-lg ${(totalAllocatedQuantity > item?.Quantity) && 'font-semibold text-red-600'}`}>{formatNumberWithComma(totalAllocatedQuantity)}</span>
                                    </div>
                                    <div className='flex flex-row'>
                                        <label className='basis-1/2 text-lg'>Display Quantites By</label>
                                        <span className='text-lg'>1</span>
                                    </div>
                                </div>
                            </div>
                        </Fieldset>
                        <Fieldset
                            legend="Serial Number Allocation"
                            className='mt-4 flex-1'
                        >
                            <PickList dataKey="IntrSerial" source={serialSource} target={serialTarget} itemTemplate={serialItemTemplate} onChange={onSerialChange} breakpoint="1280px"
                                sourceHeader="Available" targetHeader="Selected" sourceStyle={{ height: '24rem' }} targetStyle={{ height: '24rem' }} />
                        </Fieldset>
                    </div>
                )
            }
        </Dialog>
    )
}

export default BatchSerialSelection