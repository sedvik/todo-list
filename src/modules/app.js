// import { initializeApp, getApp } from '@firebase/app';
import { firebaseApp } from './firebase.js';
import { 
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signOut
} from '@firebase/auth';
import { todo } from '../factory_functions/todo.js';
import { project } from '../factory_functions/project.js';
import { pubSub } from './pubSub.js';

// app module contains todo list application data and functionality
const app = (function() {
    /*
     * Firebase Auth functionality
     */

    // Sign into application
    async function signIn() {
        let provider = new GoogleAuthProvider();
        await signInWithPopup(getAuth(firebaseApp), provider);
    }

    // // Sign out of application
    function signOutUser() {
        signOut(getAuth(firebaseApp));
    }

    /*
     * App project and todo functionality 
     */
    
    let _projects = [];
    let _activeProject;

    // _getStateData function - bundles app state data (_projects and _activeProject) for publishing through pubSub
    function _getStateData() {
        return {
            projects: _projects,
            activeProject: _activeProject,
        };
    }

    // _getProjectFromName function - obtains the project object with a matching project name
    function _getProjectFromName(projectName) {
        const project = _projects.find(project => {
            return project.name === projectName;
        });
        return project;
    }

    // _getProjectFromId function - obtains the project object with a matching project id
    function _getProjectFromId(projectId) {
        const project = _projects.find(project => {
            return project.id === projectId;
        });
        return project;
    }

    // _getProjectIndexFromName - obtains the index of the project with the specified name within the _projects array
    function _getProjectIndexFromName(projectName) {
        const index = _projects.findIndex(project => {
            return project.name === projectName;
        });
        return index;
    }

    // _getProjectIndexFromId - obtains the index of the project with the specified id within the _projects array
    function _getProjectIndexFromId(projectId) {
        const index = _projects.findIndex(project => {
            return project.id === projectId;
        });
        return index;
    }

    // _isValidTodo function - validates the Add New Todo form values and updates to existing todos
    function _isValidTodo(title, description, dueDate, priority, isUpdate) {
        // Title, description, dueDate, and priority fields must all be filled in
        let alertMessage;

        if (title === undefined || title === '') {
            alertMessage = 'Please enter a todo title';
        } else if (description === undefined || description === '') {
            alertMessage = 'Please enter a todo description';
        } else if (dueDate === undefined || dueDate === '') {
            alertMessage = 'Please enter a todo due date';
        } else if (priority === null) {
            alertMessage = 'Please select a todo priority';
        } else {
            return true;
        }
        pubSub.publish('invalidTodoFields', alertMessage);
    }
    
    // getProjects functions - returns an array of app projects
    function getProjects() {
        return _projects;
    }

    // getActiveProject function - returns the current active project
    function getActiveProject() {
        return _activeProject;
    }

    // changeActiveProject function - changes the active application project
    function changeActiveProject(projectId) {
        const project = _getProjectFromId(projectId);
        _activeProject = project;
        pubSub.publish('activeProjectChange', _getStateData());
    }

    // addProject function - adds a new project to the _projects array
    function addProject(projectName) {
        const newProject = project(projectName);
        _projects.push(newProject);
        pubSub.publish('projectsChange', _getStateData());
    }

    // deleteProject function - deletes the project with the specified name from _projects array
    function deleteProject(projectId) {
        const index = _getProjectIndexFromId(projectId);

        // Return out if last project is attempted to be deleted
        if (_projects.length === 1) {
            pubSub.publish('invalidProjectDeletion', 'Projects list cannnot be empty');
            return;
        }
        
        // If the deleted project is the active project, set the active project to the first item in the projects list
        let activeProjectDeleted;
        if (_activeProject.id === projectId) {
            activeProjectDeleted = true;
        }

        _projects.splice(index, 1);

        // Set a new active project if the active project was deleted
        if (activeProjectDeleted) {
            const newActiveProjectId = _projects[0].id;
            changeActiveProject(newActiveProjectId);
        } else {
            pubSub.publish('projectsChange', _getStateData());
        }
    }

    // addTodo function - adds a todo item to the activeProject
    function addTodo(title, description, dueDate, priority) {
        if (!_isValidTodo(title, description, dueDate, priority, false)) {
            return;
        }
        
        // Create todo item
        const todoItem = todo(title, description, dueDate, priority);

        // Append todo item to activeProject todos array
        _activeProject.addTodo(todoItem);

        pubSub.publish('addTodo')
        pubSub.publish('todosChange', _getStateData());
    }

    // changeTodo function - modifies active todo item of activeproject to specified parameters
    function changeTodo(newTitle, newDescription, newDueDate, newPriority) {
        if (!_isValidTodo(newTitle, newDescription, newDueDate, newPriority, true)) {
            return;
        }
        const activeTodo = _activeProject.activeTodo;
        activeTodo.update(newTitle, newDescription, newDueDate, newPriority);
        // Reset the project active todo to null 
        _activeProject.setActiveTodo();

        pubSub.publish('todosChange', _getStateData());
    }

    // changeActiveTodo function - changes the active todo item for the current project
    function changeActiveTodo(todoId) {
        _activeProject.setActiveTodo(todoId);
        pubSub.publish('todosChange', _getStateData());
    }

    // deleteTodo function - deletes the active todo item from the activeProject
    function deleteActiveTodo() {
        _activeProject.deleteActiveTodo();
        pubSub.publish('todosChange', _getStateData());
    }

    // toggleTodoComplete function - toggles the active todo items complete status
    function toggleTodoComplete() {
        _activeProject.activeTodo.toggleComplete();
        pubSub.publish('todosChange', _getStateData());
    }

    // init function - initializes the application with the given projects array from localStorage
    function init(projects) {
        // Convert localStorage projects array to objects with prototype methods using factory functions
        projects.forEach(projectObj => {
            // Create a new project
            const newProject = project(projectObj.name, projectObj.id);

            // Add each todo to the corresponding project
            projectObj.todos.forEach(item => {
                const todoItem = todo(item.title, item.description, item.dueDate, item.priority, item.id, item.complete);
                newProject.addTodo(todoItem);
            });

            // Add project to _projects array
            _projects.push(newProject);
        });

        // Set the active project to the first item in the array
        _activeProject = _projects[0];

        // Publish 'initialize' event
        pubSub.publish('appInit', _getStateData());
    }

    return {
        signIn,
        signOutUser,
        getProjects,
        getActiveProject,
        changeActiveProject,
        addProject,
        deleteProject,
        addTodo,
        changeTodo,
        changeActiveTodo,
        deleteActiveTodo,
        toggleTodoComplete,
        init
    };
})();

export { app };