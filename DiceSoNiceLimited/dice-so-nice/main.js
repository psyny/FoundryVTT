import { DiceFactory } from './DiceFactory.js';
import { DiceBox } from './DiceBox.js';
import { DiceColors, TEXTURELIST, COLORSETS } from './DiceColors.js';
import { DiceNotation } from './DiceNotation.js';
import { DiceSFXManager } from './DiceSFXManager.js';

/**
 * Registers the exposed settings for the various 3D dice options.
 */
Hooks.once('init', () => {

    game.settings.registerMenu("dice-so-nice", "dice-so-nice", {
        name: "DICESONICE.config",
        label: "DICESONICE.configTitle",
        hint: "DICESONICE.configHint",
        icon: "fas fa-dice-d20",
        type: DiceConfig,
        restricted: false
    });

    game.settings.register("dice-so-nice", "settings", {
        name: "3D Dice Settings",
        scope: "client",
        default: Dice3D.DEFAULT_OPTIONS,
        type: Object,
        config: false,
        onChange: settings => {
            if (game.dice3d) {
                if((game.dice3d.currentCanvasPosition != settings.canvasZIndex)||(game.dice3d.currentBumpMapping != settings.bumpMapping)||(game.dice3d.currentUseHighDPI != settings.useHighDPI))
                    location.reload();
                else
                    game.dice3d.update(settings);
            }
        }
    });

    game.settings.register("dice-so-nice", "maxDiceNumber", {
        name: "DICESONICE.maxDiceNumber",
        hint: "DICESONICE.maxDiceNumberHint",
        scope: "world",
        type: Number,
        default: 20,
        range: {
            min: 20,
            max: 100,
            step: 5
        },
        config: true
    });

    game.settings.register("dice-so-nice", "globalAnimationSpeed", {
        name: "DICESONICE.globalAnimationSpeed",
        hint: "DICESONICE.globalAnimationSpeedHint",
        scope: "world",
        type: String,
        choices: Utils.localize({
            "0": "DICESONICE.PlayerSpeed",
            "1": "DICESONICE.NormalSpeed",
            "2": "DICESONICE.2xSpeed",
            "3": "DICESONICE.3xSpeed"
        }),
        default: "0",
        config: true,
        onChange: () => {
            location.reload();
        }
    });

    game.settings.register("dice-so-nice", "enabledSimultaneousRolls", {
        name: "DICESONICE.enabledSimultaneousRolls",
        hint: "DICESONICE.enabledSimultaneousRollsHint",
        scope: "world",
        type: Boolean,
        default: true,
        config: true,
        onChange: () => {
            location.reload();
        }
    });

    game.settings.register("dice-so-nice", "diceCanBeFlipped", {
        name: "DICESONICE.diceCanBeFlipped",
        hint: "DICESONICE.diceCanBeFlippedHint",
        scope: "world",
        type: Boolean,
        default: true,
        config: true
    });

    game.settings.register("dice-so-nice", "enabled", {
        scope: "world",
        type: Boolean,
        default: true,
        config: false
    });

    game.settings.register("dice-so-nice", "disabledDuringCombat", {
        name: "DICESONICE.disabledDuringCombat",
        hint: "DICESONICE.disabledDuringCombatHint",
        scope: "world",
        type: Boolean,
        default: false,
        config: true
    });

    game.settings.register("dice-so-nice", "immediatelyDisplayChatMessages", {
        name: "DICESONICE.immediatelyDisplayChatMessages",
        hint: "DICESONICE.immediatelyDisplayChatMessagesHint",
        scope: "world",
        type: Boolean,
        default: false,
        config: true
    });

    game.settings.register("dice-so-nice", "animateRollTable", {
        name: "DICESONICE.animateRollTable",
        hint: "DICESONICE.animateRollTableHint",
        scope: "world",
        type: Boolean,
        default: false,
        config: true
    });

    game.settings.register("dice-so-nice", "animateInlineRoll", {
        name: "DICESONICE.animateInlineRoll",
        hint: "DICESONICE.animateInlineRollHint",
        scope: "world",
        type: Boolean,
        default: true,
        config: true
    });

    game.settings.register("dice-so-nice", "hideNpcRolls", {
        name: "DICESONICE.hideNpcRolls",
        hint: "DICESONICE.hideNpcRollsHint",
        scope: "world",
        type: Boolean,
        default: false,
        config: true
    });

    game.settings.register("dice-so-nice", "allowInteractivity", {
        name: "DICESONICE.allowInteractivity",
        hint: "DICESONICE.allowInteractivityHint",
        scope: "world",
        type: Boolean,
        default: true,
        config: true,
        onChange: () => {
            location.reload();
        }
    });

});

/**
 * Foundry is ready, let's create a new Dice3D!
 */
