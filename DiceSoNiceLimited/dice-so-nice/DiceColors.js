export const TEXTURELIST = {
	'none': {
		name: 'DICESONICE.TextureNone',
		composite: 'source-over',
		source: '',
		bump: ''
	},
	'cloudy': {
		name: 'DICESONICE.TextureCloudsTransparent',
		composite: 'destination-in',
		source: 'modules/dice-so-nice/textures/cloudy.webp',
		bump: 'modules/dice-so-nice/textures/cloudy.alt.webp'
	},
	'cloudy_2': {
		name: 'DICESONICE.TextureClouds',
		composite: 'multiply',
		source: 'modules/dice-so-nice/textures/cloudy.alt.webp',
		bump: 'modules/dice-so-nice/textures/cloudy.alt.webp'
	},
	'fire': {
		name: 'DICESONICE.TextureFire',
		composite: 'multiply',
		source: 'modules/dice-so-nice/textures/fire.webp',
		bump: 'modules/dice-so-nice/textures/fire.webp'
	},
	'marble': {
		name: 'DICESONICE.TextureMarble',
		composite: 'multiply',
		source: 'modules/dice-so-nice/textures/marble.webp',
		bump: '',
		material: "glass"
	},
	'water': {
		name: 'DICESONICE.TextureWaterTransparent',
		composite: 'destination-in',
		source: 'modules/dice-so-nice/textures/water.webp',
		bump: 'modules/dice-so-nice/textures/water.webp',
		material: 'glass',
	},
	'water_2': {
		name: 'DICESONICE.TextureWater',
		composite: 'multiply',
		source: 'modules/dice-so-nice/textures/water.webp',
		bump: 'modules/dice-so-nice/textures/water.webp',
		material: 'glass',
	},
	'ice': {
		name: 'DICESONICE.TextureIceTransparent',
		composite: 'destination-in',
		source: 'modules/dice-so-nice/textures/ice.webp',
		bump: 'modules/dice-so-nice/textures/ice.webp',
		material: 'glass'
	},
	'ice_2': {
		name: 'DICESONICE.TextureIce',
		composite: 'multiply',
		source: 'modules/dice-so-nice/textures/ice.webp',
		bump: 'modules/dice-so-nice/textures/ice.webp',
		material: 'metal'
	},
	'paper': {
		name: 'DICESONICE.TexturePaper',
		composite: 'multiply',
		source: 'modules/dice-so-nice/textures/paper.webp',
		bump: 'modules/dice-so-nice/textures/paper-bump.webp',
		material: 'wood'
	},
	'speckles': {
		name: 'DICESONICE.TextureSpeckles',
		composite: 'multiply',
		source: 'modules/dice-so-nice/textures/speckles.webp',
		bump: 'modules/dice-so-nice/textures/speckles.webp'
	},
	'glitter': {
		name: 'DICESONICE.TextureGlitter',
		composite: 'multiply',
		source: 'modules/dice-so-nice/textures/glitter.webp',
		bump: 'modules/dice-so-nice/textures/glitter-bump.webp'
	},
	'glitter_2': {
		name: 'DICESONICE.TextureGlitterTransparent',
		composite: 'destination-in',
		source: 'modules/dice-so-nice/textures/glitter-alpha.webp',
		bump: ''
	},
	'stars': {
		name: 'DICESONICE.TextureStars',
		composite: 'multiply',
		source: 'modules/dice-so-nice/textures/stars.webp',
		bump: 'modules/dice-so-nice/textures/stars.webp'
	},
	'stainedglass': {
		name: 'DICESONICE.TextureStainedGlass',
		composite: 'multiply',
		source: 'modules/dice-so-nice/textures/stainedglass.webp',
		bump: 'modules/dice-so-nice/textures/stainedglass-bump.webp',
		material: 'glass'
	},
	'skulls': {
		name: 'DICESONICE.TextureSkulls',
		composite: 'multiply',
		source: 'modules/dice-so-nice/textures/skulls.webp',
		bump: 'modules/dice-so-nice/textures/skulls.webp'
	},
	'leopard': {
		name: 'DICESONICE.TextureLeopard',
		composite: 'multiply',
		source: 'modules/dice-so-nice/textures/leopard.webp',
		bump: 'modules/dice-so-nice/textures/leopard.webp',
		material: 'wood'
	},
	'tiger': {
		name: 'DICESONICE.TextureTiger',
		composite: 'multiply',
		source: 'modules/dice-so-nice/textures/tiger.webp',
		bump: 'modules/dice-so-nice/textures/tiger.webp',
		material: 'wood'
	},
	'cheetah': {
		name: 'DICESONICE.TextureCheetah',
		composite: 'multiply',
		source: 'modules/dice-so-nice/textures/cheetah.webp',
		bump: 'modules/dice-so-nice/textures/cheetah.webp',
		material: 'wood'
	},
	'dragon': {
		name: 'Dragon',
		composite: 'multiply',
		source: 'modules/dice-so-nice/textures/dragon.webp',
		bump: 'modules/dice-so-nice/textures/dragon-bump.webp'
	},
	'lizard': {
		name: 'Lizard',
		composite: 'multiply',
		source: 'modules/dice-so-nice/textures/lizard.webp',
		bump: 'modules/dice-so-nice/textures/lizard-bump.webp'
	},
	'bird': {
		name: 'Bird',
		composite: 'multiply',
		source: 'modules/dice-so-nice/textures/feather.webp',
		bump: 'modules/dice-so-nice/textures/feather-bump.webp'
	},
	'astral': {
		name: 'DICESONICE.TextureAstralSea',
		composite: 'multiply',
		source: 'modules/dice-so-nice/textures/astral.webp',
		bump: 'modules/dice-so-nice/textures/stars.webp'
	},
	'wood': {
		name: 'DICESONICE.TextureWood',
		composite: 'multiply',
		source: 'modules/dice-so-nice/textures/wood.webp',
		bump: 'modules/dice-so-nice/textures/wood.webp',
		material: 'wood'
	},
	'metal': {
		name: 'DICESONICE.TextureMetal',
		composite: 'multiply',
		source: 'modules/dice-so-nice/textures/metal.webp',
		bump: '',
		material: 'metal'
	},
	'radial': {
		name: 'DICESONICE.TextureRadial',
		composite: 'source-over',
		source: 'modules/dice-so-nice/textures/radial.webp',
		bump: '',
	},
	'bronze01': {
		name: 'DICESONICE.TextureBronze1',
		composite: 'difference',
		source: 'modules/dice-so-nice/textures/bronze01.webp',
		material: 'metal',
		bump: ''
	},
	'bronze02': {
		name: 'DICESONICE.TextureBronze2',
		composite: 'difference',
		source: 'modules/dice-so-nice/textures/bronze02.webp',
		material: 'metal',
		bump: ''
	},
	'bronze03': {
		name: 'DICESONICE.TextureBronze3',
		composite: 'difference',
		source: 'modules/dice-so-nice/textures/bronze03.webp',
		material: 'metal',
		bump: ''
	},
	'bronze03a': {
		name: 'DICESONICE.TextureBronze3a',
		composite: 'difference',
		source: 'modules/dice-so-nice/textures/bronze03a.webp',
		material: 'metal',
		bump: ''
	},
	'bronze03b': {
		name: 'DICESONICE.TextureBronze3b',
		composite: 'difference',
		source: 'modules/dice-so-nice/textures/bronze03b.webp',
		material: 'metal',
		bump: ''
	},
	'bronze04': {
		name: 'DICESONICE.TextureBronze4',
		composite: 'difference',
		source: 'modules/dice-so-nice/textures/bronze04.webp',
		material: 'metal',
		bump: 'modules/dice-so-nice/textures/bronze04.webp'
	}
};

