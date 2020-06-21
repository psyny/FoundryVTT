// Confort Shortcuts on default bar
Hooks.on('getSceneControlButtons', controls => {
	let control = controls.find(c => c.name === "token") || controls[0];
  
  control.tools.push({
		name: "chattargets",
		title: "Send Targets to Chat",
		icon: "fas fa-hand-point-down",
		visible: game.settings.get("cozy-player", "toolbarTargetTools"),
		onClick: () => {
      control.activeTool = "select";
      targetsToChat_dialog();
			return;
		}
	});
});


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
  
  // Adds token interaction via sender name click
  if( game.settings.get("cozy-player", "chatActorTokenIntegration") ) {
    let searchResults = html.find(".message-sender");
    
    if(searchResults.length > 0) {
      searchResults[0].setAttribute("id", messageData.message.speaker.token);
      searchResults[0].setAttribute("hoverable", "true");
      
      searchResults[0].classList.add("psnhoverable");
      searchResults[0].classList.add("psnclickable");
    }
  }
  
  // Adds attack targets
  if( game.settings.get("cozy-player", "targetsShowOnRoll") === "all" ) {
    if(chatMessage.isRoll) {
      //if(chatData.flavor.includes("Attack Roll")) {};
      
      // Build targets message
      let targetNodes = getTargetsHTML_nameList();
      if(targetNodes.length > 0) {
        // Create Base Info
        let targetsDiv = document.createElement("div");
        targetsDiv.classList.add("targetList");
        
        let targetsLabel = document.createElement("span");
        targetsLabel.classList.add("targetListLabel");
        targetsLabel.innerHTML = `<b>TARGETS:</b>`;
        targetsDiv.append(targetsLabel);
        
        // Add targets
        for(let i = 0; i < targetNodes.length; i++) {
          targetNode = targetNodes[i];
          targetsDiv.append(targetNode);
        }
        
        // append back to the message html
        html[0].append(targetsDiv);
        
        // Add target all hover function
        if( game.settings.get("cozy-player", "chatActorTokenIntegration") ) {
          let targetsLabelList = html.find(".targetListLabel");
          if(targetsLabelList) targetsLabelList.click(_onChatNameClick_all);
        }

        // Deselect all
        if( game.settings.get("cozy-player", "targetsClearOnRoll") ) clearTargets();
      }
    }
  }
  
  // Add hover and functions 
  if( game.settings.get("cozy-player", "chatActorTokenIntegration") ) {
    let hoverableList = html.find(".psnhoverable");
    if(hoverableList) hoverableList.hover(_onChatNameHover, _onChatNameOut);
    
    let clickableList = html.find(".psnclickable");
    if(clickableList) clickableList.click(_onChatNameClick);
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
function getTargetedTokens()
{
  let targetList = [];
  
  const targets = game.user.targets.values();
  for(let target = targets.next(); !target.done; target = targets.next())
  {
    targetList.push(target.value);
  }
  
  return targetList;
}

// Marks an html element to receive hover and click functions
function markHtmlElement(htmlElement, tokenId)
{
    htmlElement.classList.add("targetToken");
    htmlElement.classList.add("psnhoverable");
    htmlElement.classList.add("psnclickable");
    htmlElement.setAttribute("id", tokenId);
}



// Returns HTML node with prepared hover info for a given node: returns element for token IMG
function getTokenHTML_Img(token, size = 30, borderSize = 0) {
  if( !token ) return null;
  
  let imgSrc = token.img || token.data.img || (token.actor && token.actor.img);
  if( !imgSrc ) return null;
  
  let img = document.createElement("img");
  img.src = imgSrc;
  img.width = size;
  img.height = size;
  img.border = 0;
  
  img.setAttribute("style","border: " + borderSize + "px;");
  
  markHtmlElement(img, token.id);

  return img;
}


// Returns HTML node with prepared hover info for a given node: returns element for token name (span)
function getTokenHTML_Span(token)
{
  let newElement = document.createElement("span");
  markHtmlElement(newElement, token.id);
  newElement.innerHTML = token.name;
  return newElement;
}

// Returns HTML nodes with selected targets info: list of namespan
function getTargetsHTML_nameList()
{
  let targets = getTargetedTokens();
  if(targets.length == 0) {
    return [];
  }
  
  let targetsHTML = [];
  
  for(let i = 0; i < targets.length; i++) {
    let token = targets[i];

    let spanElement = getTokenHTML_Span(token);
    targetsHTML.push(spanElement);
  }

  return targetsHTML;
}


// Show current targets in chatActorTokenIntegration
function targetsToChat_dialog() {
  if(!game.user.isGM) {
    this.targetsToChat(false);
    return;
  }
  
  let dialog =  new Dialog({
      title: "Random Target",
      content: "<br>Pick only one random target from current selection?<br><br>",
      buttons: {
        yes: {
          icon: '<i class="fas fa-check-circle"></i>',
          label: "",
          callback: () => { this.targetsToChat(true) }
        },
        no: {
          icon: '<i class="fas fa-times-circle"></i>',
          label: "",
          callback: () => { this.targetsToChat(false) }
        }
      },
      default: "yes"
    }).render(true);
}

function targetsToChat(pickRandom = false) {
  // Get the speaker
  let speaker = ChatMessage.getSpeaker();
  if(!speaker.actor && game.user.character) speaker = ChatMessage.getSpeaker({actor: game.user.character});
  
  // Get selected tokens
  let targetedTokens = getTargetedTokens();
  if( targetedTokens.length == 0) return;
  
  // Build message contents
  let flavor = "";
  if(pickRandom) {
    flavor = "Picks a random target";
    
    let index = Math.floor( Math.random() * targetedTokens.length );
    let target = targetedTokens[index];
    targetedTokens = [];
    targetedTokens.push(target);
  } else {
    flavor = "Points to targets";
  }
  
  let content = "";
  const imgSize = 30;
  if( targetedTokens.length > 0 ) {

    content += `<table style="width:100%; border: 0px">`;
    
    for(let i = 0; i < targetedTokens.length; i++) {
      let token = targetedTokens[i];
      let imgHTML = getTokenHTML_Img(token,imgSize);
      let nameHTML = getTokenHTML_Span(token);
      
      let line = `<tr><td style="width:` + (imgSize + 5) + `px;">`;
      line += imgHTML.outerHTML + `</td><td>` + nameHTML.outerHTML;
      line += `</td></tr>`;
      content += line;
    }
    
    content += `</table>`;
  }


  // Show message
  let messageData ={
      flavor: flavor,
      content: content,
      speaker: speaker
  };
  ChatMessage.create(messageData);
}