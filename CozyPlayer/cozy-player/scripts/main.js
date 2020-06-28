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
      control.activeTool = "select";
      rollSkill('prc');
			return;
		}
	});
  
	control.tools.push({
		name: "insight",
		title: "Insight",
		icon: "fas fa-brain",
		visible: game.settings.get("cozy-player", "toolbarShowSkills"),
		onClick: () => {
      control.activeTool = "select";
      rollSkill('ins');
			return;
		}
	});
	
	control.tools.push({
		name: "investigation",
		title: "Investigation",
		icon: "fas fa-search",
		visible: game.settings.get("cozy-player", "toolbarShowSkills"),
		onClick: () => {
      control.activeTool = "select";
      rollSkill('inv');
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
  
	control.tools.push({
		name: "sethp",
		title: "Set Hit Points",
		icon: "fas fa-heart",
		visible: game.settings.get("cozy-player", "toolbarSetHP"),
		onClick: () => {
      control.activeTool = "select";
			setHP_dialog();
		}
	});
});



// ----------------------------------------------------------------------------------
function getSelectedOrOwnedTokens() 
{
  var controlled = canvas.tokens.controlled;
  if( controlled.length == 0 ) controlled = canvas.tokens.ownedTokens;
  return controlled;
}

async function rollSkill(skillName)
{
	var controlled = getSelectedOrOwnedTokens();
	var actors = [];
	var tgTkn;
	
  if( controlled.length == 0 ) {
    actors.push( game.user.character );
  } else {
    for (let i = 0; i < controlled.length; i++) {
      var tkn = controlled[i];
      actors.push( tkn.actor );
    }
  }
  
  for (let i = 0; i < actors.length; i++) {
    actors[i].rollSkill(skillName );
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
    ui.notifications.error("Can't roll initiative: theres no active encounter");
		return;
	}
	
	// Get Selected Tokens
	var controlled = getSelectedOrOwnedTokens();
	var notInCombat = [];
	var tgTkn;
	
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
		if(win && win.options && win.options.baseApplication === "ActorSheet")
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
  if(!game.combat) {
    ui.notifications.warn("No active encounter, can't pass turn");
    return;
  }
  
	var combatant = game.combat.combatant;
	if(combatant && combatant.actor && combatant.actor.permission == ENTITY_PERMISSIONS["OWNER"] )
	{
		game.combat.nextTurn();
	} else {
    ui.notifications.warn("It's not your tuen");
  }
}

// Add HP Dialog
function setHP_dialog() {
  // Get token data
  let tokens = getSelectedOrOwnedTokens();
  if(!tokens) return;
  
  let content = "<b>Affected Tokens: </b> ";
  let firstFlag = true;
  for(let i = 0; i < tokens.length; i++ ) {
    if (firstFlag == true ) firstFlag = false;
    else content += ', ';
    
    let token = tokens[i];
    content += token.name ? token.name : token.actor ? token.actor.data.name : "nameless";
  }
  
  content += `<br><br><div class="form-group">
                    <label><b>Value</b> </label>
                    <input name="hpvalue" value="0" placeholder="Value"/>
                  </div><br><b>Examples:</b> +5 , -5, =5. If no operator is defined: operator + will be used.`;

  // Dialog
  let dialog =  new Dialog({
        title: "Set Hit Points",
        content: content,
        buttons: {
          hp: {
            icon: '<i class="fas fa-heart"> Set HP</i>',
            label: "",
            callback: html => {
              let valString = html.find('input[name="hpvalue"]').val();
              setHP_hp(tokens, valString);
            }
          },
          temphp: {
            icon: '<i class="fas fa-shield-alt"> Set Temporary HP</i>',
            label: "",
            callback: html => {
              let valString = html.find('input[name="hpvalue"]').val();
              setHP_temp(tokens, valString);
            }
          }
        },
        default: "hp"
      }).render(true);
}

function buildValueData(valueString) {
  let valueData = {};
  let opCandidate = valueString.slice(0,1);
  let valueCandidate = "";
  
  if(opCandidate === "=") {
    valueData['toSet'] = true;
    valueCandidate = valueString.slice(1);
  } else {
    valueData['toSet'] = false;
    valueCandidate = valueString;
  }

  valueData['value'] = parseInt(valueCandidate);
  return valueData;
}

function setHP_hp(tokens, valueString) {   
  let valueData = buildValueData(valueString);

	for (let i = 0; i < tokens.length; i++) {
		let token = tokens[i];
    
    let hp_cur = token.actor.data.data.attributes.hp.value;
    let hp_max = token.actor.data.data.attributes.hp.max;
    
    let hp_new = valueData.toSet == true ? valueData.value : hp_cur + valueData.value;
    hp_new = hp_new > hp_max ? hp_max : hp_new;

    token.actor.update({'data.attributes.hp.value': hp_new});
	}
}

function setHP_temp(tokens, valueString) {
  let valueData = buildValueData(valueString);
  if( isNaN(valueData.value) ) return;

	for (let i = 0; i < tokens.length; i++) {
		let token = tokens[i];
    
    let hp_cur = parseInt(token.actor.data.data.attributes.hp.temp);
    let hp_max = parseInt(token.actor.data.data.attributes.hp.tempmax);
    
    hp_cur = isNaN() ? 0 : hp_cur;
    hp_max = isNaN() ? 0 : hp_max;
    
    let hp_new = valueData.toSet == true ? valueData.value : hp_cur + valueData.value;
    
    let dataToUpdate = {};
    
    if( hp_new > hp_max ) dataToUpdate['data.attributes.hp.tempmax'] = hp_new;
    dataToUpdate['data.attributes.hp.temp'] = hp_new;
    
    token.actor.update(dataToUpdate);
	}
}