Hooks.once('ready', () => {

    Utils.migrateOldSettings();

    game.dice3d = new Dice3D();
});

/**
 * Intercepts all roll-type messages hiding the content until the animation is finished
 */
Hooks.on('createChatMessage', (chatMessage) => {
    //precheck for better perf
    let hasInlineRoll = game.settings.get("dice-so-nice", "animateInlineRoll") && chatMessage.data.content.indexOf('inline-roll') !== -1;
    if ((!chatMessage.isRoll && !hasInlineRoll) ||
        !chatMessage.isContentVisible ||
        (game.view != "stream" && (!game.dice3d || game.dice3d.messageHookDisabled)) ||
        (chatMessage.getFlag("core", "RollTable") && !game.settings.get("dice-so-nice", "animateRollTable"))) {
        return;
    }
    let roll = chatMessage.roll;
    if(hasInlineRoll){
        let JqInlineRolls = $($.parseHTML(chatMessage.data.content)).filter(".inline-roll");
        if(JqInlineRolls.length == 0 && !chatMessage.isRoll) //it was a false positive
            return;
        let inlineRollList = [];
        JqInlineRolls.each((index,el) => {
            inlineRollList.push(Roll.fromJSON(unescape(el.dataset.roll)));
        });
        if(inlineRollList.length){
            if(chatMessage.isRoll)
                inlineRollList.push(chatMessage.roll);
            let mergingPool = new DicePool({rolls:inlineRollList}).evaluate();
            roll = Roll.create(mergingPool.formula).evaluate();
            roll.terms = [mergingPool]
            //roll._dice = mergingPool.dice;
            roll.results = [mergingPool.total];
            roll._total = mergingPool.total;
            roll._rolled = true;
        }
        else if(!chatMessage.isRoll)
            return;
    }
    
    let actor = game.actors.get(chatMessage.data.speaker.actor);
    const isNpc =  actor ? actor.data.type === 'npc' : false;
    if(isNpc && game.settings.get("dice-so-nice", "hideNpcRolls")) {
        return;
    }

    //Remove the chatmessage sound if it is the core dice sound.
    if (Dice3D.CONFIG.sounds && chatMessage.data.sound == "sounds/dice.wav") {
        mergeObject(chatMessage.data, { "-=sound": null });
    }
    chatMessage._dice3danimating = true;
    if(game.view == "stream"){
        setTimeout(function(){
            delete chatMessage._dice3danimating;
            $(`#chat-log .message[data-message-id="${chatMessage.id}"]`).show();
            Hooks.callAll("diceSoNiceRollComplete", chatMessage.id);
            ui.chat.scrollBottom();
        },2500, chatMessage);
    } else {
        game.dice3d.showForRoll(roll, chatMessage.user, false, null, false, chatMessage.id).then(displayed => {
            delete chatMessage._dice3danimating;
            $(`#chat-log .message[data-message-id="${chatMessage.id}"]`).show();
            Hooks.callAll("diceSoNiceRollComplete", chatMessage.id);
            ui.chat.scrollBottom();
        });
    }
});

/**
 * Hide messages which are animating rolls.
 */
Hooks.on("renderChatMessage", (message, html, data) => {
    if (game.dice3d && game.dice3d.messageHookDisabled) {
        return;
    }
    if (message._dice3danimating) {
        html.hide();
    }
});

/**
 * Generic utilities class...
 */
class Utils {

    /**
     * Migrate old 1.0 setting to new 2.0 format.
     */
    static async migrateOldSettings() {
        let settings = game.settings.get("dice-so-nice", "settings");
        if (settings.diceColor || settings.labelColor) {
            let newSettings = mergeObject(Dice3D.DEFAULT_OPTIONS, settings, { insertKeys: false, insertValues: false });
            let appearance = mergeObject(Dice3D.DEFAULT_APPEARANCE(), settings, { insertKeys: false, insertValues: false });
            await game.settings.set('dice-so-nice', 'settings', mergeObject(newSettings, { "-=dimensions": null, "-=fxList": null }));
            await game.user.setFlag("dice-so-nice", "appearance", appearance);
            ui.notifications.info(game.i18n.localize("DICESONICE.migrateMessage"));
        }
    }

    /**
     *
     * @param cfg
     * @returns {{}}
     */
    static localize(cfg) {
        return Object.keys(cfg).reduce((i18nCfg, key) => {
            i18nCfg[key] = game.i18n.localize(cfg[key]);
            return i18nCfg;
        }, {}
        );
    };

    /**
     * Get the contrasting color for any hex color.
     *
     * @returns {String} The contrasting color (black or white)
     */
    static contrastOf(color) {

        if (color.slice(0, 1) === '#') {
            color = color.slice(1);
        }

        if (color.length === 3) {
            color = color.split('').map(function (hex) {
                return hex + hex;
            }).join('');
        }

        const r = parseInt(color.substr(0, 2), 16);
        const g = parseInt(color.substr(2, 2), 16);
        const b = parseInt(color.substr(4, 2), 16);

        var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;

        return (yiq >= 128) ? '#000000' : '#FFFFFF';
    };

