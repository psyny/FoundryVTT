Hooks.on('createChatMessage', (chatMessage) => {
    if (!chatMessage.isRoll || !chatMessage.isContentVisible) {
        return;
    }

    closeSheets();
});

// Confort Shortcuts on default bar
Hooks.on('getSceneControlButtons', controls => {
	let control = controls.find(c => c.name === "token") || controls[0];
	
	control.tools.push({
		name: "perception",
		title: "Perception",
		icon: "fas fa-eye",
		visible: game.settings.get("cozy-player", "toolbarShowSkills"),
		onClick: () => {
      rollSkill('prc');
      control.activeTool = "select";
			return;
		}
	});
  
	control.tools.push({
		name: "insight",
		title: "Insight",
		icon: "fas fa-brain",
		visible: game.settings.get("cozy-player", "toolbarShowSkills"),
		onClick: () => {
      rollSkill('ins');
      control.activeTool = "select";
			return;
		}
	});
	
	control.tools.push({
		name: "investigation",
		title: "Investigation",
		icon: "fas fa-search",
		visible: game.settings.get("cozy-player", "toolbarShowSkills"),
		onClick: () => {
      rollSkill('inv');
      control.activeTool = "select";
			return;
		}
	});  
  
	control.tools.push({
		name: "rollinitiative",
		title: "Roll Initiative",
		icon: "fas fa-flag-checkered",
		visible: game.settings.get("cozy-player", "toolbarTurnTools"),
		onClick: () => {
      control.activeTool = "select";
			enterCombatAndRollInitative();
		}
	});
	
	control.tools.push({
		name: "endturn",
		title: "End Turn",
		icon: "fas fa-step-forward",
		visible: game.settings.get("cozy-player", "toolbarTurnTools"),
		onClick: () => {
      control.activeTool = "select";
			endTurn();
		}
	});
});

// ----------------------------------------------------------------------------------
async function rollSkill(skillName)
{
	var controlled = canvas.tokens.controlled;
	var actors = [];
	var tgTkn;
	
	if( controlled.length == 0 ) controlled = canvas.tokens.ownedTokens;
  
  if( controlled.length == 0 ) {
    actors.push( game.user.character );
  } else {
    for (let i = 0; i < controlled.length; i++) {
      var tkn = controlled[i];
      actors.push( tkn.actor );
    }
  }
  
  for (let i = 0; i < actors.length; i++) {
    actors[i].rollSkill(skillName);
  }
}

async function enterCombatAndRollInitative()
{
	
	/* 
	// Reference: how to create a combat... useful for when the player wants to start a combat
	// WIP
	if(!game.combat) {
		let scene = game.scenes.viewed;
		if ( !scene ) return;
		let cbt = await game.combats.object.create({scene: scene._id});
		await cbt.activate();
	}
	*/
	
	if(!game.combat && !game.user.isGM ) {
		return;
	}
	
	// Get Selected Tokens
	var controlled = canvas.tokens.controlled;
	var notInCombat = [];
	var tgTkn;
	
	if( controlled.length == 0 )
	{
		controlled = canvas.tokens.ownedTokens;
	}
	
	for (let i = 0; i < controlled.length; i++) {
		var tkn = controlled[i];
		if( !tkn.inCombat )
		{
			tgTkn = tkn;
			notInCombat.push(tkn.id);
		}
	}
	
	
	// If any token was marked, toggle combat.
	// For some reason, all selected tokens will be toggled to combat...
	if(tgTkn)
	{
		await tgTkn.toggleCombat();
	}
	
	// Get combatants that was not in combat before
	var toRoll = [];
	for (let i = 0; i < notInCombat.length; i++) {
			var tokenId = notInCombat[i];
			var combatant = await game.combat.getCombatantByToken(tokenId);
			if(combatant)
			{
				toRoll.push(combatant._id);
			}
	}
	
	// Roll for selected tokens that was not in combat before
	if( toRoll.length > 0 )
	{
		game.combat.rollInitiative(toRoll);
	}
}

// Close opened sheets
async function closeSheets()
{
  if(game.settings.get("cozy-player", "sheetsActionOnRoll") === "none" ) return;
  
	for(appId in ui.windows)
	{
		const win = ui.windows[appId];
		if(win && win.options && win.options.baseApplication == "ActorSheet")
		{
      if(game.settings.get("cozy-player", "sheetsActionOnRoll") === "minimize") win.minimize();
      else win.close();
		}
	}
	return;
}


// Designed to player end current turn if its owner of current turn actor
async function endTurn()
{
	var combatant = game.combat.combatant;
	if(combatant && combatant.actor && combatant.actor.permission == ENTITY_PERMISSIONS["OWNER"] )
	{
		game.combat.nextTurn();
	}
}