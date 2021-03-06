import { firebaseApp } from './firebase.js';
import {
    getAuth,
    onAuthStateChanged
} from '@firebase/auth'
import { createSidebarContent } from '../views/sidebar.js';
import { createProjectTitleContent } from '../views/title.js';
import { createNewTodoContent } from '../views/newTodoSection.js';
import { createTodoListContent } from '../views/todoItems.js';
import { pubSub } from './pubSub.js';

// viewController module - controls DOM manipulation
const viewController = (function() {
    // Setup firebase authStateChange event listener to manipulate header based on auth state
    onAuthStateChanged(getAuth(firebaseApp), user => {
        const profileInfoDiv = document.querySelector('.profile-info');
        const loginFormDiv = document.querySelector('.login-form');
        
        if (user !== null) {
            // Populate email field, display profile info and hide login form
            const emailField = document.getElementById('email');
            emailField.innerText = user.displayName;
            profileInfoDiv.style.display = 'flex';
            loginFormDiv.style.display = 'none';
        } else {
            // Hide profile info and display login form
            profileInfoDiv.style.display = 'none';
            loginFormDiv.style.display = 'flex';
        }
    });
    
    // _showNewTodoForm function - Makes the "Add New Todo" form visible
    function _showNewTodoForm() {
        const form = document.querySelector('.add-todo');
        const formToggleBtn = document.querySelector('#add-todo-btn');
        form.style.display = 'block';
        formToggleBtn.style.display = 'none';
    }

    // _hideNewTodoForm function - Hides the "Add New Todo" form
    function _hideNewTodoForm() {
        const form = document.querySelector('.add-todo');
        const formToggleBtn = document.querySelector('#add-todo-btn');
        form.style.display = 'none';
        formToggleBtn.style.display = 'block';
    }

    // _clearNewTodoForm function - Clears form values from "Add New Todo" form
    function _clearNewTodoForm() {
        document.querySelector('#new-title').value = '';
        document.querySelector('#new-description').value = '';
        document.querySelector('#new-date').value = '';
        document.querySelector('input[name="new-priority"]:checked').checked = false;
    }

    // _showAlert function - alerts the given alert message to the window
    function _showAlert(alertMessage) {
        window.alert(alertMessage);
    }
    
    // _renderProjects function - renders sidebar content
    function _renderProjects(data) {
        // Clear the project-list sidebar
        const projectListDiv = document.querySelector('#project-list')
        projectListDiv.textContent = '';

        // Extract relevant data
        const projectList = data.projects.map(project => {
            // return project.name;
            return {
                name: project.name,
                id: project.id
            }
        });

        const activeProjectId = data.activeProject.id;

        // Generate project-list sidebar html
        const sidebarContent = createSidebarContent(projectList, activeProjectId);
        projectListDiv.appendChild(sidebarContent);
        
        pubSub.publish('projectsRender');
    }

    // _renderProjectTitle function - renders the project title on the page
    function _renderProjectTitle(data) {
        // Clear project-title-content
        const projectTitleDiv = document.querySelector('#project-title-content');
        projectTitleDiv.textContent = '';

        // Extract relevant data
        const activeProjectName = data.activeProject.name;

        // Generate project-title html
        const projectTitleContent = createProjectTitleContent(activeProjectName);
        projectTitleDiv.appendChild(projectTitleContent);
        
        pubSub.publish('projectTitleRender');
    }

    // _renderNewTodoContent function - renders page content related to adding new todo
    function _renderNewTodoContent() {
        // Clear new-todo-content div
        const newTodoContentDiv = document.querySelector('#new-todo-content');
        newTodoContentDiv.textContent = '';

        // Generate new-todo-content html
        const newTodoContent = createNewTodoContent();
        newTodoContentDiv.appendChild(newTodoContent);
        
        pubSub.publish('newTodoContentRender');
    }

    // _renderTodos function - renders todo content
    function _renderTodos(data) {
        // Clear todo-list-items div
        const todoListDiv = document.querySelector('#todo-list');
        todoListDiv.textContent = '';

        // Extract relevant data
        const todos = data.activeProject.todos;
        const activeTodo = data.activeProject.activeTodo;

        // Generate todo-list-items content
        const todoListContent = createTodoListContent(todos, activeTodo);
        todoListDiv.appendChild(todoListContent);
        
        pubSub.publish('todosRender');
    }
    
    // _renderFullPage function - renders the entire page's content
    function _renderFullPage(data) {
        _renderProjects(data);
        _renderProjectTitle(data);
        _renderNewTodoContent();
        _renderTodos(data);
    }
    
    // init function - Subscribes to pubSub events
    function init() {
        pubSub.subscribe('appInit', _renderFullPage);
        pubSub.subscribe('activateNewTodoForm', _showNewTodoForm);
        pubSub.subscribe('disableNewTodoForm', _hideNewTodoForm);
        pubSub.subscribe('projectsChange', _renderProjects);
        pubSub.subscribe('todosChange', _renderTodos);
        pubSub.subscribe('activeProjectChange', _renderFullPage);
        pubSub.subscribe('addTodo', _clearNewTodoForm);
        
        // Alert subscriptions
        pubSub.subscribe('invalidTodoFields', _showAlert);
        pubSub.subscribe('invalidProjectName', _showAlert);
        pubSub.subscribe('invalidProjectDeletion', _showAlert);
    }
    
    return { init };
})();

export { viewController };