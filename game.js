function init() {
    SetCanvasSize(640, 480);
    frameRate(30);
}

function start() {
    DebugLog("hogehoge");
    RequestPause();
}

function update() {
    DebugLog("DeltaTime: " + DeltaTime);
    DebugLog("GetFrameCount() = " + GetFrameCount());
}

function render() {
    fill(255);
    rect(32, 32, 64, 64);
}
