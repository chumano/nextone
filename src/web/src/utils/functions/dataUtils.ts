export function parseData<T>(value: string | undefined, defaultValue: T) {
    if (value === "" || value === null || value === undefined) {
        return defaultValue
    }

    try {
        return JSON.parse(value);
    } catch { }

    return defaultValue;
}