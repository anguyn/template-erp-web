function isoToDateFormat(isoString) {
    const date = new Date(isoString);
    
    const day = String(date.getDate()).padStart(2, '0'); // Thêm '0' vào đầu nếu cần
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
}

export {
    isoToDateFormat
}