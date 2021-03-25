export const convertToFormatDate = (value = new Date(1975, 3, 30)) => {
    return String(value.getDate())
        .concat(' / ')
        .concat(String(value.getMonth() + 1))
        .concat(' / ')
        .concat(String(value.getFullYear()));
};
