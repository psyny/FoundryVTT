export const TEXTURELIST = {
	'cloudy': {
		name: 'DICESONICE.TextureClouds',
		composite: 'destination-in',
		source: 'modules/dice-so-nice/textures/cloudy.png'
	},
	'fire': {
		name: 'DICESONICE.TextureFire',
		composite: 'multiply',
		source: 'modules/dice-so-nice/textures/fire.png'
	},
	'marble': {
		name: 'DICESONICE.TextureMarble',
		composite: 'multiply',
		source: 'modules/dice-so-nice/textures/marble.png'
	},
	'water': {
		name: 'DICESONICE.TextureWater',
		composite: 'destination-in',
		source: 'modules/dice-so-nice/textures/water.png'
	},
	'ice': {
		name: 'DICESONICE.TextureIce',
		composite: 'destination-in',
		source: 'modules/dice-so-nice/textures/ice.png'
	},
	'paper': {
		name: 'DICESONICE.TexturePaper',
		composite: 'multiply',
		source: 'modules/dice-so-nice/textures/paper.png'
	},
	'speckles': {
		name: 'DICESONICE.TextureSpeckles',
		composite: 'multiply',
		source: 'modules/dice-so-nice/textures/speckles.png'
	},
	'glitter': {
		name: 'DICESONICE.TextureGlitter',
		composite: 'multiply',
		source: 'modules/dice-so-nice/textures/glitter.png'
	},
	'glitter_2': {
		name: 'DICESONICE.TextureGlitterTransparent',
		composite: 'destination-in',
		source: 'modules/dice-so-nice/textures/glitter-alpha.png'
	},
	'stars': {
		name: 'DICESONICE.TextureStars',
		composite: 'multiply',
		source: 'modules/dice-so-nice/textures/stars.png'
	},
	'stainedglass': {
		name: 'DICESONICE.TextureStainedGlass',
		composite: 'multiply',
		source: 'modules/dice-so-nice/textures/stainedglass.png'
	},
	'skulls': {
		name: 'DICESONICE.TextureSkulls',
		composite: 'multiply',
		source: 'modules/dice-so-nice/textures/skulls.png'
	},
	'leopard': {
		name: 'DICESONICE.TextureLeopard',
		composite: 'multiply',
		source: 'modules/dice-so-nice/textures/leopard.png'
	},
	'tiger': {
		name: 'DICESONICE.TextureTiger',
		composite: 'multiply',
		source: 'modules/dice-so-nice/textures/tiger.png'
	},
	'cheetah': {
		name: 'DICESONICE.TextureCheetah',
		composite: 'multiply',
		source: 'modules/dice-so-nice/textures/cheetah.png'
	},
	'astral': {
		name: 'DICESONICE.TextureAstralSea',
		composite: 'multiply',
		source: 'modules/dice-so-nice/textures/astral.png'
	},
	'wood': {
		name: 'DICESONICE.TextureWood',
		composite: 'multiply',
		source: 'modules/dice-so-nice/textures/wood.png'
	},
	'metal': {
		name: 'DICESONICE.TextureMetal',
		composite: 'multiply',
		source: 'modules/dice-so-nice/textures/metal.png'
	},
	'radial': {
		name: 'DICESONICE.TextureRadial',
		composite: 'source-over',
		source: 'modules/dice-so-nice/textures/radial.png'
	},
	'none': {
		name: 'DICESONICE.TextureNone',
		composite: 'source-over',
		source: ''
	}
};

