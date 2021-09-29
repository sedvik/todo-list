import { pubSub } from './pubSub.js';

// Storage module - handles storage/retrieval of browser localStorage data
const storage = (function() {
    // Default projects in the event that local storage is not available or contains no data
    const defaultProjects = [
        {
            name: 'Project 1',
            todos: []
        }
    ];
    
    // _isAvailable - Checks for browser local storage availability
    function _isAvailable() {
        try {
            const storage = window['localStorage'];
            const x = '__storage_test__';
            storage.setItem(x, x);
            storage.removeItem(x);
            return true;
        } catch(err) {
            return false;
        }
    }
    
    // _save function - Saves provided data to local storage
    function _save(data) {
        const projectData = JSON.stringify(data.projects);
        const storage = window['localStorage']
        storage.setItem('projects', projectData);
    }

    // load function - Retrieves data in local storage
    function load() {
        let projects;
        if (_isAvailable()) {
            const storage = window['localStorage'];
            projects = JSON.parse(storage.getItem('projects'));
            if (projects === null) {
                projects = defaultProjects;
            }
        }
        return projects;
    }
    
    // init function - Sets up pubSub subscriptions
    function init() {
        pubSub.subscribe('projectsChange', _save);
        pubSub.subscribe('todosChange', _save);
        pubSub.subscribe('activeProjectChange', _save);
        return;
    }

    return {
        init,
        load
    };
})();

export { storage };