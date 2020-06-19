import {DiceNotation} from './DiceNotation.js';
import {DiceColors} from './DiceColors.js';
export class DiceBox {

	constructor(element_container, dice_factory, config) {
		//private variables
		this.known_types = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100'];
		this.container = element_container;
		this.dimensions = config.dimensions;
		this.dicefactory = dice_factory;
		this.config = config;
		this.speed = 1;

		this.adaptive_timestep = false;
		this.last_time = 0;
		this.settle_time = 0;
		this.running = false;
		this.rolling = false;
		this.threadid;

		this.display = {
			currentWidth: null,
			currentHeight: null,
			containerWidth: null,
			containerHeight: null,
			aspect: null,
			scale: null
		};

		this.mouse = {
			pos: new THREE.Vector2(),
			startDrag: undefined,
			startDragTime: undefined
		};

		this.cameraHeight = {
			max: null,
			close: null,
			medium: null,
			far: null
		};

		this.scene = new THREE.Scene();
		this.world = new CANNON.World();
		this.world_sim = new CANNON.World();
		this.raycaster = new THREE.Raycaster();
		this.rayvisual = null;
		this.showdebugtracer = false;
		this.dice_body_material = new CANNON.Material();
		this.desk_body_material = new CANNON.Material();
		this.barrier_body_material = new CANNON.Material();
		this.sounds_table = {};
		this.sounds_dice = [];
		this.lastSoundType = '';
		this.lastSoundStep = 0;
		this.lastSound = 0;
		this.iteration;
		this.renderer;
		this.barrier;
		this.camera;
		this.light;
		this.desk;
		this.pane;

		//public variables
		this.public_interface = {};
		this.diceList = []; //'private' variable
		this.deadDiceList = [];
		this.framerate = (1/60);
		this.sounds = true;
		this.volume = 100;
		this.soundDelay = 10; // time between sound effects in ms
		this.animstate = '';

		this.selector = {
			animate: true,
			rotate: true,
			intersected: null,
			dice: []
		};

		this.colors = {
			ambient:  0xf0f5fb,
			spotlight: 0xefdfd5
		};

		this.shadows = true;

		this.rethrowFunctions = {};
		this.afterThrowFunctions = {};
	}

	preloadSounds(){

		//only "felt" is activated for now
		let surfaces = [
			['felt', 7]
			/*['wood_table', 7],
			['wood_tray', 7],
			['metal', 9]*/
		];

		for (const [surface, numsounds] of surfaces) {
			this.sounds_table[surface] = [];
			for (let s=1; s <= numsounds; ++s) {
				let path = `modules/dice-so-nice/sounds/${surface}/surface_${surface}${s}.wav`;
				AudioHelper.play({
					src:path,
					autoplay:false
				},false);
				this.sounds_table[surface].push(path);
			}
		}

		for (let i=1; i <= 15; ++i) {
			let path = `modules/dice-so-nice/sounds/dicehit${i}.wav`;
			AudioHelper.play({
				src:path,
				autoplay:false
			},false);
			this.sounds_dice.push(path);
		}
	}

