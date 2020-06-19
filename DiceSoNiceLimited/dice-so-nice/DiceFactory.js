import {DicePreset} from './DicePreset.js';
import {DiceColors} from './DiceColors.js';
export class DiceFactory {

	constructor() {
		this.dice = {};
		this.geometries = {};

		this.baseScale = 50;

		this.systemForced = false;
		this.systemActivated = "standard";

		this.materials_cache = {};
		this.cache_hits = 0;
		this.cache_misses = 0;

		this.label_color = '';
		this.dice_color = '';
		this.label_outline = '';
		this.dice_texture = '';
		this.edge_color = '';
		this.bumpMapping = true;

		this.material_options = {
			specular: 0xffffff,
			color: 0xb5b5b5,
			shininess: 5,
			flatShading: true
		};

		this.canvas;

		// fixes texture rotations on specific dice models
		this.rotate = {
			d8: {even: -7.5, odd: -127.5},
			d12: {all: 5},
			d20: {all: -8.5},
		};

		this.systems = {
			'standard': {id: 'standard', name: game.i18n.localize("DICESONICE.System.Standard"), dice:[]},
			'dot': {id: 'dot', name: game.i18n.localize("DICESONICE.System.Dot"), dice:[]}
		};
		let diceobj;
		diceobj = new DicePreset('d4');
		diceobj.name = 'd4';
		diceobj.setLabels(['1','2','3','4']);
		diceobj.setValues(1,4);
		diceobj.inertia = 5;
		diceobj.scale = 1.2;
		this.register(diceobj);

		diceobj = new DicePreset('d6');
		diceobj.name = 'd6';
		diceobj.setLabels(['1', '2', '3', '4', '5', '6']);
		diceobj.setValues(1,6);
		diceobj.scale = 0.9;
		this.register(diceobj);

		diceobj = new DicePreset('d8');
		diceobj.name = 'd8';
		diceobj.setLabels(['1','2','3','4','5','6','7','8']);
		diceobj.setValues(1,8);
		this.register(diceobj);

		diceobj = new DicePreset('d10');
		diceobj.name = 'd10';
		diceobj.setLabels(['1','2','3','4','5','6','7','8','9','0']);
		diceobj.setValues(1,10);
		diceobj.mass = 350;
		diceobj.inertia = 9;
		diceobj.scale = 0.9;
		this.register(diceobj);

		diceobj = new DicePreset('d100', 'd10');
		diceobj.name = 'd100';
		diceobj.setLabels(['10', '20', '30', '40', '50', '60', '70', '80', '90', '00']);
		diceobj.setValues(10, 100, 10);
		diceobj.mass = 350;
		diceobj.inertia = 9;
		diceobj.scale = 0.9;
		this.register(diceobj);

		diceobj = new DicePreset('d12');
		diceobj.name = 'd12';
		diceobj.setLabels(['1','2','3','4','5','6','7','8','9','10','11','12']);
		diceobj.setValues(1,12);
		diceobj.mass = 350;
		diceobj.inertia = 8;
		diceobj.scale = 0.9;
		this.register(diceobj);

		diceobj = new DicePreset('d20');
		diceobj.name = 'd20';
		diceobj.setLabels(['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20']);
		diceobj.setValues(1,20);
		diceobj.mass = 400;
		diceobj.inertia = 6;
		this.register(diceobj);

		diceobj = new DicePreset('d6');
		diceobj.name = 'd6';
		diceobj.setLabels([
			'modules/dice-so-nice/textures/dot/d6-1.png',
			'modules/dice-so-nice/textures/dot/d6-2.png',
			'modules/dice-so-nice/textures/dot/d6-3.png',
			'modules/dice-so-nice/textures/dot/d6-4.png',
			'modules/dice-so-nice/textures/dot/d6-5.png',
			'modules/dice-so-nice/textures/dot/d6-6.png',
		]);
		diceobj.setBumpMaps([
			'modules/dice-so-nice/textures/dot/d6-1-b.png',
			'modules/dice-so-nice/textures/dot/d6-2-b.png',
			'modules/dice-so-nice/textures/dot/d6-3-b.png',
			'modules/dice-so-nice/textures/dot/d6-4-b.png',
			'modules/dice-so-nice/textures/dot/d6-5-b.png',
			'modules/dice-so-nice/textures/dot/d6-6-b.png',
		]);
		diceobj.setValues(1,6);
		diceobj.scale = 0.9;
		diceobj.system = "dot";
		this.register(diceobj);
	}

	setScale(scale){
		this.baseScale = scale;
		this.geometries = {};
		this.materials_cache = {};
	}

