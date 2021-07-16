import getType from './getType';
import { Obj } from './json2interface';

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
function getRandomString() {
    let res = '';
    for (let i = 0, len = str.length; i < len; ++i) {
        const id = Math.ceil(Math.random() * 35);
        res += str[id];
    }
    return res;
}
function getRandomNumber() {
    return Math.random() * 100;
}
function getRandomBoolean() {
    return Boolean(Math.floor(Math.random() * 2));
}

export default (res: string) => {
    try {
        const resInterface = JSON.parse(res);
        function dfs(_interface: Obj | any[]) {
            const isArray = getType(_interface) === 'array';
            let _res: Obj = isArray ? [] : {};
            if (isArray) {
                const randomLen = ~~(Math.random() * 30) + 15;
                for (let i = 0; i < randomLen; ++i) {
                    _interface.push(_interface[0]);
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
        return dfs(resInterface);
    } catch (e) {}
    return 'response parse error, this is failback content. please check your api code!!';
};
