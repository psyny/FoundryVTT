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
          iteractionFailNotification("No character is selected to interact with a door.");
          return;
        }
        
        let dist = getManhattanBetween(this, character);
        let gridSize = canvas.dimensions.size;

        if ( (dist / gridSize) > game.settings.get("arms-reach", "globalInteractionDistance") ) return;
      }

      // Call original method
      return originalMethod.apply(this,arguments);
    };
  }
});

// Door interaction
let door_interaction_lastTime = 0;
let door_interaction_keydown = false;
let door_interaction_cameraCentered = false;

document.addEventListener('keydown', evt => {
	if (evt.key === 'e') {
    if(!game.settings.get("arms-reach", "hotkeyDoorInteractionCenter")) { return; }
    if(door_interaction_cameraCentered) { return; }
    
    if(   !document.activeElement || 
      !document.activeElement.attributes ||
      !document.activeElement.attributes['class'] ||
      document.activeElement.attributes['class'].value !== "vtt game" 
    ) { return; }
    
    if( door_interaction_keydown == false ) {
      door_interaction_lastTime = Date.now();
      door_interaction_keydown = true;
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
        
        door_interaction_cameraCentered = true;
        canvas.animatePan({x: character.x, y: character.y});
      }
    }
  }
});

document.addEventListener('keyup', evt => {
	if (evt.key === 'e') {
    door_interaction_keydown = false;

    if(   !document.activeElement || 
          !document.activeElement.attributes ||
          !document.activeElement.attributes['class'] ||
          document.activeElement.attributes['class'].value !== "vtt game" 
      ) { return; }
    
    if(door_interaction_cameraCentered) {
      door_interaction_cameraCentered = false;
      return;
    }
    
    if (!game.settings.get("arms-reach", "hotkeyDoorInteraction")) return;   
    
    // Get first token ownted by the player 
    let character = getFirstPlayerToken();
    
    if( !character ) {
      iteractionFailNotification("No character is selected to interact with a door.");
      return;
    }

    // Distance calculation reqs.
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
    for( let i = 0; i < canvas.controls.doors.children.length ; i++ ) {
      let door = canvas.controls.doors.children[i];
      
      let dist = getManhattanBetween(door, character);
      let distInGridUnitys = (dist / gridSize)
      
      if ( distInGridUnitys < maxDistance && dist < shortestDistance ) {
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
      
      var tokenName = null;
      if( character.name ) {
        tokenName = character.name;
      } else if (character.actor && character.actor.data && character.actor.data.name) {
        tokenName = character.actor.data.name;
      }
      
      if (tokenName) iteractionFailNotification("No door was found within " + tokenName + "'s reach" );
      else iteractionFailNotification("No door was found within reach" );
      return;
    }
	}
});

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
  return Math.abs(obj1.x - obj2.x) + Math.abs(obj1.y - obj2.y);
}