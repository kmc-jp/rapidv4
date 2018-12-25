// Gloal variables
// Debug
var _log_output;

// System
var _is_init;
var _t_fstart = 0;
var _t_fend = 0;

// Graphics
var CanvasHeight = 600;
var CanvasWidth = 800;
var DeltaTime = 0;

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

// p5.js routines
function setup() {
    // Initialize rapidv4
    frameRate(30);

    // Log initialization
    _log_output = document.getElementById('logOutput');
    ClearLog();
    DebugLog("rapidv4 - 0.1.0");

    // User initialization override
    init();
    var _rapidv4_canvas = createCanvas(CanvasWidth, CanvasHeight);
    _rapidv4_canvas.parent('rapidv4Canvas');
    DebugLog("[OKAY]: キャンバスを作成しました。")
    DebugLog("Canvas size (width, height) = (" + CanvasWidth, + ", " + CanvasHeight + ")");

    // Execute start function
    start();
}

function draw() {
    // Get frame end time and calculate delta time
    _t_fend = millis();
    DeltaTime = (_t_fend - _t_fstart) / 1000;
    // Get frame start time
    _t_fstart = millis();

    // Clear canvas
    background(0);
    
    // Update states
    update();

    // Draw whatever
    render();
}
