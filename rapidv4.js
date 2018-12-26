// Gloal variables
// Debug
var _start_button;
var _log_output;

// System
var _is_init = false;
var _is_running = false;
var _t_fstart = 0;
var _t_fend = 0;
var _frame_count = 0;
var DeltaTime = 0;

// Graphics
var CanvasHeight = 600;
var CanvasWidth = 800;

// rapidv4 APIs
// Debug
function DebugLog(message) {
    _log_output.value = _log_output.value + message + "\n";
    _log_output.focus();
    _log_output.selectionEnd += message.length;
}

function ClearLog() {
    _log_output.value = "";
    _log_output.selectionEnd = 0;
}

function RequestPause() {
    _is_running = false;
    _start_button.innerHTML = "スタート";
    DebugLog("[INFO]: RequestPause(): 次のフレーム開始前で停止します。");
}

function RequestResume() {
    _is_running = true;
    _start_button.innerHTML = "ストップ";
    DebugLog("[INFO]: RequestResume(): 再開。");
}

// Initialization
function SetCanvasSize(w, h) {
    if(_is_init) {
        DebugLog("[WARN]: SetCanvasSize()はrapidv4の初期化前に呼ぶ必要があります。");
        DebugLog("キャンバスサイズを変更したい場合はresizeCanvas()を呼び出してください。");
        return;
    }
    CanvasWidth = w;
    CanvasHeight = h;
}

// Graphics
function GetFrameCount() {
    return _frame_count;
}

// End of APIs

// Callbacks
function _onStartButtonMouseUp(e) {
    // Listen to events if rapidv4 is already initialized
    if(!_is_init) {
        return;
    }

    if(typeof e === 'object' && e.button == 0) {
        if(_is_running) {
            RequestPause();
        } else {
            RequestResume();
        }
    }
}

// p5.js routines
function setup() {
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
    init();
    var _rapidv4_canvas = createCanvas(CanvasWidth, CanvasHeight);
    _rapidv4_canvas.parent('rapidv4Canvas');
    DebugLog("[OKAY]: キャンバスを作成しました。")
    DebugLog("Canvas size (width, height) = (" + CanvasWidth + ", " + CanvasHeight + ")");

    // End of initialization
    DebugLog("[OKAY]: 初期化が完了しました。");
    _is_init = true;
    _is_running = true;

    // Execute start function
    start();
}

function draw() {
    // Get frame end time and calculate delta time
    _t_fend = millis();
    DeltaTime = (_t_fend - _t_fstart) / 1000;
    // Get frame start time
    _t_fstart = millis();

    if(_is_running) {
        // Clear canvas
        background(0);
    
        // Update states
        update();

        // Draw whatever
        render();

        // Increment frame counter
        _frame_count += 1;
    }
}
