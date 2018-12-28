R_MANUAL = 0;
R_AUTOWIDTH = 1;
R_AUTOHEIGHT = 2;
R_AUTORECT = 3;

class Renderer {
    /**
     * 何かを描画するクラス（基底クラスとして使ってね）。rが指定されていないときは描画されません。
     * @param {Rect} r 描画範囲指定用Rect
     */
    constructor(r=null) {
        this._rect = r;
        this._x_offset = 0;
        this._y_offset = 0;
        this._zoom_x = 1;
        this._zoom_y = 1;
        this._rotation = 0;
        this._shear_x = 0;
        this._shear_y = 0;
    }

    /**
     * 描画に用いるRectを設定します。
     * @param {Rect} r 新しいRect
     */
    setRect(r) {
        this._rect = r;
    }

    /**
     * 描画位置の原点からのオフセットを設定します。
     * @param {number} x X座標のオフセット
     * @param {number} y Y座標のオフセット
     */
    setOffset(x, y) {
        this._x_offset = x;
        this._y_offset = y;
    }

    /**
     * X軸方向の拡大（縮小）率を設定します。
     * @param {number} z 拡大率
     */
    setZoomX(z) {
        this._zoom_x = z;
    }

    /**
     * Y軸方向の拡大（縮小）率を設定します。
     * @param {number} z 拡大率
     */
    setZoomY(z) {
        this._zoom_y = z;
    }

    /**
     * すべての軸方向の拡大（縮小）率を設定します。
     * @param {number} z 拡大率
     */
    setZoom(z) {
        this.setZoomX(z);
        this.setZoomY(z);
    }

    /**
     * Z軸に対する回転角度（時計回りが正）を設定します。
     * @param {number} r 回転角度（ラジアン）
     */
    setRotation(r) {
        this._rotation = r;
    }

    /**
     * X軸方向のせん断変換角度を設定します。
     * @param {number} r せん断角度（ラジアン）
     */
    setShearX(r) {
        this._shear_x = r;
    }

    /**
     * Y軸方向のせん断変換角度を設定します。
     * @param {number} r せん断角度（ラジアン）
     */
    setShearY(r) {
        this._shear_y = r;
    }

    _do_render() {
        // do nothing
    }

    /**
     * 指定された属性を用いて描画します。
     * game.jsのrender()の中で呼んでください。
     */
    render() {
        if(this._rect === null) {
            return;
        }

        applyMatrix(
            this._zoom_x * cos(this._rotation) -sin(this._rotation) * tan(-this._shear_y),
            sin(this._rotation) + this._zoom_y * cos(this._rotation) * tan(-this._shear_y),
            -sin(this._rotation) + this._zoom_x * cos(this._rotation) * tan(-this._shear_x),
            this._zoom_y * cos(this._rotation) + sin(this._rotation) * tan(-this._shear_x),
            this._rect.getX(RM_CENTER) + this._x_offset,
            this._rect.getY(RM_CENTER) + this._y_offset
        );
        this._do_render();
        resetMatrix();
    }
}

/**
 * 現在の文字サイズでの文字列の最大高さを取得します。
 * @returns {number} 文字列の最大高さ
 */
function GetTextHeight() {
    return textAscent() + textDescent();
}

class RectRenderer extends Renderer {
    /**
     * 長方形を描画するRenderer。rが指定されていないときは描画されません。
     * c_fill, c_strokeにnullを指定すると、それぞれ塗りつぶし、枠線描画を行いません。
     * @param {Rect} r 座標、範囲指定用Rect
     * @param {number} c_fill 塗りつぶしの色
     * @param {number} c_stroke 枠線の色
     */
    constructor(r=null, c_fill=null, c_stroke=null) {
        super(r);
        this._fill_color = c_fill;
        this._stroke_color = c_stroke
    }

