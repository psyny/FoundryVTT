// Class to create and control tooltip data on hover
class TokenTooltip
{
  static lastHoverTime = Date.now();
  static lastHoverTooltip = "";
  
  static delayedHover(object, hovered) {
    if( Date.now() - TokenTooltip.lastHoverTime < game.settings.get("cozy-player", "tooltipDelay") ) return;
    TokenTooltip.onHover(object, hovered);
  }


  static onHover(object, hovered) {
    if( game.settings.get("cozy-player", "tooltipVisibility") === "disabled" ) { return; }
    if( object ) {
      if( object.owner ) {
        if( game.settings.get("cozy-player", "tooltipOwnedVisibility") === "non" ) { return; }
      } else {
        if( game.settings.get("cozy-player", "tooltipNotOwnedVisibility") === "non" ) { return; }
      }
    }
    
    // Update current tooltip
    if( object && TokenTooltip.lastHoverTooltip === object.id && hovered) { return; }
    
    // Limited flags
    let limitedTooltip = false;
    if( object.owner && game.settings.get("cozy-player", "tooltipOwnedVisibility") === "lim" ) { limitedTooltip = true; } 
    else if( !object.owner && game.settings.get("cozy-player", "tooltipNotOwnedVisibility") === "lim" ) { limitedTooltip = true; } 

    // Return conditions
    if (  !object 
          || !object.actor
          //|| event == undefined
          || !hovered
          )
    {
      TokenTooltip._removeToolTip();
      return;
    }
    
    // Remove existing tooltip
    TokenTooltip._removeToolTip();
    TokenTooltip.lastHoverTooltip = object.id;

    // Check acess
    let tooltipVisibility = game.settings.get("cozy-player", "tooltipVisibility");
    let showTooltip = false;
    if (game.user.isGM || tooltipVisibility === "all") {
      showTooltip = true;
    } else {
      // Calculate min acess needed
      let minAccess = 0;
      if( tooltipVisibility === "ally" ) minAccess = 1;
      else if( tooltipVisibility === "friendly" ) minAccess = 2;
      else if( tooltipVisibility === "observed" ) minAccess = 2;
      else if( tooltipVisibility === "owned" ) minAccess = 3;
      else {
        TokenTooltip._removeToolTip();
        return;
      }
      
      // Calculate Access to the token
      let accessLevel = 1;
      if( object.actor.owner && ( minAccess < 4 || tooltipVisibility === "owned" )) {
        showTooltip = true;
      }
      else if( object.actor.permission == 2 && ( minAccess < 2 || tooltipVisibility === "observed" ) ) {
        showTooltip = true;
      }
      else if( parseInt(object.data.disposition) == CONST.TOKEN_DISPOSITIONS.FRIENDLY && ( minAccess < 2 || tooltipVisibility === "friendly" ) ) {
        showTooltip = true;
      }
    }
    
    if(showTooltip == false) {
      TokenTooltip._removeToolTip();
      return;
    }
    
    // Globals
    let scale = [];
    scale.value = game.settings.get("cozy-player", "tooltipScale");
    scale.font = "" + scale.value + "rem";
    scale.icon = "" + (scale.value * 1.3) + "rem";
    
    const maxResourcePerRow = game.settings.get("cozy-player", "tooltipMaxRows");
    
    // PARSE TOKEN/ACTOR INFO
    let resources = {};
    resources.max = game.settings.get("cozy-player", "tooltipMaxItems");
    resources.list = [];
    
    // Hit Points
    if(game.settings.get("cozy-player", "tooltipShowHP")) 
      TokenTooltip._addVariableValue_NANcheck(resources, "hp", "fas fa-heart", object.actor.data.data.attributes.hp.value, object.actor.data.data.attributes.hp.max, 10, object.actor.data.data.attributes.hp.temp);
    
    // Armor Class
    if(game.settings.get("cozy-player", "tooltipShowAC"))
      TokenTooltip._addConstValue_NANcheck(resources, "ac", "fas fa-shield-alt", object.actor.data.data.attributes.ac.value);
    
    // Speed
    if(game.settings.get("cozy-player", "tooltipShowSpeed"))
      TokenTooltip._addConstValue(resources, "speed", "fas fa-shoe-prints", object.actor.data.data.attributes.speed.value);
    
    // Passive Pereception
    if(game.settings.get("cozy-player", "tooltipPassivePerception"))
      TokenTooltip._addConstValue_NANcheck(resources, "passive perception", "fas fa-search", object.actor.data.data.skills.prc.passive);
    
    // Passive Insight
    if(game.settings.get("cozy-player", "tooltipPassiveInsight"))
      TokenTooltip._addConstValue_NANcheck(resources, "passive insight", "fas fa-brain", object.actor.data.data.skills.ins.passive);
    
    // Resources
    if(game.settings.get("cozy-player", "tooltipResources")) {
      let actorResource = object.actor.data.data.resources.primary;
      if(actorResource) TokenTooltip._addVariableValue_NANcheck(resources, actorResource.label, null, actorResource.value, actorResource.max);

      actorResource = object.actor.data.data.resources.secondary;
      if(actorResource) TokenTooltip._addVariableValue_NANcheck(resources, actorResource.label, null, actorResource.value, actorResource.max);
      
      actorResource = object.actor.data.data.resources.tertiary;
      if(actorResource) TokenTooltip._addVariableValue_NANcheck(resources, actorResource.label, null, actorResource.value, actorResource.max);
    }
    
    // Feats and Items
    let addFeats = game.settings.get("cozy-player", "tooltipFeats");
    let addConsumables = game.settings.get("cozy-player", "tooltipConsumables"); 
    let addFavs = game.settings.get("cozy-player", "tooltipFavs");
    
    if( !limitedTooltip && ( addFeats || addFavs || addConsumables) ) {
      for(var key in object.actor.data.items) {
        if(resources.list.length >= resources.max) break; // Just a short circuit to not loop throu all inventory uneeded
        
        var item = object.actor.data.items[key];
        let addFlag = false;
        
        if( addFeats && item.type === "feat") {
          if(item.data.uses && item.data.uses.max) addFlag = true;
        }
        else if( addConsumables && item.type === "consumable") {
          if(item.data.uses && item.data.uses.max) addFlag = true;
        }
        else if( addFavs && item.flags && item.flags.favtab && item.flags.favtab.isFavorite) {
          if(item.data.uses) addFlag = true;
        }
        
        if(addFlag) {
          TokenTooltip._addVariableValue(resources, item.name, item.img, item.data.uses.value, item.data.uses.max);
        }
      }
    }
    
    // Spell Slots
    if( !limitedTooltip && game.settings.get("cozy-player", "tooltipSpellSlots") ) {
      let spells = object.actor.data.data.spells;
      let maxSlotLevel = 0;
      if(spells) {
        let spellData = {};
        for( let i = 1; i < 10 ; i++ ) {
          // Slot info and update max slot level
          let slotInfo = spells['spell'+i];
          if(slotInfo.max == 0) break;
          maxSlotLevel = i;
          
          // Save data
          spellData["level"+i] = { val: slotInfo.value , max: slotInfo.max };
        }
        
        // Check if theres spells to add
        if( maxSlotLevel > 0 ) {
          spellData.maxSlotLevel = maxSlotLevel;
          TokenTooltip._addSlotsInfo(resources, spellData);
        }
      }
    }
    
    // -----------------------------------------------------------------------------------
    
    let tipStrings = [];
    
    // Header and Footer
    tipStrings.push(`<div class="section">`);
    
    // Actor name 
    if( game.settings.get("cozy-player", "tooltipShowName") === "actor" ) {
      let name = object.actor ? object.actor.data.name : object.name ? object.name : "nameless";
      if(name) tipStrings.push(`<div class="title"><n>${name}</n></div>`);
    } else if (game.settings.get("cozy-player", "tooltipShowName") === "token") {
      let name = object.name ? object.name : object.actor ? object.actor.data.name : "nameless";
      tipStrings.push(`<div class="title"><n>${name}</n></div>`);
    } 
    tipStrings.push(`<table style="width:100%; border: 0px">`);
    
    // Write row-by-row
    let rows = 0;
    let numberOfCols = Math.floor( resources.list.length / (maxResourcePerRow + 1 ) ) + 1;
    for (let i = 0; i < maxResourcePerRow; i++) {
      tipStrings.push(`<tr>`);
      
      // Write cols of this row
      for (let j = 0; j < numberOfCols; j++) {
        // Add a spacer
        if( j > 0 ) tipStrings.push(`<td><div class="spacer"></div></td>`);
        else tipStrings.push(`<td></td>`);
        
        // Get index
        let index = ( j * maxResourcePerRow ) + i;
        if( index >= resources.list.length ) {
          tipStrings.push(`<td></td><td></td>`);
          continue;
        }
        let resource = resources.list[index];

        // Make row
        // Label (name or icon)
        if( resource.img )
        {
          // Check if using a default icon or an image
          if( resource.img.substring(0,4) === "fas " ) {
            tipStrings.push(`<td><div class="label"><i class="${resource.img}"></i></div></td>`);
          } else {
            tipStrings.push(`<td><div class="label"><i><img src="${resource.img}" style="width:${scale.icon};height:${scale.icon};"></i></div></td>`);
          }
        }
        else
        {
          tipStrings.push(`<td><div class="label">${resource.name}:</div></td>`);
        }
        
        // Value
        if( resource.simple ) {
          // Most of values have this simple structure
          if( resource.constant == true ) {
            tipStrings.push(`<td><div class="value">${resource.value}`);
          } else {
            tipStrings.push(`<td><div class="value">${resource.value} / ${resource.maxValue}`);
          }
          
          // Extra Value
          if( resource.extraValue > 0 ) tipStrings.push(` (+${resource.extraValue})`);
          else if( resource.extraValue < 0 ) tipStrings.push(` (-${resource.extraValue})`);
          
          // Close cell
          tipStrings.push(`</div></td>`);
        } else {
          
          // But some values have a complex non standard structure. Needs to think this part better. For now it only supports spell slots
          let tableWidth = resource.info.maxSlotLevel * 32 * scale.value;
          let slotSize = 18 * scale.value;
          
          // Spell Table Start
          tipStrings.push(`<td><table style="width: 1px; border: 0px">`);
          
          // Row StringBuild Function
          function drawLevelsRow(levelMin, levelMax) {
            for( let spelllevel = levelMin ; spelllevel <= levelMax ; spelllevel++ ) {
              let slotsMax = resource.info['level'+spelllevel].max;
              let slotsLeftAbs = resource.info['level'+spelllevel].val;
              let slotsLeftPerc = 100.0 * slotsLeftAbs / slotsMax;
              
              tipStrings.push(`<td><div class="slot-cell" `);
              tipStrings.push(`style = "width: ` + slotSize + `px; height: ` + slotSize + `px;"`);
              tipStrings.push(`><div class="slot-bg"></div><div class="slot-bar `);
              if( slotsLeftPerc < 50 || ( slotsLeftAbs == 1 && slotsMax > 1 ) ) tipStrings.push(`lowbar`);
              else tipStrings.push(`highbar`);
              tipStrings.push(`" style="height: ` + slotsLeftPerc + `%;"`);
              tipStrings.push(`></div>` + spelllevel + `</div></td>`);
            }
          }
          
          // Row 1 (for slots 1~5)
          let rowLevels = resource.info.maxSlotLevel > 5 ? 5 : resource.info.maxSlotLevel;
          tipStrings.push(`<tr>`);
          drawLevelsRow(1, rowLevels);
          tipStrings.push(`</tr>`);
          
          // Row 2 (for slots 6~9)
          if( resource.info.maxSlotLevel > 5 ) {
            tipStrings.push(`<tr>`);
            drawLevelsRow(6, resource.info.maxSlotLevel);
            tipStrings.push(`</tr>`);
          }
          
          // Spell Table end
          tipStrings.push(`</table></td>`);
        }

      } 

      // Close Row
      tipStrings.push(`</tr>`);
    }
    
    // Close tooltip
    tipStrings.push( `</table></div>`);
    
    let tooltipTemplate = $(tipStrings.join(""));
    
    // ADD OR REMOVE THE TOOLTIP
    TokenTooltip._addToolTip(tooltipTemplate, object, scale);
  }
  
