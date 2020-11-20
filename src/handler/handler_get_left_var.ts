import * as vscode from "vscode"
import { change_case } from "../change_case";
import { service_position_history_add_position } from "../service/service_position_history";


export function get_left_var(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
    /**
     *
     * name["test"] = => ['name["test"]', "name", "test"]
     * Name:   => name
     *
     */
    let cursor = textEditor.selection.active;
    service_position_history_add_position(cursor)
    let document = textEditor.document;
    let line = document.lineAt(cursor.line);
    let ident = line.firstNonWhitespaceCharacterIndex
    let op_index = -1
    op_index = line.text.indexOf(":=")
    if (op_index === -1) {
        op_index = line.text.indexOf("=")
    }
    if (op_index === -1) {
        op_index = line.text.indexOf(":")
    }
    let var_text = line.text.slice(ident, op_index)
    var_text = change_case(var_text)
    edit.insert(cursor, var_text);

}