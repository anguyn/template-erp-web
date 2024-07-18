import { isISODateString } from "./date";

const findChangedFields = (originalData, pickedData, fieldsToCheck) => {
    const changedFields = {};

    console.log("Moẹ original: ", originalData)
    console.log("Moẹ mới: ", pickedData)

    fieldsToCheck.forEach(field => {
        if (!(originalData[field] instanceof Date)) {
            // Xử lý chuỗi có khoảng cách
            let originalPickedData;
            let currentPickedData;
            if (typeof originalData[field] === 'string' || originalData[field] instanceof String) {
                originalPickedData = originalData[field].trim();
                // currentPickedData = pickedData[field];
            } else originalPickedData = originalData[field];

            if (typeof pickedData[field] === 'string' || pickedData[field] instanceof String) {
                currentPickedData = pickedData[field].trim();
                // currentPickedData = pickedData[field];
            } else currentPickedData = pickedData[field];
            
            if (originalPickedData !== currentPickedData) {
                changedFields[field] = currentPickedData;
            }
        } else {
            const convertedOriginalDate = new Date(originalData[field]);
            const convertedPickedDate = new Date(pickedData[field]);
            
            convertedOriginalDate.setHours(0, 0, 0, 0);
            convertedPickedDate.setHours(0, 0, 0, 0);
            
            if (convertedOriginalDate.getTime() != convertedPickedDate.getTime()) {
                // const isoStringLocal = convertedPickedDate.toISOString();
                
                changedFields[field] = convertedPickedDate;
            }


        }
    });

    return changedFields;
};

export {
    findChangedFields
}