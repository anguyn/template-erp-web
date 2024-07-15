function capitalizeWords(str) {
    return str.replace(/\S+/g, function(word) {
        // Nếu từ này toàn bộ là viết hoa (giữ nguyên viết hoa)
        if (word === word.toUpperCase()) {
            return word;
        } else {
            // Tìm ký tự đầu tiên (bao gồm cả Unicode)
            const firstCharIndex = word.search(/[\p{L}\p{N}]/u); // \p{L} cho các ký tự chữ cái, \p{N} cho các ký tự số
            if (firstCharIndex !== -1) {
                // Chữ cái đầu tiên viết hoa và phần còn lại viết thường
                return word.slice(0, firstCharIndex) +
                    word.charAt(firstCharIndex).toUpperCase() +
                    word.slice(firstCharIndex + 1).toLowerCase();
            }
            return word; // Trả về từ gốc nếu không tìm thấy ký tự chữ cái
        }
    });
}

export {
    capitalizeWords
};