	setBumpMapping(bumpMapping){
		this.bumpMapping = bumpMapping;
	}

	register(diceobj) {
		if(diceobj.system == "standard")
			this.dice[diceobj.type] = diceobj;
		this.systems[diceobj.system].dice.push(diceobj);
	}

	//{id: 'standard', name: game.i18n.localize("DICESONICE.System.Standard")}
	addSystem(system){
		system.dice = [];
		this.systems[system.id] = system;
	}
	//{type:"",labels:[],system:""}
	addDicePreset(dice){
		let model = this.systems["standard"].dice.find(el => el.type == dice.type);
		let preset = new DicePreset(dice.type, model.shape);
		preset.name = dice.type;
		preset.setLabels(dice.labels);
		preset.values = model.values;
		preset.valueMap = model.valueMap;
		preset.mass = model.mass;
		preset.scale = model.scale;
		preset.inertia = model.inertia;
		preset.system = dice.system;
		preset.font = dice.font || 'Arial';
		if(dice.bumpMaps && dice.bumpMaps.length)
			preset.setBumpMaps(dice.bumpMaps);
		this.register(preset);
		if(this.systemActivated == dice.system)
			this.setSystem(dice.system);
	}

	setSystem(systemId, force=false){
		if(this.systemForced && systemId != this.systemActivated)
			return;
		//first we reset to standard
		let dices = this.systems["standard"].dice;
		for(let i=0;i<dices.length;i++)
			this.dice[dices[i].type] = dices[i];
		//Then we apply override
		if(systemId!= "standard" && this.systems.hasOwnProperty(systemId))
		{
			dices = this.systems[systemId].dice;
			for(let i=0;i<dices.length;i++)
				this.dice[dices[i].type] = dices[i];
		}
		if(force)
			this.systemForced = true;
		this.systemActivated = systemId;
	}

	// returns a dicemesh (THREE.Mesh) object
	create(type) {
		let diceobj = this.dice[type];
		if (!diceobj) return null;

		let geom = this.geometries[type];
		if(!geom) {
			geom = this.createGeometry(diceobj.shape, diceobj.scale * this.baseScale);
			this.geometries[type] = geom;
		}
		if (!geom) return null;

		if (diceobj.colorset) {
			this.setMaterialInfo(diceobj.colorset);
		} else {
			this.setMaterialInfo();
		}

		let dicemesh = new THREE.Mesh(geom, this.createMaterials(diceobj, this.baseScale / 2, 1.0));
		dicemesh.result = [];
		dicemesh.shape = diceobj.shape;
		dicemesh.rerolls = 0;
		dicemesh.resultReason = 'natural';

		let factory = this;
		dicemesh.getFaceValue = function() {
			let reason = this.resultReason;
			let vector = new THREE.Vector3(0, 0, this.shape == 'd4' ? -1 : 1);

			let closest_face, closest_angle = Math.PI * 2;
			for (let i = 0, l = this.geometry.faces.length; i < l; ++i) {
				let face = this.geometry.faces[i];
				if (face.materialIndex == 0) continue;
				let angle = face.normal.clone().applyQuaternion(this.body_sim.quaternion).angleTo(vector);
				if (angle < closest_angle) {
					closest_angle = angle;
					closest_face = face;
				}
			}
			let matindex = closest_face.materialIndex - 1;

			const diceobj = factory.dice[this.notation.type];

			if (this.shape == 'd4') {
				return {value: matindex, label: diceobj.labels[matindex-1], reason: reason};
			}
			if (this.shape == 'd10') matindex += 1;

			let value = diceobj.values[((matindex-1) % diceobj.values.length)];
			let label = diceobj.labels[(((matindex-1) % (diceobj.labels.length-2))+2)];

			return {value: value, label: label, reason: reason};
		};

		dicemesh.storeRolledValue = function() {
			this.result.push(this.getFaceValue());
		};

		dicemesh.getLastValue = function() {
			if (!this.result || this.result.length < 1) return {value: undefined, label: '', reason: ''};

			return this.result[this.result.length-1];
		};

		dicemesh.setLastValue = function(result) {
			if (!this.result || this.result.length < 1) return;
			if (!result || result.length < 1) return;

			return this.result[this.result.length-1] = result;
		};

		if (diceobj.color) {
			dicemesh.material[0].color = new THREE.Color(diceobj.color);
			dicemesh.material[0].emissive = new THREE.Color(diceobj.color);
			dicemesh.material[0].emissiveIntensity = 1;
			dicemesh.material[0].needsUpdate = true;
		}

		switch (type) {
			case 'd1':
				return this.fixmaterials(dicemesh, 1);
			case 'd2':
				return this.fixmaterials(dicemesh, 2);
			case 'd3': case 'df': case 'dset': 
				return this.fixmaterials(dicemesh, 3);
			default:
				return dicemesh;
		}
	}