    static prepareTextureList() {
        return Object.keys(TEXTURELIST).reduce((i18nCfg, key) => {
            i18nCfg[key] = game.i18n.localize(TEXTURELIST[key].name);
            return i18nCfg;
        }, {}
        );
    };

    static prepareFontList() {
        let fontList = {
            "auto": game.i18n.localize("DICESONICE.FontAuto")
        };
        game.dice3d.box.dicefactory.fontFamilies.forEach(font => {
            fontList[font] = font;
        });
        return fontList;
    };

    static prepareColorsetList() {
        let sets = {};
        if (DiceColors.colorsetForced)
            sets[DiceColors.colorsetForced] = COLORSETS[DiceColors.colorsetForced];
        else
            sets = COLORSETS;
        let groupedSetsList = Object.values(sets);
        groupedSetsList.sort((set1, set2) => {
            if (game.i18n.localize(set1.description) < game.i18n.localize(set2.description)) return -1;
            if (game.i18n.localize(set1.description) > game.i18n.localize(set2.description)) return 1;
        });
        let preparedList = {};
        for (let i = 0; i < groupedSetsList.length; i++) {
            let locCategory = game.i18n.localize(groupedSetsList[i].category);
            if (!preparedList.hasOwnProperty(locCategory))
                preparedList[locCategory] = {};

            preparedList[locCategory][groupedSetsList[i].name] = game.i18n.localize(groupedSetsList[i].description);
        }

        return preparedList;
    };

    static prepareSystemList() {
        let systems = game.dice3d.box.dicefactory.systems;
        let hasExclusive = game.dice3d.box.dicefactory.systemsHaveExclusive;
        return Object.keys(systems).reduce((i18nCfg, key) => {
            if ((!game.dice3d.box.dicefactory.systemForced || game.dice3d.box.dicefactory.systemActivated == key)&&(!hasExclusive || systems[key].mode=="exclusive"))
                i18nCfg[key] = game.i18n.localize(systems[key].name);
            return i18nCfg;
        }, {});
    };
}

/**
 * Main class to handle 3D Dice animations.
 */
export class Dice3D {

    static get DEFAULT_OPTIONS() {
        return {
            enabled: true,
            hideAfterRoll: true,
            timeBeforeHide: 2000,
            hideFX: 'fadeOut',
            autoscale: true,
            scale: 75,
            speed: 1,
            shadowQuality: 'high',
            bumpMapping: true,
            sounds: true,
            soundsSurface: 'felt',
            soundsVolume: 0.5,
            canvasZIndex:'over',
            throwingForce:'medium',
            useHighDPI:true,
            showOthersSFX:true
        };
    }

    static DEFAULT_APPEARANCE(user = game.user) {
        return {
            labelColor: Utils.contrastOf(user.color),
            diceColor: user.color,
            outlineColor: user.color,
            edgeColor: user.color,
            texture: "none",
            material: "auto",
            font:"auto",
            colorset: "custom",
            system: "standard"
        };
    }

    static ALL_DEFAULT_OPTIONS(user = game.user) {
        return mergeObject(Dice3D.DEFAULT_OPTIONS, Dice3D.DEFAULT_APPEARANCE(user));
    }

    static get CONFIG() {
        return mergeObject(Dice3D.DEFAULT_OPTIONS, game.settings.get("dice-so-nice", "settings"));
    }

    static APPEARANCE(user = game.user) {
        let appearance = mergeObject(Dice3D.DEFAULT_APPEARANCE(user), user.getFlag("dice-so-nice", "appearance"));
        appearance.diceColor = user.color;
        return mergeObject(appearance, { "-=dimensions": null });
    }

    static SFX(user = game.user){
        if(Dice3D.CONFIG.showOthersSFX || user.id == game.user.id)
            return user.getFlag("dice-so-nice", "sfxList");
        else
            return {};
    }

    static ALL_CUSTOMIZATION(user = game.user) {
        let specialEffects = Dice3D.SFX(user);
        return mergeObject(Dice3D.APPEARANCE(user), {specialEffects: specialEffects});
    }

    static ALL_CONFIG(user = game.user) {
        let ret = mergeObject(Dice3D.CONFIG, Dice3D.APPEARANCE(user));
        ret.specialEffects = Dice3D.SFX(user);
        return ret;
    }