export const COLORSETS = {
	'radiant': {
		name: 'radiant',
		description: 'DICESONICE.ColorRadiant',
		category: 'DICESONICE.DamageTypes',
		foreground: '#F9B333',
		background: '#FFFFFF',
		outline: '',
		texture: 'paper'
	},
	'fire': {
		name: 'fire',
		description: 'DICESONICE.ColorFire',
		category: 'DICESONICE.DamageTypes',
		foreground: '#f8d84f',
		background: ['#f8d84f','#f9b02d','#f43c04','#910200','#4c1009'],
		outline: 'black',
		texture: 'fire'
	},
	'ice': {
		name: 'ice',
		description: 'DICESONICE.ColorIce',
		category: 'DICESONICE.DamageTypes',
		foreground: '#60E9FF',
		background: ['#214fa3','#3c6ac1','#253f70','#0b56e2','#09317a'],
		outline: 'black',
		texture: 'ice'
	},
	'poison': {
		name: 'poison',
		description: 'DICESONICE.ColorPoison',
		category: 'DICESONICE.DamageTypes',
		foreground: '#D6A8FF',
		background: ['#313866','#504099','#66409e','#934fc3','#c949fc'],
		outline: 'black',
		texture: 'cloudy'
	},
	'acid': {
		name: 'acid',
		description: 'DICESONICE.ColorAcid',
		category: 'DICESONICE.DamageTypes',
		foreground: '#A9FF70',
		background: ['#a6ff00', '#83b625','#5ace04','#69f006','#b0f006','#93bc25'],
		outline: 'black',
		texture: 'marble'
	},
	'thunder': {
		name: 'thunder',
		description: 'DICESONICE.ColorThunder',
		category: 'DICESONICE.DamageTypes',
		foreground: '#FFC500',
		background: '#7D7D7D',
		outline: 'black',
		texture: 'cloudy'
	},
	'lightning': {
		name: 'lightning',
		description: 'DICESONICE.ColorLightning',
		category: 'DICESONICE.DamageTypes',
		foreground: '#FFC500',
		background: ['#f17105', '#f3ca40','#eddea4','#df9a57','#dea54b'],
		outline: '#7D7D7D',
		texture: 'ice'
	},
	'air': {
		name: 'air',
		description: 'DICESONICE.ColorAir',
		category: 'DICESONICE.DamageTypes',
		foreground: '#ffffff',
		background: ['#d0e5ea', '#c3dee5','#a4ccd6','#8dafb7','#80a4ad'],
		outline: 'black',
		texture: 'cloudy'
	},
	'water': {
		name: 'water',
		description: 'DICESONICE.ColorWater',
		category: 'DICESONICE.DamageTypes',
		foreground: '#60E9FF',
		background: ['#87b8c4', '#77a6b2','#6b98a3','#5b8691','#4b757f'],
		outline: 'black',
		texture: 'water'
	},
	'earth': {
		name: 'earth',
		description: 'DICESONICE.ColorEarth',
		category: 'DICESONICE.DamageTypes',
		foreground: '#6C9943',
		background: ['#346804', '#184200','#527f22', '#3a1d04', '#56341a','#331c17','#5a352a','#302210'],
		outline: 'black',
		texture: 'speckles'
	},
	'force': {
		name: 'force',
		description: 'DICESONICE.ColorForce',
		category: 'DICESONICE.DamageTypes',
		foreground: 'white',
		background: ['#FF97FF', '#FF68FF','#C651C6'],
		outline: '#570000',
		texture: 'stars'
	},
	'psychic': {
		name: 'psychic',
		description: 'DICESONICE.ColorPsychic',
		category: 'DICESONICE.DamageTypes',
		foreground: '#D6A8FF',
		background: ['#313866','#504099','#66409E','#934FC3','#C949FC','#313866'],
		outline: 'black',
		texture: 'speckles'
	},
	'necrotic': {
		name: 'necrotic',
		description: 'DICESONICE.ColorNecrotic',
		category: 'DICESONICE.DamageTypes',
		foreground: '#ffffff',
		background: '#6F0000',
		outline: 'black',
		texture: 'skulls'
	},
	'breebaby': {
		name: 'breebaby',
		description: 'DICESONICE.ColorPastelSunset',
		category: 'DICESONICE.ThemesSoNice',
		foreground: ['#5E175E', '#564A5E','#45455E','#3D5A5E','#1E595E','#5E3F3D','#5E1E29','#283C5E','#25295E'],
		background: ['#FE89CF', '#DFD4F2','#C2C2E8','#CCE7FA','#A1D9FC','#F3C3C2','#EB8993','#8EA1D2','#7477AD'],
		outline: 'white',
		texture: 'marble'
	},
	'pinkdreams': {
		name: 'pinkdreams',
		description: 'DICESONICE.ColorPinkDreams',
		category: 'DICESONICE.ThemesSoNice',
		foreground: 'white',
		background: ['#ff007c', '#df73ff','#f400a1','#df00ff','#ff33cc'],
		outline: '#570000',
		texture: 'skulls'
	},
	'inspired': {
		name: 'inspired',
		description: 'DICESONICE.ColorInspired',
		category: 'DICESONICE.ThemesSoNice',
		foreground: '#FFD800',
		background: '#C4C4B6',
		outline: '#8E8E86',
		texture: 'none'
	},
	'bloodmoon': {
		name: 'bloodmoon',
		description: 'DICESONICE.ColorBloodMoon',
		category: 'DICESONICE.ThemesSoNice',
		foreground: '#CDB800',
		background: '#6F0000',
		outline: 'black',
		texture: 'marble'
	},
	'starynight': {
		name: 'starynight',
		description: 'DICESONICE.ColorStaryNight',
		category: 'DICESONICE.ThemesSoNice',
		foreground: '#4F708F',
		background: ['#091636','#233660','#4F708F','#8597AD','#E2E2E2'],
		outline: 'white',
		texture: 'speckles'
	},
	'glitterparty': {
		name: 'glitterparty',
		description: 'DICESONICE.ColorGlitterParty',
		category: 'DICESONICE.ThemesSoNice',
		foreground: 'white',
		background: ['#FFB5F5','#7FC9FF','#A17FFF'],
		outline: 'none',
		texture: 'glitter'
	},
	'astralsea': {
		name: 'astralsea',
		description: 'DICESONICE.ColorAstralSea',
		category: 'DICESONICE.ThemesSoNice',
		foreground: '#565656',
		background: 'white',
		outline: 'none',
		texture: 'astral'
	},
	'foundry': {
		name: 'foundry',
		description: 'DICESONICE.ColorFoundry',
		category: 'DICESONICE.ThemesSoNice',
		foreground: '#000000',
		background: '#ffffff',
		outline: 'none',
		edge: '#000000',
		texture: 'radial'
	},
	'tigerking': {
		name: 'tigerking',
		description: 'DICESONICE.ColorTigerKing',
		category: 'DICESONICE.AcquiredTaste',
		foreground: '#ffffff',
		background: '#FFCC40',
		outline: 'black',
		texture: ['leopard', 'tiger', 'cheetah']
	},
	'toxic': {
		name: 'toxic',
		description: 'DICESONICE.ColorToxic',
		category: 'DICESONICE.AcquiredTaste',
		foreground: '#A9FF70',
		background: ['#a6ff00', '#83b625','#5ace04','#69f006','#b0f006','#93bc25'],
		outline: 'black',
		texture: 'fire'
	},
	'rainbow': {
		name: 'rainbow',
		description: 'DICESONICE.ColorRainblow',
		category: 'DICESONICE.Colors',
		foreground: ['#FF5959','#FFA74F','#FFFF56','#59FF59','#2374FF','#00FFFF','#FF59FF'],
		background: ['#900000','#CE3900','#BCBC00','#00B500','#00008E','#008282','#A500A5'],
		outline: 'black',
		texture: 'none'
	},
	'random': {
		name: 'random',
		description: 'DICESONICE.ColorRaNdOm',
		category: 'DICESONICE.Colors',
		foreground: [],
		outline: [],
		background: [],
		texture: []
	},
	'black': {
		name: 'black',
		description: 'DICESONICE.ColorBlack',
		category: 'DICESONICE.Colors',
		foreground: '#ffffff',
		background: '#000000',
		outline: 'black',
		texture: 'none'
	},
	'white': {
		name: 'white',
		description: 'DICESONICE.ColorWhite',
		category: 'DICESONICE.Colors',
		foreground: '#000000',
		background: '#FFFFFF',
		outline: '#FFFFFF',
		texture: 'none'
	},
	'custom': {
		name: 'custom',
		description: 'DICESONICE.ColorCustom',
		category: 'DICESONICE.Colors',
		foreground: '',
		background: '',
		outline: '',
		edge: '',
		texture: 'none'
	}
};

