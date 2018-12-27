var myrect;
var myrenderer;

var myrect2;
var myimagerenderer;

var mytextrenderer;

var myimage;
var is_image_loaded = false;

var myrotation = 0;

function init() {
    SetCanvasSize(640, 480);
    frameRate(30);

    loadImage("assets/Buildings.JPG", ImageLoadedCallback, ImageLoadFailedCallback);
}

function ImageLoadedCallback(img) {
    DebugLog("Image load success");
    myimage = img;
    is_image_loaded = true;
}

function ImageLoadFailedCallback(ev) {
    DebugLog("Image load failed");
    DebugLog("Event= " + ev);
}

function start() {
    DebugLog("hogehoge");
    RequestPause();

    textSize(48);
}

function update() {
    DebugLog("GetFrameCount() = " + GetFrameCount());
    myrect = new Rect(32, 32, 64, 64, RM_TOPLEFT);
    myrect2 = new Rect(GetCanvasWidth() / 2, GetCanvasHeight() / 2, 0, 0);
    myrenderer = new RectRenderer(myrect, color(255, 255, 255), color(0, 0, 0));
    mytextrenderer = new TextRenderer(myrect2, "せやな〜", color(255, 0, 128), color(255, 0, 128));

    if(is_image_loaded) {
        myimagerenderer = new ImageRenderer(myrect2, myimage);
    }

    myrenderer.setRotation(myrotation);
    myimagerenderer.setShearX(PI * 0.25);
    mytextrenderer.setRotation(-myrotation);
}

function render() {
    DebugLog("DeltaTime: " + GetDeltaTime());
    myrotation += TWO_PI * 0.25 * GetDeltaTime();

    myrenderer.render();
    if(is_image_loaded) {
        myimagerenderer.render();
    }
    mytextrenderer.render();
}
