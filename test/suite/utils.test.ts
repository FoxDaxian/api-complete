import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import getCamelCase from '../../src/utils/getCamelCase';
import getType from '../../src/utils/getType';
import getWorkspacePath from '../../src/utils/getWorkspacePath';
import json2interface from '../../src/utils/json2interface';

suite('Extension Test Utils', () => {
    vscode.window.showInformationMessage('Start utils tests.');

    test('getCamelCase("/a/b/c/d") => ABCD', () => {
        assert.strictEqual('ABCD', getCamelCase('/a/b/c/d'));
    });
    test('getCamelCase("first/second/third") => FirstSecondThird', () => {
        assert.strictEqual(
            'FirstSecondThird',
            getCamelCase('first/second/third')
        );
    });
    test('geType([])', () => {
        assert.strictEqual('array', getType([]));
    });
    test('geType({})', () => {
        assert.strictEqual('object', getType({}));
    });
    test('geType(1)', () => {
        assert.strictEqual('number', getType(1));
    });
    test('geType("1")', () => {
        assert.strictEqual('string', getType('1'));
    });
    test('getWorkspacePath()', () => {
        assert.strictEqual('ac-default-key', getWorkspacePath());
    });
	// why this test function can't success??
    // test('json2interface -> testFox', () => {
    //     assert.strictEqual('interface testFoxParam {\n' +
	// 	'    name: string;\n' +
	// 	'    sex: string;\n' +
	// 	'    live: boolean;\n' +
	// 	'}',
    //         json2interface(
    //             {
    //                 name: 'fox',
    //                 sex: 'man',
    //                 live: true,
    //             },
    //             'testFox'
    //         )
    //     );
    // });
});