  static _addToolTip(tooltipTemplate, object, scale) {
    // Adjust an offset if a token HUD is opened
    let xoffset = 0;
    if( canvas.hud.token.object == object ) xoffset = 50;
    
    // Style
    let style = "";
    if(game.settings.get("cozy-player", "tooltipStyle") === "black" ) style = "bg-black";
    else if(game.settings.get("cozy-player", "tooltipStyle") === "white" ) style = "bg-white";

    // Create and position tooltip
    let canvasToken = canvas.tokens.placeables.find((tok) => tok.id === object.id);
    let dmtktooltip = $(`<div class="psn-tooltip ` + style + `"></div>`);
    dmtktooltip.css('font-size', scale.font);
    dmtktooltip.css('left', (canvasToken.worldTransform.tx + ((xoffset+(object.w * 1.0)) * canvas.scene._viewPosition.scale)) + 'px');
    dmtktooltip.css('top', (canvasToken.worldTransform.ty + 0) + 'px');
    dmtktooltip.html(tooltipTemplate);
    $('body.game').append(dmtktooltip);
  }
  
  static _removeToolTip() {
    TokenTooltip.lastHoverTooltip = "";
    $('.psn-tooltip').remove();
  }
  
  static _pushToResources(resources, name, img, constant, value, maxValue = 0, extraValue = 0)
  {
    // Dont add resources with no max value defined
    if(constant == false && maxValue == 0) return;
    
    // Dont add if max is already meet
    if(resources.list.length >= resources.max) return; 
    
    // Check for Abbreviation
    if(!img || !game.settings.get("cozy-player", "tooltipShowIcons") ) {
      img = null;
      name = TokenTooltip._getAbbreviation(name);
    } else {
      name = "";
    }
    
    // Add to resource list
    resources.list.push({
      name: name,
      img: img,
      constant: constant,
      value: value,
      maxValue: maxValue,
      extraValue: extraValue,
      simple: true
    });
  }
  