	get(type) {
		return this.dice[type];
	}

	getGeometry(type) {
		return this.geometries[type];
	}

	createMaterials(diceobj, size, margin, allowcache = true, d4specialindex = 0) {

		let materials = [];
		let labels = diceobj.labels;
		if (diceobj.shape == 'd4') {
			labels = diceobj.labels[d4specialindex];
			size = this.baseScale / 2;
			margin = this.baseScale * 2;
		}
		
		for (var i = 0; i < labels.length; ++i) {
			var mat = new THREE.MeshPhongMaterial(this.material_options);
			let canvasTextures;
			if(i==0)//edge
			{
				//if the texture is fully opaque, we do not use it for edge
				let texture = {name:"none"};
				if(this.dice_texture_rand.composite != "source-over")
					texture = this.dice_texture_rand;
				canvasTextures = this.createTextMaterial(diceobj, labels, i, size, margin, texture, this.label_color_rand, this.label_outline_rand, this.edge_color_rand, allowcache);
				mat.map = canvasTextures.composite;
			}
			else
			{
				canvasTextures = this.createTextMaterial(diceobj, labels, i, size, margin, this.dice_texture_rand, this.label_color_rand, this.label_outline_rand, this.dice_color_rand, allowcache);
				mat.map = canvasTextures.composite;
				if(this.bumpMapping)
				{
					if(canvasTextures.bump)
						mat.bumpMap = canvasTextures.bump;
					if(diceobj.shape != 'd4' && diceobj.normals[i]){
						mat.bumpMap = new THREE.Texture(diceobj.normals[i]);
						mat.bumpScale = 1;
						mat.bumpMap.needsUpdate = true;
					}
				}
			}
			mat.opacity = 1;
			mat.transparent = true;
			mat.depthTest = false;
			mat.needUpdate = true;
			materials.push(mat);
		}
		//Edge mat

		return materials;
	}

