_I_LOW = 0;
_I_PUSHED = 1;
_I_HIGH = 2;
_I_RELEASED = 3;

var _key_states = {};
var _key_states_p = {};
var _key_states_s = {};
var _game_keys = {};
var _keyname_to_keycode = {};
var _keycodes_to_watch = [];

var _mouse_states = { left: false, middle: false, right: false };
var _mouse_states_p = { left: false, middle: false, right: false };
var _mouse_states_s = { left: _I_LOW, middle: _I_LOW, right: _I_LOW };
var _mouse_current_state = { left: false, middle: false, right: false };;

/**
 * 入力に用いるキーを登録します。
 * @param {number} keycode 登録するキーのキーコード
 * @param {string} keyname 登録するキーを識別する名前
 */
function AddKey(keycode, keyname) {
    _key_states[keyname] = false;
    _key_states_p[keyname] = false;
    _key_states_s[keyname] = _I_LOW;
    _game_keys[keycode.toString()] = keyname;
    _keyname_to_keycode[keyname] = keycode;
    _keycodes_to_watch.push(keycode);
}

/**
 * キーの現在の状態を取得します。
 * update()以外では正しい値が取得できません。
 * @param {string} keyname 登録したキーの名前
 */
function GetKey(keyname) {
    if(_key_states_s[keyname] == _I_PUSHED || _key_states_s[keyname] == _I_HIGH) {
        return true;
    } else {
        return false;
    }
}

/**
 * キーが押された状態に変わったかどうかを取得します。
 * update()以外では正しい値が取得できません。
 * @param {string} keyname 登録したキーの名前
 */
function IsKeyPushed(keyname) {
    if(_key_states_s[keyname] == _I_PUSHED) {
        return true;
    } else {
        return false;
    }
}

/**
 * キーが離された状態に変わったかどうかを取得します。
 * update()以外では正しい値が取得できません。
 * @param {string} keyname 登録したキーの名前
 */
function IsKeyReleased(keyname) {
    if(_key_states_s[keyname] == _I_RELEASED) {
        return true;
    } else {
        return false;
    }
}

/**
 * 現在のマウスボタンの状態を取得します。
 * マウスボタンの名前とボタンの対応は次のとおりです。
 * - "left": 左ボタン
 * - "middle": 中央ボタン（ホイール）
 * - "right": 右ボタン
 * @param {string} bname マウスボタンの名前
 */
function GetMouseButton(bname) {
    if(_mouse_states_s[bname] == _I_PUSHED || _mouse_states_s[bname] == _I_HIGH) {
        return true;
    } else {
        return false;
    }
}

/**
 * マウスボタンが押された状態に変わったかどうかを取得します。
 * マウスボタンの名前とボタンの対応は次のとおりです。
 * - "left": 左ボタン
 * - "middle": 中央ボタン（ホイール）
 * - "right": 右ボタン
 * @param {string} bname マウスボタンの名前
 */
function IsMouseButtonPushed(bname) {
    if(_mouse_states_s[bname] == _I_PUSHED) {
        return true;
    } else {
        return false;
    }
}

/**
 * マウスボタンが離された状態に変わったかどうかを取得します。
 * マウスボタンの名前とボタンの対応は次のとおりです。
 * - "left": 左ボタン
 * - "middle": 中央ボタン（ホイール）
 * - "right": 右ボタン
 * @param {string} bname マウスボタンの名前
 */
function IsMouseButtonReleased(bname) {
    if(_mouse_states_s[bname] == _I_RELEASED) {
        return true;
    } else {
        return false;
    }
}

// Internal functions
function _sample_key_input_state() {
    var _keynames = Object.keys(_key_states);
    var _keynames_len = _keynames.length;
    for(var i=0; i<_keynames_len; i++) {
        if(_key_states[_keynames[i]] == true) {
            if(_key_states_p[_keynames[i]] == true) {
                _key_states_s[_keynames[i]] = _I_HIGH;
            } else {
                _key_states_s[_keynames[i]] = _I_PUSHED;
            }
        } else {
            if(_key_states_p[_keynames[i]] == true) {
                _key_states_s[_keynames[i]] = _I_RELEASED;
            } else {
                _key_states_s[_keynames[i]] = _I_LOW;
            }
        }
    }
}

function _rotate_key_input_state() {
    var _keynames = Object.keys(_key_states);
    var _keynames_len = _keynames.length;
    for(var i=0; i<_keynames_len; i++) {
        _key_states_p[_keynames[i]] = _key_states[_keynames[i]];
    }
}

