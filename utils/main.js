function toTitleCase(str) {
    const firstLetter = str[0].toUpperCase();
    const rest = str.slice(1).toLowerCase();
    return firstLetter + rest;
}

export { toTitleCase };
