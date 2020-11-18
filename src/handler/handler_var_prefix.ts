import * as vscode from "vscode"
import { get_variable_list } from "../util";

export function var_prefix(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
    let cursor = textEditor.selection.active;
    let document = textEditor.document;
    let line = document.lineAt(cursor.line);
    vscode.window.showInputBox({
        password: false,
        placeHolder: "prefix",
        prompt: "请输入prefix",

    }).then((msg) => {
        if (!msg) {
            return;
        }
        msg = msg.trim();
        if (!msg) {
            return;
        }
        let replaceContent = generate_replace_string(line.text, msg);
        let newPosition = new vscode.Position(cursor.line, line.range.start.character + replaceContent.length + 1);
        textEditor.edit((builder) => {
            builder.replace(new vscode.Range(new vscode.Position(cursor.line, line.firstNonWhitespaceCharacterIndex), line.range.end), replaceContent);
        }).then((success) => {
            textEditor.selection = new vscode.Selection(newPosition, newPosition);
        })
    })
}



export function generate_replace_string(source: string, prefix: string) {
    let element_list: Array<string> = [];
    let run = "";
    let op = "="
    if (source.indexOf(":=") > -1) {
        op = ":="
    }
    let [left, right] = source.split(op)
    element_list = get_variable_list(left);

    if (element_list.length == 0) {
        console.error("element_list is null");
        vscode.window.showErrorMessage("element_list is zero length");
        throw new Error("element_list is 0 length");
    }
    let out = [];
    // let prepend_ele: string = element_list.pop();
    for (let ele of element_list) {
        ele = ele.trim();
        if (!ele) {
            continue;
        }
        // if (ele === "=") {
        //     is_left = false;
        //     out.push(ele);
        //     continue;
        // }
        out.push(prefix + ele);
        // if (is_left) {

        // } else {
        //     right_side_list.push(ele)
        // }


    }



    return out.join(", ") + ` ${op} ` + right;

}