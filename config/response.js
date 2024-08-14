export const response = ({isSuccess, code, message}, data) => {
    return {
        isSuccess: isSuccess,
        code: code,
        message: message,
        data: data
    }
};