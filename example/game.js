// このあたりにグローバル変数を宣言します。
// ここで宣言された変数は以下のすべての関数からアクセスできます。
// なお、アンダースコア"_"から始まる変数はrapidv4で予約されているので、グローバル変数名に使わないようにしてください。
// さらに、p5.jsですでに使われている名前もあるので注意（p5.jsのReferenceになさそうな名前ならOK）。

// 画像データ
var rocket_img;
var meteor_img;

// Character
var rocket;
var meteor;

// グローバル変数宣言ここまで

//////////////////////////////////////////

// このあたりに（必要ならば）classおよびコンストラクタの定義を書きます。

// Tips: クラスのメンバあるいはローカル変数はアンダースコアで始まってもたいてい問題ない
class Rocket extends Character {
    constructor(x, y) {
        super(x, y,
            new ImageRenderer(rocket_img, new Rect(0, 0)),
            new RectCollider(new Rect(0, 0, 16, 16))
            );
        
        // Rocketの速度
        this._vel_x = 0;
        this._vel_y = 0;
    }

    update() {
        // キー入力から速度を決定する
        if(GetKey("Left")) {
            this._vel_x = -48;
        } else if(GetKey("Right")) {
            this._vel_x = 48;
        } else {
            this._vel_x = 0;
        }
        // Y軸は画面下方向が正なので注意
        if(GetKey("Up")) {
            this._vel_y = -48;
        } else if(GetKey("Down")) {
            this._vel_y = 48;
        } else {
            this._vel_y = 0;
        }
    }
}

class Meteor extends Character {
    constructor(x, y) {
        super(x, y,
            new ImageRenderer(meteor_img, new Rect(0, 0)),
            new CircleCollider(new Rect(0, 0, meteor_img.width))
            );
    }
}

// クラス・コンストラクタの定義ここまで

//////////////////////////////////////////

// ここから処理を書きます
/**
* ここにエンジンの設定とファイル読み込み処理を書きます。
* この関数内の処理は必ずstart()の前に行われ、1度だけ実行されます。
* まだ描画はできないのであしからず。
*/
function init() {
    // 画面サイズを指定
    SetCanvasSize(640, 480);
    // フレームレートを指定
    //frameRate(30);
    // 背景色を指定
    //SetBackgroundColor(color(0, 0, 0));

    // ここでloadImage/SoundやAddKeyなどを行う
    rocket_img = loadImage("assets/rocket.png");
    meteor_img = loadImage("assets/meteor.png");

    // init()でこれを呼ぶと、「スタート」を押すまでstart()やupdate()が呼ばれない
    RequestPause();
}

/**
* ここにゲームの初期化処理を書きます。
* この関数内の処理は必ずupdateの前に行われ、1度だけ実行されます。
*/
function start() {
    // DebugLog()でデバッグ出力に文字列を出せる
    DebugLog("Hello, world!");

    // 文字サイズを指定
    textSize(48);

    rocket = new Rocket(100, 100);
    meteor = new Meteor(200, 200);

    AddKey(38, "Up");
    AddKey(40, "Down");
    AddKey(37, "Left");
    AddKey(39, "Right");
}

/**
* ここにゲームの主な処理を書きます。
* この関数内の処理は毎フレーム、render()の前に実行されます。
* rapidv4のゲームループの詳しい仕様についてはドキュメントを参照してください。
* あ、ここで描画処理をすることはおすすめしません。
*/
function update() {
    rocket.update();

    if(rocket.isHitBy(meteor)) {
        StopGame();
    }
}

/**
* ここにゲームの描画処理を書きます。
* この関数内の処理は毎フレーム、update()の後に実行されます。
* この関数内では、SetDeltaTime()がちゃんとした値を返してくれます。逆に、入力系の関数は正しい結果を返してくれません。
*/
function render() {
    // Rocketの位置を更新する
    rocket.setPosition(rocket._pos_x + rocket._vel_x * GetDeltaTime(), 
    rocket._pos_y + rocket._vel_y * GetDeltaTime());
    rocket.render();

    meteor.render();
}
