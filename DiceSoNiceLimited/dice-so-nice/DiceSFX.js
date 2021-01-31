export class DiceSFX {
    get nameLocalized(){
        return game.i18n.localize(this._name);
    }
    constructor(box, dicemesh){
        this.dicemesh = dicemesh;
        this.box = box;
        this.destroyed = false;
        this.enableGC = false;
    }
    static async init(){
        return true;
    }
    async play(){
        return Promise.resolve();
    }
}