  // Add info about spellslots
  static _addSlotsInfo(resources, slotInfo) {
    let name = "";
    let img = "";
    
    // Check for Icon and Abbreviation
    if(!game.settings.get("cozy-player", "tooltipShowIcons") ) {
      img = null;
      name = "S.Slots";
    } else {
      img = "fas fa-hat-wizard";
      name = "";
    }
    
    resources.list.push({
      name: name,
      img: img,
      info: slotInfo,
      simple: false
    });
  }
  
  // Add a constant resource, with check for not a number on given value
  static _addConstValue_NANcheck(resources, name, img, value, defaultValue = 10)
  {
    try {
      value = isNaN(parseInt(value)) ? defaultValue : parseInt(value);
    } catch (error) {
      return;
    }

    TokenTooltip._pushToResources(resources, name, img, true, value, value);
  }
  
  // Add a variable resource, with check for not a number on given value
  static _addVariableValue_NANcheck(resources, name, img, value, maxValue, defaultValue = 10, extraValue = null)
  {
    try {
      value = isNaN(parseInt(value)) ? defaultValue : parseInt(value);
    } catch (error) {
      return;
    }
    
    try {
      maxValue = isNaN(parseInt(maxValue)) ? 0 : parseInt(maxValue);
    } catch (error) {
      return;
    }
    
    if(extraValue)
    {
      try {
        extraValue = isNaN(parseInt(extraValue)) ? 0 : parseInt(extraValue);
      } catch (error) {
        return;
      }
    }
    else
    {
      extraValue = 0;
    }
    
    TokenTooltip._pushToResources(resources, name, img, false, value, maxValue, extraValue);
  }
  
