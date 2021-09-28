import { pubSub } from './pubSub.js';

// viewController module - controls DOM manipulation
const viewController = (function() {
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
    
    // _renderProjects function - renders sidebar content
    function _renderProjects(data) {
        console.log(data);

        // Clear the project-list sidebar
        const projectListDiv = document.querySelector('#project-list')
        projectListDiv.textContent = '';

        // Generate project-list sidebar html
        const sidebarContent = '';
        
        pubSub.publish('projectsRender');
    }

    // _renderProjectTitle function - renders the project title on the page
    function _renderProjectTitle(data) {
        console.log(data);

        // Clear project-title-content
        const projectTitleDiv = document.querySelector('#project-title-content');
        projectTitleDiv.textContent = '';

        // Generate project-title html
        const projectTitleContent = '';
        
        pubSub.publish('projectTitleRender');
    }

    // _renderNewTodoContent function - renders page content related to adding new todo
    function _renderNewTodoContent(data) {
        console.log(data);
        
        pubSub.publish('newTodoContentRender');
    }

    // _renderTodos function - renders todo content
    function _renderTodos(data) {
        console.log(data);
        
        pubSub.publish('todosRender');
    }
    
    // _renderFullPage function - renders the entire page's content
    function _renderFullPage(data) {
        _renderProjects(data);
        _renderProjectTitle(data);
        _renderNewTodoContent(data);
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
    }
    
    return { init };
})();

export { viewController };