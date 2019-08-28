const menu = {
	signOut: {
		id: 'sign_out',
		label: 'Quit',
		type: 'func',
		dividerAbove: true,
		dividerBelow: true,
	},
	enterCode: {
		id: 'enter_code',
		label: 'Enter Code',
		type: 'modal'
	},
	about: {
		id: 'about_dev',
		label: 'About JJ Rafael',
		type: 'modal',
		dividerAbove: true,
	},
	resetTeam: {
		id: 'reset_team',
		label: 'Reset Team',
		type: 'modal'
	},
	startGame:{
		id: 'start_game',
		label: 'Start Game',
		type: 'func'
	},
	restartGame: {
		id: 'restart_game',
		label: 'Restart Game',
		type: 'modal'
	},
	pauseGame: {
		id: 'pause_game',
		label: 'Pause',
		type: 'func'
	}
}

export const homeMenu = [
	// menu.resetTeam,
	menu.enterCode,
	menu.signOut,
	menu.about
]

export const splashMenu = [
	menu.startGame,
	menu.enterCode,
	menu.about
]

export const inGridMenu = [
	menu.restartGame,
	menu.pauseGame,
	menu.signOut,
	menu.about
]

export const buildTeamMenu = [
	menu.signOut,
	menu.about
]

export const teamLeaderMenu = [
	menu.signOut,
	menu.about
]

export const aboutMenu = [
	menu.about
]

export default {
	homeMenu,
	inGridMenu,
	splashMenu,
	buildTeamMenu,
	teamLeaderMenu,
	aboutMenu,
};