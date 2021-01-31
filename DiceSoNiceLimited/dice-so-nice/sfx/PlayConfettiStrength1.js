import { DiceSFX } from '../DiceSFX.js';

export class PlayConfettiStrength1 extends DiceSFX {
    static id = "PlayConfettiStrength1";
    static name = "DICESONICE.PlayConfettiStrength1";

    /**@override play */
    async play(){
        const strength = window.confetti.confettiStrength.low;
        const shootConfettiProps = window.confetti.getShootConfettiProps(strength);

        window.confetti.handleShootConfetti(shootConfettiProps);
    }
}