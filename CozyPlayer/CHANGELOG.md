# Cozy Player ChangeLog

## Version 1.3.x

### 1.3.1
* **Hotkey**: Improved persistency of player list state set by the 'p' hotkey.
* **Tooltip**: Improved display conditions (when to show or not), as requested by joshjlewis93 user on github.
* **Fix**: Fixed an error reported by the user p4535992 on github.
* **Sheet action on roll**: Sheet actions (minimize or close) only fires to the player who made the roll.

### 1.3.0
* **Tooltip**: Added "case-by-case" option. Each item, under edit item -> description -> **tooltip display**, can be set to "Hidden", "Charges" or "Quantity" to be represented on the tooltip. 

## Version 1.2.x

### 1.2.5
* **Tooltip**: Added an option to show passive investigation.
* **Tooltip**: Added an option to hide spell slots if maximum avaliable slots is if a choosen value (besides zero). This is a workaround for sheets that wont let you set max spell slots to zero.

### 1.2.4
* **Hotkeys**: Added compatibility with D&D5e Dark Mode module. 
* **Tooltip**: Fixed icon of passive perception: now its the eye icon (as intended), not the magnifier icon.

### 1.2.3
* **Hotkey**: 'p' will toggle visibility of player list window (bottom left).

### 1.2.2
* **Tooltip**: Added option to show remaining spell slots.
* **Tooltip**: Tooltip color now can be defined by the player (each player can select its own color)
* **Tooltip**: Each player can choose if they see the full tooltip, simplified (no feats or items) or none. That option can be different for owned and non-owned tokens. This can help to improve the performance on low end machines. 
* **Tooltip**: Added a setting to set a delay value between hovering over a token and the tooltip appearing. Setting this value to greater then zero can improve performance by avoiding the problem of tooltip appearing on every mouse movement.
* **Chat Integration**: Added an option to separately enable/disable chat name hovering and clicking functions.
* **Send Targets to Chat**: When using 'pick random target' option, all targets are cleared, leaving only the picked one. 

### 1.2.1
* Improved behavior for 'q' key: wont activate when sheets is opened and while chating.

### 1.2.0

* Added more cases where the chat speaker name can be clicked
* **"Show target on rolls"**: option changed to **"Targets: Add to chat"**. 
* **"Targets: Add to chat"**: The targets on the chat message shows to every other player, not only to the sender.
* **"Targets: Add to chat"**: supports most of Better Rolls rolls if set to "implicit"
* **"Targets: Add to chat"** now have a "On any message" option
* **Tooltip**: Added an option to select the tooltip style between black and white
* **Tooltip**: Added an option to show consumable items
* **Door Interaction** Feature was removed from this module. I've created a separated module to this feature: Arms Reach.

## Version 1.1.x

### 1.1.1

* **Tooltip:** Added option to disable tooltip (tooltip visibility: Disabled)
* **Tooltip:** Fixed the tooltip visibility "Friendly or observed" to work as intended
* **Tooltip:** Tooltip now move away from the hud (when right click on token)

### 1.1.0
* Added features: open closest door, tool switching and add temp hp toolbar
