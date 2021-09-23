import { pubSub } from './pubSub.js';

// Storage module - handles storage/retrieval of browser localStorage data
const storage = (function() {
    // initialize function - Sets up pubSub subscriptions
    function init() {
        return;
    }

    return {
        init
    };
})();

export { storage };