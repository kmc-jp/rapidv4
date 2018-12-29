_HIT_NONE = 0;
_HIT_RECT = 1;
_HIT_CIRCLE = 2;
_HIT_POINT = 3;

/**
 * 当たり判定を提供するクラス。
 * このクラスを継承して、当たり判定を実装します。
 */
class Collider {
    /**
     * @param {Rect} r 当たり判定領域を表すRect
     */
    constructor(r) {
        this._rect = r;
        this._x_offset = 0;
        this._y_offset = 0;
        this._c_type = _HIT_NONE;
    }
    
    /**
     * 当たり判定位置の原点からのオフセットを設定します。
     * @param {number} x X座標のオフセット
     * @param {number} y Y座標のオフセット
     */
    setOffset(x, y) {
        this._x_offset = x;
        this._y_offset = y;
        this._rect.setPositionAndMode(this._x_offset, this._y_offset);
        this._rect.recalculate();
    }

    /**
     * 当たり判定を行います。
     * @param {Collider} subj 当たり判定を行う対象の領域
     * @returns {boolean} 当たっているか？
     */
    isHit(subj) {
        return false;
    }
}

/**
 * 長方形による当たり判定領域を表すクラス。
 */
class RectCollider extends Collider {
    /**
     * @param {Rect} r 当たり判定領域を表すRect
     */
    constructor(r) {
        super(r);
        this._c_type = _HIT_RECT;
    }

    /**
     * 当たり判定を行います。
     * @param {Collider} subj 当たり判定を行う対象の領域
     * @returns {boolean} 当たっているか？
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
                if(this._rect.getX(RM_LEFT) <= subj._rect.getX(RM_CENTER) && subj._rect.getX(RM_CENTER) <= this._rect.getX(RM_RIGHT)) {
                    if(abs(this._rect.getY(RM_CENTER) - subj._rect.getY(RM_CENTER)) <= this._rect.height/2 + subj._rect.width/2) {
                        return true;
                    } else {
                        return false;
                    }
                } else if(this._rect.getY(RM_TOP) <= subj._rect.getY(RM_CENTER) && subj._rect.getY(RM_CENTER) <= this._rect.getY(RM_BOTTOM)) {
                    if(abs(this._rect.getX(RM_CENTER) - subj._rect.getX(RM_CENTER)) <= this._rect.width/2 + subj._rect.width/2) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    if(dist(this._rect.getX(RM_TOPLEFT), this._rect.getY(RM_TOPLEFT), subj._rect.getX(RM_CENTER), subj._rectgetY(RM_CENTER)) <= subj._rect.width/2) {
                        return true;
                    }
                    if(dist(this._rect.getX(RM_TOPRIGHT), this._rect.getY(RM_TOPRIGHT), subj._rect.getX(RM_CENTER), subj._rectgetY(RM_CENTER)) <= subj._rect.width/2) {
                        return true;
                    }
                    if(dist(this._rect.getX(RM_BOTTOMLEFT), this._rect.getY(RM_BOTTOMLEFT), subj._rect.getX(RM_CENTER), subj._rectgetY(RM_CENTER)) <= subj._rect.width/2) {
                        return true;
                    }
                    if(dist(this._rect.getX(RM_BOTTOMRIGHT), this._rect.getY(RM_BOTTOMRIGHT), subj._rect.getX(RM_CENTER), subj._rectgetY(RM_CENTER)) <= subj._rect.width/2) {
                        return true;
                    }
                    return false;
                }
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

/**
 * 円による当たり判定領域を表すクラス。
 */
class CircleCollider extends Collider {
    /**
     * @param {Rect} r 当たり判定領域を表すRect（中心座標が円の中心、widthが直径として使われ、heightは無視されます）
     */
    constructor(r) {
        super(r);
        this._c_type = _HIT_CIRCLE;
    }

    /**
     * 当たり判定を行います。
     * @param {Collider} subj 当たり判定を行う対象の領域
     * @returns {boolean} 当たっているか？
     */
    isHit(subj) {
        switch(subj._c_type) {
            case _HIT_RECT:
                if(subj._rect.getX(RM_LEFT) <= this._rect.getX(RM_CENTER) && this._rect.getX(RM_CENTER) <= subj._rect.getX(RM_RIGHT)) {
                    if(abs(this._rect.getY(RM_CENTER) - subj._rect.getY(RM_CENTER)) <= subj._rect.height/2 + this._rect.width/2) {
                        return true;
                    } else {
                        return false;
                    }
                } else if(subj._rect.getY(RM_TOP) <= this._rect.getY(RM_CENTER) && this._rect.getY(RM_CENTER) <= subj._rect.getY(RM_BOTTOM)) {
                    if(abs(this._rect.getX(RM_CENTER) - subj._rect.getX(RM_CENTER)) <= subj._rect.width/2 + this._rect.width/2) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    if(dist(subj._rect.getX(RM_TOPLEFT), subj._rect.getY(RM_TOPLEFT), this._rect.getX(RM_CENTER), this._rectgetY(RM_CENTER)) <= this._rect.width/2) {
                        return true;
                    }
                    if(dist(subj._rect.getX(RM_TOPRIGHT), subj._rect.getY(RM_TOPRIGHT), this._rect.getX(RM_CENTER), this._rectgetY(RM_CENTER)) <= this._rect.width/2) {
                        return true;
                    }
                    if(dist(subj._rect.getX(RM_BOTTOMLEFT), subj._rect.getY(RM_BOTTOMLEFT), this._rect.getX(RM_CENTER), this._rectgetY(RM_CENTER)) <= this._rect.width/2) {
                        return true;
                    }
                    if(dist(subj._rect.getX(RM_BOTTOMRIGHT), subj._rect.getY(RM_BOTTOMRIGHT), this._rect.getX(RM_CENTER), this._rectgetY(RM_CENTER)) <= this._rect.width/2) {
                        return true;
                    }
                    return false;
                }
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

/**
 * 点による当たり判定領域を表すクラス。
 */
class PointCollider extends Collider {
    /**
     * @param {Rect} r 当たり判定領域を表すRect（Rectの中心座標が使われます）
     */
    constructor(r) {
        super(r);
        this._c_type = _HIT_POINT;
    }

    /**
     * 当たり判定を行います。
     * @param {Collider} subj 当たり判定を行う対象の領域
     * @returns {boolean} 当たっているか？
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
