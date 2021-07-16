import getType from './getType';

export type Obj = {
    [key: string]: any;
    [index: number]: any;
};

const noBreakSpace = '\xa0';
function setSpace(count: number, base: number = 4) {
    return noBreakSpace.repeat(count * base);
}

export default function json2interface(
    json: Obj,
    name: string,
    suffix: string = 'Param'
): string {
    function dfs(_json: Obj | any[], level: number = 1): string {
        const space = setSpace(level);
        const isObj = getType(_json) === 'object';
        let res: string = '';
        let type: string;
        for (let k in _json) {
            type = getType(_json[k]);
            switch (type) {
                case 'array':
                    if (getType(_json[k][0]) === 'object') {
                        res += `${space}${k}:${noBreakSpace}{
${dfs(_json[k][0], level + 1)}${space}}[];\n`;
                    } else {
                        res += `${space}${k}:${noBreakSpace}${getType(_json[k][0])}[];\n`;
                    }
                    break;
                case 'object':
                    res += `${space}${k}:${noBreakSpace}{
${dfs(_json[k], level + 1)}
${space}};\n`;
                    break;
                default:
                    res += `${space}${k}:${noBreakSpace}${type};\n`;
                    break;
            }
        }
        return res;
    }

    return `
interface ${name}${suffix}${noBreakSpace}{
${dfs(json)}}
`;
}
