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
	howTo: {
		id: 'how_to_play',
		label: 'How To Play',
		type: 'modal',
	},
	aboutDev: {
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
	startApp:{
		id: 'start_app',
		label: 'Start App',
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
	},
	quitGame: {
		id: 'quit_game',
		label: 'Exit Game',
		type: 'modal'
	}
}

export const homeMenu = [
	// menu.resetTeam,
	menu.enterCode,
	menu.signOut,
	menu.howTo,
	menu.aboutDev
]

export const splashMenu = [
	menu.startApp,
	menu.enterCode,
	menu.howTo,
	menu.aboutDev
]

export const inGridMenu = [
	menu.restartGame,
	menu.pauseGame,
	menu.quitGame,
	menu.howTo,
	menu.aboutDev
]

export const buildTeamMenu = [
	menu.signOut,
	menu.howTo,
	menu.aboutDev
]

export const teamLeaderMenu = [
	menu.signOut,
	menu.howTo,
	menu.aboutDev
]

export const aboutMenu = [
	menu.aboutDev
]

export default {
	homeMenu,
	inGridMenu,
	splashMenu,
	buildTeamMenu,
	teamLeaderMenu,
	aboutMenu,
};