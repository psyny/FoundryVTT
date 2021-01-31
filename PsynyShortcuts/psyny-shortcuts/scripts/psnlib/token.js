// ---------------------------------------------------------------------------
// Tooken Selection
// ---------------------------------------------------------------------------

// Returns the currently selected token, if no token is selected, returns the first owned token
export function getSelectedOrOwnedTokens() 
{
  var controlled = canvas.tokens.controlled;
  if( controlled.length == 0 ) controlled = canvas.tokens.ownedTokens;
  return controlled;
}

// Get Selected Targets (returns a token list)
export function getTargetedTokens()
{
  let targetList = [];
  
  const targets = game.user.targets.values();
  for(let target = targets.next(); !target.done; target = targets.next())
  {
    targetList.push(target.value);
  }
  
  return targetList;
}

// Clear Targets
export function clearTargets(targetToKeep = null) {
  const targets = game.user.targets.values();
  for(let target = targets.next(); !target.done; target = targets.next())
  {
    if(!targetToKeep || target.value.id !== targetToKeep) {
      target.value.setTarget(false, { user: game.user, releaseOthers: false });
    }
  }
  game.user.targets = new Set();
}


// ---------------------------------------------------------------------------
// Tooken Info in HTML
// ---------------------------------------------------------------------------

// Marks an html element to receive hover and click functions
export function markHtmlElement(htmlElement, tokenId)
{
    htmlElement.classList.add("targetToken");
    
    htmlElement.classList.add("psnhoverable");
    htmlElement.classList.add("psnclickable");
    htmlElement.setAttribute("id", tokenId);
}


// Returns HTML node with prepared hover info for a given node: returns element for token IMG
export function getTokenHTML_Img(token, size = 30, borderSize = 0) {
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
export function getTokenHTML_Span(token)
{
  let newElement = document.createElement("span");
  markHtmlElement(newElement, token.id);
  newElement.innerHTML = token.name;
  return newElement;
}

// Returns HTML nodes from a list of tokens
export function getTokensHTML(tokens)
{
  let targetsHTML = [];
  
  for(let i = 0; i < tokens.length; i++) {
    let token = tokens[i];

    let spanElement = getTokenHTML_Span(token);
    targetsHTML.push(spanElement);
  }

  return targetsHTML;
}