/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/factory_functions/project.js":
/*!******************************************!*\
  !*** ./src/factory_functions/project.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "project": () => (/* binding */ project)
/* harmony export */ });
// project prototype
const projectProto = {
    findIndexByTitle: function(todoTitle) {
        const index = this.todos.findIndex(todo => {
            return todo.title === todoTitle;
        });
        return index;
    },
    addTodo: function(newTodo) {
        this.todos.push(newTodo);
    },
    deleteTodo: function(todoTitle) {
        const index = this.findIndexByTitle(todoTitle);
        if (index !== -1) {
            this.todos.splice(index, 1);
        }
    },
    deleteActiveTodo: function() {
        const index = this.findIndexByTitle(this.activeTodo.title);
        if (index !== -1) {
            this.activeTodo = null;
            this.todos.splice(index, 1);
        }
    },
    setActiveTodo: function(todoTitle) {
        // If setActiveTodo is called with no arguments, set activeTodo to null
        if (todoTitle === undefined) {
            this.activeTodo = null;
        }

        const index = this.findIndexByTitle(todoTitle);
        if (index !== -1) {
            this.activeTodo = this.todos[index];
        }
    }
};

// project factory function
function project(name) {
    const todos = [];
    let activeTodo = null;
    return Object.assign(Object.create(projectProto), {
        name,
        activeTodo,
        todos
    });
}



/***/ }),

/***/ "./src/factory_functions/todo.js":
/*!***************************************!*\
  !*** ./src/factory_functions/todo.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "todo": () => (/* binding */ todo)
/* harmony export */ });
// todo prototype
const todoProto = {
    changeTitle: function(newTitle) {
        this.title = newTitle;
    },
    changeDescription: function(newDescription) {
        this.description = newDescription;
    },    
    changeDueDate: function(newDueDate) {
        this.dueDate = newDueDate;
    },
    changePriority: function(newPriority) {
        this.priority = newPriority;
    },
    toggleComplete: function() {
        this.complete = !this.complete;
    },
    update: function(newTitle, newDescription, newDueDate, newPriority) {
        this.changeTitle(newTitle);
        this.changeDescription(newDescription);
        this.changeDueDate(newDueDate);
        this.changePriority(newPriority);
    }
};

// todo factory function
function todo(title, description, dueDate, priority) {
    return Object.assign(Object.create(todoProto), {
        title,
        description,
        dueDate,
        priority,
        complete: false
    });
}



/***/ }),

/***/ "./src/modules/app.js":
/*!****************************!*\
  !*** ./src/modules/app.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "app": () => (/* binding */ app)
/* harmony export */ });
/* harmony import */ var _factory_functions_todo_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../factory_functions/todo.js */ "./src/factory_functions/todo.js");
/* harmony import */ var _factory_functions_project_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../factory_functions/project.js */ "./src/factory_functions/project.js");
/* harmony import */ var _pubSub_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./pubSub.js */ "./src/modules/pubSub.js");




// app module contains todo list application data and functionality
const app = (function() {
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

    // _getProjectIndexFromName - obtains the index of the project with the specified name within the _projects array
    function _getProjectIndexFromName(projectName) {
        const index = _projects.findIndex(project => {
            return project.name === projectName;
        });
        return index;
    }

    // _isValidProjectName function - returns true if project has a unique name
    function _isValidProjectName(name) {
        const projectNames = _projects.map(project => {
            return project.name;
        });
        if (projectNames.includes(name)) {
            _pubSub_js__WEBPACK_IMPORTED_MODULE_2__.pubSub.publish('invalidProjectName', 'Please enter a unique project name');
            return false;
        } else {
            return true;
        }
    }

    // _isUniqueTodoTitle function - Returns true if todo has a valid unique name
    function _isUniqueTodoTitle(title, isUpdate) {
        const todoTitles = _activeProject.todos.map(todo => {
            return todo.title;
        });

        if (todoTitles.includes(title)) {
            // If this check is performed for a todo update, the title may be the same as the activeTodo of the active project
            if (isUpdate) {
                const activeTodoTitle = _activeProject.activeTodo.title;
                if (activeTodoTitle === title) {
                    return true;
                }
            }
            return false;
        } else {
            return true;
        }
    }

    // _isValidTodo function - validates the Add New Todo form values and updates to existing todos
    function _isValidTodo(title, description, dueDate, priority, isUpdate) {
        // Title, description, dueDate, and priority fields must all be filled in
        let alertMessage;
        if (!_isUniqueTodoTitle(title, isUpdate)) {
            alertMessage = 'Todo title must be unique';
        } else if (title === undefined || title === '') {
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
        _pubSub_js__WEBPACK_IMPORTED_MODULE_2__.pubSub.publish('invalidTodoFields', alertMessage);
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
        _pubSub_js__WEBPACK_IMPORTED_MODULE_2__.pubSub.publish('activeProjectChange', _getStateData());
    }

    // addProject function - adds a new project to the _projects array
    function addProject(projectName) {
        if (!_isValidProjectName(projectName)) {
            return;
        }
        const newProject = (0,_factory_functions_project_js__WEBPACK_IMPORTED_MODULE_1__.project)(projectName);
        _projects.push(newProject);
        _pubSub_js__WEBPACK_IMPORTED_MODULE_2__.pubSub.publish('projectsChange', _getStateData());
    }

    // deleteProject function - deletes the project with the specified name from _projects array
    function deleteProject(projectName) {
        const index = _getProjectIndexFromName(projectName);
        
        // If the deleted project is the active project, set the active project to the first item in the projects list
        let activeProjectDeleted;
        if (_activeProject.name === projectName) {
            activeProjectDeleted = true;
        }

        _projects.splice(index, 1);

        // Set a new active project if the active project was deleted
        if (activeProjectDeleted) {
            const newActiveProjectName = _projects[0].name;
            changeActiveProject(newActiveProjectName);
        } else {
            _pubSub_js__WEBPACK_IMPORTED_MODULE_2__.pubSub.publish('projectsChange', _getStateData());
        }
    }

    // addTodo function - adds a todo item to the activeProject
    function addTodo(title, description, dueDate, priority) {
        if (!_isValidTodo(title, description, dueDate, priority, false)) {
            return;
        }
        
        // Create todo item
        const todoItem = (0,_factory_functions_todo_js__WEBPACK_IMPORTED_MODULE_0__.todo)(title, description, dueDate, priority);

        // Append todo item to activeProject todos array
        _activeProject.addTodo(todoItem);

        _pubSub_js__WEBPACK_IMPORTED_MODULE_2__.pubSub.publish('todosChange', _getStateData());
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

        _pubSub_js__WEBPACK_IMPORTED_MODULE_2__.pubSub.publish('todosChange', _getStateData());
    }

    // changeActiveTodo function - changes the active todo item for the current project
    function changeActiveTodo(todoTitle) {
        _activeProject.setActiveTodo(todoTitle);
        _pubSub_js__WEBPACK_IMPORTED_MODULE_2__.pubSub.publish('todosChange', _getStateData());
    }

    // deleteTodo function - deletes the active todo item from the activeProject
    function deleteActiveTodo() {
        _activeProject.deleteActiveTodo();
        _pubSub_js__WEBPACK_IMPORTED_MODULE_2__.pubSub.publish('todosChange', _getStateData());
    }

    // toggleTodoComplete function - toggles the active todo items complete status
    function toggleTodoComplete() {
        _activeProject.activeTodo.toggleComplete();
        _pubSub_js__WEBPACK_IMPORTED_MODULE_2__.pubSub.publish('todosChange', _getStateData());
    }

    // init function - initializes the application with the given projects array from localStorage
    function init(projects) {
        // Convert localStorage projects array to objects with prototype methods using factory functions
        projects.forEach(projectObj => {
            // Create a new project
            const newProject = (0,_factory_functions_project_js__WEBPACK_IMPORTED_MODULE_1__.project)(projectObj.name);

            // Add each todo to the corresponding project
            projectObj.todos.forEach(item => {
                const todoItem = (0,_factory_functions_todo_js__WEBPACK_IMPORTED_MODULE_0__.todo)(item.title, item.description, item.dueDate, item.priority);
                newProject.addTodo(todoItem);
            });

            // Add project to _projects array
            _projects.push(newProject);
        });

        // Set the active project to the first item in the array
        _activeProject = _projects[0];

        // Publish 'initialize' event
        _pubSub_js__WEBPACK_IMPORTED_MODULE_2__.pubSub.publish('appInit', _getStateData());
    }

    return {
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



/***/ }),

/***/ "./src/modules/events.js":
/*!*******************************!*\
  !*** ./src/modules/events.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "events": () => (/* binding */ events)
/* harmony export */ });
/* harmony import */ var _pubSub_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./pubSub.js */ "./src/modules/pubSub.js");
/* harmony import */ var _app_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./app.js */ "./src/modules/app.js");
/* harmony import */ var _viewController_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./viewController.js */ "./src/modules/viewController.js");




// Events module - coordinates event addition/modification to dom nodes
const events = (function() {
    /* Event handler functions */
    // _createNewProject function - Creates a new project
    function _createNewProject() {
        // Extract new project name
        const projectNameInput = document.querySelector('#add-project input');
        const projectName = projectNameInput.value;

        // Add project to app model
        if (projectName) {
            _app_js__WEBPACK_IMPORTED_MODULE_1__.app.addProject(projectName);
        }

        // Clear project name field
        projectNameInput.value = '';
    }

    // _selectProject function - Sets the active project
    function _selectProject(e) {
        const projectName = e.target.parentNode.getAttribute('data-name');
        _app_js__WEBPACK_IMPORTED_MODULE_1__.app.changeActiveProject(projectName);
    }

    // _deleteProject function - Deletes the selected project
    function _deleteProject(e) {
        const projectName = e.target.parentNode.getAttribute('data-name');
        if (window.confirm(`Are you sure you want to delete the ${projectName} project?`)) {
            _app_js__WEBPACK_IMPORTED_MODULE_1__.app.deleteProject(projectName);
        }
    }

    // _showNewTodoForm function - Shows the new todo form and hides the "Add Todo" button
    function _showNewTodoForm() {
        _pubSub_js__WEBPACK_IMPORTED_MODULE_0__.pubSub.publish('activateNewTodoForm');
    }

    // _exitNewTodoForm function - Hides the new todo form and displays the "Add Todo" button
    function _exitNewTodoForm() {
        _pubSub_js__WEBPACK_IMPORTED_MODULE_0__.pubSub.publish('disableNewTodoForm');
    }

    // _addNewTodo function - Extracts form values and adds a new todo to the active project
    function _addNewTodo() {
        // Extract form values
        const title = document.querySelector('#new-title').value;
        const description = document.querySelector('#new-description').value;
        const dueDate = document.querySelector('#new-date').value;
        const priorityInput = document.querySelector('input[name="new-priority"]:checked');
        let priority;
        if (priorityInput) {
            priority = priorityInput.value;
        } else {
            priority = null;
        }

        _app_js__WEBPACK_IMPORTED_MODULE_1__.app.addTodo(title, description, dueDate, priority); 
    }

    // _setActiveTodo function - Sets an inactive todo to active
    function _setActiveTodo(e) {
        const todoTitle = e.target.getAttribute('data-title');
        _app_js__WEBPACK_IMPORTED_MODULE_1__.app.changeActiveTodo(todoTitle);
    }

    // _toggleTodoComplete function - Toggles the active todo's completion status
    function _toggleTodoComplete() {
        _app_js__WEBPACK_IMPORTED_MODULE_1__.app.toggleTodoComplete();
    }

    // _deleteActiveTodo function - Deletes the active todo
    function _deleteActiveTodo() {
        if(window.confirm('Do you want to delete this todo item?')) {
            _app_js__WEBPACK_IMPORTED_MODULE_1__.app.deleteActiveTodo();
        }
    }

    // _updateActiveTodo function - Updates the active todo function with updated form values
    function _updateActiveTodo() {
        // Extract form values
        const newTitle = document.querySelector('#update-title').value;
        const newDescription = document.querySelector('#update-description').value;
        const newDueDate = document.querySelector('#update-date').value;
        const newPriority = document.querySelector('input[name="update-priority"]:checked').value;

    _app_js__WEBPACK_IMPORTED_MODULE_1__.app.changeTodo(newTitle, newDescription, newDueDate, newPriority);

    }

    /* Event Setting functions - These functions apply event handlers to DOM elements */

    // _assignNewProjectEvent function - Adds event handler to the sidebar New Project button
    function _assignNewProjectEvent() {
        const newProjectBtn = document.querySelector('#add-project-btn');
        newProjectBtn.addEventListener('click', _createNewProject);
    }

    // _assignProjectEvents function - Adds event handlers to project items in the sidebar
    function _assignProjectEvents() {
        const projectItems = document.querySelectorAll('.project-name');
        projectItems.forEach(project => {
            project.addEventListener('click', _selectProject);
        });
    }

    // _assignDelProjectEvents function - Adds event handlers to project delete buttons
    function _assignDelProjectEvents() {
        const projectDelButtons = document.querySelectorAll('.del-project');
        projectDelButtons.forEach(button => {
            button.addEventListener('click', _deleteProject);
        });
    }

    // _assignAddTodoEvent function - Add event handler to Add Todo button
    function _assignAddTodoEvent() {
        const addTodoBtn = document.querySelector('#add-todo-btn');
        addTodoBtn.addEventListener('click', _showNewTodoForm);
    }

    // _assignCloseTodoEvent function - Add event handler to button that closes the new todo form
    function _assignCloseTodoEvent() {
        const closeNewTodoBtn = document.querySelector('#close-new-todo-form');
        closeNewTodoBtn.addEventListener('click', _exitNewTodoForm);
    }

    // _assignSubmitTodoEvent function - Add event handler to "Add" button which submits content from the new todo form
    function _assignSubmitTodoEvent() {
        const submitTodoBtn = document.querySelector('#submit-todo-btn');
        submitTodoBtn.addEventListener('click', _addNewTodo);
    }

    // _assignSetActiveEvents function - Adds event handlers to inactive todo items on the page
    function _assignSetActiveEvents() {
        const inactiveTodos = document.querySelectorAll('.inactive-todo');
        inactiveTodos.forEach(todo => {
            todo.addEventListener('click', _setActiveTodo);
        });
    }

    // _assignToggleTodoCompleteEvent function - Adds event handler to button for toggling todo completion
    function _assignToggleTodoCompleteEvent() {
        const toggleCompleteBtn = document.querySelector('#toggle-complete');
        if (toggleCompleteBtn === null) {
            return;
        }
        toggleCompleteBtn.addEventListener('click', _toggleTodoComplete);
    }

    // _assignDeleteActiveTodoEvent function - Adds event handler to button that deletes the active todo
    function _assignDeleteActiveTodoEvent() {
        const delTodoBtn = document.querySelector('#del-active-todo');
        if (delTodoBtn === null) {
            return;
        }
        delTodoBtn.addEventListener('click', _deleteActiveTodo);
    }

    // _assignUpdateActiveTodoEvent function - Adds event handler to save button that updates active todo information
    function _assignUpdateActiveTodoEvent() {
        const saveBtn = document.querySelector('#save-btn');
        if (saveBtn === null) {
            return;
        }
        saveBtn.addEventListener('click', _updateActiveTodo);
    }

    // _assignSidebarEvents wrapper function - Add event handlers to the Projects side bar
    function _assignSidebarEvents() {
        _assignNewProjectEvent();
        _assignProjectEvents();
        _assignDelProjectEvents()
    }

    // _assignNewTodoEvents wrapper function - Add event handlers associated with adding a new todo
    function _assignNewTodoEvents() {
        _assignAddTodoEvent();
        _assignCloseTodoEvent();
        _assignSubmitTodoEvent();
    }

    // _assignTodoListEvents wrapper function - Add event handlers to Todo Items section
    function _assignTodoListEvents() {
        _assignSetActiveEvents();
        _assignToggleTodoCompleteEvent();
        _assignDeleteActiveTodoEvent();
        _assignUpdateActiveTodoEvent();
    }
    
    // init function - creates pubSub subscriptions
    function init() {
        // pubSub.subscribe('fullPageRender', _assignFullPageEvents);
        // On projectsRender, assign event handlers to the projects sidebar
        _pubSub_js__WEBPACK_IMPORTED_MODULE_0__.pubSub.subscribe('projectsRender', _assignSidebarEvents);

        // On newTodoContentRender, assign associated form event handlers
        _pubSub_js__WEBPACK_IMPORTED_MODULE_0__.pubSub.subscribe('newTodoContentRender', _assignNewTodoEvents);

        // On todosRender, assign associated page event handlers
        _pubSub_js__WEBPACK_IMPORTED_MODULE_0__.pubSub.subscribe('todosRender', _assignTodoListEvents);

        return;
    }

    return {
        init
    };
})();



/***/ }),

/***/ "./src/modules/pubSub.js":
/*!*******************************!*\
  !*** ./src/modules/pubSub.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "pubSub": () => (/* binding */ pubSub)
/* harmony export */ });
const pubSub = {
    events: {},
    subscribe: function(eventName, fn) {
        this.events[eventName] = this.events[eventName] || [];
        this.events[eventName].push(fn);
    },
    unsubscribe: function(eventName, fn) {
        if (this.events[eventName]) {
        for (let i = 0; i < this.events[eventName].length; i++) {
            if (this.events[eventName][i] === fn) {
            this.events[eventName].splice(i, 1);
            break;
            }
        };
        }
    },
    publish: function(eventName, data) {
        if (this.events[eventName]) {
        this.events[eventName].forEach(function(fn) {
            fn(data);
        });
        }
    }
};



/***/ }),

/***/ "./src/modules/storage.js":
/*!********************************!*\
  !*** ./src/modules/storage.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "storage": () => (/* binding */ storage)
/* harmony export */ });
/* harmony import */ var _pubSub_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./pubSub.js */ "./src/modules/pubSub.js");


// Storage module - handles storage/retrieval of browser localStorage data
const storage = (function() {
    // init function - Sets up pubSub subscriptions
    function init() {
        return;
    }

    return {
        init
    };
})();



/***/ }),

/***/ "./src/modules/viewController.js":
/*!***************************************!*\
  !*** ./src/modules/viewController.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "viewController": () => (/* binding */ viewController)
