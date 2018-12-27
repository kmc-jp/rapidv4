RM_CENTER = 0
RM_TOPLEFT = 1
RM_TOP = 2
RM_TOPRIGHT = 3
RM_LEFT = 4
RM_RIGHT = 5
RM_BOTTOMLEFT = 6
RM_BOTTOM = 7
RM_BOTTOMRIGHT = 8


class Rect {
    /**
     * 長方形を表すデータ構造。座標の指定や範囲の指定に用いる。
     * modeの指定は次の通り。デフォルトはRM_CENTER
     * - RM_CENTER: 長方形の中心
     * - RM_TOPLEFT: 左上
     * - RM_TOP: 上辺の中点
     * - RM_TOPRIGHT: 右上
     * - RM_LEFT: 左側面の辺の中点
     * - RM_RIGHT: 右側面の辺の中点
     * - RM_BOTTOMLEFT: 左下
     * - RM_BOTTOM: 下辺の中点
     * - RM_BOTTOMRIGHT: 右下
     * @param {number} x X座標
     * @param {number} y Y座標
     * @param {number} w 幅
     * @param {number} h 高さ
     * @param {number} mode 座標の基準はどこか？
     */
    constructor(x, y, w, h, mode=RM_CENTER) {
        switch(mode) {
            case RM_CENTER:
                this._x = x - w/2;
                this._y = y - h/2;
                break;
            case RM_TOPLEFT:
                this._x = x;
                this._y = y
                break;
            case RM_TOP:
                this._x = x - w/2;
                this._y = y;
                break;
            case RM_TOPRIGHT:
                this._x = x - w;
                this._y = y;
                break;
            case RM_LEFT:
                this._x = x;
                this._y = y - h/2;
                break;
            case RM_RIGHT:
                this._x = x - w;
                this._y = y - h/2;
                break;
            case RM_BOTTOMLEFT:
                this._x = x;
                this._y = y - h;
                break;
            case RM_BOTTOM:
                this._x = x - w/2;
                this._y = y - h;
                break;
            case RM_BOTTOMRIGHT:
                this._x = x - w;
                this._y = y - h;
                break;
            default:
                DebugLog("[WARN]: Rect(): 不明なRectMode " + mode + " です。");
                this._x = x - w/2;
                this._y = y - h/2;
                break;
        }
        this._w = w;
        this._h = h;
    }

    get width() {
        return this._w;
    }
    get height() {
        return this._h;
    }

    /**
     * 長方形の各部X座標を取得します。
     * modeの指定は次の通り。デフォルトはRM_CENTER
     * - RM_CENTER: 長方形の中心
     * - RM_TOPLEFT: 左上
     * - RM_TOP: 上辺の中点
     * - RM_TOPRIGHT: 右上
     * - RM_LEFT: 左側面の辺の中点
     * - RM_RIGHT: 右側面の辺の中点
     * - RM_BOTTOMLEFT: 左下
     * - RM_BOTTOM: 下辺の中点
     * - RM_BOTTOMRIGHT: 右下
     * @param {number} mode 座標の基準はどこか？
     */
    getX(mode=RM_CENTER) {
        switch(mode) {
            case RM_CENTER:
                return this._x + this._w/2
            case RM_TOPLEFT:
                return this._x;
            case RM_TOP:
                return this._x + this._w/2;
            case RM_TOPRIGHT:
                return this._x + this._w;
            case RM_LEFT:
                return this._x;
            case RM_RIGHT:
                return this._x + this._w;
            case RM_BOTTOMLEFT:
                return this._x;
            case RM_BOTTOM:
                return this._x + this._w/2;
            case RM_BOTTOMRIGHT:
                return this._x + this._w;
            default:
                DebugLog("[WARN]: Rect(): 不明なRectMode " + mode + " です。");
                return this._x + this._w/2
        }
    }

    /**
     * 長方形の各部Y座標を取得します。
     * modeの指定は次の通り。デフォルトはRM_CENTER
     * - RM_CENTER: 長方形の中心
     * - RM_TOPLEFT: 左上
     * - RM_TOP: 上辺の中点
     * - RM_TOPRIGHT: 右上
     * - RM_LEFT: 左側面の辺の中点
     * - RM_RIGHT: 右側面の辺の中点
     * - RM_BOTTOMLEFT: 左下
     * - RM_BOTTOM: 下辺の中点
     * - RM_BOTTOMRIGHT: 右下
     * @param {number} mode 座標の基準はどこか？
     */
    getY(mode=RM_CENTER) {
        switch(mode) {
            case RM_CENTER:
                return this._y + this._h/2;
            case RM_TOPLEFT:
                return this._y;
            case RM_TOP:
                return this._y;
            case RM_TOPRIGHT:
                return this._y;
            case RM_LEFT:
                return this._y + this._h/2;
            case RM_RIGHT:
                return this._y + this._h/2;
            case RM_BOTTOMLEFT:
                return this._y + this._h;
            case RM_BOTTOM:
                return this._y + this._h;
            case RM_BOTTOMRIGHT:
                return this._y + this._h;
            default:
                DebugLog("[WARN]: Rect(): 不明なRectMode " + mode + " です。");
                return this._y + this._h/2;
        }
    }
}