    _do_render() {
        if(this._fill_color === null) {
            noFill();
        } else {
            fill(this._fill_color);
        }
        if(this._stroke_color === null) {
            noStroke();
        } else {
            stroke(this._stroke_color);
        }

        rect(-this._rect.width/2, -this._rect.height/2, this._rect.width, this._rect.height);
    }
}

class EllipseRenderer extends Renderer {
    /**
     * だ円を描画するRenderer。rが指定されていないときは描画されません。
     * c_fill, c_strokeにnullを指定すると、それぞれ塗りつぶし、枠線描画を行いません。
     * 円弧や扇形も描画できます（setArcStyle()参照）。
     * @param {Rect} r 座標、範囲指定用Rect
     * @param {number} c_fill 塗りつぶしの色
     * @param {number} c_stroke 枠線の色
     */
    constructor(r=null, c_fill=null, c_stroke=null) {
        super(r);
        this._fill_color = c_fill;
        this._stroke_color = c_stroke
        this._is_advanced_style = false;
        this._start_rad = 0;
        this._end_rad = 0;
        this._arc_mode = 0;
    }

    /**
     * 円弧や扇形を描画するためのスタイル属性を設定します。
     * modeに指定できるものは次の通り（p5.jsのものと同じ）
     * ちなみに、PIEはほかの属性とは独立なので、OPEN+PIE（扇形だけど切り口の辺は描画しない）みたいなことができます。
     * - OPEN: 弦を描画しない
     * - CHORD: 弦を描画する
     * - PIE: 扇形を描画する
     * @param {number} r_s 開始角度（ラジアン）
     * @param {number} r_e 終了角度（ラジアン）
     * @param {number} mode 描画モード（p5.jsのarc()の描画モード参照）
     */
    setArcStyle(r_s, r_e, mode) {
        this._start_rad = r_s;
        this._end_rad = r_e;
        this._arc_mode = mode;
        this._is_advanced_style = true;
    }

    _do_render() {
        if(this._fill_color === null) {
            noFill();
        } else {
            fill(this._fill_color);
        }
        if(this._stroke_color === null) {
            noStroke();
        } else {
            stroke(this._stroke_color);
        }

        if(this._is_advanced_style) {
            arc(0, 0, this._rect.width, this._rect.height, this._start_rad, this._end_rad, this._arc_mode);
        } else {
            ellipse(0, 0, this._rect.width, this._rect.height);
        }
    }
}

class TextRenderer extends Renderer {
    /**
     * 文字列を描画するRenderer。rが指定されていないときは描画されません。
     * c_fill, c_strokeにnullを指定すると、それぞれ塗りつぶし、枠線描画を行いません。
     * automodeでR_MANUAL以外が指定された場合は、以下の規則に従って描画幅と高さが文字サイズに合わせて自動的に計算されます。
     * その場合、rに指定されている幅と高さは無視されます。
     * automodeの初期値はR_AUTORECTです。
     * R_MANUAL: rに指定された幅と高さを使用します
     * R_AUDOWIDTH: 幅を自動的に決定します
     * R_AUTOHEIGHT: 高さを自動的に決定します
     * R_AUTORECT: 幅と高さを自動的に決定します
     * @param {Rect} r 座標、範囲指定用Rect
     * @param {string} t 描画する文字列
     * @param {number} c_fill 文字塗りつぶしの色
     * @param {number} c_stroke 文字（外枠）の色
     * @param {number} audomode 自動計算設定
     */
    constructor(t, r=null, c_fill=null, c_stroke=null, automode=R_AUTORECT) {
        if(r !== null) {
            var _rct_temp = new Rect(r._x_orig, r._y_orig);
            if(automode == R_AUTOHEIGHT || automode == R_AUTORECT) {
                _rct_temp.height = GetTextHeight();
            }
            if(automode == R_AUTOWIDTH || automode == R_AUTORECT) {
                _rct_temp.width = textWidth(t);
            }
            _rct_temp.recalculate();
            super(_rct_temp);
        } else {
            super(null);
        }

        this._fill_color = c_fill;
        this._stroke_color = c_stroke
        this._text = t;
        this._automode = automode;
    }