export class DiceColors {

	static loadTextures(sources, callback) {

		let images = {};
		let loadedImages = 0;
	
		let itemprops = Object.entries(sources);
		let numImages = itemprops.length;
		for (const [key, value] of itemprops) {

			if(value.source === '') {
				++loadedImages;
				continue;
			}
	
			images[key] = new Image();
			images[key].onload = function() {
	
				if (++loadedImages >= numImages) {
					DiceColors.diceTextures = mergeObject(images, DiceColors.diceTextures || {});
					callback(images);
				}
			};
			images[key].src = value.source;
		}
	}
	
	static getTexture(texturename) {
	
		if (Array.isArray(texturename)) {
	
			let textures = [];
			for(let i = 0, l = texturename.length; i < l; i++){
				if (typeof texturename[i] == 'string') {
					textures.push(this.getTexture(texturename[i]));
				}
			}
			return textures;
		}
	
		if (!texturename || texturename == '') {
			return {name:'',texture:''};
		}
	
		if (texturename == 'none') {
			return {name:'none',texture:'',};
		}
	
		if(texturename == 'random') {
			let names = Object.keys(DiceColors.diceTextures);
			// add 'none' for possibility of no texture
			names.pop(); //remove 'random' from this list
	
			return this.getTexture(names[Math.floor(Math.random() * names.length)]);
		}
		//Init not done yet, let the init load the texture
		if(!DiceColors.diceTextures)
			return texturename;
		if (DiceColors.diceTextures[texturename] != null) {
			return { name: texturename, texture: DiceColors.diceTextures[texturename], composite: TEXTURELIST[texturename].composite };
		}
		return {name:'',texture:''};
	}
	
