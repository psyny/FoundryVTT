import { PlaySoundEpicFail } from './sfx/PlaySoundEpicFail.js';
import { PlaySoundEpicWin } from './sfx/PlaySoundEpicWin.js';
import { PlayConfettiStrength1 } from './sfx/PlayConfettiStrength1.js';
import { PlayConfettiStrength2 } from './sfx/PlayConfettiStrength2.js';
import { PlayConfettiStrength3 } from './sfx/PlayConfettiStrength3.js';
import { PlayAnimationParticleSpiral } from './sfx/PlayAnimationParticleSpiral.js';
import { PlayAnimationParticleSparkles } from './sfx/PlayAnimationParticleSparkles.js';
import { PlayAnimationParticleVortex } from './sfx/PlayAnimationParticleVortex.js';
import { PlayAnimationBright } from './sfx/PlayAnimationBright.js';
import { PlayAnimationDark } from './sfx/PlayAnimationDark.js';
import { PlayAnimationThormund } from './sfx/PlayAnimationThormund.js';
import { PlayAnimationImpact } from './sfx/PlayAnimationImpact.js';

export const DiceSFXManager = {
    SFX_MODE_CLASS : {
        "PlayAnimationBright": PlayAnimationBright,
        "PlayAnimationDark": PlayAnimationDark,
        "PlayAnimationImpact": PlayAnimationImpact,
        "PlayConfettiStrength1": PlayConfettiStrength1,
        "PlayConfettiStrength2": PlayConfettiStrength2,
        "PlayConfettiStrength3": PlayConfettiStrength3,
        "PlayAnimationThormund": PlayAnimationThormund,
        "PlayAnimationParticleSpiral": PlayAnimationParticleSpiral,
        "PlayAnimationParticleSparkles": PlayAnimationParticleSparkles,
        "PlayAnimationParticleVortex": PlayAnimationParticleVortex,
        "PlaySoundEpicWin": PlaySoundEpicWin,
        "PlaySoundEpicFail": PlaySoundEpicFail
    },
    SFX_MODE_LIST : null,
    SFX_CLASS : {},
    renderQueue : [],
    garbageCollector : [],
    init : function(){
        if(!DiceSFXManager.SFX_MODE_LIST){
            DiceSFXManager.SFX_MODE_LIST = {};
            Object.values(DiceSFXManager.SFX_MODE_CLASS).forEach((sfx)=>{
                if(sfx.id.startsWith("PlayConfettiStrength") && (!game.modules.get("confetti") || !game.modules.get("confetti").active))
                    return;
                DiceSFXManager.SFX_MODE_LIST[sfx.id] = sfx.name;
            });
        }
        let sfxUniqueList = [];
        game.users.forEach((user) => {
            let sfxList = user.getFlag("dice-so-nice", "sfxList");
            if(sfxList){
                Object.values(sfxList).forEach((line) => {
                    sfxUniqueList.push(line.specialEffect);
                });
            }
        });
        //remove duplicate
        sfxUniqueList = sfxUniqueList.filter((v, i, a) => a.indexOf(v) === i);

        //for each possible sfx, initialize
        sfxUniqueList.forEach((sfxClassName) => {
            if(sfxClassName.startsWith("PlayConfettiStrength") && (!game.modules.get("confetti") || !game.modules.get("confetti").active))
                return;
            DiceSFXManager.addSFXMode(DiceSFXManager.SFX_MODE_CLASS[sfxClassName]);
        });
    },
    addSFXMode : function(sfx){
        if(sfx.id && sfx.name && !sfx.initialized){
            DiceSFXManager.SFX_CLASS[sfx.id] = sfx;
            sfx.initialized = true;
            sfx.init();
        }
    },
    playSFX : async function(id, box, dicemesh){
        if(!DiceSFXManager.SFX_CLASS[id])
            return;
        let sfxInstance = new DiceSFXManager.SFX_CLASS[id](box, dicemesh);
        if(typeof sfxInstance.render === 'function')
            DiceSFXManager.renderQueue.push(sfxInstance);
        if(sfxInstance.enableGC)
            DiceSFXManager.garbageCollector.push(sfxInstance);
        sfxInstance.play();
    },
    renderSFX : function(){
        let queue = [...DiceSFXManager.renderQueue];
        for(let i =0;i<queue.length;i++){
            let sfxInstance = queue[i];
            if(sfxInstance.destroyed){
                DiceSFXManager.endSFX(sfxInstance);
            } else {
                if(typeof sfxInstance.render === 'function')
                    sfxInstance.render();
            }
        }
    },
    endSFX : function(sfxInstance){
        let index = DiceSFXManager.renderQueue.indexOf(sfxInstance);
        if(index !== -1)
            DiceSFXManager.renderQueue.splice(index, 1);
        if(DiceSFXManager.renderQueue.length == 0)
            game.dice3d._afterShow();
    },
    clearQueue : function(){
        let queue = [...DiceSFXManager.renderQueue];
        for(let i =0;i<queue.length;i++){
            let sfxInstance = queue[i];
            if(typeof sfxInstance.destroy === 'function')
                sfxInstance.destroy();
                DiceSFXManager.endSFX(sfxInstance);
        }
        //For animations that do not have a render loop but still require some cleaning
        for(let i = 0;i<DiceSFXManager.garbageCollector.length;i++){
            DiceSFXManager.garbageCollector[i].destroy();
        }
        DiceSFXManager.garbageCollector = [];
    }
}