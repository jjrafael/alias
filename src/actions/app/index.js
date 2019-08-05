import constants from '../../constants/app';

//APP
export function initializeApp() {
    return {}
}

//NON-API
export function toggleLoadingOverlay() {
    return {
        type: constants.TOGGLE_LOADING_OVERLAY,
    }
}