import { MOD_ID } from './_meta.js';

Hooks.on('createChatMessage', (chatMessage) => {
  if (!chatMessage.isRoll || !chatMessage.isContentVisible) {
      return;
  }
  
  //if(chatMessage.owner == true ) {
  if( chatMessage.user.data._id === game.user.id ) {
    closeSheets();
  }
});


// Close opened sheets
async function closeSheets()
{
  if(game.settings.get(MOD_ID, "sheetsActionOnRoll") === "none" ) return;
  
	for (const [key, win] of Object.entries(ui.windows))
	{
		if(win && win.options && win.options.baseApplication === "ActorSheet")
		{
      if(game.settings.get(MOD_ID, "sheetsActionOnRoll") === "minimize") win.minimize();
      else win.close();
		}
	}
	return;
}
