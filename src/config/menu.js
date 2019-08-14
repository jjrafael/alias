export const signOut = {
	id: 'sign_out',
	label: 'Sign Out',
	type: 'func',
	dividerAbove: true,
	dividerBelow: true,
}

export const asTeamLeader = {
	id: 'as_team_leader',
	label: 'As Team Leader',
	type: 'modal'
}

export const about = {
	id: 'about_dev',
	label: 'About JJ Rafael',
	type: 'modal',
	dividerAbove: true,
}

export const homeMenu = [
	{
		id: 'reset_team',
		label: 'Reset Team',
		type: 'modal'
	},
	{
		id: 'as_team_leader',
		label: 'As Team Leader',
		type: 'modal'
	}
]

export const inGameMenu = [
	{
		id: 'reset_game',
		label: 'Reset Game',
		type: 'modal'
	},
	{
		id: 'restart_game',
		label: 'Restart Game',
		type: 'modal'
	},
	{
		id: 'pause_game',
		label: 'Pause',
		type: 'func'
	},
	asTeamLeader, 
	signOut
]

export default [
	...homeMenu,
	signOut,
	about
];