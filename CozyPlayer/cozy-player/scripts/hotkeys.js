Hooks.once('init', () => {
  // Interaction Dist control. Replaces prototype function of DoorControl. Danger...
  if( game.settings.get("cozy-player", "interactionDist") > 0 ) {
    let originalMethod = DoorControl.prototype._onMouseDown;
    DoorControl.prototype._onMouseDown = function(event) {
      // Check distance
      let character = getFirstPlayerToken();
      let dist = getManhattanBetween(this, character);
      let gridSize = canvas.dimensions.size;

      if (!game.user.isGM && ( (dist / gridSize) > game.settings.get("cozy-player", "interactionDist") )) return;
      
      // Call original method
      return originalMethod.apply(this,arguments);
    };
  }
});

// Open Close Doors
let key_e_downtime = 0;
let key_e_isdown = false;
document.addEventListener('keydown', evt => {
	if (evt.key === 'e') {
    if (!game.settings.get("cozy-player", "hotkeyInteraction")) return;  
    
    if( key_e_isdown == false ) {
      key_e_downtime = Date.now();
      key_e_isdown = true;
    } else {
      // Center camera on character (if  key was pressed for a time)
      let diff = Date.now() - key_e_downtime;
      if( diff > 500 ) {
        key_e_downtime = Date.now();
        let character = getFirstPlayerToken();
        canvas.animatePan({x: character.x, y: character.y});
      }
    }
  }
});

document.addEventListener('keyup', evt => {
	if (evt.key === 'e') {
    if (!game.settings.get("cozy-player", "hotkeyInteraction")) return;   
    key_e_isdown = false;
    
    // Get first token ownted by the player 
    let character = getFirstPlayerToken();

    // Grid Size
    let gridSize = canvas.dimensions.size;
    let maxDistance = game.settings.get("cozy-player", "interactionDist") == 0 ? Infinity : game.settings.get("cozy-player", "interactionDist");
    
    // Shortest dist
    let shortestDistance = Infinity;
    var closestDoor = null;

    // Find closest door
    for( let i = 0; i < canvas.controls.doors.children.length ; i++ ) {
      let door = canvas.controls.doors.children[i];
      
      let dist = getManhattanBetween(door, character);
      
      if ( ( (dist / gridSize) < maxDistance ) && dist < shortestDistance ) {
        closestDoor = door;
        shortestDistance = dist;
      }
    }
    
    // Create a fake function... Ugly, but at same time take advantage of existing door interaction function
    let fakeEvent = { stopPropagation: event => {return;} };
    if(closestDoor) closestDoor._onMouseDown(fakeEvent);
	}
});

// Select and Target alternate
document.addEventListener('keyup', evt => {
  if (evt.key === 'q') {
    if (!game.settings.get("cozy-player", "hotkeySwitchSelectTarget")) return;   
    
    // Change to token layer, if not there
    if( ui.controls.control.name !== "token" )
    {
      clearTargets();
      const control = ui.controls.controls.find(c => c.name === "token");
      if ( control && control.layer ) canvas.getLayer(control.layer).activate();
    } 
    else 
    {
      // on token layer, check active toolbar
      if( ui.controls.activeTool === "select" ) {
        // On select, change to target
        clearTargets();
        selectTool("target");
      } else {
        // On target, change to select
        clearTargets();
        selectTool("select");
      }
    }
  }
});


// ----------------------- Utils
// Clear Targets
function clearTargets() {
  const targets = game.user.targets.values();
  for(let target = targets.next(); !target.done; target = targets.next())
  {
    target.value.setTarget(false, { user: game.user, releaseOthers: false });
  }
  game.user.targets = new Set();
}

// Click on a tool if current toolbar
function selectTool(toolName) {
  let fakeEvent = { 
    preventDefault: event => {return;},
    currentTarget: { dataset: { tool: toolName } } 
  };
  ui.controls._onClickTool(fakeEvent);
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