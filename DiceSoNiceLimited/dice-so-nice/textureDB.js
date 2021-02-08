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
    source: baseData.source,
    bump: baseData.bump
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
  "exclusion",
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
		source: 'modules/dice-so-nice/textures/cloudy.webp',
		bump: 'modules/dice-so-nice/textures/cloudy.alt.webp',
    useAlpha: true,
	},
	'smoke': {
		name: 'Smoke',
		source: 'modules/dice-so-nice/textures/cloudy.alt.webp',
		bump: 'modules/dice-so-nice/textures/cloudy.alt.webp',
    noDrugs: true,
	},
	'fire': {
		name: 'Fire',
		source: 'modules/dice-so-nice/textures/fire.webp',
		bump: 'modules/dice-so-nice/textures/fire.webp',
    tooBright: true,
	},
	'marble': {
		name: 'Marble',
		source: 'modules/dice-so-nice/textures/marble.webp',
		bump: '',
	},
	'water': {
		name: 'Water',
		source: 'modules/dice-so-nice/textures/water.webp',
		bump: 'modules/dice-so-nice/textures/water.webp',
    useAlpha: true,
	},
	'ice': {
		name: 'Ice',
		source: 'modules/dice-so-nice/textures/ice.webp',
		bump: 'modules/dice-so-nice/textures/ice.webp',
    useAlpha: true,
	},
	'paper': {
		name: 'Paper',
		source: 'modules/dice-so-nice/textures/paper.webp',
		bump: 'modules/dice-so-nice/textures/paper-bump.webp',
    tooBright: true,
	},
	'speckles': {
		name: 'Speckles',
		source: 'modules/dice-so-nice/textures/speckles.webp',
		bump: 'modules/dice-so-nice/textures/speckles.webp',
    tooBright: true,
	},
	'glitter': {
		name: 'Glitter',
		source: 'modules/dice-so-nice/textures/glitter.webp',
		bump: 'modules/dice-so-nice/textures/glitter-bump.webp',
	},
	'stars': {
		name: 'Stars',
		source: 'modules/dice-so-nice/textures/stars.webp',
		bump: 'modules/dice-so-nice/textures/stars.webp',
    noDrugs: true,
	},
	'stainedglass': {
		name: 'Glass',
		source: 'modules/dice-so-nice/textures/stainedglass.webp',
		bump: 'modules/dice-so-nice/textures/stainedglass-bump.webp',
    noDrugs: true,
	},
	'skulls': {
		name: 'Skulls',
		source: 'modules/dice-so-nice/textures/skulls.webp',
		bump: 'modules/dice-so-nice/textures/skulls.webp',
	},
	'leopard': {
		name: 'Leopard',
		source: 'modules/dice-so-nice/textures/leopard.webp',
		bump: 'modules/dice-so-nice/textures/leopard.webp',
    tooBright: true,
	},
	'tiger': {
		name: 'Tiger',
		source: 'modules/dice-so-nice/textures/tiger.webp',
		bump: 'modules/dice-so-nice/textures/tiger.webp',
	},
	'cheetah': {
		name: 'Cheetah',
		source: 'modules/dice-so-nice/textures/cheetah.webp',
		bump: 'modules/dice-so-nice/textures/cheetah.webp',
    tooBright: true,
	},
	'dragon': {
		name: 'Dragon',
		source: 'modules/dice-so-nice/textures/dragon.webp',
		bump: 'modules/dice-so-nice/textures/dragon-bump.webp',
	},  
	'lizard': {
		name: 'Lizard',
		source: 'modules/dice-so-nice/textures/lizard.webp',
		bump: 'modules/dice-so-nice/textures/lizard-bump.webp',
	},    
	'bird': {
		name: 'Bird',
		source: 'modules/dice-so-nice/textures/feather.webp',
		bump: 'modules/dice-so-nice/textures/feather-bump.webp',
	},    
	'astral': {
		name: 'Astral',
		source: 'modules/dice-so-nice/textures/astral.webp',
		bump: 'modules/dice-so-nice/textures/stars.webp',
	},   
	'astral': {
		name: 'Astral',
		source: 'modules/dice-so-nice/textures/astral.webp',
		bump: 'modules/dice-so-nice/textures/stars.webp',
	},     
	'wood': {
		name: 'Wood',
		source: 'modules/dice-so-nice/textures/wood.webp',
		bump: 'modules/dice-so-nice/textures/wood.webp',
    tooBright: true,
	},
	'steel': {
		name: 'Steel',
		source: 'modules/dice-so-nice/textures/metal.webp',
		bump: '',
    tooBright: true,
	},
	'bronze': {
		name: 'Bronze',
		source: 'modules/dice-so-nice/textures/bronze02.webp',
    bump: '',
	},
	'Iron': {
		name: 'Iron',
		source: 'modules/dice-so-nice/textures/bronze04.webp',
		bump: 'modules/dice-so-nice/textures/bronze04.webp',
	},
  
  // NEW ENTRIES
  
	'soviet': {
		name: 'Soviet',
		source: 'modules/dice-so-nice/texturespsyny/soviet.png',
		bump: 'modules/dice-so-nice/texturespsyny/soviet.png',
	},
  
	'heart': {
		name: 'Heart',
		source: 'modules/dice-so-nice/texturespsyny/heart.png',
    bump: '',
	},
  
	'carbon': {
		name: 'Carbon',
		source: 'modules/dice-so-nice/texturespsyny/carbon.png',
    bump: 'modules/dice-so-nice/texturespsyny/carbon.png',
    onlyLights: true,
	},
  
	'runes': {
		name: 'Runes',
		source: 'modules/dice-so-nice/texturespsyny/runes.png',
    bump: '',
	},
  
	'scales': {
		name: 'Scales',
		source: 'modules/dice-so-nice/texturespsyny/scales.png',
    bump: 'modules/dice-so-nice/texturespsyny/scales.png',
    tooBright: true,
	},
  
	'spiderweb': {
		name: 'Spider Web',
		source: 'modules/dice-so-nice/texturespsyny/spiderweb.png',
    bump: 'modules/dice-so-nice/texturespsyny/spiderweb.png',
	},
 
	'leaves': {
		name: 'Leaves',
		source: 'modules/dice-so-nice/texturespsyny/leaves.png',
    bump: '',
	},
  
	'bud': {
		name: 'Bud',
		source: 'modules/dice-so-nice/texturespsyny/bud.png',
    bump: 'modules/dice-so-nice/texturespsyny/bud.png',
	},
  
	'mushroom': {
		name: 'Mushroom',
		source: 'modules/dice-so-nice/texturespsyny/mushroom.png',
    bump: '',
	},
  
	'roses': {
		name: 'Roses',
		source: 'modules/dice-so-nice/texturespsyny/roses.png',
    bump: '',
	},
  
	'links': {
		name: 'Links',
		source: 'modules/dice-so-nice/texturespsyny/links.png',
    bump: 'modules/dice-so-nice/texturespsyny/links.png',
	},
  
	'circuit': {
		name: 'Circuit',
		source: 'modules/dice-so-nice/texturespsyny/circuit.png',
    bump: '',
	},
  
	'jaccard': {
		name: 'Jaccard',
		source: 'modules/dice-so-nice/texturespsyny/jaccard.png',
    bump: '',
    tooBright: true,
	},
  
	'hash': {
		name: 'Hash',
		source: 'modules/dice-so-nice/texturespsyny/hash.png',
    bump: '',
	},
  
	'alien': {
		name: 'Alien',
		source: 'modules/dice-so-nice/texturespsyny/alien.png',
    bump: 'modules/dice-so-nice/texturespsyny/alien.png',
    onlyLights: true,
	},
  
	'victorian': {
		name: 'Victorian',
		source: 'modules/dice-so-nice/texturespsyny/victorian.png',
    bump: 'modules/dice-so-nice/texturespsyny/victorian.png',
    onlyLights: true,
	},
  
	'hallows': {
		name: 'Hallows',
		source: 'modules/dice-so-nice/texturespsyny/hallows.png',
    bump: '',
    noDrugs: true,
	},
  
	'eye': {
		name: 'Eye',
		source: 'modules/dice-so-nice/texturespsyny/eye.png',
    bump: '',
    tooBright: true,
	},
  
	'bear': {
		name: 'Bear',
		source: 'modules/dice-so-nice/texturespsyny/bear.png',
    bump: '',
    tooBright: true,
	},  
  
	'drake': {
		name: 'Drake',
		source: 'modules/dice-so-nice/texturespsyny/dragon.png',
    bump: '',
    tooBright: true,
	},  
  
	'tree': {
		name: 'Tree',
		source: 'modules/dice-so-nice/texturespsyny/tree.png',
    bump: 'modules/dice-so-nice/texturespsyny/tree.png',
    tooBright: true,
	},  
  
	'sun': {
		name: 'Sun',
		source: 'modules/dice-so-nice/texturespsyny/sun.png',
    bump: '',
    tooBright: true,
	}, 
  
	'moon': {
		name: 'Moon',
		source: 'modules/dice-so-nice/texturespsyny/moon.png',
    bump: 'modules/dice-so-nice/texturespsyny/moon.png',
    tooBright: true,
	},   
  
  'glasstodark': {
		name: 'Glass To Dark',
		source: 'modules/dice-so-nice/texturespsyny/GlassToDark.png',
    bump: '',
    tooBright: true,
	},
  
  'glasstolight': {
		name: 'Glass To Light',
		source: 'modules/dice-so-nice/texturespsyny/GlassToLight.png',
    bump: '',
    tooDark: true,
	},
  
  'blocktodark': {
		name: 'Block To Dark',
		source: 'modules/dice-so-nice/texturespsyny/BlockToDark.png',
    bump: '',
    tooBright: true,
	},
  
  'blocktolight': {
		name: 'Block To Light',
		source: 'modules/dice-so-nice/texturespsyny/BlockToLight.png',
    bump: '',
    tooDark: true,
	},
  
  'fadetodark': {
		name: 'Fade To Dark',
		source: 'modules/dice-so-nice/texturespsyny/FadeToDark.png',
    bump: '',
    tooBright: true,
	},
  
  'fadetolight': {
		name: 'Fade to Light',
		source: 'modules/dice-so-nice/texturespsyny/FadeToLight.png',
    bump: '',
    tooDark: true,
	},
}