import * as vscode from "vscode";
import { get_variable_list } from "../util";

/**
 * 自动 获取=号左边的变量，然后赋值到等号右边
 *
 */

export function left_variable_apply(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
    let cursor = textEditor.selection.active;
    let document = textEditor.document;
    let line = document.lineAt(cursor.line);
    let indent = line.firstNonWhitespaceCharacterIndex;
    // let has_insert_comment = has_comment(textEditor, edit);
    let replace_list = generate_insert_string(line.text.slice(0, cursor.character), indent);
    let replaceContent = replace_list.join('\n');
    let endLine = cursor.line + replace_list.length - 1;
    let endCol = replace_list[replace_list.length - 1].length;
    let newPosition = new vscode.Position(endLine,
        endCol);

    // 现在这个也是replaced string
    //理由就是太长的话，需要格式化
    // 但是这样有个问题，replace之后的鼠标在哪里呢？
    // 算了还是insert吧
    // edit.replace(line.range, replaceContent);
    // edit.insert(cursor, replaceContent);


    textEditor.edit(builder => {
        builder.replace(line.range, replaceContent)


    }).then(success => {
        textEditor.selection = new vscode.Selection(newPosition, newPosition);
    })
}



export function generate_insert_string(source: string,
    indent: number = 0, has_insert_comment = false) {
    let element_list = [];
    let run = "";

    // 第一步分割变量
    element_list = get_variable_list(source);

    let out = [];
    let source_var = element_list.pop(); // 右边第一个变量
    if (source_var === undefined || source_var === null) {
        throw new Error(`source_list is empty for source [${source}]`)
    }
    source_var = source_var.trim();
    let right_side_list: Array<string> = []
    let left_side_list = []
    let is_first = false;
    let indent_string = source.slice(0, 1)
    // a, d = d => a, b = d[a], d[b]
    let handle_dict = (source_var: string, new_ele: string, is_first: boolean) => {
        right_side_list.push(`${source_var}["${new_ele}"]`)
        return false;
    }
    // a,b = c => a, b = c.a, c.b
    let handle_instance = (source_var: string, new_ele: string, is_first: boolean) => {

        right_side_list.push(`${source_var}.${new_ele}`)
        return false;

    }
    // a, b = q_ => a, b = q_a, q_b
    let handle_remove_prefix = (source_var: string, new_ele: string, is_first: boolean) => {
        right_side_list.push(`${source_var}${new_ele}`)
        return false;
    }
    // a, b = q(" => a, b = q("a"), q("n")
    let handle_func_call_with_double_quote = (source_var: string, new_ele: string, is_first: boolean) => {
        let format_var = source_var.slice(0, source_var.length - 2);
        right_side_list.push(`${format_var}("${new_ele}")`);
        return false;
    }
    // a, b = q(' => a, b = q('a'), q('n')
    let handle_func_call_with_single_quote = (source_var: string, new_ele: string, is_first: boolean) => {
        let format_var = source_var.slice(0, source_var.length - 2);
        right_side_list.push(`${format_var}('${new_ele}')`);
        return false;
    }
    // a, b = q( => a, b = q(a), q(b)
    let handle_func_call = (source_var: string, new_ele: string, is_first: boolean) => {
        let format_var = source_var.slice(0, source_var.length - 1);
        // if (is_first) {
        //     right_side_list.push(`${new_ele})`)
        // } else {

        // }
        right_side_list.push(`${format_var}(${new_ele})`);
        return false;
    }
    // a, b = .c() => a, b = a.c(), b.c()
    let handler_instance_method = (source_var: string, new_ele: string, is_first: boolean) => {
        right_side_list.push(`${new_ele}${source_var}`);
        return false;
    }
    let operator = "="
    if (source.indexOf(":=") > -1) {
        operator = ":="
    }


    for (let ele of element_list) {
        // out.push(ele);
        if (ele === '=' || ele === ":=") {

            break;
        }
        left_side_list.push(ele.trim());
        let new_ele: string = ele;
        let current_handle = handle_instance;
        if (new_ele.includes("[") && new_ele.includes(']')) {
            // ?
            new_ele = new_ele.split('[')[1];
            new_ele = new_ele.slice(0, new_ele.length - 1);
            new_ele = new_ele.slice(1, new_ele.length - 1);
            current_handle = handle_dict;
        } else if (source_var.endsWith("_")) { // 这种
            //username, password = request.auth_
            //expect 
            // username = request.auth_username
            // password = request.auth_password
            current_handle = handle_remove_prefix
        }
        else if (source_var.startsWith(".")) {
            // a, b = .c() => a, b = a.c(), b.c()
            current_handle = handler_instance_method;
        }
        else if (new_ele.includes(".")) {
            // a,b = c => a, b = c.a, c.b
            new_ele = new_ele.split(".").pop() as string; // 一定不可能为undefined
            current_handle = handle_instance
        } else if (source_var.endsWith("_d") || source_var.endsWith("_dict") || source_var.startsWith("d_") || source_var === 'd') {
            current_handle = handle_dict;
        } else if (source_var.endsWith('("')) {
            current_handle = handle_func_call_with_double_quote;
        } else if (source_var.endsWith("('")) {
            current_handle = handle_func_call_with_single_quote;
        } else if (source_var.endsWith('(')) {
            current_handle = handle_func_call;
        } else {

            current_handle = handle_instance
        }
        is_first = current_handle(source_var, new_ele, is_first);
    }
    // let final_str =  right_side_list.join(", \\\n")
    let out_list = [];

    // 感觉不需要这个了吧
    // if (!has_insert_comment) {
    //     out_list.push(`${indent_string}// generated_by_dict_unpack: ${source_var}`);
    // }

    let current_line = indent_string + left_side_list.join(", ") + ` ${operator} ` + right_side_list.join(", ")
    out_list.push(current_line)
    // for (let i = 0; i < left_side_list.length; i++) {
    //     let left_part = left_side_list[i];
    //     let right_part = right_side_list[i];
    //     out_list.push(`${indent_string}${left_part} = ${right_part}`);
    // }
    return out_list;
    // return final_str

}