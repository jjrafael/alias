import constants from '../constants';

const initialState = {
    playingCards: [],
    playingDecks: [],
    cardsOnGrid: [],
    selectedCardsOnGrid: [],
    decks: [],
    selectedDeck: null,
    newDeckCards: [],
    newDeck: null,
    readCard: null,

    //requests
    cardLoading: false,
    newGridShaffling: false,
    playingCardsLoading: false,
    submittingVotes: false,
    deckLoading: false,
    newDeckLoading: false,

    //failures
    cardError: false,
    newGridShaffleError: false,
    playingCardsError: false,
    voteError: false,
    deckError: false,
    newDeckError: false,
};

export default function Cards(state = initialState, action) {
    const cards = constants.cards;
    switch(action.type) {
        //CARDS
        case cards.ADD_CARD_REQUEST:
            return {
                ...state,
                cardLoading: true,
            }
        case cards.ADD_CARD_SUCCESS:
            return {
                ...state,
                cardLoading: false,
                readCard: action.response.data,
                cardError: false,
            }
        case cards.ADD_CARD_FAILURE:
            return {
                ...state,
                cardLoading: false,
                cardError: true,
            }

        case cards.EDIT_CARD_REQUEST:
            return {
                ...state,
                cardLoading: true,
            }
        case cards.EDIT_CARD_SUCCESS:
            return {
                ...state,
                cardLoading: false,
                readCard: action.response.data,
                cardError: false,
            }
        case cards.EDIT_CARD_FAILURE:
            return {
                ...state,
                cardLoading: false,
                cardError: true,
            }

        case cards.READ_CARD_REQUEST:
            return {
                ...state,
                cardLoading: true,
            }
        case cards.READ_CARD_SUCCESS:
            return {
                ...state,
                cardLoading: false,
                readCard: action.response.data,
                cardError: false,
            }
        case cards.READ_CARD_FAILURE:
            return {
                ...state,
                cardLoading: false,
                cardError: true,
            }

        case cards.BROWSE_CARD_REQUEST:
            return {
                ...state,
                cardLoading: true,
            }
        case cards.BROWSE_CARD_SUCCESS:
            return {
                ...state,
                cardLoading: false,
                readCard: action.response,
                cardError: false,
            }
        case cards.BROWSE_CARD_FAILURE:
            return {
                ...state,
                cardLoading: false,
                cardError: true,
            }

        //PLAYING & GRID CARDS
        case cards.GET_PLAYING_CARDS_REQUEST:
            return {
                ...state,
                playingCardsLoading: true,
            }
        case cards.GET_PLAYING_CARDS_SUCCESS:
            return {
                ...state,
                playingCardsLoading: false,
                playingCards: action.response.data,
                playingCardsError: false,
            }
        case cards.GET_PLAYING_CARDS_FAILURE:
            return {
                ...state,
                playingCardsLoading: false,
                playingCardsError: true,
            }

        case cards.GET_GRID_CARDS_REQUEST:
            return {
                ...state,
                newGridShaffling: true,
            }
        case cards.GET_GRID_CARDS_SUCCESS:
            return {
                ...state,
                newGridShaffling: false,
                cardsOnGrid: action.response.data,
                newGridShaffleError: false,
            }
        case cards.GET_GRID_CARDS_FAILURE:
            return {
                ...state,
                newGridShaffling: false,
                newGridShaffleError: true,
            }


        //DECK
        case cards.ADD_DECK_REQUEST:
            return {
                ...state,
                newDeckLoading: true,
            }
        case cards.ADD_DECK_SUCCESS:
            return {
                ...state,
                newDeckLoading: false,
                decks: [
                    ...state.decks,
                    {
                        ...action.payload,
                        id: action.response.id
                    }
                ],
                newDeckError: false,
            }
        case cards.ADD_DECK_FAILURE:
            return {
                ...state,
                newDeckLoading: false,
                newDeckError: true,
            }

        case cards.EDIT_DECK_REQUEST:
            return {
                ...state,
                deckLoading: true,
            }
        case cards.EDIT_DECK_SUCCESS:
            return {
                ...state,
                deckLoading: false,
                readCard: action.response.data,
                deckError: false,
            }
        case cards.EDIT_DECK_FAILURE:
            return {
                ...state,
                deckLoading: false,
                deckError: true,
            }

        case cards.READ_DECK_REQUEST:
            return {
                ...state,
                deckLoading: true,
            }
        case cards.READ_DECK_SUCCESS:
            return {
                ...state,
                deckLoading: false,
                selectedDeck: action.response.data,
                deckError: false,
            }
        case cards.READ_DECK_FAILURE:
            return {
                ...state,
                deckLoading: false,
                deckError: true,
            }

        case cards.BROWSE_DECK_REQUEST:
            return {
                ...state,
                deckLoading: true,
            }
        case cards.BROWSE_DECK_SUCCESS:
            return {
                ...state,
                deckLoading: false,
                decks: action.response,
                deckError: false,
            }
        case cards.BROWSE_DECK_FAILURE:
            return {
                ...state,
                deckLoading: false,
                deckError: true,
            }

        case cards.DELETE_DECK_REQUEST:
            return {
                ...state,
                deckLoading: true,
            }
        case cards.DELETE_DECK_SUCCESS:
            return {
                ...state,
                deckLoading: false,
                decks: action.response.data,
                deckError: false,
            }
        case cards.DELETE_DECK_FAILURE:
            return {
                ...state,
                deckLoading: false,
                deckError: true,
            }

        //VOTES
        case cards.SUBMIT_VOTES_REQUEST:
            return {
                ...state,
                submittingVotes: true,
            }
        case cards.SUBMIT_VOTES_SUCCESS:
            return {
                ...state,
                submittingVotes: false,
                cardsOnGrid: action.response.data,
                voteError: false,
            }
        case cards.SUBMIT_VOTES_FAILURE:
            return {
                ...state,
                submittingVotes: false,
                voteError: true,
            }

        case cards.SET_PLAYING_DECKS: 
            return {
                ...state,
                playingDecks: action.data,
            }

        default: 
            return state;
    }
}