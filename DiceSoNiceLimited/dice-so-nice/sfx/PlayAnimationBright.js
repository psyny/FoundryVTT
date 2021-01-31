import { DiceSFX } from '../DiceSFX.js';
import * as THREE from '../libs/three.module.js';

export class PlayAnimationBright extends DiceSFX {
    static id = "PlayAnimationBright";
    static name = "DICESONICE.PlayAnimationBright";
    static brightColor = null;
    static duration = 0.6;
    static sound = "modules/dice-so-nice/sfx/sounds/bright.mp3";
    /**@override init */
    static async init() {
        PlayAnimationBright.brightColor = new THREE.Color(0.4,0.4,0.4);
        game.audio.pending.push(function(){
            AudioHelper.play({
                src: PlayAnimationBright.sound,
                autoplay: false
            }, false);
        }.bind(this));
    }

    /**@override play */
    async play() {
        if(!this.dicemesh.material.emissiveMap && !this.dicemesh.material.bumpMap)
            return;
        this.clock = new THREE.Clock();
        this.baseColor = this.dicemesh.material.emissive.clone();
        this.baseMaterial = this.dicemesh.material;
        this.dicemesh.material = this.baseMaterial.clone();
        if(!this.dicemesh.material.emissiveMap){
            //Change the emissive map shader to highlight black instead of white
            this.dicemesh.material.onBeforeCompile = (shader) => {
                shader.fragmentShader = shader.fragmentShader.replace(
                    '#include <emissivemap_fragment>',
                    [
                        '#ifdef USE_EMISSIVEMAP',
                        'vec4 emissiveColorOg = texture2D( emissiveMap, vUv );',
                        'vec4 emissiveColor = vec4(1.0 - emissiveColorOg.r,1.0 -emissiveColorOg.g,1.0 -emissiveColorOg.b,1);',
                        'emissiveColor.rgb = emissiveMapTexelToLinear( emissiveColor ).rgb;',
                        'totalEmissiveRadiance *= emissiveColor.rgb;',
                        '#endif'
                    ].join('\n')
                );
            };
            this.dicemesh.material.emissiveMap = this.dicemesh.material.bumpMap;
            this.dicemesh.material.emissiveIntensity = 1.5;
        }
        AudioHelper.play({
            src: PlayAnimationBright.sound,
            volume: this.box.volume
		}, false);
    }

    render() {
        let x = 1-((PlayAnimationBright.duration - this.clock.getElapsedTime())/PlayAnimationBright.duration);
        if(x>1){
            this.destroy();
        } else {
            let val = (Math.sin(2 * Math.PI * (x - 1/4)) + 1) / 2;
            this.dicemesh.material.emissive.copy(this.baseColor);
            this.dicemesh.material.emissive.lerp(PlayAnimationBright.brightColor, val);
        }
    }

    destroy(){
        let sfxMaterial = this.dicemesh.material;
        this.dicemesh.material = this.baseMaterial;
        sfxMaterial.dispose();
        this.destroyed = true;
    }
}