	createTextMaterial(diceobj, labels, index, size, margin, texture, forecolor, outlinecolor, backcolor, allowcache) {
		if (labels[index] === undefined) return null;

        texture = texture || this.dice_texture_rand;
        forecolor = forecolor || this.label_color_rand;
        outlinecolor = outlinecolor || this.label_outline_rand;
        backcolor = backcolor || this.dice_color_rand;
        allowcache = allowcache == undefined ? true : allowcache;
		
		let text = labels[index];
		let isTexture = false;

		// an attempt at materials caching
		let cachestring = diceobj.type + text + index + texture.name + forecolor + outlinecolor + backcolor;
		if (diceobj.shape == 'd4') {
			cachestring = diceobj.type + text.join() + texture.name + forecolor + outlinecolor + backcolor;
		}
		if (allowcache && this.materials_cache[cachestring] != null) {
			this.cache_hits++;
			return this.materials_cache[cachestring];
		}

		let canvas = document.createElement("canvas");
		let context = canvas.getContext("2d", {alpha: true});
		context.globalAlpha = 0;

		context.clearRect(0, 0, canvas.width, canvas.height);

		let canvasBump = document.createElement("canvas");
		let contextBump = canvasBump.getContext("2d", {alpha: true});
		contextBump.globalAlpha = 0;

		contextBump.clearRect(0, 0, canvasBump.width, canvasBump.height);

		let ts;

		if (diceobj.shape == 'd4') {
			ts = this.calc_texture_size(size + margin) * 2;
		} else {
			ts = this.calc_texture_size(size + size * 2 * margin) * 2;
		}

		canvas.width = canvas.height = ts;
		canvasBump.width = canvasBump.height = ts;

		// create color
		context.fillStyle = backcolor;
		context.fillRect(0, 0, canvas.width, canvas.height);

		contextBump.fillStyle = "#FFFFFF";
		contextBump.fillRect(0, 0, canvasBump.width, canvasBump.height);

		//create underlying texture
		if (texture.name != '' && texture.name != 'none') {
			context.globalCompositeOperation = texture.composite || 'source-over';
			context.drawImage(texture.texture, 0, 0, canvas.width, canvas.height);
			context.globalCompositeOperation = 'source-over';
		} else {
			context.globalCompositeOperation = 'source-over';
		}
		

		// create text
		context.globalCompositeOperation = 'source-over';
		context.textAlign = "center";
		context.textBaseline = "middle";

		contextBump.textAlign = "center";
		contextBump.textBaseline = "middle";
		
		if (diceobj.shape != 'd4') {
			
			// fix for some faces being weirdly rotated
			let rotateface = this.rotate[diceobj.shape];
			if(rotateface) {
				let degrees = rotateface.hasOwnProperty("all") ? rotateface.all:false || (index > 0 && (index % 2) != 0) ? rotateface.odd : rotateface.even;

				if (degrees && degrees != 0) {

					var hw = (canvas.width / 2);
					var hh = (canvas.height / 2);

					context.translate(hw, hh);
					context.rotate(degrees * (Math.PI / 180));
					context.translate(-hw, -hh);

					contextBump.translate(hw, hh);
					contextBump.rotate(degrees * (Math.PI / 180));
					contextBump.translate(-hw, -hh);
				}
			}

			//custom texture face
			if(text instanceof HTMLImageElement){
				isTexture = true;
				context.drawImage(text, 0,0,text.width,text.height,0,0,canvas.width,canvas.height);
			}
			else{
				let fontsize = ts / (1 + 2 * margin);
				let textstarty = (canvas.height / 2);
				let textstartx = (canvas.width / 2);
				if(diceobj.shape == 'd10')
				{
					fontsize = fontsize*0.75;
					textstarty = textstarty*1.15;
				}
				else if(diceobj.shape == 'd6')
				{
					textstarty = textstarty*1.1;
				}
				else if(diceobj.shape == 'd20')
				{
					textstartx = textstartx*0.98;
				}
				context.font =  fontsize+ 'pt '+diceobj.font;
				contextBump.font =  fontsize+ 'pt '+diceobj.font;
				var lineHeight = context.measureText("M").width * 1.4;
				let textlines = text.split("\n");

				if (textlines.length > 1) {
					fontsize = fontsize / textlines.length;
					context.font =  fontsize+ 'pt '+diceobj.font;
					contextBump.font =  fontsize+ 'pt '+diceobj.font;
					lineHeight = context.measureText("M").width * 1.2;
					textstarty -= (lineHeight * textlines.length) / 2;
				}

				for(let i = 0, l = textlines.length; i < l; i++){
					let textline = textlines[i].trim();

					// attempt to outline the text with a meaningful color
					if (outlinecolor != 'none') {
						context.strokeStyle = outlinecolor;
						context.lineWidth = 5;
						context.strokeText(textlines[i], textstartx, textstarty);

						contextBump.strokeStyle = "#000000";
						contextBump.lineWidth = 5;
						contextBump.strokeText(textlines[i], textstartx, textstarty);
						if (textline == '6' || textline == '9') {
							context.strokeText('  .', textstartx, textstarty);
							contextBump.strokeText('  .', textstartx, textstarty);
						}
					}

					context.fillStyle = forecolor;
					context.fillText(textlines[i], textstartx, textstarty);

					contextBump.fillStyle = "#000000";
					contextBump.fillText(textlines[i], textstartx, textstarty);
					if (textline == '6' || textline == '9') {
						context.fillText('  .', textstartx, textstarty);
						contextBump.fillText('  .', textstartx, textstarty);
					}
					textstarty += (lineHeight * 1.5);
				}
			}

		} else {

			var hw = (canvas.width / 2);
			var hh = (canvas.height / 2);

			context.font =  (ts / 128 * 24)+'pt '+diceobj.font;
			contextBump.font =  (ts / 128 * 24)+'pt '+diceobj.font;

			//draw the numbers
			for (let i=0;i<text.length;i++) {
				//custom texture face
				if(text[i] instanceof HTMLImageElement){
					isTexture = true;
					let scaleTexture = text[i].width / canvas.width;
					context.drawImage(text[i], 0,0,text[i].width,text[i].height,100/scaleTexture,25/scaleTexture,60/scaleTexture,60/scaleTexture);
				}
				else{
					// attempt to outline the text with a meaningful color
					if (outlinecolor != 'none') {
						context.strokeStyle = outlinecolor;
						
						context.lineWidth = 5;
						context.strokeText(text[i], hw, hh - ts * 0.3);

						contextBump.strokeStyle = "#000000";
						contextBump.lineWidth = 5;
						contextBump.strokeText(text[i], hw, hh - ts * 0.3);
					}

					//draw label in top middle section
					context.fillStyle = forecolor;
					context.fillText(text[i], hw, hh - ts * 0.3);

					contextBump.fillStyle = "#000000";
					contextBump.fillText(text[i], hw, hh - ts * 0.3);
				}

				//rotate 1/3 for next label
				context.translate(hw, hh);
				context.rotate(Math.PI * 2 / 3);
				context.translate(-hw, -hh);

				contextBump.translate(hw, hh);
				contextBump.rotate(Math.PI * 2 / 3);
				contextBump.translate(-hw, -hh);
			}
		}

		var compositetexture = new THREE.CanvasTexture(canvas);
		var bumpMap;
		if(!isTexture)
			bumpMap = new THREE.CanvasTexture(canvasBump);
		else
			bumpMap = null;
		if (allowcache) {
			// cache new texture
			this.cache_misses++;
			this.materials_cache[cachestring] = {composite:compositetexture,bump:bumpMap};
		}

		return {composite:compositetexture,bump:bumpMap};
	}

