Hooks.once("init", () => {
  game.settings.register("cozy-player", "sheetsMinimizeOnRoll", {
		name: "Sheets: Minimize On Roll",
    hint: "Minimize the character sheet when the user clicks on something that promps a roll",
		scope: "client",
		config: true,
		default: true,
		type: Boolean
	});
  
  game.settings.register("cozy-player", "toolbarShowSkills", {
		name: "Left Toolbar: Show Skills",
    hint: "Adds buttons to the left tool bar to roll perception, insight and investigation",
		scope: "world",
		config: true,
		default: true,
		type: Boolean
	});
  
  game.settings.register("cozy-player", "toolbarTurnTools", {
		name: "Left Toolbar: Turn Tools",
    hint: "Adds buttons to the left tool bar to roll initiative and end turn",
		scope: "world",
		config: true,
		default: true,
		type: Boolean
	});
  
	game.settings.register("cozy-player", "tooltipVisibility", {
		name: "Token Tooltip: Visibility",
		hint: "This option determines on which tokens to display a tooltip when moused over for players. The tooltip is always displayed for the GM.",
		scope: "world",
		config: true,
		default: "owned",
		type: String,
		choices: {
      "all": "All Tokens",
      "observed": "Observed Tokens",
      "friendly": "Friendly Tokens",
      "ally": "Friendly or Observed Tokens",
      "owned": "Owned Tokens",
			"gm": "GM Only"
		}
	});
  
	game.settings.register("cozy-player", "tooltipScale", {
		name: "Token Tooltip: Scale",
		hint: "Size of the tooltip",
		scope: "client",
		config: true,
		default: 1.0,
    type: Number,
    range: {min: 0.6, max: 2.0, step: 0.2}
	});
  
	game.settings.register("cozy-player", "tooltipMaxItems", {
		name: "Token Tooltip: Max Items",
		hint: "Max number of informations to be shown in the tooltip.",
		scope: "client",
		config: true,
		default: 21,
    type: Number,
    range: {min: 1, max: 40, step: 1}
	});
  
	game.settings.register("cozy-player", "tooltipMaxRows", {
		name: "Token Tooltip: Max Rows",
		hint: "Max number of rows of informations. If this number is lower than the number of items, a new column is created.",
		scope: "world",
		config: true,
		default: 7,
    type: Number,
    range: {min: 1, max: 20, step: 1}
	});
  
  game.settings.register("cozy-player", "tooltipShowIcons", {
		name: "Token Tooltip: Show Icons",
    hint: "If an icon could not be found, the name of the feature will be used.",
		scope: "world",
		config: true,
		default: true,
		type: Boolean
	});
  
	game.settings.register("cozy-player", "tooltipShowName", {
		name: "Token Tooltip: Actor Name",
		scope: "world",
		config: true,
		default: "token",
		type: String,
		choices: {
      "no": "Don't show",
      "token": "Show token name",
      "actor": "Show actor name"
		}
	});
  
	game.settings.register("cozy-player", "tooltipShowHP", {
		name: "Token Tooltip: Show Hit Points",
		scope: "world",
		config: true,
		default: true,
		type: Boolean
	});
 
	game.settings.register("cozy-player", "tooltipShowAC", {
		name: "Token Tooltip: Show Armor Class",
		scope: "world",
		config: true,
		default: true,
		type: Boolean
	}); 
  
	game.settings.register("cozy-player", "tooltipShowSpeed", {
		name: "Token Tooltip: Show Speed",
		scope: "world",
		config: true,
		default: true,
		type: Boolean
	}); 
  
	game.settings.register("cozy-player", "tooltipPassivePerception", {
		name: "Token Tooltip: Show Passive Perception",
		scope: "world",
		config: true,
		default: true,
		type: Boolean
	}); 
  
	game.settings.register("cozy-player", "tooltipPassiveInsight", {
		name: "Token Tooltip: Show Passive Insight",
		scope: "world",
		config: true,
		default: true,
		type: Boolean
	}); 
  
	game.settings.register("cozy-player", "tooltipResources", {
		name: "Token Tooltip: Show Actor Resources",
		scope: "world",
		config: true,
		default: true,
		type: Boolean
	}); 
  
	game.settings.register("cozy-player", "tooltipFeats", {
		name: "Token Tooltip: Show Featues",
		scope: "world",
		config: true,
		default: true,
		type: Boolean
	}); 
  
	game.settings.register("cozy-player", "tooltipFavs", {
		name: "Token Tooltip: Show Tidy5esheet favorites",
		scope: "world",
		config: true,
		default: true,
		type: Boolean
	}); 
  
});