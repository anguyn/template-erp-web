function isISODateString(dateString) {
    const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?(Z|[\+\-]\d{2}:\d{2})?$/;
    return isoRegex.test(dateString);
}

function isoToDateFormat(isoString) {
    const date = new Date(isoString);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

function convertToISO(dateString) {
    const date = new Date(dateString);
    return date.toISOString();
}

function parseDate(dateString) {
    const [day, month, year] = dateString.split('/').map(Number);
    return new Date(year, month - 1, day); 
};

export {
    isISODateString,
    isoToDateFormat,
    convertToISO,
    parseDate
}