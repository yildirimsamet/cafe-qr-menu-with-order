export const formatPrice = (value) => {
    const isStringAndInteger = typeof value === 'string' && !value.includes('.') && !value.includes(',');

    if (isStringAndInteger) {
        return parseInt(value, 10);
    }

    const shouldUnformat = String(value).includes(',');

    if (shouldUnformat) {
        return parseFloat(value.toString().replace(/\./g, '').replace(',', '.'));
    } else {
        return new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
    }
};

