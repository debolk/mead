function display(number)
{
    if (!number) {
        return null;
    }
    number = number.replace(/[^0-9\+]/, '');
    return number ? number.match(/.{1,2}/g).join(' ') : null;
}

function link(number)
{
    if (!number) {
        return null;
    }
    number = number.replace(/[^0-9\+]/, '');
    if (number[0] === '0') {
        number = number.substring(1);
    }
    return `tel:+31${number}`;
}

export { display, link};