    /**
     * Register a new system
     * The id is to be used with addDicePreset
     * The name can be a localized string
     * @param {Object} system {id, name}
     * @param {Boolean} mode "force, exclusive, default". Force will prevent any other systems from being enabled. exclusive will list only "exclusive" systems in the dropdown . Default will add the system as a choice
     */
    addSystem(system, mode = "default") {
        //retrocompatibility with  API version < 3.1
        if(typeof mode == "boolean"){
            mode = mode ? "force":"default";
        }

        this.DiceFactory.addSystem(system, mode);
    }

    /**
     * Register a new dice preset
     * Type should be a known dice type (d4,d6,d8,d10,d12,d20,d100)
     * Labels contains either strings (unicode) or a path to a texture (png, gif, jpg, webp)
     * The texture file size should be 256*256
     * The system should be a system id already registered
     * @param {Object} dice {type:"",labels:[],system:""}
     */
    addDicePreset(dice, shape = null) {
        this.DiceFactory.addDicePreset(dice, shape);
    }

    /**
     * Add a texture to the list of textures and preload it
     * @param {String} textureID 
     * @param {Object} textureData 
     * @returns {Promise}
     */
    addTexture(textureID, textureData) {
        if (!textureData.bump)
            textureData.bump = '';
        return new Promise((resolve) => {
            let textureEntry = {};
            textureEntry[textureID] = textureData;
            TEXTURELIST[textureID] = textureData;
            DiceColors.loadTextures(textureEntry, (images) => {
                resolve();
            });
        });
    }

    /**
     * Add a colorset (theme)
     * @param {Object} colorset 
     * @param {Object} apply = "no", "default", "force"
     */
    async addColorset(colorset, apply = "no") {
        let defaultValues = {
            foreground:"custom",
            background:"custom",
            outline:"custom",
            edge:"custom",
            texture:"custom",
            material:"custom",
            font:"custom",
            fontScale:{}
        }
        colorset = mergeObject(defaultValues, colorset);
        COLORSETS[colorset.name] = colorset;
        DiceColors.initColorSets(colorset);

        if(colorset.font && !this.DiceFactory.fontFamilies.includes(colorset.font)){
            this.DiceFactory.fontFamilies.push(colorset.font);
            await this.DiceFactory._loadFonts();
		}

        switch (apply) {
            case "force":
                DiceColors.colorsetForced = colorset.name;
            //note: there's no break here on purpose 
            case "default":
                //If there's no apperance already selected by the player, save this custom colorset as his own
                let savedAppearance = game.user.getFlag("dice-so-nice", "appearance");
                if (!savedAppearance) {
                    let appearance = Dice3D.DEFAULT_APPEARANCE();
                    appearance.colorset = colorset.name;
                    game.user.setFlag("dice-so-nice", "appearance", appearance);
                }
        }
    }

    /**
     * Ctor. Create and initialize a new Dice3d.
     */
    constructor() {
        Hooks.call("diceSoNiceInit", this);
        game.dice3dRenderers = {
            "board":null,
            "showcase":null
        }
        this._buildCanvas();
        this._initListeners();
        this._buildDiceBox();
        DiceColors.loadTextures(TEXTURELIST, async (images) => {
            DiceColors.initColorSets();
            Hooks.call("diceSoNiceReady", this);
            await this.DiceFactory._loadFonts();
        });
        DiceSFXManager.init();
        this._startQueueHandler();
        this._nextAnimationHandler();
        this._welcomeMessage();
    }

    get canInteract(){
        return !this.box.running;
    }

    /**
     * Create and inject the dice box canvas resizing to the window total size.
     *
     * @private
     */
    _buildCanvas() {
        this.canvas = $('<div id="dice-box-canvas" style="position: absolute; left: 0; top: 0;pointer-events: none;"></div>');
        if(Dice3D.CONFIG.canvasZIndex == "over"){
            this.canvas.css("z-index",1000);
            this.canvas.appendTo($('body'));
        } 
        else{
            $("#board").after(this.canvas);
        }
        this.currentCanvasPosition = Dice3D.CONFIG.canvasZIndex;
        this.currentBumpMapping =  Dice3D.CONFIG.bumpMapping;
        this.currentUseHighDPI = Dice3D.CONFIG.useHighDPI;
        this._resizeCanvas();
    }

    /**
     * resize to the window total size.
     *
     * @private
     */
    _resizeCanvas() {
        const sidebarWidth = $('#sidebar').width();
        this.canvas.width(window.innerWidth - sidebarWidth + 'px');
        this.canvas.height(window.innerHeight - 1 + 'px');
    }

    /**
     * Build the dicebox.
     *
     * @private
     */
    _buildDiceBox() {
        this.DiceFactory = new DiceFactory();
        let config = Dice3D.ALL_CONFIG();
        config.boxType = "board";
        this.box = new DiceBox(this.canvas[0], this.DiceFactory, config);
        this.box.initialize();
    }

