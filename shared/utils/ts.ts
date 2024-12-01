export const isArrayNonEmpty = <T>(array: T[] | never): array is T[] => Array.isArray(array) && array.length > 0;
