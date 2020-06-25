// Class to create and control tooltip data on hover
class TokenTooltip
{
  static onHover(object, hovered) {
    if( game.settings.get("cozy-player", "tooltipVisibility") === "disabled" ) return;
    
    // Return conditions
    if (  !object 
          || !object.actor
          || event == undefined
          )
    {
      TokenTooltip._removeToolTip();
      return;
    }
    
    TokenTooltip._removeToolTip();
  
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
    
    if( addFeats || addFavs || addConsumables) {
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

    // TEMPORARY FIX FOR TOOLTIPS ON OVERWORLD MAP
    //if (parseInt(info.ac) === 0) return;
    
    // Header and Footer
    let divStart = `<div class="section">`;
    const divEnd = `</table></div>`;
    
    // Actor name 
    if( game.settings.get("cozy-player", "tooltipShowName") === "actor" ) {
      let name = object.actor ? object.actor.data.name : object.name ? object.name : "nameless";
      if(name) divStart += `<div class="title"><n>${name}</n></div>`;
    } else if (game.settings.get("cozy-player", "tooltipShowName") === "token") {
      let name = object.name ? object.name : object.actor ? object.actor.data.name : "nameless";
      divStart += `<div class="title"><n>${name}</n></div>`;
    } 
    divStart += `<table style="width:100%; border: 0px">`;
    
    // Write row-by-row
    let variableData = ``;
    let rows = 0;
    let numberOfCols = Math.floor( resources.list.length / (maxResourcePerRow + 1 ) ) + 1;
    for (let i = 0; i < maxResourcePerRow; i++) {
      let rowString = `<tr>`;
      
      for (let j = 0; j < numberOfCols; j++) {
        // Add a spacer
        if( j > 0 ) rowString += `<td><div class="spacer"></div></td>`;
        else rowString += `<td></td>`;
        
        // Get index
        let index = ( j * maxResourcePerRow ) + i;
        if( index >= resources.list.length ) {
          rowString += `<td></td><td></td>`;
          continue;
        }
        let resource = resources.list[index];

        // Make row
        // Label (name or icon)
        if( resource.img )
        {
          // Check if using a default icon or an image
          if( resource.img.substring(0,4) === "fas " ) {
            rowString += `<td><div class="label"><i class="${resource.img}"></i></div></td>`;
          } else {
            rowString += `<td><div class="label"><i><img src="${resource.img}" style="width:${scale.icon};height:${scale.icon};"></i></div></td>`;
          }
        }
        else
        {
          rowString += `<td><div class="label">${resource.name}:</div></td>`;
        }
        
        // Value
        if( resource.constant == true ) {
          rowString += `<td><div class="value">${resource.value}`;
        } else {
          rowString += `<td><div class="value">${resource.value} / ${resource.maxValue}`;
        }
        
        // Extra Value
        if( resource.extraValue > 0 ) rowString += ` (+${resource.extraValue})`;
        else if( resource.extraValue < 0 ) rowString += ` (-${resource.extraValue})`;
          
        // Close cell
        rowString += `</div></td>`;
      }
      
      rowString += `</tr>`;
      
      // Add to variable data
      variableData += rowString;
    }
    let tooltipTemplate = $(divStart + variableData + divEnd);
    
    // ADD OR REMOVE THE TOOLTIP
    if (hovered) {
      TokenTooltip._addToolTip(tooltipTemplate, object, scale);
    } else {
      TokenTooltip._removeToolTip();
    }
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
      extraValue: extraValue
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
  TokenTooltip.onHover(object, hovered);
});


Hooks.on("renderTokenHUD", () => {
  if(canvas.hud.token.object) {
    TokenTooltip._removeToolTip();
    TokenTooltip.onHover(canvas.hud.token.object, true);
  }
});
