var _key_states = {};
var _key_states_p = {};
var _game_keys = {};
var _keycodes_to_watch = [];
var _key_state_lock = false;

/**
 * 入力に用いるキーを登録します。
 * @param {number} keycode 登録するキーのキーコード
 * @param {string} keyname 登録するキーを識別する名前
 */
function AddKey(keycode, keyname) {
    _key_states[keyname] = false;
    _key_states_p[keyname] = false;
    _game_keys[keycode.toString()] = keyname;
    _keycodes_to_watch.push(keycode);
}

/**
 * キーの現在の状態を取得します。
 * update()以外では正しい値が取得できません。
 * @param {string} keyname 登録したキーの名前
 */
function GetKey(keyname) {
    return _key_states[keyname];
}

/**
 * キーが押された状態に変わったかどうかを取得します。
 * update()以外では正しい値が取得できません。
 * @param {string} keyname 登録したキーの名前
 */
function IsKeyPushed(keyname) {
    if(_key_states[keyname] == true && _key_states_p[keyname] == false) {
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
    if(_key_states[keyname] == false && _key_states_p[keyname] == true) {
        return true;
    } else {
        return false;
    }
}

// Internal functions
function _lock_key_input_state() {
    _key_state_lock = true;
}

function _unlock_key_input_state() {
    _key_state_lock = false;
}

function _rotate_key_input_state() {
    var _keynames = Object.keys(_key_states);
    var _keynames_len = _keynames.length;
    for(var i=0; i<_keynames_len; i++) {
        _key_states_p[_keynames[i]] = _key_states[_keynames[i]];
    }
}

// Input callacks
function keyPressed() {
    if(_key_state_lock) {
        return;
    }

    var _keycodes_len = _keycodes_to_watch.length;
    for(var i=0; i<_keycodes_len; i++) {
        if(keyCode == _keycodes_to_watch[i]) {
            var _keyname = _game_keys[_keycodes_to_watch[i].toString()];
            _key_states[_keyname] = true;
        }
    }
}

function keyReleased() {
    if(_key_state_lock) {
        return;
    }

    var _keycodes_len = _keycodes_to_watch.length;
    for(var i=0; i<_keycodes_len; i++) {
        if(keyCode == _keycodes_to_watch[i]) {
            var _keyname = _game_keys[_keycodes_to_watch[i].toString()];
            _key_states[_keyname] = false;
        }
    }
}
