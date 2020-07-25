export const getBaseUrl = httpRequestOrResponseObj => {
    return `${httpRequestOrResponseObj.protocol}://${httpRequestOrResponseObj.get('host')}/api/v1`
}

export const sanitize = (string, removeAll) => {
    let all = typeof removeAll !== "undefined" ? removeAll : true;
    if (string) {
        return all ?
            string.trim().replace(/[ ]+/g, "") 
            :
            string.trim().replace(/[ ]+/g, " "); 
    }
};