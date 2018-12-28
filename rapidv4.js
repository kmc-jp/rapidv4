// Gloal variables
// Debug
var _start_button;
var _log_output;

// System
var _is_init = false;
var _is_ok_to_start = true;
var _is_started = false;
var _is_running = true;
var _is_game_stop = false;
var _t_fstart = 0;
var _t_fend = 0;
var _frame_count = 0;
var _delta_time = 0;
var _is_first_frame = true;

// Graphics
var _canvas_height = 600;
var _canvas_width = 800;
var _c_background = 0;

// rapidv4 APIs
// Debug
/**
 * デバッグ出力に1行メッセージを出力します。
 * @param {string} message 出力するメッセージ
 */
function DebugLog(message) {
    _log_output.value = _log_output.value + message + "\n";
    _log_output.focus();
    _log_output.selectionEnd += message.length;
}

/**
 * デバッグ出力をすべて消します。
 */
function ClearLog() {
    _log_output.value = "";
    _log_output.selectionEnd = 0;
}

/**
 * ゲームの実行停止を予約します。
 * このAPIが呼ばれると、次のフレームの開始直前で実行が一時停止されます。
 */
function RequestPause() {
    if(_is_init) {
        _is_running = false;
        _start_button.innerHTML = "スタート";
        DebugLog("[INFO]: RequestPause(): 次のフレーム開始前で停止します。");
    } else {
        _is_ok_to_start = false;
        _start_button.innerHTML = "スタート";
        DebugLog("[INFO]: RequestPause(): start()の実行直前で停止します。");
    }
}

/**
 * ゲームの実行を再開します。
 */
function RequestResume() {
    if(_is_ok_to_start) {
        _is_running = true;
        _start_button.innerHTML = "ストップ";
    } else {
        _is_ok_to_start = true;
        if(_is_running) {
            _start_button.innerHTML = "ストップ";
        }
    }
    DebugLog("[INFO]: RequestResume(): 再開。");
}

/**
 * 現在のフレームを描画したあとに停止します。
 */
function StopGame() {
    _is_game_stop = true;
}

// Initialization
/**
 * キャンバスサイズを設定します。
 * @param {number} w キャンバスの幅（ピクセル）
 * @param {number} h キャンバスの高さ（ピクセル）
 */
function SetCanvasSize(w, h) {
    _canvas_width = w;
    _canvas_height = h;
    if(_is_init) {
        // If rapidv4 is already initialized, we must call resizeCanvas()
        resizeCanvas(_canvas_width, _canvas_height);
    }
}

// Graphics
/**
 * 現在の経過フレーム数を取得します。
 * @returns {number} 現在の経過フレーム数
 */
function GetFrameCount() {
    return _frame_count;
}

/**
 * 現在のキャンバス幅を取得します。
 * @returns {number} キャンバスの幅（ピクセル）
 */
function GetCanvasWidth() {
    return _canvas_width;
}

/**
 * 現在のキャンバスの高さを取得します。
 * @returns {number} キャンバスの高さ（ピクセル）
 */
function GetCanvasHeight() {
    return _canvas_height;
}

/**
 * 直前のフレーム描画開始から、現在のフレームの処理およびフレーム待ちまでの時間を取得します。
 * render()以外の場所では意味のある値が得られないので、render()で取得してください。
 * @returns {number} 直前のフレーム処理時間（秒）
 */
function GetDeltaTime() {
    return _delta_time;
}

/**
 * 背景色を設定します。
 * @param {number} c 色を表す数値（p5.jsのcolor()などで取得できる。）
 */
function SetBackgroundColor(c) {
    _c_background = c;
}

// End of APIs

// Callbacks
function _onStartButtonMouseUp(e) {
    // Listen to events if rapidv4 is already initialized
    if(!_is_init) {
        return;
    }

    if(typeof e === 'object' && e.button == 0) {
        if(_is_ok_to_start && _is_running) {
            RequestPause();
        } else {
            RequestResume();
        }
    }
}

// p5.js routines
function preload() {
    // Initialize rapidv4
    frameRate(30);

    // Set callbacks for panel buttons
    _start_button = document.getElementById('startButton');
    _start_button.innerHTML = "ストップ";
    _start_button.addEventListener('mouseup', _onStartButtonMouseUp);

    // Log initialization
    _log_output = document.getElementById('logOutput');
    ClearLog();
    DebugLog("rapidv4 - 0.1.0");

    // User initialization override
    DebugLog("[INFO]: init()を実行しています...");
    init();
    DebugLog("[OKAY]: init()を完了しました。");
    DebugLog("[OKAY]: preload()完了。");
}

function setup() {
    var _rapidv4_canvas = createCanvas(_canvas_width, _canvas_height);
    _rapidv4_canvas.parent('rapidv4Canvas');
    DebugLog("[OKAY]: キャンバスを作成しました。")
    DebugLog("Canvas size (width, height) = (" + _canvas_width + ", " + _canvas_height + ")");

    // End of initialization
    DebugLog("[OKAY]: 初期化が完了しました。");
    _is_init = true;

    DebugLog("[OKAY]: setup()完了。");
    DebugLog("[INFO]: メインループの実行を開始します。");
}

function draw() {
    // start()
    if(!_is_started) {
        if(!_is_ok_to_start) {
            return;
        }
        // Execute start function
        DebugLog("[INFO]: start()を実行しています...");
        start();
        _is_started = true;
        DebugLog("[OKAY]: start()を完了しました。");
    }

    // Get frame end time and calculate delta time
    _t_fend = millis();
    _delta_time = (_t_fend - _t_fstart) / 1000;

    // Get frame start time
    _t_fstart = millis();
    if(_is_running) {
        // Render
        // Clear canvas
        background(_c_background);
        // Draw whatever
        if(_is_first_frame) {
            // Skip rendereing for the first frame
            _is_first_frame = false;
        } else {
            render();
            // Increment frame counter
            _frame_count += 1;
        }

        // Check if StopGame() was called
        if(_is_game_stop) {
            _is_game_stop = false;
            _is_running = false;
            _start_button.innerHTML = "スタート";
            DebugLog("[INFO]: ゲーム終了。");
            return;
        }
    
        // Update
        // Sample input states
        _sample_key_input_state();
        _sample_mouse_input_state();
        // Update previous input state
        _rotate_key_input_state();
        _rotate_mouse_input_state();
        // Update states
        update();

        // Recheck input states
        _recheck_key_input_state();
        _recheck_mouse_input_state();

        // Delay
    }
}
