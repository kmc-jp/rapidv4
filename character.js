class Character {
    /**
     * ゲーム内のモノを定義するためのクラス。renderer, colliderをセットしないか、nullを渡した場合はそれらの属性は使用されません。
     * @param {Rect} r 位置や範囲を表すRect
     * @param {Renderer} renderer 描画に用いるRenderer
     * @param {Collider} collider 当たり判定に用いるCollider
     */
    constructor(r, renderer=null, collider=null) {
        this._rect = r;
        this._renderer = renderer;
        this._collider = collider;
    }

    /**
     * Characterの座標を設定します。現在のRect.modeが使われます。
     * @param {number} nx 新しいX座標
     * @param {number} ny 新しいY座標
     */
    setPosition(nx, ny) {
        this._rect.setPositionAndMode(x, y, this._rect.mode);
        this._rect.recalculate();
    }

    /**
     * CharacterのRect.modeを設定します。
     * mの指定は次の通り。
     * - RM_CENTER: 長方形の中心
     * - RM_TOPLEFT: 左上
     * - RM_TOP: 上辺の中点
     * - RM_TOPRIGHT: 右上
     * - RM_LEFT: 左側面の辺の中点
     * - RM_RIGHT: 右側面の辺の中点
     * - RM_BOTTOMLEFT: 左下
     * - RM_BOTTOM: 下辺の中点
     * - RM_BOTTOMRIGHT: 右下
     * @param {number} m 座標の基準はどこか？
     */
    setRectMode(m) {
        this._rect.mode = m;
        this._rect.recalculate();
    }

    /**
     * CharacterのRectをRendererにも設定します。Rendererがない場合は無視されます。
     * Rendererの設定によっては、幅・高さが無視される場合があります（R_AUTORECT指定時など）。
     */
    applyRectToRenderer() {
        if(this._renderer === null) {
            return;
        }

        this._renderer.setRect(this._rect);
    }

    /**
     * CharacterのRectをColliderにも設定します。Colliderがない場合は無視されます。
     */
    applyRectToCollider() {
        if(this._collider === null) {
            return;
        }

        this._collider._rect = this._rect;
    }

    /**
     * Charecterを描画します。Rendererがない場合は無視されます。
     */
    render() {
        if(this._renderer === null) {
            return;
        }

        this._renderer.render();
    }

    get renderer() {
        return this._renderer;
    }

    /**
     * CharacterのRectからRectColliderを作成し、Characterに設定します。
     */
    createRectColliderFromRect() {
        this._collider = new RectCollider(this._rect);
    }

    /**
     * 指定したCharacterとの当たり判定を行います。Colliderがない場合は無視されます。
     * @param {Character} chr 当たり判定をする相手のCharacter
     */
    isHitBy(chr) {
        if(this._collider === null) {
            return;
        }

        return this._collider.isHit(chr._collider);
    }

    /**
     * Characterの状態を更新します。
     * デフォルトでは何も行わないので、Characterを継承してoverrideして使いましょう。
     */
    update() {
        // do nothing
    }
}