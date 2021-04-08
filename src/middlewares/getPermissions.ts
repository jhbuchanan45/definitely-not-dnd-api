const getParams = (perm: String): String[] => {
    return perm.split(':');
}

export const getReadPermissions = (permissions: String[]): String[] => {
    let canRead: String[] = [];

    permissions.forEach((perm) => {
        const params = getParams(perm);

        if (params[0] === 'read') {
            canRead.push(params[1]);
        }
    })

    return canRead;
}

export const getWritePermissions = (permissions: String[]): String[] => {
    let canWrite: String[] = [];

    permissions.forEach((perm) => {
        const params = getParams(perm);

        if (params[0] === 'write') {
            canWrite.push(params[1]);
        }
    })

    return canWrite;
}