	applyColorSet(colordata) {
		this.colordata = colordata;
		this.label_color = colordata.foreground;
		this.dice_color = colordata.background;
		this.label_outline = colordata.outline;
		this.dice_texture = colordata.texture;
		this.edge_color = colordata.hasOwnProperty("edge") ? colordata.edge:colordata.background;
	}

	applyTexture(texture) {
		this.dice_texture = texture;
	}

	setMaterialInfo(colorset = '') {

		let prevcolordata = this.colordata;

		if (colorset) {
			let colordata = DiceColors.getColorSet(colorset);

			if (this.colordata.id != colordata.id) {
				this.applyColorSet(colordata);
			}
		}

		//reset random choices
		this.dice_color_rand = '';
		this.label_color_rand = '';
		this.label_outline_rand = '';
		this.dice_texture_rand = '';
		this.edge_color_rand = '';

		// set base color first
		if (Array.isArray(this.dice_color)) {

			var colorindex = Math.floor(Math.random() * this.dice_color.length);

			// if color list and label list are same length, treat them as a parallel list
			if (Array.isArray(this.label_color) && this.label_color.length == this.dice_color.length) {
				this.label_color_rand = this.label_color[colorindex];

				// if label list and outline list are same length, treat them as a parallel list
				if (Array.isArray(this.label_outline) && this.label_outline.length == this.label_color.length) {
					this.label_outline_rand = this.label_outline[colorindex];
				}
			}
			// if texture list is same length do the same
			if (Array.isArray(this.dice_texture) && this.dice_texture.length == this.dice_color.length) {
				this.dice_texture_rand = this.dice_texture[colorindex];
			}

			//if edge list and color list are same length, treat them as a parallel list
			if (Array.isArray(this.edge_color) && this.edge_color.length == this.dice_color.length) {
				this.edge_color_rand = this.edge_color[colorindex];
			}

			this.dice_color_rand = this.dice_color[colorindex];
		} else {
			this.dice_color_rand = this.dice_color;
		}

		// set edge color if not set
		if(this.edge_color_rand == ''){
			if (Array.isArray(this.edge_color)) {

				var colorindex = Math.floor(Math.random() * this.edge_color.length);

				this.edge_color_rand = this.edge_color[colorindex];
			} else {
				this.edge_color_rand = this.edge_color;
			}
		}

		// if selected label color is still not set, pick one
		if (this.label_color_rand == '' && Array.isArray(this.label_color)) {
			var colorindex = this.label_color[Math.floor(Math.random() * this.label_color.length)];

			// if label list and outline list are same length, treat them as a parallel list
			if (Array.isArray(this.label_outline) && this.label_outline.length == this.label_color.length) {
				this.label_outline_rand = this.label_outline[colorindex];
			}

			this.label_color_rand = this.label_color[colorindex];

		} else if (this.label_color_rand == '') {
			this.label_color_rand = this.label_color;
		}

		// if selected label outline is still not set, pick one
		if (this.label_outline_rand == '' && Array.isArray(this.label_outline)) {
			var colorindex = this.label_outline[Math.floor(Math.random() * this.label_outline.length)];

			this.label_outline_rand = this.label_outline[colorindex];
			
		} else if (this.label_outline_rand == '') {
			this.label_outline_rand = this.label_outline;
		}

		// same for textures list
		if (this.dice_texture_rand == '' && Array.isArray(this.dice_texture)) {
			this.dice_texture_rand = this.dice_texture[Math.floor(Math.random() * this.dice_texture.length)];
		} else if (this.dice_texture_rand == '') {
			this.dice_texture_rand = this.dice_texture;
		}

		if (this.colordata.id != prevcolordata.id) {
			this.applyColorSet(prevcolordata);
		}
	}

