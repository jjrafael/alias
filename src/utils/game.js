//Utility for game/grid/leaders/rounds flow functionalities

export function getActiveRound(data) {
	const rounds = data && data.length ? data : [];
  return rounds.filter(d => d.status === 'active');
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