import { MOD_ID } from './_meta.js';
import { clearTargets } from './psnlib/token.js';

// Select and Target alternate
document.addEventListener('keyup', evt => {
  if (evt.key === 'q') {
    if( !isFocusOnCanvas() ) { return; }
      
    if (!game.settings.get(MOD_ID, "hotkeySwitchSelectTarget")) return;   
    
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

// Hide player listStyleType
let gb_playersList_visibility = true;
var gb_playersList_dom = null;

function playersListToggle(domObj) {
  if(!domObj) return;

  if(!domObj.style || !domObj.style.visibility || domObj.style.visibility === "") {
    if(gb_playersList_visibility == true) domObj.style.visibility = "visible";
    else domObj.style.visibility = "hidden";
  } else {
    if(domObj.style.visibility === "hidden" && gb_playersList_visibility == true) domObj.style.visibility = "visible";
    else if(domObj.style.visibility === "visible" && gb_playersList_visibility == false) domObj.style.visibility = "hidden";
  }
}

Hooks.on('renderPlayerList', () => {
  // Select the node that will be observed for mutations
  const targetNode = document.getElementById('players');
  if(!targetNode) return;

  // Options for the observer (which mutations to observe)
  const config = { attributes: true, childList: true, subtree: true };

  // Callback function to execute when mutations are observed
  const callback = function(mutationsList, observer) {
    for(let mutation of mutationsList) {
      if(mutation.type === "attributes") {
        playersListToggle(targetNode);
      }
    }
  };

  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(callback);

  // Start observing the target node for configured mutations
  observer.observe(targetNode, config);
  
  // Check state
  playersListToggle(targetNode);
});

document.addEventListener('keyup', evt => {
  if (evt.key === 'p') {
    if( !isFocusOnCanvas() ) { return; }
    if (!game.settings.get(MOD_ID, "hotkeyHidePlayersList")) return;   
    
    gb_playersList_visibility = !gb_playersList_visibility;
    
    let playersElement = document.querySelector("#players");
    playersListToggle(playersElement);
  }
});

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


// Click on a tool of current toolbar
function selectTool(toolName) {
  let fakeEvent = { 
    preventDefault: event => {return;},
    currentTarget: { dataset: { tool: toolName } } 
  };
  ui.controls._onClickTool(fakeEvent);
}