/* harmony export */ });
/* harmony import */ var _views_sidebar_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../views/sidebar.js */ "./src/views/sidebar.js");
/* harmony import */ var _views_title_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../views/title.js */ "./src/views/title.js");
/* harmony import */ var _views_newTodoSection_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../views/newTodoSection.js */ "./src/views/newTodoSection.js");
/* harmony import */ var _views_todoItems_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../views/todoItems.js */ "./src/views/todoItems.js");
/* harmony import */ var _pubSub_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./pubSub.js */ "./src/modules/pubSub.js");






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
        const projectNameList = data.projects.map(project => {
            return project.name;
        });

        const activeProjectName = data.activeProject.name;

        // Generate project-list sidebar html
        const sidebarContent = (0,_views_sidebar_js__WEBPACK_IMPORTED_MODULE_0__.createSidebarContent)(projectNameList, activeProjectName);
        projectListDiv.appendChild(sidebarContent);
        
        _pubSub_js__WEBPACK_IMPORTED_MODULE_4__.pubSub.publish('projectsRender');
    }

    // _renderProjectTitle function - renders the project title on the page
    function _renderProjectTitle(data) {
        // Clear project-title-content
        const projectTitleDiv = document.querySelector('#project-title-content');
        projectTitleDiv.textContent = '';

        // Extract relevant data
        const activeProjectName = data.activeProject.name;

        // Generate project-title html
        const projectTitleContent = (0,_views_title_js__WEBPACK_IMPORTED_MODULE_1__.createProjectTitleContent)(activeProjectName);
        projectTitleDiv.appendChild(projectTitleContent);
        
        _pubSub_js__WEBPACK_IMPORTED_MODULE_4__.pubSub.publish('projectTitleRender');
    }

    // _renderNewTodoContent function - renders page content related to adding new todo
    function _renderNewTodoContent() {
        // Clear new-todo-content div
        const newTodoContentDiv = document.querySelector('#new-todo-content');
        newTodoContentDiv.textContent = '';

        // Generate new-todo-content html
        const newTodoContent = (0,_views_newTodoSection_js__WEBPACK_IMPORTED_MODULE_2__.createNewTodoContent)();
        newTodoContentDiv.appendChild(newTodoContent);
        
        _pubSub_js__WEBPACK_IMPORTED_MODULE_4__.pubSub.publish('newTodoContentRender');
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
        const todoListContent = (0,_views_todoItems_js__WEBPACK_IMPORTED_MODULE_3__.createTodoListContent)(todos, activeTodo);
        todoListDiv.appendChild(todoListContent);
        
        _pubSub_js__WEBPACK_IMPORTED_MODULE_4__.pubSub.publish('todosRender');
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
        _pubSub_js__WEBPACK_IMPORTED_MODULE_4__.pubSub.subscribe('appInit', _renderFullPage);
        _pubSub_js__WEBPACK_IMPORTED_MODULE_4__.pubSub.subscribe('activateNewTodoForm', _showNewTodoForm);
        _pubSub_js__WEBPACK_IMPORTED_MODULE_4__.pubSub.subscribe('disableNewTodoForm', _hideNewTodoForm);
        _pubSub_js__WEBPACK_IMPORTED_MODULE_4__.pubSub.subscribe('projectsChange', _renderProjects);
        _pubSub_js__WEBPACK_IMPORTED_MODULE_4__.pubSub.subscribe('todosChange', _renderTodos);
        _pubSub_js__WEBPACK_IMPORTED_MODULE_4__.pubSub.subscribe('activeProjectChange', _renderFullPage);
        _pubSub_js__WEBPACK_IMPORTED_MODULE_4__.pubSub.subscribe('invalidTodoFields', _showAlert);
        _pubSub_js__WEBPACK_IMPORTED_MODULE_4__.pubSub.subscribe('invalidProjectName', _showAlert);
    }
    
    return { init };
})();



/***/ }),

/***/ "./src/views/newTodoSection.js":
/*!*************************************!*\
  !*** ./src/views/newTodoSection.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createNewTodoContent": () => (/* binding */ createNewTodoContent)
/* harmony export */ });
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util.js */ "./src/views/util.js");
/* harmony import */ var _todoForm__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./todoForm */ "./src/views/todoForm.js");



function createTitleSection() {
    // Parent
    const container = _util_js__WEBPACK_IMPORTED_MODULE_0__.domUtil.create('div', '');

    // Children
    const titleLabel = _util_js__WEBPACK_IMPORTED_MODULE_0__.domUtil.create('label', 'Title', {
        attributes: {
            for: 'new-title'
        }
    });
    const titleInput = _util_js__WEBPACK_IMPORTED_MODULE_0__.domUtil.create('input', '', {
        id: 'new-title',
        attributes: {
            name: 'new-title',
            type: 'text'
        }
    });
    const children = [ titleLabel, titleInput ];

    // Append children to parent
    _util_js__WEBPACK_IMPORTED_MODULE_0__.domUtil.appendChildren(container, children);

    return container;
}

function createDescriptionSection() {
    // Parent
    const container = _util_js__WEBPACK_IMPORTED_MODULE_0__.domUtil.create('div', '');

    // Children
    const descriptionLabel = _util_js__WEBPACK_IMPORTED_MODULE_0__.domUtil.create('label', 'Description', {
        attributes: {
            for: 'new-description'
        }
    });
    const descriptionInput = _util_js__WEBPACK_IMPORTED_MODULE_0__.domUtil.create('textarea', '', {
        id: 'new-description',
        attributes: {
            name: 'new-description',
            rows: '5',
            cols: '30'
        }
    });
    const children = [ descriptionLabel, descriptionInput ];

    // Append children to parent
    _util_js__WEBPACK_IMPORTED_MODULE_0__.domUtil.appendChildren(container, children);
    
    return container;
}

function createDateSection() {
    // Parent
    const container = _util_js__WEBPACK_IMPORTED_MODULE_0__.domUtil.create('div', '');

    // Children
    const dateLabel = _util_js__WEBPACK_IMPORTED_MODULE_0__.domUtil.create('label', 'Due Date', {
        attributes: {
            for: 'new-date'
        }
    });
    const dateInput = _util_js__WEBPACK_IMPORTED_MODULE_0__.domUtil.create('input', '', {
        id: 'new-date',
        attributes: {
            name: 'new-date',
            type: 'date'
        }
    });
    const children = [ dateLabel, dateInput ];

    // Append children to parent
    _util_js__WEBPACK_IMPORTED_MODULE_0__.domUtil.appendChildren(container, children);
    
    return container;
}

function createPrioritySection() {
    // Parent
    const container = _util_js__WEBPACK_IMPORTED_MODULE_0__.domUtil.create('div', '');

    // Children
    const p = _util_js__WEBPACK_IMPORTED_MODULE_0__.domUtil.create('p', 'Priority');
    const lowInput = _util_js__WEBPACK_IMPORTED_MODULE_0__.domUtil.create('input', '', {
        id: 'new-low',
        attributes: {
            type: 'radio',
            name: 'new-priority',
            value: 'low'
        }
    });
    const lowLabel = _util_js__WEBPACK_IMPORTED_MODULE_0__.domUtil.create('label', 'Low', {
        class: 'radio-label',
        attributes: {
            for: 'new-low'
        }
    });
    const midInput = _util_js__WEBPACK_IMPORTED_MODULE_0__.domUtil.create('input', '', {
        id: 'new-mid',
        attributes: {
            type: 'radio',
            name: 'new-priority',
            value: 'mid'
        }
    });
    const midLabel = _util_js__WEBPACK_IMPORTED_MODULE_0__.domUtil.create('label', 'Mid', {
        class: 'radio-label',
        attributes: {
            for: 'new-mid'
        }
    });
    const highInput = _util_js__WEBPACK_IMPORTED_MODULE_0__.domUtil.create('input', '', {
        id: 'new-high',
        attributes: {
            type: 'radio',
            name: 'new-priority',
            value: 'high'
        }
    });
    const highLabel = _util_js__WEBPACK_IMPORTED_MODULE_0__.domUtil.create('label', 'High', {
        class: 'radio-label',
        attributes: {
            for: 'new-high'
        }
    });
    const children = [
        p,
        lowInput,
        lowLabel,
        midInput,
        midLabel,
        highInput,
        highLabel
    ];

    // Append children to parent
    _util_js__WEBPACK_IMPORTED_MODULE_0__.domUtil.appendChildren(container, children);
    
    return container;
}


function createAddTodoFormDiv() {
    // Parent
    const addTodoFormDiv = _util_js__WEBPACK_IMPORTED_MODULE_0__.domUtil.create('div', '', { class: 'add-todo' });

    // Children
    const closeTodoFormBtn = _util_js__WEBPACK_IMPORTED_MODULE_0__.domUtil.create('button', 'X', { id: 'close-new-todo-form' });
    const h3 = _util_js__WEBPACK_IMPORTED_MODULE_0__.domUtil.create('h3', 'Add New Todo');
    const titleSection = _todoForm__WEBPACK_IMPORTED_MODULE_1__.todoForm.createTitleSection('new-title')
    const descriptionSection = _todoForm__WEBPACK_IMPORTED_MODULE_1__.todoForm.createDescriptionSection('new-description');
    const dateSection = _todoForm__WEBPACK_IMPORTED_MODULE_1__.todoForm.createDateSection('new-date');
    const prioritySection = _todoForm__WEBPACK_IMPORTED_MODULE_1__.todoForm.createPrioritySection([ 'new-low', 'new-mid', 'new-high' ],
        [ 'low', 'mid', 'high' ],
        [ 'Low', 'Mid', 'High' ],
        'new-priority'    
    );
    const submitTodoBtn = _util_js__WEBPACK_IMPORTED_MODULE_0__.domUtil.create('button', 'Add', { id: 'submit-todo-btn' });
    const children = [ 
        closeTodoFormBtn,
        h3,
        titleSection,
        descriptionSection,
        dateSection,
        prioritySection,
        submitTodoBtn,
    ];

    // Append children to parent
    _util_js__WEBPACK_IMPORTED_MODULE_0__.domUtil.appendChildren(addTodoFormDiv, children);

    return addTodoFormDiv;
}

function createNewTodoContent() {
    // Parent
    const container = _util_js__WEBPACK_IMPORTED_MODULE_0__.domUtil.create('div', '');

    // Children
    const addTodoBtn = _util_js__WEBPACK_IMPORTED_MODULE_0__.domUtil.create('button', 'Add Todo', { id: 'add-todo-btn' });
    const addTodoFormDiv = createAddTodoFormDiv();
    const children = [ addTodoBtn, addTodoFormDiv ];

    // Append children to parent
    _util_js__WEBPACK_IMPORTED_MODULE_0__.domUtil.appendChildren(container, children);

    return container;
}



/***/ }),

/***/ "./src/views/sidebar.js":
/*!******************************!*\
  !*** ./src/views/sidebar.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createSidebarContent": () => (/* binding */ createSidebarContent)
/* harmony export */ });
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util.js */ "./src/views/util.js");


function createProjectDiv(projectName, isActiveProject) {
    // Parent
    const projectDivClassList = isActiveProject ? [ 'project', 'active-project' ] :  [ 'project' ];
    const projectDiv = _util_js__WEBPACK_IMPORTED_MODULE_0__.domUtil.create('div', '', {
        class: projectDivClassList,
        attributes: {
            'data-name': projectName
        }
    });

    // Children
    const nameP = _util_js__WEBPACK_IMPORTED_MODULE_0__.domUtil.create('p', projectName, { class: 'project-name' });
    const delButton = _util_js__WEBPACK_IMPORTED_MODULE_0__.domUtil.create('button', '-', { class: 'del-project' });
    const children = [ nameP, delButton ];

    // Append children to parent
    _util_js__WEBPACK_IMPORTED_MODULE_0__.domUtil.appendChildren(projectDiv, children);

    return projectDiv;
}

function createSidebarContent(projectNameList, activeProjectName) {
    // parent
    const container = _util_js__WEBPACK_IMPORTED_MODULE_0__.domUtil.create('div', '');
    
    // children
    projectNameList.forEach(projectName => {
        // Append children to parent
        const isActiveProject = projectName === activeProjectName;
        const projectDiv = createProjectDiv(projectName, isActiveProject);
        container.append(projectDiv);
    });

    return container;
}



/***/ }),

/***/ "./src/views/title.js":
/*!****************************!*\
  !*** ./src/views/title.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createProjectTitleContent": () => (/* binding */ createProjectTitleContent)
/* harmony export */ });
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util.js */ "./src/views/util.js");


function createProjectTitleContent(activeProjectName) {
    const h2 = _util_js__WEBPACK_IMPORTED_MODULE_0__.domUtil.create('h2', activeProjectName);
    return h2;
}



/***/ }),

/***/ "./src/views/todoForm.js":
/*!*******************************!*\
  !*** ./src/views/todoForm.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "todoForm": () => (/* binding */ todoForm)
/* harmony export */ });
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util.js */ "./src/views/util.js");


// todoForm module - generates form fields utilized by the new todo and active todo sections
const todoForm = (function() {

    function createTitleSection(id, initialValue='') {
        // Parent
        const container = _util_js__WEBPACK_IMPORTED_MODULE_0__.domUtil.create('div', '');
    
        // Children
        const titleLabel = _util_js__WEBPACK_IMPORTED_MODULE_0__.domUtil.create('label', 'Title', {
            attributes: {
                for: id
            }
        });
        const titleInput = _util_js__WEBPACK_IMPORTED_MODULE_0__.domUtil.create('input', '', {
            id: id,
            attributes: {
                name: id,
                type: 'text',
                value: initialValue
            }
        });
        const children = [ titleLabel, titleInput ];
    
        // Append children to parent
        _util_js__WEBPACK_IMPORTED_MODULE_0__.domUtil.appendChildren(container, children);
    
        return container;
    }
    
    function createDescriptionSection(id, initialValue='') {
        // Parent
        const container = _util_js__WEBPACK_IMPORTED_MODULE_0__.domUtil.create('div', '');
    
        // Children
        const descriptionLabel = _util_js__WEBPACK_IMPORTED_MODULE_0__.domUtil.create('label', 'Description', {
            attributes: {
                for: id
            }
        });
        const descriptionInput = _util_js__WEBPACK_IMPORTED_MODULE_0__.domUtil.create('textarea', initialValue, {
            id: id,
            attributes: {
                name: id,
                rows: '5',
                cols: '30'
            }
        });
        const children = [ descriptionLabel, descriptionInput ];
    
        // Append children to parent
        _util_js__WEBPACK_IMPORTED_MODULE_0__.domUtil.appendChildren(container, children);
        
        return container;
    }
    
    function createDateSection(id, initialValue='') {
        // Parent
        const container = _util_js__WEBPACK_IMPORTED_MODULE_0__.domUtil.create('div', '');
    
        // Children
        const dateLabel = _util_js__WEBPACK_IMPORTED_MODULE_0__.domUtil.create('label', 'Due Date', {
            attributes: {
                for: id
            }
        });
        const dateInput = _util_js__WEBPACK_IMPORTED_MODULE_0__.domUtil.create('input', '', {
            id: id,
            attributes: {
                name: id,
                type: 'date',
            }
        });
        dateInput.value = initialValue;
        const children = [ dateLabel, dateInput ];
    
        // Append children to parent
        _util_js__WEBPACK_IMPORTED_MODULE_0__.domUtil.appendChildren(container, children);
        
        return container;
    }
    
    // Creates radio button input section of form
    function createPrioritySection(idList, valueList, labelTextList, nameAttr, initialCheckedValue) {
        // Parent
        const container = _util_js__WEBPACK_IMPORTED_MODULE_0__.domUtil.create('div', '');
    
        // Children
        const children = [];
        const p = _util_js__WEBPACK_IMPORTED_MODULE_0__.domUtil.create('p', 'Priority');
        children.push(p);

        for (let i = 0; i < idList.length; i++) {
            const inputAttributes = {
                type: 'radio',
                name: nameAttr,
                value: valueList[i]
            }

            if (valueList[i] === initialCheckedValue) {
                inputAttributes.checked = 'checked';
            }
            
            const input = _util_js__WEBPACK_IMPORTED_MODULE_0__.domUtil.create('input', '', {
                id: idList[i],
                attributes: inputAttributes
            });

            const label = _util_js__WEBPACK_IMPORTED_MODULE_0__.domUtil.create('label', labelTextList[i], {
                class: 'radio-label',
                attributes: {
                    for: idList[i]
                }
            });

            children.push(input, label);
        }
    
        // Append children to parent
        _util_js__WEBPACK_IMPORTED_MODULE_0__.domUtil.appendChildren(container, children);
        
        return container;
    }

    return {
        createTitleSection,
        createDescriptionSection,
        createDateSection,
        createPrioritySection
    };
})();



/***/ }),

/***/ "./src/views/todoItems.js":
/*!********************************!*\
  !*** ./src/views/todoItems.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createTodoListContent": () => (/* binding */ createTodoListContent)
/* harmony export */ });
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util.js */ "./src/views/util.js");
/* harmony import */ var _todoForm__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./todoForm */ "./src/views/todoForm.js");



function generateTodoDivClassList(todo, isActiveTodo) {
    const classList = [];

    // Add classes based on todo property values
    if (isActiveTodo) {
        classList.push('active-todo');
    } else {
        classList.push('inactive-todo');
    }

    if (todo.complete) {
        classList.push('complete');
    }

    if (todo.priority === 'low') {
        classList.push('low-priority')
    } else if (todo.priority === 'mid') {
        classList.push('mid-priority');
    } else if (todo.priority === 'high') {
        classList.push('high-priority');
    }

    return classList;
}

function createInactiveTodoDiv(todo) {
    const classList = generateTodoDivClassList(todo, false);

    // Parent
    const container = _util_js__WEBPACK_IMPORTED_MODULE_0__.domUtil.create('div', '', {
        class: classList,
        attributes: {
            'data-title': todo.title
        }
    });

    // Children
    const h4 = _util_js__WEBPACK_IMPORTED_MODULE_0__.domUtil.create('h4', todo.title);
    const p = _util_js__WEBPACK_IMPORTED_MODULE_0__.domUtil.create('p', `Due: ${todo.dueDate}`);
    const children = [ h4, p ];

    // Append children to parent
    _util_js__WEBPACK_IMPORTED_MODULE_0__.domUtil.appendChildren(container, children);

    return container;
}

function createActiveTodoDiv(todo) {
    const classList = generateTodoDivClassList(todo, true);

    // Parent
    const container = _util_js__WEBPACK_IMPORTED_MODULE_0__.domUtil.create('div', '', {
        class: classList,
        attributes: {
            'data-title': todo.title
        }
    });

    // Children
    const toggleCompleteBtn = _util_js__WEBPACK_IMPORTED_MODULE_0__.domUtil.create('button', '', { id: 'toggle-complete' });
    toggleCompleteBtn.innerHTML = '&check;';
    const delActiveTodoBtn = _util_js__WEBPACK_IMPORTED_MODULE_0__.domUtil.create('button', 'X', { id: 'del-active-todo' });
    const titleSection = _todoForm__WEBPACK_IMPORTED_MODULE_1__.todoForm.createTitleSection('update-title', todo.title)
    const descriptionSection = _todoForm__WEBPACK_IMPORTED_MODULE_1__.todoForm.createDescriptionSection('update-description', todo.description);
    const dateSection = _todoForm__WEBPACK_IMPORTED_MODULE_1__.todoForm.createDateSection('update-date', todo.dueDate);
    const prioritySection = _todoForm__WEBPACK_IMPORTED_MODULE_1__.todoForm.createPrioritySection([ 'update-low', 'update-mid', 'update-high' ],
        [ 'low', 'mid', 'high' ],
        [ 'Low', 'Mid', 'High' ],
        'update-priority',
        todo.priority    
    );
    const saveBtn = _util_js__WEBPACK_IMPORTED_MODULE_0__.domUtil.create('button', 'Save', {
        id: 'save-btn'
    });

    const children = [
        toggleCompleteBtn,
        delActiveTodoBtn,
        titleSection,
        descriptionSection,
        dateSection,
        prioritySection,
        saveBtn
    ];

    // Append children to parent
    _util_js__WEBPACK_IMPORTED_MODULE_0__.domUtil.appendChildren(container, children);

    return container;
}

function createTodoListItems(todos, activeTodo) {
    // Parent
    const container = _util_js__WEBPACK_IMPORTED_MODULE_0__.domUtil.create('div', '', { id: 'todo-list-items' });

    // Children
    todos.forEach(todo => {
        let todoDiv;
        if (activeTodo === null || todo.title != activeTodo.title) {
            todoDiv = createInactiveTodoDiv(todo);
        } else {
            todoDiv = createActiveTodoDiv(todo);
        }
        
        // Append children to parent
        container.appendChild(todoDiv);
    });

    return container;
}

