/**
 * ゲーム内のモノを定義するためのクラス。RendererとColliderを一つのオブジェクトの統合します。
 * RendererおよびColliderの座標はrの位置およびsetPosition()で指定される位置を原点として、自動的に変更されます。
 */
class Character {
    /**
     * renderer, colliderをセットしないか、nullを渡した場合はそれらの属性は使用されません。
     * @param {number} x CharacterのX座標
     * @param {number} y CharacterのY座標
     * @param {Renderer} renderer 描画に用いるRenderer
     * @param {Collider} collider 当たり判定に用いるCollider
     */
    constructor(x, y, renderer=null, collider=null) {
        this._pos_x = x;
        this._pos_y = y;
        this._renderer = renderer;
        this._collider = collider;
    }

    /**
     * Characterの座標を設定します。現在のRect.modeが使われます。
     * @param {number} nx 新しいX座標
     * @param {number} ny 新しいY座標
     */
    setPosition(nx, ny) {
        this._pos_x = nx;
        this._pos_y = ny;
    }

    /**
     * Charecterを描画します。Rendererがない場合は無視されます。
     */
    render() {
        if(this._renderer === null) {
            return;
        }

        this._renderer.setOffset(this._pos_x, this._pos_y);

        this._renderer.render();
    }

    get renderer() {
        return this._renderer;
    }

    /**
     * 指定したCharacterとの当たり判定を行います。Colliderがない場合は無視されます。
     * @param {Character} chr 当たり判定をする相手のCharacter
     * @returns {boolean} 当たっているか？
     */
    isHitBy(chr) {
        if(this._collider === null) {
            return;
        }

        this._collider.setOffset(this._pos_x, this._pos_y);

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