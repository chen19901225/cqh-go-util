import * as vscode from "vscode";

let _positions: vscode.Position[] = []
let _position_max_count = 50

export function service_position_history_add_position(pos: vscode.Position) {
    _positions.push(pos);
    if (_positions.length > _position_max_count) {
        _positions = _positions.slice(_positions.length - _position_max_count)
    }
}

export function service_position_history_get_last_position(): vscode.Position {
    return _positions[_positions.length - 1]
}