    /**
     * 描画に用いるRectを設定します。幅・高さの扱いはautomodeに依存します。
     * @param {Rect} r 新しいRect
     */
    setRect(r) {
        if(this._rect === null) {
            this._rect = new Rect(0, 0);
        }
        this._rect.setPositionAndMode(r._x_orig, r._y_orig, r._mode);
        if(this._automode == R_AUTOWIDTH || this._automode == R_MANUAL) {
            this._rect.height = r.height;
        }
        if(this._automode == R_AUTOHEIGHT || this._automode == R_MANUAL) {
            this._rect.width = r.width;
        }

        if(this._automode == R_AUTOHEIGHT || this._automode == R_AUTORECT) {
            this._rect.height = GetTextHeight();
        }
        if(this._automode == R_AUTOWIDTH || this._automode == R_AUTORECT) {
            this._rect.width = textWidth(this._text);
        }
        this._rect.recalculate();
    }

    _do_render() {
        if(this._fill_color === null) {
            noFill();
        } else {
            fill(this._fill_color);
        }
        if(this._stroke_color === null) {
            noStroke();
        } else {
            stroke(this._stroke_color);
        }

        text(this._text, -this._rect.width/2, -this._rect.height/2);
    }
}

class ImageRenderer extends Renderer {
    /**
     * 画像を描画するRenderer。rが指定されていないときは描画されません。
     * automodeでR_MANUAL以外が指定された場合は、以下の規則に従って描画幅と高さが画像に合わせて自動的に計算されます。
     * その場合、rに指定されている幅と高さは無視されます。
     * automodeの初期値はR_AUTORECTです。
     * R_MANUAL: rに指定された幅と高さを使用します
     * R_AUDOWIDTH: 幅を自動的に決定します
     * R_AUTOHEIGHT: 高さを自動的に決定します
     * R_AUTORECT: 幅と高さを自動的に決定します
     * @param {Rect} r 座標、範囲指定用Rect
     * @param {p5.Image} img 描画する画像
     * @param {number} automode 自動計算設定
     */
    constructor(img, r=null, automode=R_AUTORECT) {
        if(r !== null) {
            var _rct_temp = new Rect(r._x_orig, r._y_orig);
            if(automode == R_AUTOHEIGHT || automode == R_AUTORECT) {
                _rct_temp.height = img.height;
            }
            if(automode == R_AUTOWIDTH || automode == R_AUTORECT) {
                _rct_temp.width = img.width;
            }
            _rct_temp.recalculate();
            super(_rct_temp);
        } else {
            super(null);
        }

        this._image = img;
        this._automode = automode;
    }

    /**
     * 描画に用いるRectを設定します。幅・高さの扱いはautomodeに依存します。
     * @param {Rect} r 新しいRect
     */
    setRect(r) {
        if(this._rect === null) {
            this._rect = new Rect(0, 0);
        }
        this._rect.setPositionAndMode(r._x_orig, r._y_orig, r._mode);
        if(this._automode == R_AUTOWIDTH || this._automode == R_MANUAL) {
            this._rect.height = r.height;
        }
        if(this._automode == R_AUTOHEIGHT || this._automode == R_MANUAL) {
            this._rect.width = r.width;
        }

        if(this._automode == R_AUTOHEIGHT || this._automode == R_AUTORECT) {
            this._rect.height = this._image.height;
        }
        if(this._automode == R_AUTOWIDTH || this._automode == R_AUTORECT) {
            this._rect.width = this._image.width;
        }
        this._rect.recalculate();
    }

    _do_render() {
        image(this._image, -this._rect.width/2, -this._rect.height/2, this._rect.width, this._rect.height);
    }
}