    /**
     * Init listeners on windows resize and on click if auto hide has been disabled within the settings.
     *
     * @private
     */
    _initListeners() {
        this._rtime;
        this._timeout = false;
        $(window).resize(() => {
            this._rtime = new Date();
            if (this._timeout === false) {
                this._timeout = true;
                setTimeout(this._resizeEnd.bind(this), 1000);
            }
        });

        $(document).on("click",".dice-so-nice-btn-settings",(ev)=>{
            ev.preventDefault();
            const menu = game.settings.menus.get(ev.currentTarget.dataset.key);
            const app = new menu.type();
            return app.render(true);
        });

        game.socket.on('module.dice-so-nice', (request) => {
            switch(request.type){
                case "show":
                    if (!request.users || request.users.includes(game.user.id))
                        this.show(request.data, game.users.get(request.user));
                    break;
                case "update":
                    if(request.user == game.user.id || Dice3D.CONFIG.showOthersSFX)
                        DiceSFXManager.init();
                    break;
            }
        });

        if(game.settings.get("dice-so-nice", "allowInteractivity")){
            $(document).on("mousemove.dicesonice", "#board", this._onMouseMove.bind(this));

            $(document).on("mousedown.dicesonice", "#board", this._onMouseDown.bind(this));

            $(document).on("mouseup.dicesonice", "#board", this._onMouseUp.bind(this));
        }
    }

    _mouseNDC(event){
        let rect = this.canvas[0].getBoundingClientRect();
        let x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        if(x > 1)
            x = 1;
        let y = - ((event.clientY - rect.top) / rect.height) * 2 + 1;
        return {x:x,y:y};
    }

    _onMouseMove(event){
        if(!this.canInteract)
            return;
        this.box.onMouseMove(event,this._mouseNDC(event));
    }

    _onMouseDown(event){
        if(!this.canInteract)
            return;
        let hit = this.box.onMouseDown(event,this._mouseNDC(event));
        if(hit)
            this._beforeShow();
        else{
            const config = Dice3D.CONFIG;
            if (!config.hideAfterRoll && this.canvas.is(":visible") && !this.box.rolling) {
                this.canvas.hide();
                this.box.clearAll();
            }
        }

    }

    _onMouseUp(event){
        if(!this.canInteract)
            return;
        let hit = this.box.onMouseUp(event);
        if(hit)
            this._afterShow();
    }

    _resizeEnd() {
        if (new Date() - this._rtime < 1000) {
            setTimeout(this._resizeEnd.bind(this), 1000);
        } else {
            this._timeout = false;
            //resize ended probably, lets remake the canvas
            this.canvas[0].remove();
            this.box.clearScene();
            this._buildCanvas();
            this._resizeCanvas();
            let config = Dice3D.ALL_CONFIG();
            config.boxType = "board";
            this.box = new DiceBox(this.canvas[0], this.DiceFactory, config);
            this.box.initialize();
            this.box.preloadSounds();
        }
    }

    /**
     * Start polling and watching te queue for animation requests.
     * Each request is resolved in sequence.
     *
     * @private
     */
    _startQueueHandler() {
        this.queue = [];
        setInterval(() => {
            if (this.queue.length > 0 && !this.box.rolling) {
                let animate = this.queue.shift();
                animate();
            }
        }, 100);
    }

    /**
     * Show a private message to new players
     */
    _welcomeMessage(){
        if(!game.user.getFlag("dice-so-nice","welcomeMessageShown")){
            if(!game.user.getFlag("dice-so-nice","appearance")){
                renderTemplate("modules/dice-so-nice/templates/welcomeMessage.html", {}).then((html)=>{
                    let options = {
                        whisper:[game.user.id],
                        content: html
                    };
                    ChatMessage.create(options);
                });
            }
            game.user.setFlag("dice-so-nice","welcomeMessageShown",true);
        }
        
    }

    /**
     * Check if 3D simulation is enabled from the settings.
     */
    isEnabled() {
        let combatEnabled = (!game.combat || !game.combat.started) || (game.combat && game.combat.started && !game.settings.get("dice-so-nice", "disabledDuringCombat"));
        return Dice3D.CONFIG.enabled && game.settings.get("dice-so-nice", "enabled") && combatEnabled;
    }

    /**
     * Update the DiceBox with fresh new settgins.
     *
     * @param settings
     */
    update(settings) {
        this.box.update(settings);
    }

