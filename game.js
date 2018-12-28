// -1: 壁、0: 何もない、1: 赤、2: 青、3: 緑、4: 黄色
var blocks = new Array(8 * 12);    // フィールドサイズ 6x10

// 選択されているブロックのフラグ（探索済みフラグを兼ねる）
var s_blks = new Array(8 * 12);

// スポーンキー(Z)
// 強制スポーン？
var force_spawn;

// マウスの座標（クランプ済み）
var m_x;
var m_y;

// マウスが指しているブロックの座標
var b_x;
var b_y;

// マウスの左クリック状態を格納する変数（専用の関数から取得されたらfalseにリセットされる）
var m_click;

// BFS用FIFOバッファ
var bfs_buf = new Array(8 * 12);
var bfs_buf_ri = 0;
var bfs_buf_wi = 0;
var bfs_buf_cap = bfs_buf.length;
var bfs_buf_len = 0;
// 1ブロック以上同じ色だったか？
var is_mult_blks;

// FIFO バッファの実装
function FIFO_Push(v) {
    bfs_buf[bfs_buf_wi] = v;
    bfs_buf_wi += 1;
    bfs_buf_len += 1;
    if(bfs_buf_wi >= bfs_buf_cap) {
        bfs_buf_wi = 0;
    }
}
function FIFO_Pop() {
    var res = bfs_buf[bfs_buf_ri];
    bfs_buf_ri += 1;
    bfs_buf_len -= 1;
    if(bfs_buf_ri >= bfs_buf_cap) {
        bfs_buf_ri = 0;
    }

    return res;
}

// 新しいブロックをスポーンする間隔(Hz)
var fc_spawn = 0.2; 
// 難易度上昇時用カウンタオフセット
// 上昇したときに少なくとも1周期分待つようにする
var frame_ofs = 0;

// スコア
var score = 0;
// ゲームオーバーか？
var is_gameover;

// 音声
// BGM
var snd_bgm;
// ゲームオーバージングル
var snd_gover;
// 消去効果音
var snd_clear;

// スポーン効果音
var snd_spawn;

// 定数
// ブロックの幅と高さ
var b_width = 32;
var b_height = 32;
// 点滅周波数（Hz）
var fc_blink = 2;

function init() {
    SetCanvasSize(800, 500);
    SetBackgroundColor(color(255, 255, 255));
    frameRate(30);

    AddKey(90, "Z");

    soundFormats("mp3", "wav");
    snd_bgm = loadSound("assets/x006_lilies.mp3");
    snd_gover = loadSound("assets/soft-003.wav");
    snd_clear = loadSound("assets/clear.mp3");
    snd_spawn = loadSound("assets/spawn.mp3");
}

function start() {
    // 以下に追加の初期化処理を書きます
    // フィールドを初期化
    // 壁
    for(var x=0; x<8; x++) {
        for(var y=0; y<12; y++) {
            // ES6だと、配列の要素の初期値は未定義っぽい
            blocks[x + y * 8] = 0;
            if((x == 0 || x == 7) ||
            (y == 0 || y == 11)) {
                blocks[x + y * 8] = -1;
            }
        }
    }
    // フィールド
    // y <= 3までとりあえず生成
    for(var x=1; x<7; x++) {
        for(var y=1; y<4; y++) {
            blocks[x + y * 8] = floor(random(1, 5));
        }
    }

    snd_bgm.loop();
}

