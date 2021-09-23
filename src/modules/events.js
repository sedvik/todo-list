import { pubSub } from './pubSub.js';

// Events module - coordinates event addition/modification to dom nodes
const events = (function() {
    // initialize function - creates pubSub subscriptions
    function init() {
        return;
    }

    return {
        init
    };
})();

export { events };