function _recheck_key_input_state() {
    var _keynames = Object.keys(_key_states);
    var _keynames_len = _keynames.length;
    for(var i=0; i<_keynames_len; i++) {
        var _current_key_state = keyIsDown(_keyname_to_keycode[_keynames[i]]);
        if(_current_key_state === undefined) {
            continue;
        }
        if(_key_states[_keynames[i]] != _current_key_state) {
            _key_states[_keynames[i]] = !_key_states[_keynames[i]];
        }
    }
}

function _sample_mouse_input_state() {
    var _buttonnames = Object.keys(_mouse_states);
    var _buttonnames_len = _buttonnames.length;
    for(var i=0; i<_buttonnames_len; i++) {
        if(_mouse_states[_buttonnames[i]] == true) {
            if(_mouse_states_p[_buttonnames[i]] == true) {
                _mouse_states_s[_buttonnames[i]] = _I_HIGH;
            } else {
                _mouse_states_s[_buttonnames[i]] = _I_PUSHED;
            }
        } else {
            if(_mouse_states_p[_buttonnames[i]] == true) {
                _mouse_states_s[_buttonnames[i]] = _I_RELEASED;
            } else {
                _mouse_states_s[_buttonnames[i]] = _I_LOW;
            }
        }
    }
}

function _rotate_mouse_input_state() {
    var _buttonnames = Object.keys(_mouse_states);
    var _buttonnames_len = _buttonnames.length;
    for(var i=0; i<_buttonnames_len; i++) {
        _mouse_states_p[_buttonnames[i]] = _mouse_states[_buttonnames[i]];
    }
}

function _recheck_mouse_input_state() {
    var _buttonnames = Object.keys(_mouse_states);
    var _buttonnames_len = _buttonnames.length;
    for(var i=0; i<_buttonnames_len; i++) {
        if(_mouse_states[_buttonnames[i]] != _mouse_current_state[_buttonnames[i]]) {
            _mouse_states[_buttonnames[i]] = !_mouse_states[_buttonnames[i]];
        }
    }
}

// Input callacks
function keyPressed() {
    var _keycodes_len = _keycodes_to_watch.length;
    for(var i=0; i<_keycodes_len; i++) {
        if(keyCode == _keycodes_to_watch[i]) {
            var _keyname = _game_keys[_keycodes_to_watch[i].toString()];
            // Only change the keystate if it is different from the previous state
            if(_key_states_p[_keyname] == false) {
                _key_states[_keyname] = true;
            }
        }
    }
}

function keyReleased() {
    var _keycodes_len = _keycodes_to_watch.length;
    for(var i=0; i<_keycodes_len; i++) {
        if(keyCode == _keycodes_to_watch[i]) {
            var _keyname = _game_keys[_keycodes_to_watch[i].toString()];
            // Only change the keystate if it is different from the previous state
            if(_key_states_p[_keyname] == true) {
                _key_states[_keyname] = false;
            }
        }
    }
}

function mousePressed() {
    if(mouseX < 0 || mouseX >= GetCanvasWidth()) {
        return;
    }
    if(mouseY < 0 || mouseY >= GetCanvasHeight()) {
        return;
    }

    switch(mouseButton) {
        case LEFT:
            _mouse_current_state["left"] = true;
            // Only change the mousestate if it is different from the previous state
            if(_mouse_states_p["left"] == false) {
                _mouse_states["left"] = true;
            }
        break;
        case RIGHT:
            _mouse_current_state["right"] = true;
            // Only change the mousestate if it is different from the previous state
            if(_mouse_states_p["right"] == false) {
                _mouse_states["right"] = true;
            }
        break;
        case CENTER:
            _mouse_current_state["middle"] = true;
            // Only change the mousestate if it is different from the previous state
            if(_mouse_states_p["middle"] == false) {
                _mouse_states["middle"] = true;
            }
        break;
        default:
            DebugLog("[BUG ]: Unknown mouse button: " + mouseButton);
            break;
    }
}

function mouseReleased() {
    if(mouseX < 0 || mouseX >= GetCanvasWidth()) {
        return;
    }
    if(mouseY < 0 || mouseY >= GetCanvasHeight()) {
        return;
    }

    switch(mouseButton) {
        case LEFT:
            _mouse_current_state["left"] = false;
            // Only change the mousestate if it is different from the previous state
            if(_mouse_states_p["left"] == true) {
                _mouse_states["left"] = false;
            }
        break;
        case RIGHT:
            _mouse_current_state["right"] = false;
            // Only change the mousestate if it is different from the previous state
            if(_mouse_states_p["right"] == true) {
                _mouse_states["right"] = false;
            }
        break;
        case CENTER:
            _mouse_current_state["middle"] = false;
            // Only change the mousestate if it is different from the previous state
            if(_mouse_states_p["middle"] == true) {
                _mouse_states["middle"] = false;
            }
        break;
        default:
            DebugLog("[BUG ]: Unknown mouse button: " + mouseButton);
            break;
    }
}
