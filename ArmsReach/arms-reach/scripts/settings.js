Hooks.once("init", () => {
  game.settings.register("arms-reach", "notificationsInteractionFail", {
		name: "Notifications failed interactions",
    hint: "Emit notifications for when a player fails to interact with a door. Good for debugging.",
		scope: "world",
		config: true,
		default: true,
		type: Boolean
	});
  
	game.settings.register("arms-reach", "globalInteractionDistance", {
		name: "Global maximum interaction distance",
		hint: "Max distance (in tiles) that a token can interact with a door... 0 will disable the limit (needs app reload). GM's ignore this distance limitation.",
		scope: "world",
		config: true,
		default: 1,
    type: Number,
    range: {min: 0, max: 50, step: 0.5}
	});
  
  game.settings.register("arms-reach", "hotkeyDoorInteraction", {
		name: "Hotkey 'e' for interaction",
		hint: "Pressing 'e' will open or close nearest door. Holding 'e' will center camera on current token.",
		scope: "world",
		config: true,
		default: true,
		type: Boolean
	});
  
  game.settings.register("arms-reach", "hotkeyDoorInteractionDelay", {
		name: "Interaction double tap delay",
		hint: "Double tapping a move key on the direction of a door will interact with it. This option sets the delay between required key presses (the lower the faster you need to tap). Setting this option to zero will disable interaction with double tap.",
		scope: "world",
		config: true,
		default: 200,
    type: Number,
    range: {min: 0, max: 750, step: 50}
	});
  
	game.settings.register("arms-reach", "doorInteractionDistance", {
		name: "Maximum door interaction distance",
		scope: "world",
		config: true,
		default: 1,
    type: Number,
    range: {min: 0, max: 10, step: 0.5}
	});
  
  game.settings.register("arms-reach", "hotkeyDoorInteractionCenter", {
		name: "Hotkey 'e' to center camera",
		hint: "Holding 'e' will center the camera on current selected token.",
		scope: "world",
		config: true,
		default: true,
		type: Boolean
	});
  


});