function createTodoListContent(todos, activeTodo) {
    // Parent
    const container = _util_js__WEBPACK_IMPORTED_MODULE_0__.domUtil.create('div', '');

    // Children
    const h3 = _util_js__WEBPACK_IMPORTED_MODULE_0__.domUtil.create('h3', 'Todo Items');
    const todoListItems = createTodoListItems(todos, activeTodo);
    const children = [ h3, todoListItems ];

    // Append children to parent
    _util_js__WEBPACK_IMPORTED_MODULE_0__.domUtil.appendChildren(container, children);

    return container;
}



/***/ }),

/***/ "./src/views/util.js":
/*!***************************!*\
  !*** ./src/views/util.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "domUtil": () => (/* binding */ domUtil)
/* harmony export */ });
// domUtil module - contains functions to simplify DOM node manipulation and creation
const domUtil = (function() {
    // _addId function - adds id to a specified element
    function _addId(elem, id) {
        elem.id = id;
        return elem;
    }
    
    // _addClass - adds specified classes to an element
    function _addClass(elem, classes) {
        if (typeof classes === 'string') {
            elem.classList.add(classes);
        } else {
            classes.forEach(className => {
                elem.classList.add(className);
            });
        }
        return elem;
    }

    // _addAttribute - adds specified attributes to an element
    function _addAttribute(elem, attributes) {
        for (let key in attributes) {
            elem.setAttribute(key, attributes[key]);
        }
        return elem;
    }
    
    /* create method - creates an element with specified tag, given text, and supplied options
    options paremter is of the form: 
    {
        id: String,
        class: String | [String]
        attributes: {
            attribute1: String,
            attribute2: String
        }
    }
    */
    function create(tag, text, options) {
        const elem = document.createElement(tag);
        elem.textContent = text;

        // return the element if no options were specified
        if (options === undefined || Object.keys(options).length === 0) {
            return elem;
        } 
        
        // Add specified id
        if (options.id) {
            _addId(elem, options.id);
        }

        // Add specified class
        if (options.class) {
            _addClass(elem, options.class);
        }

        // Add specified attributes
        if (options.attributes !== undefined && Object.keys(options.attributes).length !== 0) {
            _addAttribute(elem, options.attributes);
        }

        return elem;
    }

    // appendChildren method - appends an array of children to the parent node in the provided order
    function appendChildren(parent, children) {
        children.forEach(child => {
            parent.appendChild(child);
        });
        return parent;
    }

    // Clear 
    return {
        create,
        appendChildren,
    };
})();



/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _modules_viewController_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modules/viewController.js */ "./src/modules/viewController.js");
/* harmony import */ var _modules_events_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modules/events.js */ "./src/modules/events.js");
/* harmony import */ var _modules_storage_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modules/storage.js */ "./src/modules/storage.js");
/* harmony import */ var _modules_app_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modules/app.js */ "./src/modules/app.js");





// TEMPORARY projects array that will stand in for localStorage to rehydrate into appropriate objects with prototypes
const projects = [
    {
        name: 'Food Project',
        todos: [
            {
                title: 'Eat some pizza',
                description: 'Eat some pizza with garlic sauce',
                dueDate: '2012-10-22',
                priority: 'high'
            },
            {
                title: 'Eat some chicken wings',
                description: 'Eat some chicken wings with ranch',
                dueDate: '2018-03-14',
                priority: 'mid'
            }
        ]
    },
    {
        name: 'Guitar Project',
        todos: [
            {
                title: 'Practice Stairway to Heaven',
                description: 'Practice the chorus of Stairway to Heaven',
                dueDate: '2021-05-18',
                priority: 'low'
            }
        ]
    }
];

// Initialize viewController, events, and storage modules
_modules_viewController_js__WEBPACK_IMPORTED_MODULE_0__.viewController.init();
_modules_events_js__WEBPACK_IMPORTED_MODULE_1__.events.init();
_modules_storage_js__WEBPACK_IMPORTED_MODULE_2__.storage.init();