function update() {
    // 入力
    // 入力クランプ
    m_x = constrain(mouseX, 16, b_width * 8);
    m_y = constrain(mouseY, 32, b_height * 12);
    // マウス入力をブロック座標に
    b_x = round((m_x - 32.0) / b_width);
    b_y = 10 - round((m_y - (48.0 + b_height)) / b_height);
    // z入力（強制スポーン）
    // 新たに押されたとき
    if(IsKeyPushed("Z")) {
        force_spawn = true;
    }

    // ゲーム内処理
    // 消去できるブロックを探索
    for(var x=1; x<7; x++) {
        for(var y=1; y<11; y++) {
            s_blks[x + y * 8] = 0;
        }
    }
    // ブロックが色ブロック（ピース）だったらBFSで同じ色の隣接したブロックを探索する
    if(blocks[b_x + b_y * 8] >= 1) {
        // 色を保存
        var c_clr = blocks[b_x + b_y * 8];
        // もう見たので探索済みにする
        s_blks[b_x + b_y * 8] = 1;
        // 周りを調べるので予約する
        // 斜めを調べないように注意（仕様に反する）
        FIFO_Push(createVector(b_x-1, b_y));
            //new PVector(b_x-1, b_y));
        FIFO_Push(createVector(b_x, b_y-1));
        //bfs_buf.add(new PVector(b_x, b_y-1));
        FIFO_Push(createVector(b_x, b_y+1));
        //bfs_buf.add(new PVector(b_x, b_y+1));
        FIFO_Push(createVector(b_x+1, b_y));
        //bfs_buf.add(new PVector(b_x+1, b_y));
        // is_mult_blksをリセット
        is_mult_blks = false;
        // 幅優先探索
        do {
            // 先頭の座標について調べたいものがなくなるまで調べていく
            var current = FIFO_Pop();
            // 調べている場所が探索済みなら周りを調べない
            if(s_blks[current.x + current.y * 8] != 0) {
                continue;
            }
            // 調べている場所が壁か何もないなら周りを調べない
            if(blocks[current.x + current.y * 8] <= 0) {
                continue;
            }
            // 調べている場所の色が違うなら周りを調べない
            if(blocks[current.x + current.y * 8] != c_clr) {
                continue;
            }
            // 調べている場所の色が同じなら探索済みフラグを1にして周りを調べることにする
            if(blocks[current.x + current.y * 8] == c_clr) {
                // ここに来たら複数のブロックが同じ色だったということになる
                is_mult_blks = true;
                s_blks[current.x + current.y * 8] = 1;
                FIFO_Push(createVector(current.x-1, current.y));
                //bfs_buf.add(new PVector((int)current.x-1, (int)current.y));
                FIFO_Push(createVector(current.x, current.y-1));
                //bfs_buf.add(new PVector((int)current.x, (int)current.y-1));
                FIFO_Push(createVector(current.x, current.y+1));
                //bfs_buf.add(new PVector((int)current.x, (int)current.y+1));
                FIFO_Push(createVector(current.x+1, current.y));
                //bfs_buf.add(new PVector((int)current.x+1, (int)current.y));
            }
        } while(bfs_buf_len > 0);
    }
    // これが終了するとs_blks[][]には隣接して繋がった同じ色のブロックの座標のフラグが立っている

    // 消す＋スコア＋難易度上昇
    // クリックされたら消してスコアを入れる
    if(IsMouseButtonPushed("left") &&
    is_mult_blks &&
    s_blks[b_x + b_y * 8] == 1) {
        // この消去のスコア
        var p_score = 0;
        // 消したブロックの数
        var b_cleared = 0;
        for(var x=1; x<7; x++) {
            for(var y=1; y<11; y++) {
                if(s_blks[x + y * 8] == 1) {
                    blocks[x + y * 8] = 0;
                    b_cleared++;
                    p_score += 7*b_cleared;
                }
            }
        }
        score += p_score;
        // 難易度を上げる
        fc_spawn += 0.05;
        frame_ofs = frameCount;

        // 効果音再生
        //snd_clear.rewind();
        snd_clear.play();
    }

    // 落とす
    for(var x=1; x<7; x++) {
        // 上が空白であるブロックと浮いているブロックのy座標をそれぞれ調べる
        var y_top = 0;
        var y_floating = 11;
        // 上が空白のブロックを検出したか？
        var is_top_detected = false; 
        for(var y=1; y<11; y++) {
            if(!is_top_detected) {
                // 空白だったらその直下が一番上のブロック
                if(blocks[x + y * 8] == 0) {
                    y_top = y-1;
                    is_top_detected = true;
                }
            } else {
                // ブロックがあったらそれが浮いているブロックの一番下
                y_floating = y;
                // ループから抜けてずらす処理に入る
                break;
            }
        }
        // 愚直に値をコピーする（そんな時間かからんやろ）
        // ちなみにy_floatingが検出されなかったらこのループは実行されないようになっている
        for(var y=y_floating; y<11; y++) {
            blocks[x + (y-(y_floating-y_top-1)) * 8] = blocks[x + y * 8];
            blocks[x + y * 8] = 0;
        }
    }

    // 次ブロックスポーン
    if(force_spawn || 
    (frameCount-frame_ofs) % floor(30 / fc_spawn) == (floor(30 / fc_spawn)-1)) {
        // １列落とす
        // 上から最も上のブロックに到達するまで探索
        for(var x=1; x<7; x++) {
            for(var y=10; y>=0; y--) {
                // ブロックか壁が下にあったら新しいブロックをスポーンする
                if(blocks[x + y * 8] >= 1 || blocks[x + y * 8] == -1) {
                    blocks[x + (y+1) * 8] = floor(random(1,5));
                    break;
                }
            }
        }
        // 強制スポーンだったなら次は１周期全部待つ
        if(force_spawn) {
            frame_ofs = frameCount;
            // フラグリセット
            force_spawn = false;
        }
        // 効果音再生
        //snd_spawn.rewind();
        snd_spawn.play();
    }

    // ゲームオーバー処理
    // 座標y=11にブロックが配置されたら負け
    for(var x=1; x<7; x++) {
        if(blocks[x + 11 * 8] != -1) {
            // フラグを立てて、ゲームループを停止する
            is_gameover = true;
            RequestPause();
            // BGM停止、ジングル再生
            snd_bgm.pause();
            snd_gover.play();
            break;
        }
    }
}

function render() {
    // 描画
    // フィールド
    for(var x=0; x<8; x++) {
        for(var y=0; y<12; y++) {
            switch(blocks[x + y * 8]) {
                // 壁
                case -1:
                fill(128, 128, 128);
                stroke(0, 0, 0);
                break;
                // 赤
                case 1:
                fill(255, 0, 0);
                stroke(0, 0, 0);
                break;
                // 青
                case 2:
                fill(0, 0, 255);
                stroke(0, 0, 0);
                break;
                // 緑
                case 3:
                fill(0, 255, 0);
                stroke(0, 0, 0);
                break;
                // 黄
                case 4:
                fill(255, 255, 0);
                stroke(0, 0, 0);
                break;
            }
            if(frameCount % (30 / fc_blink) >= 15 / fc_blink) {
                if(s_blks[x + y * 8] == 1) {
                    stroke(255, 255, 255);
                }
            }
            if(blocks[x + y * 8] != 0) {
                rect(32 + b_width*x - b_width/2, 400 - b_height*(y+1) + b_height/2, b_width - 1, b_height - 1);
            }
        }
    }
    // スコア表示
    textSize(32);
    fill(0, 0, 0);
    stroke(0, 0, 0);
    text("SCORE: " + nf(score, 6), 500, 150); 
  
    // ゲームオーバー時メッセージ
    if(is_gameover) {
        textSize(72);
        fill(0, 0, 0);
        stroke(0, 0, 0);
        text("げーむおばー", 500, 300);
    }
}
