import { DiceSFX } from '../DiceSFX.js';

export class PlayConfettiStrength2 extends DiceSFX {
    static id = "PlayConfettiStrength2";
    static name = "DICESONICE.PlayConfettiStrength2";

    /**@override play */
    async play(){
        const strength = window.confetti.confettiStrength.med;
        const shootConfettiProps = window.confetti.getShootConfettiProps(strength);

        window.confetti.handleShootConfetti(shootConfettiProps);
    }
}