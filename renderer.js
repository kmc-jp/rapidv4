class Renderer {
    /**
     * 何かを描画するクラス（基底クラスとして使ってね）。
     * @param {Rect} r 描画範囲指定用Rect
     */
    constructor(r) {
        this._rect = r;
        this._zoom_x = 1;
        this._zoom_y = 1;
        this._rotation = 0;
        this._shear_x = 0;
        this._shear_y = 0;
    }

    setZoomX(z) {
        this._zoom_x = z;
    }

    setZoomY(z) {
        this._zoom_y = z;
    }

    setZoom(z) {
        this.setZoomX(z);
        this.setZoomY(z);
    }

    setRotation(r) {
        this._rotation = r;
    }

    setShearX(r) {
        this._shear_x = r;
    }

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
        applyMatrix(this._zoom_x * cos(this._rotation), sin(this._rotation), -sin(this._rotation), this._zoom_y * cos(this._rotation), this._rect.getX(RM_CENTER), this._rect.getY(RM_CENTER));
        this._do_render();
        resetMatrix();
    }
}

class RectRenderer extends Renderer {
    /**
     * 長方形を描画するRenderer。
     * @param {Rect} r 座標、範囲指定用Rect
     * @param {number} c_fill 塗りつぶしの色
     * @param {number} c_stroke 枠線の色
     */
    constructor(r, c_fill, c_stroke) {
        super(r);
        this._fill_color = c_fill;
        this._stroke_color = c_stroke
    }

    _do_render() {
        fill(this._fill_color);
        stroke(this._stroke_color);
        rect(-this._rect.width/2, -this._rect.height/2, this._rect.width, this._rect.height);
    }
}
