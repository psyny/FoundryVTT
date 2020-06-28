class ArmsReachVariables
{
  static door_interaction_lastTime = 0;
  static door_interaction_keydown = false;
  static door_interaction_cameraCentered = false;
  
  static lastData = {
    x: 0.0,
    y: 0.0,
    up: 0,
    down: 0,
    left: 0,
    right: 0
  };
}


// Sets the global maximum interaction distance
Hooks.once('init', () => {
  // Global interaction distance control. Replaces prototype function of DoorControl. Danger...
  if( game.settings.get("arms-reach", "globalInteractionDistance") > 0 ) {
    let originalMethod = DoorControl.prototype._onMouseDown;
    DoorControl.prototype._onMouseDown = function(event) {
      // Check distance
      if( !game.user.isGM ) {
        let character = getFirstPlayerToken();
        
        if( !character ) {
          iteractionFailNotification("No character is selected to interact with a door");
          return;
        }
        
        let dist = getManhattanBetween(this, getTokenCenter(character));
        let gridSize = canvas.dimensions.size;

        if ( (dist / gridSize) > game.settings.get("arms-reach", "globalInteractionDistance") ) {
          var tokenName = getCharacterName(character);
          if (tokenName) iteractionFailNotification("Door not within " + tokenName + "'s reach" );
          else iteractionFailNotification("Door not in reach" );
          return;
        }
      }

      // Call original method
      return originalMethod.apply(this,arguments);
    };
  }
});

// Door interaction
document.addEventListener('keydown', evt => {
	if (evt.key === 'e') {
    if(!game.settings.get("arms-reach", "hotkeyDoorInteractionCenter")) { return; }
    if(ArmsReachVariables.door_interaction_cameraCentered) { return; }
    
    if( !isFocusOnCanvas() ) { return; }
    
    if( ArmsReachVariables.door_interaction_keydown == false ) {
      ArmsReachVariables.door_interaction_lastTime = Date.now();
      ArmsReachVariables.door_interaction_keydown = true;
    } else {
      // Center camera on character (if  key was pressed for a time)
      let diff = Date.now() - door_interaction_lastTime;
      if( diff > 500 ) {
        door_interaction_lastTime = Date.now();
        let character = getFirstPlayerToken();
        if( !character ) {
          iteractionFailNotification("No character is selected to center camera on.");
          return;
        }
        
        ArmsReachVariables.door_interaction_cameraCentered = true;
        canvas.animatePan({x: character.x, y: character.y});
      }
    }
  }
});

document.addEventListener('keyup', evt => {
	if (evt.key === 'e') {
    ArmsReachVariables.door_interaction_keydown = false;

    if(ArmsReachVariables.door_interaction_cameraCentered) {
      ArmsReachVariables.door_interaction_cameraCentered = false;
      return;
    }
    
    if( !isFocusOnCanvas() ) { return; }
    
    if (!game.settings.get("arms-reach", "hotkeyDoorInteraction")) return;   
    
    // Get first token ownted by the player 
    let character = getFirstPlayerToken();
    
    if( !character ) {
      iteractionFailNotification("No character is selected to interact with a door.");
      return;
    }
    
    interactWithNearestDoor(character,0,0);
	}
});

// Double Tap to open nearest door -------------------------------------------------
document.addEventListener('keyup', evt => {
	if (evt.key === 'ArrowUp' || evt.key === 'w') {
    if(!game.settings.get("arms-reach", "hotkeyDoorInteractionDT")) { return; }
    ifStuckInteract('up', 0, -0.5);
  }
  
	if (evt.key === 'ArrowDown' || evt.key === 's') {
    if(!game.settings.get("arms-reach", "hotkeyDoorInteractionDT")) { return; }
    ifStuckInteract('down', 0, +0.5);
  }
  
	if (evt.key === 'ArrowRight' || evt.key === 'd') {
    if(!game.settings.get("arms-reach", "hotkeyDoorInteractionDT")) { return; }
    ifStuckInteract('right', +0.5, 0);
  }
  
	if (evt.key === 'ArrowLeft' || evt.key === 'a') {
    if(!game.settings.get("arms-reach", "hotkeyDoorInteractionDT")) { return; }
    ifStuckInteract('left', -0.5, 0);
  }
});

