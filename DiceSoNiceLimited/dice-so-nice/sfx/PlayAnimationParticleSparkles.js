import { DiceSFX } from '../DiceSFX.js';
import * as THREE from '../libs/three.module.js';
import { Proton } from '../libs/three-modules/three.proton.js';

export class PlayAnimationParticleSparkles extends DiceSFX {
    static id = "PlayAnimationParticleSparkles";
    static name = "DICESONICE.PlayAnimationParticleSparkles";
    static sprite = null;
    static sound = "modules/dice-so-nice/sfx/sounds/sparkles.mp3";
    /**@override init */
    static async init() {
        let map = new THREE.TextureLoader().load("modules/dice-so-nice/sfx/textures/glow_point_red_gold.webp");
        let material = new THREE.SpriteMaterial({
            map: map,
            fog: true,
            blending:THREE.AdditiveBlending,
            depthWrite:false,
            depthTest:true
        });
        PlayAnimationParticleSparkles.sprite = new THREE.Sprite(material);
        game.audio.pending.push(function(){
            AudioHelper.play({
                src: PlayAnimationParticleSparkles.sound,
                autoplay: false
            }, false);
        }.bind(this));
    }

    /**@override play */
    async play() {
        this.proton = new Proton();
        this.emitter = new Proton.Emitter();
        this.emitter.rate = new Proton.Rate(new Proton.Span(350, 450), 0.3);
        this.emitter.addInitialize(new Proton.Mass(1,0.3));
        this.emitter.addInitialize(new Proton.Life(1,3));
        this.emitter.addInitialize(new Proton.Body(PlayAnimationParticleSparkles.sprite));
        this.emitter.addInitialize(new Proton.Radius(100,60));
        this.emitter.addInitialize(new Proton.Position(new Proton.SphereZone(0,0,0,30)));
        this.emitter.addInitialize(new Proton.Velocity(200, new Proton.Vector3D(0, 0, 0), 0));

        this.emitter.addBehaviour(new Proton.RandomDrift(10,10,5,0.1,Infinity,Proton.easeOutQuart));
        this.emitter.addBehaviour(new Proton.Alpha(1, 0));
        this.emitter.addBehaviour(new Proton.Scale(1, 0.5));

        this.emitter.addBehaviour(new Proton.Force(0, 0, 1));
        this.emitter.p.x = this.dicemesh.parent.position.x;
        this.emitter.p.y = this.dicemesh.parent.position.y;

        let boundingBox = new THREE.Vector3();
        new THREE.Box3().setFromObject(this.dicemesh.parent).getSize(boundingBox);


        this.emitter.p.z = boundingBox.z/2;
        this.emitter.emit('once',true);
        this.proton.addEmitter(this.emitter);
        this.proton.addRender(new Proton.SpriteRender(this.box.scene));

        AudioHelper.play({
            src: PlayAnimationParticleSparkles.sound,
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