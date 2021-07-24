import { Context } from 'koa';

export default async function (ctx: Context, next: Function) {
    ctx.allCookies = getCookies(ctx.request.header.cookie);
    await next();
}

type Obj = {
    [key: string]: string;
};

function getCookies(cookies?: string) {
    let res: Obj = {};
    if (!cookies) {
        return res;
    }
    const cookiesArr = cookies.split(';');
    cookiesArr.forEach(function (item) {
        const crumbs = item.split('=');
        if (crumbs.length > 1) {
            res[crumbs[0].trim()] = crumbs[1].trim();
        }
    });
    return res;
}

export function cookies2String(cookies: Obj): string {
    let res = '';
    for (const k in cookies) {
        res += `${k}=${cookies[k]};`;
    }
    return res;
}
