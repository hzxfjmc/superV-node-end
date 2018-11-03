/**
 * Session model.
 *
 * @param {Context} ctx
 * @param {Object} obj
 * @api private
 */
export class Session {
    private _ctx;
    isNew: boolean;
    _json;

    constructor(ctx, obj) {
        this._ctx = ctx;
        if (!obj) this.isNew = true;
        else {
            for (let k in obj) {
                this[k] = obj[k];
            }
        }
    }


    /**
     * JSON representation of the session.
     *
     * @return {Object}
     * @api public
     */
    inspect() {
        let self = this;
        let obj = {};

        Object.keys(this).forEach(function (key) {
            if ('isNew' === key) return;
            if ('_' === key[0]) return;
            obj[key] = self[key];
        });

        return obj;
    }


    /**
     * Check if the session has changed relative to the `prev`
     * JSON value from the request.
     *
     * @param {String} [prev]
     * @return {Boolean}
     * @api private
     */
    changed(prev) {
        if (!prev) return true;
        this._json = JSON.stringify(this.inspect());
        return this._json !== prev;
    };

    /**
     * Return how many values there are in the session object.
     * Used to see if it's "populated".
     *
     * @return {Number}
     * @api public
     */
    get length() {
        return Object.keys(this.inspect()).length;
    }


    /**
     * populated flag, which is just a boolean alias of .length.
     *
     * @return {Boolean}
     * @api public
     */
    get populated() {
        return !!this.length;
    }

    /**
     * Save session changes by
     * performing a Set-Cookie.
     *
     * @api private
     */
    save() {
        let ctx = this._ctx;
        let json = this._json || JSON.stringify(this.inspect());
        let sid = ctx.sessionId;
        let opts = ctx.cookieOption;
        let key = ctx.sessionKey;

        if (ctx.cookies.get(key) !== sid) {
            ctx.cookies.set(key, sid, opts);
        }
        return json;
    };

}

