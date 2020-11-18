import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import { get_variable_list } from '../../util';
// import * as myExtension from '../../extension';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('get source line', () => {
		assert.deepEqual(get_variable_list("\tname := d"), ["name", "d"])

	});
});
