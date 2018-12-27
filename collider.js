_HIT_NONE = 0;
_HIT_RECT = 1;
_HIT_CIRCLE = 2;
_HIT_POINT = 3;

class Collider {
    /**
     * 当たり判定を提供するクラス。
     * このクラスを継承して、当たり判定を実装します。
     * @param {Rect} r 当たり判定領域を表すRect
     */
    constructor(r) {
        this._rect = r;
        this._c_type = _HIT_NONE;
    }

    /**
     * 当たり判定を行います。
     * @param {Collider} subj 当たり判定を行う対象の領域
     */
    isHit(subj) {
        return false;
    }
}

class RectCollider extends Collider {
    /**
     * 長方形による当たり判定領域を表すクラス。
     * @param {Rect} r 当たり判定領域を表すRect
     */
    constructor(r) {
        super(r);
        this._c_type = _HIT_RECT;
    }

    /**
     * 当たり判定を行います。
     * @param {Collider} subj 当たり判定を行う対象の領域
     */
    isHit(subj) {
        switch(subj._c_type) {
            case _HIT_RECT:
                if(abs(this._rect.getX(RM_CENTER) - subj._rect.getX(RM_CENTER)) <= this._rect.width/2 + subj._rect.width/2 &&
                abs(this._rect.getY(RM_CENTER) - subj._rect.getY(RM_CENTER)) <= this._rect.height/2 + subj._rect.height/2) {
                    return true;
                } else {
                    return false;
                }
            case _HIT_CIRCLE:
            break;
            case _HIT_POINT:
                if(abs(this._rect.getX(RM_CENTER) - subj._rect.getX(RM_CENTER)) <= this._rect.width/2 &&
                abs(this._rect.getY(RM_CENTER) - subj._rect.getY(RM_CENTER)) <= this._rect.height/2) {
                    return true;
                } else {
                    return false;
                }
            default:
            return false;
        }
    }
}

class CircleCollider extends Collider {
    /**
     * 円による当たり判定領域を表すクラス。
     * @param {Rect} r 当たり判定領域を表すRect（中心座標が円の中心、widthが直径として使われ、heightは無視されます）
     */
    constructor(r) {
        super(r);
        this._c_type = _HIT_CIRCLE;
    }

    /**
     * 当たり判定を行います。
     * @param {Collider} subj 当たり判定を行う対象の領域
     */
    isHit(subj) {
        switch(subj._c_type) {
            case _HIT_RECT:
            break;
            case _HIT_CIRCLE:
                if(dist(this._rect.getX(RM_CENTER), this._rect.getY(RM_CENTER),
                subj._rect.getX(RM_CENTER), subj._rect.getY(RM_CENTER)) <= this._rect.width/2 + subj._rect.width/2) {
                    return true;
                } else {
                    return false;
                }
            case _HIT_POINT:
                if(dist(this._rect.getX(RM_CENTER), this._rect.getY(RM_CENTER),
                subj._rect.getX(RM_CENTER), subj._rect.getY(RM_CENTER)) <= this._rect.width/2) {
                    return true;
                } else {
                    return false;
                }
            default:
            return false;
        }
    }
}

class PointCollider extends Collider {
    /**
     * 点による当たり判定領域を表すクラス。
     * @param {Rect} r 当たり判定領域を表すRect（Rectの中心座標が使われます）
     */
    constructor(r) {
        super(r);
        this._c_type = _HIT_POINT;
    }

    /**
     * 当たり判定を行います。
     * @param {Collider} subj 当たり判定を行う対象の領域
     */
    isHit(subj) {
        switch(subj._c_type) {
            case _HIT_RECT:
                if(abs(this._rect.getX(RM_CENTER) - subj._rect.getX(RM_CENTER)) <= subj._rect.width/2 &&
                abs(this._rect.getY(RM_CENTER) - subj._rect.getY(RM_CENTER)) <= subj._rect.height/2) {
                    return true;
                } else {
                    return false;
                }
            case _HIT_CIRCLE:
                if(dist(this._rect.getX(RM_CENTER), this._rect.getY(RM_CENTER),
                subj._rect.getX(RM_CENTER), subj._rect.getY(RM_CENTER)) <= subj._rect.width/2) {
                    return true;
                } else {
                    return false;
                }
            case _HIT_POINT:
                if(this._rect.getX(RM_CENTER) == subj._rect.getX(RM_CENTER) &&
                this._rect.getY(RM_CENTER) == subj._rect.getY(RM_CENTER)) {
                    return true;
                } else {
                    return false;
                }
            default:
            return false;
        }
    }
}
