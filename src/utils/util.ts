function checkIfNullOrUndefined(...params: any[]): null | string {
    for(let p of params) {
        if (p == null) {
            return Object.keys(p)[0];
        }
    }
    return null;
}

export { checkIfNullOrUndefined }