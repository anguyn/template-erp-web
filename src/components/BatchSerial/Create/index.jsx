import React, { useState, useEffect, useMemo, useRef } from 'react';
import { AutoComplete } from "primereact/autocomplete";
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { Card } from 'primereact/card';
import { Column } from 'primereact/column';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Calendar } from 'primereact/calendar';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Fieldset } from 'primereact/fieldset';
import { FilterMatchMode, FilterService } from 'primereact/api';
import { ListBox } from 'primereact/listbox';
import { Message } from 'primereact/message';
import { MultiSelect } from 'primereact/multiselect';
import { PickList } from 'primereact/picklist';
import { Skeleton } from 'primereact/skeleton';
import { SelectButton } from 'primereact/selectbutton';

import { nanoid } from 'nanoid';
import toast from 'react-hot-toast';

import { formatNumberWithComma } from '@/utils/number';

function BatchSerialCreation(props) {
    const { mode, batchSerialModalOpen, documentRow, item, warehouse, rowInfo, setBatchSerialModalOpen, setBatchCreations, setSerialCreations } = props
    // const { ManageSerialNumbers, ManageBatchNumbers, ManageByQuantity } = item;
    console.log("Ngứa: ", item);
    const stringTypes = [
        { name: 'String', code: 'String' },
        { name: 'Number', code: 'Number' }
    ];
    const stringOperations = [
        { name: 'No Operation', code: 'No Operation' },
        { name: 'Increase', code: 'Increase' },
        { name: 'Decrease', code: 'Decrease' }
    ];

    const stringInputRefs = useRef({});
    const [isPreventClose, setIsPreventClose] = useState(false);
    const [suggestions, setSuggestions] = useState(["String", "Number"]);
    const [originalBatchList, setOriginalBatchList] = useState([]);
    const [originalSerialList, setOriginalSerialList] = useState([]);
    const [selectedBatchNumbers, setSelectedBatchNumbers] = useState([]);
    const [batchList, setBatchList] = useState([
        {
            id__: nanoid(6),
            BatchNumber: null,
            Quantity: null,
            BatchAttribute1: null,
            BatchAttribute2: null,
            AdmissionDate: null,
            ManufacturingDate: null,
            ExpirationDate: null,
            Location: null,
            Details: null,
        }
    ]);
    const [serialList, setSerialList] = useState([
        {
            id__: nanoid(6),
            MfrSerialNo: null,
            IntrSerial: null,
            LotNumber: null,
            AdmissionDate: null,
            ManufacturingDate: null,
            ExpirationDate: null,
            MfrWarrantyStart: null,
            MfrWarrantyEnd: null,
            Location: null,
            Details: null
        }
    ]);
    const [selectedSerialNumbers, setSelectedSerialNumbers] = useState([]);
    const [totalAllocatedQuantity, setTotalAllocatedQuantity] = useState(0);
    const [loading, setLoading] = useState(true);

    const [batchColumnDialogOpen, setBatchColumnDialogOpen] = useState(false);
    const [serialColumnDialogOpen, setSerialColumnDialogOpen] = useState(false);
    const [automaticCreationModalOpen, setAutomaticCreationModalOpen] = useState(false);
    const [stringCreationModalOpen, setStringCreationModalOpen] = useState(false);
    const [currentBatchCreation, setCurrentBatchCreation] = useState(null);
    const [currentSerialNumberCreation, setCurrentSerialNumberCreation] = useState(null);
    /**
     *   1: Batch
     *   2: Batch Attribute 1
     *   3: Batch Attribute 2
     *   4. Mfr Serial Number
     *   5. Serial Number
     *   6. Lot Number
     */
    const [currentStringCategory, setCurrentStringCategory] = useState(null);
    const [automaticStringCriterias, setAutomaticStringCriterias] = useState([
        {
            No: 1,
            String: null,
            Type: "String",
            Operation: "No Operation",
        }
    ]);
    const [stringPrototype, setStringPrototype] = useState("");

    const handleHideBatchSerialCreationModal = () => {
        setBatchList([]);
        setSerialList([]);
        setSelectedBatchNumbers([]);
        setSelectedSerialNumbers([]);
        setBatchSerialModalOpen(false);
    }

    const handleHideAutomaticCreationModal = () => {
        setCurrentBatchCreation(null);
        setCurrentSerialNumberCreation(null);
        setAutomaticCreationModalOpen(false);
    }

    const handleHideStringCreationModal = (e) => {
        const finalCriterias = automaticStringCriterias?.filter(c => c.String);
        if (finalCriterias.length > 0) {
            confirmDialog({
                message: 'Are you sure you want to proceed?',
                header: 'Confirmation',
                icon: 'pi pi-exclamation-triangle',
                defaultFocus: 'accept',
                accept: handleCloseAutomaticStringModal
            });
        } else {
            console.log("Quan trọng là dô đây khum?")
            setAutomaticStringCriterias([
                {
                    No: 1,
                    String: null,
                    Type: "String",
                    Operation: "No Operation",
                }
            ])
            setStringCreationModalOpen(false);
        }
    }

    const handleConfirmBatchSerialCreationModal = () => {
        if (totalAllocatedQuantity > item?.Quantity) {
            toast.error("Please allocate items with correct quantity.");
            return;
        }
        if (totalAllocatedQuantity < item?.Quantity) {
            toast("You did not allocate enough quantity.");
        }
        if (item?.ManageBatchNumbers) {
            const batchCreations = batchList.filter(b => b.Quantity && b.BatchNumber);
            setBatchList(batchCreations);
            console.log("Batch nè: ", batchCreations);
            // return;
            setBatchCreations(batchCreations);
            toast.success("Batch numbers have been created.");
            setBatchSerialModalOpen(false);
            return;
        }
        if (item?.ManageSerialNumbers) {
            const serialCreations = serialList.filter(s => s.IntrSerial);
            setSerialList(serialCreations);
            console.log("Serial nè: ", serialCreations);
            // return;
            setSerialCreations(serialCreations);
            toast.success("Serial numbers have been created.");
            setBatchSerialModalOpen(false);
            return;
        }
    }

    const BatchSerialColumnOptionTemplate = (option) => {
        return (
            <>
                <div className="flex align-items-center gap-2">
                    <div>{option?.header}</div>
                </div>
            </>
        );
    };

    const onBatchColumnToggle = (e) => {
        const selectedColumns = e.value;
        const orderedSelectedColumns = batchContentColumns.filter((col) => selectedColumns.some((sCol) => sCol.field === col.field));

        setVisibleBatchColumns(orderedSelectedColumns);
    }

    const onSerialColumnToggle = (e) => {
        const selectedColumns = e.value;
        const orderedSelectedColumns = serialContentColumns.filter((col) => selectedColumns.some((sCol) => sCol.field === col.field));

        setVisibleSerialColumns(orderedSelectedColumns);
    }

    const renderCreationDFooter = () => {
        return (
            <div>
                {/* <Button label="Select Automatically" icon="pi pi-list-check" severity="help" outlined className="p-button-text" onClick={handleSelectAutomatically} /> */}
                <Button label="Cancel" icon="pi pi-times" onClick={() => setBatchSerialModalOpen(false)} className="p-button-text" />
                {
                    mode == "create" &&
                    (
                        <Button label="Confirm" disabled={!totalAllocatedQuantity} icon="pi pi-check" onClick={handleConfirmBatchSerialCreationModal} autoFocus />
                    )
                }
            </div>
        )
    };

    const renderAutomaticDFooter = () => {
        return (
            <div>
                <Button label="Cancel" icon="pi pi-times" className="p-button-text" />
                <Button
                    label="Create"
                    icon="pi pi-check"
                    autoFocus
                    onClick={handleCreateBatchSerialNumber}
                    disabled={currentBatchCreation?.Quantity == 0 || currentBatchCreation?.NoOfBatches == 0}
                />
            </div>
        )
    };

    const renderStringDFooter = () => {
        const confirm = (e) => {
            handleConfirmAutomaticString();
        }
        const cancel = (e) => {
            const finalCriterias = automaticStringCriterias?.filter(c => c.String);
            if (finalCriterias.length > 0) {
                confirmPopup({
                    target: e.currentTarget,
                    message: 'Are you sure you want to proceed?',
                    icon: 'pi pi-exclamation-triangle',
                    defaultFocus: 'accept',
                    accept: handleCloseAutomaticStringModal
                });
            } else {
                setStringCreationModalOpen(false);
            }
        }
        const clear = (e) => {
            const finalCriterias = automaticStringCriterias?.filter(c => c.String);
            if (finalCriterias.length > 0) {
                // confirmPopup({
                //     target: e.currentTarget,
                //     message: 'Are you sure you want to proceed?',
                //     icon: 'pi pi-exclamation-triangle',
                //     defaultFocus: 'accept',
                //     accept: () => {
                setAutomaticStringCriterias([
                    {
                        No: 1,
                        String: "",
                        Type: "String",
                        Operation: "No Operation",
                    }
                ])
                //     }
                // });
            }
        }

        return (
            <div className='flex flex-col gap-3'>
                <div>
                    <div className='sticky w-full -bottom-5'>
                        <Message
                            style={{
                                border: 'solid #696cff',
                                borderWidth: '0 0 0 6px',
                                color: '#696cff',
                            }}
                            className="border-primary w-full justify-content-start"
                            severity="info"
                            content={stringMessage}
                        />
                    </div>
                </div>
                <div>
                    <Button label="Clear" icon="pi pi-refresh" className="p-button-text" disabled={automaticStringCriterias.length == 1 || automaticStringCriterias?.filter(c => c.String).length < 1} onClick={clear} />
                    <Button label="Cancel" icon="pi pi-times" onClick={cancel} outlined />
                    <Button
                        label="OK"
                        // disabled={automaticStringCriterias.length == 1 || automaticStringCriterias?.filter(c => c.String).length < 1}
                        icon="pi pi-check"
                        onClick={confirm} autoFocus
                    />
                </div>
            </div>
        )
    };

    const BatchNumberTemplate = (product) => {
        const handleEditItemBatchNumber = (e) => {
            const value = e.target.value;
            // if (value) {
            setBatchList(prev => (prev.map(content => {
                if (content.id__ == product?.id__) {
                    return { ...content, BatchNumber: e.target.value }
                } else return content
            })));
            // if (batchList[batchList.length - 1].BatchNumber) {
            handleAddNewBatchRow();
            // }
            // } else {

            // }
        }
        return <InputText disabled={mode == "view"} className="w-full p-inputtext-sm" value={product?.BatchNumber} onChange={handleEditItemBatchNumber} />;
    };

    const BatchQuantityTemplate = (product) => {
        const handleEditItemBatchQuantity = (e) => {
            setBatchList(prev => (prev.map(content => {
                if (content.id__ == product?.id__) {
                    return { ...content, Quantity: e.target.value }
                } else return content
            })));
        }
        return <InputNumber disabled={mode == "view"} inputId="integeronly" className="w-full text-right p-inputtext-sm" min={0} showButtons value={product?.Quantity} onValueChange={handleEditItemBatchQuantity} />
    };

    const BatchAttribute1Template = (product) => {
        const handleEditItemBatchAttribute1 = (e) => {
            const value = e.target.value;
            // if (value) {
            setBatchList(prev => (prev.map(content => {
                if (content.id__ == product?.id__) {
                    return { ...content, Attribute1: e.target.value }
                } else return content
            })));
            // if (batchList[batchList.length - 1].BatchNumber) {
            handleAddNewBatchRow();
            // }
            // } else {

            // }
        }
        return <InputText disabled={mode == "view"} className="w-full p-inputtext-sm" value={product?.BatchAttribute1} onChange={handleEditItemBatchAttribute1} />;
    };

    const BatchAttribute2Template = (product) => {
        const handleEditItemBatchAttribute2 = (e) => {
            const value = e.target.value;
            // if (value) {
            setBatchList(prev => (prev.map(content => {
                if (content.id__ == product?.id__) {
                    return { ...content, BatchAttribute2: e.target.value }
                } else return content
            })));
            // if (batchList[batchList.length - 1].BatchNumber) {
            handleAddNewBatchRow();
            // }
            // } else {

            // }
        }
        return <InputText disabled={mode == "view"} className="w-full p-inputtext-sm" value={product?.BatchAttribute2} onChange={handleEditItemBatchAttribute2} />;
    };

    const BatchAdmissionDateTemplate = (product) => {
        const handleEditItemBatchAdmissionDate = (e) => {
            const value = e.target.value;
            // if (value) {
            setBatchList(prev => (prev.map(content => {
                if (content.id__ == product?.id__) {
                    return { ...content, AdmissionDate: e.value }
                } else return content
            })));
            // if (batchList[batchList.length - 1].BatchNumber) {
            handleAddNewBatchRow();
            // }
            // } else {

            // }
        }

        return <Calendar disabled={mode == "view"} id="admission-date-batch-el" dateFormat="dd/mm/yy" className="text-base " value={product?.AdmissionDate} onChange={handleEditItemBatchAdmissionDate} showIcon />
    };

    const BatchManufacturingDateTemplate = (product) => {
        const handleEditItemBatchManufacturingDate = (e) => {
            const value = e.target.value;
            // if (value) {
            setBatchList(prev => (prev.map(content => {
                if (content.id__ == product?.id__) {
                    return { ...content, ManufacturingDate: e.value }
                } else return content
            })));
            // if (batchList[batchList.length - 1].BatchNumber) {
            handleAddNewBatchRow();
            // }
            // } else {

            // }
        }

        return <Calendar disabled={mode == "view"} id="admission-date-batch-el" dateFormat="dd/mm/yy" className="text-base" value={product?.ManufacturingDate} onChange={handleEditItemBatchManufacturingDate} showIcon />
    };

    const BatchExpirationDateTemplate = (product) => {
        const handleEditItemBatchExpirationDate = (e) => {
            const value = e.target.value;
            // if (value) {
            setBatchList(prev => (prev.map(content => {
                if (content.id__ == product?.id__) {
                    return { ...content, ExpirationDate: e.value }
                } else return content
            })));
            // if (batchList[batchList.length - 1].BatchNumber) {
            handleAddNewBatchRow();
            // }
            // } else {

            // }
        }

        return <Calendar disabled={mode == "view"} id="admission-date-batch-el" dateFormat="dd/mm/yy" className="text-base" value={product?.ExpirationDate} onChange={handleEditItemBatchExpirationDate} showIcon />
    };

    const BatchLocationTemplate = (product) => {
        const handleEditItemBatchLocation = (e) => {
            const value = e.target.value;
            // if (value) {
            setBatchList(prev => (prev.map(content => {
                if (content.id__ == product?.id__) {
                    return { ...content, Location: e.target.value }
                } else return content
            })));
            // if (batchList[batchList.length - 1].BatchNumber) {
            handleAddNewBatchRow();
            // }
            // } else {

            // }
        }
        return <InputText disabled={mode == "view"} className="w-full p-inputtext-sm" value={product?.Location} onChange={handleEditItemBatchLocation} />;
    };

    const BatchDetailsTemplate = (product) => {
        const handleEditItemBatchDetails = (e) => {
            const value = e.target.value;
            // if (value) {
            setBatchList(prev => (prev.map(content => {
                if (content.id__ == product?.id__) {
                    return { ...content, Details: e.target.value }
                } else return content
            })));
            // if (batchList[batchList.length - 1].BatchNumber) {
            handleAddNewBatchRow();
            // }
            // } else {

            // }
        }
        return <InputText disabled={mode == "view"} className="w-full p-inputtext-sm" value={product?.Details} onChange={handleEditItemBatchDetails} />;
    };

    const handleDeleteBatchSerial = () => {
        if (selectedBatchNumbers?.length > 0) {
            console.log("Gì: ", selectedBatchNumbers)
            if (selectedBatchNumbers.length == batchList?.length) {
                setBatchList(
                    [
                        {
                            id__: nanoid(6),
                            BatchNumber: null,
                            Quantity: null,
                            BatchAttribute1: null,
                            BatchAttribute2: null,
                            AdmissionDate: null,
                            ManufacturingDate: null,
                            ExpirationDate: null,
                            Location: null,
                            Details: null,
                        }
                    ]);
            } else {
                const selectedIds = new Set(selectedBatchNumbers?.map(item => item.id__));
                console.log("GÌ: ", batchList);
                let lastIncluded = false;
                if (selectedIds.has(batchList[batchList.length - 1].id__)) lastIncluded = true;
                if (lastIncluded) {
                    setBatchList([
                        ...batchList.filter(batch => !selectedIds.has(batch.id__)),
                        {
                            id__: nanoid(6),
                            BatchNumber: null,
                            Quantity: null,
                            BatchAttribute1: null,
                            BatchAttribute2: null,
                            AdmissionDate: null,
                            ManufacturingDate: null,
                            ExpirationDate: null,
                            Location: null,
                            Details: null,
                        }
                    ]);
                } else {
                    setBatchList(batchList.filter(batch => !selectedIds.has(batch.id__)));
                }
            }
            return;
        }

        if (selectedSerialNumbers?.length > 0) {
            if (selectedSerialNumbers.length == serialList?.length) {
                setSerialList(
                    [
                        {
                            id__: nanoid(6),
                            MfrSerialNo: null,
                            IntrSerial: null,
                            LotNumber: null,
                            AdmissionDate: null,
                            ManufacturingDate: null,
                            ExpirationDate: null,
                            MfrWarrantyStart: null,
                            MfrWarrantyEnd: null,
                            Location: null,
                            Details: null
                        }
                    ]
                );
            } else {
                const selectedIds = new Set(selectedSerialNumbers?.map(item => item.id__));
                setSerialList(serialList.filter(serial => !selectedIds.has(serial.id__)));
                let lastIncluded = false;
                if (selectedIds.has(serialList[serialList.length - 1].id__)) lastIncluded = true;
                if (lastIncluded) {
                    setSerialList([
                        ...serialList.filter(serial => !selectedIds.has(serial.id__)),
                        {
                            id__: nanoid(6),
                            MfrSerialNo: null,
                            IntrSerial: null,
                            LotNumber: null,
                            AdmissionDate: null,
                            ManufacturingDate: null,
                            ExpirationDate: null,
                            MfrWarrantyStart: null,
                            MfrWarrantyEnd: null,
                            Location: null,
                            Details: null
                        }
                    ]);
                } else {
                    setSerialList(serialList.filter(serial => !selectedIds.has(serial.id__)));
                }
            }
            return;
        }
    }

    const handleAddNewBatchRow = () => {
        setBatchList(prev => {
            const lastItem = prev[prev.length - 1];
            if (lastItem && lastItem.BatchNumber !== null && lastItem.BatchNumber !== '') {
                return [...prev, {
                    id__: nanoid(6),
                    BatchNumber: null,
                }];
            }
            return prev;
        });
    }

    const handleDeleteLastBatchRow = () => {
        setBatchList(prev => {
            if (prev.length > 0 && (prev[prev.length - 1].BatchNumber === null || prev[prev.length - 1].BatchNumber === '')) {
                return prev.slice(0, -1);
            }
            return prev;
        });
    }

    const handleAddNewSerialRow = () => {
        setSerialList(prev => {
            const lastItem = prev[prev.length - 1];
            if (lastItem && lastItem.IntrSerial !== null && lastItem.IntrSerial !== '') {
                return [...prev, {
                    id__: nanoid(6),
                    IntrSerial: null,
                    LotNumber: null,
                    MfrSerialNo: null
                }];
            }
            return prev;
        });
    }

    const handleDeleteLastSerialRow = () => {
        setSerialList(prev => {
            if (prev.length > 0 && (prev[prev.length - 1].IntrSerial === null || prev[prev.length - 1].IntrSerial === '')) {
                return prev.slice(0, -1);
            }
            return prev;
        });
    }

    const SerialNumberTemplate = (product) => {
        const handleEditItemSerialNumber = (e) => {
            const value = e.target.value;
            // if (value) {
            setSerialList(prev => (prev.map(content => {
                if (content.id__ == product?.id__) {
                    return { ...content, IntrSerial: e.target.value }
                } else return content
            })));
            // if (serialList[serialList.length - 1].IntrSerial) {
            handleAddNewSerialRow();
            // }
            // }
            // else {

            // }
        }
        return <InputText disabled={mode == "view"} className="w-full p-inputtext-sm" value={product?.IntrSerial} onChange={handleEditItemSerialNumber} />;
    };

    const SerialLotNumberTemplate = (product) => {
        const handleEditItemSerialLotNumber = (e) => {
            setSerialList(prev => (prev.map(content => {
                if (content.id__ == product?.id__) {
                    return { ...content, LotNumber: e.target.value }
                } else return content
            })));
        }
        return <InputText disabled={mode == "view"} className="w-full p-inputtext-sm" value={product?.LotNumber} onValueChange={handleEditItemSerialLotNumber} />
    };

    const SerialMfrSerialNumberTemplate = (product) => {
        const handleEditItemSerialMfrSerialNumber = (e) => {
            setSerialList(prev => (prev.map(content => {
                if (content.id__ == product?.id__) {
                    return { ...content, MfrSerilNo: e.target.value }
                } else return content
            })));
        }
        return <InputText disabled={mode == "view"} className="w-full p-inputtext-sm" value={product?.MfrSerialNo} onValueChange={handleEditItemSerialMfrSerialNumber} />
    };

    const SerialAdmissionDateTemplate = (product) => {
        const handleEditItemSerialAdmissionDate = (e) => {
            const value = e.value;
            // if (value) {
            setSerialList(prev => (prev.map(content => {
                if (content.id__ == product?.id__) {
                    return { ...content, AdmissionDate: e.value }
                } else return content
            })));
            // if (batchList[batchList.length - 1].SerialNumber) {
            handleAddNewSerialRow();
            // }
            // } else {

            // }
        }

        return <Calendar disabled={mode == "view"} id="admission-date-batch-el" dateFormat="dd/mm/yy" className="text-base" value={product?.AdmissionDate} onChange={handleEditItemSerialAdmissionDate} showIcon />
    };

    const SerialManufacturingDateTemplate = (product) => {
        const handleEditItemSerialManufacturingDate = (e) => {
            const value = e.value;
            // if (value) {
            setSerialList(prev => (prev.map(content => {
                if (content.id__ == product?.id__) {
                    return { ...content, ManufacturingDate: e.value }
                } else return content
            })));
            // if (batchList[batchList.length - 1].SerialNumber) {
            handleAddNewSerialRow();
            // }
            // } else {

            // }
        }

        return <Calendar disabled={mode == "view"} id="admission-date-batch-el" dateFormat="dd/mm/yy" className="text-base" value={product?.ManufacturingDate} onChange={handleEditItemSerialManufacturingDate} showIcon />
    };

    const SerialExpirationDateTemplate = (product) => {
        const handleEditItemSerialExpirationDate = (e) => {
            const value = e.value;
            // if (value) {
            setSerialList(prev => (prev.map(content => {
                if (content.id__ == product?.id__) {
                    return { ...content, ExpirationDate: e.value }
                } else return content
            })));
            // if (batchList[batchList.length - 1].SerialNumber) {
            handleAddNewSerialRow();
            // }
            // } else {

            // }
        }

        return <Calendar disabled={mode == "view"} id="admission-date-batch-el" dateFormat="dd/mm/yy" className="text-base" value={product?.ExpirationDate} onChange={handleEditItemSerialExpirationDate} showIcon />
    };

    const SerialMfrWarrantyStartTemplate = (product) => {
        const handleEditItemSerialMfrWarrantyStart = (e) => {
            const value = e.value;
            // if (value) {
            setSerialList(prev => (prev.map(content => {
                if (content.id__ == product?.id__) {
                    return { ...content, MfrWarrantyStart: e.value }
                } else return content
            })));
            // if (batchList[batchList.length - 1].SerialNumber) {
            handleAddNewSerialRow();
            // }
            // } else {

            // }
        }

        return <Calendar disabled={mode == "view"} id="admission-date-batch-el" dateFormat="dd/mm/yy" className="text-base " value={product?.MfrWarrantyStart} onChange={handleEditItemSerialMfrWarrantyStart} showIcon />
    };

    const SerialMfrWarrantyEndTemplate = (product) => {
        const handleEditItemSerialMfrWarrantyEnd = (e) => {
            const value = e.value;
            // if (value) {
            setSerialList(prev => (prev.map(content => {
                if (content.id__ == product?.id__) {
                    return { ...content, MfrWarrantyEnd: e.value }
                } else return content
            })));
            // if (batchList[batchList.length - 1].SerialNumber) {
            handleAddNewSerialRow();
            // }
            // } else {

            // }
        }

        return <Calendar disabled={mode == "view"} id="admission-date-batch-el w-full" dateFormat="dd/mm/yy" className="text-base " value={product?.MfrWarrantyEnd} onChange={handleEditItemSerialMfrWarrantyEnd} showIcon />
    };

    const SerialLocationTemplate = (product) => {
        const handleEditItemSerialLocation = (e) => {
            const value = e.target.value;
            // if (value) {
            setSerialList(prev => (prev.map(content => {
                if (content.id__ == product?.id__) {
                    return { ...content, Location: e.target.value }
                } else return content
            })));
            // if (batchList[batchList.length - 1].SerialNumber) {
            handleAddNewSerialRow();
            // }
            // } else {

            // }
        }
        return <InputText disabled={mode == "view"} className="w-full p-inputtext-sm" value={product?.Location} onChange={handleEditItemSerialLocation} />;
    };

    const SerialDetailsTemplate = (product) => {
        const handleEditItemSerialDetails = (e) => {
            const value = e.target.value;
            // if (value) {
            setSerialList(prev => (prev.map(content => {
                if (content.id__ == product?.id__) {
                    return { ...content, Details: e.target.value }
                } else return content
            })));
            // if (batchList[batchList.length - 1].SerialNumber) {
            handleAddNewSerialRow();
            // }
            // } else {

            // }
        }
        return <InputText disabled={mode == "view"} className="w-full p-inputtext-sm" value={product?.Details} onChange={handleEditItemSerialDetails} />;
    };

    const handleOpenAutomaticCreationModal = () => {
        setAutomaticCreationModalOpen(true);

        if (item?.ManageBatchNumbers) {
            setCurrentBatchCreation({
                Quantity: item?.Quantity - totalAllocatedQuantity,
                NoOfBatches: 1,
                Batch: [],
                BatchAttribute1: [],
                BatchAttribute2: [],
                AdmissionDate: new Date(),
                ManufacturingDate: null,
                ExpirationDate: null,
                Location: null,
                Details: null,
                SystemNumber: null
            });
        }
        if (item?.ManageSerialNumbers) {
            setCurrentSerialNumberCreation({
                Quantity: item?.Quantity - totalAllocatedQuantity,
                MfrSerialNo: [],
                SerialNumber: [],
                LotNumber: [],
                AdmissionDate: new Date(),
                ManufacturingDate: null,
                ExpirationDate: null,
                MfrWarrantyStart: null,
                MfrWarrantyEnd: null,
                Location: null,
                Details: null,
                SystemNumber: null
            });
            return;
        }
    }

    const AutomaticStringTemplate = (product) => {
        // if (!stringInputRefs.current[product.No]) {
        //     stringInputRefs.current[product.No] = React.createRef();
        // }
        const handleEditItemString = (e) => {
            setAutomaticStringCriterias(prev => (prev.map(content => {
                if (content.No == product?.No) {
                    return { ...content, String: e.target.value }
                } else return content
            })));
            handleAddNewAutomaticStringRow();
        }
        const handleOnBlur = (e) => {
            const { value } = e.target;
            if (product?.Type == "Number") {
                const numberValue = Number(value);

                if (isNaN(numberValue)) {
                    console.log("Blur 1: ", product?.Type)
                    console.log("Blur 2: ", numberValue)
                    console.log("Blur:", isNaN(numberValue));
                    setIsPreventClose(true);
                    stringInputRefs.current[product?.No].focus();
                    toast("Please enter a numeric value.")
                    return;
                }
            }
            setIsPreventClose(false);

        }
        return <InputText
            // ref={stringInputRefs.current[product.No]}
            id={`string-input-${product.No}`}
            ref={el => stringInputRefs.current[product.No] = el}
            className="w-full p-inputtext-sm"
            value={product?.String}
            onChange={handleEditItemString}
            onBlur={handleOnBlur}
        />
    };

    const AutomaticTypeTemplate = (product) => {
        const search = (event) => {
            const values = ['String', 'Number'];
            setSuggestions(values);
        };

        const handleEditItemType = (e) => {
            const { value } = e.target;
            if (value == null) {
                setAutomaticStringCriterias(prev => (prev.map(content => {
                    if (content.No == product?.No) {
                        return { ...content, Type: "String" }
                    } else return content
                })));
            } else {
                if (value == "Number") {
                    setAutomaticStringCriterias(prev => (prev.map(content => {
                        if (content.No == product?.No) {
                            return { ...content, Type: value }
                        } else return content
                    })));
                    const numberValue = Number(product?.String);
                    if (isNaN(numberValue)) {
                        stringInputRefs.current[product.No].focus();
                        // stringInputRefs.current[product.No]..focus();
                    }
                } else {
                    setAutomaticStringCriterias(prev => (prev.map(content => {
                        if (content.No == product?.No) {
                            return { ...content, Type: value, Operation: "No Operation" }
                        } else return content
                    })));
                }
            }


        }
        return <SelectButton value={product?.Type} onChange={handleEditItemType} options={["Number", "String"]} />
        // <AutoComplete value={product?.Type} completeMethod={search} suggestions={suggestions} onChange={handleEditItemType} dropdown />
        // <><Dropdown value={stringTypes.find(t => t.code == product?.Type)} onChange={handleEditItemType} options={stringTypes} optionLabel="name"
        //     placeholder="Select string type" className="w-full md:w-14rem" />
        //     <InputText onChange={() => { stringInputRefs.current[product.No].focus(); console.log("Moẹ") }} />
        // </>
    };

    const AutomaticOperationTemplate = (product) => {
        const handleEditItemOperation = (e) => {
            setAutomaticStringCriterias(prev => (prev.map(content => {
                if (content.No == product?.No) {
                    return { ...content, Operation: e.target.value?.code }
                } else return content
            })));
        }
        return <Dropdown ref={el => stringInputRefs.current[product.No + "A"] = el}
            value={stringOperations.find(o => o.code == product?.Operation)} onChange={handleEditItemOperation} options={product.Type == "String" ? stringOperations.slice(0, 1) : stringOperations} optionLabel="name"
            placeholder="Select string operation" className="w-full md:w-14rem" />

    };

    const handleAddNewAutomaticStringRow = () => {
        setAutomaticStringCriterias(prev => {
            const lastItem = prev[prev.length - 1];
            if (lastItem && lastItem.String !== null && lastItem.String !== '') {
                return [...prev, {
                    No: prev.length + 1,
                    String: null,
                    Type: "String",
                    Operation: "No Operation",
                }];
            }
            return prev;
        });
    };

    const stringMessage = (
        <div className="flex align-items-center gap-4">
            <span><b>Final String</b></span>
            <div className="ml-2">{stringPrototype}</div>
        </div>
    );

    const handleCloseAutomaticStringModal = () => {
        setStringCreationModalOpen(false);
        setAutomaticStringCriterias([
            {
                No: 1,
                String: null,
                Type: "String",
                Operation: "No Operation",
            }
        ])
    }

    const handleConfirmAutomaticString = () => {
        const finalCriterias = [];
        if (isPreventClose) {
            toast.error("Cannot assign string to type number");
            return;
        }
        automaticStringCriterias?.forEach((criteria) => {
            if (criteria.String) {
                finalCriterias.push({
                    ...criteria,
                    No: finalCriterias.length + 1
                });
            }
        });
        switch (currentStringCategory) {
            case 1:
                setCurrentBatchCreation(prev => ({
                    ...prev,
                    Batch: finalCriterias
                }))
                break;
            case 2:
                setCurrentBatchCreation(prev => ({
                    ...prev,
                    BatchAttribute1: finalCriterias
                }))
                break;
            case 3:
                setCurrentBatchCreation(prev => ({
                    ...prev,
                    BatchAttribute2: finalCriterias
                }))
                break;
            case 4:
                setCurrentSerialNumberCreation(prev => ({
                    ...prev,
                    MfrSerialNo: finalCriterias
                }))
                break;
            case 5:
                setCurrentSerialNumberCreation(prev => ({
                    ...prev,
                    SerialNumber: finalCriterias
                }))
                break;
            case 6:
                setCurrentSerialNumberCreation(prev => ({
                    ...prev,
                    LotNumber: finalCriterias
                }))
                break;
        }
        console.log("Gửi lên: ", finalCriterias);
        setStringCreationModalOpen(false);
        setAutomaticStringCriterias([
            {
                No: 1,
                String: null,
                Type: "String",
                Operation: "No Operation",
            }
        ])
    };

    const handleOpenAutomaticStringModal = (category) => {
        setCurrentStringCategory(category);
        if (category)
            switch (category) {
                case 1:
                    if (currentBatchCreation && currentBatchCreation?.Batch?.length > 0) {
                        setAutomaticStringCriterias(
                            [
                                ...currentBatchCreation?.Batch,
                                {
                                    No: currentBatchCreation?.Batch.length + 1,
                                    String: null,
                                    Type: "String",
                                    Operation: "No Operation",
                                }]
                        );
                    }
                    break;
                case 2:
                    if (currentBatchCreation && currentBatchCreation?.BatchAttribute1?.length > 0) {
                        setAutomaticStringCriterias(
                            [
                                ...currentBatchCreation?.BatchAttribute1,
                                {
                                    No: currentBatchCreation?.BatchAttribute1.length + 1,
                                    String: null,
                                    Type: "String",
                                    Operation: "No Operation",
                                }]
                        );
                    }
                    break;
                case 3:
                    if (currentBatchCreation && currentBatchCreation?.BatchAttribute2?.length > 0) {
                        setAutomaticStringCriterias(
                            [
                                ...currentBatchCreation?.BatchAttribute2,
                                {
                                    No: currentBatchCreation?.BatchAttribute2?.length + 1,
                                    String: null,
                                    Type: "String",
                                    Operation: "No Operation",
                                }]
                        );
                    }
                    break;
                case 4:
                    if (currentSerialNumberCreation && currentSerialNumberCreation?.MfrSerialNo?.length > 0) {
                        setAutomaticStringCriterias(
                            [
                                ...currentSerialNumberCreation?.MfrSerialNo,
                                {
                                    No: currentSerialNumberCreation?.MfrSerialNo?.length + 1,
                                    String: null,
                                    Type: "String",
                                    Operation: "No Operation",
                                }]
                        );
                    }
                    break;
                case 5:
                    if (currentSerialNumberCreation && currentSerialNumberCreation?.SerialNumber?.length > 0) {
                        setAutomaticStringCriterias(
                            [
                                ...currentSerialNumberCreation?.SerialNumber,
                                {
                                    No: currentSerialNumberCreation?.SerialNumber?.length + 1,
                                    String: null,
                                    Type: "String",
                                    Operation: "No Operation",
                                }]
                        );
                    }
                    break;
                case 6:
                    if (currentSerialNumberCreation && currentSerialNumberCreation?.LotNumber?.length > 0) {
                        setAutomaticStringCriterias(
                            [
                                ...currentSerialNumberCreation?.LotNumber,
                                {
                                    No: currentSerialNumberCreation?.LotNumber?.length + 1,
                                    String: null,
                                    Type: "String",
                                    Operation: "No Operation",
                                }]
                        );
                    }
                    break;
            }
        setStringCreationModalOpen(true);
    }

    const batchContentColumns = useMemo(
        () => [
            {
                header: 'No.',
                field: 'No.',
                className: 'text-center',
                minWidth: '4rem',
                body: (item, row) => (<>{row.rowIndex + 1}</>)
            },
            {
                header: 'Batch Number',
                field: 'BatchNumber',
                className: 'text-center',
                minWidth: '12rem',
                body: BatchNumberTemplate
            },
            {
                header: 'Quantity',
                field: 'Quantity',
                className: 'text-center',
                minWidth: '12rem',
                body: BatchQuantityTemplate
            },
            {
                header: 'Batch Attribute 1',
                field: 'BatchAttribute1',
                className: 'text-center',
                minWidth: '12rem',
                body: BatchAttribute1Template
            },
            {
                header: 'Batch Attribute 2',
                field: 'BatchAttribute2',
                className: 'text-center',
                minWidth: '12rem',
                body: BatchAttribute2Template
            },
            {
                header: 'Admission Date',
                field: 'AdmissionDate',
                className: 'text-center',
                minWidth: '12rem',
                body: BatchAdmissionDateTemplate
            },
            {
                header: 'Manufacturing Date',
                field: 'ManufacturingDate',
                className: 'text-center',
                minWidth: '12rem',
                body: BatchManufacturingDateTemplate
            },
            {
                header: 'Expiration Date',
                field: 'ExpirationDate',
                className: 'text-center',
                minWidth: '12rem',
                body: BatchExpirationDateTemplate
            },
            {
                header: 'Location',
                field: 'Location',
                className: 'text-center',
                minWidth: '12rem',
                body: BatchLocationTemplate
            },
            {
                header: 'Details',
                field: 'Details',
                className: 'text-center',
                minWidth: '12rem',
                body: BatchDetailsTemplate
            },
        ], [item?.BatchNumbers, batchList]
    );

    const serialContentColumns = useMemo(
        () => [
            {
                header: 'No.',
                field: 'No.',
                className: 'text-center',
                minWidth: '4rem',
                body: (item, row) => (<>{row.rowIndex + 1}</>)
            },
            {
                header: 'Mfr Serial Number',
                field: 'MfrSerialNo',
                className: 'text-center',
                minWidth: '12rem',
                body: SerialMfrSerialNumberTemplate
            },
            {
                header: 'Serial Number',
                field: 'IntrSerial',
                className: 'text-center',
                minWidth: '12rem',
                body: SerialNumberTemplate
            },
            {
                header: 'Lot Number',
                field: 'LotNumber',
                className: 'text-center',
                minWidth: '12rem',
                body: SerialLotNumberTemplate
            },
            {
                header: 'Admission Date',
                field: 'AdmissionDate',
                className: 'text-center',
                minWidth: '12rem',
                body: SerialAdmissionDateTemplate
            },
            {
                header: 'Manufacturing Date',
                field: 'ManufacturingDate',
                className: 'text-center',
                minWidth: '12rem',
                body: SerialManufacturingDateTemplate
            },
            {
                header: 'Expiration Date',
                field: 'ExpirationDate',
                className: 'text-center',
                minWidth: '12rem',
                body: SerialExpirationDateTemplate
            },
            {
                header: 'MfrWarranty Start',
                field: 'MfrWarrantyStart',
                className: 'text-center',
                minWidth: '12rem',
                body: SerialMfrWarrantyStartTemplate
            },
            {
                header: 'MfrWarranty End',
                field: 'MfrWarrantyEnd',
                className: 'text-center',
                minWidth: '12rem',
                body: SerialMfrWarrantyEndTemplate
            },
            {
                header: 'Location',
                field: 'Location',
                className: 'text-center',
                minWidth: '12rem',
                body: SerialLocationTemplate
            },
            {
                header: 'Details',
                field: 'Details',
                className: 'text-center',
                minWidth: '12rem',
                body: SerialDetailsTemplate
            },
        ], [item?.SerialNumbers, serialList]
    );

    const stringContentColumns = useMemo(
        () => [
            {
                header: 'No.',
                field: 'No',
                align: 'center',
                minWidth: '5rem',
            },
            {
                header: 'String',
                field: 'String',
                className: 'text-center',
                minWidth: '12rem',
                body: AutomaticStringTemplate
            },
            {
                header: 'Type',
                field: 'Type',
                className: 'text-center',
                minWidth: '12rem',
                body: AutomaticTypeTemplate
            },
            {
                header: 'Operation',
                field: 'Operation',
                className: 'text-center',
                minWidth: '12rem',
                body: AutomaticOperationTemplate
            },
        ],
        [item?.SerialNumbers, serialList, automaticStringCriterias]
    );

    const [visibleBatchColumns, setVisibleBatchColumns] = useState(null);
    const [visibleSerialColumns, setVisibleSerialColumns] = useState(null);

    const renderBatchCreationTHeader = () => {
        return (
            <div className="flex flex-col sm:flex-row gap-3 justify-end py-2">
                {/* <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                    <MultiSelect value={visibleBatchColumns} options={batchContentColumns} optionLabel="header" onChange={onBatchColumnToggle} className="p-inputtext-sm w-full sm:w-20rem text-sm" display="chip" />
                </div> */}
                <div className="flex gap-2 mb-4 justify-center items-center">
                    {
                        totalAllocatedQuantity < item?.Quantity && mode == "create" && (
                            <a className='hover:cursor-pointer' onClick={handleOpenAutomaticCreationModal}>Automatic Creation</a>
                        )
                    }
                    <Button
                        type="button"
                        disabled={!selectedBatchNumbers || selectedBatchNumbers?.length < 1 || mode == "view"}
                        icon="pi pi-trash"
                        severity="danger"
                        rounded
                        outlined
                        data-pr-tooltip="Delete"
                        tooltip="Delete"
                        tooltipOptions={{ position: 'bottom', mouseTrack: true, mouseTrackTop: 15 }}
                        onClick={handleDeleteBatchSerial}
                    />
                    <Button
                        type="button"
                        icon="pi pi-cog"
                        rounded
                        outlined
                        data-pr-tooltip="Setting"
                        tooltip="Setting"
                        tooltipOptions={{ position: 'bottom', mouseTrack: true, mouseTrackTop: 15 }}
                        onClick={() => setBatchColumnDialogOpen(true)}
                    />
                </div>
                {/* <div className="flex gap-2 mb-4 justify-between items-center">
                    <div className='flex gap-4 items-center'>
                        <span><b>Total Created Batch</b></span>
                        <Badge className='text-base' value={batchList?.filter(b => b.BatchNumber && b.Quantity != null && b.Quantity != 0).length}></Badge>
                    </div>
                    <div className='flex gap-3 items-center'>
                        {
                            (totalAllocatedQuantity < item.Quantity) &&
                            <a className='hover:cursor-pointer' onClick={handleOpenAutomaticCreationModal}>Automatic Creation</a>
                        }
                        <Button
                            type="button"
                            disabled={!selectedBatchNumbers || selectedBatchNumbers?.length < 1}
                            icon="pi pi-trash"
                            severity="danger"
                            rounded
                            outlined
                            data-pr-tooltip="Delete"
                            tooltip="Delete"
                            tooltipOptions={{ position: 'bottom', mouseTrack: true, mouseTrackTop: 15 }}
                            onClick={handleDeleteBatchSerial}
                        />
                        <Button type="button" icon="pi pi-cog" rounded outlined data-pr-tooltip="Setting" tooltip="Setting" tooltipOptions={{ position: 'bottom', mouseTrack: true, mouseTrackTop: 15 }} />
                    </div>
                </div> */}
            </div>
        );
    }

    const renderBatchCreationTFooter = () => {
        return (
            <div className='flex gap-4 items-center'>
                <span><b>Total Created Batch</b></span>
                <Badge className='text-base' value={batchList?.filter(b => b.BatchNumber && b.Quantity != null && b.Quantity != 0).length}></Badge>
            </div>
        )
    }

    const renderSerialCreationTHeader = () => {
        return (
            <div className="flex flex-col sm:flex-row gap-3 justify-end py-2">
                {/* <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                    <MultiSelect value={visibleSerialColumns} options={serialContentColumns} optionLabel="header" onChange={onSerialColumnToggle} className="p-inputtext-sm w-full sm:w-20rem text-sm" display="chip" />
                </div> */}
                <div className="flex gap-2 mb-4 justify-end items-center">
                    {
                        totalAllocatedQuantity < item?.Quantity && mode == "create" && (
                            <a className='hover:cursor-pointer' onClick={handleOpenAutomaticCreationModal}>Automatic Creation</a>
                        )
                    }
                    <Button
                        type="button"
                        disabled={!selectedSerialNumbers || selectedSerialNumbers?.length < 1 || mode == "view"}
                        icon="pi pi-trash"
                        severity="danger"
                        rounded
                        outlined
                        data-pr-tooltip="Delete"
                        tooltip="Delete"
                        tooltipOptions={{ position: 'bottom', mouseTrack: true, mouseTrackTop: 15 }}
                        onClick={handleDeleteBatchSerial}
                    />
                    <Button
                        type="button"
                        icon="pi pi-cog"
                        rounded
                        outlined
                        data-pr-tooltip="Setting"
                        tooltip="Setting"
                        tooltipOptions={{ position: 'bottom', mouseTrack: true, mouseTrackTop: 15 }}
                        onClick={() => setSerialColumnDialogOpen(true)}
                    />
                </div>
            </div>
        );
    }

    // Hàm create tự động
    const generateBatchNumbers = (props) => {
        const {
            batchCriterias,
            batchAttribute1Criterias,
            batchAttribute2Criterias,
            admissionDate,
            manufacturingDate,
            expirationDate,
            location,
            details,
            quantity,
            itemQuantity
        } = props;
        const batchNumbers = [];

        // Initialize the initial values for number criteria
        const batchNumberInitialValues = batchCriterias?.map(criteria => {
            return {
                ...criteria,
                value: criteria.Type === "Number" ? parseInt(criteria.String, 10) : criteria.String
            };
        });

        const batchAttribute1InitialValues = batchAttribute1Criterias?.map(criteria => {
            return {
                ...criteria,
                value: criteria.Type === "Number" ? parseInt(criteria.String, 10) : criteria.String
            };
        });

        const batchAttribute2InitialValues = batchAttribute2Criterias?.map(criteria => {
            return {
                ...criteria,
                value: criteria.Type === "Number" ? parseInt(criteria.String, 10) : criteria.String
            };
        });

        const distributionQuantity = Number(itemQuantity) / Number(quantity);

        for (let i = 0; i < quantity; i++) {
            // Generate Batch
            let batch = '';
            batchNumberInitialValues.forEach(criteria => {
                if (criteria.Type === "String") {
                    batch += criteria.value;
                } else if (criteria.Type === "Number") {
                    batch += criteria.value.toString().padStart(criteria.String.length, '0');
                    if (criteria.Operation === "Increase") {
                        criteria.value++;
                    } else if (criteria.Operation === "Decrease") {
                        // Decrease the value but do not go below 0
                        if (criteria.value > 0) {
                            criteria.value--;
                        }
                    }
                }
            });

            // Generate BatchAttribute1
            let batchAttribute1 = '';
            batchAttribute1InitialValues.forEach(criteria => {
                if (criteria.Type === "String") {
                    batchAttribute1 += criteria.value;
                } else if (criteria.Type === "Number") {
                    batchAttribute1 += criteria.value.toString().padStart(criteria.String.length, '0');
                    if (criteria.Operation === "Increase") {
                        criteria.value++;
                    } else if (criteria.Operation === "Decrease") {
                        // Decrease the value but do not go below 0
                        if (criteria.value > 0) {
                            criteria.value--;
                        }
                    }
                }
            });

            // Generate BatchAttribute2
            let batchAttribute2 = '';
            batchAttribute2InitialValues.forEach(criteria => {
                if (criteria.Type === "String") {
                    batchAttribute2 += criteria.value;
                } else if (criteria.Type === "Number") {
                    batchAttribute2 += criteria.value.toString().padStart(criteria.String.length, '0');
                    if (criteria.Operation === "Increase") {
                        criteria.value++;
                    } else if (criteria.Operation === "Decrease") {
                        // Decrease the value but do not go below 0
                        if (criteria.value > 0) {
                            criteria.value--;
                        }
                    }
                }
            });

            batchNumbers.push({
                id__: nanoid(6),
                BatchNumber: batch,
                BatchAttribute1: batchAttribute1,
                BatchAttribute2: batchAttribute2,
                AdmissionDate: admissionDate,
                ManufacturingDate: manufacturingDate,
                ExpirationDate: expirationDate,
                Location: location,
                Details: details,
                Quantity: distributionQuantity
            });
        }

        return batchNumbers;
    };

    const generateSerialNumbers = (props) => {
        const {
            mfrSerialNoCriterias,
            serialNumberCriterias,
            lotNumberCriterias,
            admissionDate,
            manufacturingDate,
            expirationDate,
            mfrWarrantyStart,
            mfrWarrantyEnd,
            location,
            details,
            quantity
        } = props;
        const serialNumbers = [];

        // Initialize the initial values for number criteria
        const mfrSerialNoInitialValues = mfrSerialNoCriterias?.map(criteria => {
            return {
                ...criteria,
                value: criteria.Type === "Number" ? parseInt(criteria.String, 10) : criteria.String
            };
        });

        const serialNumberInitialValues = serialNumberCriterias?.map(criteria => {
            return {
                ...criteria,
                value: criteria.Type === "Number" ? parseInt(criteria.String, 10) : criteria.String
            };
        });

        const lotNumberInitialValues = lotNumberCriterias?.map(criteria => {
            return {
                ...criteria,
                value: criteria.Type === "Number" ? parseInt(criteria.String, 10) : criteria.String
            };
        });

        for (let i = 0; i < quantity; i++) {
            // Generate Serial Number
            let mfrSerialNo = '';
            mfrSerialNoInitialValues.forEach(criteria => {
                if (criteria.Type === "String") {
                    mfrSerialNo += criteria.value;
                } else if (criteria.Type === "Number") {
                    mfrSerialNo += criteria.value.toString().padStart(criteria.String.length, '0');
                    if (criteria.Operation === "Increase") {
                        criteria.value++;
                    } else if (criteria.Operation === "Decrease") {
                        // Decrease the value but do not go below 0
                        if (criteria.value > 0) {
                            criteria.value--;
                        }
                    }
                }
            });

            // Generate Serial Number
            let serialNumber = '';
            serialNumberInitialValues.forEach(criteria => {
                if (criteria.Type === "String") {
                    serialNumber += criteria.value;
                } else if (criteria.Type === "Number") {
                    serialNumber += criteria.value.toString().padStart(criteria.String.length, '0');
                    if (criteria.Operation === "Increase") {
                        criteria.value++;
                    } else if (criteria.Operation === "Decrease") {
                        // Decrease the value but do not go below 0
                        if (criteria.value > 0) {
                            criteria.value--;
                        }
                    }
                }
            });

            // Generate Lot Number
            let lotNumber = '';
            lotNumberInitialValues.forEach(criteria => {
                if (criteria.Type === "String") {
                    lotNumber += criteria.value;
                } else if (criteria.Type === "Number") {
                    lotNumber += criteria.value.toString().padStart(criteria.String.length, '0');
                    if (criteria.Operation === "Increase") {
                        criteria.value++;
                    } else if (criteria.Operation === "Decrease") {
                        if (criteria.value > 0) {
                            criteria.value--;
                        }
                    }
                }
            });

            serialNumbers.push({
                id__: nanoid(6),
                MfrSerialNo: mfrSerialNo,
                IntrSerial: serialNumber,
                LotNumber: lotNumber,
                AdmissionDate: admissionDate,
                ManufacturingDate: manufacturingDate,
                ExpirationDate: expirationDate,
                MfrWarrantyStart: mfrWarrantyStart,
                MfrWarrantyEnd: mfrWarrantyEnd,
                Location: location,
                Details: details
            });
        }

        return serialNumbers;
    };

    const handleCreateBatchSerialNumber = () => {
        if (item?.ManageBatchNumbers) {
            const props = {
                batchCriterias: currentBatchCreation?.Batch,
                batchAttribute1Criterias: currentBatchCreation?.BatchAttribute1,
                batchAttribute2Criterias: currentBatchCreation?.BatchAttribute2,
                admissionDate: currentBatchCreation?.AdmissionDate,
                manufacturingDate: currentBatchCreation?.ManufacturingDate,
                expirationDate: currentBatchCreation?.ExpirationDate,
                location: currentBatchCreation?.Location,
                details: currentBatchCreation?.Details,
                quantity: currentBatchCreation?.NoOfBatches,
                itemQuantity: currentBatchCreation?.Quantity
            }
            const generatedBatchList = generateBatchNumbers(props);
            const lastItem = batchList[batchList.length - 1]

            console.log("Tiêu chí batch:", generatedBatchList);
            if (!lastItem.BatchNumber && !lastItem.Quantity) {
                setBatchList(prev => (
                    [
                        ...prev.slice(0, -1),
                        ...generatedBatchList,
                        {
                            id__: nanoid(6),
                            BatchNumber: null,
                            Quantity: null,
                            BatchAttribute1: null,
                            BatchAttribute2: null,
                            AdmissionDate: null,
                            ManufacturingDate: null,
                            ExpirationDate: null,
                            Location: null,
                            Details: null,
                        }
                    ]
                ))
            } else {
                setBatchList(prev => (
                    [
                        ...prev,
                        ...generatedBatchList,
                        {
                            id__: nanoid(6),
                            BatchNumber: null,
                            Quantity: null,
                            BatchAttribute1: null,
                            BatchAttribute2: null,
                            AdmissionDate: null,
                            ManufacturingDate: null,
                            ExpirationDate: null,
                            Location: null,
                            Details: null,
                        }
                    ]
                ));
            }
            toast.success("Tự động gen batch")
        } else {
            console.log("Tiêu chí serial:", currentSerialNumberCreation);
            const props = {
                mfrSerialNoCriterias: currentSerialNumberCreation?.MfrSerialNo,
                serialNumberCriterias: currentSerialNumberCreation?.SerialNumber,
                lotNumberCriterias: currentSerialNumberCreation?.LotNumber,
                admissionDate: currentSerialNumberCreation?.AdmissionDate,
                manufacturingDate: currentSerialNumberCreation?.ManufacturingDate,
                expirationDate: currentSerialNumberCreation?.ExpirationDate,
                mfrWarrantyStart: currentSerialNumberCreation?.MfrWarrantyStart,
                mfrWarrantyEnd: currentSerialNumberCreation?.MfrWarrantyEnd,
                location: currentSerialNumberCreation?.Location,
                details: currentSerialNumberCreation?.Details,
                quantity: currentSerialNumberCreation?.Quantity
            }
            console.log("QQ gì dây: ", props)
            const generatedSerialList = generateSerialNumbers(props);
            const lastItem = serialList[serialList.length - 1]
            console.log("Serial list:", generatedSerialList);
            if (!lastItem.MfrSerialNo && !lastItem.IntrSerial && !lastItem.LotNumber) {
                setSerialList(prev => (
                    [
                        ...prev.slice(0, -1),
                        ...generatedSerialList,
                        {
                            id__: nanoid(6),
                            MfrSerialNo: null,
                            IntrSerial: null,
                            LotNumber: null,
                            AdmissionDate: null,
                            ManufacturingDate: null,
                            ExpirationDate: null,
                            MfrWarrantyStart: null,
                            MfrWarrantyEnd: null,
                            Location: null,
                            Details: null
                        }
                    ]
                ))
            } else {
                setSerialList(prev => (
                    [
                        ...prev,
                        ...generatedSerialList,
                        {
                            id__: nanoid(6),
                            MfrSerialNo: null,
                            IntrSerial: null,
                            LotNumber: null,
                            AdmissionDate: null,
                            ManufacturingDate: null,
                            ExpirationDate: null,
                            MfrWarrantyStart: null,
                            MfrWarrantyEnd: null,
                            Location: null,
                            Details: null
                        }
                    ]
                ));
            }
            toast.success("Tự động gen serial")
        }
        handleHideAutomaticCreationModal();
    }

    useEffect(() => {
        setVisibleBatchColumns(batchContentColumns);
        setVisibleSerialColumns(serialContentColumns);
    }, [batchContentColumns, serialContentColumns]);

    useEffect(() => {
        if (item?.ManageBatchNumbers) {
            const total = batchList.reduce((acc, curr) => {
                return acc + (curr.Quantity || 0);
            }, 0);
            console.log("Lạ lùng: ", batchList);
            setTotalAllocatedQuantity(total);
        }
    }, [batchList]);

    useEffect(() => {
        if (item?.ManageSerialNumbers) {
            const count = serialList.filter(item => item.IntrSerial !== null && item.IntrSerial !== '').length;
            console.log("Lạ lùng: ", serialList);
            setTotalAllocatedQuantity(count);
        }
    }, [serialList])

    useEffect(() => {
        if (item?.Warehouse && item?.ItemCode && batchSerialModalOpen) {
            (async () => {
                try {
                    if (item?.ManageBatchNumbers) {
                        let currentList = [];

                        if (mode == "create") {
                            currentList = [
                                ...item?.BatchNumbers,
                                {
                                    id__: nanoid(6),
                                    BatchNumber: null,
                                    Quantity: null,
                                    BatchAttribute1: null,
                                    BatchAttribute2: null,
                                    AdmissionDate: null,
                                    ManufacturingDate: null,
                                    ExpirationDate: null,
                                    Location: null,
                                    Details: null,
                                }
                            ];
                        } else {
                            currentList = [
                                ...item?.BatchNumbers.map(batch => ({
                                    id__: nanoid(6),
                                    BatchNumber: batch.BatchNumber,
                                    Quantity: batch.Quantity,
                                    BatchAttribute1: batch.ManufacturerSerialNumber,
                                    BatchAttribute2: batch.InternalSerialNumber,
                                    AdmissionDate: new Date(batch.AddmisionDate),
                                    ManufacturingDate: new Date(batch.ManufacturingDate),
                                    ExpirationDate: new Date(batch.ExpiryDate),
                                    Location: batch.Location,
                                    Details: batch.Notes,
                                }))
                            ];
                        }
                        setBatchList(currentList);
                        setOriginalBatchList([...item?.BatchNumbers]);
                        console.log("Res batch: ", currentList)
                    } else {
                        let currentList = [];
                        if (mode == "create") {
                            currentList = [
                                ...item?.SerialNumbers,
                                {
                                    id__: nanoid(6),
                                    MfrSerialNo: null,
                                    IntrSerial: null,
                                    LotNumber: null,
                                    AdmissionDate: null,
                                    ManufacturingDate: null,
                                    ExpirationDate: null,
                                    MfrWarrantyStart: null,
                                    MfrWarrantyEnd: null,
                                    Location: null,
                                    Details: null
                                }
                            ];
                        } else {
                            currentList = [
                                ...item?.SerialNumbers.map(serial => ({
                                    id__: nanoid(6),
                                    MfrSerialNo: serial.ManufacturerSerialNumber,
                                    IntrSerial: serial.InternalSerialNumber,
                                    LotNumber: serial.BatchID,
                                    AdmissionDate: new Date(serial.ReceptionDate),
                                    ManufacturingDate: new Date(serial.ManufactureDate),
                                    ExpirationDate: new Date(serial.ExpiryDate),
                                    MfrWarrantyStart: new Date(serial.WarrantyStart),
                                    MfrWarrantyEnd: new Date(serial.WarrantyEnd),
                                    Location: serial.Location,
                                    Details: serial.Notes,
                                    Quantity: serial.Quantity
                                }))
                            ];
                        }

                        setSerialList(currentList)
                        setOriginalSerialList([...item?.SerialNumbers]);
                        console.log("Res serial: ", currentList);
                    }
                } catch (error) {
                    console.error(error);
                    toast.error("There was an error occurred.");
                    return;
                }
            })();
        }
    }, [item, batchSerialModalOpen]);

    useEffect(() => {
        let currentString = "";
        for (const criteria of automaticStringCriterias) {
            const { No, String, Type, Operation } = criteria;
            if (String != null) {
                currentString += String.trim();
            }
        }
        setStringPrototype(currentString);
    }, [automaticStringCriterias])

    useEffect(() => {
        console.log("Sao e: ", currentSerialNumberCreation)
    }, [currentSerialNumberCreation]);

    return (
        <>
            <Dialog
                header={`${mode == "create" ? "Create" : "View"} Batch/Serial Number`}
                visible={batchSerialModalOpen}
                onHide={handleHideBatchSerialCreationModal}
                maximizable
                style={{ width: '75vw', minHeight: '75vh' }}
                contentStyle={{ height: '75vh' }}
                breakpoints={{ '960px': '80vw', '641px': '100vw' }}
                footer={renderCreationDFooter}
                blockScroll
            >
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
                                            <span className='text-lg'>{(mode == "create" ? item?.Warehouse?.code : item.Warehouse) || '-'}</span>
                                        </div>
                                    </div>

                                    <div className='basis-1/2 flex flex-col gap-4'>
                                        <div className='flex flex-row'>
                                            <label className='basis-1/2 text-lg'>Warehouse Name</label>
                                            <span className='text-lg'>{(mode == "create" ? item?.Warehouse?.name : item.Warehouse) || '-'}</span>
                                        </div>
                                        <div className='flex flex-row'>
                                            <label className='basis-1/2 text-lg'>Quantity</label>
                                            <span className='text-lg'>{formatNumberWithComma(item?.Quantity) || 0}</span>
                                        </div>
                                        <div className='flex flex-row'>
                                            <label className={`basis-1/2 text-lg ${(totalAllocatedQuantity > item?.Quantity || totalAllocatedQuantity <= 0) && 'font-semibold text-red-600'}`}>Allocated Total</label>
                                            <span className={`text-lg ${(totalAllocatedQuantity > item?.Quantity || totalAllocatedQuantity <= 0) && 'font-semibold text-red-600'}`}>{formatNumberWithComma(totalAllocatedQuantity)}</span>
                                        </div>
                                        {/* <div className='flex flex-row'>
                                            <label className='basis-1/2 text-lg'>Display Quantites By</label>
                                            <span className='text-lg'>1</span>
                                        </div> */}
                                    </div>
                                </div>
                            </Fieldset>
                            <Fieldset
                                legend="Batch Number Creation"
                                className='mt-4 flex-1'
                            >
                                {/* <div className="flex gap-2 mb-4 justify-between items-center">
                                    <div className='flex gap-4 items-center'>
                                        <span><b>Total Created Batch</b></span>
                                        <Badge className='text-base' value={batchList?.filter(b => b.BatchNumber && b.Quantity != null && b.Quantity != 0).length}></Badge>
                                    </div>
                                    <div className='flex gap-3 items-center'>
                                        {
                                            (totalAllocatedQuantity < item.Quantity) &&
                                            <a className='hover:cursor-pointer' onClick={handleOpenAutomaticCreationModal}>Automatic Creation</a>
                                        }
                                        <Button
                                            type="button"
                                            disabled={!selectedBatchNumbers || selectedBatchNumbers?.length < 1}
                                            icon="pi pi-trash"
                                            severity="danger"
                                            rounded
                                            outlined
                                            data-pr-tooltip="Delete"
                                            tooltip="Delete"
                                            tooltipOptions={{ position: 'bottom', mouseTrack: true, mouseTrackTop: 15 }}
                                            onClick={handleDeleteBatchSerial}
                                        />
                                        <Button type="button" icon="pi pi-cog" rounded outlined data-pr-tooltip="Setting" tooltip="Setting" tooltipOptions={{ position: 'bottom', mouseTrack: true, mouseTrackTop: 15 }} />
                                    </div>
                                </div> */}
                                <DataTable
                                    id="batch-creation-table"
                                    header={renderBatchCreationTHeader}
                                    footer={renderBatchCreationTFooter}
                                    reorderableRows
                                    value={batchList}
                                    className="list-table p-datatable-gridlines grid"
                                    editMode
                                    showGridlines
                                    // onColumnResizeEnd={handleResizeColumn}
                                    selectionAutoFocus={false}
                                    // rows={8}
                                    // rowsPerPageOptions={[20, 50, 100, 200]}
                                    selectionMode={'checkbox'}
                                    selection={selectedBatchNumbers}
                                    onSelectionChange={(e) => {
                                        const currentValue = e.value;
                                        console.log("Lạ dẫy", currentValue);
                                        setSelectedBatchNumbers(e.value)
                                    }}
                                    dataKey="id__"
                                    stripedRows={false}
                                    columnResizeMode="expand"
                                    resizableColumns
                                    responsiveLayout="scroll"
                                    sortMode="multiple"
                                    removableSort
                                // header={header}
                                >
                                    <Column rowReorder style={{ width: '3rem' }} />
                                    <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
                                    {
                                        visibleBatchColumns && visibleBatchColumns.length > 0 && visibleBatchColumns.map((col, index) => (
                                            <Column
                                                key={index}
                                                // ref={index === 1 ? columnRef : null}
                                                header={col.header}
                                                field={col.field}
                                                style={{ minWidth: col.minWidth }}
                                                body={col.body}
                                            />
                                        ))
                                    }
                                </DataTable>
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
                                <div className='flex flex-col sm:flex-row gap-2'>
                                    <div className='sm:basis-1/2 flex flex-col gap-4'>
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
                                            <span className='text-lg'>{(mode == "create" ? item?.Warehouse?.code : item.Warehouse) || '-'}</span>
                                        </div>
                                    </div>

                                    <div className='sm:basis-1/2 flex flex-col gap-4'>
                                        <div className='flex flex-row'>
                                            <label className='basis-1/2 text-lg'>Warehouse Name</label>
                                            <span className='text-lg'>{(mode == "create" ? item?.Warehouse?.name : item.Warehouse) || '-'}</span>
                                        </div>
                                        <div className='flex flex-row'>
                                            <label className='basis-1/2 text-lg'>Quantity</label>
                                            <span className='text-lg'>{formatNumberWithComma(item?.Quantity) || 0}</span>
                                        </div>
                                        <div className='flex flex-row'>
                                            <label className={`basis-1/2 text-lg ${(totalAllocatedQuantity > item?.Quantity || totalAllocatedQuantity <= 0) && 'font-semibold text-red-600'}`}>Allocated Total</label>
                                            <span className={`text-lg ${(totalAllocatedQuantity > item?.Quantity || totalAllocatedQuantity <= 0) && 'font-semibold text-red-600'}`}>{formatNumberWithComma(totalAllocatedQuantity)}</span>
                                        </div>
                                        {/* <div className='flex flex-row'>
                                            <label className='basis-1/2 text-lg'>Display Quantites By</label>
                                            <span className='text-lg'>1</span>
                                        </div> */}
                                    </div>
                                </div>
                            </Fieldset>
                            <Fieldset
                                legend="Serial Number Creation"
                                className='mt-4'
                            >

                                <DataTable
                                    id="serial-creation-table"
                                    responsiveLayout
                                    header={renderSerialCreationTHeader}
                                    reorderableRows
                                    value={serialList}
                                    className="list-table p-datatable-gridlines grid"
                                    editMode
                                    showGridlines
                                    // onColumnResizeEnd={handleResizeColumn}
                                    selectionAutoFocus={false}
                                    // rows={8}
                                    // rowsPerPageOptions={[20, 50, 100, 200]}
                                    selectionMode={'checkbox'}
                                    selection={selectedSerialNumbers}
                                    onSelectionChange={(e) => {
                                        const currentValue = e.value;
                                        setSelectedSerialNumbers(e.value)
                                    }}
                                    dataKey="id__"
                                    stripedRows={false}
                                    columnResizeMode="expand"
                                    resizableColumns
                                    sortMode="multiple"
                                    removableSort
                                >
                                    <Column rowReorder style={{ width: '3rem' }} />
                                    <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
                                    {
                                        visibleSerialColumns && visibleSerialColumns.length > 0 && visibleSerialColumns.map((col, index) => (
                                            <Column
                                                key={index}
                                                // ref={index === 1 ? columnRef : null}
                                                header={col.header}
                                                field={col.field}
                                                style={{ minWidth: col.minWidth }}
                                                body={col.body}
                                            />
                                        ))
                                    }
                                </DataTable>
                            </Fieldset>
                        </div>
                    )
                }
            </Dialog>
            <Dialog
                header={`Tuỳ chọn cột tạo ${item?.ManageSerialNumbers ? "serial" : "batch"}`}
                blockScroll
                visible={batchColumnDialogOpen}
                onHide={() => setBatchColumnDialogOpen(false)}
                style={{ width: '50vw' }}
                breakpoints={{ '960px': '75vw', '641px': '100vw' }}
            >
                <div clasName="m-0 p-2 pt-1">
                    <ListBox filter listStyle={{ height: '400px' }} multiple value={visibleBatchColumns} itemTemplate={BatchSerialColumnOptionTemplate} onChange={onBatchColumnToggle} options={batchContentColumns} optionLabel="header" className="w-full mt-3" />
                </div>
            </Dialog>
            <Dialog
                header="Tuỳ chọn cột tạo serial number"
                blockScroll
                visible={serialColumnDialogOpen}
                onHide={() => setSerialColumnDialogOpen(false)}
                style={{ width: '50vw' }}
                breakpoints={{ '960px': '75vw', '641px': '100vw' }}
            >
                <div clasName="m-0 p-2 pt-1">
                    <ListBox filter listStyle={{ height: '400px' }} multiple value={visibleSerialColumns} itemTemplate={BatchSerialColumnOptionTemplate} onChange={onSerialColumnToggle} options={serialContentColumns} optionLabel="header" className="w-full mt-3" />
                </div>
            </Dialog>
            <Dialog
                header={`Automatic ${item?.ManageBatchNumbers ? "Batch" : "Serial Number"} Creation`}
                footer={renderAutomaticDFooter}
                onHide={handleHideAutomaticCreationModal}
                visible={automaticCreationModalOpen}
                style={{
                    minWidth: "30vw",
                    minHeight: '75vh'
                }}
                breakpoints={{ '960px': '80vw', '641px': '100vw' }}
                blockScroll
            >
                <div className='card'>
                    {
                        item?.ManageBatchNumbers ? (
                            <div className='space-y-4'>
                                <div className="flex sm:items-center sm:flex-row flex-column gap-2">
                                    <label className="font-semibold sm:!w-2/5 w-full">Item No.</label>
                                    <span className="p-inputtext text-base sm:!w-3/5 w-full">{item?.ItemCode ? item?.ItemCode : ''}</span>
                                </div>
                                <div className="flex sm:items-center sm:flex-row flex-column gap-2">
                                    <label className="font-semibold sm:!w-2/5 w-full">Item Description</label>
                                    <span className="p-inputtext text-base sm:!w-3/5 w-full">{item?.ItemDescription ? item?.ItemDescription : ''}</span>
                                </div>
                                <div className="flex sm:items-center sm:flex-row flex-column gap-2">
                                    <label className="font-semibold sm:!w-2/5 w-full">Warehouse Code</label>
                                    <span className="p-inputtext text-base sm:!w-3/5 w-full">{item?.Warehouse?.code ? item?.Warehouse?.code : ''}</span>
                                </div>
                                <div className="flex sm:items-center sm:flex-row flex-column gap-2">
                                    <label className="font-semibold sm:!w-2/5 w-full">Warehouse Name</label>
                                    <span className="p-inputtext text-base sm:!w-3/5 w-full">{item?.Warehouse?.name ? item?.Warehouse?.name : ''}</span>
                                </div>
                                <div className="flex sm:items-center sm:flex-row flex-column gap-2">
                                    <label className="font-semibold sm:!w-2/5 w-full">Quantity</label>
                                    <InputNumber className="p-inputtext-sm sm:!w-3/5 w-full" value={currentBatchCreation?.Quantity} showButtons min={0} max={item?.Quantity - totalAllocatedQuantity} maxFractionDigits={2} onValueChange={(e) => setCurrentBatchCreation(prev => ({ ...prev, Quantity: e.value }))} />
                                </div>
                                <div className="flex sm:items-center sm:flex-row flex-column gap-2">
                                    <label className="font-semibold sm:!w-2/5 w-full">No. of Batches</label>
                                    <InputNumber inputId="integeronly" className="p-inputtext-sm sm:!w-3/5 w-full" min={1} showButtons value={currentBatchCreation?.NoOfBatches} onValueChange={(e) => setCurrentBatchCreation(prev => ({ ...prev, NoOfBatches: e.value }))} />
                                </div>
                                <div className="flex sm:items-center sm:flex-row flex-column gap-2">
                                    <label className="font-semibold sm:!w-2/5 w-full">Batch</label>
                                    <div className="p-inputtext text-base p-component sm:!w-3/5 w-full p-0 flex justify-between items-center border-r-0">
                                        <div className="p-2">
                                            <p className={`truncate`}>{currentBatchCreation?.Batch?.length || 0} {" "} criteria(s)</p>
                                        </div>
                                        <Button icon="pi pi-list" onClick={() => handleOpenAutomaticStringModal(1)} />
                                    </div>
                                </div>
                                <div className="flex sm:items-center sm:flex-row flex-column gap-2">
                                    <label className="font-semibold sm:!w-2/5 w-full">Batch Attribute 1</label>
                                    <div className="p-inputtext text-base p-component sm:!w-3/5 w-full p-0 flex justify-between items-center border-r-0">
                                        <div className="p-2">
                                            <p className={`truncate`}>{currentBatchCreation?.BatchAttribute1?.length || 0} {" "} criteria(s)</p>
                                        </div>
                                        <Button icon="pi pi-list" onClick={() => handleOpenAutomaticStringModal(2)} />
                                    </div>
                                </div>
                                <div className="flex sm:items-center sm:flex-row flex-column gap-2">
                                    <label className="font-semibold sm:!w-2/5 w-full">Batch Attribute 2</label>
                                    <div className="p-inputtext text-base p-component sm:!w-3/5 w-full p-0 flex justify-between items-center border-r-0">
                                        <div className="p-2">
                                            <p className={`truncate`}>{currentBatchCreation?.BatchAttribute2?.length || 0} {" "} criteria(s)</p>
                                        </div>
                                        <Button icon="pi pi-list" onClick={() => handleOpenAutomaticStringModal(3)} />
                                    </div>
                                </div>
                                <div className="flex sm:items-center sm:flex-row flex-column gap-2">
                                    <label htmlFor='admission-date-batch-el' className="font-semibold sm:!w-2/5 w-full">Admission Date</label>
                                    <Calendar id="admission-date-batch-el" dateFormat="dd/mm/yy" className="text-base sm:!w-3/5 w-full" value={currentBatchCreation?.AdmissionDate} onChange={(e) => setCurrentBatchCreation(prev => ({ ...prev, AdmissionDate: e.value }))} showIcon />
                                </div>
                                <div className="flex sm:items-center sm:flex-row flex-column gap-2">
                                    <label htmlFor='manufacturing-date-batch-el' className="font-semibold sm:!w-2/5 w-full">Manufacturing Date</label>
                                    <Calendar id="manufacturing-date-batch-el" dateFormat="dd/mm/yy" className="text-base sm:!w-3/5 w-full" value={currentBatchCreation?.ManufacturingDate} onChange={(e) => setCurrentBatchCreation(prev => ({ ...prev, ManufacturingDate: e.value }))} showIcon />
                                </div>
                                <div className="flex sm:items-center sm:flex-row flex-column gap-2">
                                    <label htmlFor='expiration-date-batch-el' className="font-semibold sm:!w-2/5 w-full">Expiration Date</label>
                                    <Calendar id="expiration-date-batch-el" dateFormat="dd/mm/yy" className="text-base sm:!w-3/5 w-full" value={currentBatchCreation?.ExpirationDate} onChange={(e) => setCurrentBatchCreation(prev => ({ ...prev, ExpirationDate: e.value }))} showIcon />
                                </div>
                                <div className="flex sm:items-center sm:flex-row flex-column gap-2">
                                    <label className="font-semibold sm:!w-2/5 w-full">Location</label>
                                    <InputText className="p-inputtext text-base sm:!w-3/5 w-full" value={currentBatchCreation?.Location} onChange={(e) => setCurrentBatchCreation(prev => ({ ...prev, Location: e.target.value }))} />
                                </div>
                                <div className="flex sm:items-center sm:flex-row flex-column gap-2">
                                    <label className="font-semibold sm:!w-2/5 w-full">Details</label>
                                    <InputText className="p-inputtext text-base sm:!w-3/5 w-full" value={currentBatchCreation?.Details} onChange={(e) => setCurrentBatchCreation(prev => ({ ...prev, Details: e.target.value }))} />
                                </div>
                                <div className="flex sm:items-center sm:flex-row flex-column gap-2">
                                    <label className="font-semibold sm:!w-2/5 w-full">System Number</label>
                                    <span className="p-inputtext text-base sm:!w-3/5 w-full min-h-[44.7px]">{currentBatchCreation?.SystemNumber}</span>
                                </div>
                            </div>
                        ) : (
                            <div className='space-y-4'>
                                <div className="flex sm:items-center sm:flex-row flex-column gap-2">
                                    <label className="font-semibold sm:!w-2/5 w-full">Item No.</label>
                                    <span className="p-inputtext text-base sm:!w-3/5 w-full">{item?.ItemCode ? item?.ItemCode : ''}</span>
                                </div>
                                <div className="flex sm:flex-row flex-column gap-2">
                                    <label className="font-semibold sm:!w-2/5 w-full">Item Description</label>
                                    <span className="p-inputtext text-base sm:!w-3/5 w-full">{item?.ItemDescription ? item?.ItemDescription : ''}</span>
                                </div>
                                <div className="flex sm:flex-row flex-column gap-2">
                                    <label className="font-semibold sm:!w-2/5 w-full">Warehouse Code</label>
                                    <span className="p-inputtext text-base sm:!w-3/5 w-full">{item?.Warehouse?.code ? item?.Warehouse?.code : ''}</span>
                                </div>
                                <div className="flex sm:flex-row flex-column gap-2">
                                    <label className="font-semibold sm:!w-2/5 w-full">Warehouse Name</label>
                                    <span className="p-inputtext text-base sm:!w-3/5 w-full">{item?.Warehouse?.name ? item?.Warehouse?.name : ''}</span>
                                </div>
                                <div className="flex sm:items-center sm:flex-row flex-column gap-2">
                                    <label className="font-semibold sm:!w-2/5 w-full">Quantity</label>
                                    <InputNumber inputId="integeronly" className="p-inputtext-sm sm:!w-3/5 w-full" min={1} max={item?.Quantity - totalAllocatedQuantity} showButtons value={currentSerialNumberCreation?.Quantity} onValueChange={(e) => setCurrentSerialNumberCreation(prev => ({ ...prev, Quantity: e.value }))} />
                                </div>
                                <div className="flex sm:flex-row flex-column gap-2">
                                    <label className="font-semibold sm:!w-2/5 w-full">Mfr Serial No.</label>
                                    <div className="p-inputtext text-base p-component sm:!w-3/5 w-full p-0 flex justify-between items-center border-r-0">
                                        <div className="p-2">
                                            <p className={`truncate`}>{currentSerialNumberCreation?.MfrSerialNo?.length || 0} {" "} criteria(s)</p>
                                        </div>
                                        <Button icon="pi pi-list" onClick={() => handleOpenAutomaticStringModal(4)} />
                                    </div>
                                </div>
                                <div className="flex sm:flex-row flex-column gap-2">
                                    <label className="font-semibold sm:!w-2/5 w-full">Serial Number</label>
                                    <div className="p-inputtext text-base p-component sm:!w-3/5 w-full p-0 flex justify-between items-center border-r-0">
                                        <div className="p-2">
                                            <p className={`truncate`}>{currentSerialNumberCreation?.SerialNumber?.length || 0} {" "} criteria(s)</p>
                                        </div>
                                        <Button icon="pi pi-list" onClick={() => handleOpenAutomaticStringModal(5)} />
                                    </div>
                                </div>
                                <div className="flex sm:flex-row flex-column gap-2">
                                    <label className="font-semibold sm:!w-2/5 w-full">Lot Number</label>
                                    <div className="p-inputtext text-base p-component sm:!w-3/5 w-full p-0 flex justify-between items-center border-r-0">
                                        <div className="p-2">
                                            <p className={`truncate`}>{currentSerialNumberCreation?.LotNumber?.length || 0} {" "} criteria(s)</p>
                                        </div>
                                        <Button icon="pi pi-list" onClick={() => handleOpenAutomaticStringModal(6)} />
                                    </div>
                                </div>
                                <div className="flex sm:items-center sm:flex-row flex-column gap-2">
                                    <label htmlFor='admission-date-serial-el' className="font-semibold sm:!w-2/5 w-full">Admission Date</label>
                                    <Calendar id="admission-date-serial-el" dateFormat="dd/mm/yy" className="text-base sm:!w-3/5 w-full" value={currentSerialNumberCreation?.AdmissionDate} onChange={(e) => setCurrentSerialNumberCreation(prev => ({ ...prev, AdmissionDate: e.value }))} showIcon />
                                </div>
                                <div className="flex sm:items-center sm:flex-row flex-column gap-2">
                                    <label htmlFor='manufacturing-date-serial-el' className="font-semibold sm:!w-2/5 w-full">Manufacturing Date</label>
                                    <Calendar id="manufacturing-date-serial-el" dateFormat="dd/mm/yy" className="text-base sm:!w-3/5 w-full" value={currentSerialNumberCreation?.ManufacturingDate} onChange={(e) => setCurrentSerialNumberCreation(prev => ({ ...prev, ManufacturingDate: e.value }))} showIcon />
                                </div>
                                <div className="flex sm:items-center sm:flex-row flex-column gap-2">
                                    <label htmlFor='expiration-date-serial-el' className="font-semibold sm:!w-2/5 w-full">Expiration Date</label>
                                    <Calendar id="expiration-date-serial-el" dateFormat="dd/mm/yy" className="text-base sm:!w-3/5 w-full" value={currentSerialNumberCreation?.ExpirationDate} onChange={(e) => setCurrentSerialNumberCreation(prev => ({ ...prev, ExpirationDate: e.value }))} showIcon />
                                </div>
                                <div className="flex sm:items-center sm:flex-row flex-column gap-2">
                                    <label htmlFor='mfr-start-el' className="font-semibold sm:!w-2/5 w-full">Mfr Warranty Start</label>
                                    <Calendar id="mfr-start-el" dateFormat="dd/mm/yy" className="text-base sm:!w-3/5 w-full" value={currentSerialNumberCreation?.MfrWarrantyStart} onChange={(e) => setCurrentSerialNumberCreation(prev => ({ ...prev, MfrWarrantyStart: e.value }))} showIcon />
                                </div>
                                <div className="flex sm:items-center sm:flex-row flex-column gap-2">
                                    <label htmlFor='mfr-end-el' className="font-semibold sm:!w-2/5 w-full">Mfr Warranty End</label>
                                    <Calendar id="mfr-end-el" dateFormat="dd/mm/yy" className="text-base sm:!w-3/5 w-full" value={currentSerialNumberCreation?.MfrWarrantyEnd} onChange={(e) => setCurrentSerialNumberCreation(prev => ({ ...prev, MfrWarrantyEnd: e.value }))} showIcon />
                                </div>
                                <div className="flex sm:flex-row flex-column gap-2">
                                    <label className="font-semibold sm:!w-2/5 w-full">Location</label>
                                    <InputText className="p-inputtext text-base sm:!w-3/5 w-full" value={currentSerialNumberCreation?.Location} onChange={(e) => setCurrentSerialNumberCreation(prev => ({ ...prev, Location: e.target.value }))} />
                                </div>
                                <div className="flex sm:flex-row flex-column gap-2">
                                    <label className="font-semibold sm:!w-2/5 w-full">Details</label>
                                    <InputText className="p-inputtext text-base sm:!w-3/5 w-full" value={currentSerialNumberCreation?.Details} onChange={(e) => setCurrentSerialNumberCreation(prev => ({ ...prev, Details: e.target.value }))} />
                                </div>
                                <div className="flex sm:flex-row flex-column gap-2">
                                    <label className="font-semibold sm:!w-2/5 w-full">System Number</label>
                                    <span className="p-inputtext text-base sm:!w-3/5 w-full min-h-[44.7px]">{currentSerialNumberCreation?.SystemNumber}</span>
                                </div>
                            </div>
                        )
                    }
                </div>
            </Dialog >
            <Dialog
                header="Automatic String Creation"
                footer={renderStringDFooter}
                onHide={handleHideStringCreationModal}
                visible={stringCreationModalOpen}
                closable={!isPreventClose}
                style={{
                    minWidth: "30vw",
                    minHeight: '75vh'
                }}
                breakpoints={{ '960px': '80vw', '641px': '100vw' }}
                blockScroll
            >
                <div className='card'>
                    <div className='space-y-4'>
                        <DataTable
                            value={automaticStringCriterias}
                            id="string-creation-table"
                            className="list-table p-datatable-gridlines"
                            editMode
                            showGridlines
                            dataKey="id__"
                            stripedRows={false}
                            responsiveLayout="scroll"
                        >
                            {
                                stringContentColumns && stringContentColumns.length > 0 && stringContentColumns.map((col, index) => (
                                    <Column
                                        key={index}
                                        // ref={index === 1 ? columnRef : null}
                                        header={col.header}
                                        field={col.field}
                                        style={{ minWidth: col.minWidth }}
                                        body={col.body}
                                    />
                                ))
                            }
                        </DataTable>
                    </div>
                </div>
            </Dialog >
            <ConfirmPopup />
            <ConfirmDialog />

        </>
    )

}

export default BatchSerialCreation