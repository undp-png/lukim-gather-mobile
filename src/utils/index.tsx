export const searchTree = (tree, value, key = 'id', reverse = false) => {
    const stack = [...tree];
    while (stack.length) {
        const node = stack[reverse ? 'pop' : 'shift']();
        if (node[key] === value) {
            return node;
        }
        node.childs && stack.push(...node.childs);
    }
    return null;
};

interface Config {
    title: string;
    dataKey: string;
}

export const jsonToCSV = (array: Array<any>, config: Array<Config>) => {
    const header = config.map(item => item.title).join(',');
    const rows = array
        .map(item => {
            return config
                .map(({dataKey}) => {
                    return getDescendantPropValue(item, dataKey);
                })
                .join(',');
        })
        .join('\n');
    console.log('');
    console.log('csv', rows);
    return header + '\n' + rows;
};

const getDescendantPropValue = (obj: any, dataKey: string) => {
    var arr = dataKey.split('.');
    var val = obj;
    for (var i = 0; i < arr.length; i++) {
        val = val?.[arr[i]];
    }
    const replacer = (key, value) => (value === null ? '' : value);
    return JSON.stringify(val, replacer, 0);
};
