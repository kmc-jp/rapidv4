// このあたりにグローバル変数を宣言します。
// ここで宣言された変数は以下のすべての関数からアクセスできます。
// なお、アンダースコア"_"から始まる変数はrapidv4で予約されているので、グローバル変数名に使わないようにしてください。
// さらに、p5.jsですでに使われている名前もあるので注意（p5.jsのReferenceになさそうな名前ならOK）。

var moji_character;
var moji_rotation = 0;

// グローバル変数宣言ここまで

//////////////////////////////////////////

// このあたりに（必要ならば）classおよびコンストラクタの定義を書きます。

// Tips: クラスのメンバあるいはローカル変数はアンダースコアで始まってもたいてい問題ない
class MyMoji extends Character {
    constructor(r, mojiretsu) {
	super(r,
	      new TextRenderer(
		  mojiretsu,
		  new Rect(0, 0),
		  color(255, 255, 255),
		  color(255, 255, 255)
	      )
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

    moji_character = new MyMoji(new Rect(GetCanvasWidth()/2, GetCanvasHeight()/2), "光速詠唱");
}

/**
* ここにゲームの主な処理を書きます。
* この関数内の処理は毎フレーム、render()の前に実行されます。
* rapidv4のゲームループの詳しい仕様についてはドキュメントを参照してください。
* あ、ここで描画処理をすることはおすすめしません。
*/
function update() {
    moji_rotation += TWO_PI * 0.25 * GetDeltaTime();
    moji_character.renderer.setRotation(moji_rotation);
}

/**
* ここにゲームの描画処理を書きます。
* この関数内の処理は毎フレーム、update()の後に実行されます。
* この関数内では、SetDeltaTime()がちゃんとした値を返してくれます。逆に、入力系の関数は正しい結果を返してくれません。
*/
function render() {
    moji_character.render();
}