function ifStuckInteract(key, offsetx, offsety) {
  let character = getFirstPlayerToken();
  if(!character) return;
  
  if( Date.now() - ArmsReachVariables.lastData[key] > 300 ) {
    ArmsReachVariables.lastData.x = character.x;
    ArmsReachVariables.lastData.y = character.y;
    ArmsReachVariables.lastData[key] = Date.now();
    return;
  }
  
  // See if character is stuck
  if(character.x == ArmsReachVariables.lastData.x && character.y == ArmsReachVariables.lastData.y) {
    interactWithNearestDoor(character, offsetx, offsety);
  }
}

// Interact with door ------------------------------------------------------------------
function interactWithNearestDoor(token, offsetx = 0, offsety = 0) {
    // Max distance definition
    let gridSize = canvas.dimensions.size;
    let maxDistance = Infinity;
    let globalMaxDistance = game.settings.get("arms-reach", "globalInteractionDistance");
    if( globalMaxDistance > 0 ) {
      if( globalMaxDistance < maxDistance ) maxDistance = globalMaxDistance;
    } else {
      maxDistance = game.settings.get("arms-reach", "doorInteractionDistance");
    }
      
    // Shortest dist
    let shortestDistance = Infinity;
    var closestDoor = null;

    // Find closest door
    let charCenter = getTokenCenter(token);
    charCenter.x += offsetx * gridSize;
    charCenter.y += offsety * gridSize;
    
    for( let i = 0; i < canvas.controls.doors.children.length ; i++ ) {
      let door = canvas.controls.doors.children[i];
      
      let dist = getManhattanBetween(door, charCenter);
      let distInGridUnits = (dist / gridSize) - 0.1;

      
      if ( distInGridUnits < maxDistance && dist < shortestDistance ) {
        closestDoor = door;
        shortestDistance = dist;
      }
    }
    
    // Operate the door
    if(closestDoor) {
      // Create a fake function... Ugly, but at same time take advantage of existing door interaction function of core FVTT
      let fakeEvent = { stopPropagation: event => {return;} };
      closestDoor._onMouseDown(fakeEvent);
    } else {
      
      var tokenName = getCharacterName(token);

      if (tokenName) iteractionFailNotification("No door was found within " + tokenName + "'s reach" );
      else iteractionFailNotification("No door was found within reach" );
      return;
    }
}

// Get token center
function getTokenCenter(token) {
    let tokenCenter = {x: token.x , y: token.y };
    tokenCenter.x += -20 + ( token.w * 0.50 );
    tokenCenter.y += -20 + ( token.h * 0.50 );
    return tokenCenter;
}

// Get chracter name from token
function getCharacterName(token) {
  var tokenName = null;
  if( token.name ) {
    tokenName = token.name;
  } else if (token.actor && token.actor.data && token.actor.data.name) {
    tokenName = token.actor.data.name;
  }
  return tokenName;
}

// Interation fail messages
function iteractionFailNotification(message) {
  if( !game.settings.get("arms-reach", "notificationsInteractionFail") ) return;
  ui.notifications.warn(message);
}


// Returns the first selected token or owned token
function getFirstPlayerToken() {
    // Get first token ownted by the player 
    let selectedTokens = getSelectedOrOwnedTokens();
    if(!selectedTokens || selectedTokens.length == 0) return null;
    return selectedTokens[0];  
}

// Returns a list of selected (or owned, if no token is selected)
function getSelectedOrOwnedTokens() 
{
  var controlled = canvas.tokens.controlled;
  if( controlled.length == 0 ) controlled = canvas.tokens.ownedTokens;
  return controlled;
}

// Simple Manhattan Distance between two objects that have x and y attrs.
function getManhattanBetween(obj1, obj2)  {
  // console.log("[" + obj1.x + " , " + obj1.y + "],[" + obj2.x + " , " + obj2.y + "]"); // DEBUG
  return Math.abs(obj1.x - obj2.x) + Math.abs(obj1.y - obj2.y);
}

// Check if active document is the canvas
function isFocusOnCanvas() {
  if(   !document.activeElement || 
        !document.activeElement.attributes ||
        !document.activeElement.attributes['class'] ||
        document.activeElement.attributes['class'].value.substr(0,8) !== "vtt game" 
    ) 
  { 
    return false;
  }
  else 
  { 
    return true;
  }
}