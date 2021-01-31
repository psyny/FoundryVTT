import { DiceSFX } from '../DiceSFX.js';

export class PlayConfettiStrength3 extends DiceSFX {
    static id = "PlayConfettiStrength3";
    static name = "DICESONICE.PlayConfettiStrength3";

    /**@override play */
    async play(){
        const strength = window.confetti.confettiStrength.high;
        const shootConfettiProps = window.confetti.getShootConfettiProps(strength);

        window.confetti.handleShootConfetti(shootConfettiProps);
    }
}