    /**
     * Show the 3D Dice animation for the Roll made by the User.
     *
     * @param roll an instance of Roll class to show 3D dice animation.
     * @param user the user who made the roll (game.user by default).
     * @param synchronize if the animation needs to be synchronized for each players (true/false).
     * @param users list of users or userId who can see the roll, leave it empty if everyone can see.
     * @param blind if the roll is blind for the current user
     * @returns {Promise<boolean>} when resolved true if the animation was displayed, false if not.
     */
    showForRoll(roll, user = game.user, synchronize, users = null, blind, messageID = null) {
        let context = {
            roll:roll,
            user:user,
            users:users,
            blind:blind
        };
        Hooks.callAll("diceSoNiceRollStart", messageID, context);

        let notation = new DiceNotation(context.roll);
        return this.show(notation, context.user, synchronize, context.users, context.blind);
    }

    /**
     * Show the 3D Dice animation based on data configuration made by the User.
     *
     * @param data data containing the dice info.
     * @param user the user who made the roll (game.user by default).
     * @param synchronize
     * @param users list of users or userId who can see the roll, leave it empty if everyone can see.
     * @param blind if the roll is blind for the current user
     * @returns {Promise<boolean>} when resolved true if the animation was displayed, false if not.
     */
    show(data, user = game.user, synchronize = false, users = null, blind) {
        return new Promise((resolve, reject) => {

            if (!data.throws) throw new Error("Roll data should be not null");

            if (!data.throws.length || !this.isEnabled()) {
                resolve(false);
            } else {

                if (synchronize) {
                    users = users && users.length > 0 ? (users[0].id ? users.map(user => user.id) : users) : users;
                    game.socket.emit("module.dice-so-nice", { type:"show", data: data, user: user.id, users: users });
                }

                if (!blind) {
                    this._showAnimation(data, Dice3D.ALL_CUSTOMIZATION(user)).then(displayed => {
                        resolve(displayed);
                    });
                } else {
                    resolve(false);
                }
            }
            if(game.settings.get("dice-so-nice","immediatelyDisplayChatMessages")){
                resolve();
            }
        });
    }

    /**
     *
     * @param formula
     * @param results
     * @param dsnConfig
     * @returns {Promise<boolean>}
     * @private
     */
    _showAnimation(notation, dsnConfig) {
        notation.dsnConfig = dsnConfig;
        return new Promise((resolve, reject) => {
            this.nextAnimation.addItem({
                params : notation,
                resolve : resolve
            });
        });
    }

    _nextAnimationHandler(){
        let timing = game.settings.get("dice-so-nice", "enabledSimultaneousRolls") ? 400:0;
        this.nextAnimation = new Accumulator(timing, (items)=>{
            let commands = DiceNotation.mergeQueuedRollCommands(items);
            if (this.isEnabled() && this.queue.length < 10) {
                let count = commands.length;
                commands.forEach(aThrow => {
                    this.queue.push(() => {
                        this._beforeShow();
                        this.box.start_throw(aThrow, () => {
                            if (!--count) {
                                for(let item of items)
                                    item.resolve(true);
                                this._afterShow();
                            }
                        }
                        );
                    });
                });
            } else {
                for(let item of items)
                    item.resolve(false);
            }
        });
    }

    /**
     *
     * @private
     */
    _beforeShow() {
        if (this.timeoutHandle) {
            clearTimeout(this.timeoutHandle);
        }
        this.canvas.stop(true);
        this.canvas.show();
    }

    /**
     *
     * @private
     */
    _afterShow() {
        if (Dice3D.CONFIG.hideAfterRoll) {
            if(DiceSFXManager.renderQueue.length){
                clearTimeout(this.timeoutHandle);
                return;
            } else {
                this.timeoutHandle = setTimeout(() => {
                    if (!this.box.rolling) {
                        if (Dice3D.CONFIG.hideFX === 'none') {
                            this.canvas.hide();
                            this.box.clearAll();
                        }
                        if (Dice3D.CONFIG.hideFX === 'fadeOut') {
                        this.canvas.fadeOut({
                                duration: 1000,
                                complete: () => {
                                    this.box.clearAll();
                                },
                                fail: () => {
                                    this.canvas.fadeIn(0);
                                }
                            });
                        }
                    }
                }, Dice3D.CONFIG.timeBeforeHide);
            }
        }
    }

    copyto(obj, res) {
        if (obj == null || typeof obj !== 'object') return obj;
        if (obj instanceof Array) {
            for (var i = obj.length - 1; i >= 0; --i)
                res[i] = Dice3D.copy(obj[i]);
        }
        else {
            for (var i in obj) {
                if (obj.hasOwnProperty(i))
                    res[i] = Dice3D.copy(obj[i]);
            }
        }
        return res;
    }

    copy(obj) {
        if (!obj) return obj;
        return Dice3D.copyto(obj, new obj.constructor());
    }
}

class Accumulator {
    constructor (delay, onEnd) {
        this._timeout = null;
        this._delay = delay;
        this._onEnd = onEnd;
        this._items = [];
    }

