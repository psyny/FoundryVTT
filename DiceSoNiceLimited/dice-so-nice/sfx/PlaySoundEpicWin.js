import { DiceSFX } from '../DiceSFX.js';

export class PlaySoundEpicWin extends DiceSFX {
    static id = "PlaySoundEpicWin";
    static name = "DICESONICE.PlaySoundEpicWin";
    static path = 'modules/dice-so-nice/sfx/sounds/epic_win.mp3';
    /**@override init */
    static async init(){
        game.audio.pending.push(function(){
            AudioHelper.play({
                src: PlaySoundEpicWin.path,
                autoplay: false
            }, false);
        }.bind(this));
        return true;
    }

    /**@override play */
    async play(){
        AudioHelper.play({
            src: PlaySoundEpicWin.path,
            volume: this.box.volume
		}, false);
    }
}