	calc_texture_size(approx) {
		return Math.pow(2, Math.floor(Math.log(approx) / Math.log(2)));
	}

	createGeometry(type, radius) {
		switch (type) {
			case 'd4':
				return this.create_d4_geometry(radius);
			case 'd6':
				return this.create_d6_geometry(radius);
			case 'd8':
				return this.create_d8_geometry(radius);
			case 'd10':
				return this.create_d10_geometry(radius);
			case 'd12':
				return this.create_d12_geometry(radius);
			case 'd20':
				return this.create_d20_geometry(radius);
			default:
				return null;
		}
	}

	create_d4_geometry(radius) {
		var vertices = [[1, 1, 1], [-1, -1, 1], [-1, 1, -1], [1, -1, -1]];
		var faces = [[1, 0, 2, 1], [0, 1, 3, 2], [0, 3, 2, 3], [1, 2, 3, 4]];
		return this.create_geom(vertices, faces, radius, -0.1, Math.PI * 7 / 6, 0.96);
	}

	create_d6_geometry(radius) {
		var vertices = [[-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
				[-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]];
		var faces = [[0, 3, 2, 1, 1], [1, 2, 6, 5, 2], [0, 1, 5, 4, 3],
				[3, 7, 6, 2, 4], [0, 4, 7, 3, 5], [4, 5, 6, 7, 6]];
		return this.create_geom(vertices, faces, radius, 0.1, Math.PI / 4, 0.96);
	}

	create_d8_geometry(radius) {
		var vertices = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];
		var faces = [[0, 2, 4, 1], [0, 4, 3, 2], [0, 3, 5, 3], [0, 5, 2, 4], [1, 3, 4, 5],
				[1, 4, 2, 6], [1, 2, 5, 7], [1, 5, 3, 8]];
		return this.create_geom(vertices, faces, radius, 0, -Math.PI / 4 / 2, 0.965);
	}

	create_d10_geometry(radius) {
		var a = Math.PI * 2 / 10, h = 0.105, v = -1;
		var vertices = [];
		for (var i = 0, b = 0; i < 10; ++i, b += a) {
			vertices.push([Math.cos(b), Math.sin(b), h * (i % 2 ? 1 : -1)]);
		}
		vertices.push([0, 0, -1]);
		vertices.push([0, 0, 1]);

		var faces = [
            [5, 6, 7, 11, 0],
            [4, 3, 2, 10, 1],
            [1, 2, 3, 11, 2],
            [0, 9, 8, 10, 3],
            [7, 8, 9, 11, 4],
            [8, 7, 6, 10, 5],
            [9, 0, 1, 11, 6],
            [2, 1, 0, 10, 7],
            [3, 4, 5, 11, 8],
            [6, 5, 4, 10, 9]
        ];
        return this.create_geom(vertices, faces, radius, 0.3, Math.PI, 0.945);
	}

	create_d12_geometry(radius) {
		var p = (1 + Math.sqrt(5)) / 2, q = 1 / p;
		var vertices = [[0, q, p], [0, q, -p], [0, -q, p], [0, -q, -p], [p, 0, q],
				[p, 0, -q], [-p, 0, q], [-p, 0, -q], [q, p, 0], [q, -p, 0], [-q, p, 0],
				[-q, -p, 0], [1, 1, 1], [1, 1, -1], [1, -1, 1], [1, -1, -1], [-1, 1, 1],
				[-1, 1, -1], [-1, -1, 1], [-1, -1, -1]];
		var faces = [[2, 14, 4, 12, 0, 1], [15, 9, 11, 19, 3, 2], [16, 10, 17, 7, 6, 3], [6, 7, 19, 11, 18, 4],
				[6, 18, 2, 0, 16, 5], [18, 11, 9, 14, 2, 6], [1, 17, 10, 8, 13, 7], [1, 13, 5, 15, 3, 8],
				[13, 8, 12, 4, 5, 9], [5, 4, 14, 9, 15, 10], [0, 12, 8, 10, 16, 11], [3, 19, 7, 17, 1, 12]];
		return this.create_geom(vertices, faces, radius, 0.2, -Math.PI / 4 / 2, 0.968);
	}

