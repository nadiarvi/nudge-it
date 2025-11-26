export const formatDisplayName = (name: string) => {
    console.assert(typeof name === 'string', `Expected a string for name formatting, but received ${typeof name}`);
    if (!name) return 'Unknown';
    
    const trimmedName = name.trim();
    if (!trimmedName) {
        return;
    }

    const firstLetter = trimmedName.slice(0, 1).toUpperCase();
    const restOfName = trimmedName.slice(1).toLowerCase();

    return firstLetter + restOfName;
};