export function fillTextureDatabase(textureDatabase) {
  console.log("TEXTURE DB");
  
  for(let key in TEXTUREDB) {
    let textureData = TEXTUREDB[key];
    let compositeList = [];
    let keyInc = 0;
    
    // Base Texture List
    if(textureData.tooBright) compositeList = COMPOSITES_BRIGHT;
    else if(textureData.tooDark) compositeList = COMPOSITES_DARK;
    else if(textureData.onlyLights) compositeList = COMPOSITES_LIGHTS;
    else compositeList = COMPOSITES_ALL;
    
    for(let i = 0; i < compositeList.length; i++ ) {
      keyInc++;
      let composite = compositeList[i];
      let newKey = "" + key + keyInc;
      addTexture(textureDatabase, newKey, textureData, composite);
    }
    
    // Drugs Texture List
    if(!textureData.noDrugs && !textureData.tooBright) {
      compositeList = COMPOSITES_DRUGS;
      for(let i = 0; i < compositeList.length; i++ ) {
        keyInc++;
        let composite = compositeList[i];
        let newKey = "" + key + keyInc;
        addTexture(textureDatabase, newKey, textureData, composite);
      }
    }
  }
}

function addTexture(textureDatabase, key, baseData, composite) {
  textureDatabase[key] = {
    name: baseData.name + " (" + ALIAS[composite] + ")",
    composite: composite,
    source: baseData.source
  };
}


// Cool compositions: multiply, overlay, luminosity,
// Crazy Compositions: exclusion
// Transparent Compositions: destination-in, 
// Maybe: darken, screen, difference
// Finals: multiply, screen, hard-light, soft-light, luminosity, exclusion

const ALIAS = {
  "multiply": "dark",
  "screen": "light",
  "hard-light": "contrast",
  "soft-light": "subtle",
  "exclusion": "LSD",
}

const COMPOSITES_ALL = [
  "multiply",
  "screen",
  "hard-light",
  "soft-light",
];

const COMPOSITES_LIGHTS = [
  "hard-light",
  "soft-light",
];

const COMPOSITES_BRIGHT = [
  "multiply",
  "soft-light",
];

const COMPOSITES_DARK = [
  "screen",
  "soft-light",
];

const COMPOSITES_DRUGS = [
  "exclusion",
];

