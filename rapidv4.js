// Gloal variables
// Debug
var _log_output;

// System
var _is_init;

// Graphics
var CanvasHeight = 600;
var CanvasWidth = 800;

// rapidv4 APIs
// Debug
function DebugLog(message) {
    _log_output.html(message, true);
    _log_output.html("\n", true);
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
    init();
    createCanvas(CanvasWidth, CanvasHeight);

    _log_output = createElement("textarea", "rapidv4 - 0.1.0\n");
    _log_output.attribute("rows", "8");
    //_log_output.attribute("cols", "42");
    _log_output.attribute("readonly", "true");

    // Log initialization
    // Canvas size
    DebugLog("Canvas size (width, height) = (" + CanvasWidth, + ", " + CanvasHeight + ")");

    // Execute start function
    start();
}

function draw() {
    background(0);
    
    update();

    render();
}
