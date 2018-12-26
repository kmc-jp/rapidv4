var pos_x = 32;

function init() {
    SetCanvasSize(640, 480);
    frameRate(30);
}

function start() {
    DebugLog("hogehoge");
    RequestPause();
}

function update() {
    DebugLog("GetFrameCount() = " + GetFrameCount());
}

function render() {
    DebugLog("DeltaTime: " + GetDeltaTime());
    pos_x += 32 * GetDeltaTime();

    fill(255);
    rect(pos_x, 32, 64, 64);
}
