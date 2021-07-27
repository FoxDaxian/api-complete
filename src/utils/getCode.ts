import { RequestInfo } from './parse';
import * as vscode from 'vscode';

export const apiStart = '// api start';
export const apiEnd = '// api end';

type ElementType<T extends ReadonlyArray<unknown>> = T extends ReadonlyArray<
    infer ElementType
>
    ? ElementType
    : never;

export const supportedLanguages = ['typescript', 'javascript'] as const;
export type SupportedLanguages = ElementType<typeof supportedLanguages>;

export default (requestInfo: RequestInfo) => {
    const fileType: string = vscode.window.activeTextEditor?.document
        .languageId as string;
    return generates[fileType as SupportedLanguages](requestInfo);
};

const generates = {
    typescript(requestInfo: RequestInfo) {
        const textStr: string = `
${apiStart}
${requestInfo.request}
${requestInfo.response}
export function ${requestInfo.name}(param: ${requestInfo.name}Param): Promise<${requestInfo.name}Res> {
    return request.${requestInfo.method}('${requestInfo.url}', param);
}\n${apiEnd}\n`;
        return {
            textStr,
            lines: textStr.split('\n').length,
        };
    },
    javascript(requestInfo: RequestInfo) {
        const textStr = `
${apiStart}
export function ${requestInfo.name}(param) {
    return request.${requestInfo.method}('${requestInfo.url}', param);
}${apiEnd}\n\n`;
        return {
            textStr,
            lines: textStr.split('\n').length,
        };
    },
};