const TEXTUREDB = {
  // Default Dice-So-Nice textures
	'cloudy': {
		name: 'Cloudy',
    source: 'modules/dice-so-nice/texturespsyny/cloudy.png',
    useAlpha: true,
	},
	'smoke': {
		name: 'Smoke',
    source: 'modules/dice-so-nice/texturespsyny/cloudy.alt.png',
    noDrugs: true,
	},
	'fire': {
		name: 'Fire',
		source: 'modules/dice-so-nice/texturespsyny/fire.png',
	},
	'marble': {
		name: 'Marble',
		source: 'modules/dice-so-nice/texturespsyny/marble.png',
	},
	'water': {
		name: 'Water',
		source: 'modules/dice-so-nice/texturespsyny/water.png',
    useAlpha: true,
	},
	'ice': {
		name: 'Ice',
		source: 'modules/dice-so-nice/texturespsyny/ice.png',
    useAlpha: true,
	},
	'paper': {
		name: 'Paper',
		source: 'modules/dice-so-nice/texturespsyny/paper.png',
    tooBright: true,
	},
	'speckles': {
		name: 'Speckles',
		source: 'modules/dice-so-nice/texturespsyny/speckles.png',
    tooBright: true,
	},
	'glitter': {
		name: 'Glitter',
		source: 'modules/dice-so-nice/texturespsyny/glitter.png',
	},
	'stars': {
		name: 'Stars',
		source: 'modules/dice-so-nice/texturespsyny/stars.png',
    noDrugs: true,
	},
	'stainedglass': {
		name: 'Glass',
		source: 'modules/dice-so-nice/texturespsyny/stainedglass.png',
    noDrugs: true,
	},
	'skulls': {
		name: 'Skulls',
		source: 'modules/dice-so-nice/texturespsyny/skulls.png',
	},
	'leopard': {
		name: 'Leopard',
		source: 'modules/dice-so-nice/texturespsyny/leopard.png',
    tooBright: true,
	},
	'tiger': {
		name: 'Tiger',
		source: 'modules/dice-so-nice/texturespsyny/tiger.png',
	},
	'cheetah': {
		name: 'Cheetah',
		source: 'modules/dice-so-nice/texturespsyny/cheetah.png',
    tooBright: true,
	},
	'wood': {
		name: 'Wood',
		source: 'modules/dice-so-nice/texturespsyny/wood.png',
    tooBright: true,
	},
	'metal': {
		name: 'Metal',
		source: 'modules/dice-so-nice/texturespsyny/metal.png',
    tooBright: true,
	},
  
  // NEW ENTRIES
  
	'soviet': {
		name: 'Soviet',
		source: 'modules/dice-so-nice/texturespsyny/soviet.png',
	},
  
	'heart': {
		name: 'Heart',
		source: 'modules/dice-so-nice/texturespsyny/heart.png',
	},
  
	'carbon': {
		name: 'Carbon',
		source: 'modules/dice-so-nice/texturespsyny/carbon.png',
    onlyLights: true,
	},
  
	'runes': {
		name: 'Runes',
		source: 'modules/dice-so-nice/texturespsyny/runes.png',
	},
  
	'scales': {
		name: 'Scales',
		source: 'modules/dice-so-nice/texturespsyny/scales.png',
    tooBright: true,
	},
  
	'spiderweb': {
		name: 'Spider Web',
		source: 'modules/dice-so-nice/texturespsyny/spiderweb.png',
	},
 
	'leaves': {
		name: 'Leaves',
		source: 'modules/dice-so-nice/texturespsyny/leaves.png',
	},
  
	'bud': {
		name: 'Bud',
		source: 'modules/dice-so-nice/texturespsyny/bud.png',
	},
  
	'mushroom': {
		name: 'Mushroom',
		source: 'modules/dice-so-nice/texturespsyny/mushroom.png',
	},
  
	'roses': {
		name: 'Roses',
		source: 'modules/dice-so-nice/texturespsyny/roses.png',
	},
  
	'links': {
		name: 'Links',
		source: 'modules/dice-so-nice/texturespsyny/links.png',
	},
  
	'circuit': {
		name: 'Circuit',
		source: 'modules/dice-so-nice/texturespsyny/circuit.png',
	},
  
	'jaccard': {
		name: 'Jaccard',
		source: 'modules/dice-so-nice/texturespsyny/jaccard.png',
    tooBright: true,
	},
  
	'hash': {
		name: 'Hash',
		source: 'modules/dice-so-nice/texturespsyny/hash.png',
	},
  
	'alien': {
		name: 'Alien',
		source: 'modules/dice-so-nice/texturespsyny/alien.png',
    onlyLights: true,
	},
  
	'victorian': {
		name: 'Victorian',
		source: 'modules/dice-so-nice/texturespsyny/victorian.png',
    onlyLights: true,
	},
  
	'hallows': {
		name: 'Hallows',
		source: 'modules/dice-so-nice/texturespsyny/hallows.png',
    noDrugs: true,
	},
  
	'eye': {
		name: 'Eye',
		source: 'modules/dice-so-nice/texturespsyny/eye.png',
    tooBright: true,
	},
  
	'bear': {
		name: 'Bear',
		source: 'modules/dice-so-nice/texturespsyny/bear.png',
    tooBright: true,
	},  
  
	'dragon': {
		name: 'Dragon',
		source: 'modules/dice-so-nice/texturespsyny/dragon.png',
    tooBright: true,
	},  
  
	'tree': {
		name: 'Tree',
		source: 'modules/dice-so-nice/texturespsyny/tree.png',
    tooBright: true,
	},  
  
	'sun': {
		name: 'Sun',
		source: 'modules/dice-so-nice/texturespsyny/sun.png',
    tooBright: true,
	}, 
  
	'moon': {
		name: 'Moon',
		source: 'modules/dice-so-nice/texturespsyny/moon.png',
    tooBright: true,
	},   
  
  'glasstodark': {
		name: 'Glass To Dark',
		source: 'modules/dice-so-nice/texturespsyny/GlassToDark.png',
    tooBright: true,
	},
  
  'glasstolight': {
		name: 'Glass To Light',
		source: 'modules/dice-so-nice/texturespsyny/GlassToLight.png',
    tooDark: true,
	},
  
  'blocktodark': {
		name: 'Block To Dark',
		source: 'modules/dice-so-nice/texturespsyny/BlockToDark.png',
    tooBright: true,
	},
  
  'blocktolight': {
		name: 'Block To Light',
		source: 'modules/dice-so-nice/texturespsyny/BlockToLight.png',
    tooDark: true,
	},
  
  'fadetodark': {
		name: 'Fade To Dark',
		source: 'modules/dice-so-nice/texturespsyny/FadeToDark.png',
    tooBright: true,
	},
  
  'fadetolight': {
		name: 'Fade to Light',
		source: 'modules/dice-so-nice/texturespsyny/FadeToLight.png',
    tooDark: true,
	},
}