	create_d20_geometry(radius) {
		var t = (1 + Math.sqrt(5)) / 2;
		var vertices = [[-1, t, 0], [1, t, 0 ], [-1, -t, 0], [1, -t, 0],
				[0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t],
				[t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]];
		var faces = [[0, 11, 5, 1], [0, 5, 1, 2], [0, 1, 7, 3], [0, 7, 10, 4], [0, 10, 11, 5],
				[1, 5, 9, 6], [5, 11, 4, 7], [11, 10, 2, 8], [10, 7, 6, 9], [7, 1, 8, 10],
				[3, 9, 4, 11], [3, 4, 2, 12], [3, 2, 6, 13], [3, 6, 8, 14], [3, 8, 9, 15],
				[4, 9, 5, 16], [2, 4, 11, 17], [6, 2, 10, 18], [8, 6, 7, 19], [9, 8, 1, 20]];
		return this.create_geom(vertices, faces, radius, -0.2, -Math.PI / 4 / 2, 0.955);
	}

	fixmaterials(mesh, unique_sides) {
		// this makes the mesh reuse textures for other sides
		for (let i = 0, l = mesh.geometry.faces.length; i < l; ++i) {
			var matindex = mesh.geometry.faces[i].materialIndex - 2;
			if (matindex < unique_sides) continue;

			let modmatindex = (matindex % unique_sides);

			mesh.geometry.faces[i].materialIndex = modmatindex + 2;
		}
		mesh.geometry.elementsNeedUpdate = true;
		return mesh;
	}

	create_shape(vertices, faces, radius) {
		var cv = new Array(vertices.length), cf = new Array(faces.length);
		for (var i = 0; i < vertices.length; ++i) {
			var v = vertices[i];
			cv[i] = new CANNON.Vec3(v.x * radius, v.y * radius, v.z * radius);
		}
		for (var i = 0; i < faces.length; ++i) {
			cf[i] = faces[i].slice(0, faces[i].length - 1);
		}
		return new CANNON.ConvexPolyhedron(cv, cf);
	}

	make_geom(vertices, faces, radius, tab, af) {
		var geom = new THREE.Geometry();
		for (var i = 0; i < vertices.length; ++i) {
			var vertex = vertices[i].multiplyScalar(radius);
			vertex.index = geom.vertices.push(vertex) - 1;
		}
		for (var i = 0; i < faces.length; ++i) {
			var ii = faces[i], fl = ii.length - 1;
			var aa = Math.PI * 2 / fl;
			for (var j = 0; j < fl - 2; ++j) {
				geom.faces.push(new THREE.Face3(ii[0], ii[j + 1], ii[j + 2], [geom.vertices[ii[0]],
							geom.vertices[ii[j + 1]], geom.vertices[ii[j + 2]]], 0, ii[fl] + 1));
				geom.faceVertexUvs[0].push([
						new THREE.Vector2((Math.cos(af) + 1 + tab) / 2 / (1 + tab),
							(Math.sin(af) + 1 + tab) / 2 / (1 + tab)),
						new THREE.Vector2((Math.cos(aa * (j + 1) + af) + 1 + tab) / 2 / (1 + tab),
							(Math.sin(aa * (j + 1) + af) + 1 + tab) / 2 / (1 + tab)),
						new THREE.Vector2((Math.cos(aa * (j + 2) + af) + 1 + tab) / 2 / (1 + tab),
							(Math.sin(aa * (j + 2) + af) + 1 + tab) / 2 / (1 + tab))]);
			}
		}
		geom.computeFaceNormals();
		geom.boundingSphere = new THREE.Sphere(new THREE.Vector3(), radius);
		return geom;
	}

	make_d10_geom(vertices, faces, radius, tab, af) {
        var geom = new THREE.Geometry();
        for (var i = 0; i < vertices.length; ++i) {
            var vertex = vertices[i].multiplyScalar(radius);
            vertex.index = geom.vertices.push(vertex) - 1;
        }
        for (var i = 0; i < faces.length; ++i) {
            var ii = faces[i], fl = ii.length - 1;
            var aa = Math.PI * 2 / fl;
            var w = 0.65;
            var h = 0.85;
            var v0 = 1 - 1*h;
            var v1 = 1 - (0.895/1.105)*h;
            var v2 = 1;
            for (var j = 0; j < fl - 2; ++j) {
                geom.faces.push(new THREE.Face3(ii[0], ii[j + 1], ii[j + 2], [geom.vertices[ii[0]],
                            geom.vertices[ii[j + 1]], geom.vertices[ii[j + 2]]], 0, ii[fl] + 1));
                if(faces[i][faces[i].length-1] == -1 || j >= 2){
                    geom.faceVertexUvs[0].push([
                        new THREE.Vector2((Math.cos(af) + 1 + tab) / 2 / (1 + tab),
                            (Math.sin(af) + 1 + tab) / 2 / (1 + tab)),
                        new THREE.Vector2((Math.cos(aa * (j + 1) + af) + 1 + tab) / 2 / (1 + tab),
                            (Math.sin(aa * (j + 1) + af) + 1 + tab) / 2 / (1 + tab)),
                        new THREE.Vector2((Math.cos(aa * (j + 2) + af) + 1 + tab) / 2 / (1 + tab),
                            (Math.sin(aa * (j + 2) + af) + 1 + tab) / 2 / (1 + tab))]);
                } else if(j==0) {
                    geom.faceVertexUvs[0].push([
                        new THREE.Vector2(0.5-w/2, v1),
                        new THREE.Vector2(0.5, v0),
                        new THREE.Vector2(0.5+w/2, v1)
                    ]);
                } else if(j==1) {
                    geom.faceVertexUvs[0].push([
                        new THREE.Vector2(0.5-w/2, v1),
                        new THREE.Vector2(0.5+w/2, v1),
                        new THREE.Vector2(0.5, v2)
                    ]);
                }
            }
        }
        geom.computeFaceNormals();
        geom.boundingSphere = new THREE.Sphere(new THREE.Vector3(), radius);
        return geom;
    }

