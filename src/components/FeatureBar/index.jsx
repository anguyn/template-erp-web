import React from 'react';
import { SplitButton } from 'primereact/splitbutton';
import { Button } from 'primereact/button';
import toast from 'react-hot-toast';

const FeatureBar = ({ className, style }) => {
    const functionGroup1 = [
        {
            label: 'Update',
            icon: 'pi pi-refresh',
            command: () => {
                toast("Hello 1")
            }
        },
        {
            label: 'Delete',
            icon: 'pi pi-times',
            command: () => {
                toast("Hello 2")
            }
        },
        {
            label: 'React Website',
            icon: 'pi pi-external-link',
            command: () => {
                toast("Hello 3")
            }
        },
        {
            label: 'Upload',
            icon: 'pi pi-upload',
            command: () => {
                toast("Hello 4")
            }
        }
    ];

    const functionGroup2 = [
        {
            label: 'Update',
            icon: 'pi pi-refresh',
            command: () => {
                toast("Hello 1")
            }
        },
        {
            label: 'Delete',
            icon: 'pi pi-times',
            command: () => {
                toast("Hello 2")
            }
        },
        {
            label: 'React Website',
            icon: 'pi pi-external-link',
            command: () => {
                toast("Hello 3")
            }
        },
        {
            label: 'Upload',
            icon: 'pi pi-upload',
            command: () => {
                toast("Hello 4")
            }
        }
    ];

    const handleClickFunctGroup1 = () => {
        toast("Developing...");
    }

    const handleClickFunctGroup2 = () => {
        toast("Developing...");
    }

    return (
        <div style={style} className={`card fixed bottom-0 right-[2rem] shadow flex gap-2 justify-end items-center py-2 ${className}`}>
            <div>
                <SplitButton label="Add & View" onClick={handleClickFunctGroup1} model={functionGroup1} />
            </div>
            <div>
                <SplitButton label="Save as Draft & New" onClick={handleClickFunctGroup2} model={functionGroup2} />
            </div>
            <div>
                <Button label="Cancel" severity="cancel" text />
            </div>
        </div>
    )
}

export default FeatureBar;