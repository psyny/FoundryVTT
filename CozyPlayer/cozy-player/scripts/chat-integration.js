// Hover attributes
let _lastHoveredToken = null;

let _onChatNameHover = (event) => {
  event.preventDefault();
  if ( !canvas.scene.data.active ) return;
  
  const token = canvas.tokens.get(event.currentTarget.id);
  if ( token && token.isVisible ) {
    _lastHoveredToken = token;
    token._onHoverIn(event);
  }
}

let _onChatNameOut = (event) => {
  event.preventDefault();
  if ( !canvas.scene.data.active ) return;
  
  if (_lastHoveredToken ) {
    _lastHoveredToken._onHoverOut(event);
    _lastHoveredToken = null;
  }
}

function _selectToken(tokenId, multiselect = true) {
  const token = canvas.tokens.get(tokenId);
  if(!token) return;
  if(!token.control) return;
  
  if( multiselect )  token.control({ multiSelect: true, releaseOthers: false });
  else token.control({ multiSelect: false, releaseOthers: true });   
}

let _onChatNameClick = (event) => {
  event.preventDefault();
  if ( !canvas.scene.data.active ) return;
  
  _selectToken(event.currentTarget.id, keyboard.isDown("Shift"));                   
};

let _onChatNameClick_all = (event) => {
  event.preventDefault();
  if ( !canvas.scene.data.active ) return;
  
  let parentNode = event.currentTarget.parentNode;
  let brotherNodes = parentNode.childNodes;
  
  if(brotherNodes.length < 2) return;
  
  _selectToken(brotherNodes[1].id, keyboard.isDown("Shift"));
  
  for(let i = 2; i < brotherNodes.length; i++) {
    _selectToken(brotherNodes[i].id, true);
  }                    
};


// Find sender HTML part and attach listeners to it
Hooks.on("renderChatMessage", function (chatMessage, html, messageData) { 
  // Ignore old messages
  if (Date.now() - chatMessage.data.timestamp > 5000) {
    return;
  }
  
  // Adds token selection via sender name click
  let searchResults = html.find(".message-sender");

  if( game.settings.get("cozy-player", "chatActorTokenIntegration") ) {
    if(searchResults.length > 0) {
      searchResults[0].setAttribute("id", messageData.message.speaker.token);
      searchResults[0].setAttribute("hoverable", "true");
     
      searchResults.hover(_onChatNameHover, _onChatNameOut);
      searchResults.click(_onChatNameClick);
    }
  }
  
  // Adds attack targets
  if( game.settings.get("cozy-player", "targetsShowOnRoll") === "all" ) {
    if(chatMessage.isRoll) {
      //if(chatData.flavor.includes("Attack Roll")) {};
      
      // Build targets message
      let targetNodes = getTargetsHTML();
      if(targetNodes.length > 0) {
        // Create Base Info
        let targetsDiv = document.createElement("div");
        targetsDiv.setAttribute("class", "targetList");
        
        let targetsLabel = document.createElement("span");
        targetsLabel.setAttribute("class", "targetListLabel");
        targetsLabel.innerHTML = `<b>TARGETS:</b>`;
        targetsDiv.append(targetsLabel);
        
        // Add targets
        for(let i = 0; i < targetNodes.length; i++) {
          targetNode = targetNodes[i];
          targetsDiv.append(targetNode);
        }
        
        // append back to the message html
        html[0].append(targetsDiv);
        
        // Append hover functions
        if( game.settings.get("cozy-player", "chatActorTokenIntegration") ) {
          let targetTokens = html.find(".targetToken");
          targetTokens.hover(_onChatNameHover, _onChatNameOut);
          targetTokens.click(_onChatNameClick);
          
          let targetLabel = html.find(".targetListLabel");
          targetLabel.click(_onChatNameClick_all);
        }
        
        // Deselect all
        if( game.settings.get("cozy-player", "targetsClearOnRoll") ) clearTargets();
      }
    }
  }
});

// Clear Targets
function clearTargets() {
  const targets = game.user.targets.values();
  for(let target = targets.next(); !target.done; target = targets.next())
  {
    target.value.setTarget(false, { user: game.user, releaseOthers: false });
  }
  game.user.targets = new Set();
}

// Turn End Clear Markers
var previousTurn = "";
Hooks.on("updateCombat", (combat, update, options, user) => {
  if( !game.settings.get("cozy-player", "targetsClearOnTurnEnd") ) return;
  
  if( previousTurn === "" ) {
    clearTargets();
    previousTurn = combat.current.tokenId;
    return;
  }
  
  if( canvas.tokens.controlled.map(t=>t.id).includes(previousTurn) ) {
    clearTargets();
    previousTurn = combat.current.tokenId;
    return;
  }
});

// Get Selected Targets (returns a token list)
function getSelectedTargets()
{
  let targetList = [];
  
  const targets = game.user.targets.values();
  for(let target = targets.next(); !target.done; target = targets.next())
  {
    targetList.push(target.value);
  }
  
  return targetList;
}

// Returns HTML nodes with selected targets info
function getTargetsHTML()
{
  let targets = getSelectedTargets();
  if(targets.length == 0) {
    return [];
  }
  
  let targetsHTML = [];
  
  for(let i = 0; i < targets.length; i++) {
    let token = targets[i];

    let targetDiv = document.createElement("span");
    targetDiv.setAttribute("class", "targetToken");
    targetDiv.setAttribute("id", token.id);
    targetDiv.innerHTML = token.name;

    targetsHTML.push(targetDiv);
  }

  return targetsHTML;
}