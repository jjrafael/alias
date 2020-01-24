//Utility for game/grid/leaders/rounds flow functionalities
import { groupBy } from 'lodash';

export function getActiveRound(data, returnOne) {
	let rounds = data && data.length ? data : [];
	rounds = rounds.filter(d => d.status === 'active');
	rounds = rounds.length > 1
		? (returnOne ? rounds[0] : rounds)
		: (rounds && rounds.length ? rounds[0] : null);
  return rounds;
}

export function getLastRound(data, lastEnd) {
	let rounds = data && data.length ? data : [];
	rounds = rounds.filter(d => {
		return lastEnd ? d.status === 'end'
		: ['end', 'active'].indexOf(d.status) !== -1
	});
	const lastIndex = rounds.length ? rounds.length - 1 : 0;
	return rounds[lastIndex];
}

export function getValidRounds(data){
	const arr = data.filter(d => d.status !== 'invalid');
	const activeRound = getActiveRound(arr, true);
	const latest = activeRound || getLastRound(arr);
	let rounds = [];
	
	if(activeRound){
		for(var i = 1; i < latest.round_number; i++){
			const index = i - 1;
			if(arr[index]){
				rounds.push(arr[index]);
			}
		}
	}

	return rounds;
}

export function getTotalScore(team, rounds){
	const arr = getValidRounds(rounds);
	return arr.length ? arr.reduce((sum, d) => sum + d[`team${team}`].score, 0) : 0;
}

export function getTotalViolations(team, rounds){
	const arr = getValidRounds(rounds);
	return arr.length ? arr.reduce((sum, d) => sum + d[`team${team}`].violations, 0) : 0;
}

export function getTeamNumber(data, returnDefault){
	const defaultNum = 1;
	let num = null;

	if(data && data.team_number){
		num = data.team_number;
	}else if(data && data.turn_of){
		num = data.turn_of;
	}

	if(returnDefault && !num){
		num = defaultNum;
	}

	return num;
}

export function getCardsPerType(cards, type){
	if(cards && Array.isArray(cards) && cards.length){
		return type ? groupBy(cards, 'type')[type] : groupBy(cards, 'type');
	}else{
		return type ? [] : null;
	}
}