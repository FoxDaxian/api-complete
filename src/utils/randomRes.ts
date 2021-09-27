import getType from './getType';
import { Obj } from './json2interface';
const cloneDeep = require('lodash/fp/cloneDeep');

const str = [
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
];
const strLen = 35;
function getRandomString() {
    let res = '';
    for (let i = 0, len = 10; i < len; ++i) {
        const id = Math.ceil(Math.random() * strLen);
        res += str[id];
    }
    return res;
}
function getRandomNumber() {
    return (Math.random() * 100) >>> 0;
}
function getRandomBoolean() {
    return Boolean((Math.random() * 2) >>> 0);
}

export default (res: string) => {
    try {
        const resInterface = JSON.parse(res);
        function dfs(_interface: Obj | any[]) {
            const isArray = getType(_interface) === 'array';
            let _res: Obj = isArray ? [] : {};
            if (isArray) {
                const randomLen = ((Math.random() * 10) >>> 0) + 10;
                for (let i = 0; i < randomLen; ++i) {
                    _interface.push(cloneDeep(_interface[0]));
                }
            }
            let curType: string;
            for (let k in _interface) {
                // @ts-ignore
                curType = getType(_interface[k]);
                switch (curType) {
                    case 'object':
                        _res[k] = dfs(_interface[k]);
                        break;
                    case 'array':
                        _res[k] = dfs(_interface[k]);
                        break;
                    case 'string':
                        _res[k] = getRandomString();
                        break;
                    case 'number':
                        _res[k] = getRandomNumber();
                        break;
                    case 'boolean':
                        _res[k] = getRandomBoolean();
                        break;
                }
            }
            return _res;
        }
        const response = dfs(resInterface);
        if (response.result) {
            response.result = '1';
        }
        return response;
    } catch (e) {}
    return 'response parse error, this is failback content. please check your api code!!';
};
