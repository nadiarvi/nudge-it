export const formatDisplayName = (name: string) => {
    const trimmedName = name.trim();
    if (!trimmedName) {
        return;
    }

    const firstLetter = trimmedName.slice(0, 1).toUpperCase();
    const restOfName = trimmedName.slice(1).toLowerCase();

    return firstLetter + restOfName;
};