export const COLORSETS = {
	'coin_default': {
		name: 'coin_default',
		description: 'DICESONICE.ColorCoinDefault',
		category: 'DICESONICE.AcquiredTaste',
		foreground: '#f6c928',
		background: '#f6c928',
		outline: 'none',
		texture: 'metal'
	},
	'radiant': {
		name: 'radiant',
		description: 'DICESONICE.ColorRadiant',
		category: 'DICESONICE.DamageTypes',
		foreground: '#F9B333',
		background: '#FFFFFF',
		outline: 'none',
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
	'cold': {
		name: 'cold',
		description: 'DICESONICE.ColorCold',
		category: 'DICESONICE.DamageTypes',
		foreground: '#60E9FF',
		background: ['#214fa3','#3c6ac1','#253f70','#0b56e2','#09317a'],
		outline: 'black',
		texture: 'ice_2'
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
		texture: 'marble',
		material: 'plastic'
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
		texture: 'marble',
		material: 'plastic'
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
		texture: 'marble',
		material: 'plastic'
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
	'dragons': {
		name: 'dragons',
		description: 'DICESONICE.ColorDragons',
		category: 'DICESONICE.AcquiredTaste',
		foreground: '#FFFFFF',
		// 			[ red,       black,     blue,      green      white      gold,      silver,    bronze,    copper     brass
		background: ['#B80000', '#4D5A5A', '#5BB8FF', '#7E934E', '#FFFFFF', '#F6ED7C', '#7797A3', '#A78437', '#862C1A', '#FFDF8A'],
		outline: 'black',
		texture: ['dragon', 'lizard'],
		description: 'Here be Dragons'
	},
	'birdup': {
		name: 'birdup',
		description: 'DICESONICE.ColorBirdUp',
		category: 'DICESONICE.AcquiredTaste',
		foreground: '#FFFFFF',
		background: ['#F11602', '#FFC000', '#6EC832', '#0094BC', '#05608D', '#FEABB3', '#F75680', '#F3F0DF', '#C7A57F'],
		outline: 'black',
		texture: 'bird',
		description: 'Bird Up!'
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
	'bronze': {
		name: 'bronze',
		description: 'DICESONICE.ColorBronze',
		category: 'DICESONICE.ThemesSoNice',
		foreground: ['#FF9159','#FFB066','#FFBF59','#FFD059'],
		background: ['#705206','#7A4E06','#643100','#7A2D06'],
		outline: ['#3D2D03','#472D04','#301700','#471A04'],
		edge: ['#FF5D0D','#FF7B00','#FFA20D','#FFBA0D'],
		texture: [['bronze01','bronze02','bronze03','bronze03b','bronze03b','bronze04']]
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

export const DICE_SCALE = {
	"d2":1,
	"d4":1,
	"d6":1.3,
	"d8":1.1,
	"d10":1,
	"d12":1.1,
	"d20":1,
	"d3":1.3,
	"d5":1,
	"df":2,
	"d100":0.75
};

export class DiceColors {

	static loadTextures(sources, callback) {

		let images = {};
		let bumps = {};
		let loadedImages = 0;
	
		let itemprops = Object.entries(sources);
		let numImages = itemprops.length*2; //One for texture, one for bump texture
		for (const [key, value] of itemprops) {

			if(value.source === '') {
				loadedImages+=2;
				continue;
			}
	
			images[key] = new Image();
			images[key].onload = function() {
	
				if (++loadedImages >= numImages) {
					DiceColors.diceTextures = mergeObject(images, DiceColors.diceTextures || {});
					DiceColors.diceBumps = mergeObject(bumps, DiceColors.diceBumps || {});
					callback(images);
				}
			};
			images[key].src = value.source;

			if(value.bump === '') {
				++loadedImages;
				continue;
			}

			bumps[key] = new Image();
			bumps[key].onload = function() {
	
				if (++loadedImages >= numImages) {
					DiceColors.diceTextures = mergeObject(images, DiceColors.diceTextures || {});
					DiceColors.diceBumps = mergeObject(bumps, DiceColors.diceBumps || {});
					callback(images);
				}
			};

			bumps[key].src = value.bump;
		}
	}
	
	static getTexture(texturename) {
	
		if (Array.isArray(texturename)) {
	
			let textures = [];
			for(let i = 0, l = texturename.length; i < l; i++){
				if (typeof texturename[i] == 'string' || Array.isArray(texturename[i])) {
					textures.push(this.getTexture(texturename[i]));
				}
			}
			return textures;
		}
	
		if (!texturename || texturename == '') {
			return {name:'',texture:'',material:"plastic"};
		}
	
		if (texturename == 'none') {
			return {name:'none',texture:'',material:"plastic"};
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
			if(!TEXTURELIST[texturename].material)
				TEXTURELIST[texturename].material = "plastic";
			if(!DiceColors.diceBumps[texturename])
				DiceColors.diceBumps[texturename] = '';
			return { name: texturename, bump: DiceColors.diceBumps[texturename], material: TEXTURELIST[texturename].material, texture: DiceColors.diceTextures[texturename], composite: TEXTURELIST[texturename].composite };
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
			if(data.texture != "custom")
				COLORSETS[name].texture = this.getTexture(data.texture);
			if(typeof COLORSETS[name].texture == "object")
				COLORSETS[name].texture.id = data.texture;
			if(!COLORSETS[name].material)
				COLORSETS[name].material = '';
			if(!COLORSETS[name].font)
				COLORSETS[name].font = 'Arial';
			if(!COLORSETS[name].fontScale)
				COLORSETS[name].fontScale = DICE_SCALE;
			else
				COLORSETS[name].fontScale = mergeObject(DICE_SCALE,COLORSETS[name].fontScale,{inplace:false});
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
		return {...colorset};
	}

	static setColorCustom(foreground = '#FFFFFF', background = '#000000', outline = '#FFFFFF', edge = '#FFFFFF'){
		COLORSETS['custom'].foreground = foreground;
		COLORSETS['custom'].background = background;
		COLORSETS['custom'].outline = outline;
		COLORSETS['custom'].edge = edge;
	}

	static applyColorSet(dicefactory, colorset, texture = null, material = null, font = null) {
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

		if (material || colordata.material) {
			dicefactory.applyMaterial((material || colordata.material));
		}

		if (font || colordata.font) {
			dicefactory.applyFont((font || colordata.font));
		}
	}
}
