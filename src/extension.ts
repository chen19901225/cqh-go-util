// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { last_line_var } from './handler/handler_last_line_var';
import { left_variable_apply } from './handler/handler_left_variable_apply';
import { var_prefix } from './handler/handler_var_prefix';
import { var_suffix } from './handler/handler_var_suffix';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "cqh-go-util" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerTextEditorCommand('cqh-go-util.left_variable_apply', (textEditor, edit) => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		//vscode.window.showInformationMessage('Hello World from cqh-go-util!');
		left_variable_apply(textEditor, edit);
	});

	context.subscriptions.push(disposable);

	let last_line_disposable = vscode.commands.registerTextEditorCommand("cqh-go-util.last_line_var", (textEditor, edit) => {
		last_line_var(textEditor, edit);
	})
	context.subscriptions.push(last_line_disposable);
	let var_prefix_disposable = vscode.commands.registerTextEditorCommand("cqh-go-util.var_prefix", (textEditor, edit) => {
		var_prefix(textEditor, edit);
	})
	context.subscriptions.push(var_prefix_disposable);

	let var_suffix_disposable = vscode.commands.registerTextEditorCommand("cqh-go-util.var_suffix", (textEditor, edit) => {
		var_suffix(textEditor, edit);
	})
	context.subscriptions.push(var_suffix_disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }
