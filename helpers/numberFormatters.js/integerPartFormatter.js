export const formatIntegerPart = (integerPart) => {
    if (typeof integerPart !== 'string') {
        return null;
    }

    if (integerPart.length <= 3) {
        return integerPart;
    }

    const formattedIntegerPart = [];
    let count = 0;

    for (let i = integerPart.length - 1; i >= 0; i--) {
        count++;

        if (count === 4 && i !== 0) {
            formattedIntegerPart.push(',');
            count = 1;
        }

        formattedIntegerPart.push(integerPart[i]);
    }

    return formattedIntegerPart.reverse().join('');
};