export const searchTree = (
    tree: any,
    value: string | number,
    key = 'id',
    reverse = false,
) => {
    const stack = [...tree];
    while (stack.length) {
        const node: {childs?: any[]; [key: string]: any} = stack[
            reverse ? 'pop' : 'shift'
        ]() as any;
        if (node?.[key as keyof typeof node] === value) {
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
    const replacer = (_: string, value: string | null) =>
        value === null ? '' : value;
    return JSON.stringify(val, replacer, 0);
};
