Hooks.on('getSceneControlButtons', controls => {
	let control = controls.find(c => c.name === "lighting") || controls[5];
	
	control.tools.push({
		name: "togglegloballight",
		title: "Toggle Global Light",
		icon: "fas fa-globe",
		visible: true,
		onClick: () => {
			canvas.scene.update({globalLight: !canvas.scene.data.globalLight});
		}
	});
	
	control.tools.push({
		name: "sunnyday",
		title: "Sunny Day",
		icon: "fas fa-sun",
		visible: true,
		onClick: () => {
			setLightState(0.0, "#ffffff", true, false);
		}
	});
	
	control.tools.push({
		name: "cloudyday",
		title: "Cloudy Day",
		icon: "fas fa-cloud-rain",
		visible: true,
		onClick: () => {
			setLightState(0.5, "#849696", true, false);
		}
	});
	
	control.tools.push({
		name: "dusk",
		title: "Dusk",
		icon: "fas fa-cloud-sun",
		visible: true,
		onClick: () => {
			setLightState(0.7, "#ebaa6e", true, false);
		}
	});
	
	control.tools.push({
		name: "fullmoonnight",
		title: "Full Moon Night",
		icon: "fas fa-moon",
		visible: true,
		onClick: () => {
			setLightState(0.8, "#0c1a2e", true, false);
		}
	});
	
	control.tools.push({
		name: "darknight",
		title: "Dark Night",
		icon: "fas fa-cloud-moon",
		visible: true,
		onClick: () => {
			setLightState(0.9, "#020912", true, false);
		}
	});
	
	control.tools.push({
		name: "undergroundmode",
		title: "Underground Mode",
		icon: "fas fa-dungeon",
		visible: true,
		onClick: () => {
			setLightState(1.0, "#000000", false, false);
		}
	});
});

async function setLightState(darkness, lightColor, globalLight, animate = false) {
	await canvas.scene.setFlag("core", "darknessColor",lightColor);
	await canvas.scene.update({darkness: darkness, globalLight: globalLight}, {animateDarkness: animate});
}

Hooks.once('init', () => {
	LightingLayer.prototype.update = function (alpha=null) {
		const d = canvas.dimensions;
		const c = this.lighting;

		// Draw darkness layer
		this._darkness = alpha !== null ? alpha : canvas.scene.data.darkness;
		c.darkness.clear();
		const darknessPenalty = 0.99;
		let darknessColor = canvas.scene.getFlag("core", "darknessColor") || CONFIG.Canvas.darknessColor;
		if ( typeof darknessColor === "string" ) darknessColor = colorStringToHex(darknessColor);
		c.darkness.beginFill(darknessColor, this._darkness * darknessPenalty)
		  .drawRect(0, 0, d.width, d.height)
		  .endFill();

		// Draw lighting atop the darkness
		c.lights.clear();
		for ( let s of canvas.sight.sources.lights.values() ) {
		  if ( s.darknessThreshold <= this._darkness ) {
			c.lights.beginFill(s.color, s.alpha).drawPolygon(s.fov).endFill();
		  }
		}
	};
});

