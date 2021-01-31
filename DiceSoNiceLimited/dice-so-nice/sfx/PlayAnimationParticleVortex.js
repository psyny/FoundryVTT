import { DiceSFX } from '../DiceSFX.js';
import * as THREE from '../libs/three.module.js';
import { Proton } from '../libs/three-modules/three.proton.js';

export class PlayAnimationParticleVortex extends DiceSFX {
    static id = "PlayAnimationParticleVortex";
    static name = "DICESONICE.PlayAnimationParticleVortex";
    static sprite = null;
    static sound = "modules/dice-so-nice/sfx/sounds/vortex.mp3";
    /**@override init */
    static async init() {
        let map = new THREE.TextureLoader().load("modules/dice-so-nice/sfx/textures/magic01.webp");
        let material = new THREE.MeshBasicMaterial({
            map: map,
            blending:THREE.NormalBlending,
            depthWrite:false,
            depthTest:true,
            transparent:true
        });
        let geometry = new THREE.PlaneGeometry(140,140);
        PlayAnimationParticleVortex.sprite = new THREE.Mesh(geometry,material);
        
        game.audio.pending.push(function(){
            AudioHelper.play({
                src: PlayAnimationParticleVortex.sound,
                autoplay: false
            }, false);
        }.bind(this));
    }

    /**@override play */
    async play() {
        this.proton = new Proton();
        this.emitter = new Proton.Emitter();
        this.emitter.rate = new Proton.Rate(new Proton.Span(6, 8), new Proton.Span(.1, .25));
        this.emitter.addInitialize(new Proton.Mass(1));
        this.emitter.addInitialize(new Proton.Life(0.8,2.4));
        this.emitter.addInitialize(new Proton.Body(PlayAnimationParticleVortex.sprite));
        this.emitter.addInitialize(new Proton.Velocity(50, new Proton.Vector3D(0,0,1), 0));
        let scale = this.box.dicefactory.baseScale/100;
        switch (this.dicemesh.shape) {
            case "d2":
                scale *= 1.3;
                break;
            case "d4":
                scale *= 1.2;
                break;
            case "d6":
                break;
            case "d8":
                scale *= 1.2;
                break;
            case "d10":
                break;
            case "d12":
                scale *= 1.3;
                break;
            case "d20":
                scale *= 1.4;
                break;
        }
        this.emitter.addInitialize(new Proton.Radius(scale));

        this.emitter.addBehaviour(new Proton.Color(['#1f0e26','#462634','#290088'],'#060206'));
        this.emitter.addBehaviour(new Proton.Alpha(0.7, 0, Infinity, Proton.easeInQuart));
        this.emitter.addBehaviour(new Proton.Scale(0.7, 1.3, Infinity, Proton.easeInSine));
        this.emitter.addBehaviour(new Proton.Rotate(0,0,-3));

        this.emitter.p.x = this.dicemesh.parent.position.x;
        this.emitter.p.y = this.dicemesh.parent.position.y;

        this.emitter.p.z = -5;
        this.emitter.emit(1.25,true);

        this.proton.addEmitter(this.emitter);
        this.proton.addRender(new Proton.MeshRender(this.box.scene));

        AudioHelper.play({
            src: PlayAnimationParticleVortex.sound,
            volume: this.box.volume
		}, false);
    }

    render() {
        this.proton.update();
        if(this.proton.emitters.length == 0){
            this.destroy();
        }
    }

    destroy(){
        if(this.emitter && !this.emitter.dead){
            this.emitter.removeAllParticles();
            this.proton.update();
            this.emitter.destroy();
        }
        this.proton.destroy();
        this.destroyed = true;
    }
}