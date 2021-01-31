import { MOD_ID } from './_meta.js';

Hooks.once("init", () => {
  game.settings.register(MOD_ID, "sheetsActionOnRoll", {
		name: "Sheets: Action on roll",
    hint: "Minimizes or closes the character sheet when the user clicks on something that promps a roll",
		scope: "client",
		config: true,
		default: "minimize",
		type: String,
		choices: {
      "none": "Do nothing",
      "minimize": "Minimize sheet",
      "close": "Close sheet"
		}
	});
  
  game.settings.register(MOD_ID, "chatIntegrationHover", {
		name: "Chat Integration: Hover",
    hint: "Simulates token hovering when hovering a token name on chat.",
		scope: "world",
		config: true,
		default: true,
		type: Boolean
	});
  
  game.settings.register(MOD_ID, "chatIntegrationClick", {
		name: "Chat Integration: Click",
    hint: "Simulates token selection when clicking a token name on chat.",
		scope: "world",
		config: true,
		default: true,
		type: Boolean
	});
  
  game.settings.register(MOD_ID, "targetsSendToChat", {
		name: "Targets: Add to chat",
    hint: "Attach current targets to chat message in some situations. WARNING! Implicit moode have the greater performance hit, but is more compatible with better rolls module.",
		scope: "world",
		config: true,
		default: "explicit",
		type: String,
		choices: {
      "none": "Never",
      "explicit": "On explicit rolls",
      "implicit": "On implicit rolls",
      "all": "On any message"
		}
	});
  
  game.settings.register(MOD_ID, "targetsClearOnRoll", {
		name: "Targets: Clear on Attach",
    hint: "Deselects all targets when attaching them to a message.",
		scope: "client",
		config: true,
		default: true,
		type: Boolean
	});
  
  game.settings.register(MOD_ID, "targetsClearOnTurnEnd", {
		name: "Targets: Clear on Turn End",
    hint: "Deselects all targets when passing your turn.",
		scope: "client",
		config: true,
		default: true,
		type: Boolean
	});
  
  // HOTKEYS -------------------------------------------------------------
  
	game.settings.register(MOD_ID, "hotkeyHidePlayersList", {
		name: "Hotkey 'p': hide player list",
		hint: "Pressing 'p' hide/show bottom left player list",
		scope: "world",
		config: true,
		default: true,
		type: Boolean
	});
  
	game.settings.register(MOD_ID, "hotkeySwitchSelectTarget", {
		name: "Hotkey 'q' for switch select",
		hint: "Pressing 'q' will switch between 'select' and 'target' tool.",
		scope: "world",
		config: true,
		default: true,
		type: Boolean
	});
  
  
  
});