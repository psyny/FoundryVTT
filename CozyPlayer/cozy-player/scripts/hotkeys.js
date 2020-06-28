// Select and Target alternate
document.addEventListener('keyup', evt => {
  if (evt.key === 'q') {
    if( !isFocusOnCanvas() ) { return; }
      
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

// Hide player listStyleType
document.addEventListener('keyup', evt => {
  if (evt.key === 'p') {
    if( !isFocusOnCanvas() ) { return; }
    if (!game.settings.get("cozy-player", "hotkeyHidePlayersList")) return;   
    
    let playersElement = document.querySelector("#players");
    if( playersElement ) {
      if( playersElement.style.visibility === "hidden" ) {
        playersElement.style.visibility = "visible";
      } else {
        playersElement.style.visibility = "hidden";
      }
    }
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


// Click on a tool if current toolbar
function selectTool(toolName) {
  let fakeEvent = { 
    preventDefault: event => {return;},
    currentTarget: { dataset: { tool: toolName } } 
  };
  ui.controls._onClickTool(fakeEvent);
}

// Clear Targets
function clearTargets() {
  const targets = game.user.targets.values();
  for(let target = targets.next(); !target.done; target = targets.next())
  {
    target.value.setTarget(false, { user: game.user, releaseOthers: false });
  }
  game.user.targets = new Set();
}
