const findChangedFields = (originalData, pickedData, fieldsToCheck) => {
    const changedFields = {};

    fieldsToCheck.forEach(field => {
        if (originalData[field] !== pickedData[field]) {
            changedFields[field] = pickedData[field];
        }
    });

    return changedFields;
};

export {
    findChangedFields
}