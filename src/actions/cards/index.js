import constants from '../../constants/cards';
import { baseURL } from '../../Firebase';

//DECKS

export function addDeck(data) {
	const ref = baseURL.decks;
    return {
    	types: [
    		constants.ADD_DECK_REQUEST,
    		constants.ADD_DECK_SUCCESS,
    		constants.ADD_DECK_FAILURE
    	],
    	method: 'add',
    	data: data,
    	callRef: ref,
    }
}

export function editDeck(id, data) {
	const ref = baseURL.decks.doc(id);
    return {
    	types: [
    		constants.EDIT_DECK_REQUEST,
    		constants.EDIT_DECK_SUCCESS,
    		constants.EDIT_DECK_FAILURE
    	],
    	method: 'set',
      data: data,
    	callRef: ref,
    }
}

export function readDeck(id, notStateSave) {
    const ref = baseURL.decks.doc(id);
    return {
        types: [
            constants.READ_DECK_REQUEST,
            constants.READ_DECK_SUCCESS,
            constants.READ_DECK_FAILURE
        ],
        method: 'get',
        payload: { notStateSave },
        callRef: ref,
    }
}

export function browseDecks() {
    const ref = baseURL.decks;
    return {
        types: [
            constants.BROWSE_DECK_REQUEST,
            constants.BROWSE_DECK_SUCCESS,
            constants.BROWSE_DECK_FAILURE
        ],
        method: 'get',
        callRef: ref,
    }
}

//CARDS

export function addCard(deckId, data) {
	const ref = baseURL.decks.doc(deckId).collection('cards');
    return {
    	types: [
    		constants.ADD_CARD_REQUEST,
    		constants.ADD_CARD_SUCCESS,
    		constants.ADD_CARD_FAILURE
    	],
    	method: 'add',
    	data: data,
    	callRef: ref,
    }
}

export function editCard(id, data, deckId) {
	const ref = baseURL.decks.doc(deckId).collection('cards');
    return {
    	types: [
    		constants.EDIT_CARD_REQUEST,
    		constants.EDIT_CARD_SUCCESS,
    		constants.EDIT_CARD_FAILURE
    	],
    	method: 'set',
      data: data,
    	callRef: ref,
    }
}

export function readCard(id, deckId, notStateSave) {
    const ref = baseURL.decks.doc(deckId).collection('cards').doc(id);
    return {
        types: [
            constants.READ_CARD_REQUEST,
            constants.READ_CARD_SUCCESS,
            constants.READ_CARD_FAILURE
        ],
        method: 'get',
        payload: { notStateSave },
        callRef: ref,
    }
}

export function browseCards(deckId) {
    const ref = baseURL.decks.doc(deckId).collection('cards');
    return {
        types: [
            constants.BROWSE_CARD_REQUEST,
            constants.BROWSE_CARD_SUCCESS,
            constants.BROWSE_CARD_FAILURE
        ],
        method: 'get',
        callRef: ref,
    }
}

//NON-API
export function setPlayingDecks(data) {
    return {
        type: constants.SET_PLAYING_DECKS,
        data,
    }
}