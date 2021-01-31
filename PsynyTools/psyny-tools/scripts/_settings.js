import { MOD_ID } from './_meta.js';

Hooks.once("init", () => {
  game.settings.register(MOD_ID, "recurrentSkills", {
		name: "Left Toolbar: Show Skills",
    hint: "Adds buttons to the left tool bar to roll perception, insight and investigation",
		scope: "world",
		config: true,
		default: true,
		type: Boolean
	});
  
  game.settings.register(MOD_ID, "encounterTools", {
		name: "Left Toolbar: Turn Tools",
    hint: "Adds buttons to the left tool bar to roll initiative and end turn",
		scope: "world",
		config: true,
		default: true,
		type: Boolean
	});
 

  game.settings.register(MOD_ID, "setHP", {
		name: "Left Toolbar: Set HP and Temp HP",
    hint: "Add a button to change one or more tokens HP and Temporary HP.",
		scope: "world",
		config: true,
		default: true,
		type: Boolean
	});


  game.settings.register(MOD_ID, "targetTools", {
		name: "Left Toolbar: Targets to Chat",
    hint: "Add a button to send current target selections to chat.",
		scope: "world",
		config: true,
		default: true,
		type: Boolean
	});
});