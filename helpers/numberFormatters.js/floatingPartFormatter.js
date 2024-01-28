export const formatFloatPart = (floatPart) => {
    if (typeof floatPart !== 'string') {
        return null;
    }

    if (floatPart.length <= 3) {
        return floatPart;
    }

    const formattedDecimalPartArray = [];
    let count = 0;

    for (let i = 0; i < floatPart.length; i++) {
        if (count === 4 && i !== floatPart.length - 1) {
            formattedDecimalPartArray.push(' ');
            count = 1;
        }
        count++;

        formattedDecimalPartArray.push(floatPart[i]);
    }

    console.log(formattedDecimalPartArray);
    return formattedDecimalPartArray.join('');
};
