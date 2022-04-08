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
