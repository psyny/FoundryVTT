import { DiceSFX } from '../DiceSFX.js';
import * as THREE from '../libs/three.module.js';
import { GLTFLoader } from '../libs/three-modules/GLTFLoader.js';

export class PlayAnimationThormund extends DiceSFX {
    static id = "PlayAnimationThormund";
    static name = "DICESONICE.PlayAnimationThormund";
    static file = "modules/dice-so-nice/sfx/models/thormund.glb";
    static sound = "modules/dice-so-nice/sfx/sounds/thormund.mp3";
    static model = null;
    static curve = null;
    static duration1 = 2.5;
    static duration2 = 2.5;
    static up = new THREE.Vector3(0,0,1);
    /**@override init */
    static async init() {
        let loader = new GLTFLoader();

		loader.load(PlayAnimationThormund.file, gltf => {
			gltf.scene.traverse(function (node) {
				if (node.isMesh) {
					node.castShadow = true; 
				}
			});
            PlayAnimationThormund.model = gltf.scene.children[0];
        });
        game.audio.pending.push(function(){
            AudioHelper.play({
                src: PlayAnimationThormund.sound,
                autoplay: false
            }, false);
        }.bind(this));
    }
    /**@override play */
    async play() {
        this.step = 1;
        this.clock = new THREE.Clock();
        this.thormund = PlayAnimationThormund.model.clone();
        let scale = this.box.dicefactory.baseScale/100;

        let boundingBox = new THREE.Vector3();
        new THREE.Box3().setFromObject(this.dicemesh.parent).getSize(boundingBox);
		this.thormund.scale.set(scale,scale,scale);
        this.thormund.rotation.x = Math.PI/2;
        this.thormund.position.x = this.dicemesh.parent.position.x;
        this.thormund.position.y = this.dicemesh.parent.position.y;
        this.thormund.position.z = this.dicemesh.parent.position.z + (boundingBox.z/2);

        this.curve = new THREE.CatmullRomCurve3( [
            new THREE.Vector3( this.thormund.position.x, this.thormund.position.y,-50),
            new THREE.Vector3( this.thormund.position.x +0, this.thormund.position.y    -100, this.thormund.position.z  +0 ),
            new THREE.Vector3( this.thormund.position.x +100, this.thormund.position.y  -30, this.thormund.position.z    +0 ),
            new THREE.Vector3( this.thormund.position.x +100, this.thormund.position.y  +30, this.thormund.position.z    +0 ),
            new THREE.Vector3( this.thormund.position.x +30, this.thormund.position.y    +100, this.thormund.position.z  +0 ),
            new THREE.Vector3( this.thormund.position.x -30, this.thormund.position.y    +100, this.thormund.position.z  +0 ),
            new THREE.Vector3( this.thormund.position.x -100, this.thormund.position.y  +30, this.thormund.position.z    +80 ),
            new THREE.Vector3( this.thormund.position.x /2, this.thormund.position.y /2, this.thormund.position.z    +100 )
        ],false,"chordal");

        this.curve2 = new THREE.CatmullRomCurve3([
            new THREE.Vector3( this.thormund.position.x /2, this.thormund.position.y /2, this.thormund.position.z    +100 ),
            new THREE.Vector3( 100, 50, this.box.camera.position.z/4 ),
            new THREE.Vector3( -100, -50, this.box.camera.position.z/4*2 ),
            new THREE.Vector3( 0, -50, this.box.camera.position.z/4*3 ),
            new THREE.Vector3( 0, 0, this.box.camera.position.z )
        ],false,"chordal");

        this.axis = new THREE.Vector3();
        this.box.scene.add(this.thormund);
        AudioHelper.play({
            src: PlayAnimationThormund.sound,
            volume: this.box.volume
		}, false);
    }

    render() {
        let duration = this.step == 1? PlayAnimationThormund.duration1:PlayAnimationThormund.duration2;
        let x = 1-((duration - this.clock.getElapsedTime())/duration);
        if(x>1){
            if(this.step == 1){
                this.step++;
                x = 0;
                this.clock.start();
                this.render();
            }
            else
                this.destroy();
        } else {
            let curve = this.step==1?this.curve:this.curve2;
            let p = curve.getPointAt(x);
            let t = curve.getTangentAt(x).normalize();
            this.axis.crossVectors(PlayAnimationThormund.up, t).normalize();
            let radians = Math.acos(PlayAnimationThormund.up.dot(t));

            this.thormund.position.copy(p);
            this.thormund.quaternion.setFromAxisAngle(this.axis,radians);
        }
    }

    destroy(){
        this.box.scene.remove(this.thormund);
        this.destroyed = true;
    }
}