	chamfer_geom(vectors, faces, chamfer) {
		var chamfer_vectors = [], chamfer_faces = [], corner_faces = new Array(vectors.length);
		for (var i = 0; i < vectors.length; ++i) corner_faces[i] = [];
		for (var i = 0; i < faces.length; ++i) {
			var ii = faces[i], fl = ii.length - 1;
			var center_point = new THREE.Vector3();
			var face = new Array(fl);
			for (var j = 0; j < fl; ++j) {
				var vv = vectors[ii[j]].clone();
				center_point.add(vv);
				corner_faces[ii[j]].push(face[j] = chamfer_vectors.push(vv) - 1);
			}
			center_point.divideScalar(fl);
			for (var j = 0; j < fl; ++j) {
				var vv = chamfer_vectors[face[j]];
				vv.subVectors(vv, center_point).multiplyScalar(chamfer).addVectors(vv, center_point);
			}
			face.push(ii[fl]);
			chamfer_faces.push(face);
		}
		for (var i = 0; i < faces.length - 1; ++i) {
			for (var j = i + 1; j < faces.length; ++j) {
				var pairs = [], lastm = -1;
				for (var m = 0; m < faces[i].length - 1; ++m) {
					var n = faces[j].indexOf(faces[i][m]);
					if (n >= 0 && n < faces[j].length - 1) {
						if (lastm >= 0 && m != lastm + 1) pairs.unshift([i, m], [j, n]);
						else pairs.push([i, m], [j, n]);
						lastm = m;
					}
				}
				if (pairs.length != 4) continue;
				chamfer_faces.push([chamfer_faces[pairs[0][0]][pairs[0][1]],
						chamfer_faces[pairs[1][0]][pairs[1][1]],
						chamfer_faces[pairs[3][0]][pairs[3][1]],
						chamfer_faces[pairs[2][0]][pairs[2][1]], -1]);
			}
		}
		for (var i = 0; i < corner_faces.length; ++i) {
			var cf = corner_faces[i], face = [cf[0]], count = cf.length - 1;
			while (count) {
				for (var m = faces.length; m < chamfer_faces.length; ++m) {
					var index = chamfer_faces[m].indexOf(face[face.length - 1]);
					if (index >= 0 && index < 4) {
						if (--index == -1) index = 3;
						var next_vertex = chamfer_faces[m][index];
						if (cf.indexOf(next_vertex) >= 0) {
							face.push(next_vertex);
							break;
						}
					}
				}
				--count;
			}
			face.push(-1);
			chamfer_faces.push(face);
		}
		return { vectors: chamfer_vectors, faces: chamfer_faces };
	}

	create_geom(vertices, faces, radius, tab, af, chamfer) {
		var vectors = new Array(vertices.length);
		for (var i = 0; i < vertices.length; ++i) {
			vectors[i] = (new THREE.Vector3).fromArray(vertices[i]).normalize();
		}
		var cg = this.chamfer_geom(vectors, faces, chamfer);
		if(faces.length != 10)
			var geom = this.make_geom(cg.vectors, cg.faces, radius, tab, af);
		else
			var geom = this.make_d10_geom(cg.vectors, cg.faces, radius, tab, af);
		//var geom = make_geom(vectors, faces, radius, tab, af); // Without chamfer
		geom.cannon_shape = this.create_shape(vectors, faces, radius);
		return geom;
	}
}