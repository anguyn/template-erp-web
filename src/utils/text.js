function capitalizeWords(str) {
    return str
        .split(' ')
        .map(word => {
            if (word.length === 0) return ''; // Xử lý trường hợp chuỗi rỗng

            const firstChar = word[0];
            const restOfWord = word.slice(1);

            if (/[a-zA-Z]/.test(firstChar)) {
                return firstChar.toUpperCase() + restOfWord.toLowerCase();
            } else {
                return word;
            }
        })
        .join(' ');
}

export {
    capitalizeWords
}