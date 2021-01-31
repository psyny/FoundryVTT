import { DiceSFX } from '../DiceSFX.js';
import * as THREE from '../libs/three.module.js';

export class PlayAnimationDark extends DiceSFX {
    static id = "PlayAnimationDark";
    static name = "DICESONICE.PlayAnimationDark";
    static darkColor = null;
    static duration = 1.5;
    static sound = "modules/dice-so-nice/sfx/sounds/darkness.mp3";
    /**@override init */
    static async init() {
        PlayAnimationDark.darkColor = new THREE.Color(0.1,0.1,0.1);
        game.audio.pending.push(function(){
            AudioHelper.play({
                src: PlayAnimationDark.sound,
                autoplay: false
            }, false);
        }.bind(this));
    }

    /**@override play */
    async play() {
        this.clock = new THREE.Clock();
        this.baseColor = this.dicemesh.material.color.clone();
        this.baseMaterial = this.dicemesh.material;
        this.dicemesh.material = this.baseMaterial.clone();
        AudioHelper.play({
			src: PlayAnimationDark.sound,
            volume: this.box.volume
		}, false);
    }

    render() {
        let x = 1-((PlayAnimationDark.duration - this.clock.getElapsedTime())/PlayAnimationDark.duration);
        if(x>1){
            this.destroy();
        } else {
            let val = 0.05172144 + 9.269017*x - 26.55545*x**2 + 26.19969*x**3 - 8.977907*x**4;
            val = Math.min(Math.max(val, 0), 1);
            this.dicemesh.material.color.copy(this.baseColor);
            this.dicemesh.material.color.lerp(PlayAnimationDark.darkColor, val);
        }
    }

    destroy(){
        let sfxMaterial = this.dicemesh.material;
        this.dicemesh.material = this.baseMaterial;
        sfxMaterial.dispose();
        this.destroyed = true;
    }
}