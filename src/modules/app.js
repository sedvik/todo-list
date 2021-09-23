import { todo } from '../factory_functions/todo.js';
import { project } from '../factory_functions/project.js';
import { pubSub } from './pubSub.js';

// app module contains todo list application data and functionality
const app = (function() {
    let _projects = [];
    let _activeProject;

    // _getStateData function - bundles app state data (_projects and _activeProject) for publishing through pubSub
    function _getStateData() {
        return {
            projects: _projects,
            activeProject: _activeProject
        };
    }

    // _getProjectFromName function - obtains the project object with a matching project name
    function _getProjectFromName(projectName) {
        const project = _projects.find(project => {
            return project.name === projectName;
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

    // getProjects functions - returns an array of app projects
    function getProjects() {
        return _projects;
    }

    // getActiveProject function - returns the current active project
    function getActiveProject() {
        return _activeProject;
    }

    // changeActiveProject function - changes the active application project
    function changeActiveProject(projectName) {
        const project = _getProjectFromName(projectName);
        _activeProject = project;
    }

    // addProject function - adds a new project to the _projects array
    function addProject(projectName) {
        const newProject = project(projectName);
        _projects.push(newProject);
    }

    // deleteProject function - deletes the project with the specified name from _projects array
    function deleteProject(projectName) {
        const index = _getProjectIndexFromName(projectName);

        // IMPLEMENT LOGIC THAT HANDLES WHEN THE DELETED PROJECT IS THE ACTIVE PROJECT
        _projects.splice(index, 1);
    }

    // addTodo function - adds a todo item to the activeProject
    function addTodo(title, description, dueDate, priority) {
        // Create todo item
        const todoItem = todo(title, description, dueDate, priority);

        // Append todo item to activeProject todos array
        _activeProject.addTodo(todoItem);
    }

    // deleteTodo function - deletes a todo item from the activeProject
    function deleteTodo(title) {
        _activeProject.deleteTodo(title);
    }

    // initialize function - initializes the application with the given projects array from localStorage
    function init(projects) {
        // Convert localStorage projects array to objects with prototype methods using factory functions
        projects.forEach(projectObj => {
            // Create a new project
            const newProject = project(projectObj.name);

            // Add each todo to the corresponding project
            projectObj.todos.forEach(item => {
                const todoItem = todo(item.title, item.description, item.dueDate, item.priority);
                newProject.addTodo(todoItem);
            });

            // Add project to _projects array
            _projects.push(newProject);
        });

        // Set the active project to the first item in the array
        _activeProject = _projects[0];

        // Publish 'initialize' event
        pubSub.publish('initialize', _getStateData());
    }

    return {
        getProjects,
        getActiveProject,
        changeActiveProject,
        addProject,
        deleteProject,
        addTodo,
        deleteTodo,
        init
    };
})();

export { app };