	initialize() {
		game.audio.pending.push(this.preloadSounds.bind(this));

		if(this.config.system != "standard")
			this.dicefactory.setSystem(this.config.system);

		this.sounds = this.config.sounds == '1';
		this.shadows = this.config.shadowQuality != "none";
		this.dicefactory.setBumpMapping(this.config.bumpMapping);
		this.speed = this.config.speed;

		this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

		this.container.appendChild(this.renderer.domElement);
		this.renderer.shadowMap.enabled = this.shadows;
		this.renderer.shadowMap.type = this.config.shadowQuality == "high" ? THREE.PCFSoftShadowMap : THREE.PCFShadowMap;
		this.renderer.setClearColor(0x000000, 0);

		this.setDimensions(this.config.dimensions);

		this.world.gravity.set(0, 0, -9.8 * 800);
		this.world.broadphase = new CANNON.NaiveBroadphase();
		this.world.solver.iterations = 14;
		this.world.allowSleep = true;

		this.world_sim.gravity.set(0, 0, -9.8 * 800);
		this.world_sim.broadphase = new CANNON.NaiveBroadphase();
		this.world_sim.solver.iterations = 14;
		this.world_sim.allowSleep = true;

		this.scene.add(new THREE.AmbientLight(this.colors.ambient, 1));

		let contactMaterial = new CANNON.ContactMaterial( this.desk_body_material, this.dice_body_material, {friction: 0.01, restitution: 0.5});
		this.world.addContactMaterial(contactMaterial);
		this.world_sim.addContactMaterial(contactMaterial);
		contactMaterial = new CANNON.ContactMaterial( this.barrier_body_material, this.dice_body_material, {friction: 0, restitution: 1.0});
		this.world.addContactMaterial(contactMaterial);
		this.world_sim.addContactMaterial(contactMaterial);
		contactMaterial = new CANNON.ContactMaterial( this.dice_body_material, this.dice_body_material, {friction: 0, restitution: 0.5});
		this.world.addContactMaterial(contactMaterial);
		this.world_sim.addContactMaterial(contactMaterial);
		let desk = new CANNON.Body({allowSleep: false, mass: 0, shape: new CANNON.Plane(), material: this.desk_body_material});
		this.world.add(desk);
		this.world_sim.add(desk);
		
		let barrier = new CANNON.Body({allowSleep: false, mass: 0, shape: new CANNON.Plane(), material: this.barrier_body_material});
		barrier.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), Math.PI / 2);
		barrier.position.set(0, this.display.containerHeight * 0.93, 0);
		this.world.add(barrier);
		this.world_sim.add(barrier);

		barrier = new CANNON.Body({allowSleep: false, mass: 0, shape: new CANNON.Plane(), material: this.barrier_body_material});
		barrier.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
		barrier.position.set(0, -this.display.containerHeight * 0.93, 0);
		this.world.add(barrier);
		this.world_sim.add(barrier);

		barrier = new CANNON.Body({allowSleep: false, mass: 0, shape: new CANNON.Plane(), material: this.barrier_body_material});
		barrier.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), -Math.PI / 2);
		barrier.position.set(this.display.containerWidth * 0.93, 0, 0);
		this.world.add(barrier);
		this.world_sim.add(barrier);

		barrier = new CANNON.Body({allowSleep: false, mass: 0, shape: new CANNON.Plane(), material: this.barrier_body_material});
		barrier.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI / 2);
		barrier.position.set(-this.display.containerWidth * 0.93, 0, 0);
		this.world.add(barrier);
		this.world_sim.add(barrier);

		this.renderer.render(this.scene, this.camera);
	}

	setDimensions(dimensions) {
		this.display.currentWidth = this.container.clientWidth / 2;
		this.display.currentHeight = this.container.clientHeight / 2;
		if (dimensions) {
			this.display.containerWidth = dimensions.w;
			this.display.containerHeight = dimensions.h;
		} else {
			this.display.containerWidth = this.display.currentWidth;
			this.display.containerHeight = this.display.currentHeight;
		}
		this.display.aspect = Math.min(this.display.currentWidth / this.display.containerWidth, this.display.currentHeight / this.display.containerHeight);

		if(this.config.autoscale)
			this.display.scale = Math.sqrt(this.display.containerWidth * this.display.containerWidth + this.display.containerHeight * this.display.containerHeight) / 13;
		else
			this.display.scale = this.config.scale;
		this.dicefactory.setScale(this.display.scale);
		this.renderer.setSize(this.display.currentWidth * 2, this.display.currentHeight * 2);

		this.cameraHeight.max = this.display.currentHeight / this.display.aspect / Math.tan(10 * Math.PI / 180);

		this.cameraHeight.medium = this.cameraHeight.max / 1.5;
		this.cameraHeight.far = this.cameraHeight.max;
		this.cameraHeight.close = this.cameraHeight.max / 2;

		if (this.camera) this.scene.remove(this.camera);
		this.camera = new THREE.PerspectiveCamera(20, this.display.currentWidth / this.display.currentHeight, 1, this.cameraHeight.max * 1.3);

		switch (this.animstate) {
			case 'selector':
				this.camera.position.z = this.selector.dice.length > 9 ? this.cameraHeight.far : (this.selector.dice.length < 6 ? this.cameraHeight.close : this.cameraHeight.medium);
				break;
			case 'throw': case 'afterthrow': default: this.camera.position.z = this.cameraHeight.far;

		}

		this.camera.lookAt(new THREE.Vector3(0,0,0));
		
		const maxwidth = Math.max(this.display.containerWidth, this.display.containerHeight);

		if (this.light) this.scene.remove(this.light);
		this.light = new THREE.SpotLight(this.colors.spotlight, 1.0);
		this.light.position.set(-maxwidth / 2, maxwidth / 2, maxwidth * 3);
		this.light.target.position.set(0, 0, 0);
		this.light.distance = maxwidth * 5;
		this.light.angle = Math.PI/4;
		this.light.castShadow = this.shadows;
		this.light.shadow.camera.near = maxwidth / 10;
		this.light.shadow.camera.far = maxwidth * 5;
		this.light.shadow.camera.fov = 50;
		this.light.shadow.bias = 0.001;
		this.light.shadow.mapSize.width = 1024;
		this.light.shadow.mapSize.height = 1024;
		this.scene.add(this.light);

		if (this.desk) this.scene.remove(this.desk);
		let shadowplane = new THREE.ShadowMaterial();
		shadowplane.opacity = 0.5;
		this.desk = new THREE.Mesh(new THREE.PlaneGeometry(this.display.containerWidth * 6, this.display.containerHeight * 6, 1, 1), shadowplane);
		this.desk.receiveShadow = this.shadows;
		this.scene.add(this.desk);

		this.renderer.render(this.scene, this.camera);
	}

	update(config) {
        if(config.autoscale) {
            this.display.scale = Math.sqrt(this.display.containerWidth * this.display.containerWidth + this.display.containerHeight * this.display.containerHeight) / 13;
        } else {
            this.display.scale = config.scale
        }
		this.dicefactory.setScale(this.display.scale);
		this.dicefactory.setBumpMapping(config.bumpMapping);

		this.speed = parseInt(config.speed,10);
		this.shadows = config.shadowQuality != "none";
		this.light.castShadow = this.shadows;
		this.desk.receiveShadow = this.shadows;
		this.renderer.shadowMap.enabled = this.shadows;
		this.renderer.shadowMap.type = config.shadowQuality == "high" ? THREE.PCFSoftShadowMap : THREE.PCFShadowMap;
		this.sounds = config.sounds;
		if(config.system)
			this.dicefactory.setSystem(config.system);
        this.applyColorsForRoll(config);
    }


	vectorRand({x, y}) {
		let angle = Math.random() * Math.PI / 5 - Math.PI / 5 / 2;
		let vec = {
			x: x * Math.cos(angle) - y * Math.sin(angle),
			y: x * Math.sin(angle) + y * Math.cos(angle)
		};
		if (vec.x == 0) vec.x = 0.01;
		if (vec.y == 0) vec.y = 0.01;
		return vec;
	}

	//returns an array of vectordata objects
	getNotationVectors(notation, vector, boost, dist){

		let notationVectors = new DiceNotation(notation, this.dicefactory);

		for (let i in notationVectors.set) {

			const diceobj = this.dicefactory.get(notationVectors.set[i].type);
			let numdice = notationVectors.set[i].num;
			let operator = notationVectors.set[i].op;
			let sid = notationVectors.set[i].sid;
			let gid = notationVectors.set[i].gid;
			let glvl = notationVectors.set[i].glvl;
			let func = notationVectors.set[i].func;
			let args = notationVectors.set[i].args;

			for(let k = 0; k < numdice; k++){

				let vec = this.vectorRand(vector);

				vec.x /= dist;
				vec.y /= dist;

				let pos = {
					x: this.display.containerWidth * (vec.x > 0 ? -1 : 1) * 0.9,
					y: this.display.containerHeight * (vec.y > 0 ? -1 : 1) * 0.9,
					z: Math.random() * 200 + 200
				};

				let projector = Math.abs(vec.x / vec.y);
				if (projector > 1.0) pos.y /= projector; else pos.x *= projector;


				let velvec = this.vectorRand(vector);

				velvec.x /= dist;
				velvec.y /= dist;

				let velocity = { 
					x: velvec.x * (boost * notationVectors.boost), 
					y: velvec.y * (boost * notationVectors.boost), 
					z: -10
				};

				let angle = {
					x: -(Math.random() * vec.y * 5 + diceobj.inertia * vec.y),
					y: Math.random() * vec.x * 5 + diceobj.inertia * vec.x,
					z: 0
				};

				let axis = { 
					x: Math.random(), 
					y: Math.random(), 
					z: Math.random(), 
					a: Math.random()
				};

				notationVectors.vectors.push({ 
					type: diceobj.type, 
					op: operator,
					sid,  
					gid, 
					glvl,
					func, 
					args, 
					pos, 
					velocity, 
					angle, 
					axis
				});
			}            
		}
		return notationVectors;
	}

	// swaps dice faces to match desired result
	swapDiceFace(dicemesh, result){
		const diceobj = this.dicefactory.get(dicemesh.notation.type);

		if (diceobj.shape == 'd4') {
			this.swapDiceFace_D4(dicemesh, result);
			return;
		}

		let values = diceobj.values;
		let value = parseInt(dicemesh.getLastValue().value);
		result = parseInt(result);
		
		if (dicemesh.notation.type == 'd10' && value == 0) value = 10;
		if (dicemesh.notation.type == 'd100' && value == 0) value = 100;
		if (dicemesh.notation.type == 'd100' && (value > 0 && value < 10)) value *= 10;

		if (dicemesh.notation.type == 'd10' && result == 0) result = 10;
		if (dicemesh.notation.type == 'd100' && result == 0) result = 100;
		if (dicemesh.notation.type == 'd100' && (result > 0 && result < 10)) result *= 10;

		let valueindex = diceobj.values.indexOf(value);
		let resultindex = diceobj.values.indexOf(result);

		if (valueindex < 0 || resultindex < 0) return;
		if (valueindex == resultindex) return;

		// find material index for corresponding value -> face and swap them
		// must clone the geom before modifying it
		let geom = dicemesh.geometry.clone();

		// find list of faces that use the matching material index for the given value/result
		let geomindex_value = [];
		let geomindex_result = [];

		// it's magic but not really
		// the mesh's materials start at index 2
		let magic = 2;
		// except on d10 meshes
		if (diceobj.shape == 'd10') magic = 1;

		let material_value = (valueindex+magic);
		let material_result = (resultindex+magic);

		for (var i = 0, l = geom.faces.length; i < l; ++i) {
			const matindex = geom.faces[i].materialIndex;

			if (matindex == material_value) {
				geomindex_value.push(i);
				continue;
			}
			if (matindex == material_result) {
				geomindex_result.push(i);
				continue;
			}
		}

		if (geomindex_value.length <= 0 || geomindex_result.length <= 0) return;

		//swap the materials
		for(let i = 0, l = geomindex_result.length; i < l; i++) {
			geom.faces[geomindex_result[i]].materialIndex = material_value;
		}

		for(let i = 0, l = geomindex_value.length; i < l; i++) {
			geom.faces[geomindex_value[i]].materialIndex = material_result;
		}

		dicemesh.resultReason = 'forced';
		dicemesh.geometry = geom;
	}

	swapDiceFace_D4(dicemesh, result) {
		const diceobj = this.dicefactory.get(dicemesh.notation.type);
		let value = parseInt(dicemesh.getLastValue().value);
		result = parseInt(result);
		if (!(value >= 1 && value <= 4))
		{
			return;
		}

		let num = result - value;
		let geom = dicemesh.geometry.clone();
        
		for (let i = 0, l = geom.faces.length; i < l; ++i) {

			let matindex = geom.faces[i].materialIndex;
			if (matindex == 0) continue;

			matindex += num - 1;

			while (matindex > 4) matindex -= 4;
			while (matindex < 1) matindex += 4;
			geom.faces[i].materialIndex = matindex + 1;
			
		}
        if (num != 0) {
            if (num < 0) num += 4;
            dicemesh.material = this.dicefactory.createMaterials(diceobj, 0, 0, false, num);
        }

		dicemesh.resultReason = 'forced';
		dicemesh.geometry = geom;
	}

	//spawns one dicemesh object from a single vectordata object
	spawnDice(vectordata) {
		const diceobj = this.dicefactory.get(vectordata.type);
		if(!diceobj) return;

		let dicemesh = this.dicefactory.create(diceobj.type);
		if(!dicemesh) return;

		dicemesh.notation = vectordata;
		dicemesh.result = [];
		dicemesh.stopped = 0;
		dicemesh.castShadow = this.shadows;
		dicemesh.body = new CANNON.Body({allowSleep: true, sleepSpeedLimit: 100, sleepTimeLimit:0.5, mass: diceobj.mass, shape: dicemesh.geometry.cannon_shape, material: this.dice_body_material});
		dicemesh.body.type = CANNON.Body.DYNAMIC;
		dicemesh.body.position.set(vectordata.pos.x, vectordata.pos.y, vectordata.pos.z);
		dicemesh.body.quaternion.setFromAxisAngle(new CANNON.Vec3(vectordata.axis.x, vectordata.axis.y, vectordata.axis.z), vectordata.axis.a * Math.PI * 2);
		dicemesh.body.angularVelocity.set(vectordata.angle.x, vectordata.angle.y, vectordata.angle.z);
		dicemesh.body.velocity.set(vectordata.velocity.x, vectordata.velocity.y, vectordata.velocity.z);
		dicemesh.body.linearDamping = 0.1;
		dicemesh.body.angularDamping = 0.1;
		dicemesh.body.addEventListener('collide', this.eventCollide.bind(this));

		dicemesh.body_sim = new CANNON.Body({allowSleep: true, sleepSpeedLimit: 100, sleepTimeLimit:0.5,mass: diceobj.mass, shape: dicemesh.geometry.cannon_shape, material: this.dice_body_material});
		dicemesh.body_sim.type = CANNON.Body.DYNAMIC;
		dicemesh.body_sim.position.set(vectordata.pos.x, vectordata.pos.y, vectordata.pos.z);
		dicemesh.body_sim.quaternion.setFromAxisAngle(new CANNON.Vec3(vectordata.axis.x, vectordata.axis.y, vectordata.axis.z), vectordata.axis.a * Math.PI * 2);
		dicemesh.body_sim.angularVelocity.set(vectordata.angle.x, vectordata.angle.y, vectordata.angle.z);
		dicemesh.body_sim.velocity.set(vectordata.velocity.x, vectordata.velocity.y, vectordata.velocity.z);
		dicemesh.body_sim.linearDamping = 0.1;
		dicemesh.body_sim.angularDamping = 0.1;

		this.scene.add(dicemesh);
		this.diceList.push(dicemesh);
		this.world.add(dicemesh.body);
		this.world_sim.add(dicemesh.body_sim);
	}

	eventCollide({body, target}) {
		// collision events happen simultaneously for both colliding bodies
		// all this sanity checking helps limits sounds being played

		// don't play sounds if we're simulating
		if (this.animstate === 'simulate') return;
		if (!this.sounds || !body || !this.sounds_dice.length) return;

		let now = Date.now();
		let currentSoundType = (body.mass > 0) ? 'dice' : 'table';

		// 
		// the idea here is that a dice clack should never be skipped in favor of a table sound
		// if ((don't play sounds if we played one this world step, or there hasn't been enough delay) AND 'this sound IS NOT a dice clack') then 'skip it'
		if ((this.lastSoundStep == body.world.stepnumber || this.lastSound > now) && currentSoundType != 'dice') return;
		// also skip if it's too early and both last sound and this sound are the same
		if ((this.lastSoundStep == body.world.stepnumber || this.lastSound > now) && currentSoundType == 'dice' && this.lastSoundType == 'dice') return;

		if (body.mass > 0) { // dice to dice collision

			let speed = body.velocity.length();
			// also don't bother playing at low speeds
			if (speed < 250) return;

			let strength = 0.1;
			let high = 12000;
			let low = 250;
			strength = Math.max(Math.min(speed / (high-low), 1), strength);

			let sound = this.sounds_dice[Math.floor(Math.random() * this.sounds_dice.length)];
			AudioHelper.play({
				src:sound
			},false);
			this.lastSoundType = 'dice';


		} else { // dice to table collision
			let speed = target.velocity.length();
			// also don't bother playing at low speeds
			if (speed < 250) return;

			let surface = 'felt';
			let strength = 0.1;
			let high = 12000;
			let low = 250;
			strength = Math.max(Math.min(speed / (high-low), 1), strength);

			let soundlist = this.sounds_table[surface];
			let sound = soundlist[Math.floor(Math.random() * soundlist.length)];

			AudioHelper.play({
				src:sound
			},false);
			this.lastSoundType = 'table';
		}

		this.lastSoundStep = body.world.stepnumber;
		this.lastSound = now + this.soundDelay;
	}

	throwFinished(worldType = "render")  {
		
		let stopped = true;
		if (this.iteration > 1000) return true;
		for (let i=0, len=this.diceList.length; i < len; ++i) {
			let dicemesh = this.diceList[i];
			let body = dicemesh.body;
			if(worldType == "sim")
				body = dicemesh.body_sim;
			if(body.sleepState < 2)
				return false;
			else if(dicemesh.result.length==0)
				dicemesh.storeRolledValue();
		}
		return stopped;
	}

	simulateThrow() {
		this.animstate = 'simulate';
		this.iteration = 0;
		this.settle_time = 0;
		this.rolling = true;
		while (!this.throwFinished("sim")) {
			++this.iteration;
			this.world_sim.step(this.framerate);
		}
	}

	animateThrow(me, threadid, callback, notationVectors){
		me.animstate = 'throw';
		let time = (new Date()).getTime();
		me.last_time = me.last_time || time - (me.framerate*1000);
		let time_diff = (time - me.last_time) / 1000;
		++me.iteration;
		let neededSteps = Math.floor(time_diff / me.framerate);

		for(let i =0; i < neededSteps*me.speed; i++) {
			me.world.step(me.framerate);
		}

		// update physics interactions visually
		for (let i in me.scene.children) {
			let interact = me.scene.children[i];
			if (interact.body != undefined) {
				interact.position.copy(interact.body.position);
				interact.quaternion.copy(interact.body.quaternion);
			}
		}

		me.renderer.render(me.scene, me.camera);
		me.last_time = me.last_time + neededSteps*me.framerate*1000;

		// roll finished
		if (me.running == threadid && me.throwFinished("render")) {
			me.running = false;
			me.rolling = false;
			if(callback) callback(notationVectors);

			
			me.running = (new Date()).getTime();
			me.animateAfterThrow(me,me.running);
			return;
		}

		// roll not finished, keep animating
		if (me.running == threadid) {
			((call, tid, at, aftercall, vecs) => {
				if (!at && time_diff < me.framerate) {
					setTimeout(() => { requestAnimationFrame(() => { call(me,tid, aftercall, vecs); }); }, (me.framerate - time_diff) * 1000);
				} else {
					requestAnimationFrame(() => { call(me,tid, aftercall, vecs); });
				}
			})(me.animateThrow, threadid, me.adaptive_timestep, callback, notationVectors);
		}
	}

	animateAfterThrow(me,threadid) {
		me.animstate = 'afterthrow';
		let time = (new Date()).getTime();
		let time_diff = (time - me.last_time) / 1000;
		if (time_diff > 3) time_diff = me.framerate;

		me.raycaster.setFromCamera( me.mouse.pos, me.camera );
		if (me.rayvisual) me.rayvisual.setDirection(me.raycaster.ray.direction);
		let intersects = me.raycaster.intersectObjects(me.diceList);
		if ( intersects.length > 0 ) {
			//setSelected(intersects[0].object);
		} else {
			//setSelected();
		}

		me.last_time = time;
		me.renderer.render(me.scene, me.camera);
		if (me.running == threadid) {
			((call, tid, at) => {
				if (!at && time_diff < me.framerate) {
					setTimeout(() => { requestAnimationFrame(() => { call(me,tid); }); }, (me.framerate - time_diff) * 1000);
				} else {
					requestAnimationFrame(() => { call(me,tid); });
				}
			})(me.animateAfterThrow, threadid, me.adaptive_timestep);
		}
	}

	start_throw(notation, result, dsnConfig, callback) {
		if (this.rolling) return;

		let maxDiceNumber = game.settings.get("dice-so-nice", "maxDiceNumber");
		if(this.deadDiceList.length + result.length > maxDiceNumber) {
			this.clearAll();
		}

		let vector = { x: (Math.random() * 2 - 0.5) * this.display.currentWidth, y: -(Math.random() * 2 - 0.5) * this.display.currentHeight};
		let dist = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
		let boost = (Math.random() + 3) * dist;

		let res = this.getNotationVectors(notation, vector, boost, dist);
		
		this.applyColorsForRoll(dsnConfig);
		this.dicefactory.setSystem(dsnConfig.system);

		let notationVectors = new DiceNotation(res.notation, this.dicefactory);
		notationVectors.result = result;
		notationVectors.vectors = res.vectors;

		this.rollDice(notationVectors,callback);
	}

	applyColorsForRoll(dsnConfig){
		let texture = null;
		if(dsnConfig.colorset == "custom")
			DiceColors.setColorCustom(dsnConfig.labelColor, dsnConfig.diceColor, dsnConfig.outlineColor, dsnConfig.edgeColor);

		if(dsnConfig.texture != "none")
			texture = dsnConfig.texture;
		else if(dsnConfig.colorset != "custom")
		{
			let set = DiceColors.getColorSet(dsnConfig.colorset);
			texture = set.texture.id;
		}

		DiceColors.applyColorSet(this.dicefactory, dsnConfig.colorset, texture);
	}

	clearDice() {
		this.running = false;
		this.deadDiceList = this.deadDiceList.concat(this.diceList);
		this.diceList = [];
	}

	clearAll(){
		this.clearDice();
		let dice;
		while (dice = this.deadDiceList.pop()) {
			this.scene.remove(dice); 
			if (dice.body) this.world.remove(dice.body);
			if (dice.body_sim) this.world_sim.remove(dice.body_sim);
		}
		if (this.pane) this.scene.remove(this.pane);
		this.renderer.render(this.scene, this.camera);

		setTimeout(() => { this.renderer.render(this.scene, this.camera); }, 100);
	}

	rollDice(notationVectors, callback){

		if (notationVectors.error) {
			callback();
			return;
		}

		this.camera.position.z = this.cameraHeight.far;
		this.clearDice();

		for (let i=0, len=notationVectors.vectors.length; i < len; ++i) {
			this.spawnDice(notationVectors.vectors[i]);
		}
		this.simulateThrow();
		this.iteration = 0;
		this.settle_time = 0;

		//check forced results, fix dice faces if necessary
		if (notationVectors.result && notationVectors.result.length > 0) {
			for (let i=0;i<notationVectors.result.length;i++) {
				let dicemesh = this.diceList[i];
				if (!dicemesh) continue;
				if (dicemesh.getLastValue().value == notationVectors.result[i]) continue;
				this.swapDiceFace(dicemesh, notationVectors.result[i]);
			}
		}

		//reset the result
		for (let i=0, len=this.diceList.length; i < len; ++i) {
			if (!this.diceList[i]) continue;

			if (this.diceList[i].resultReason != 'forced') {
				this.diceList[i].result = [];
			}
		}

		// animate the previously simulated roll
		this.rolling = true;
		this.running = (new Date()).getTime();
		this.last_time = 0;
		this.animateThrow(this,this.running, callback, notationVectors);
	}

	showcase(config) {
		this.clearAll();
		let step = this.display.containerWidth / 4 *1.15;

		if (this.pane) this.scene.remove(this.pane);
		if (this.desk) this.scene.remove(this.desk);
		if (this.shadows) {
			let shadowplane = new THREE.ShadowMaterial();
			shadowplane.opacity = 0.5;

			this.pane = new THREE.Mesh(new THREE.PlaneGeometry(this.display.containerWidth * 6, this.display.containerHeight * 6, 1, 1), shadowplane);
			this.pane.receiveShadow = this.shadows;
			this.pane.position.set(0, 0, 1);
			this.scene.add(this.pane);
		}

		let selectordice = Object.keys(this.dicefactory.dice);
		this.camera.position.z = selectordice.length > 9 ? this.cameraHeight.far : this.cameraHeight.medium;
		let posxstart = selectordice.length > 9 ? -4 : -1.5;
		let posystart = selectordice.length > 9 ? 2 : 0.5;
		let poswrap = selectordice.length > 9 ? 4 : 2;
		this.applyColorsForRoll(config);
		for (let i = 0, posx = posxstart, posy = posystart; i < selectordice.length; ++i, ++posx) {

			if (posx > poswrap) {
				posx = posxstart;
				posy--;
			}

			let dicemesh = this.dicefactory.create(selectordice[i]);
			dicemesh.position.set(posx * step, posy * step, step * 0.5);
			dicemesh.castShadow = this.shadows;
			dicemesh.userData = selectordice[i];

			this.diceList.push(dicemesh);
			this.scene.add(dicemesh);
		}

		this.running = (new Date()).getTime();
		this.last_time = 0;
		if (this.selector.animate) {
			this.container.style.opacity = 0;
			this.animateSelector(this.running);
		}
		else this.renderer.render(this.scene, this.camera);
	}

	animateSelector(threadid) {
		this.animstate = 'selector';
		let time = (new Date()).getTime();
		let time_diff = (time - this.last_time) / 1000;
		if (time_diff > 3) time_diff = this.framerate;

		if (this.container.style.opacity != '1') this.container.style.opacity = Math.min(1, (parseFloat(this.container.style.opacity) + 0.05));

		if (this.selector.rotate) {
			let angle_change = 0.005 * Math.PI;
			for (let i=0;i<this.diceList.length;i++) {
				this.diceList[i].rotation.y += angle_change;
				this.diceList[i].rotation.x += angle_change / 4;
				this.diceList[i].rotation.z += angle_change / 10;
			}
		}

		this.last_time = time;
		this.renderer.render(this.scene, this.camera);
		if (this.running == threadid) {
			(function(animateCallback, tid, at) {
				if (!at && time_diff < this.framerate) {
					setTimeout(() => { requestAnimationFrame(() => { animateCallback.call(this, tid); }); }, (this.framerate - time_diff) * 1000);
				} else {
					requestAnimationFrame(() => { animateCallback.call(this, tid); });
				}
			}).bind(this)(this.animateSelector, threadid, this.adaptive_timestep);
		}
	}
}