// Initialize application
_modules_app_js__WEBPACK_IMPORTED_MODULE_3__.app.init(projects);
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7OztBQ042RDtBQUNoQjtBQUNFO0FBQ1I7O0FBRXZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDJFQUFtQjtBQUNuQiwyREFBVztBQUNYLDZEQUFZOztBQUVaO0FBQ0EscURBQVEsVyIsInNvdXJjZXMiOlsid2VicGFjazovL3RvZG8tbGlzdC8uL3NyYy9mYWN0b3J5X2Z1bmN0aW9ucy9wcm9qZWN0LmpzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL3NyYy9mYWN0b3J5X2Z1bmN0aW9ucy90b2RvLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL3NyYy9tb2R1bGVzL2FwcC5qcyIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9zcmMvbW9kdWxlcy9ldmVudHMuanMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vc3JjL21vZHVsZXMvcHViU3ViLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL3NyYy9tb2R1bGVzL3N0b3JhZ2UuanMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vc3JjL21vZHVsZXMvdmlld0NvbnRyb2xsZXIuanMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vc3JjL3ZpZXdzL25ld1RvZG9TZWN0aW9uLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL3NyYy92aWV3cy9zaWRlYmFyLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL3NyYy92aWV3cy90aXRsZS5qcyIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9zcmMvdmlld3MvdG9kb0Zvcm0uanMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vc3JjL3ZpZXdzL3RvZG9JdGVtcy5qcyIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9zcmMvdmlld3MvdXRpbC5qcyIsIndlYnBhY2s6Ly90b2RvLWxpc3Qvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vdG9kby1saXN0L3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly90b2RvLWxpc3Qvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly90b2RvLWxpc3Qvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gcHJvamVjdCBwcm90b3R5cGVcbmNvbnN0IHByb2plY3RQcm90byA9IHtcbiAgICBmaW5kSW5kZXhCeVRpdGxlOiBmdW5jdGlvbih0b2RvVGl0bGUpIHtcbiAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLnRvZG9zLmZpbmRJbmRleCh0b2RvID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0b2RvLnRpdGxlID09PSB0b2RvVGl0bGU7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gaW5kZXg7XG4gICAgfSxcbiAgICBhZGRUb2RvOiBmdW5jdGlvbihuZXdUb2RvKSB7XG4gICAgICAgIHRoaXMudG9kb3MucHVzaChuZXdUb2RvKTtcbiAgICB9LFxuICAgIGRlbGV0ZVRvZG86IGZ1bmN0aW9uKHRvZG9UaXRsZSkge1xuICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMuZmluZEluZGV4QnlUaXRsZSh0b2RvVGl0bGUpO1xuICAgICAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICAgICAgICB0aGlzLnRvZG9zLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGRlbGV0ZUFjdGl2ZVRvZG86IGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMuZmluZEluZGV4QnlUaXRsZSh0aGlzLmFjdGl2ZVRvZG8udGl0bGUpO1xuICAgICAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICAgICAgICB0aGlzLmFjdGl2ZVRvZG8gPSBudWxsO1xuICAgICAgICAgICAgdGhpcy50b2Rvcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBzZXRBY3RpdmVUb2RvOiBmdW5jdGlvbih0b2RvVGl0bGUpIHtcbiAgICAgICAgLy8gSWYgc2V0QWN0aXZlVG9kbyBpcyBjYWxsZWQgd2l0aCBubyBhcmd1bWVudHMsIHNldCBhY3RpdmVUb2RvIHRvIG51bGxcbiAgICAgICAgaWYgKHRvZG9UaXRsZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLmFjdGl2ZVRvZG8gPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLmZpbmRJbmRleEJ5VGl0bGUodG9kb1RpdGxlKTtcbiAgICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgICAgICAgdGhpcy5hY3RpdmVUb2RvID0gdGhpcy50b2Rvc1tpbmRleF07XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG4vLyBwcm9qZWN0IGZhY3RvcnkgZnVuY3Rpb25cbmZ1bmN0aW9uIHByb2plY3QobmFtZSkge1xuICAgIGNvbnN0IHRvZG9zID0gW107XG4gICAgbGV0IGFjdGl2ZVRvZG8gPSBudWxsO1xuICAgIHJldHVybiBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUocHJvamVjdFByb3RvKSwge1xuICAgICAgICBuYW1lLFxuICAgICAgICBhY3RpdmVUb2RvLFxuICAgICAgICB0b2Rvc1xuICAgIH0pO1xufVxuXG5leHBvcnQgeyBwcm9qZWN0IH07IiwiLy8gdG9kbyBwcm90b3R5cGVcbmNvbnN0IHRvZG9Qcm90byA9IHtcbiAgICBjaGFuZ2VUaXRsZTogZnVuY3Rpb24obmV3VGl0bGUpIHtcbiAgICAgICAgdGhpcy50aXRsZSA9IG5ld1RpdGxlO1xuICAgIH0sXG4gICAgY2hhbmdlRGVzY3JpcHRpb246IGZ1bmN0aW9uKG5ld0Rlc2NyaXB0aW9uKSB7XG4gICAgICAgIHRoaXMuZGVzY3JpcHRpb24gPSBuZXdEZXNjcmlwdGlvbjtcbiAgICB9LCAgICBcbiAgICBjaGFuZ2VEdWVEYXRlOiBmdW5jdGlvbihuZXdEdWVEYXRlKSB7XG4gICAgICAgIHRoaXMuZHVlRGF0ZSA9IG5ld0R1ZURhdGU7XG4gICAgfSxcbiAgICBjaGFuZ2VQcmlvcml0eTogZnVuY3Rpb24obmV3UHJpb3JpdHkpIHtcbiAgICAgICAgdGhpcy5wcmlvcml0eSA9IG5ld1ByaW9yaXR5O1xuICAgIH0sXG4gICAgdG9nZ2xlQ29tcGxldGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLmNvbXBsZXRlID0gIXRoaXMuY29tcGxldGU7XG4gICAgfSxcbiAgICB1cGRhdGU6IGZ1bmN0aW9uKG5ld1RpdGxlLCBuZXdEZXNjcmlwdGlvbiwgbmV3RHVlRGF0ZSwgbmV3UHJpb3JpdHkpIHtcbiAgICAgICAgdGhpcy5jaGFuZ2VUaXRsZShuZXdUaXRsZSk7XG4gICAgICAgIHRoaXMuY2hhbmdlRGVzY3JpcHRpb24obmV3RGVzY3JpcHRpb24pO1xuICAgICAgICB0aGlzLmNoYW5nZUR1ZURhdGUobmV3RHVlRGF0ZSk7XG4gICAgICAgIHRoaXMuY2hhbmdlUHJpb3JpdHkobmV3UHJpb3JpdHkpO1xuICAgIH1cbn07XG5cbi8vIHRvZG8gZmFjdG9yeSBmdW5jdGlvblxuZnVuY3Rpb24gdG9kbyh0aXRsZSwgZGVzY3JpcHRpb24sIGR1ZURhdGUsIHByaW9yaXR5KSB7XG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZSh0b2RvUHJvdG8pLCB7XG4gICAgICAgIHRpdGxlLFxuICAgICAgICBkZXNjcmlwdGlvbixcbiAgICAgICAgZHVlRGF0ZSxcbiAgICAgICAgcHJpb3JpdHksXG4gICAgICAgIGNvbXBsZXRlOiBmYWxzZVxuICAgIH0pO1xufVxuXG5leHBvcnQgeyB0b2RvIH07IiwiaW1wb3J0IHsgdG9kbyB9IGZyb20gJy4uL2ZhY3RvcnlfZnVuY3Rpb25zL3RvZG8uanMnO1xuaW1wb3J0IHsgcHJvamVjdCB9IGZyb20gJy4uL2ZhY3RvcnlfZnVuY3Rpb25zL3Byb2plY3QuanMnO1xuaW1wb3J0IHsgcHViU3ViIH0gZnJvbSAnLi9wdWJTdWIuanMnO1xuXG4vLyBhcHAgbW9kdWxlIGNvbnRhaW5zIHRvZG8gbGlzdCBhcHBsaWNhdGlvbiBkYXRhIGFuZCBmdW5jdGlvbmFsaXR5XG5jb25zdCBhcHAgPSAoZnVuY3Rpb24oKSB7XG4gICAgbGV0IF9wcm9qZWN0cyA9IFtdO1xuICAgIGxldCBfYWN0aXZlUHJvamVjdDtcblxuICAgIC8vIF9nZXRTdGF0ZURhdGEgZnVuY3Rpb24gLSBidW5kbGVzIGFwcCBzdGF0ZSBkYXRhIChfcHJvamVjdHMgYW5kIF9hY3RpdmVQcm9qZWN0KSBmb3IgcHVibGlzaGluZyB0aHJvdWdoIHB1YlN1YlxuICAgIGZ1bmN0aW9uIF9nZXRTdGF0ZURhdGEoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBwcm9qZWN0czogX3Byb2plY3RzLFxuICAgICAgICAgICAgYWN0aXZlUHJvamVjdDogX2FjdGl2ZVByb2plY3QsXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gX2dldFByb2plY3RGcm9tTmFtZSBmdW5jdGlvbiAtIG9idGFpbnMgdGhlIHByb2plY3Qgb2JqZWN0IHdpdGggYSBtYXRjaGluZyBwcm9qZWN0IG5hbWVcbiAgICBmdW5jdGlvbiBfZ2V0UHJvamVjdEZyb21OYW1lKHByb2plY3ROYW1lKSB7XG4gICAgICAgIGNvbnN0IHByb2plY3QgPSBfcHJvamVjdHMuZmluZChwcm9qZWN0ID0+IHtcbiAgICAgICAgICAgIHJldHVybiBwcm9qZWN0Lm5hbWUgPT09IHByb2plY3ROYW1lO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHByb2plY3Q7XG4gICAgfVxuXG4gICAgLy8gX2dldFByb2plY3RJbmRleEZyb21OYW1lIC0gb2J0YWlucyB0aGUgaW5kZXggb2YgdGhlIHByb2plY3Qgd2l0aCB0aGUgc3BlY2lmaWVkIG5hbWUgd2l0aGluIHRoZSBfcHJvamVjdHMgYXJyYXlcbiAgICBmdW5jdGlvbiBfZ2V0UHJvamVjdEluZGV4RnJvbU5hbWUocHJvamVjdE5hbWUpIHtcbiAgICAgICAgY29uc3QgaW5kZXggPSBfcHJvamVjdHMuZmluZEluZGV4KHByb2plY3QgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHByb2plY3QubmFtZSA9PT0gcHJvamVjdE5hbWU7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gaW5kZXg7XG4gICAgfVxuXG4gICAgLy8gX2lzVmFsaWRQcm9qZWN0TmFtZSBmdW5jdGlvbiAtIHJldHVybnMgdHJ1ZSBpZiBwcm9qZWN0IGhhcyBhIHVuaXF1ZSBuYW1lXG4gICAgZnVuY3Rpb24gX2lzVmFsaWRQcm9qZWN0TmFtZShuYW1lKSB7XG4gICAgICAgIGNvbnN0IHByb2plY3ROYW1lcyA9IF9wcm9qZWN0cy5tYXAocHJvamVjdCA9PiB7XG4gICAgICAgICAgICByZXR1cm4gcHJvamVjdC5uYW1lO1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHByb2plY3ROYW1lcy5pbmNsdWRlcyhuYW1lKSkge1xuICAgICAgICAgICAgcHViU3ViLnB1Ymxpc2goJ2ludmFsaWRQcm9qZWN0TmFtZScsICdQbGVhc2UgZW50ZXIgYSB1bmlxdWUgcHJvamVjdCBuYW1lJyk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIF9pc1VuaXF1ZVRvZG9UaXRsZSBmdW5jdGlvbiAtIFJldHVybnMgdHJ1ZSBpZiB0b2RvIGhhcyBhIHZhbGlkIHVuaXF1ZSBuYW1lXG4gICAgZnVuY3Rpb24gX2lzVW5pcXVlVG9kb1RpdGxlKHRpdGxlLCBpc1VwZGF0ZSkge1xuICAgICAgICBjb25zdCB0b2RvVGl0bGVzID0gX2FjdGl2ZVByb2plY3QudG9kb3MubWFwKHRvZG8gPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHRvZG8udGl0bGU7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICh0b2RvVGl0bGVzLmluY2x1ZGVzKHRpdGxlKSkge1xuICAgICAgICAgICAgLy8gSWYgdGhpcyBjaGVjayBpcyBwZXJmb3JtZWQgZm9yIGEgdG9kbyB1cGRhdGUsIHRoZSB0aXRsZSBtYXkgYmUgdGhlIHNhbWUgYXMgdGhlIGFjdGl2ZVRvZG8gb2YgdGhlIGFjdGl2ZSBwcm9qZWN0XG4gICAgICAgICAgICBpZiAoaXNVcGRhdGUpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBhY3RpdmVUb2RvVGl0bGUgPSBfYWN0aXZlUHJvamVjdC5hY3RpdmVUb2RvLnRpdGxlO1xuICAgICAgICAgICAgICAgIGlmIChhY3RpdmVUb2RvVGl0bGUgPT09IHRpdGxlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gX2lzVmFsaWRUb2RvIGZ1bmN0aW9uIC0gdmFsaWRhdGVzIHRoZSBBZGQgTmV3IFRvZG8gZm9ybSB2YWx1ZXMgYW5kIHVwZGF0ZXMgdG8gZXhpc3RpbmcgdG9kb3NcbiAgICBmdW5jdGlvbiBfaXNWYWxpZFRvZG8odGl0bGUsIGRlc2NyaXB0aW9uLCBkdWVEYXRlLCBwcmlvcml0eSwgaXNVcGRhdGUpIHtcbiAgICAgICAgLy8gVGl0bGUsIGRlc2NyaXB0aW9uLCBkdWVEYXRlLCBhbmQgcHJpb3JpdHkgZmllbGRzIG11c3QgYWxsIGJlIGZpbGxlZCBpblxuICAgICAgICBsZXQgYWxlcnRNZXNzYWdlO1xuICAgICAgICBpZiAoIV9pc1VuaXF1ZVRvZG9UaXRsZSh0aXRsZSwgaXNVcGRhdGUpKSB7XG4gICAgICAgICAgICBhbGVydE1lc3NhZ2UgPSAnVG9kbyB0aXRsZSBtdXN0IGJlIHVuaXF1ZSc7XG4gICAgICAgIH0gZWxzZSBpZiAodGl0bGUgPT09IHVuZGVmaW5lZCB8fCB0aXRsZSA9PT0gJycpIHtcbiAgICAgICAgICAgIGFsZXJ0TWVzc2FnZSA9ICdQbGVhc2UgZW50ZXIgYSB0b2RvIHRpdGxlJztcbiAgICAgICAgfSBlbHNlIGlmIChkZXNjcmlwdGlvbiA9PT0gdW5kZWZpbmVkIHx8IGRlc2NyaXB0aW9uID09PSAnJykge1xuICAgICAgICAgICAgYWxlcnRNZXNzYWdlID0gJ1BsZWFzZSBlbnRlciBhIHRvZG8gZGVzY3JpcHRpb24nO1xuICAgICAgICB9IGVsc2UgaWYgKGR1ZURhdGUgPT09IHVuZGVmaW5lZCB8fCBkdWVEYXRlID09PSAnJykge1xuICAgICAgICAgICAgYWxlcnRNZXNzYWdlID0gJ1BsZWFzZSBlbnRlciBhIHRvZG8gZHVlIGRhdGUnO1xuICAgICAgICB9IGVsc2UgaWYgKHByaW9yaXR5ID09PSBudWxsKSB7XG4gICAgICAgICAgICBhbGVydE1lc3NhZ2UgPSAnUGxlYXNlIHNlbGVjdCBhIHRvZG8gcHJpb3JpdHknO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcHViU3ViLnB1Ymxpc2goJ2ludmFsaWRUb2RvRmllbGRzJywgYWxlcnRNZXNzYWdlKTtcbiAgICB9XG4gICAgXG4gICAgLy8gZ2V0UHJvamVjdHMgZnVuY3Rpb25zIC0gcmV0dXJucyBhbiBhcnJheSBvZiBhcHAgcHJvamVjdHNcbiAgICBmdW5jdGlvbiBnZXRQcm9qZWN0cygpIHtcbiAgICAgICAgcmV0dXJuIF9wcm9qZWN0cztcbiAgICB9XG5cbiAgICAvLyBnZXRBY3RpdmVQcm9qZWN0IGZ1bmN0aW9uIC0gcmV0dXJucyB0aGUgY3VycmVudCBhY3RpdmUgcHJvamVjdFxuICAgIGZ1bmN0aW9uIGdldEFjdGl2ZVByb2plY3QoKSB7XG4gICAgICAgIHJldHVybiBfYWN0aXZlUHJvamVjdDtcbiAgICB9XG5cbiAgICAvLyBjaGFuZ2VBY3RpdmVQcm9qZWN0IGZ1bmN0aW9uIC0gY2hhbmdlcyB0aGUgYWN0aXZlIGFwcGxpY2F0aW9uIHByb2plY3RcbiAgICBmdW5jdGlvbiBjaGFuZ2VBY3RpdmVQcm9qZWN0KHByb2plY3ROYW1lKSB7XG4gICAgICAgIGNvbnN0IHByb2plY3QgPSBfZ2V0UHJvamVjdEZyb21OYW1lKHByb2plY3ROYW1lKTtcbiAgICAgICAgX2FjdGl2ZVByb2plY3QgPSBwcm9qZWN0O1xuICAgICAgICBwdWJTdWIucHVibGlzaCgnYWN0aXZlUHJvamVjdENoYW5nZScsIF9nZXRTdGF0ZURhdGEoKSk7XG4gICAgfVxuXG4gICAgLy8gYWRkUHJvamVjdCBmdW5jdGlvbiAtIGFkZHMgYSBuZXcgcHJvamVjdCB0byB0aGUgX3Byb2plY3RzIGFycmF5XG4gICAgZnVuY3Rpb24gYWRkUHJvamVjdChwcm9qZWN0TmFtZSkge1xuICAgICAgICBpZiAoIV9pc1ZhbGlkUHJvamVjdE5hbWUocHJvamVjdE5hbWUpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbmV3UHJvamVjdCA9IHByb2plY3QocHJvamVjdE5hbWUpO1xuICAgICAgICBfcHJvamVjdHMucHVzaChuZXdQcm9qZWN0KTtcbiAgICAgICAgcHViU3ViLnB1Ymxpc2goJ3Byb2plY3RzQ2hhbmdlJywgX2dldFN0YXRlRGF0YSgpKTtcbiAgICB9XG5cbiAgICAvLyBkZWxldGVQcm9qZWN0IGZ1bmN0aW9uIC0gZGVsZXRlcyB0aGUgcHJvamVjdCB3aXRoIHRoZSBzcGVjaWZpZWQgbmFtZSBmcm9tIF9wcm9qZWN0cyBhcnJheVxuICAgIGZ1bmN0aW9uIGRlbGV0ZVByb2plY3QocHJvamVjdE5hbWUpIHtcbiAgICAgICAgY29uc3QgaW5kZXggPSBfZ2V0UHJvamVjdEluZGV4RnJvbU5hbWUocHJvamVjdE5hbWUpO1xuICAgICAgICBcbiAgICAgICAgLy8gSWYgdGhlIGRlbGV0ZWQgcHJvamVjdCBpcyB0aGUgYWN0aXZlIHByb2plY3QsIHNldCB0aGUgYWN0aXZlIHByb2plY3QgdG8gdGhlIGZpcnN0IGl0ZW0gaW4gdGhlIHByb2plY3RzIGxpc3RcbiAgICAgICAgbGV0IGFjdGl2ZVByb2plY3REZWxldGVkO1xuICAgICAgICBpZiAoX2FjdGl2ZVByb2plY3QubmFtZSA9PT0gcHJvamVjdE5hbWUpIHtcbiAgICAgICAgICAgIGFjdGl2ZVByb2plY3REZWxldGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIF9wcm9qZWN0cy5zcGxpY2UoaW5kZXgsIDEpO1xuXG4gICAgICAgIC8vIFNldCBhIG5ldyBhY3RpdmUgcHJvamVjdCBpZiB0aGUgYWN0aXZlIHByb2plY3Qgd2FzIGRlbGV0ZWRcbiAgICAgICAgaWYgKGFjdGl2ZVByb2plY3REZWxldGVkKSB7XG4gICAgICAgICAgICBjb25zdCBuZXdBY3RpdmVQcm9qZWN0TmFtZSA9IF9wcm9qZWN0c1swXS5uYW1lO1xuICAgICAgICAgICAgY2hhbmdlQWN0aXZlUHJvamVjdChuZXdBY3RpdmVQcm9qZWN0TmFtZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwdWJTdWIucHVibGlzaCgncHJvamVjdHNDaGFuZ2UnLCBfZ2V0U3RhdGVEYXRhKCkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gYWRkVG9kbyBmdW5jdGlvbiAtIGFkZHMgYSB0b2RvIGl0ZW0gdG8gdGhlIGFjdGl2ZVByb2plY3RcbiAgICBmdW5jdGlvbiBhZGRUb2RvKHRpdGxlLCBkZXNjcmlwdGlvbiwgZHVlRGF0ZSwgcHJpb3JpdHkpIHtcbiAgICAgICAgaWYgKCFfaXNWYWxpZFRvZG8odGl0bGUsIGRlc2NyaXB0aW9uLCBkdWVEYXRlLCBwcmlvcml0eSwgZmFsc2UpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIC8vIENyZWF0ZSB0b2RvIGl0ZW1cbiAgICAgICAgY29uc3QgdG9kb0l0ZW0gPSB0b2RvKHRpdGxlLCBkZXNjcmlwdGlvbiwgZHVlRGF0ZSwgcHJpb3JpdHkpO1xuXG4gICAgICAgIC8vIEFwcGVuZCB0b2RvIGl0ZW0gdG8gYWN0aXZlUHJvamVjdCB0b2RvcyBhcnJheVxuICAgICAgICBfYWN0aXZlUHJvamVjdC5hZGRUb2RvKHRvZG9JdGVtKTtcblxuICAgICAgICBwdWJTdWIucHVibGlzaCgndG9kb3NDaGFuZ2UnLCBfZ2V0U3RhdGVEYXRhKCkpO1xuICAgIH1cblxuICAgIC8vIGNoYW5nZVRvZG8gZnVuY3Rpb24gLSBtb2RpZmllcyBhY3RpdmUgdG9kbyBpdGVtIG9mIGFjdGl2ZXByb2plY3QgdG8gc3BlY2lmaWVkIHBhcmFtZXRlcnNcbiAgICBmdW5jdGlvbiBjaGFuZ2VUb2RvKG5ld1RpdGxlLCBuZXdEZXNjcmlwdGlvbiwgbmV3RHVlRGF0ZSwgbmV3UHJpb3JpdHkpIHtcbiAgICAgICAgaWYgKCFfaXNWYWxpZFRvZG8obmV3VGl0bGUsIG5ld0Rlc2NyaXB0aW9uLCBuZXdEdWVEYXRlLCBuZXdQcmlvcml0eSwgdHJ1ZSkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBhY3RpdmVUb2RvID0gX2FjdGl2ZVByb2plY3QuYWN0aXZlVG9kbztcbiAgICAgICAgYWN0aXZlVG9kby51cGRhdGUobmV3VGl0bGUsIG5ld0Rlc2NyaXB0aW9uLCBuZXdEdWVEYXRlLCBuZXdQcmlvcml0eSk7XG4gICAgICAgIC8vIFJlc2V0IHRoZSBwcm9qZWN0IGFjdGl2ZSB0b2RvIHRvIG51bGwgXG4gICAgICAgIF9hY3RpdmVQcm9qZWN0LnNldEFjdGl2ZVRvZG8oKTtcblxuICAgICAgICBwdWJTdWIucHVibGlzaCgndG9kb3NDaGFuZ2UnLCBfZ2V0U3RhdGVEYXRhKCkpO1xuICAgIH1cblxuICAgIC8vIGNoYW5nZUFjdGl2ZVRvZG8gZnVuY3Rpb24gLSBjaGFuZ2VzIHRoZSBhY3RpdmUgdG9kbyBpdGVtIGZvciB0aGUgY3VycmVudCBwcm9qZWN0XG4gICAgZnVuY3Rpb24gY2hhbmdlQWN0aXZlVG9kbyh0b2RvVGl0bGUpIHtcbiAgICAgICAgX2FjdGl2ZVByb2plY3Quc2V0QWN0aXZlVG9kbyh0b2RvVGl0bGUpO1xuICAgICAgICBwdWJTdWIucHVibGlzaCgndG9kb3NDaGFuZ2UnLCBfZ2V0U3RhdGVEYXRhKCkpO1xuICAgIH1cblxuICAgIC8vIGRlbGV0ZVRvZG8gZnVuY3Rpb24gLSBkZWxldGVzIHRoZSBhY3RpdmUgdG9kbyBpdGVtIGZyb20gdGhlIGFjdGl2ZVByb2plY3RcbiAgICBmdW5jdGlvbiBkZWxldGVBY3RpdmVUb2RvKCkge1xuICAgICAgICBfYWN0aXZlUHJvamVjdC5kZWxldGVBY3RpdmVUb2RvKCk7XG4gICAgICAgIHB1YlN1Yi5wdWJsaXNoKCd0b2Rvc0NoYW5nZScsIF9nZXRTdGF0ZURhdGEoKSk7XG4gICAgfVxuXG4gICAgLy8gdG9nZ2xlVG9kb0NvbXBsZXRlIGZ1bmN0aW9uIC0gdG9nZ2xlcyB0aGUgYWN0aXZlIHRvZG8gaXRlbXMgY29tcGxldGUgc3RhdHVzXG4gICAgZnVuY3Rpb24gdG9nZ2xlVG9kb0NvbXBsZXRlKCkge1xuICAgICAgICBfYWN0aXZlUHJvamVjdC5hY3RpdmVUb2RvLnRvZ2dsZUNvbXBsZXRlKCk7XG4gICAgICAgIHB1YlN1Yi5wdWJsaXNoKCd0b2Rvc0NoYW5nZScsIF9nZXRTdGF0ZURhdGEoKSk7XG4gICAgfVxuXG4gICAgLy8gaW5pdCBmdW5jdGlvbiAtIGluaXRpYWxpemVzIHRoZSBhcHBsaWNhdGlvbiB3aXRoIHRoZSBnaXZlbiBwcm9qZWN0cyBhcnJheSBmcm9tIGxvY2FsU3RvcmFnZVxuICAgIGZ1bmN0aW9uIGluaXQocHJvamVjdHMpIHtcbiAgICAgICAgLy8gQ29udmVydCBsb2NhbFN0b3JhZ2UgcHJvamVjdHMgYXJyYXkgdG8gb2JqZWN0cyB3aXRoIHByb3RvdHlwZSBtZXRob2RzIHVzaW5nIGZhY3RvcnkgZnVuY3Rpb25zXG4gICAgICAgIHByb2plY3RzLmZvckVhY2gocHJvamVjdE9iaiA9PiB7XG4gICAgICAgICAgICAvLyBDcmVhdGUgYSBuZXcgcHJvamVjdFxuICAgICAgICAgICAgY29uc3QgbmV3UHJvamVjdCA9IHByb2plY3QocHJvamVjdE9iai5uYW1lKTtcblxuICAgICAgICAgICAgLy8gQWRkIGVhY2ggdG9kbyB0byB0aGUgY29ycmVzcG9uZGluZyBwcm9qZWN0XG4gICAgICAgICAgICBwcm9qZWN0T2JqLnRvZG9zLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgdG9kb0l0ZW0gPSB0b2RvKGl0ZW0udGl0bGUsIGl0ZW0uZGVzY3JpcHRpb24sIGl0ZW0uZHVlRGF0ZSwgaXRlbS5wcmlvcml0eSk7XG4gICAgICAgICAgICAgICAgbmV3UHJvamVjdC5hZGRUb2RvKHRvZG9JdGVtKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBBZGQgcHJvamVjdCB0byBfcHJvamVjdHMgYXJyYXlcbiAgICAgICAgICAgIF9wcm9qZWN0cy5wdXNoKG5ld1Byb2plY3QpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBTZXQgdGhlIGFjdGl2ZSBwcm9qZWN0IHRvIHRoZSBmaXJzdCBpdGVtIGluIHRoZSBhcnJheVxuICAgICAgICBfYWN0aXZlUHJvamVjdCA9IF9wcm9qZWN0c1swXTtcblxuICAgICAgICAvLyBQdWJsaXNoICdpbml0aWFsaXplJyBldmVudFxuICAgICAgICBwdWJTdWIucHVibGlzaCgnYXBwSW5pdCcsIF9nZXRTdGF0ZURhdGEoKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgZ2V0UHJvamVjdHMsXG4gICAgICAgIGdldEFjdGl2ZVByb2plY3QsXG4gICAgICAgIGNoYW5nZUFjdGl2ZVByb2plY3QsXG4gICAgICAgIGFkZFByb2plY3QsXG4gICAgICAgIGRlbGV0ZVByb2plY3QsXG4gICAgICAgIGFkZFRvZG8sXG4gICAgICAgIGNoYW5nZVRvZG8sXG4gICAgICAgIGNoYW5nZUFjdGl2ZVRvZG8sXG4gICAgICAgIGRlbGV0ZUFjdGl2ZVRvZG8sXG4gICAgICAgIHRvZ2dsZVRvZG9Db21wbGV0ZSxcbiAgICAgICAgaW5pdFxuICAgIH07XG59KSgpO1xuXG5leHBvcnQgeyBhcHAgfTsiLCJpbXBvcnQgeyBwdWJTdWIgfSBmcm9tICcuL3B1YlN1Yi5qcyc7XG5pbXBvcnQgeyBhcHAgfSBmcm9tICcuL2FwcC5qcyc7XG5pbXBvcnQgeyB2aWV3Q29udHJvbGxlciB9IGZyb20gJy4vdmlld0NvbnRyb2xsZXIuanMnO1xuXG4vLyBFdmVudHMgbW9kdWxlIC0gY29vcmRpbmF0ZXMgZXZlbnQgYWRkaXRpb24vbW9kaWZpY2F0aW9uIHRvIGRvbSBub2Rlc1xuY29uc3QgZXZlbnRzID0gKGZ1bmN0aW9uKCkge1xuICAgIC8qIEV2ZW50IGhhbmRsZXIgZnVuY3Rpb25zICovXG4gICAgLy8gX2NyZWF0ZU5ld1Byb2plY3QgZnVuY3Rpb24gLSBDcmVhdGVzIGEgbmV3IHByb2plY3RcbiAgICBmdW5jdGlvbiBfY3JlYXRlTmV3UHJvamVjdCgpIHtcbiAgICAgICAgLy8gRXh0cmFjdCBuZXcgcHJvamVjdCBuYW1lXG4gICAgICAgIGNvbnN0IHByb2plY3ROYW1lSW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYWRkLXByb2plY3QgaW5wdXQnKTtcbiAgICAgICAgY29uc3QgcHJvamVjdE5hbWUgPSBwcm9qZWN0TmFtZUlucHV0LnZhbHVlO1xuXG4gICAgICAgIC8vIEFkZCBwcm9qZWN0IHRvIGFwcCBtb2RlbFxuICAgICAgICBpZiAocHJvamVjdE5hbWUpIHtcbiAgICAgICAgICAgIGFwcC5hZGRQcm9qZWN0KHByb2plY3ROYW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENsZWFyIHByb2plY3QgbmFtZSBmaWVsZFxuICAgICAgICBwcm9qZWN0TmFtZUlucHV0LnZhbHVlID0gJyc7XG4gICAgfVxuXG4gICAgLy8gX3NlbGVjdFByb2plY3QgZnVuY3Rpb24gLSBTZXRzIHRoZSBhY3RpdmUgcHJvamVjdFxuICAgIGZ1bmN0aW9uIF9zZWxlY3RQcm9qZWN0KGUpIHtcbiAgICAgICAgY29uc3QgcHJvamVjdE5hbWUgPSBlLnRhcmdldC5wYXJlbnROb2RlLmdldEF0dHJpYnV0ZSgnZGF0YS1uYW1lJyk7XG4gICAgICAgIGFwcC5jaGFuZ2VBY3RpdmVQcm9qZWN0KHByb2plY3ROYW1lKTtcbiAgICB9XG5cbiAgICAvLyBfZGVsZXRlUHJvamVjdCBmdW5jdGlvbiAtIERlbGV0ZXMgdGhlIHNlbGVjdGVkIHByb2plY3RcbiAgICBmdW5jdGlvbiBfZGVsZXRlUHJvamVjdChlKSB7XG4gICAgICAgIGNvbnN0IHByb2plY3ROYW1lID0gZS50YXJnZXQucGFyZW50Tm9kZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtbmFtZScpO1xuICAgICAgICBpZiAod2luZG93LmNvbmZpcm0oYEFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBkZWxldGUgdGhlICR7cHJvamVjdE5hbWV9IHByb2plY3Q/YCkpIHtcbiAgICAgICAgICAgIGFwcC5kZWxldGVQcm9qZWN0KHByb2plY3ROYW1lKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIF9zaG93TmV3VG9kb0Zvcm0gZnVuY3Rpb24gLSBTaG93cyB0aGUgbmV3IHRvZG8gZm9ybSBhbmQgaGlkZXMgdGhlIFwiQWRkIFRvZG9cIiBidXR0b25cbiAgICBmdW5jdGlvbiBfc2hvd05ld1RvZG9Gb3JtKCkge1xuICAgICAgICBwdWJTdWIucHVibGlzaCgnYWN0aXZhdGVOZXdUb2RvRm9ybScpO1xuICAgIH1cblxuICAgIC8vIF9leGl0TmV3VG9kb0Zvcm0gZnVuY3Rpb24gLSBIaWRlcyB0aGUgbmV3IHRvZG8gZm9ybSBhbmQgZGlzcGxheXMgdGhlIFwiQWRkIFRvZG9cIiBidXR0b25cbiAgICBmdW5jdGlvbiBfZXhpdE5ld1RvZG9Gb3JtKCkge1xuICAgICAgICBwdWJTdWIucHVibGlzaCgnZGlzYWJsZU5ld1RvZG9Gb3JtJyk7XG4gICAgfVxuXG4gICAgLy8gX2FkZE5ld1RvZG8gZnVuY3Rpb24gLSBFeHRyYWN0cyBmb3JtIHZhbHVlcyBhbmQgYWRkcyBhIG5ldyB0b2RvIHRvIHRoZSBhY3RpdmUgcHJvamVjdFxuICAgIGZ1bmN0aW9uIF9hZGROZXdUb2RvKCkge1xuICAgICAgICAvLyBFeHRyYWN0IGZvcm0gdmFsdWVzXG4gICAgICAgIGNvbnN0IHRpdGxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI25ldy10aXRsZScpLnZhbHVlO1xuICAgICAgICBjb25zdCBkZXNjcmlwdGlvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNuZXctZGVzY3JpcHRpb24nKS52YWx1ZTtcbiAgICAgICAgY29uc3QgZHVlRGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNuZXctZGF0ZScpLnZhbHVlO1xuICAgICAgICBjb25zdCBwcmlvcml0eUlucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaW5wdXRbbmFtZT1cIm5ldy1wcmlvcml0eVwiXTpjaGVja2VkJyk7XG4gICAgICAgIGxldCBwcmlvcml0eTtcbiAgICAgICAgaWYgKHByaW9yaXR5SW5wdXQpIHtcbiAgICAgICAgICAgIHByaW9yaXR5ID0gcHJpb3JpdHlJbnB1dC52YWx1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHByaW9yaXR5ID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGFwcC5hZGRUb2RvKHRpdGxlLCBkZXNjcmlwdGlvbiwgZHVlRGF0ZSwgcHJpb3JpdHkpOyBcbiAgICB9XG5cbiAgICAvLyBfc2V0QWN0aXZlVG9kbyBmdW5jdGlvbiAtIFNldHMgYW4gaW5hY3RpdmUgdG9kbyB0byBhY3RpdmVcbiAgICBmdW5jdGlvbiBfc2V0QWN0aXZlVG9kbyhlKSB7XG4gICAgICAgIGNvbnN0IHRvZG9UaXRsZSA9IGUudGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS10aXRsZScpO1xuICAgICAgICBhcHAuY2hhbmdlQWN0aXZlVG9kbyh0b2RvVGl0bGUpO1xuICAgIH1cblxuICAgIC8vIF90b2dnbGVUb2RvQ29tcGxldGUgZnVuY3Rpb24gLSBUb2dnbGVzIHRoZSBhY3RpdmUgdG9kbydzIGNvbXBsZXRpb24gc3RhdHVzXG4gICAgZnVuY3Rpb24gX3RvZ2dsZVRvZG9Db21wbGV0ZSgpIHtcbiAgICAgICAgYXBwLnRvZ2dsZVRvZG9Db21wbGV0ZSgpO1xuICAgIH1cblxuICAgIC8vIF9kZWxldGVBY3RpdmVUb2RvIGZ1bmN0aW9uIC0gRGVsZXRlcyB0aGUgYWN0aXZlIHRvZG9cbiAgICBmdW5jdGlvbiBfZGVsZXRlQWN0aXZlVG9kbygpIHtcbiAgICAgICAgaWYod2luZG93LmNvbmZpcm0oJ0RvIHlvdSB3YW50IHRvIGRlbGV0ZSB0aGlzIHRvZG8gaXRlbT8nKSkge1xuICAgICAgICAgICAgYXBwLmRlbGV0ZUFjdGl2ZVRvZG8oKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIF91cGRhdGVBY3RpdmVUb2RvIGZ1bmN0aW9uIC0gVXBkYXRlcyB0aGUgYWN0aXZlIHRvZG8gZnVuY3Rpb24gd2l0aCB1cGRhdGVkIGZvcm0gdmFsdWVzXG4gICAgZnVuY3Rpb24gX3VwZGF0ZUFjdGl2ZVRvZG8oKSB7XG4gICAgICAgIC8vIEV4dHJhY3QgZm9ybSB2YWx1ZXNcbiAgICAgICAgY29uc3QgbmV3VGl0bGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjdXBkYXRlLXRpdGxlJykudmFsdWU7XG4gICAgICAgIGNvbnN0IG5ld0Rlc2NyaXB0aW9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3VwZGF0ZS1kZXNjcmlwdGlvbicpLnZhbHVlO1xuICAgICAgICBjb25zdCBuZXdEdWVEYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3VwZGF0ZS1kYXRlJykudmFsdWU7XG4gICAgICAgIGNvbnN0IG5ld1ByaW9yaXR5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaW5wdXRbbmFtZT1cInVwZGF0ZS1wcmlvcml0eVwiXTpjaGVja2VkJykudmFsdWU7XG5cbiAgICBhcHAuY2hhbmdlVG9kbyhuZXdUaXRsZSwgbmV3RGVzY3JpcHRpb24sIG5ld0R1ZURhdGUsIG5ld1ByaW9yaXR5KTtcblxuICAgIH1cblxuICAgIC8qIEV2ZW50IFNldHRpbmcgZnVuY3Rpb25zIC0gVGhlc2UgZnVuY3Rpb25zIGFwcGx5IGV2ZW50IGhhbmRsZXJzIHRvIERPTSBlbGVtZW50cyAqL1xuXG4gICAgLy8gX2Fzc2lnbk5ld1Byb2plY3RFdmVudCBmdW5jdGlvbiAtIEFkZHMgZXZlbnQgaGFuZGxlciB0byB0aGUgc2lkZWJhciBOZXcgUHJvamVjdCBidXR0b25cbiAgICBmdW5jdGlvbiBfYXNzaWduTmV3UHJvamVjdEV2ZW50KCkge1xuICAgICAgICBjb25zdCBuZXdQcm9qZWN0QnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2FkZC1wcm9qZWN0LWJ0bicpO1xuICAgICAgICBuZXdQcm9qZWN0QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgX2NyZWF0ZU5ld1Byb2plY3QpO1xuICAgIH1cblxuICAgIC8vIF9hc3NpZ25Qcm9qZWN0RXZlbnRzIGZ1bmN0aW9uIC0gQWRkcyBldmVudCBoYW5kbGVycyB0byBwcm9qZWN0IGl0ZW1zIGluIHRoZSBzaWRlYmFyXG4gICAgZnVuY3Rpb24gX2Fzc2lnblByb2plY3RFdmVudHMoKSB7XG4gICAgICAgIGNvbnN0IHByb2plY3RJdGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5wcm9qZWN0LW5hbWUnKTtcbiAgICAgICAgcHJvamVjdEl0ZW1zLmZvckVhY2gocHJvamVjdCA9PiB7XG4gICAgICAgICAgICBwcm9qZWN0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgX3NlbGVjdFByb2plY3QpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBfYXNzaWduRGVsUHJvamVjdEV2ZW50cyBmdW5jdGlvbiAtIEFkZHMgZXZlbnQgaGFuZGxlcnMgdG8gcHJvamVjdCBkZWxldGUgYnV0dG9uc1xuICAgIGZ1bmN0aW9uIF9hc3NpZ25EZWxQcm9qZWN0RXZlbnRzKCkge1xuICAgICAgICBjb25zdCBwcm9qZWN0RGVsQnV0dG9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5kZWwtcHJvamVjdCcpO1xuICAgICAgICBwcm9qZWN0RGVsQnV0dG9ucy5mb3JFYWNoKGJ1dHRvbiA9PiB7XG4gICAgICAgICAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBfZGVsZXRlUHJvamVjdCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIF9hc3NpZ25BZGRUb2RvRXZlbnQgZnVuY3Rpb24gLSBBZGQgZXZlbnQgaGFuZGxlciB0byBBZGQgVG9kbyBidXR0b25cbiAgICBmdW5jdGlvbiBfYXNzaWduQWRkVG9kb0V2ZW50KCkge1xuICAgICAgICBjb25zdCBhZGRUb2RvQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2FkZC10b2RvLWJ0bicpO1xuICAgICAgICBhZGRUb2RvQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgX3Nob3dOZXdUb2RvRm9ybSk7XG4gICAgfVxuXG4gICAgLy8gX2Fzc2lnbkNsb3NlVG9kb0V2ZW50IGZ1bmN0aW9uIC0gQWRkIGV2ZW50IGhhbmRsZXIgdG8gYnV0dG9uIHRoYXQgY2xvc2VzIHRoZSBuZXcgdG9kbyBmb3JtXG4gICAgZnVuY3Rpb24gX2Fzc2lnbkNsb3NlVG9kb0V2ZW50KCkge1xuICAgICAgICBjb25zdCBjbG9zZU5ld1RvZG9CdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjY2xvc2UtbmV3LXRvZG8tZm9ybScpO1xuICAgICAgICBjbG9zZU5ld1RvZG9CdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBfZXhpdE5ld1RvZG9Gb3JtKTtcbiAgICB9XG5cbiAgICAvLyBfYXNzaWduU3VibWl0VG9kb0V2ZW50IGZ1bmN0aW9uIC0gQWRkIGV2ZW50IGhhbmRsZXIgdG8gXCJBZGRcIiBidXR0b24gd2hpY2ggc3VibWl0cyBjb250ZW50IGZyb20gdGhlIG5ldyB0b2RvIGZvcm1cbiAgICBmdW5jdGlvbiBfYXNzaWduU3VibWl0VG9kb0V2ZW50KCkge1xuICAgICAgICBjb25zdCBzdWJtaXRUb2RvQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3N1Ym1pdC10b2RvLWJ0bicpO1xuICAgICAgICBzdWJtaXRUb2RvQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgX2FkZE5ld1RvZG8pO1xuICAgIH1cblxuICAgIC8vIF9hc3NpZ25TZXRBY3RpdmVFdmVudHMgZnVuY3Rpb24gLSBBZGRzIGV2ZW50IGhhbmRsZXJzIHRvIGluYWN0aXZlIHRvZG8gaXRlbXMgb24gdGhlIHBhZ2VcbiAgICBmdW5jdGlvbiBfYXNzaWduU2V0QWN0aXZlRXZlbnRzKCkge1xuICAgICAgICBjb25zdCBpbmFjdGl2ZVRvZG9zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmluYWN0aXZlLXRvZG8nKTtcbiAgICAgICAgaW5hY3RpdmVUb2Rvcy5mb3JFYWNoKHRvZG8gPT4ge1xuICAgICAgICAgICAgdG9kby5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIF9zZXRBY3RpdmVUb2RvKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gX2Fzc2lnblRvZ2dsZVRvZG9Db21wbGV0ZUV2ZW50IGZ1bmN0aW9uIC0gQWRkcyBldmVudCBoYW5kbGVyIHRvIGJ1dHRvbiBmb3IgdG9nZ2xpbmcgdG9kbyBjb21wbGV0aW9uXG4gICAgZnVuY3Rpb24gX2Fzc2lnblRvZ2dsZVRvZG9Db21wbGV0ZUV2ZW50KCkge1xuICAgICAgICBjb25zdCB0b2dnbGVDb21wbGV0ZUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN0b2dnbGUtY29tcGxldGUnKTtcbiAgICAgICAgaWYgKHRvZ2dsZUNvbXBsZXRlQnRuID09PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdG9nZ2xlQ29tcGxldGVCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBfdG9nZ2xlVG9kb0NvbXBsZXRlKTtcbiAgICB9XG5cbiAgICAvLyBfYXNzaWduRGVsZXRlQWN0aXZlVG9kb0V2ZW50IGZ1bmN0aW9uIC0gQWRkcyBldmVudCBoYW5kbGVyIHRvIGJ1dHRvbiB0aGF0IGRlbGV0ZXMgdGhlIGFjdGl2ZSB0b2RvXG4gICAgZnVuY3Rpb24gX2Fzc2lnbkRlbGV0ZUFjdGl2ZVRvZG9FdmVudCgpIHtcbiAgICAgICAgY29uc3QgZGVsVG9kb0J0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNkZWwtYWN0aXZlLXRvZG8nKTtcbiAgICAgICAgaWYgKGRlbFRvZG9CdG4gPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBkZWxUb2RvQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgX2RlbGV0ZUFjdGl2ZVRvZG8pO1xuICAgIH1cblxuICAgIC8vIF9hc3NpZ25VcGRhdGVBY3RpdmVUb2RvRXZlbnQgZnVuY3Rpb24gLSBBZGRzIGV2ZW50IGhhbmRsZXIgdG8gc2F2ZSBidXR0b24gdGhhdCB1cGRhdGVzIGFjdGl2ZSB0b2RvIGluZm9ybWF0aW9uXG4gICAgZnVuY3Rpb24gX2Fzc2lnblVwZGF0ZUFjdGl2ZVRvZG9FdmVudCgpIHtcbiAgICAgICAgY29uc3Qgc2F2ZUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzYXZlLWJ0bicpO1xuICAgICAgICBpZiAoc2F2ZUJ0biA9PT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHNhdmVCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBfdXBkYXRlQWN0aXZlVG9kbyk7XG4gICAgfVxuXG4gICAgLy8gX2Fzc2lnblNpZGViYXJFdmVudHMgd3JhcHBlciBmdW5jdGlvbiAtIEFkZCBldmVudCBoYW5kbGVycyB0byB0aGUgUHJvamVjdHMgc2lkZSBiYXJcbiAgICBmdW5jdGlvbiBfYXNzaWduU2lkZWJhckV2ZW50cygpIHtcbiAgICAgICAgX2Fzc2lnbk5ld1Byb2plY3RFdmVudCgpO1xuICAgICAgICBfYXNzaWduUHJvamVjdEV2ZW50cygpO1xuICAgICAgICBfYXNzaWduRGVsUHJvamVjdEV2ZW50cygpXG4gICAgfVxuXG4gICAgLy8gX2Fzc2lnbk5ld1RvZG9FdmVudHMgd3JhcHBlciBmdW5jdGlvbiAtIEFkZCBldmVudCBoYW5kbGVycyBhc3NvY2lhdGVkIHdpdGggYWRkaW5nIGEgbmV3IHRvZG9cbiAgICBmdW5jdGlvbiBfYXNzaWduTmV3VG9kb0V2ZW50cygpIHtcbiAgICAgICAgX2Fzc2lnbkFkZFRvZG9FdmVudCgpO1xuICAgICAgICBfYXNzaWduQ2xvc2VUb2RvRXZlbnQoKTtcbiAgICAgICAgX2Fzc2lnblN1Ym1pdFRvZG9FdmVudCgpO1xuICAgIH1cblxuICAgIC8vIF9hc3NpZ25Ub2RvTGlzdEV2ZW50cyB3cmFwcGVyIGZ1bmN0aW9uIC0gQWRkIGV2ZW50IGhhbmRsZXJzIHRvIFRvZG8gSXRlbXMgc2VjdGlvblxuICAgIGZ1bmN0aW9uIF9hc3NpZ25Ub2RvTGlzdEV2ZW50cygpIHtcbiAgICAgICAgX2Fzc2lnblNldEFjdGl2ZUV2ZW50cygpO1xuICAgICAgICBfYXNzaWduVG9nZ2xlVG9kb0NvbXBsZXRlRXZlbnQoKTtcbiAgICAgICAgX2Fzc2lnbkRlbGV0ZUFjdGl2ZVRvZG9FdmVudCgpO1xuICAgICAgICBfYXNzaWduVXBkYXRlQWN0aXZlVG9kb0V2ZW50KCk7XG4gICAgfVxuICAgIFxuICAgIC8vIGluaXQgZnVuY3Rpb24gLSBjcmVhdGVzIHB1YlN1YiBzdWJzY3JpcHRpb25zXG4gICAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICAgICAgLy8gcHViU3ViLnN1YnNjcmliZSgnZnVsbFBhZ2VSZW5kZXInLCBfYXNzaWduRnVsbFBhZ2VFdmVudHMpO1xuICAgICAgICAvLyBPbiBwcm9qZWN0c1JlbmRlciwgYXNzaWduIGV2ZW50IGhhbmRsZXJzIHRvIHRoZSBwcm9qZWN0cyBzaWRlYmFyXG4gICAgICAgIHB1YlN1Yi5zdWJzY3JpYmUoJ3Byb2plY3RzUmVuZGVyJywgX2Fzc2lnblNpZGViYXJFdmVudHMpO1xuXG4gICAgICAgIC8vIE9uIG5ld1RvZG9Db250ZW50UmVuZGVyLCBhc3NpZ24gYXNzb2NpYXRlZCBmb3JtIGV2ZW50IGhhbmRsZXJzXG4gICAgICAgIHB1YlN1Yi5zdWJzY3JpYmUoJ25ld1RvZG9Db250ZW50UmVuZGVyJywgX2Fzc2lnbk5ld1RvZG9FdmVudHMpO1xuXG4gICAgICAgIC8vIE9uIHRvZG9zUmVuZGVyLCBhc3NpZ24gYXNzb2NpYXRlZCBwYWdlIGV2ZW50IGhhbmRsZXJzXG4gICAgICAgIHB1YlN1Yi5zdWJzY3JpYmUoJ3RvZG9zUmVuZGVyJywgX2Fzc2lnblRvZG9MaXN0RXZlbnRzKTtcblxuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgaW5pdFxuICAgIH07XG59KSgpO1xuXG5leHBvcnQgeyBldmVudHMgfTsiLCJjb25zdCBwdWJTdWIgPSB7XG4gICAgZXZlbnRzOiB7fSxcbiAgICBzdWJzY3JpYmU6IGZ1bmN0aW9uKGV2ZW50TmFtZSwgZm4pIHtcbiAgICAgICAgdGhpcy5ldmVudHNbZXZlbnROYW1lXSA9IHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0gfHwgW107XG4gICAgICAgIHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0ucHVzaChmbik7XG4gICAgfSxcbiAgICB1bnN1YnNjcmliZTogZnVuY3Rpb24oZXZlbnROYW1lLCBmbikge1xuICAgICAgICBpZiAodGhpcy5ldmVudHNbZXZlbnROYW1lXSkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmV2ZW50c1tldmVudE5hbWVdW2ldID09PSBmbikge1xuICAgICAgICAgICAgdGhpcy5ldmVudHNbZXZlbnROYW1lXS5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgcHVibGlzaDogZnVuY3Rpb24oZXZlbnROYW1lLCBkYXRhKSB7XG4gICAgICAgIGlmICh0aGlzLmV2ZW50c1tldmVudE5hbWVdKSB7XG4gICAgICAgIHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0uZm9yRWFjaChmdW5jdGlvbihmbikge1xuICAgICAgICAgICAgZm4oZGF0YSk7XG4gICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxufTtcblxuZXhwb3J0IHsgcHViU3ViIH07IiwiaW1wb3J0IHsgcHViU3ViIH0gZnJvbSAnLi9wdWJTdWIuanMnO1xuXG4vLyBTdG9yYWdlIG1vZHVsZSAtIGhhbmRsZXMgc3RvcmFnZS9yZXRyaWV2YWwgb2YgYnJvd3NlciBsb2NhbFN0b3JhZ2UgZGF0YVxuY29uc3Qgc3RvcmFnZSA9IChmdW5jdGlvbigpIHtcbiAgICAvLyBpbml0IGZ1bmN0aW9uIC0gU2V0cyB1cCBwdWJTdWIgc3Vic2NyaXB0aW9uc1xuICAgIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBpbml0XG4gICAgfTtcbn0pKCk7XG5cbmV4cG9ydCB7IHN0b3JhZ2UgfTsiLCJpbXBvcnQgeyBjcmVhdGVTaWRlYmFyQ29udGVudCB9IGZyb20gJy4uL3ZpZXdzL3NpZGViYXIuanMnO1xuaW1wb3J0IHsgY3JlYXRlUHJvamVjdFRpdGxlQ29udGVudCB9IGZyb20gJy4uL3ZpZXdzL3RpdGxlLmpzJztcbmltcG9ydCB7IGNyZWF0ZU5ld1RvZG9Db250ZW50IH0gZnJvbSAnLi4vdmlld3MvbmV3VG9kb1NlY3Rpb24uanMnO1xuaW1wb3J0IHsgY3JlYXRlVG9kb0xpc3RDb250ZW50IH0gZnJvbSAnLi4vdmlld3MvdG9kb0l0ZW1zLmpzJztcbmltcG9ydCB7IHB1YlN1YiB9IGZyb20gJy4vcHViU3ViLmpzJztcblxuLy8gdmlld0NvbnRyb2xsZXIgbW9kdWxlIC0gY29udHJvbHMgRE9NIG1hbmlwdWxhdGlvblxuY29uc3Qgdmlld0NvbnRyb2xsZXIgPSAoZnVuY3Rpb24oKSB7XG4gICAgLy8gX3Nob3dOZXdUb2RvRm9ybSBmdW5jdGlvbiAtIE1ha2VzIHRoZSBcIkFkZCBOZXcgVG9kb1wiIGZvcm0gdmlzaWJsZVxuICAgIGZ1bmN0aW9uIF9zaG93TmV3VG9kb0Zvcm0oKSB7XG4gICAgICAgIGNvbnN0IGZvcm0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYWRkLXRvZG8nKTtcbiAgICAgICAgY29uc3QgZm9ybVRvZ2dsZUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNhZGQtdG9kby1idG4nKTtcbiAgICAgICAgZm9ybS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgZm9ybVRvZ2dsZUJ0bi5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgIH1cblxuICAgIC8vIF9oaWRlTmV3VG9kb0Zvcm0gZnVuY3Rpb24gLSBIaWRlcyB0aGUgXCJBZGQgTmV3IFRvZG9cIiBmb3JtXG4gICAgZnVuY3Rpb24gX2hpZGVOZXdUb2RvRm9ybSgpIHtcbiAgICAgICAgY29uc3QgZm9ybSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5hZGQtdG9kbycpO1xuICAgICAgICBjb25zdCBmb3JtVG9nZ2xlQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2FkZC10b2RvLWJ0bicpO1xuICAgICAgICBmb3JtLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgIGZvcm1Ub2dnbGVCdG4uc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgfVxuXG4gICAgLy8gX3Nob3dBbGVydCBmdW5jdGlvbiAtIGFsZXJ0cyB0aGUgZ2l2ZW4gYWxlcnQgbWVzc2FnZSB0byB0aGUgd2luZG93XG4gICAgZnVuY3Rpb24gX3Nob3dBbGVydChhbGVydE1lc3NhZ2UpIHtcbiAgICAgICAgd2luZG93LmFsZXJ0KGFsZXJ0TWVzc2FnZSk7XG4gICAgfVxuICAgIFxuICAgIC8vIF9yZW5kZXJQcm9qZWN0cyBmdW5jdGlvbiAtIHJlbmRlcnMgc2lkZWJhciBjb250ZW50XG4gICAgZnVuY3Rpb24gX3JlbmRlclByb2plY3RzKGRhdGEpIHtcbiAgICAgICAgLy8gQ2xlYXIgdGhlIHByb2plY3QtbGlzdCBzaWRlYmFyXG4gICAgICAgIGNvbnN0IHByb2plY3RMaXN0RGl2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3Byb2plY3QtbGlzdCcpXG4gICAgICAgIHByb2plY3RMaXN0RGl2LnRleHRDb250ZW50ID0gJyc7XG5cbiAgICAgICAgLy8gRXh0cmFjdCByZWxldmFudCBkYXRhXG4gICAgICAgIGNvbnN0IHByb2plY3ROYW1lTGlzdCA9IGRhdGEucHJvamVjdHMubWFwKHByb2plY3QgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHByb2plY3QubmFtZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgYWN0aXZlUHJvamVjdE5hbWUgPSBkYXRhLmFjdGl2ZVByb2plY3QubmFtZTtcblxuICAgICAgICAvLyBHZW5lcmF0ZSBwcm9qZWN0LWxpc3Qgc2lkZWJhciBodG1sXG4gICAgICAgIGNvbnN0IHNpZGViYXJDb250ZW50ID0gY3JlYXRlU2lkZWJhckNvbnRlbnQocHJvamVjdE5hbWVMaXN0LCBhY3RpdmVQcm9qZWN0TmFtZSk7XG4gICAgICAgIHByb2plY3RMaXN0RGl2LmFwcGVuZENoaWxkKHNpZGViYXJDb250ZW50KTtcbiAgICAgICAgXG4gICAgICAgIHB1YlN1Yi5wdWJsaXNoKCdwcm9qZWN0c1JlbmRlcicpO1xuICAgIH1cblxuICAgIC8vIF9yZW5kZXJQcm9qZWN0VGl0bGUgZnVuY3Rpb24gLSByZW5kZXJzIHRoZSBwcm9qZWN0IHRpdGxlIG9uIHRoZSBwYWdlXG4gICAgZnVuY3Rpb24gX3JlbmRlclByb2plY3RUaXRsZShkYXRhKSB7XG4gICAgICAgIC8vIENsZWFyIHByb2plY3QtdGl0bGUtY29udGVudFxuICAgICAgICBjb25zdCBwcm9qZWN0VGl0bGVEaXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcHJvamVjdC10aXRsZS1jb250ZW50Jyk7XG4gICAgICAgIHByb2plY3RUaXRsZURpdi50ZXh0Q29udGVudCA9ICcnO1xuXG4gICAgICAgIC8vIEV4dHJhY3QgcmVsZXZhbnQgZGF0YVxuICAgICAgICBjb25zdCBhY3RpdmVQcm9qZWN0TmFtZSA9IGRhdGEuYWN0aXZlUHJvamVjdC5uYW1lO1xuXG4gICAgICAgIC8vIEdlbmVyYXRlIHByb2plY3QtdGl0bGUgaHRtbFxuICAgICAgICBjb25zdCBwcm9qZWN0VGl0bGVDb250ZW50ID0gY3JlYXRlUHJvamVjdFRpdGxlQ29udGVudChhY3RpdmVQcm9qZWN0TmFtZSk7XG4gICAgICAgIHByb2plY3RUaXRsZURpdi5hcHBlbmRDaGlsZChwcm9qZWN0VGl0bGVDb250ZW50KTtcbiAgICAgICAgXG4gICAgICAgIHB1YlN1Yi5wdWJsaXNoKCdwcm9qZWN0VGl0bGVSZW5kZXInKTtcbiAgICB9XG5cbiAgICAvLyBfcmVuZGVyTmV3VG9kb0NvbnRlbnQgZnVuY3Rpb24gLSByZW5kZXJzIHBhZ2UgY29udGVudCByZWxhdGVkIHRvIGFkZGluZyBuZXcgdG9kb1xuICAgIGZ1bmN0aW9uIF9yZW5kZXJOZXdUb2RvQ29udGVudCgpIHtcbiAgICAgICAgLy8gQ2xlYXIgbmV3LXRvZG8tY29udGVudCBkaXZcbiAgICAgICAgY29uc3QgbmV3VG9kb0NvbnRlbnREaXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbmV3LXRvZG8tY29udGVudCcpO1xuICAgICAgICBuZXdUb2RvQ29udGVudERpdi50ZXh0Q29udGVudCA9ICcnO1xuXG4gICAgICAgIC8vIEdlbmVyYXRlIG5ldy10b2RvLWNvbnRlbnQgaHRtbFxuICAgICAgICBjb25zdCBuZXdUb2RvQ29udGVudCA9IGNyZWF0ZU5ld1RvZG9Db250ZW50KCk7XG4gICAgICAgIG5ld1RvZG9Db250ZW50RGl2LmFwcGVuZENoaWxkKG5ld1RvZG9Db250ZW50KTtcbiAgICAgICAgXG4gICAgICAgIHB1YlN1Yi5wdWJsaXNoKCduZXdUb2RvQ29udGVudFJlbmRlcicpO1xuICAgIH1cblxuICAgIC8vIF9yZW5kZXJUb2RvcyBmdW5jdGlvbiAtIHJlbmRlcnMgdG9kbyBjb250ZW50XG4gICAgZnVuY3Rpb24gX3JlbmRlclRvZG9zKGRhdGEpIHtcbiAgICAgICAgLy8gQ2xlYXIgdG9kby1saXN0LWl0ZW1zIGRpdlxuICAgICAgICBjb25zdCB0b2RvTGlzdERpdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN0b2RvLWxpc3QnKTtcbiAgICAgICAgdG9kb0xpc3REaXYudGV4dENvbnRlbnQgPSAnJztcblxuICAgICAgICAvLyBFeHRyYWN0IHJlbGV2YW50IGRhdGFcbiAgICAgICAgY29uc3QgdG9kb3MgPSBkYXRhLmFjdGl2ZVByb2plY3QudG9kb3M7XG4gICAgICAgIGNvbnN0IGFjdGl2ZVRvZG8gPSBkYXRhLmFjdGl2ZVByb2plY3QuYWN0aXZlVG9kbztcblxuICAgICAgICAvLyBHZW5lcmF0ZSB0b2RvLWxpc3QtaXRlbXMgY29udGVudFxuICAgICAgICBjb25zdCB0b2RvTGlzdENvbnRlbnQgPSBjcmVhdGVUb2RvTGlzdENvbnRlbnQodG9kb3MsIGFjdGl2ZVRvZG8pO1xuICAgICAgICB0b2RvTGlzdERpdi5hcHBlbmRDaGlsZCh0b2RvTGlzdENvbnRlbnQpO1xuICAgICAgICBcbiAgICAgICAgcHViU3ViLnB1Ymxpc2goJ3RvZG9zUmVuZGVyJyk7XG4gICAgfVxuICAgIFxuICAgIC8vIF9yZW5kZXJGdWxsUGFnZSBmdW5jdGlvbiAtIHJlbmRlcnMgdGhlIGVudGlyZSBwYWdlJ3MgY29udGVudFxuICAgIGZ1bmN0aW9uIF9yZW5kZXJGdWxsUGFnZShkYXRhKSB7XG4gICAgICAgIF9yZW5kZXJQcm9qZWN0cyhkYXRhKTtcbiAgICAgICAgX3JlbmRlclByb2plY3RUaXRsZShkYXRhKTtcbiAgICAgICAgX3JlbmRlck5ld1RvZG9Db250ZW50KCk7XG4gICAgICAgIF9yZW5kZXJUb2RvcyhkYXRhKTtcbiAgICB9XG4gICAgXG4gICAgLy8gaW5pdCBmdW5jdGlvbiAtIFN1YnNjcmliZXMgdG8gcHViU3ViIGV2ZW50c1xuICAgIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgICAgIHB1YlN1Yi5zdWJzY3JpYmUoJ2FwcEluaXQnLCBfcmVuZGVyRnVsbFBhZ2UpO1xuICAgICAgICBwdWJTdWIuc3Vic2NyaWJlKCdhY3RpdmF0ZU5ld1RvZG9Gb3JtJywgX3Nob3dOZXdUb2RvRm9ybSk7XG4gICAgICAgIHB1YlN1Yi5zdWJzY3JpYmUoJ2Rpc2FibGVOZXdUb2RvRm9ybScsIF9oaWRlTmV3VG9kb0Zvcm0pO1xuICAgICAgICBwdWJTdWIuc3Vic2NyaWJlKCdwcm9qZWN0c0NoYW5nZScsIF9yZW5kZXJQcm9qZWN0cyk7XG4gICAgICAgIHB1YlN1Yi5zdWJzY3JpYmUoJ3RvZG9zQ2hhbmdlJywgX3JlbmRlclRvZG9zKTtcbiAgICAgICAgcHViU3ViLnN1YnNjcmliZSgnYWN0aXZlUHJvamVjdENoYW5nZScsIF9yZW5kZXJGdWxsUGFnZSk7XG4gICAgICAgIHB1YlN1Yi5zdWJzY3JpYmUoJ2ludmFsaWRUb2RvRmllbGRzJywgX3Nob3dBbGVydCk7XG4gICAgICAgIHB1YlN1Yi5zdWJzY3JpYmUoJ2ludmFsaWRQcm9qZWN0TmFtZScsIF9zaG93QWxlcnQpO1xuICAgIH1cbiAgICBcbiAgICByZXR1cm4geyBpbml0IH07XG59KSgpO1xuXG5leHBvcnQgeyB2aWV3Q29udHJvbGxlciB9OyIsImltcG9ydCB7IGRvbVV0aWwgfSBmcm9tICcuL3V0aWwuanMnO1xuaW1wb3J0IHsgdG9kb0Zvcm0gfSBmcm9tICcuL3RvZG9Gb3JtJztcblxuZnVuY3Rpb24gY3JlYXRlVGl0bGVTZWN0aW9uKCkge1xuICAgIC8vIFBhcmVudFxuICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvbVV0aWwuY3JlYXRlKCdkaXYnLCAnJyk7XG5cbiAgICAvLyBDaGlsZHJlblxuICAgIGNvbnN0IHRpdGxlTGFiZWwgPSBkb21VdGlsLmNyZWF0ZSgnbGFiZWwnLCAnVGl0bGUnLCB7XG4gICAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgICAgIGZvcjogJ25ldy10aXRsZSdcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIGNvbnN0IHRpdGxlSW5wdXQgPSBkb21VdGlsLmNyZWF0ZSgnaW5wdXQnLCAnJywge1xuICAgICAgICBpZDogJ25ldy10aXRsZScsXG4gICAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgICAgIG5hbWU6ICduZXctdGl0bGUnLFxuICAgICAgICAgICAgdHlwZTogJ3RleHQnXG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBjb25zdCBjaGlsZHJlbiA9IFsgdGl0bGVMYWJlbCwgdGl0bGVJbnB1dCBdO1xuXG4gICAgLy8gQXBwZW5kIGNoaWxkcmVuIHRvIHBhcmVudFxuICAgIGRvbVV0aWwuYXBwZW5kQ2hpbGRyZW4oY29udGFpbmVyLCBjaGlsZHJlbik7XG5cbiAgICByZXR1cm4gY29udGFpbmVyO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVEZXNjcmlwdGlvblNlY3Rpb24oKSB7XG4gICAgLy8gUGFyZW50XG4gICAgY29uc3QgY29udGFpbmVyID0gZG9tVXRpbC5jcmVhdGUoJ2RpdicsICcnKTtcblxuICAgIC8vIENoaWxkcmVuXG4gICAgY29uc3QgZGVzY3JpcHRpb25MYWJlbCA9IGRvbVV0aWwuY3JlYXRlKCdsYWJlbCcsICdEZXNjcmlwdGlvbicsIHtcbiAgICAgICAgYXR0cmlidXRlczoge1xuICAgICAgICAgICAgZm9yOiAnbmV3LWRlc2NyaXB0aW9uJ1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgY29uc3QgZGVzY3JpcHRpb25JbnB1dCA9IGRvbVV0aWwuY3JlYXRlKCd0ZXh0YXJlYScsICcnLCB7XG4gICAgICAgIGlkOiAnbmV3LWRlc2NyaXB0aW9uJyxcbiAgICAgICAgYXR0cmlidXRlczoge1xuICAgICAgICAgICAgbmFtZTogJ25ldy1kZXNjcmlwdGlvbicsXG4gICAgICAgICAgICByb3dzOiAnNScsXG4gICAgICAgICAgICBjb2xzOiAnMzAnXG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBjb25zdCBjaGlsZHJlbiA9IFsgZGVzY3JpcHRpb25MYWJlbCwgZGVzY3JpcHRpb25JbnB1dCBdO1xuXG4gICAgLy8gQXBwZW5kIGNoaWxkcmVuIHRvIHBhcmVudFxuICAgIGRvbVV0aWwuYXBwZW5kQ2hpbGRyZW4oY29udGFpbmVyLCBjaGlsZHJlbik7XG4gICAgXG4gICAgcmV0dXJuIGNvbnRhaW5lcjtcbn1cblxuZnVuY3Rpb24gY3JlYXRlRGF0ZVNlY3Rpb24oKSB7XG4gICAgLy8gUGFyZW50XG4gICAgY29uc3QgY29udGFpbmVyID0gZG9tVXRpbC5jcmVhdGUoJ2RpdicsICcnKTtcblxuICAgIC8vIENoaWxkcmVuXG4gICAgY29uc3QgZGF0ZUxhYmVsID0gZG9tVXRpbC5jcmVhdGUoJ2xhYmVsJywgJ0R1ZSBEYXRlJywge1xuICAgICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgICBmb3I6ICduZXctZGF0ZSdcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIGNvbnN0IGRhdGVJbnB1dCA9IGRvbVV0aWwuY3JlYXRlKCdpbnB1dCcsICcnLCB7XG4gICAgICAgIGlkOiAnbmV3LWRhdGUnLFxuICAgICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgICBuYW1lOiAnbmV3LWRhdGUnLFxuICAgICAgICAgICAgdHlwZTogJ2RhdGUnXG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBjb25zdCBjaGlsZHJlbiA9IFsgZGF0ZUxhYmVsLCBkYXRlSW5wdXQgXTtcblxuICAgIC8vIEFwcGVuZCBjaGlsZHJlbiB0byBwYXJlbnRcbiAgICBkb21VdGlsLmFwcGVuZENoaWxkcmVuKGNvbnRhaW5lciwgY2hpbGRyZW4pO1xuICAgIFxuICAgIHJldHVybiBjb250YWluZXI7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVByaW9yaXR5U2VjdGlvbigpIHtcbiAgICAvLyBQYXJlbnRcbiAgICBjb25zdCBjb250YWluZXIgPSBkb21VdGlsLmNyZWF0ZSgnZGl2JywgJycpO1xuXG4gICAgLy8gQ2hpbGRyZW5cbiAgICBjb25zdCBwID0gZG9tVXRpbC5jcmVhdGUoJ3AnLCAnUHJpb3JpdHknKTtcbiAgICBjb25zdCBsb3dJbnB1dCA9IGRvbVV0aWwuY3JlYXRlKCdpbnB1dCcsICcnLCB7XG4gICAgICAgIGlkOiAnbmV3LWxvdycsXG4gICAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgICAgIHR5cGU6ICdyYWRpbycsXG4gICAgICAgICAgICBuYW1lOiAnbmV3LXByaW9yaXR5JyxcbiAgICAgICAgICAgIHZhbHVlOiAnbG93J1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgY29uc3QgbG93TGFiZWwgPSBkb21VdGlsLmNyZWF0ZSgnbGFiZWwnLCAnTG93Jywge1xuICAgICAgICBjbGFzczogJ3JhZGlvLWxhYmVsJyxcbiAgICAgICAgYXR0cmlidXRlczoge1xuICAgICAgICAgICAgZm9yOiAnbmV3LWxvdydcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIGNvbnN0IG1pZElucHV0ID0gZG9tVXRpbC5jcmVhdGUoJ2lucHV0JywgJycsIHtcbiAgICAgICAgaWQ6ICduZXctbWlkJyxcbiAgICAgICAgYXR0cmlidXRlczoge1xuICAgICAgICAgICAgdHlwZTogJ3JhZGlvJyxcbiAgICAgICAgICAgIG5hbWU6ICduZXctcHJpb3JpdHknLFxuICAgICAgICAgICAgdmFsdWU6ICdtaWQnXG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBjb25zdCBtaWRMYWJlbCA9IGRvbVV0aWwuY3JlYXRlKCdsYWJlbCcsICdNaWQnLCB7XG4gICAgICAgIGNsYXNzOiAncmFkaW8tbGFiZWwnLFxuICAgICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgICBmb3I6ICduZXctbWlkJ1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgY29uc3QgaGlnaElucHV0ID0gZG9tVXRpbC5jcmVhdGUoJ2lucHV0JywgJycsIHtcbiAgICAgICAgaWQ6ICduZXctaGlnaCcsXG4gICAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgICAgIHR5cGU6ICdyYWRpbycsXG4gICAgICAgICAgICBuYW1lOiAnbmV3LXByaW9yaXR5JyxcbiAgICAgICAgICAgIHZhbHVlOiAnaGlnaCdcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIGNvbnN0IGhpZ2hMYWJlbCA9IGRvbVV0aWwuY3JlYXRlKCdsYWJlbCcsICdIaWdoJywge1xuICAgICAgICBjbGFzczogJ3JhZGlvLWxhYmVsJyxcbiAgICAgICAgYXR0cmlidXRlczoge1xuICAgICAgICAgICAgZm9yOiAnbmV3LWhpZ2gnXG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBjb25zdCBjaGlsZHJlbiA9IFtcbiAgICAgICAgcCxcbiAgICAgICAgbG93SW5wdXQsXG4gICAgICAgIGxvd0xhYmVsLFxuICAgICAgICBtaWRJbnB1dCxcbiAgICAgICAgbWlkTGFiZWwsXG4gICAgICAgIGhpZ2hJbnB1dCxcbiAgICAgICAgaGlnaExhYmVsXG4gICAgXTtcblxuICAgIC8vIEFwcGVuZCBjaGlsZHJlbiB0byBwYXJlbnRcbiAgICBkb21VdGlsLmFwcGVuZENoaWxkcmVuKGNvbnRhaW5lciwgY2hpbGRyZW4pO1xuICAgIFxuICAgIHJldHVybiBjb250YWluZXI7XG59XG5cblxuZnVuY3Rpb24gY3JlYXRlQWRkVG9kb0Zvcm1EaXYoKSB7XG4gICAgLy8gUGFyZW50XG4gICAgY29uc3QgYWRkVG9kb0Zvcm1EaXYgPSBkb21VdGlsLmNyZWF0ZSgnZGl2JywgJycsIHsgY2xhc3M6ICdhZGQtdG9kbycgfSk7XG5cbiAgICAvLyBDaGlsZHJlblxuICAgIGNvbnN0IGNsb3NlVG9kb0Zvcm1CdG4gPSBkb21VdGlsLmNyZWF0ZSgnYnV0dG9uJywgJ1gnLCB7IGlkOiAnY2xvc2UtbmV3LXRvZG8tZm9ybScgfSk7XG4gICAgY29uc3QgaDMgPSBkb21VdGlsLmNyZWF0ZSgnaDMnLCAnQWRkIE5ldyBUb2RvJyk7XG4gICAgY29uc3QgdGl0bGVTZWN0aW9uID0gdG9kb0Zvcm0uY3JlYXRlVGl0bGVTZWN0aW9uKCduZXctdGl0bGUnKVxuICAgIGNvbnN0IGRlc2NyaXB0aW9uU2VjdGlvbiA9IHRvZG9Gb3JtLmNyZWF0ZURlc2NyaXB0aW9uU2VjdGlvbignbmV3LWRlc2NyaXB0aW9uJyk7XG4gICAgY29uc3QgZGF0ZVNlY3Rpb24gPSB0b2RvRm9ybS5jcmVhdGVEYXRlU2VjdGlvbignbmV3LWRhdGUnKTtcbiAgICBjb25zdCBwcmlvcml0eVNlY3Rpb24gPSB0b2RvRm9ybS5jcmVhdGVQcmlvcml0eVNlY3Rpb24oWyAnbmV3LWxvdycsICduZXctbWlkJywgJ25ldy1oaWdoJyBdLFxuICAgICAgICBbICdsb3cnLCAnbWlkJywgJ2hpZ2gnIF0sXG4gICAgICAgIFsgJ0xvdycsICdNaWQnLCAnSGlnaCcgXSxcbiAgICAgICAgJ25ldy1wcmlvcml0eScgICAgXG4gICAgKTtcbiAgICBjb25zdCBzdWJtaXRUb2RvQnRuID0gZG9tVXRpbC5jcmVhdGUoJ2J1dHRvbicsICdBZGQnLCB7IGlkOiAnc3VibWl0LXRvZG8tYnRuJyB9KTtcbiAgICBjb25zdCBjaGlsZHJlbiA9IFsgXG4gICAgICAgIGNsb3NlVG9kb0Zvcm1CdG4sXG4gICAgICAgIGgzLFxuICAgICAgICB0aXRsZVNlY3Rpb24sXG4gICAgICAgIGRlc2NyaXB0aW9uU2VjdGlvbixcbiAgICAgICAgZGF0ZVNlY3Rpb24sXG4gICAgICAgIHByaW9yaXR5U2VjdGlvbixcbiAgICAgICAgc3VibWl0VG9kb0J0bixcbiAgICBdO1xuXG4gICAgLy8gQXBwZW5kIGNoaWxkcmVuIHRvIHBhcmVudFxuICAgIGRvbVV0aWwuYXBwZW5kQ2hpbGRyZW4oYWRkVG9kb0Zvcm1EaXYsIGNoaWxkcmVuKTtcblxuICAgIHJldHVybiBhZGRUb2RvRm9ybURpdjtcbn1cblxuZnVuY3Rpb24gY3JlYXRlTmV3VG9kb0NvbnRlbnQoKSB7XG4gICAgLy8gUGFyZW50XG4gICAgY29uc3QgY29udGFpbmVyID0gZG9tVXRpbC5jcmVhdGUoJ2RpdicsICcnKTtcblxuICAgIC8vIENoaWxkcmVuXG4gICAgY29uc3QgYWRkVG9kb0J0biA9IGRvbVV0aWwuY3JlYXRlKCdidXR0b24nLCAnQWRkIFRvZG8nLCB7IGlkOiAnYWRkLXRvZG8tYnRuJyB9KTtcbiAgICBjb25zdCBhZGRUb2RvRm9ybURpdiA9IGNyZWF0ZUFkZFRvZG9Gb3JtRGl2KCk7XG4gICAgY29uc3QgY2hpbGRyZW4gPSBbIGFkZFRvZG9CdG4sIGFkZFRvZG9Gb3JtRGl2IF07XG5cbiAgICAvLyBBcHBlbmQgY2hpbGRyZW4gdG8gcGFyZW50XG4gICAgZG9tVXRpbC5hcHBlbmRDaGlsZHJlbihjb250YWluZXIsIGNoaWxkcmVuKTtcblxuICAgIHJldHVybiBjb250YWluZXI7XG59XG5cbmV4cG9ydCB7IGNyZWF0ZU5ld1RvZG9Db250ZW50IH07IiwiaW1wb3J0IHsgZG9tVXRpbCB9IGZyb20gJy4vdXRpbC5qcyc7XG5cbmZ1bmN0aW9uIGNyZWF0ZVByb2plY3REaXYocHJvamVjdE5hbWUsIGlzQWN0aXZlUHJvamVjdCkge1xuICAgIC8vIFBhcmVudFxuICAgIGNvbnN0IHByb2plY3REaXZDbGFzc0xpc3QgPSBpc0FjdGl2ZVByb2plY3QgPyBbICdwcm9qZWN0JywgJ2FjdGl2ZS1wcm9qZWN0JyBdIDogIFsgJ3Byb2plY3QnIF07XG4gICAgY29uc3QgcHJvamVjdERpdiA9IGRvbVV0aWwuY3JlYXRlKCdkaXYnLCAnJywge1xuICAgICAgICBjbGFzczogcHJvamVjdERpdkNsYXNzTGlzdCxcbiAgICAgICAgYXR0cmlidXRlczoge1xuICAgICAgICAgICAgJ2RhdGEtbmFtZSc6IHByb2plY3ROYW1lXG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIENoaWxkcmVuXG4gICAgY29uc3QgbmFtZVAgPSBkb21VdGlsLmNyZWF0ZSgncCcsIHByb2plY3ROYW1lLCB7IGNsYXNzOiAncHJvamVjdC1uYW1lJyB9KTtcbiAgICBjb25zdCBkZWxCdXR0b24gPSBkb21VdGlsLmNyZWF0ZSgnYnV0dG9uJywgJy0nLCB7IGNsYXNzOiAnZGVsLXByb2plY3QnIH0pO1xuICAgIGNvbnN0IGNoaWxkcmVuID0gWyBuYW1lUCwgZGVsQnV0dG9uIF07XG5cbiAgICAvLyBBcHBlbmQgY2hpbGRyZW4gdG8gcGFyZW50XG4gICAgZG9tVXRpbC5hcHBlbmRDaGlsZHJlbihwcm9qZWN0RGl2LCBjaGlsZHJlbik7XG5cbiAgICByZXR1cm4gcHJvamVjdERpdjtcbn1cblxuZnVuY3Rpb24gY3JlYXRlU2lkZWJhckNvbnRlbnQocHJvamVjdE5hbWVMaXN0LCBhY3RpdmVQcm9qZWN0TmFtZSkge1xuICAgIC8vIHBhcmVudFxuICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvbVV0aWwuY3JlYXRlKCdkaXYnLCAnJyk7XG4gICAgXG4gICAgLy8gY2hpbGRyZW5cbiAgICBwcm9qZWN0TmFtZUxpc3QuZm9yRWFjaChwcm9qZWN0TmFtZSA9PiB7XG4gICAgICAgIC8vIEFwcGVuZCBjaGlsZHJlbiB0byBwYXJlbnRcbiAgICAgICAgY29uc3QgaXNBY3RpdmVQcm9qZWN0ID0gcHJvamVjdE5hbWUgPT09IGFjdGl2ZVByb2plY3ROYW1lO1xuICAgICAgICBjb25zdCBwcm9qZWN0RGl2ID0gY3JlYXRlUHJvamVjdERpdihwcm9qZWN0TmFtZSwgaXNBY3RpdmVQcm9qZWN0KTtcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZChwcm9qZWN0RGl2KTtcbiAgICB9KTtcblxuICAgIHJldHVybiBjb250YWluZXI7XG59XG5cbmV4cG9ydCB7IGNyZWF0ZVNpZGViYXJDb250ZW50IH07IiwiaW1wb3J0IHsgZG9tVXRpbCB9IGZyb20gJy4vdXRpbC5qcyc7XG5cbmZ1bmN0aW9uIGNyZWF0ZVByb2plY3RUaXRsZUNvbnRlbnQoYWN0aXZlUHJvamVjdE5hbWUpIHtcbiAgICBjb25zdCBoMiA9IGRvbVV0aWwuY3JlYXRlKCdoMicsIGFjdGl2ZVByb2plY3ROYW1lKTtcbiAgICByZXR1cm4gaDI7XG59XG5cbmV4cG9ydCB7IGNyZWF0ZVByb2plY3RUaXRsZUNvbnRlbnQgfTsiLCJpbXBvcnQgeyBkb21VdGlsIH0gZnJvbSAnLi91dGlsLmpzJztcblxuLy8gdG9kb0Zvcm0gbW9kdWxlIC0gZ2VuZXJhdGVzIGZvcm0gZmllbGRzIHV0aWxpemVkIGJ5IHRoZSBuZXcgdG9kbyBhbmQgYWN0aXZlIHRvZG8gc2VjdGlvbnNcbmNvbnN0IHRvZG9Gb3JtID0gKGZ1bmN0aW9uKCkge1xuXG4gICAgZnVuY3Rpb24gY3JlYXRlVGl0bGVTZWN0aW9uKGlkLCBpbml0aWFsVmFsdWU9JycpIHtcbiAgICAgICAgLy8gUGFyZW50XG4gICAgICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvbVV0aWwuY3JlYXRlKCdkaXYnLCAnJyk7XG4gICAgXG4gICAgICAgIC8vIENoaWxkcmVuXG4gICAgICAgIGNvbnN0IHRpdGxlTGFiZWwgPSBkb21VdGlsLmNyZWF0ZSgnbGFiZWwnLCAnVGl0bGUnLCB7XG4gICAgICAgICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgICAgICAgZm9yOiBpZFxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgdGl0bGVJbnB1dCA9IGRvbVV0aWwuY3JlYXRlKCdpbnB1dCcsICcnLCB7XG4gICAgICAgICAgICBpZDogaWQsXG4gICAgICAgICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgICAgICAgbmFtZTogaWQsXG4gICAgICAgICAgICAgICAgdHlwZTogJ3RleHQnLFxuICAgICAgICAgICAgICAgIHZhbHVlOiBpbml0aWFsVmFsdWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IGNoaWxkcmVuID0gWyB0aXRsZUxhYmVsLCB0aXRsZUlucHV0IF07XG4gICAgXG4gICAgICAgIC8vIEFwcGVuZCBjaGlsZHJlbiB0byBwYXJlbnRcbiAgICAgICAgZG9tVXRpbC5hcHBlbmRDaGlsZHJlbihjb250YWluZXIsIGNoaWxkcmVuKTtcbiAgICBcbiAgICAgICAgcmV0dXJuIGNvbnRhaW5lcjtcbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gY3JlYXRlRGVzY3JpcHRpb25TZWN0aW9uKGlkLCBpbml0aWFsVmFsdWU9JycpIHtcbiAgICAgICAgLy8gUGFyZW50XG4gICAgICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvbVV0aWwuY3JlYXRlKCdkaXYnLCAnJyk7XG4gICAgXG4gICAgICAgIC8vIENoaWxkcmVuXG4gICAgICAgIGNvbnN0IGRlc2NyaXB0aW9uTGFiZWwgPSBkb21VdGlsLmNyZWF0ZSgnbGFiZWwnLCAnRGVzY3JpcHRpb24nLCB7XG4gICAgICAgICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgICAgICAgZm9yOiBpZFxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgZGVzY3JpcHRpb25JbnB1dCA9IGRvbVV0aWwuY3JlYXRlKCd0ZXh0YXJlYScsIGluaXRpYWxWYWx1ZSwge1xuICAgICAgICAgICAgaWQ6IGlkLFxuICAgICAgICAgICAgYXR0cmlidXRlczoge1xuICAgICAgICAgICAgICAgIG5hbWU6IGlkLFxuICAgICAgICAgICAgICAgIHJvd3M6ICc1JyxcbiAgICAgICAgICAgICAgICBjb2xzOiAnMzAnXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCBjaGlsZHJlbiA9IFsgZGVzY3JpcHRpb25MYWJlbCwgZGVzY3JpcHRpb25JbnB1dCBdO1xuICAgIFxuICAgICAgICAvLyBBcHBlbmQgY2hpbGRyZW4gdG8gcGFyZW50XG4gICAgICAgIGRvbVV0aWwuYXBwZW5kQ2hpbGRyZW4oY29udGFpbmVyLCBjaGlsZHJlbik7XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gY29udGFpbmVyO1xuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBjcmVhdGVEYXRlU2VjdGlvbihpZCwgaW5pdGlhbFZhbHVlPScnKSB7XG4gICAgICAgIC8vIFBhcmVudFxuICAgICAgICBjb25zdCBjb250YWluZXIgPSBkb21VdGlsLmNyZWF0ZSgnZGl2JywgJycpO1xuICAgIFxuICAgICAgICAvLyBDaGlsZHJlblxuICAgICAgICBjb25zdCBkYXRlTGFiZWwgPSBkb21VdGlsLmNyZWF0ZSgnbGFiZWwnLCAnRHVlIERhdGUnLCB7XG4gICAgICAgICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgICAgICAgZm9yOiBpZFxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgZGF0ZUlucHV0ID0gZG9tVXRpbC5jcmVhdGUoJ2lucHV0JywgJycsIHtcbiAgICAgICAgICAgIGlkOiBpZCxcbiAgICAgICAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgICAgICAgICBuYW1lOiBpZCxcbiAgICAgICAgICAgICAgICB0eXBlOiAnZGF0ZScsXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBkYXRlSW5wdXQudmFsdWUgPSBpbml0aWFsVmFsdWU7XG4gICAgICAgIGNvbnN0IGNoaWxkcmVuID0gWyBkYXRlTGFiZWwsIGRhdGVJbnB1dCBdO1xuICAgIFxuICAgICAgICAvLyBBcHBlbmQgY2hpbGRyZW4gdG8gcGFyZW50XG4gICAgICAgIGRvbVV0aWwuYXBwZW5kQ2hpbGRyZW4oY29udGFpbmVyLCBjaGlsZHJlbik7XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gY29udGFpbmVyO1xuICAgIH1cbiAgICBcbiAgICAvLyBDcmVhdGVzIHJhZGlvIGJ1dHRvbiBpbnB1dCBzZWN0aW9uIG9mIGZvcm1cbiAgICBmdW5jdGlvbiBjcmVhdGVQcmlvcml0eVNlY3Rpb24oaWRMaXN0LCB2YWx1ZUxpc3QsIGxhYmVsVGV4dExpc3QsIG5hbWVBdHRyLCBpbml0aWFsQ2hlY2tlZFZhbHVlKSB7XG4gICAgICAgIC8vIFBhcmVudFxuICAgICAgICBjb25zdCBjb250YWluZXIgPSBkb21VdGlsLmNyZWF0ZSgnZGl2JywgJycpO1xuICAgIFxuICAgICAgICAvLyBDaGlsZHJlblxuICAgICAgICBjb25zdCBjaGlsZHJlbiA9IFtdO1xuICAgICAgICBjb25zdCBwID0gZG9tVXRpbC5jcmVhdGUoJ3AnLCAnUHJpb3JpdHknKTtcbiAgICAgICAgY2hpbGRyZW4ucHVzaChwKTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGlkTGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgaW5wdXRBdHRyaWJ1dGVzID0ge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdyYWRpbycsXG4gICAgICAgICAgICAgICAgbmFtZTogbmFtZUF0dHIsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlTGlzdFtpXVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodmFsdWVMaXN0W2ldID09PSBpbml0aWFsQ2hlY2tlZFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaW5wdXRBdHRyaWJ1dGVzLmNoZWNrZWQgPSAnY2hlY2tlZCc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IGlucHV0ID0gZG9tVXRpbC5jcmVhdGUoJ2lucHV0JywgJycsIHtcbiAgICAgICAgICAgICAgICBpZDogaWRMaXN0W2ldLFxuICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXM6IGlucHV0QXR0cmlidXRlc1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGNvbnN0IGxhYmVsID0gZG9tVXRpbC5jcmVhdGUoJ2xhYmVsJywgbGFiZWxUZXh0TGlzdFtpXSwge1xuICAgICAgICAgICAgICAgIGNsYXNzOiAncmFkaW8tbGFiZWwnLFxuICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgICAgICAgICAgICAgZm9yOiBpZExpc3RbaV1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgY2hpbGRyZW4ucHVzaChpbnB1dCwgbGFiZWwpO1xuICAgICAgICB9XG4gICAgXG4gICAgICAgIC8vIEFwcGVuZCBjaGlsZHJlbiB0byBwYXJlbnRcbiAgICAgICAgZG9tVXRpbC5hcHBlbmRDaGlsZHJlbihjb250YWluZXIsIGNoaWxkcmVuKTtcbiAgICAgICAgXG4gICAgICAgIHJldHVybiBjb250YWluZXI7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgY3JlYXRlVGl0bGVTZWN0aW9uLFxuICAgICAgICBjcmVhdGVEZXNjcmlwdGlvblNlY3Rpb24sXG4gICAgICAgIGNyZWF0ZURhdGVTZWN0aW9uLFxuICAgICAgICBjcmVhdGVQcmlvcml0eVNlY3Rpb25cbiAgICB9O1xufSkoKTtcblxuZXhwb3J0IHsgdG9kb0Zvcm0gfTsiLCJpbXBvcnQgeyBkb21VdGlsIH0gZnJvbSAnLi91dGlsLmpzJztcbmltcG9ydCB7IHRvZG9Gb3JtIH0gZnJvbSAnLi90b2RvRm9ybSc7XG5cbmZ1bmN0aW9uIGdlbmVyYXRlVG9kb0RpdkNsYXNzTGlzdCh0b2RvLCBpc0FjdGl2ZVRvZG8pIHtcbiAgICBjb25zdCBjbGFzc0xpc3QgPSBbXTtcblxuICAgIC8vIEFkZCBjbGFzc2VzIGJhc2VkIG9uIHRvZG8gcHJvcGVydHkgdmFsdWVzXG4gICAgaWYgKGlzQWN0aXZlVG9kbykge1xuICAgICAgICBjbGFzc0xpc3QucHVzaCgnYWN0aXZlLXRvZG8nKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBjbGFzc0xpc3QucHVzaCgnaW5hY3RpdmUtdG9kbycpO1xuICAgIH1cblxuICAgIGlmICh0b2RvLmNvbXBsZXRlKSB7XG4gICAgICAgIGNsYXNzTGlzdC5wdXNoKCdjb21wbGV0ZScpO1xuICAgIH1cblxuICAgIGlmICh0b2RvLnByaW9yaXR5ID09PSAnbG93Jykge1xuICAgICAgICBjbGFzc0xpc3QucHVzaCgnbG93LXByaW9yaXR5JylcbiAgICB9IGVsc2UgaWYgKHRvZG8ucHJpb3JpdHkgPT09ICdtaWQnKSB7XG4gICAgICAgIGNsYXNzTGlzdC5wdXNoKCdtaWQtcHJpb3JpdHknKTtcbiAgICB9IGVsc2UgaWYgKHRvZG8ucHJpb3JpdHkgPT09ICdoaWdoJykge1xuICAgICAgICBjbGFzc0xpc3QucHVzaCgnaGlnaC1wcmlvcml0eScpO1xuICAgIH1cblxuICAgIHJldHVybiBjbGFzc0xpc3Q7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUluYWN0aXZlVG9kb0Rpdih0b2RvKSB7XG4gICAgY29uc3QgY2xhc3NMaXN0ID0gZ2VuZXJhdGVUb2RvRGl2Q2xhc3NMaXN0KHRvZG8sIGZhbHNlKTtcblxuICAgIC8vIFBhcmVudFxuICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvbVV0aWwuY3JlYXRlKCdkaXYnLCAnJywge1xuICAgICAgICBjbGFzczogY2xhc3NMaXN0LFxuICAgICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgICAnZGF0YS10aXRsZSc6IHRvZG8udGl0bGVcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gQ2hpbGRyZW5cbiAgICBjb25zdCBoNCA9IGRvbVV0aWwuY3JlYXRlKCdoNCcsIHRvZG8udGl0bGUpO1xuICAgIGNvbnN0IHAgPSBkb21VdGlsLmNyZWF0ZSgncCcsIGBEdWU6ICR7dG9kby5kdWVEYXRlfWApO1xuICAgIGNvbnN0IGNoaWxkcmVuID0gWyBoNCwgcCBdO1xuXG4gICAgLy8gQXBwZW5kIGNoaWxkcmVuIHRvIHBhcmVudFxuICAgIGRvbVV0aWwuYXBwZW5kQ2hpbGRyZW4oY29udGFpbmVyLCBjaGlsZHJlbik7XG5cbiAgICByZXR1cm4gY29udGFpbmVyO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVBY3RpdmVUb2RvRGl2KHRvZG8pIHtcbiAgICBjb25zdCBjbGFzc0xpc3QgPSBnZW5lcmF0ZVRvZG9EaXZDbGFzc0xpc3QodG9kbywgdHJ1ZSk7XG5cbiAgICAvLyBQYXJlbnRcbiAgICBjb25zdCBjb250YWluZXIgPSBkb21VdGlsLmNyZWF0ZSgnZGl2JywgJycsIHtcbiAgICAgICAgY2xhc3M6IGNsYXNzTGlzdCxcbiAgICAgICAgYXR0cmlidXRlczoge1xuICAgICAgICAgICAgJ2RhdGEtdGl0bGUnOiB0b2RvLnRpdGxlXG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIENoaWxkcmVuXG4gICAgY29uc3QgdG9nZ2xlQ29tcGxldGVCdG4gPSBkb21VdGlsLmNyZWF0ZSgnYnV0dG9uJywgJycsIHsgaWQ6ICd0b2dnbGUtY29tcGxldGUnIH0pO1xuICAgIHRvZ2dsZUNvbXBsZXRlQnRuLmlubmVySFRNTCA9ICcmY2hlY2s7JztcbiAgICBjb25zdCBkZWxBY3RpdmVUb2RvQnRuID0gZG9tVXRpbC5jcmVhdGUoJ2J1dHRvbicsICdYJywgeyBpZDogJ2RlbC1hY3RpdmUtdG9kbycgfSk7XG4gICAgY29uc3QgdGl0bGVTZWN0aW9uID0gdG9kb0Zvcm0uY3JlYXRlVGl0bGVTZWN0aW9uKCd1cGRhdGUtdGl0bGUnLCB0b2RvLnRpdGxlKVxuICAgIGNvbnN0IGRlc2NyaXB0aW9uU2VjdGlvbiA9IHRvZG9Gb3JtLmNyZWF0ZURlc2NyaXB0aW9uU2VjdGlvbigndXBkYXRlLWRlc2NyaXB0aW9uJywgdG9kby5kZXNjcmlwdGlvbik7XG4gICAgY29uc3QgZGF0ZVNlY3Rpb24gPSB0b2RvRm9ybS5jcmVhdGVEYXRlU2VjdGlvbigndXBkYXRlLWRhdGUnLCB0b2RvLmR1ZURhdGUpO1xuICAgIGNvbnN0IHByaW9yaXR5U2VjdGlvbiA9IHRvZG9Gb3JtLmNyZWF0ZVByaW9yaXR5U2VjdGlvbihbICd1cGRhdGUtbG93JywgJ3VwZGF0ZS1taWQnLCAndXBkYXRlLWhpZ2gnIF0sXG4gICAgICAgIFsgJ2xvdycsICdtaWQnLCAnaGlnaCcgXSxcbiAgICAgICAgWyAnTG93JywgJ01pZCcsICdIaWdoJyBdLFxuICAgICAgICAndXBkYXRlLXByaW9yaXR5JyxcbiAgICAgICAgdG9kby5wcmlvcml0eSAgICBcbiAgICApO1xuICAgIGNvbnN0IHNhdmVCdG4gPSBkb21VdGlsLmNyZWF0ZSgnYnV0dG9uJywgJ1NhdmUnLCB7XG4gICAgICAgIGlkOiAnc2F2ZS1idG4nXG4gICAgfSk7XG5cbiAgICBjb25zdCBjaGlsZHJlbiA9IFtcbiAgICAgICAgdG9nZ2xlQ29tcGxldGVCdG4sXG4gICAgICAgIGRlbEFjdGl2ZVRvZG9CdG4sXG4gICAgICAgIHRpdGxlU2VjdGlvbixcbiAgICAgICAgZGVzY3JpcHRpb25TZWN0aW9uLFxuICAgICAgICBkYXRlU2VjdGlvbixcbiAgICAgICAgcHJpb3JpdHlTZWN0aW9uLFxuICAgICAgICBzYXZlQnRuXG4gICAgXTtcblxuICAgIC8vIEFwcGVuZCBjaGlsZHJlbiB0byBwYXJlbnRcbiAgICBkb21VdGlsLmFwcGVuZENoaWxkcmVuKGNvbnRhaW5lciwgY2hpbGRyZW4pO1xuXG4gICAgcmV0dXJuIGNvbnRhaW5lcjtcbn1cblxuZnVuY3Rpb24gY3JlYXRlVG9kb0xpc3RJdGVtcyh0b2RvcywgYWN0aXZlVG9kbykge1xuICAgIC8vIFBhcmVudFxuICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvbVV0aWwuY3JlYXRlKCdkaXYnLCAnJywgeyBpZDogJ3RvZG8tbGlzdC1pdGVtcycgfSk7XG5cbiAgICAvLyBDaGlsZHJlblxuICAgIHRvZG9zLmZvckVhY2godG9kbyA9PiB7XG4gICAgICAgIGxldCB0b2RvRGl2O1xuICAgICAgICBpZiAoYWN0aXZlVG9kbyA9PT0gbnVsbCB8fCB0b2RvLnRpdGxlICE9IGFjdGl2ZVRvZG8udGl0bGUpIHtcbiAgICAgICAgICAgIHRvZG9EaXYgPSBjcmVhdGVJbmFjdGl2ZVRvZG9EaXYodG9kbyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0b2RvRGl2ID0gY3JlYXRlQWN0aXZlVG9kb0Rpdih0b2RvKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgLy8gQXBwZW5kIGNoaWxkcmVuIHRvIHBhcmVudFxuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQodG9kb0Rpdik7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gY29udGFpbmVyO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVUb2RvTGlzdENvbnRlbnQodG9kb3MsIGFjdGl2ZVRvZG8pIHtcbiAgICAvLyBQYXJlbnRcbiAgICBjb25zdCBjb250YWluZXIgPSBkb21VdGlsLmNyZWF0ZSgnZGl2JywgJycpO1xuXG4gICAgLy8gQ2hpbGRyZW5cbiAgICBjb25zdCBoMyA9IGRvbVV0aWwuY3JlYXRlKCdoMycsICdUb2RvIEl0ZW1zJyk7XG4gICAgY29uc3QgdG9kb0xpc3RJdGVtcyA9IGNyZWF0ZVRvZG9MaXN0SXRlbXModG9kb3MsIGFjdGl2ZVRvZG8pO1xuICAgIGNvbnN0IGNoaWxkcmVuID0gWyBoMywgdG9kb0xpc3RJdGVtcyBdO1xuXG4gICAgLy8gQXBwZW5kIGNoaWxkcmVuIHRvIHBhcmVudFxuICAgIGRvbVV0aWwuYXBwZW5kQ2hpbGRyZW4oY29udGFpbmVyLCBjaGlsZHJlbik7XG5cbiAgICByZXR1cm4gY29udGFpbmVyO1xufVxuXG5leHBvcnQgeyBjcmVhdGVUb2RvTGlzdENvbnRlbnQgfTsiLCIvLyBkb21VdGlsIG1vZHVsZSAtIGNvbnRhaW5zIGZ1bmN0aW9ucyB0byBzaW1wbGlmeSBET00gbm9kZSBtYW5pcHVsYXRpb24gYW5kIGNyZWF0aW9uXG5jb25zdCBkb21VdGlsID0gKGZ1bmN0aW9uKCkge1xuICAgIC8vIF9hZGRJZCBmdW5jdGlvbiAtIGFkZHMgaWQgdG8gYSBzcGVjaWZpZWQgZWxlbWVudFxuICAgIGZ1bmN0aW9uIF9hZGRJZChlbGVtLCBpZCkge1xuICAgICAgICBlbGVtLmlkID0gaWQ7XG4gICAgICAgIHJldHVybiBlbGVtO1xuICAgIH1cbiAgICBcbiAgICAvLyBfYWRkQ2xhc3MgLSBhZGRzIHNwZWNpZmllZCBjbGFzc2VzIHRvIGFuIGVsZW1lbnRcbiAgICBmdW5jdGlvbiBfYWRkQ2xhc3MoZWxlbSwgY2xhc3Nlcykge1xuICAgICAgICBpZiAodHlwZW9mIGNsYXNzZXMgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBlbGVtLmNsYXNzTGlzdC5hZGQoY2xhc3Nlcyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjbGFzc2VzLmZvckVhY2goY2xhc3NOYW1lID0+IHtcbiAgICAgICAgICAgICAgICBlbGVtLmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBlbGVtO1xuICAgIH1cblxuICAgIC8vIF9hZGRBdHRyaWJ1dGUgLSBhZGRzIHNwZWNpZmllZCBhdHRyaWJ1dGVzIHRvIGFuIGVsZW1lbnRcbiAgICBmdW5jdGlvbiBfYWRkQXR0cmlidXRlKGVsZW0sIGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgZm9yIChsZXQga2V5IGluIGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICAgIGVsZW0uc2V0QXR0cmlidXRlKGtleSwgYXR0cmlidXRlc1trZXldKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZWxlbTtcbiAgICB9XG4gICAgXG4gICAgLyogY3JlYXRlIG1ldGhvZCAtIGNyZWF0ZXMgYW4gZWxlbWVudCB3aXRoIHNwZWNpZmllZCB0YWcsIGdpdmVuIHRleHQsIGFuZCBzdXBwbGllZCBvcHRpb25zXG4gICAgb3B0aW9ucyBwYXJlbXRlciBpcyBvZiB0aGUgZm9ybTogXG4gICAge1xuICAgICAgICBpZDogU3RyaW5nLFxuICAgICAgICBjbGFzczogU3RyaW5nIHwgW1N0cmluZ11cbiAgICAgICAgYXR0cmlidXRlczoge1xuICAgICAgICAgICAgYXR0cmlidXRlMTogU3RyaW5nLFxuICAgICAgICAgICAgYXR0cmlidXRlMjogU3RyaW5nXG4gICAgICAgIH1cbiAgICB9XG4gICAgKi9cbiAgICBmdW5jdGlvbiBjcmVhdGUodGFnLCB0ZXh0LCBvcHRpb25zKSB7XG4gICAgICAgIGNvbnN0IGVsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZyk7XG4gICAgICAgIGVsZW0udGV4dENvbnRlbnQgPSB0ZXh0O1xuXG4gICAgICAgIC8vIHJldHVybiB0aGUgZWxlbWVudCBpZiBubyBvcHRpb25zIHdlcmUgc3BlY2lmaWVkXG4gICAgICAgIGlmIChvcHRpb25zID09PSB1bmRlZmluZWQgfHwgT2JqZWN0LmtleXMob3B0aW9ucykubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gZWxlbTtcbiAgICAgICAgfSBcbiAgICAgICAgXG4gICAgICAgIC8vIEFkZCBzcGVjaWZpZWQgaWRcbiAgICAgICAgaWYgKG9wdGlvbnMuaWQpIHtcbiAgICAgICAgICAgIF9hZGRJZChlbGVtLCBvcHRpb25zLmlkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEFkZCBzcGVjaWZpZWQgY2xhc3NcbiAgICAgICAgaWYgKG9wdGlvbnMuY2xhc3MpIHtcbiAgICAgICAgICAgIF9hZGRDbGFzcyhlbGVtLCBvcHRpb25zLmNsYXNzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEFkZCBzcGVjaWZpZWQgYXR0cmlidXRlc1xuICAgICAgICBpZiAob3B0aW9ucy5hdHRyaWJ1dGVzICE9PSB1bmRlZmluZWQgJiYgT2JqZWN0LmtleXMob3B0aW9ucy5hdHRyaWJ1dGVzKS5sZW5ndGggIT09IDApIHtcbiAgICAgICAgICAgIF9hZGRBdHRyaWJ1dGUoZWxlbSwgb3B0aW9ucy5hdHRyaWJ1dGVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBlbGVtO1xuICAgIH1cblxuICAgIC8vIGFwcGVuZENoaWxkcmVuIG1ldGhvZCAtIGFwcGVuZHMgYW4gYXJyYXkgb2YgY2hpbGRyZW4gdG8gdGhlIHBhcmVudCBub2RlIGluIHRoZSBwcm92aWRlZCBvcmRlclxuICAgIGZ1bmN0aW9uIGFwcGVuZENoaWxkcmVuKHBhcmVudCwgY2hpbGRyZW4pIHtcbiAgICAgICAgY2hpbGRyZW4uZm9yRWFjaChjaGlsZCA9PiB7XG4gICAgICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQoY2hpbGQpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHBhcmVudDtcbiAgICB9XG5cbiAgICAvLyBDbGVhciBcbiAgICByZXR1cm4ge1xuICAgICAgICBjcmVhdGUsXG4gICAgICAgIGFwcGVuZENoaWxkcmVuLFxuICAgIH07XG59KSgpO1xuXG5leHBvcnQgeyBkb21VdGlsIH07IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgeyB2aWV3Q29udHJvbGxlciB9IGZyb20gJy4vbW9kdWxlcy92aWV3Q29udHJvbGxlci5qcyc7XG5pbXBvcnQgeyBldmVudHMgfSBmcm9tICcuL21vZHVsZXMvZXZlbnRzLmpzJztcbmltcG9ydCB7IHN0b3JhZ2UgfSBmcm9tICcuL21vZHVsZXMvc3RvcmFnZS5qcyc7XG5pbXBvcnQgeyBhcHAgfSBmcm9tICcuL21vZHVsZXMvYXBwLmpzJztcblxuLy8gVEVNUE9SQVJZIHByb2plY3RzIGFycmF5IHRoYXQgd2lsbCBzdGFuZCBpbiBmb3IgbG9jYWxTdG9yYWdlIHRvIHJlaHlkcmF0ZSBpbnRvIGFwcHJvcHJpYXRlIG9iamVjdHMgd2l0aCBwcm90b3R5cGVzXG5jb25zdCBwcm9qZWN0cyA9IFtcbiAgICB7XG4gICAgICAgIG5hbWU6ICdGb29kIFByb2plY3QnLFxuICAgICAgICB0b2RvczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRpdGxlOiAnRWF0IHNvbWUgcGl6emEnLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnRWF0IHNvbWUgcGl6emEgd2l0aCBnYXJsaWMgc2F1Y2UnLFxuICAgICAgICAgICAgICAgIGR1ZURhdGU6ICcyMDEyLTEwLTIyJyxcbiAgICAgICAgICAgICAgICBwcmlvcml0eTogJ2hpZ2gnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRpdGxlOiAnRWF0IHNvbWUgY2hpY2tlbiB3aW5ncycsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdFYXQgc29tZSBjaGlja2VuIHdpbmdzIHdpdGggcmFuY2gnLFxuICAgICAgICAgICAgICAgIGR1ZURhdGU6ICcyMDE4LTAzLTE0JyxcbiAgICAgICAgICAgICAgICBwcmlvcml0eTogJ21pZCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnR3VpdGFyIFByb2plY3QnLFxuICAgICAgICB0b2RvczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRpdGxlOiAnUHJhY3RpY2UgU3RhaXJ3YXkgdG8gSGVhdmVuJyxcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ1ByYWN0aWNlIHRoZSBjaG9ydXMgb2YgU3RhaXJ3YXkgdG8gSGVhdmVuJyxcbiAgICAgICAgICAgICAgICBkdWVEYXRlOiAnMjAyMS0wNS0xOCcsXG4gICAgICAgICAgICAgICAgcHJpb3JpdHk6ICdsb3cnXG4gICAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICB9XG5dO1xuXG4vLyBJbml0aWFsaXplIHZpZXdDb250cm9sbGVyLCBldmVudHMsIGFuZCBzdG9yYWdlIG1vZHVsZXNcbnZpZXdDb250cm9sbGVyLmluaXQoKTtcbmV2ZW50cy5pbml0KCk7XG5zdG9yYWdlLmluaXQoKTtcblxuLy8gSW5pdGlhbGl6ZSBhcHBsaWNhdGlvblxuYXBwLmluaXQocHJvamVjdHMpOyJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==