import React from 'react';
import { SplitButton } from 'primereact/splitbutton';
import { Button } from 'primereact/button';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';

const FeatureBar = ({ className, style }) => {
    const router = useRouter();

    const functionGroup1 = [
        {
            label: 'Add & View',
            icon: 'pi pi-eye',
            command: () => {
                toast("Hello 1")
            }
        },
        {
            label: 'Add & New',
            icon: 'pi pi-plus-circle',
            command: () => {
                toast("Hello 3")
            }
        },
        {
            label: 'Add & Back',
            icon: 'pi pi-chevron-circle-left',
            command: () => {
                toast("Hello 3")
            }
        },
    ];

    const functionGroup2 = [
        {
            label: 'Save as Draft & View',
            icon: 'pi pi-eye',
            command: () => {
                toast("Hello 1")
            }
        },
        {
            label: 'Save as Draft & New',
            icon: 'pi pi-plus-circle',
            command: () => {
                toast("Hello 2")
            }
        }
    ];

    const handleClickFunctGroup1 = () => {
        toast("Developing...");
    }

    const handleClickFunctGroup2 = () => {
        toast("Developing...");
    }

    const handleRollBack = () => {
        router.back();
    }

    return (
        <div style={style} className={`card fixed bottom-0 right-[2rem] shadow-2xl flex gap-2 justify-end items-center py-2 ${className}`}>
            <div className="hidden sm:block">
                <SplitButton label="Add & View" onClick={handleClickFunctGroup1} model={functionGroup1} />
            </div>
            <div className="block sm:hidden">
                <SplitButton label="Add" onClick={handleClickFunctGroup1} model={functionGroup1} />
            </div>
            <div className="hidden sm:block">
                <SplitButton label="Save as Draft & View" onClick={handleClickFunctGroup2} model={functionGroup2} />
            </div>
            <div className="block sm:hidden">
                <SplitButton label="Save" onClick={handleClickFunctGroup2} model={functionGroup2} />
            </div>
            <div className="block sm:hidden">
                <Button label="Cancel" severity="cancel" text onClick={handleRollBack} />
            </div>
        </div>
    )
}

export default FeatureBar;