    addItem (item) {
        this._items.push(item);
        if(this._timeout)
            clearTimeout(this._timeout);
        let callback = function(){
            this._onEnd(this._items)
            this._timeout = null
            this._items = [];
        }.bind(this);
        if(this._delay)
            this._timeout = setTimeout(callback, this._delay);
        else
            callback();
    }
}

/**
 * Form application to configure settings of the 3D Dice.
 */
class DiceConfig extends FormApplication {

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            title: game.i18n.localize("DICESONICE.configTitle"),
            id: "dice-config",
            template: "modules/dice-so-nice/templates/dice-config.html",
            width: 500,
            height: "auto",
            closeOnSubmit: true,
            tabs: [{navSelector: ".tabs", contentSelector: "form", initial: "general"}]
        })
    }

    getData(options) {
        let data = mergeObject({
            fxList: Utils.localize({
                "none": "DICESONICE.None",
                "fadeOut": "DICESONICE.FadeOut"
            }),
            speedList: Utils.localize({
                "1": "DICESONICE.NormalSpeed",
                "2": "DICESONICE.2xSpeed",
                "3": "DICESONICE.3xSpeed"
            }),
            textureList: Utils.prepareTextureList(),
            materialList: Utils.localize({
                "auto": "DICESONICE.MaterialAuto",
                "plastic": "DICESONICE.MaterialPlastic",
                "metal": "DICESONICE.MaterialMetal",
                "glass": "DICESONICE.MaterialGlass",
                "wood": "DICESONICE.MaterialWood",
                "chrome": "DICESONICE.MaterialChrome"
            }),
            fontList: Utils.prepareFontList(),
            colorsetList: Utils.prepareColorsetList(),
            shadowQualityList: Utils.localize({
                "none": "DICESONICE.None",
                "low": "DICESONICE.Low",
                "high": "DICESONICE.High"
            }),
            systemList: Utils.prepareSystemList(),
            soundsSurfaceList: Utils.localize({
                "felt": "DICESONICE.SurfaceFelt",
                "wood_table": "DICESONICE.SurfaceWoodTable",
                "wood_tray": "DICESONICE.SurfaceWoodTray",
                "metal": "DICESONICE.SurfaceMetal"
            }),
            canvasZIndexList: Utils.localize({
                "over": "DICESONICE.CanvasZIndexOver",
                "under": "DICESONICE.CanvasZIndexUnder",
            }),
            throwingForceList: Utils.localize({
                "weak": "DICESONICE.ThrowingForceWeak",
                "medium": "DICESONICE.ThrowingForceMedium",
                "strong": "DICESONICE.ThrowingForceStrong"
            }),
            specialEffectsMode:DiceSFXManager.SFX_MODE_LIST,
            specialEffects:Dice3D.SFX()
        },
            this.reset ? Dice3D.ALL_DEFAULT_OPTIONS() : Dice3D.ALL_CONFIG()
        );
        delete data.sfxLine;
        return data;
    }

    activateListeners(html) {
        super.activateListeners(html);

        let canvas = document.getElementById('dice-configuration-canvas');
        let config = mergeObject(
            this.reset ? Dice3D.ALL_DEFAULT_OPTIONS() : Dice3D.ALL_CONFIG(),
            { dimensions: { w: 500, h: 245 }, autoscale: false, scale: 60, boxType:"showcase" }
        );

        this.box = new DiceBox(canvas, game.dice3d.box.dicefactory, config);
        this.box.initialize().then(()=>{
            this.box.showcase(config);

            this.toggleHideAfterRoll();
            this.toggleAutoScale();
            this.toggleCustomColors();

            html.find('input[name="hideAfterRoll"]').change(this.toggleHideAfterRoll.bind(this));
            html.find('input[name="sounds"]').change(this.toggleSounds.bind(this));
            html.find('input[name="autoscale"]').change(this.toggleAutoScale.bind(this));
            html.find('select[name="colorset"]').change(this.toggleCustomColors.bind(this));
            html.find('input,select').change(this.onApply.bind(this));
            html.find('button[name="reset"]').click(this.onReset.bind(this));

            this.reset = false;
        });

        $(".sfx-create").click((ev)=>{
            renderTemplate("modules/dice-so-nice/templates/partial-sfx.html", {
                id: $(".sfx-line").length,
                specialEffectsMode: DiceSFXManager.SFX_MODE_LIST
            }).then((html)=>{
                $("#sfxs-list").append(html);
                this.setPosition();
            });
        });

        $(document).on("click", ".sfx-delete", (ev)=>{
            $(ev.target).parents(".sfx-line").remove();
            $(".sfx-line").each(function(index){
                $(this).find("input, select").each(function(){
                    let name = $(this).attr("name");
                    $(this).attr("name", name.replace(/(\w+\[)(\d+)(\]\[\w+\])/, "$1"+index+"$3"));
                });
            });
            this.setPosition();
        });
    }

    toggleHideAfterRoll() {
        let hideAfterRoll = $('input[name="hideAfterRoll"]')[0].checked;
        $('input[name="timeBeforeHide"]').prop("disabled", !hideAfterRoll);
        $('select[name="hideFX"]').prop("disabled", !hideAfterRoll);
    }

    toggleSounds() {
        let sounds = $('input[name="sounds"]')[0].checked;
        $('select[name="soundsSurface"]').prop("disabled", !sounds);
        $('input[name="soundsVolume"]').prop("disabled", !sounds);
        //$('.sounds-range-value').css({ 'opacity': !sounds ? 0.4 : 1 });
    }

    toggleAutoScale() {
        let autoscale = $('input[name="autoscale"]')[0].checked;
        $('input[name="scale"]').prop("disabled", autoscale);
        //$('.scale-range-value').css({ 'opacity': autoscale ? 0.4 : 1 });
    }

    toggleCustomColors() {
        let colorset = $('select[name="colorset"]').val() !== 'custom';
        $('input[name="labelColor"]').prop("disabled", colorset);
        $('input[name="diceColor"]').prop("disabled", colorset);
        $('input[name="outlineColor"]').prop("disabled", colorset);
        $('input[name="edgeColor"]').prop("disabled", colorset);
        $('input[name="labelColorSelector"]').prop("disabled", colorset);
        $('input[name="diceColorSelector"]').prop("disabled", colorset);
        $('input[name="outlineColorSelector"]').prop("disabled", colorset);
        $('input[name="edgeColorSelector"]').prop("disabled", colorset);
    }

    onApply(event) {
        event.preventDefault();

        setTimeout(() => {

            let config = {
                labelColor: $('input[name="labelColor"]').val(),
                diceColor: $('input[name="diceColor"]').val(),
                outlineColor: $('input[name="outlineColor"]').val(),
                edgeColor: $('input[name="edgeColor"]').val(),
                autoscale: false,
                scale: 60,
                shadowQuality: $('select[name="shadowQuality"]').val(),
                bumpMapping: $('input[name="bumpMapping"]').is(':checked'),
                colorset: $('select[name="colorset"]').val(),
                texture: $('select[name="texture"]').val(),
                material: $('select[name="material"]').val(),
                font: $('select[name="font"]').val(),
                sounds: $('input[name="sounds"]').is(':checked'),
                system: $('select[name="system"]').val(),
                throwingForce:$('select[name="throwingForce"]').val(),
                useHighDPI:$('input[name="useHighDPI"]').is(':checked')
            };
		    this.box.dicefactory.disposeCachedMaterials("showcase");
            this.box.update(config);
            this.box.showcase(config);
        }, 100);
    }

    onReset() {
        this.reset = true;
        this.render();
    }

    parseInputs(data) {
        var ret = {};
        retloop:
        for (var input in data) {
            var val = data[input];
    
            var parts = input.split('[');       
            var last = ret;
    
            for (var i in parts) {
                var part = parts[i];
                if (part.substr(-1) == ']') {
                    part = part.substr(0, part.length - 1);
                }
    
                if (i == parts.length - 1) {
                    last[part] = val;
                    continue retloop;
                } else if (!last.hasOwnProperty(part)) {
                    last[part] = {};
                }
                last = last[part];
            }
        }
        return ret;
    }

    async _updateObject(event, formData) {
        //Remove custom settings if custom isn't selected to prevent losing them in the user save
        formData = this.parseInputs(formData);
        let sfxLine = formData.sfxLine;
        if(sfxLine){
            for (let [key, value] of Object.entries(sfxLine)) {
                if(value.diceType == "" || value.onResult == "")
                delete sfxLine[key];
            }
            delete formData.sfxLine;
        }

        if(formData.colorset != "custom"){
                delete formData.labelColor;
                delete formData.diceColor;
                delete formData.outlineColor;
                delete formData.edgeColor;
        }

        let settings = mergeObject(Dice3D.CONFIG, formData, { insertKeys: false, insertValues: false });
        let appearance = mergeObject(Dice3D.APPEARANCE(), formData, { insertKeys: false, insertValues: false });

        await game.settings.set('dice-so-nice', 'settings', settings);
        await game.user.setFlag("dice-so-nice", "appearance", appearance);
        //required
        await game.user.unsetFlag("dice-so-nice", "sfxList");
        
        await game.user.setFlag("dice-so-nice", "sfxList", sfxLine);
        game.socket.emit("module.dice-so-nice", { type: "update", user: game.user.id});
        DiceSFXManager.init();
        ui.notifications.info(game.i18n.localize("DICESONICE.saveMessage"));
    }

    close(options){
        super.close(options);
        this.box.clearScene();
		this.box.dicefactory.disposeCachedMaterials("showcase");
    }
}
