export const signOut = {
	id: 'sign_out',
	label: 'Quit',
	type: 'func',
	dividerAbove: true,
	dividerBelow: true,
}

export const enterCode = {
	id: 'enter_code',
	label: 'Enter Code',
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
	enterCode,
	signOut,
	about
]

export const splashMenu = [
	{
		id: 'start_game',
		label: 'Start Game',
		type: 'func'
	},
	{
		id: 'add_cards',
		label: 'Add Cards',
		type: 'link'
	},
	enterCode,
	about
]

export const inGridMenu = [
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
	signOut,
	about
]

export const buildTeamMenu = [
	signOut,
	about
]

export const asTeamLeaderMenu = [
	signOut,
	about
]

export default {
	homeMenu,
	inGridMenu,
	splashMenu,
	buildTeamMenu,
	asTeamLeaderMenu,
	about: [about]
};