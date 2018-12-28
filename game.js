var myrect;
var myrenderer;

var myrect2;
var myimage;
var myimagerenderer;
var mycharacter;

var mytextrenderer;

var myrotation = 0;

function init() {
    SetCanvasSize(640, 480);
    frameRate(30);

    myimage = loadImage("assets/Buildings.JPG");

    AddKey(90, "Z");
    AddKey(88, "X");
}

function start() {
    DebugLog("hogehoge");
    RequestPause();

    textSize(48);

    // Create a character
    myrect2 = new Rect(GetCanvasWidth() / 2, GetCanvasHeight() / 2, 0, 0);
    myimagerenderer = new ImageRenderer(myimage);
    mycharacter = new Character(myrect2, myimagerenderer);
    mycharacter.applyRectToRenderer();
}

function update() {
    DebugLog("GetFrameCount() = " + GetFrameCount());
    myrect = new Rect(32, 32, 64, 64, RM_TOPLEFT);

    if(IsKeyPushed("X") || IsMouseButtonPushed("left")) {
        myrenderer = new RectRenderer(myrect, color(255, 0, 0), color(0, 0, 0));
    } else if(IsKeyReleased("X") || IsMouseButtonReleased("left")) {
        myrenderer = new RectRenderer(myrect, color(0, 255, 255), color(0, 0, 0));
    } else {
        myrenderer = new RectRenderer(myrect, color(255, 255, 255), color(0, 0, 0));
    }
    
    if(GetKey("Z")) {
        mytextrenderer = new TextRenderer("せやな〜", myrect2, color(255, 0, 128), color(255, 0, 128));
    } else {
        mytextrenderer = new TextRenderer("せやな〜", myrect2, null, color(255, 0, 128));
    }

    myrenderer.setRotation(myrotation);

    if(GetMouseButton("left")) {
        mycharacter.renderer.setShearX(PI * 0.25);
        //myimagerenderer.setShearX(PI * 0.25);
    } else if (GetMouseButton("right")) {
        mycharacter.renderer.setShearX(- PI * 0.25);
        //myimagerenderer.setShearX(- PI * 0.25);
    } else {
        mycharacter.renderer.setShearX(0);
    }

    mytextrenderer.setRotation(-myrotation);
}

function render() {
    DebugLog("DeltaTime: " + GetDeltaTime());
    myrotation += TWO_PI * 0.25 * GetDeltaTime();

    myrenderer.render();

    mycharacter.render();

    mytextrenderer.render();
}
