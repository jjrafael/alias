//Utility for game/grid/leaders/rounds flow functionalities

export function getActiveRound(data) {
	const rounds = data && data.length ? data : [];
  return rounds.filter(d => d.status === 'active');
}