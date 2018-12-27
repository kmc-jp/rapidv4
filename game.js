var myrect;
var myrenderer;

var myrotation = 0;

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
    myrect = new Rect(32, 32, 64, 64, RM_TOPLEFT);
    myrenderer = new RectRenderer(myrect, color(255, 255, 255), color(0, 0, 0));

    myrenderer.setRotation(myrotation);
}

function render() {
    DebugLog("DeltaTime: " + GetDeltaTime());
    myrotation += TWO_PI * 0.25 * GetDeltaTime();

    myrenderer.render();
}
