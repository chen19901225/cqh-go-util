import * as vscode from "vscode"

export function last_line_var(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
    let cursor = textEditor.selection.active;
    let document = textEditor.document;
    let line = document.lineAt(cursor.line);
    for (let i = cursor.line - 1; i > 0; i++) {
        let last_line = document.lineAt(i);

        let ident = line.firstNonWhitespaceCharacterIndex;
        let last_op_index = -1
        last_op_index = last_line.text.indexOf(":=")
        if (last_op_index == -1) {
            last_op_index = last_line.text.indexOf("=")

        }
        if (last_op_index == -1) {
            if (i <= 0) {
                throw new Error(`cannot find op in last line [${last_line.text}]`)
            }
            continue;

        }
        let last_variable = last_line.text.slice(ident, last_op_index).trim();
        edit.insert(cursor, last_variable);
        break
    }

}