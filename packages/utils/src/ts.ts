export const isArrayNonEmpty = <T>(array: T[] | null | undefined | unknown): array is T[] => Array.isArray(array) && array.length > 0;
