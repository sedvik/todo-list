import { pubSub } from './pubSub.js';

// viewController module - controls DOM manipulation
const viewController = (function() {
    // init function - Subscribes to pubSub events
    function init() {
        const pageLoad = function(data) {
            console.log('Hello from viewController.js!')
            console.log(data);
        }
        pubSub.subscribe('initialize', pageLoad);
    }
    
    return {
        init
    };
})();

export { viewController };