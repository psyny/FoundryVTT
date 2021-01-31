"use strict"

export class DiceNotation {

	/**
	 * A roll object from Foundry 
	 * @param {Roll} rolls 
	 */
	constructor(rolls) {
		this.throws = [{dice:[]}];
		
		//First we need to prepare the data
		rolls.dice.forEach(die => {
			//We only are able to handle this list of number of face in 3D for now
			if([2, 3, 4, 5, 6, 8, 10, 12, 20, 100].includes(die.faces)) {
				//We flag every single die with a throw number, to queue exploded dice
				let cnt=die.number;
				let countExploded = 0;
				let localNbThrow = 0;
				for(let i =0; i< die.results.length; i++){
					if(localNbThrow >= this.throws.length)
						this.throws.push({dice:[]});

					if(die.results[i].exploded)
						countExploded++;
					die.results[i].indexThrow = localNbThrow;
					//If we have a new throw
					if(--cnt <= 0){
						localNbThrow++;
						cnt = countExploded;
						countExploded = 0;
					}
				}
			}
		});
		let diceNumber = 0;
		let maxDiceNumber = game.settings.get("dice-so-nice", "maxDiceNumber");
		//Then we can create the throws
		rolls.dice.some(die => {
			//We only are able to handle this list of number of face in 3D for now
			if([2, 3, 4, 5, 6, 8, 10, 12, 20, 100].includes(die.faces)) {
				for(let i =0; i< die.results.length; i++){
					if(++diceNumber >= maxDiceNumber)
						return true;
					this.addDie(die, i);
					if(die.faces == 100){
						this.addDie(die, i, true);
					}
				}
			}
		});
	}
	addDie(fvttDie, index, isd10of100 = false){
		let dsnDie = {};
		let dieValue = fvttDie.results[index].result;
		if(fvttDie.faces == 100) {
			//For d100, we create two d10 dice
			if(isd10of100) {
				dieValue = dieValue%10;
				dsnDie.resultLabel = fvttDie.constructor.getResultLabel(dieValue).toString();
			}
			else {
				dieValue = parseInt(dieValue/10);
				dsnDie.resultLabel = fvttDie.constructor.getResultLabel(dieValue*10).toString();
				//On a d100, 0 is 10, because.
				if(dieValue==10)
					dieValue=0;
			}
			dsnDie.d100Result = fvttDie.results[index].result;
		} else
			dsnDie.resultLabel = fvttDie.constructor.getResultLabel(dieValue).toString();
		dsnDie.result = dieValue;

		//If it is not a standard die ("d"), we need to prepend "d" to the denominator. If it is, we append the number of face
		dsnDie.type = fvttDie.constructor.DENOMINATION;
		if(fvttDie.constructor.name == "Die")
			dsnDie.type += isd10of100 ? "10":fvttDie.faces;
		else {
			dsnDie.type = "d"+dsnDie.type;
		}
		dsnDie.vectors = [];
		//Contains optionals flavor (core) and colorset (dsn) infos.
		dsnDie.options = duplicate(fvttDie.options);
		this.throws[fvttDie.results[index].indexThrow].dice.push(dsnDie);
	}

	static mergeQueuedRollCommands(queue){
		let mergedRollCommands = [];
		queue.forEach(command => {
			for(let i = 0; i< command.params.throws.length; i++){
				if(!mergedRollCommands[i])
					mergedRollCommands.push([]);
				command.params.throws[i].dsnConfig = command.params.dsnConfig;
				mergedRollCommands[i].push(command.params.throws[i]);
			}
		});
		//commands
		for(let i=0;i<mergedRollCommands.length;i++){
			//throw
			for(let j=0;j<mergedRollCommands[i].length;j++){
				let sfxList = mergedRollCommands[i][j].dsnConfig.specialEffects;
				if(!sfxList || !sfxList["0"])
					continue;
				//dice
				for(let k=0;k<mergedRollCommands[i][j].dice.length;k++){
					let specialEffects = Object.values(sfxList).filter(sfx => {
						return ((sfx.diceType == mergedRollCommands[i][j].dice[k].type && sfx.onResult == mergedRollCommands[i][j].dice[k].result.toString())
							|| 
						(sfx.diceType == "d100" && mergedRollCommands[i][j].dice[k].d100Result && mergedRollCommands[i][j].dice[k].d100Result.toString() == sfx.onResult))
					});
					if(specialEffects.length)
						mergedRollCommands[i][j].dice[k].specialEffects = specialEffects;
				}
			}
		}

		return mergedRollCommands;
	}
}