  //  Add a constant resource
  static _addConstValue(resources, name, img, value)
  {
    TokenTooltip._pushToResources(resources, name, img, true, value, value);
  }
  
  // Add a variable resource
  static _addVariableValue(resources, name, img, value, maxValue, extraValue = 0)
  {    
    TokenTooltip._pushToResources(resources, name, img, false, value, maxValue, extraValue);
  }
  
  // Make Abbreviation
  static _getAbbreviation(stringToAbv)
  {
    let nameMaxLength = 7; // TODO: subst for a setting
    
    if(stringToAbv.length > nameMaxLength)
    {
      let abbvString = "";
      
      // See if its a single or composite name
      let splited = stringToAbv.split(" ", nameMaxLength);
      if( splited.length == 1 ) 
      {
        // Single name, get only the first part of the name
        abbvString = stringToAbv.substring(0,nameMaxLength);
      }
      else
      {
        // Composite name, get initials
        for (let j = 0; j < splited.length; j++) {
          abbvString += splited[j].substring(0,1);
        }
      }
      
      return abbvString;
    }
    else
    {
      return stringToAbv;
    }
  }
}


Hooks.on("deleteToken", (scene, token) => {
	$('.psn-tooltip').remove();
});


Hooks.on("hoverToken", (object, hovered) => {
  TokenTooltip.lastHoverTime =  Date.now();
  let delay = game.settings.get("cozy-player", "tooltipDelay");
  if( delay == 0 ) TokenTooltip.onHover(object, hovered);
  else setTimeout(function() { TokenTooltip.delayedHover(object, hovered); }, delay);
});


Hooks.on("renderTokenHUD", () => {
  if(canvas.hud.token.object) {
    TokenTooltip._removeToolTip();
    TokenTooltip.onHover(canvas.hud.token.object, true);
  }
});