	static randomColor() {
		// random colors
		let rgb=[];
		rgb[0] = Math.floor(Math.random() * 254);
		rgb[1] = Math.floor(Math.random() * 254);
		rgb[2] = Math.floor(Math.random() * 254);
	
		// this is an attempt to make the foregroudn color stand out from the background color
		// it sometimes produces ok results
		let brightness = ((parseInt(rgb[0]) * 299) + (parseInt(rgb[1]) * 587) +  (parseInt(rgb[2]) * 114)) / 1000;
		let foreground = (brightness > 126) ? 'rgb(30,30,30)' : 'rgb(230,230,230)'; // high brightness = dark text, else bright text
		let background = 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
	
		return {background: background, foreground: foreground };
	}
	
	static initColorSets(entries = null) {
		let sets;
		if(entries)
		{
			let uniqueSet = {};
			uniqueSet[entries.name] = entries;
			sets = Object.entries(uniqueSet);
		}
		else
			sets = Object.entries(COLORSETS);
		for (const [name, data] of sets) {
			COLORSETS[name].id = name;
			COLORSETS[name].texture = this.getTexture(data.texture);
			if(typeof COLORSETS[name].texture == "object")
				COLORSETS[name].texture.id = data.texture;
		}
		
		// generate the colors and textures for the random set
		if(!entries)
		{
			for (let i = 0; i < 10; i++) {
				let randcolor = this.randomColor();
				let randtex = this.getTexture('random');
		
				if (randtex.name != '') {
					COLORSETS['random'].foreground.push(randcolor.foreground); 
					COLORSETS['random'].background.push(randcolor.background);
					COLORSETS['random'].outline.push(randcolor.background);
					COLORSETS['random'].texture.push(randtex);
				} else {
					COLORSETS['random'].foreground.push(randcolor.foreground); 
					COLORSETS['random'].background.push(randcolor.background);
					COLORSETS['random'].outline.push('black');
					COLORSETS['random'].texture.push('');
				}
			}
		}
	}
	
	static getColorSet(colorsetname) {
		let colorset = COLORSETS[colorsetname] || COLORSETS['custom'];
		return colorset;
	}

	static setColorCustom(foreground = '#FFFFFF', background = '#000000', outline = '#FFFFFF', edge = '#FFFFFF'){
		COLORSETS['custom'].foreground = foreground;
		COLORSETS['custom'].background = background;
		COLORSETS['custom'].outline = outline;
		COLORSETS['custom'].edge = edge;
	}

	static applyColorSet(dicefactory, colorset, texture = null) {
		var colordata = DiceColors.getColorSet(colorset);
		
		if (colorset && colorset.length > 0) {
	
			dicefactory.applyColorSet(colordata);
		}
	
		if (texture || (colordata.texture && !Array.isArray(colordata.texture))) {
	
			var texturedata = this.getTexture((texture || colordata.texture.name));
	
			if (texturedata.name) {
				dicefactory.applyTexture(texturedata);
			}
	
		}
	}
}
