function formatNumberWithComma(num) {
    if (isNaN(num) || num === 0 || num === null || num === undefined) {
        return '-';
    }

    var isNegative = false;
    if (num < 0) {
        isNegative = true;
        num = Math.abs(num);
    }

    if (num % 1 !== 0) {
        num = num.toFixed(2);
    }

    var parts = num.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    var formattedNumber = isNegative ? '(' + parts.join('.') + ')' : parts.join('.');

    return formattedNumber;
}

function parseNumberWithoutComma(str) {
    if (str === '-') {
        return null;
    }
    
    var isNegative = str.includes('(') && str.includes(')');
    str = str.replace(/[^\d.-]/g, '');
    
    var num = parseFloat(str);
    
    if (isNegative) {
        num = Math.abs(num) * -1;
    }
    
    return num;
}

export { formatNumberWithComma, parseNumberWithoutComma };
