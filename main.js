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

        // Return out if last project is attempted to be deleted
        if (_projects.length === 1) {
            _pubSub_js__WEBPACK_IMPORTED_MODULE_2__.pubSub.publish('invalidProjectDeletion', 'Projects list cannnot be empty');
            return;
        }
        
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
        _pubSub_js__WEBPACK_IMPORTED_MODULE_0__.pubSub.subscribe('projectsChange', _save);
        _pubSub_js__WEBPACK_IMPORTED_MODULE_0__.pubSub.subscribe('todosChange', _save);
        _pubSub_js__WEBPACK_IMPORTED_MODULE_0__.pubSub.subscribe('activeProjectChange', _save);
        return;
    }

    return {
        init,
        load
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
        _pubSub_js__WEBPACK_IMPORTED_MODULE_4__.pubSub.subscribe('invalidProjectDeletion', _showAlert);
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





// Retrieve projects from localStorage
const projects = _modules_storage_js__WEBPACK_IMPORTED_MODULE_2__.storage.load();

// Initialize viewController, events, and storage modules
_modules_viewController_js__WEBPACK_IMPORTED_MODULE_0__.viewController.init();
_modules_events_js__WEBPACK_IMPORTED_MODULE_1__.events.init();
_modules_storage_js__WEBPACK_IMPORTED_MODULE_2__.storage.init();

// Initialize application
_modules_app_js__WEBPACK_IMPORTED_MODULE_3__.app.init(projects);
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7Ozs7Ozs7O1VDL0VEO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7Ozs7QUNONkQ7QUFDaEI7QUFDRTtBQUNSOztBQUV2QztBQUNBLGlCQUFpQiw2REFBWTs7QUFFN0I7QUFDQSwyRUFBbUI7QUFDbkIsMkRBQVc7QUFDWCw2REFBWTs7QUFFWjtBQUNBLHFEQUFRLFciLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9zcmMvZmFjdG9yeV9mdW5jdGlvbnMvcHJvamVjdC5qcyIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9zcmMvZmFjdG9yeV9mdW5jdGlvbnMvdG9kby5qcyIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9zcmMvbW9kdWxlcy9hcHAuanMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vc3JjL21vZHVsZXMvZXZlbnRzLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL3NyYy9tb2R1bGVzL3B1YlN1Yi5qcyIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9zcmMvbW9kdWxlcy9zdG9yYWdlLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL3NyYy9tb2R1bGVzL3ZpZXdDb250cm9sbGVyLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL3NyYy92aWV3cy9uZXdUb2RvU2VjdGlvbi5qcyIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9zcmMvdmlld3Mvc2lkZWJhci5qcyIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9zcmMvdmlld3MvdGl0bGUuanMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vc3JjL3ZpZXdzL3RvZG9Gb3JtLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL3NyYy92aWV3cy90b2RvSXRlbXMuanMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vc3JjL3ZpZXdzL3V0aWwuanMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3RvZG8tbGlzdC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0L3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vdG9kby1saXN0L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIHByb2plY3QgcHJvdG90eXBlXG5jb25zdCBwcm9qZWN0UHJvdG8gPSB7XG4gICAgZmluZEluZGV4QnlUaXRsZTogZnVuY3Rpb24odG9kb1RpdGxlKSB7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy50b2Rvcy5maW5kSW5kZXgodG9kbyA9PiB7XG4gICAgICAgICAgICByZXR1cm4gdG9kby50aXRsZSA9PT0gdG9kb1RpdGxlO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGluZGV4O1xuICAgIH0sXG4gICAgYWRkVG9kbzogZnVuY3Rpb24obmV3VG9kbykge1xuICAgICAgICB0aGlzLnRvZG9zLnB1c2gobmV3VG9kbyk7XG4gICAgfSxcbiAgICBkZWxldGVUb2RvOiBmdW5jdGlvbih0b2RvVGl0bGUpIHtcbiAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLmZpbmRJbmRleEJ5VGl0bGUodG9kb1RpdGxlKTtcbiAgICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgICAgICAgdGhpcy50b2Rvcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBkZWxldGVBY3RpdmVUb2RvOiBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLmZpbmRJbmRleEJ5VGl0bGUodGhpcy5hY3RpdmVUb2RvLnRpdGxlKTtcbiAgICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgICAgICAgdGhpcy5hY3RpdmVUb2RvID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMudG9kb3Muc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgc2V0QWN0aXZlVG9kbzogZnVuY3Rpb24odG9kb1RpdGxlKSB7XG4gICAgICAgIC8vIElmIHNldEFjdGl2ZVRvZG8gaXMgY2FsbGVkIHdpdGggbm8gYXJndW1lbnRzLCBzZXQgYWN0aXZlVG9kbyB0byBudWxsXG4gICAgICAgIGlmICh0b2RvVGl0bGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5hY3RpdmVUb2RvID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5maW5kSW5kZXhCeVRpdGxlKHRvZG9UaXRsZSk7XG4gICAgICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlVG9kbyA9IHRoaXMudG9kb3NbaW5kZXhdO1xuICAgICAgICB9XG4gICAgfVxufTtcblxuLy8gcHJvamVjdCBmYWN0b3J5IGZ1bmN0aW9uXG5mdW5jdGlvbiBwcm9qZWN0KG5hbWUpIHtcbiAgICBjb25zdCB0b2RvcyA9IFtdO1xuICAgIGxldCBhY3RpdmVUb2RvID0gbnVsbDtcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKHByb2plY3RQcm90byksIHtcbiAgICAgICAgbmFtZSxcbiAgICAgICAgYWN0aXZlVG9kbyxcbiAgICAgICAgdG9kb3NcbiAgICB9KTtcbn1cblxuZXhwb3J0IHsgcHJvamVjdCB9OyIsIi8vIHRvZG8gcHJvdG90eXBlXG5jb25zdCB0b2RvUHJvdG8gPSB7XG4gICAgY2hhbmdlVGl0bGU6IGZ1bmN0aW9uKG5ld1RpdGxlKSB7XG4gICAgICAgIHRoaXMudGl0bGUgPSBuZXdUaXRsZTtcbiAgICB9LFxuICAgIGNoYW5nZURlc2NyaXB0aW9uOiBmdW5jdGlvbihuZXdEZXNjcmlwdGlvbikge1xuICAgICAgICB0aGlzLmRlc2NyaXB0aW9uID0gbmV3RGVzY3JpcHRpb247XG4gICAgfSwgICAgXG4gICAgY2hhbmdlRHVlRGF0ZTogZnVuY3Rpb24obmV3RHVlRGF0ZSkge1xuICAgICAgICB0aGlzLmR1ZURhdGUgPSBuZXdEdWVEYXRlO1xuICAgIH0sXG4gICAgY2hhbmdlUHJpb3JpdHk6IGZ1bmN0aW9uKG5ld1ByaW9yaXR5KSB7XG4gICAgICAgIHRoaXMucHJpb3JpdHkgPSBuZXdQcmlvcml0eTtcbiAgICB9LFxuICAgIHRvZ2dsZUNvbXBsZXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5jb21wbGV0ZSA9ICF0aGlzLmNvbXBsZXRlO1xuICAgIH0sXG4gICAgdXBkYXRlOiBmdW5jdGlvbihuZXdUaXRsZSwgbmV3RGVzY3JpcHRpb24sIG5ld0R1ZURhdGUsIG5ld1ByaW9yaXR5KSB7XG4gICAgICAgIHRoaXMuY2hhbmdlVGl0bGUobmV3VGl0bGUpO1xuICAgICAgICB0aGlzLmNoYW5nZURlc2NyaXB0aW9uKG5ld0Rlc2NyaXB0aW9uKTtcbiAgICAgICAgdGhpcy5jaGFuZ2VEdWVEYXRlKG5ld0R1ZURhdGUpO1xuICAgICAgICB0aGlzLmNoYW5nZVByaW9yaXR5KG5ld1ByaW9yaXR5KTtcbiAgICB9XG59O1xuXG4vLyB0b2RvIGZhY3RvcnkgZnVuY3Rpb25cbmZ1bmN0aW9uIHRvZG8odGl0bGUsIGRlc2NyaXB0aW9uLCBkdWVEYXRlLCBwcmlvcml0eSkge1xuICAgIHJldHVybiBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUodG9kb1Byb3RvKSwge1xuICAgICAgICB0aXRsZSxcbiAgICAgICAgZGVzY3JpcHRpb24sXG4gICAgICAgIGR1ZURhdGUsXG4gICAgICAgIHByaW9yaXR5LFxuICAgICAgICBjb21wbGV0ZTogZmFsc2VcbiAgICB9KTtcbn1cblxuZXhwb3J0IHsgdG9kbyB9OyIsImltcG9ydCB7IHRvZG8gfSBmcm9tICcuLi9mYWN0b3J5X2Z1bmN0aW9ucy90b2RvLmpzJztcbmltcG9ydCB7IHByb2plY3QgfSBmcm9tICcuLi9mYWN0b3J5X2Z1bmN0aW9ucy9wcm9qZWN0LmpzJztcbmltcG9ydCB7IHB1YlN1YiB9IGZyb20gJy4vcHViU3ViLmpzJztcblxuLy8gYXBwIG1vZHVsZSBjb250YWlucyB0b2RvIGxpc3QgYXBwbGljYXRpb24gZGF0YSBhbmQgZnVuY3Rpb25hbGl0eVxuY29uc3QgYXBwID0gKGZ1bmN0aW9uKCkge1xuICAgIGxldCBfcHJvamVjdHMgPSBbXTtcbiAgICBsZXQgX2FjdGl2ZVByb2plY3Q7XG5cbiAgICAvLyBfZ2V0U3RhdGVEYXRhIGZ1bmN0aW9uIC0gYnVuZGxlcyBhcHAgc3RhdGUgZGF0YSAoX3Byb2plY3RzIGFuZCBfYWN0aXZlUHJvamVjdCkgZm9yIHB1Ymxpc2hpbmcgdGhyb3VnaCBwdWJTdWJcbiAgICBmdW5jdGlvbiBfZ2V0U3RhdGVEYXRhKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcHJvamVjdHM6IF9wcm9qZWN0cyxcbiAgICAgICAgICAgIGFjdGl2ZVByb2plY3Q6IF9hY3RpdmVQcm9qZWN0LFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8vIF9nZXRQcm9qZWN0RnJvbU5hbWUgZnVuY3Rpb24gLSBvYnRhaW5zIHRoZSBwcm9qZWN0IG9iamVjdCB3aXRoIGEgbWF0Y2hpbmcgcHJvamVjdCBuYW1lXG4gICAgZnVuY3Rpb24gX2dldFByb2plY3RGcm9tTmFtZShwcm9qZWN0TmFtZSkge1xuICAgICAgICBjb25zdCBwcm9qZWN0ID0gX3Byb2plY3RzLmZpbmQocHJvamVjdCA9PiB7XG4gICAgICAgICAgICByZXR1cm4gcHJvamVjdC5uYW1lID09PSBwcm9qZWN0TmFtZTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBwcm9qZWN0O1xuICAgIH1cblxuICAgIC8vIF9nZXRQcm9qZWN0SW5kZXhGcm9tTmFtZSAtIG9idGFpbnMgdGhlIGluZGV4IG9mIHRoZSBwcm9qZWN0IHdpdGggdGhlIHNwZWNpZmllZCBuYW1lIHdpdGhpbiB0aGUgX3Byb2plY3RzIGFycmF5XG4gICAgZnVuY3Rpb24gX2dldFByb2plY3RJbmRleEZyb21OYW1lKHByb2plY3ROYW1lKSB7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gX3Byb2plY3RzLmZpbmRJbmRleChwcm9qZWN0ID0+IHtcbiAgICAgICAgICAgIHJldHVybiBwcm9qZWN0Lm5hbWUgPT09IHByb2plY3ROYW1lO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGluZGV4O1xuICAgIH1cblxuICAgIC8vIF9pc1ZhbGlkUHJvamVjdE5hbWUgZnVuY3Rpb24gLSByZXR1cm5zIHRydWUgaWYgcHJvamVjdCBoYXMgYSB1bmlxdWUgbmFtZVxuICAgIGZ1bmN0aW9uIF9pc1ZhbGlkUHJvamVjdE5hbWUobmFtZSkge1xuICAgICAgICBjb25zdCBwcm9qZWN0TmFtZXMgPSBfcHJvamVjdHMubWFwKHByb2plY3QgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHByb2plY3QubmFtZTtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChwcm9qZWN0TmFtZXMuaW5jbHVkZXMobmFtZSkpIHtcbiAgICAgICAgICAgIHB1YlN1Yi5wdWJsaXNoKCdpbnZhbGlkUHJvamVjdE5hbWUnLCAnUGxlYXNlIGVudGVyIGEgdW5pcXVlIHByb2plY3QgbmFtZScpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBfaXNVbmlxdWVUb2RvVGl0bGUgZnVuY3Rpb24gLSBSZXR1cm5zIHRydWUgaWYgdG9kbyBoYXMgYSB2YWxpZCB1bmlxdWUgbmFtZVxuICAgIGZ1bmN0aW9uIF9pc1VuaXF1ZVRvZG9UaXRsZSh0aXRsZSwgaXNVcGRhdGUpIHtcbiAgICAgICAgY29uc3QgdG9kb1RpdGxlcyA9IF9hY3RpdmVQcm9qZWN0LnRvZG9zLm1hcCh0b2RvID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0b2RvLnRpdGxlO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAodG9kb1RpdGxlcy5pbmNsdWRlcyh0aXRsZSkpIHtcbiAgICAgICAgICAgIC8vIElmIHRoaXMgY2hlY2sgaXMgcGVyZm9ybWVkIGZvciBhIHRvZG8gdXBkYXRlLCB0aGUgdGl0bGUgbWF5IGJlIHRoZSBzYW1lIGFzIHRoZSBhY3RpdmVUb2RvIG9mIHRoZSBhY3RpdmUgcHJvamVjdFxuICAgICAgICAgICAgaWYgKGlzVXBkYXRlKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgYWN0aXZlVG9kb1RpdGxlID0gX2FjdGl2ZVByb2plY3QuYWN0aXZlVG9kby50aXRsZTtcbiAgICAgICAgICAgICAgICBpZiAoYWN0aXZlVG9kb1RpdGxlID09PSB0aXRsZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIF9pc1ZhbGlkVG9kbyBmdW5jdGlvbiAtIHZhbGlkYXRlcyB0aGUgQWRkIE5ldyBUb2RvIGZvcm0gdmFsdWVzIGFuZCB1cGRhdGVzIHRvIGV4aXN0aW5nIHRvZG9zXG4gICAgZnVuY3Rpb24gX2lzVmFsaWRUb2RvKHRpdGxlLCBkZXNjcmlwdGlvbiwgZHVlRGF0ZSwgcHJpb3JpdHksIGlzVXBkYXRlKSB7XG4gICAgICAgIC8vIFRpdGxlLCBkZXNjcmlwdGlvbiwgZHVlRGF0ZSwgYW5kIHByaW9yaXR5IGZpZWxkcyBtdXN0IGFsbCBiZSBmaWxsZWQgaW5cbiAgICAgICAgbGV0IGFsZXJ0TWVzc2FnZTtcbiAgICAgICAgaWYgKCFfaXNVbmlxdWVUb2RvVGl0bGUodGl0bGUsIGlzVXBkYXRlKSkge1xuICAgICAgICAgICAgYWxlcnRNZXNzYWdlID0gJ1RvZG8gdGl0bGUgbXVzdCBiZSB1bmlxdWUnO1xuICAgICAgICB9IGVsc2UgaWYgKHRpdGxlID09PSB1bmRlZmluZWQgfHwgdGl0bGUgPT09ICcnKSB7XG4gICAgICAgICAgICBhbGVydE1lc3NhZ2UgPSAnUGxlYXNlIGVudGVyIGEgdG9kbyB0aXRsZSc7XG4gICAgICAgIH0gZWxzZSBpZiAoZGVzY3JpcHRpb24gPT09IHVuZGVmaW5lZCB8fCBkZXNjcmlwdGlvbiA9PT0gJycpIHtcbiAgICAgICAgICAgIGFsZXJ0TWVzc2FnZSA9ICdQbGVhc2UgZW50ZXIgYSB0b2RvIGRlc2NyaXB0aW9uJztcbiAgICAgICAgfSBlbHNlIGlmIChkdWVEYXRlID09PSB1bmRlZmluZWQgfHwgZHVlRGF0ZSA9PT0gJycpIHtcbiAgICAgICAgICAgIGFsZXJ0TWVzc2FnZSA9ICdQbGVhc2UgZW50ZXIgYSB0b2RvIGR1ZSBkYXRlJztcbiAgICAgICAgfSBlbHNlIGlmIChwcmlvcml0eSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgYWxlcnRNZXNzYWdlID0gJ1BsZWFzZSBzZWxlY3QgYSB0b2RvIHByaW9yaXR5JztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHB1YlN1Yi5wdWJsaXNoKCdpbnZhbGlkVG9kb0ZpZWxkcycsIGFsZXJ0TWVzc2FnZSk7XG4gICAgfVxuICAgIFxuICAgIC8vIGdldFByb2plY3RzIGZ1bmN0aW9ucyAtIHJldHVybnMgYW4gYXJyYXkgb2YgYXBwIHByb2plY3RzXG4gICAgZnVuY3Rpb24gZ2V0UHJvamVjdHMoKSB7XG4gICAgICAgIHJldHVybiBfcHJvamVjdHM7XG4gICAgfVxuXG4gICAgLy8gZ2V0QWN0aXZlUHJvamVjdCBmdW5jdGlvbiAtIHJldHVybnMgdGhlIGN1cnJlbnQgYWN0aXZlIHByb2plY3RcbiAgICBmdW5jdGlvbiBnZXRBY3RpdmVQcm9qZWN0KCkge1xuICAgICAgICByZXR1cm4gX2FjdGl2ZVByb2plY3Q7XG4gICAgfVxuXG4gICAgLy8gY2hhbmdlQWN0aXZlUHJvamVjdCBmdW5jdGlvbiAtIGNoYW5nZXMgdGhlIGFjdGl2ZSBhcHBsaWNhdGlvbiBwcm9qZWN0XG4gICAgZnVuY3Rpb24gY2hhbmdlQWN0aXZlUHJvamVjdChwcm9qZWN0TmFtZSkge1xuICAgICAgICBjb25zdCBwcm9qZWN0ID0gX2dldFByb2plY3RGcm9tTmFtZShwcm9qZWN0TmFtZSk7XG4gICAgICAgIF9hY3RpdmVQcm9qZWN0ID0gcHJvamVjdDtcbiAgICAgICAgcHViU3ViLnB1Ymxpc2goJ2FjdGl2ZVByb2plY3RDaGFuZ2UnLCBfZ2V0U3RhdGVEYXRhKCkpO1xuICAgIH1cblxuICAgIC8vIGFkZFByb2plY3QgZnVuY3Rpb24gLSBhZGRzIGEgbmV3IHByb2plY3QgdG8gdGhlIF9wcm9qZWN0cyBhcnJheVxuICAgIGZ1bmN0aW9uIGFkZFByb2plY3QocHJvamVjdE5hbWUpIHtcbiAgICAgICAgaWYgKCFfaXNWYWxpZFByb2plY3ROYW1lKHByb2plY3ROYW1lKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG5ld1Byb2plY3QgPSBwcm9qZWN0KHByb2plY3ROYW1lKTtcbiAgICAgICAgX3Byb2plY3RzLnB1c2gobmV3UHJvamVjdCk7XG4gICAgICAgIHB1YlN1Yi5wdWJsaXNoKCdwcm9qZWN0c0NoYW5nZScsIF9nZXRTdGF0ZURhdGEoKSk7XG4gICAgfVxuXG4gICAgLy8gZGVsZXRlUHJvamVjdCBmdW5jdGlvbiAtIGRlbGV0ZXMgdGhlIHByb2plY3Qgd2l0aCB0aGUgc3BlY2lmaWVkIG5hbWUgZnJvbSBfcHJvamVjdHMgYXJyYXlcbiAgICBmdW5jdGlvbiBkZWxldGVQcm9qZWN0KHByb2plY3ROYW1lKSB7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gX2dldFByb2plY3RJbmRleEZyb21OYW1lKHByb2plY3ROYW1lKTtcblxuICAgICAgICAvLyBSZXR1cm4gb3V0IGlmIGxhc3QgcHJvamVjdCBpcyBhdHRlbXB0ZWQgdG8gYmUgZGVsZXRlZFxuICAgICAgICBpZiAoX3Byb2plY3RzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgcHViU3ViLnB1Ymxpc2goJ2ludmFsaWRQcm9qZWN0RGVsZXRpb24nLCAnUHJvamVjdHMgbGlzdCBjYW5ubm90IGJlIGVtcHR5Jyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIC8vIElmIHRoZSBkZWxldGVkIHByb2plY3QgaXMgdGhlIGFjdGl2ZSBwcm9qZWN0LCBzZXQgdGhlIGFjdGl2ZSBwcm9qZWN0IHRvIHRoZSBmaXJzdCBpdGVtIGluIHRoZSBwcm9qZWN0cyBsaXN0XG4gICAgICAgIGxldCBhY3RpdmVQcm9qZWN0RGVsZXRlZDtcbiAgICAgICAgaWYgKF9hY3RpdmVQcm9qZWN0Lm5hbWUgPT09IHByb2plY3ROYW1lKSB7XG4gICAgICAgICAgICBhY3RpdmVQcm9qZWN0RGVsZXRlZCA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBfcHJvamVjdHMuc3BsaWNlKGluZGV4LCAxKTtcblxuICAgICAgICAvLyBTZXQgYSBuZXcgYWN0aXZlIHByb2plY3QgaWYgdGhlIGFjdGl2ZSBwcm9qZWN0IHdhcyBkZWxldGVkXG4gICAgICAgIGlmIChhY3RpdmVQcm9qZWN0RGVsZXRlZCkge1xuICAgICAgICAgICAgY29uc3QgbmV3QWN0aXZlUHJvamVjdE5hbWUgPSBfcHJvamVjdHNbMF0ubmFtZTtcbiAgICAgICAgICAgIGNoYW5nZUFjdGl2ZVByb2plY3QobmV3QWN0aXZlUHJvamVjdE5hbWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcHViU3ViLnB1Ymxpc2goJ3Byb2plY3RzQ2hhbmdlJywgX2dldFN0YXRlRGF0YSgpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIGFkZFRvZG8gZnVuY3Rpb24gLSBhZGRzIGEgdG9kbyBpdGVtIHRvIHRoZSBhY3RpdmVQcm9qZWN0XG4gICAgZnVuY3Rpb24gYWRkVG9kbyh0aXRsZSwgZGVzY3JpcHRpb24sIGR1ZURhdGUsIHByaW9yaXR5KSB7XG4gICAgICAgIGlmICghX2lzVmFsaWRUb2RvKHRpdGxlLCBkZXNjcmlwdGlvbiwgZHVlRGF0ZSwgcHJpb3JpdHksIGZhbHNlKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAvLyBDcmVhdGUgdG9kbyBpdGVtXG4gICAgICAgIGNvbnN0IHRvZG9JdGVtID0gdG9kbyh0aXRsZSwgZGVzY3JpcHRpb24sIGR1ZURhdGUsIHByaW9yaXR5KTtcblxuICAgICAgICAvLyBBcHBlbmQgdG9kbyBpdGVtIHRvIGFjdGl2ZVByb2plY3QgdG9kb3MgYXJyYXlcbiAgICAgICAgX2FjdGl2ZVByb2plY3QuYWRkVG9kbyh0b2RvSXRlbSk7XG5cbiAgICAgICAgcHViU3ViLnB1Ymxpc2goJ3RvZG9zQ2hhbmdlJywgX2dldFN0YXRlRGF0YSgpKTtcbiAgICB9XG5cbiAgICAvLyBjaGFuZ2VUb2RvIGZ1bmN0aW9uIC0gbW9kaWZpZXMgYWN0aXZlIHRvZG8gaXRlbSBvZiBhY3RpdmVwcm9qZWN0IHRvIHNwZWNpZmllZCBwYXJhbWV0ZXJzXG4gICAgZnVuY3Rpb24gY2hhbmdlVG9kbyhuZXdUaXRsZSwgbmV3RGVzY3JpcHRpb24sIG5ld0R1ZURhdGUsIG5ld1ByaW9yaXR5KSB7XG4gICAgICAgIGlmICghX2lzVmFsaWRUb2RvKG5ld1RpdGxlLCBuZXdEZXNjcmlwdGlvbiwgbmV3RHVlRGF0ZSwgbmV3UHJpb3JpdHksIHRydWUpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgYWN0aXZlVG9kbyA9IF9hY3RpdmVQcm9qZWN0LmFjdGl2ZVRvZG87XG4gICAgICAgIGFjdGl2ZVRvZG8udXBkYXRlKG5ld1RpdGxlLCBuZXdEZXNjcmlwdGlvbiwgbmV3RHVlRGF0ZSwgbmV3UHJpb3JpdHkpO1xuICAgICAgICAvLyBSZXNldCB0aGUgcHJvamVjdCBhY3RpdmUgdG9kbyB0byBudWxsIFxuICAgICAgICBfYWN0aXZlUHJvamVjdC5zZXRBY3RpdmVUb2RvKCk7XG5cbiAgICAgICAgcHViU3ViLnB1Ymxpc2goJ3RvZG9zQ2hhbmdlJywgX2dldFN0YXRlRGF0YSgpKTtcbiAgICB9XG5cbiAgICAvLyBjaGFuZ2VBY3RpdmVUb2RvIGZ1bmN0aW9uIC0gY2hhbmdlcyB0aGUgYWN0aXZlIHRvZG8gaXRlbSBmb3IgdGhlIGN1cnJlbnQgcHJvamVjdFxuICAgIGZ1bmN0aW9uIGNoYW5nZUFjdGl2ZVRvZG8odG9kb1RpdGxlKSB7XG4gICAgICAgIF9hY3RpdmVQcm9qZWN0LnNldEFjdGl2ZVRvZG8odG9kb1RpdGxlKTtcbiAgICAgICAgcHViU3ViLnB1Ymxpc2goJ3RvZG9zQ2hhbmdlJywgX2dldFN0YXRlRGF0YSgpKTtcbiAgICB9XG5cbiAgICAvLyBkZWxldGVUb2RvIGZ1bmN0aW9uIC0gZGVsZXRlcyB0aGUgYWN0aXZlIHRvZG8gaXRlbSBmcm9tIHRoZSBhY3RpdmVQcm9qZWN0XG4gICAgZnVuY3Rpb24gZGVsZXRlQWN0aXZlVG9kbygpIHtcbiAgICAgICAgX2FjdGl2ZVByb2plY3QuZGVsZXRlQWN0aXZlVG9kbygpO1xuICAgICAgICBwdWJTdWIucHVibGlzaCgndG9kb3NDaGFuZ2UnLCBfZ2V0U3RhdGVEYXRhKCkpO1xuICAgIH1cblxuICAgIC8vIHRvZ2dsZVRvZG9Db21wbGV0ZSBmdW5jdGlvbiAtIHRvZ2dsZXMgdGhlIGFjdGl2ZSB0b2RvIGl0ZW1zIGNvbXBsZXRlIHN0YXR1c1xuICAgIGZ1bmN0aW9uIHRvZ2dsZVRvZG9Db21wbGV0ZSgpIHtcbiAgICAgICAgX2FjdGl2ZVByb2plY3QuYWN0aXZlVG9kby50b2dnbGVDb21wbGV0ZSgpO1xuICAgICAgICBwdWJTdWIucHVibGlzaCgndG9kb3NDaGFuZ2UnLCBfZ2V0U3RhdGVEYXRhKCkpO1xuICAgIH1cblxuICAgIC8vIGluaXQgZnVuY3Rpb24gLSBpbml0aWFsaXplcyB0aGUgYXBwbGljYXRpb24gd2l0aCB0aGUgZ2l2ZW4gcHJvamVjdHMgYXJyYXkgZnJvbSBsb2NhbFN0b3JhZ2VcbiAgICBmdW5jdGlvbiBpbml0KHByb2plY3RzKSB7XG4gICAgICAgIC8vIENvbnZlcnQgbG9jYWxTdG9yYWdlIHByb2plY3RzIGFycmF5IHRvIG9iamVjdHMgd2l0aCBwcm90b3R5cGUgbWV0aG9kcyB1c2luZyBmYWN0b3J5IGZ1bmN0aW9uc1xuICAgICAgICBwcm9qZWN0cy5mb3JFYWNoKHByb2plY3RPYmogPT4ge1xuICAgICAgICAgICAgLy8gQ3JlYXRlIGEgbmV3IHByb2plY3RcbiAgICAgICAgICAgIGNvbnN0IG5ld1Byb2plY3QgPSBwcm9qZWN0KHByb2plY3RPYmoubmFtZSk7XG5cbiAgICAgICAgICAgIC8vIEFkZCBlYWNoIHRvZG8gdG8gdGhlIGNvcnJlc3BvbmRpbmcgcHJvamVjdFxuICAgICAgICAgICAgcHJvamVjdE9iai50b2Rvcy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRvZG9JdGVtID0gdG9kbyhpdGVtLnRpdGxlLCBpdGVtLmRlc2NyaXB0aW9uLCBpdGVtLmR1ZURhdGUsIGl0ZW0ucHJpb3JpdHkpO1xuICAgICAgICAgICAgICAgIG5ld1Byb2plY3QuYWRkVG9kbyh0b2RvSXRlbSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gQWRkIHByb2plY3QgdG8gX3Byb2plY3RzIGFycmF5XG4gICAgICAgICAgICBfcHJvamVjdHMucHVzaChuZXdQcm9qZWN0KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gU2V0IHRoZSBhY3RpdmUgcHJvamVjdCB0byB0aGUgZmlyc3QgaXRlbSBpbiB0aGUgYXJyYXlcbiAgICAgICAgX2FjdGl2ZVByb2plY3QgPSBfcHJvamVjdHNbMF07XG5cbiAgICAgICAgLy8gUHVibGlzaCAnaW5pdGlhbGl6ZScgZXZlbnRcbiAgICAgICAgcHViU3ViLnB1Ymxpc2goJ2FwcEluaXQnLCBfZ2V0U3RhdGVEYXRhKCkpO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIGdldFByb2plY3RzLFxuICAgICAgICBnZXRBY3RpdmVQcm9qZWN0LFxuICAgICAgICBjaGFuZ2VBY3RpdmVQcm9qZWN0LFxuICAgICAgICBhZGRQcm9qZWN0LFxuICAgICAgICBkZWxldGVQcm9qZWN0LFxuICAgICAgICBhZGRUb2RvLFxuICAgICAgICBjaGFuZ2VUb2RvLFxuICAgICAgICBjaGFuZ2VBY3RpdmVUb2RvLFxuICAgICAgICBkZWxldGVBY3RpdmVUb2RvLFxuICAgICAgICB0b2dnbGVUb2RvQ29tcGxldGUsXG4gICAgICAgIGluaXRcbiAgICB9O1xufSkoKTtcblxuZXhwb3J0IHsgYXBwIH07IiwiaW1wb3J0IHsgcHViU3ViIH0gZnJvbSAnLi9wdWJTdWIuanMnO1xuaW1wb3J0IHsgYXBwIH0gZnJvbSAnLi9hcHAuanMnO1xuaW1wb3J0IHsgdmlld0NvbnRyb2xsZXIgfSBmcm9tICcuL3ZpZXdDb250cm9sbGVyLmpzJztcblxuLy8gRXZlbnRzIG1vZHVsZSAtIGNvb3JkaW5hdGVzIGV2ZW50IGFkZGl0aW9uL21vZGlmaWNhdGlvbiB0byBkb20gbm9kZXNcbmNvbnN0IGV2ZW50cyA9IChmdW5jdGlvbigpIHtcbiAgICAvKiBFdmVudCBoYW5kbGVyIGZ1bmN0aW9ucyAqL1xuICAgIC8vIF9jcmVhdGVOZXdQcm9qZWN0IGZ1bmN0aW9uIC0gQ3JlYXRlcyBhIG5ldyBwcm9qZWN0XG4gICAgZnVuY3Rpb24gX2NyZWF0ZU5ld1Byb2plY3QoKSB7XG4gICAgICAgIC8vIEV4dHJhY3QgbmV3IHByb2plY3QgbmFtZVxuICAgICAgICBjb25zdCBwcm9qZWN0TmFtZUlucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2FkZC1wcm9qZWN0IGlucHV0Jyk7XG4gICAgICAgIGNvbnN0IHByb2plY3ROYW1lID0gcHJvamVjdE5hbWVJbnB1dC52YWx1ZTtcblxuICAgICAgICAvLyBBZGQgcHJvamVjdCB0byBhcHAgbW9kZWxcbiAgICAgICAgaWYgKHByb2plY3ROYW1lKSB7XG4gICAgICAgICAgICBhcHAuYWRkUHJvamVjdChwcm9qZWN0TmFtZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDbGVhciBwcm9qZWN0IG5hbWUgZmllbGRcbiAgICAgICAgcHJvamVjdE5hbWVJbnB1dC52YWx1ZSA9ICcnO1xuICAgIH1cblxuICAgIC8vIF9zZWxlY3RQcm9qZWN0IGZ1bmN0aW9uIC0gU2V0cyB0aGUgYWN0aXZlIHByb2plY3RcbiAgICBmdW5jdGlvbiBfc2VsZWN0UHJvamVjdChlKSB7XG4gICAgICAgIGNvbnN0IHByb2plY3ROYW1lID0gZS50YXJnZXQucGFyZW50Tm9kZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtbmFtZScpO1xuICAgICAgICBhcHAuY2hhbmdlQWN0aXZlUHJvamVjdChwcm9qZWN0TmFtZSk7XG4gICAgfVxuXG4gICAgLy8gX2RlbGV0ZVByb2plY3QgZnVuY3Rpb24gLSBEZWxldGVzIHRoZSBzZWxlY3RlZCBwcm9qZWN0XG4gICAgZnVuY3Rpb24gX2RlbGV0ZVByb2plY3QoZSkge1xuICAgICAgICBjb25zdCBwcm9qZWN0TmFtZSA9IGUudGFyZ2V0LnBhcmVudE5vZGUuZ2V0QXR0cmlidXRlKCdkYXRhLW5hbWUnKTtcbiAgICAgICAgaWYgKHdpbmRvdy5jb25maXJtKGBBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gZGVsZXRlIHRoZSAke3Byb2plY3ROYW1lfSBwcm9qZWN0P2ApKSB7XG4gICAgICAgICAgICBhcHAuZGVsZXRlUHJvamVjdChwcm9qZWN0TmFtZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBfc2hvd05ld1RvZG9Gb3JtIGZ1bmN0aW9uIC0gU2hvd3MgdGhlIG5ldyB0b2RvIGZvcm0gYW5kIGhpZGVzIHRoZSBcIkFkZCBUb2RvXCIgYnV0dG9uXG4gICAgZnVuY3Rpb24gX3Nob3dOZXdUb2RvRm9ybSgpIHtcbiAgICAgICAgcHViU3ViLnB1Ymxpc2goJ2FjdGl2YXRlTmV3VG9kb0Zvcm0nKTtcbiAgICB9XG5cbiAgICAvLyBfZXhpdE5ld1RvZG9Gb3JtIGZ1bmN0aW9uIC0gSGlkZXMgdGhlIG5ldyB0b2RvIGZvcm0gYW5kIGRpc3BsYXlzIHRoZSBcIkFkZCBUb2RvXCIgYnV0dG9uXG4gICAgZnVuY3Rpb24gX2V4aXROZXdUb2RvRm9ybSgpIHtcbiAgICAgICAgcHViU3ViLnB1Ymxpc2goJ2Rpc2FibGVOZXdUb2RvRm9ybScpO1xuICAgIH1cblxuICAgIC8vIF9hZGROZXdUb2RvIGZ1bmN0aW9uIC0gRXh0cmFjdHMgZm9ybSB2YWx1ZXMgYW5kIGFkZHMgYSBuZXcgdG9kbyB0byB0aGUgYWN0aXZlIHByb2plY3RcbiAgICBmdW5jdGlvbiBfYWRkTmV3VG9kbygpIHtcbiAgICAgICAgLy8gRXh0cmFjdCBmb3JtIHZhbHVlc1xuICAgICAgICBjb25zdCB0aXRsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNuZXctdGl0bGUnKS52YWx1ZTtcbiAgICAgICAgY29uc3QgZGVzY3JpcHRpb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbmV3LWRlc2NyaXB0aW9uJykudmFsdWU7XG4gICAgICAgIGNvbnN0IGR1ZURhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbmV3LWRhdGUnKS52YWx1ZTtcbiAgICAgICAgY29uc3QgcHJpb3JpdHlJbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W25hbWU9XCJuZXctcHJpb3JpdHlcIl06Y2hlY2tlZCcpO1xuICAgICAgICBsZXQgcHJpb3JpdHk7XG4gICAgICAgIGlmIChwcmlvcml0eUlucHV0KSB7XG4gICAgICAgICAgICBwcmlvcml0eSA9IHByaW9yaXR5SW5wdXQudmFsdWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwcmlvcml0eSA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBhcHAuYWRkVG9kbyh0aXRsZSwgZGVzY3JpcHRpb24sIGR1ZURhdGUsIHByaW9yaXR5KTsgXG4gICAgfVxuXG4gICAgLy8gX3NldEFjdGl2ZVRvZG8gZnVuY3Rpb24gLSBTZXRzIGFuIGluYWN0aXZlIHRvZG8gdG8gYWN0aXZlXG4gICAgZnVuY3Rpb24gX3NldEFjdGl2ZVRvZG8oZSkge1xuICAgICAgICBjb25zdCB0b2RvVGl0bGUgPSBlLnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGl0bGUnKTtcbiAgICAgICAgYXBwLmNoYW5nZUFjdGl2ZVRvZG8odG9kb1RpdGxlKTtcbiAgICB9XG5cbiAgICAvLyBfdG9nZ2xlVG9kb0NvbXBsZXRlIGZ1bmN0aW9uIC0gVG9nZ2xlcyB0aGUgYWN0aXZlIHRvZG8ncyBjb21wbGV0aW9uIHN0YXR1c1xuICAgIGZ1bmN0aW9uIF90b2dnbGVUb2RvQ29tcGxldGUoKSB7XG4gICAgICAgIGFwcC50b2dnbGVUb2RvQ29tcGxldGUoKTtcbiAgICB9XG5cbiAgICAvLyBfZGVsZXRlQWN0aXZlVG9kbyBmdW5jdGlvbiAtIERlbGV0ZXMgdGhlIGFjdGl2ZSB0b2RvXG4gICAgZnVuY3Rpb24gX2RlbGV0ZUFjdGl2ZVRvZG8oKSB7XG4gICAgICAgIGlmKHdpbmRvdy5jb25maXJtKCdEbyB5b3Ugd2FudCB0byBkZWxldGUgdGhpcyB0b2RvIGl0ZW0/JykpIHtcbiAgICAgICAgICAgIGFwcC5kZWxldGVBY3RpdmVUb2RvKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBfdXBkYXRlQWN0aXZlVG9kbyBmdW5jdGlvbiAtIFVwZGF0ZXMgdGhlIGFjdGl2ZSB0b2RvIGZ1bmN0aW9uIHdpdGggdXBkYXRlZCBmb3JtIHZhbHVlc1xuICAgIGZ1bmN0aW9uIF91cGRhdGVBY3RpdmVUb2RvKCkge1xuICAgICAgICAvLyBFeHRyYWN0IGZvcm0gdmFsdWVzXG4gICAgICAgIGNvbnN0IG5ld1RpdGxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3VwZGF0ZS10aXRsZScpLnZhbHVlO1xuICAgICAgICBjb25zdCBuZXdEZXNjcmlwdGlvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN1cGRhdGUtZGVzY3JpcHRpb24nKS52YWx1ZTtcbiAgICAgICAgY29uc3QgbmV3RHVlRGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN1cGRhdGUtZGF0ZScpLnZhbHVlO1xuICAgICAgICBjb25zdCBuZXdQcmlvcml0eSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W25hbWU9XCJ1cGRhdGUtcHJpb3JpdHlcIl06Y2hlY2tlZCcpLnZhbHVlO1xuXG4gICAgYXBwLmNoYW5nZVRvZG8obmV3VGl0bGUsIG5ld0Rlc2NyaXB0aW9uLCBuZXdEdWVEYXRlLCBuZXdQcmlvcml0eSk7XG5cbiAgICB9XG5cbiAgICAvKiBFdmVudCBTZXR0aW5nIGZ1bmN0aW9ucyAtIFRoZXNlIGZ1bmN0aW9ucyBhcHBseSBldmVudCBoYW5kbGVycyB0byBET00gZWxlbWVudHMgKi9cblxuICAgIC8vIF9hc3NpZ25OZXdQcm9qZWN0RXZlbnQgZnVuY3Rpb24gLSBBZGRzIGV2ZW50IGhhbmRsZXIgdG8gdGhlIHNpZGViYXIgTmV3IFByb2plY3QgYnV0dG9uXG4gICAgZnVuY3Rpb24gX2Fzc2lnbk5ld1Byb2plY3RFdmVudCgpIHtcbiAgICAgICAgY29uc3QgbmV3UHJvamVjdEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNhZGQtcHJvamVjdC1idG4nKTtcbiAgICAgICAgbmV3UHJvamVjdEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIF9jcmVhdGVOZXdQcm9qZWN0KTtcbiAgICB9XG5cbiAgICAvLyBfYXNzaWduUHJvamVjdEV2ZW50cyBmdW5jdGlvbiAtIEFkZHMgZXZlbnQgaGFuZGxlcnMgdG8gcHJvamVjdCBpdGVtcyBpbiB0aGUgc2lkZWJhclxuICAgIGZ1bmN0aW9uIF9hc3NpZ25Qcm9qZWN0RXZlbnRzKCkge1xuICAgICAgICBjb25zdCBwcm9qZWN0SXRlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucHJvamVjdC1uYW1lJyk7XG4gICAgICAgIHByb2plY3RJdGVtcy5mb3JFYWNoKHByb2plY3QgPT4ge1xuICAgICAgICAgICAgcHJvamVjdC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIF9zZWxlY3RQcm9qZWN0KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gX2Fzc2lnbkRlbFByb2plY3RFdmVudHMgZnVuY3Rpb24gLSBBZGRzIGV2ZW50IGhhbmRsZXJzIHRvIHByb2plY3QgZGVsZXRlIGJ1dHRvbnNcbiAgICBmdW5jdGlvbiBfYXNzaWduRGVsUHJvamVjdEV2ZW50cygpIHtcbiAgICAgICAgY29uc3QgcHJvamVjdERlbEJ1dHRvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuZGVsLXByb2plY3QnKTtcbiAgICAgICAgcHJvamVjdERlbEJ1dHRvbnMuZm9yRWFjaChidXR0b24gPT4ge1xuICAgICAgICAgICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgX2RlbGV0ZVByb2plY3QpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBfYXNzaWduQWRkVG9kb0V2ZW50IGZ1bmN0aW9uIC0gQWRkIGV2ZW50IGhhbmRsZXIgdG8gQWRkIFRvZG8gYnV0dG9uXG4gICAgZnVuY3Rpb24gX2Fzc2lnbkFkZFRvZG9FdmVudCgpIHtcbiAgICAgICAgY29uc3QgYWRkVG9kb0J0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNhZGQtdG9kby1idG4nKTtcbiAgICAgICAgYWRkVG9kb0J0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIF9zaG93TmV3VG9kb0Zvcm0pO1xuICAgIH1cblxuICAgIC8vIF9hc3NpZ25DbG9zZVRvZG9FdmVudCBmdW5jdGlvbiAtIEFkZCBldmVudCBoYW5kbGVyIHRvIGJ1dHRvbiB0aGF0IGNsb3NlcyB0aGUgbmV3IHRvZG8gZm9ybVxuICAgIGZ1bmN0aW9uIF9hc3NpZ25DbG9zZVRvZG9FdmVudCgpIHtcbiAgICAgICAgY29uc3QgY2xvc2VOZXdUb2RvQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2Nsb3NlLW5ldy10b2RvLWZvcm0nKTtcbiAgICAgICAgY2xvc2VOZXdUb2RvQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgX2V4aXROZXdUb2RvRm9ybSk7XG4gICAgfVxuXG4gICAgLy8gX2Fzc2lnblN1Ym1pdFRvZG9FdmVudCBmdW5jdGlvbiAtIEFkZCBldmVudCBoYW5kbGVyIHRvIFwiQWRkXCIgYnV0dG9uIHdoaWNoIHN1Ym1pdHMgY29udGVudCBmcm9tIHRoZSBuZXcgdG9kbyBmb3JtXG4gICAgZnVuY3Rpb24gX2Fzc2lnblN1Ym1pdFRvZG9FdmVudCgpIHtcbiAgICAgICAgY29uc3Qgc3VibWl0VG9kb0J0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzdWJtaXQtdG9kby1idG4nKTtcbiAgICAgICAgc3VibWl0VG9kb0J0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIF9hZGROZXdUb2RvKTtcbiAgICB9XG5cbiAgICAvLyBfYXNzaWduU2V0QWN0aXZlRXZlbnRzIGZ1bmN0aW9uIC0gQWRkcyBldmVudCBoYW5kbGVycyB0byBpbmFjdGl2ZSB0b2RvIGl0ZW1zIG9uIHRoZSBwYWdlXG4gICAgZnVuY3Rpb24gX2Fzc2lnblNldEFjdGl2ZUV2ZW50cygpIHtcbiAgICAgICAgY29uc3QgaW5hY3RpdmVUb2RvcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5pbmFjdGl2ZS10b2RvJyk7XG4gICAgICAgIGluYWN0aXZlVG9kb3MuZm9yRWFjaCh0b2RvID0+IHtcbiAgICAgICAgICAgIHRvZG8uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBfc2V0QWN0aXZlVG9kbyk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIF9hc3NpZ25Ub2dnbGVUb2RvQ29tcGxldGVFdmVudCBmdW5jdGlvbiAtIEFkZHMgZXZlbnQgaGFuZGxlciB0byBidXR0b24gZm9yIHRvZ2dsaW5nIHRvZG8gY29tcGxldGlvblxuICAgIGZ1bmN0aW9uIF9hc3NpZ25Ub2dnbGVUb2RvQ29tcGxldGVFdmVudCgpIHtcbiAgICAgICAgY29uc3QgdG9nZ2xlQ29tcGxldGVCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjdG9nZ2xlLWNvbXBsZXRlJyk7XG4gICAgICAgIGlmICh0b2dnbGVDb21wbGV0ZUJ0biA9PT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRvZ2dsZUNvbXBsZXRlQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgX3RvZ2dsZVRvZG9Db21wbGV0ZSk7XG4gICAgfVxuXG4gICAgLy8gX2Fzc2lnbkRlbGV0ZUFjdGl2ZVRvZG9FdmVudCBmdW5jdGlvbiAtIEFkZHMgZXZlbnQgaGFuZGxlciB0byBidXR0b24gdGhhdCBkZWxldGVzIHRoZSBhY3RpdmUgdG9kb1xuICAgIGZ1bmN0aW9uIF9hc3NpZ25EZWxldGVBY3RpdmVUb2RvRXZlbnQoKSB7XG4gICAgICAgIGNvbnN0IGRlbFRvZG9CdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZGVsLWFjdGl2ZS10b2RvJyk7XG4gICAgICAgIGlmIChkZWxUb2RvQnRuID09PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgZGVsVG9kb0J0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIF9kZWxldGVBY3RpdmVUb2RvKTtcbiAgICB9XG5cbiAgICAvLyBfYXNzaWduVXBkYXRlQWN0aXZlVG9kb0V2ZW50IGZ1bmN0aW9uIC0gQWRkcyBldmVudCBoYW5kbGVyIHRvIHNhdmUgYnV0dG9uIHRoYXQgdXBkYXRlcyBhY3RpdmUgdG9kbyBpbmZvcm1hdGlvblxuICAgIGZ1bmN0aW9uIF9hc3NpZ25VcGRhdGVBY3RpdmVUb2RvRXZlbnQoKSB7XG4gICAgICAgIGNvbnN0IHNhdmVCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc2F2ZS1idG4nKTtcbiAgICAgICAgaWYgKHNhdmVCdG4gPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBzYXZlQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgX3VwZGF0ZUFjdGl2ZVRvZG8pO1xuICAgIH1cblxuICAgIC8vIF9hc3NpZ25TaWRlYmFyRXZlbnRzIHdyYXBwZXIgZnVuY3Rpb24gLSBBZGQgZXZlbnQgaGFuZGxlcnMgdG8gdGhlIFByb2plY3RzIHNpZGUgYmFyXG4gICAgZnVuY3Rpb24gX2Fzc2lnblNpZGViYXJFdmVudHMoKSB7XG4gICAgICAgIF9hc3NpZ25OZXdQcm9qZWN0RXZlbnQoKTtcbiAgICAgICAgX2Fzc2lnblByb2plY3RFdmVudHMoKTtcbiAgICAgICAgX2Fzc2lnbkRlbFByb2plY3RFdmVudHMoKVxuICAgIH1cblxuICAgIC8vIF9hc3NpZ25OZXdUb2RvRXZlbnRzIHdyYXBwZXIgZnVuY3Rpb24gLSBBZGQgZXZlbnQgaGFuZGxlcnMgYXNzb2NpYXRlZCB3aXRoIGFkZGluZyBhIG5ldyB0b2RvXG4gICAgZnVuY3Rpb24gX2Fzc2lnbk5ld1RvZG9FdmVudHMoKSB7XG4gICAgICAgIF9hc3NpZ25BZGRUb2RvRXZlbnQoKTtcbiAgICAgICAgX2Fzc2lnbkNsb3NlVG9kb0V2ZW50KCk7XG4gICAgICAgIF9hc3NpZ25TdWJtaXRUb2RvRXZlbnQoKTtcbiAgICB9XG5cbiAgICAvLyBfYXNzaWduVG9kb0xpc3RFdmVudHMgd3JhcHBlciBmdW5jdGlvbiAtIEFkZCBldmVudCBoYW5kbGVycyB0byBUb2RvIEl0ZW1zIHNlY3Rpb25cbiAgICBmdW5jdGlvbiBfYXNzaWduVG9kb0xpc3RFdmVudHMoKSB7XG4gICAgICAgIF9hc3NpZ25TZXRBY3RpdmVFdmVudHMoKTtcbiAgICAgICAgX2Fzc2lnblRvZ2dsZVRvZG9Db21wbGV0ZUV2ZW50KCk7XG4gICAgICAgIF9hc3NpZ25EZWxldGVBY3RpdmVUb2RvRXZlbnQoKTtcbiAgICAgICAgX2Fzc2lnblVwZGF0ZUFjdGl2ZVRvZG9FdmVudCgpO1xuICAgIH1cbiAgICBcbiAgICAvLyBpbml0IGZ1bmN0aW9uIC0gY3JlYXRlcyBwdWJTdWIgc3Vic2NyaXB0aW9uc1xuICAgIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgICAgIC8vIHB1YlN1Yi5zdWJzY3JpYmUoJ2Z1bGxQYWdlUmVuZGVyJywgX2Fzc2lnbkZ1bGxQYWdlRXZlbnRzKTtcbiAgICAgICAgLy8gT24gcHJvamVjdHNSZW5kZXIsIGFzc2lnbiBldmVudCBoYW5kbGVycyB0byB0aGUgcHJvamVjdHMgc2lkZWJhclxuICAgICAgICBwdWJTdWIuc3Vic2NyaWJlKCdwcm9qZWN0c1JlbmRlcicsIF9hc3NpZ25TaWRlYmFyRXZlbnRzKTtcblxuICAgICAgICAvLyBPbiBuZXdUb2RvQ29udGVudFJlbmRlciwgYXNzaWduIGFzc29jaWF0ZWQgZm9ybSBldmVudCBoYW5kbGVyc1xuICAgICAgICBwdWJTdWIuc3Vic2NyaWJlKCduZXdUb2RvQ29udGVudFJlbmRlcicsIF9hc3NpZ25OZXdUb2RvRXZlbnRzKTtcblxuICAgICAgICAvLyBPbiB0b2Rvc1JlbmRlciwgYXNzaWduIGFzc29jaWF0ZWQgcGFnZSBldmVudCBoYW5kbGVyc1xuICAgICAgICBwdWJTdWIuc3Vic2NyaWJlKCd0b2Rvc1JlbmRlcicsIF9hc3NpZ25Ub2RvTGlzdEV2ZW50cyk7XG5cbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIGluaXRcbiAgICB9O1xufSkoKTtcblxuZXhwb3J0IHsgZXZlbnRzIH07IiwiY29uc3QgcHViU3ViID0ge1xuICAgIGV2ZW50czoge30sXG4gICAgc3Vic2NyaWJlOiBmdW5jdGlvbihldmVudE5hbWUsIGZuKSB7XG4gICAgICAgIHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0gPSB0aGlzLmV2ZW50c1tldmVudE5hbWVdIHx8IFtdO1xuICAgICAgICB0aGlzLmV2ZW50c1tldmVudE5hbWVdLnB1c2goZm4pO1xuICAgIH0sXG4gICAgdW5zdWJzY3JpYmU6IGZ1bmN0aW9uKGV2ZW50TmFtZSwgZm4pIHtcbiAgICAgICAgaWYgKHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0pIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmV2ZW50c1tldmVudE5hbWVdLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5ldmVudHNbZXZlbnROYW1lXVtpXSA9PT0gZm4pIHtcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0uc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHB1Ymxpc2g6IGZ1bmN0aW9uKGV2ZW50TmFtZSwgZGF0YSkge1xuICAgICAgICBpZiAodGhpcy5ldmVudHNbZXZlbnROYW1lXSkge1xuICAgICAgICB0aGlzLmV2ZW50c1tldmVudE5hbWVdLmZvckVhY2goZnVuY3Rpb24oZm4pIHtcbiAgICAgICAgICAgIGZuKGRhdGEpO1xuICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbmV4cG9ydCB7IHB1YlN1YiB9OyIsImltcG9ydCB7IHB1YlN1YiB9IGZyb20gJy4vcHViU3ViLmpzJztcblxuLy8gU3RvcmFnZSBtb2R1bGUgLSBoYW5kbGVzIHN0b3JhZ2UvcmV0cmlldmFsIG9mIGJyb3dzZXIgbG9jYWxTdG9yYWdlIGRhdGFcbmNvbnN0IHN0b3JhZ2UgPSAoZnVuY3Rpb24oKSB7XG4gICAgLy8gRGVmYXVsdCBwcm9qZWN0cyBpbiB0aGUgZXZlbnQgdGhhdCBsb2NhbCBzdG9yYWdlIGlzIG5vdCBhdmFpbGFibGUgb3IgY29udGFpbnMgbm8gZGF0YVxuICAgIGNvbnN0IGRlZmF1bHRQcm9qZWN0cyA9IFtcbiAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogJ1Byb2plY3QgMScsXG4gICAgICAgICAgICB0b2RvczogW11cbiAgICAgICAgfVxuICAgIF07XG4gICAgXG4gICAgLy8gX2lzQXZhaWxhYmxlIC0gQ2hlY2tzIGZvciBicm93c2VyIGxvY2FsIHN0b3JhZ2UgYXZhaWxhYmlsaXR5XG4gICAgZnVuY3Rpb24gX2lzQXZhaWxhYmxlKCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3Qgc3RvcmFnZSA9IHdpbmRvd1snbG9jYWxTdG9yYWdlJ107XG4gICAgICAgICAgICBjb25zdCB4ID0gJ19fc3RvcmFnZV90ZXN0X18nO1xuICAgICAgICAgICAgc3RvcmFnZS5zZXRJdGVtKHgsIHgpO1xuICAgICAgICAgICAgc3RvcmFnZS5yZW1vdmVJdGVtKHgpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gY2F0Y2goZXJyKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgLy8gX3NhdmUgZnVuY3Rpb24gLSBTYXZlcyBwcm92aWRlZCBkYXRhIHRvIGxvY2FsIHN0b3JhZ2VcbiAgICBmdW5jdGlvbiBfc2F2ZShkYXRhKSB7XG4gICAgICAgIGNvbnN0IHByb2plY3REYXRhID0gSlNPTi5zdHJpbmdpZnkoZGF0YS5wcm9qZWN0cyk7XG4gICAgICAgIGNvbnN0IHN0b3JhZ2UgPSB3aW5kb3dbJ2xvY2FsU3RvcmFnZSddXG4gICAgICAgIHN0b3JhZ2Uuc2V0SXRlbSgncHJvamVjdHMnLCBwcm9qZWN0RGF0YSk7XG4gICAgfVxuXG4gICAgLy8gbG9hZCBmdW5jdGlvbiAtIFJldHJpZXZlcyBkYXRhIGluIGxvY2FsIHN0b3JhZ2VcbiAgICBmdW5jdGlvbiBsb2FkKCkge1xuICAgICAgICBsZXQgcHJvamVjdHM7XG4gICAgICAgIGlmIChfaXNBdmFpbGFibGUoKSkge1xuICAgICAgICAgICAgY29uc3Qgc3RvcmFnZSA9IHdpbmRvd1snbG9jYWxTdG9yYWdlJ107XG4gICAgICAgICAgICBwcm9qZWN0cyA9IEpTT04ucGFyc2Uoc3RvcmFnZS5nZXRJdGVtKCdwcm9qZWN0cycpKTtcbiAgICAgICAgICAgIGlmIChwcm9qZWN0cyA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHByb2plY3RzID0gZGVmYXVsdFByb2plY3RzO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwcm9qZWN0cztcbiAgICB9XG4gICAgXG4gICAgLy8gaW5pdCBmdW5jdGlvbiAtIFNldHMgdXAgcHViU3ViIHN1YnNjcmlwdGlvbnNcbiAgICBmdW5jdGlvbiBpbml0KCkge1xuICAgICAgICBwdWJTdWIuc3Vic2NyaWJlKCdwcm9qZWN0c0NoYW5nZScsIF9zYXZlKTtcbiAgICAgICAgcHViU3ViLnN1YnNjcmliZSgndG9kb3NDaGFuZ2UnLCBfc2F2ZSk7XG4gICAgICAgIHB1YlN1Yi5zdWJzY3JpYmUoJ2FjdGl2ZVByb2plY3RDaGFuZ2UnLCBfc2F2ZSk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBpbml0LFxuICAgICAgICBsb2FkXG4gICAgfTtcbn0pKCk7XG5cbmV4cG9ydCB7IHN0b3JhZ2UgfTsiLCJpbXBvcnQgeyBjcmVhdGVTaWRlYmFyQ29udGVudCB9IGZyb20gJy4uL3ZpZXdzL3NpZGViYXIuanMnO1xuaW1wb3J0IHsgY3JlYXRlUHJvamVjdFRpdGxlQ29udGVudCB9IGZyb20gJy4uL3ZpZXdzL3RpdGxlLmpzJztcbmltcG9ydCB7IGNyZWF0ZU5ld1RvZG9Db250ZW50IH0gZnJvbSAnLi4vdmlld3MvbmV3VG9kb1NlY3Rpb24uanMnO1xuaW1wb3J0IHsgY3JlYXRlVG9kb0xpc3RDb250ZW50IH0gZnJvbSAnLi4vdmlld3MvdG9kb0l0ZW1zLmpzJztcbmltcG9ydCB7IHB1YlN1YiB9IGZyb20gJy4vcHViU3ViLmpzJztcblxuLy8gdmlld0NvbnRyb2xsZXIgbW9kdWxlIC0gY29udHJvbHMgRE9NIG1hbmlwdWxhdGlvblxuY29uc3Qgdmlld0NvbnRyb2xsZXIgPSAoZnVuY3Rpb24oKSB7XG4gICAgLy8gX3Nob3dOZXdUb2RvRm9ybSBmdW5jdGlvbiAtIE1ha2VzIHRoZSBcIkFkZCBOZXcgVG9kb1wiIGZvcm0gdmlzaWJsZVxuICAgIGZ1bmN0aW9uIF9zaG93TmV3VG9kb0Zvcm0oKSB7XG4gICAgICAgIGNvbnN0IGZvcm0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYWRkLXRvZG8nKTtcbiAgICAgICAgY29uc3QgZm9ybVRvZ2dsZUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNhZGQtdG9kby1idG4nKTtcbiAgICAgICAgZm9ybS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgZm9ybVRvZ2dsZUJ0bi5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgIH1cblxuICAgIC8vIF9oaWRlTmV3VG9kb0Zvcm0gZnVuY3Rpb24gLSBIaWRlcyB0aGUgXCJBZGQgTmV3IFRvZG9cIiBmb3JtXG4gICAgZnVuY3Rpb24gX2hpZGVOZXdUb2RvRm9ybSgpIHtcbiAgICAgICAgY29uc3QgZm9ybSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5hZGQtdG9kbycpO1xuICAgICAgICBjb25zdCBmb3JtVG9nZ2xlQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2FkZC10b2RvLWJ0bicpO1xuICAgICAgICBmb3JtLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgIGZvcm1Ub2dnbGVCdG4uc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgfVxuXG4gICAgLy8gX3Nob3dBbGVydCBmdW5jdGlvbiAtIGFsZXJ0cyB0aGUgZ2l2ZW4gYWxlcnQgbWVzc2FnZSB0byB0aGUgd2luZG93XG4gICAgZnVuY3Rpb24gX3Nob3dBbGVydChhbGVydE1lc3NhZ2UpIHtcbiAgICAgICAgd2luZG93LmFsZXJ0KGFsZXJ0TWVzc2FnZSk7XG4gICAgfVxuICAgIFxuICAgIC8vIF9yZW5kZXJQcm9qZWN0cyBmdW5jdGlvbiAtIHJlbmRlcnMgc2lkZWJhciBjb250ZW50XG4gICAgZnVuY3Rpb24gX3JlbmRlclByb2plY3RzKGRhdGEpIHtcbiAgICAgICAgLy8gQ2xlYXIgdGhlIHByb2plY3QtbGlzdCBzaWRlYmFyXG4gICAgICAgIGNvbnN0IHByb2plY3RMaXN0RGl2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3Byb2plY3QtbGlzdCcpXG4gICAgICAgIHByb2plY3RMaXN0RGl2LnRleHRDb250ZW50ID0gJyc7XG5cbiAgICAgICAgLy8gRXh0cmFjdCByZWxldmFudCBkYXRhXG4gICAgICAgIGNvbnN0IHByb2plY3ROYW1lTGlzdCA9IGRhdGEucHJvamVjdHMubWFwKHByb2plY3QgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHByb2plY3QubmFtZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgYWN0aXZlUHJvamVjdE5hbWUgPSBkYXRhLmFjdGl2ZVByb2plY3QubmFtZTtcblxuICAgICAgICAvLyBHZW5lcmF0ZSBwcm9qZWN0LWxpc3Qgc2lkZWJhciBodG1sXG4gICAgICAgIGNvbnN0IHNpZGViYXJDb250ZW50ID0gY3JlYXRlU2lkZWJhckNvbnRlbnQocHJvamVjdE5hbWVMaXN0LCBhY3RpdmVQcm9qZWN0TmFtZSk7XG4gICAgICAgIHByb2plY3RMaXN0RGl2LmFwcGVuZENoaWxkKHNpZGViYXJDb250ZW50KTtcbiAgICAgICAgXG4gICAgICAgIHB1YlN1Yi5wdWJsaXNoKCdwcm9qZWN0c1JlbmRlcicpO1xuICAgIH1cblxuICAgIC8vIF9yZW5kZXJQcm9qZWN0VGl0bGUgZnVuY3Rpb24gLSByZW5kZXJzIHRoZSBwcm9qZWN0IHRpdGxlIG9uIHRoZSBwYWdlXG4gICAgZnVuY3Rpb24gX3JlbmRlclByb2plY3RUaXRsZShkYXRhKSB7XG4gICAgICAgIC8vIENsZWFyIHByb2plY3QtdGl0bGUtY29udGVudFxuICAgICAgICBjb25zdCBwcm9qZWN0VGl0bGVEaXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcHJvamVjdC10aXRsZS1jb250ZW50Jyk7XG4gICAgICAgIHByb2plY3RUaXRsZURpdi50ZXh0Q29udGVudCA9ICcnO1xuXG4gICAgICAgIC8vIEV4dHJhY3QgcmVsZXZhbnQgZGF0YVxuICAgICAgICBjb25zdCBhY3RpdmVQcm9qZWN0TmFtZSA9IGRhdGEuYWN0aXZlUHJvamVjdC5uYW1lO1xuXG4gICAgICAgIC8vIEdlbmVyYXRlIHByb2plY3QtdGl0bGUgaHRtbFxuICAgICAgICBjb25zdCBwcm9qZWN0VGl0bGVDb250ZW50ID0gY3JlYXRlUHJvamVjdFRpdGxlQ29udGVudChhY3RpdmVQcm9qZWN0TmFtZSk7XG4gICAgICAgIHByb2plY3RUaXRsZURpdi5hcHBlbmRDaGlsZChwcm9qZWN0VGl0bGVDb250ZW50KTtcbiAgICAgICAgXG4gICAgICAgIHB1YlN1Yi5wdWJsaXNoKCdwcm9qZWN0VGl0bGVSZW5kZXInKTtcbiAgICB9XG5cbiAgICAvLyBfcmVuZGVyTmV3VG9kb0NvbnRlbnQgZnVuY3Rpb24gLSByZW5kZXJzIHBhZ2UgY29udGVudCByZWxhdGVkIHRvIGFkZGluZyBuZXcgdG9kb1xuICAgIGZ1bmN0aW9uIF9yZW5kZXJOZXdUb2RvQ29udGVudCgpIHtcbiAgICAgICAgLy8gQ2xlYXIgbmV3LXRvZG8tY29udGVudCBkaXZcbiAgICAgICAgY29uc3QgbmV3VG9kb0NvbnRlbnREaXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbmV3LXRvZG8tY29udGVudCcpO1xuICAgICAgICBuZXdUb2RvQ29udGVudERpdi50ZXh0Q29udGVudCA9ICcnO1xuXG4gICAgICAgIC8vIEdlbmVyYXRlIG5ldy10b2RvLWNvbnRlbnQgaHRtbFxuICAgICAgICBjb25zdCBuZXdUb2RvQ29udGVudCA9IGNyZWF0ZU5ld1RvZG9Db250ZW50KCk7XG4gICAgICAgIG5ld1RvZG9Db250ZW50RGl2LmFwcGVuZENoaWxkKG5ld1RvZG9Db250ZW50KTtcbiAgICAgICAgXG4gICAgICAgIHB1YlN1Yi5wdWJsaXNoKCduZXdUb2RvQ29udGVudFJlbmRlcicpO1xuICAgIH1cblxuICAgIC8vIF9yZW5kZXJUb2RvcyBmdW5jdGlvbiAtIHJlbmRlcnMgdG9kbyBjb250ZW50XG4gICAgZnVuY3Rpb24gX3JlbmRlclRvZG9zKGRhdGEpIHtcbiAgICAgICAgLy8gQ2xlYXIgdG9kby1saXN0LWl0ZW1zIGRpdlxuICAgICAgICBjb25zdCB0b2RvTGlzdERpdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN0b2RvLWxpc3QnKTtcbiAgICAgICAgdG9kb0xpc3REaXYudGV4dENvbnRlbnQgPSAnJztcblxuICAgICAgICAvLyBFeHRyYWN0IHJlbGV2YW50IGRhdGFcbiAgICAgICAgY29uc3QgdG9kb3MgPSBkYXRhLmFjdGl2ZVByb2plY3QudG9kb3M7XG4gICAgICAgIGNvbnN0IGFjdGl2ZVRvZG8gPSBkYXRhLmFjdGl2ZVByb2plY3QuYWN0aXZlVG9kbztcblxuICAgICAgICAvLyBHZW5lcmF0ZSB0b2RvLWxpc3QtaXRlbXMgY29udGVudFxuICAgICAgICBjb25zdCB0b2RvTGlzdENvbnRlbnQgPSBjcmVhdGVUb2RvTGlzdENvbnRlbnQodG9kb3MsIGFjdGl2ZVRvZG8pO1xuICAgICAgICB0b2RvTGlzdERpdi5hcHBlbmRDaGlsZCh0b2RvTGlzdENvbnRlbnQpO1xuICAgICAgICBcbiAgICAgICAgcHViU3ViLnB1Ymxpc2goJ3RvZG9zUmVuZGVyJyk7XG4gICAgfVxuICAgIFxuICAgIC8vIF9yZW5kZXJGdWxsUGFnZSBmdW5jdGlvbiAtIHJlbmRlcnMgdGhlIGVudGlyZSBwYWdlJ3MgY29udGVudFxuICAgIGZ1bmN0aW9uIF9yZW5kZXJGdWxsUGFnZShkYXRhKSB7XG4gICAgICAgIF9yZW5kZXJQcm9qZWN0cyhkYXRhKTtcbiAgICAgICAgX3JlbmRlclByb2plY3RUaXRsZShkYXRhKTtcbiAgICAgICAgX3JlbmRlck5ld1RvZG9Db250ZW50KCk7XG4gICAgICAgIF9yZW5kZXJUb2RvcyhkYXRhKTtcbiAgICB9XG4gICAgXG4gICAgLy8gaW5pdCBmdW5jdGlvbiAtIFN1YnNjcmliZXMgdG8gcHViU3ViIGV2ZW50c1xuICAgIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgICAgIHB1YlN1Yi5zdWJzY3JpYmUoJ2FwcEluaXQnLCBfcmVuZGVyRnVsbFBhZ2UpO1xuICAgICAgICBwdWJTdWIuc3Vic2NyaWJlKCdhY3RpdmF0ZU5ld1RvZG9Gb3JtJywgX3Nob3dOZXdUb2RvRm9ybSk7XG4gICAgICAgIHB1YlN1Yi5zdWJzY3JpYmUoJ2Rpc2FibGVOZXdUb2RvRm9ybScsIF9oaWRlTmV3VG9kb0Zvcm0pO1xuICAgICAgICBwdWJTdWIuc3Vic2NyaWJlKCdwcm9qZWN0c0NoYW5nZScsIF9yZW5kZXJQcm9qZWN0cyk7XG4gICAgICAgIHB1YlN1Yi5zdWJzY3JpYmUoJ3RvZG9zQ2hhbmdlJywgX3JlbmRlclRvZG9zKTtcbiAgICAgICAgcHViU3ViLnN1YnNjcmliZSgnYWN0aXZlUHJvamVjdENoYW5nZScsIF9yZW5kZXJGdWxsUGFnZSk7XG4gICAgICAgIHB1YlN1Yi5zdWJzY3JpYmUoJ2ludmFsaWRUb2RvRmllbGRzJywgX3Nob3dBbGVydCk7XG4gICAgICAgIHB1YlN1Yi5zdWJzY3JpYmUoJ2ludmFsaWRQcm9qZWN0TmFtZScsIF9zaG93QWxlcnQpO1xuICAgICAgICBwdWJTdWIuc3Vic2NyaWJlKCdpbnZhbGlkUHJvamVjdERlbGV0aW9uJywgX3Nob3dBbGVydCk7XG4gICAgfVxuICAgIFxuICAgIHJldHVybiB7IGluaXQgfTtcbn0pKCk7XG5cbmV4cG9ydCB7IHZpZXdDb250cm9sbGVyIH07IiwiaW1wb3J0IHsgZG9tVXRpbCB9IGZyb20gJy4vdXRpbC5qcyc7XG5pbXBvcnQgeyB0b2RvRm9ybSB9IGZyb20gJy4vdG9kb0Zvcm0nO1xuXG5mdW5jdGlvbiBjcmVhdGVUaXRsZVNlY3Rpb24oKSB7XG4gICAgLy8gUGFyZW50XG4gICAgY29uc3QgY29udGFpbmVyID0gZG9tVXRpbC5jcmVhdGUoJ2RpdicsICcnKTtcblxuICAgIC8vIENoaWxkcmVuXG4gICAgY29uc3QgdGl0bGVMYWJlbCA9IGRvbVV0aWwuY3JlYXRlKCdsYWJlbCcsICdUaXRsZScsIHtcbiAgICAgICAgYXR0cmlidXRlczoge1xuICAgICAgICAgICAgZm9yOiAnbmV3LXRpdGxlJ1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgY29uc3QgdGl0bGVJbnB1dCA9IGRvbVV0aWwuY3JlYXRlKCdpbnB1dCcsICcnLCB7XG4gICAgICAgIGlkOiAnbmV3LXRpdGxlJyxcbiAgICAgICAgYXR0cmlidXRlczoge1xuICAgICAgICAgICAgbmFtZTogJ25ldy10aXRsZScsXG4gICAgICAgICAgICB0eXBlOiAndGV4dCdcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIGNvbnN0IGNoaWxkcmVuID0gWyB0aXRsZUxhYmVsLCB0aXRsZUlucHV0IF07XG5cbiAgICAvLyBBcHBlbmQgY2hpbGRyZW4gdG8gcGFyZW50XG4gICAgZG9tVXRpbC5hcHBlbmRDaGlsZHJlbihjb250YWluZXIsIGNoaWxkcmVuKTtcblxuICAgIHJldHVybiBjb250YWluZXI7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZURlc2NyaXB0aW9uU2VjdGlvbigpIHtcbiAgICAvLyBQYXJlbnRcbiAgICBjb25zdCBjb250YWluZXIgPSBkb21VdGlsLmNyZWF0ZSgnZGl2JywgJycpO1xuXG4gICAgLy8gQ2hpbGRyZW5cbiAgICBjb25zdCBkZXNjcmlwdGlvbkxhYmVsID0gZG9tVXRpbC5jcmVhdGUoJ2xhYmVsJywgJ0Rlc2NyaXB0aW9uJywge1xuICAgICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgICBmb3I6ICduZXctZGVzY3JpcHRpb24nXG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBjb25zdCBkZXNjcmlwdGlvbklucHV0ID0gZG9tVXRpbC5jcmVhdGUoJ3RleHRhcmVhJywgJycsIHtcbiAgICAgICAgaWQ6ICduZXctZGVzY3JpcHRpb24nLFxuICAgICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgICBuYW1lOiAnbmV3LWRlc2NyaXB0aW9uJyxcbiAgICAgICAgICAgIHJvd3M6ICc1JyxcbiAgICAgICAgICAgIGNvbHM6ICczMCdcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIGNvbnN0IGNoaWxkcmVuID0gWyBkZXNjcmlwdGlvbkxhYmVsLCBkZXNjcmlwdGlvbklucHV0IF07XG5cbiAgICAvLyBBcHBlbmQgY2hpbGRyZW4gdG8gcGFyZW50XG4gICAgZG9tVXRpbC5hcHBlbmRDaGlsZHJlbihjb250YWluZXIsIGNoaWxkcmVuKTtcbiAgICBcbiAgICByZXR1cm4gY29udGFpbmVyO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVEYXRlU2VjdGlvbigpIHtcbiAgICAvLyBQYXJlbnRcbiAgICBjb25zdCBjb250YWluZXIgPSBkb21VdGlsLmNyZWF0ZSgnZGl2JywgJycpO1xuXG4gICAgLy8gQ2hpbGRyZW5cbiAgICBjb25zdCBkYXRlTGFiZWwgPSBkb21VdGlsLmNyZWF0ZSgnbGFiZWwnLCAnRHVlIERhdGUnLCB7XG4gICAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgICAgIGZvcjogJ25ldy1kYXRlJ1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgY29uc3QgZGF0ZUlucHV0ID0gZG9tVXRpbC5jcmVhdGUoJ2lucHV0JywgJycsIHtcbiAgICAgICAgaWQ6ICduZXctZGF0ZScsXG4gICAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgICAgIG5hbWU6ICduZXctZGF0ZScsXG4gICAgICAgICAgICB0eXBlOiAnZGF0ZSdcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIGNvbnN0IGNoaWxkcmVuID0gWyBkYXRlTGFiZWwsIGRhdGVJbnB1dCBdO1xuXG4gICAgLy8gQXBwZW5kIGNoaWxkcmVuIHRvIHBhcmVudFxuICAgIGRvbVV0aWwuYXBwZW5kQ2hpbGRyZW4oY29udGFpbmVyLCBjaGlsZHJlbik7XG4gICAgXG4gICAgcmV0dXJuIGNvbnRhaW5lcjtcbn1cblxuZnVuY3Rpb24gY3JlYXRlUHJpb3JpdHlTZWN0aW9uKCkge1xuICAgIC8vIFBhcmVudFxuICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvbVV0aWwuY3JlYXRlKCdkaXYnLCAnJyk7XG5cbiAgICAvLyBDaGlsZHJlblxuICAgIGNvbnN0IHAgPSBkb21VdGlsLmNyZWF0ZSgncCcsICdQcmlvcml0eScpO1xuICAgIGNvbnN0IGxvd0lucHV0ID0gZG9tVXRpbC5jcmVhdGUoJ2lucHV0JywgJycsIHtcbiAgICAgICAgaWQ6ICduZXctbG93JyxcbiAgICAgICAgYXR0cmlidXRlczoge1xuICAgICAgICAgICAgdHlwZTogJ3JhZGlvJyxcbiAgICAgICAgICAgIG5hbWU6ICduZXctcHJpb3JpdHknLFxuICAgICAgICAgICAgdmFsdWU6ICdsb3cnXG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBjb25zdCBsb3dMYWJlbCA9IGRvbVV0aWwuY3JlYXRlKCdsYWJlbCcsICdMb3cnLCB7XG4gICAgICAgIGNsYXNzOiAncmFkaW8tbGFiZWwnLFxuICAgICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgICBmb3I6ICduZXctbG93J1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgY29uc3QgbWlkSW5wdXQgPSBkb21VdGlsLmNyZWF0ZSgnaW5wdXQnLCAnJywge1xuICAgICAgICBpZDogJ25ldy1taWQnLFxuICAgICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgICB0eXBlOiAncmFkaW8nLFxuICAgICAgICAgICAgbmFtZTogJ25ldy1wcmlvcml0eScsXG4gICAgICAgICAgICB2YWx1ZTogJ21pZCdcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIGNvbnN0IG1pZExhYmVsID0gZG9tVXRpbC5jcmVhdGUoJ2xhYmVsJywgJ01pZCcsIHtcbiAgICAgICAgY2xhc3M6ICdyYWRpby1sYWJlbCcsXG4gICAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgICAgIGZvcjogJ25ldy1taWQnXG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBjb25zdCBoaWdoSW5wdXQgPSBkb21VdGlsLmNyZWF0ZSgnaW5wdXQnLCAnJywge1xuICAgICAgICBpZDogJ25ldy1oaWdoJyxcbiAgICAgICAgYXR0cmlidXRlczoge1xuICAgICAgICAgICAgdHlwZTogJ3JhZGlvJyxcbiAgICAgICAgICAgIG5hbWU6ICduZXctcHJpb3JpdHknLFxuICAgICAgICAgICAgdmFsdWU6ICdoaWdoJ1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgY29uc3QgaGlnaExhYmVsID0gZG9tVXRpbC5jcmVhdGUoJ2xhYmVsJywgJ0hpZ2gnLCB7XG4gICAgICAgIGNsYXNzOiAncmFkaW8tbGFiZWwnLFxuICAgICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgICBmb3I6ICduZXctaGlnaCdcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIGNvbnN0IGNoaWxkcmVuID0gW1xuICAgICAgICBwLFxuICAgICAgICBsb3dJbnB1dCxcbiAgICAgICAgbG93TGFiZWwsXG4gICAgICAgIG1pZElucHV0LFxuICAgICAgICBtaWRMYWJlbCxcbiAgICAgICAgaGlnaElucHV0LFxuICAgICAgICBoaWdoTGFiZWxcbiAgICBdO1xuXG4gICAgLy8gQXBwZW5kIGNoaWxkcmVuIHRvIHBhcmVudFxuICAgIGRvbVV0aWwuYXBwZW5kQ2hpbGRyZW4oY29udGFpbmVyLCBjaGlsZHJlbik7XG4gICAgXG4gICAgcmV0dXJuIGNvbnRhaW5lcjtcbn1cblxuXG5mdW5jdGlvbiBjcmVhdGVBZGRUb2RvRm9ybURpdigpIHtcbiAgICAvLyBQYXJlbnRcbiAgICBjb25zdCBhZGRUb2RvRm9ybURpdiA9IGRvbVV0aWwuY3JlYXRlKCdkaXYnLCAnJywgeyBjbGFzczogJ2FkZC10b2RvJyB9KTtcblxuICAgIC8vIENoaWxkcmVuXG4gICAgY29uc3QgY2xvc2VUb2RvRm9ybUJ0biA9IGRvbVV0aWwuY3JlYXRlKCdidXR0b24nLCAnWCcsIHsgaWQ6ICdjbG9zZS1uZXctdG9kby1mb3JtJyB9KTtcbiAgICBjb25zdCBoMyA9IGRvbVV0aWwuY3JlYXRlKCdoMycsICdBZGQgTmV3IFRvZG8nKTtcbiAgICBjb25zdCB0aXRsZVNlY3Rpb24gPSB0b2RvRm9ybS5jcmVhdGVUaXRsZVNlY3Rpb24oJ25ldy10aXRsZScpXG4gICAgY29uc3QgZGVzY3JpcHRpb25TZWN0aW9uID0gdG9kb0Zvcm0uY3JlYXRlRGVzY3JpcHRpb25TZWN0aW9uKCduZXctZGVzY3JpcHRpb24nKTtcbiAgICBjb25zdCBkYXRlU2VjdGlvbiA9IHRvZG9Gb3JtLmNyZWF0ZURhdGVTZWN0aW9uKCduZXctZGF0ZScpO1xuICAgIGNvbnN0IHByaW9yaXR5U2VjdGlvbiA9IHRvZG9Gb3JtLmNyZWF0ZVByaW9yaXR5U2VjdGlvbihbICduZXctbG93JywgJ25ldy1taWQnLCAnbmV3LWhpZ2gnIF0sXG4gICAgICAgIFsgJ2xvdycsICdtaWQnLCAnaGlnaCcgXSxcbiAgICAgICAgWyAnTG93JywgJ01pZCcsICdIaWdoJyBdLFxuICAgICAgICAnbmV3LXByaW9yaXR5JyAgICBcbiAgICApO1xuICAgIGNvbnN0IHN1Ym1pdFRvZG9CdG4gPSBkb21VdGlsLmNyZWF0ZSgnYnV0dG9uJywgJ0FkZCcsIHsgaWQ6ICdzdWJtaXQtdG9kby1idG4nIH0pO1xuICAgIGNvbnN0IGNoaWxkcmVuID0gWyBcbiAgICAgICAgY2xvc2VUb2RvRm9ybUJ0bixcbiAgICAgICAgaDMsXG4gICAgICAgIHRpdGxlU2VjdGlvbixcbiAgICAgICAgZGVzY3JpcHRpb25TZWN0aW9uLFxuICAgICAgICBkYXRlU2VjdGlvbixcbiAgICAgICAgcHJpb3JpdHlTZWN0aW9uLFxuICAgICAgICBzdWJtaXRUb2RvQnRuLFxuICAgIF07XG5cbiAgICAvLyBBcHBlbmQgY2hpbGRyZW4gdG8gcGFyZW50XG4gICAgZG9tVXRpbC5hcHBlbmRDaGlsZHJlbihhZGRUb2RvRm9ybURpdiwgY2hpbGRyZW4pO1xuXG4gICAgcmV0dXJuIGFkZFRvZG9Gb3JtRGl2O1xufVxuXG5mdW5jdGlvbiBjcmVhdGVOZXdUb2RvQ29udGVudCgpIHtcbiAgICAvLyBQYXJlbnRcbiAgICBjb25zdCBjb250YWluZXIgPSBkb21VdGlsLmNyZWF0ZSgnZGl2JywgJycpO1xuXG4gICAgLy8gQ2hpbGRyZW5cbiAgICBjb25zdCBhZGRUb2RvQnRuID0gZG9tVXRpbC5jcmVhdGUoJ2J1dHRvbicsICdBZGQgVG9kbycsIHsgaWQ6ICdhZGQtdG9kby1idG4nIH0pO1xuICAgIGNvbnN0IGFkZFRvZG9Gb3JtRGl2ID0gY3JlYXRlQWRkVG9kb0Zvcm1EaXYoKTtcbiAgICBjb25zdCBjaGlsZHJlbiA9IFsgYWRkVG9kb0J0biwgYWRkVG9kb0Zvcm1EaXYgXTtcblxuICAgIC8vIEFwcGVuZCBjaGlsZHJlbiB0byBwYXJlbnRcbiAgICBkb21VdGlsLmFwcGVuZENoaWxkcmVuKGNvbnRhaW5lciwgY2hpbGRyZW4pO1xuXG4gICAgcmV0dXJuIGNvbnRhaW5lcjtcbn1cblxuZXhwb3J0IHsgY3JlYXRlTmV3VG9kb0NvbnRlbnQgfTsiLCJpbXBvcnQgeyBkb21VdGlsIH0gZnJvbSAnLi91dGlsLmpzJztcblxuZnVuY3Rpb24gY3JlYXRlUHJvamVjdERpdihwcm9qZWN0TmFtZSwgaXNBY3RpdmVQcm9qZWN0KSB7XG4gICAgLy8gUGFyZW50XG4gICAgY29uc3QgcHJvamVjdERpdkNsYXNzTGlzdCA9IGlzQWN0aXZlUHJvamVjdCA/IFsgJ3Byb2plY3QnLCAnYWN0aXZlLXByb2plY3QnIF0gOiAgWyAncHJvamVjdCcgXTtcbiAgICBjb25zdCBwcm9qZWN0RGl2ID0gZG9tVXRpbC5jcmVhdGUoJ2RpdicsICcnLCB7XG4gICAgICAgIGNsYXNzOiBwcm9qZWN0RGl2Q2xhc3NMaXN0LFxuICAgICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgICAnZGF0YS1uYW1lJzogcHJvamVjdE5hbWVcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gQ2hpbGRyZW5cbiAgICBjb25zdCBuYW1lUCA9IGRvbVV0aWwuY3JlYXRlKCdwJywgcHJvamVjdE5hbWUsIHsgY2xhc3M6ICdwcm9qZWN0LW5hbWUnIH0pO1xuICAgIGNvbnN0IGRlbEJ1dHRvbiA9IGRvbVV0aWwuY3JlYXRlKCdidXR0b24nLCAnLScsIHsgY2xhc3M6ICdkZWwtcHJvamVjdCcgfSk7XG4gICAgY29uc3QgY2hpbGRyZW4gPSBbIG5hbWVQLCBkZWxCdXR0b24gXTtcblxuICAgIC8vIEFwcGVuZCBjaGlsZHJlbiB0byBwYXJlbnRcbiAgICBkb21VdGlsLmFwcGVuZENoaWxkcmVuKHByb2plY3REaXYsIGNoaWxkcmVuKTtcblxuICAgIHJldHVybiBwcm9qZWN0RGl2O1xufVxuXG5mdW5jdGlvbiBjcmVhdGVTaWRlYmFyQ29udGVudChwcm9qZWN0TmFtZUxpc3QsIGFjdGl2ZVByb2plY3ROYW1lKSB7XG4gICAgLy8gcGFyZW50XG4gICAgY29uc3QgY29udGFpbmVyID0gZG9tVXRpbC5jcmVhdGUoJ2RpdicsICcnKTtcbiAgICBcbiAgICAvLyBjaGlsZHJlblxuICAgIHByb2plY3ROYW1lTGlzdC5mb3JFYWNoKHByb2plY3ROYW1lID0+IHtcbiAgICAgICAgLy8gQXBwZW5kIGNoaWxkcmVuIHRvIHBhcmVudFxuICAgICAgICBjb25zdCBpc0FjdGl2ZVByb2plY3QgPSBwcm9qZWN0TmFtZSA9PT0gYWN0aXZlUHJvamVjdE5hbWU7XG4gICAgICAgIGNvbnN0IHByb2plY3REaXYgPSBjcmVhdGVQcm9qZWN0RGl2KHByb2plY3ROYW1lLCBpc0FjdGl2ZVByb2plY3QpO1xuICAgICAgICBjb250YWluZXIuYXBwZW5kKHByb2plY3REaXYpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGNvbnRhaW5lcjtcbn1cblxuZXhwb3J0IHsgY3JlYXRlU2lkZWJhckNvbnRlbnQgfTsiLCJpbXBvcnQgeyBkb21VdGlsIH0gZnJvbSAnLi91dGlsLmpzJztcblxuZnVuY3Rpb24gY3JlYXRlUHJvamVjdFRpdGxlQ29udGVudChhY3RpdmVQcm9qZWN0TmFtZSkge1xuICAgIGNvbnN0IGgyID0gZG9tVXRpbC5jcmVhdGUoJ2gyJywgYWN0aXZlUHJvamVjdE5hbWUpO1xuICAgIHJldHVybiBoMjtcbn1cblxuZXhwb3J0IHsgY3JlYXRlUHJvamVjdFRpdGxlQ29udGVudCB9OyIsImltcG9ydCB7IGRvbVV0aWwgfSBmcm9tICcuL3V0aWwuanMnO1xuXG4vLyB0b2RvRm9ybSBtb2R1bGUgLSBnZW5lcmF0ZXMgZm9ybSBmaWVsZHMgdXRpbGl6ZWQgYnkgdGhlIG5ldyB0b2RvIGFuZCBhY3RpdmUgdG9kbyBzZWN0aW9uc1xuY29uc3QgdG9kb0Zvcm0gPSAoZnVuY3Rpb24oKSB7XG5cbiAgICBmdW5jdGlvbiBjcmVhdGVUaXRsZVNlY3Rpb24oaWQsIGluaXRpYWxWYWx1ZT0nJykge1xuICAgICAgICAvLyBQYXJlbnRcbiAgICAgICAgY29uc3QgY29udGFpbmVyID0gZG9tVXRpbC5jcmVhdGUoJ2RpdicsICcnKTtcbiAgICBcbiAgICAgICAgLy8gQ2hpbGRyZW5cbiAgICAgICAgY29uc3QgdGl0bGVMYWJlbCA9IGRvbVV0aWwuY3JlYXRlKCdsYWJlbCcsICdUaXRsZScsIHtcbiAgICAgICAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgICAgICAgICBmb3I6IGlkXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCB0aXRsZUlucHV0ID0gZG9tVXRpbC5jcmVhdGUoJ2lucHV0JywgJycsIHtcbiAgICAgICAgICAgIGlkOiBpZCxcbiAgICAgICAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgICAgICAgICBuYW1lOiBpZCxcbiAgICAgICAgICAgICAgICB0eXBlOiAndGV4dCcsXG4gICAgICAgICAgICAgICAgdmFsdWU6IGluaXRpYWxWYWx1ZVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgY2hpbGRyZW4gPSBbIHRpdGxlTGFiZWwsIHRpdGxlSW5wdXQgXTtcbiAgICBcbiAgICAgICAgLy8gQXBwZW5kIGNoaWxkcmVuIHRvIHBhcmVudFxuICAgICAgICBkb21VdGlsLmFwcGVuZENoaWxkcmVuKGNvbnRhaW5lciwgY2hpbGRyZW4pO1xuICAgIFxuICAgICAgICByZXR1cm4gY29udGFpbmVyO1xuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBjcmVhdGVEZXNjcmlwdGlvblNlY3Rpb24oaWQsIGluaXRpYWxWYWx1ZT0nJykge1xuICAgICAgICAvLyBQYXJlbnRcbiAgICAgICAgY29uc3QgY29udGFpbmVyID0gZG9tVXRpbC5jcmVhdGUoJ2RpdicsICcnKTtcbiAgICBcbiAgICAgICAgLy8gQ2hpbGRyZW5cbiAgICAgICAgY29uc3QgZGVzY3JpcHRpb25MYWJlbCA9IGRvbVV0aWwuY3JlYXRlKCdsYWJlbCcsICdEZXNjcmlwdGlvbicsIHtcbiAgICAgICAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgICAgICAgICBmb3I6IGlkXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCBkZXNjcmlwdGlvbklucHV0ID0gZG9tVXRpbC5jcmVhdGUoJ3RleHRhcmVhJywgaW5pdGlhbFZhbHVlLCB7XG4gICAgICAgICAgICBpZDogaWQsXG4gICAgICAgICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgICAgICAgbmFtZTogaWQsXG4gICAgICAgICAgICAgICAgcm93czogJzUnLFxuICAgICAgICAgICAgICAgIGNvbHM6ICczMCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IGNoaWxkcmVuID0gWyBkZXNjcmlwdGlvbkxhYmVsLCBkZXNjcmlwdGlvbklucHV0IF07XG4gICAgXG4gICAgICAgIC8vIEFwcGVuZCBjaGlsZHJlbiB0byBwYXJlbnRcbiAgICAgICAgZG9tVXRpbC5hcHBlbmRDaGlsZHJlbihjb250YWluZXIsIGNoaWxkcmVuKTtcbiAgICAgICAgXG4gICAgICAgIHJldHVybiBjb250YWluZXI7XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIGNyZWF0ZURhdGVTZWN0aW9uKGlkLCBpbml0aWFsVmFsdWU9JycpIHtcbiAgICAgICAgLy8gUGFyZW50XG4gICAgICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvbVV0aWwuY3JlYXRlKCdkaXYnLCAnJyk7XG4gICAgXG4gICAgICAgIC8vIENoaWxkcmVuXG4gICAgICAgIGNvbnN0IGRhdGVMYWJlbCA9IGRvbVV0aWwuY3JlYXRlKCdsYWJlbCcsICdEdWUgRGF0ZScsIHtcbiAgICAgICAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgICAgICAgICBmb3I6IGlkXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCBkYXRlSW5wdXQgPSBkb21VdGlsLmNyZWF0ZSgnaW5wdXQnLCAnJywge1xuICAgICAgICAgICAgaWQ6IGlkLFxuICAgICAgICAgICAgYXR0cmlidXRlczoge1xuICAgICAgICAgICAgICAgIG5hbWU6IGlkLFxuICAgICAgICAgICAgICAgIHR5cGU6ICdkYXRlJyxcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGRhdGVJbnB1dC52YWx1ZSA9IGluaXRpYWxWYWx1ZTtcbiAgICAgICAgY29uc3QgY2hpbGRyZW4gPSBbIGRhdGVMYWJlbCwgZGF0ZUlucHV0IF07XG4gICAgXG4gICAgICAgIC8vIEFwcGVuZCBjaGlsZHJlbiB0byBwYXJlbnRcbiAgICAgICAgZG9tVXRpbC5hcHBlbmRDaGlsZHJlbihjb250YWluZXIsIGNoaWxkcmVuKTtcbiAgICAgICAgXG4gICAgICAgIHJldHVybiBjb250YWluZXI7XG4gICAgfVxuICAgIFxuICAgIC8vIENyZWF0ZXMgcmFkaW8gYnV0dG9uIGlucHV0IHNlY3Rpb24gb2YgZm9ybVxuICAgIGZ1bmN0aW9uIGNyZWF0ZVByaW9yaXR5U2VjdGlvbihpZExpc3QsIHZhbHVlTGlzdCwgbGFiZWxUZXh0TGlzdCwgbmFtZUF0dHIsIGluaXRpYWxDaGVja2VkVmFsdWUpIHtcbiAgICAgICAgLy8gUGFyZW50XG4gICAgICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvbVV0aWwuY3JlYXRlKCdkaXYnLCAnJyk7XG4gICAgXG4gICAgICAgIC8vIENoaWxkcmVuXG4gICAgICAgIGNvbnN0IGNoaWxkcmVuID0gW107XG4gICAgICAgIGNvbnN0IHAgPSBkb21VdGlsLmNyZWF0ZSgncCcsICdQcmlvcml0eScpO1xuICAgICAgICBjaGlsZHJlbi5wdXNoKHApO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaWRMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBpbnB1dEF0dHJpYnV0ZXMgPSB7XG4gICAgICAgICAgICAgICAgdHlwZTogJ3JhZGlvJyxcbiAgICAgICAgICAgICAgICBuYW1lOiBuYW1lQXR0cixcbiAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWVMaXN0W2ldXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh2YWx1ZUxpc3RbaV0gPT09IGluaXRpYWxDaGVja2VkVmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpbnB1dEF0dHJpYnV0ZXMuY2hlY2tlZCA9ICdjaGVja2VkJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgaW5wdXQgPSBkb21VdGlsLmNyZWF0ZSgnaW5wdXQnLCAnJywge1xuICAgICAgICAgICAgICAgIGlkOiBpZExpc3RbaV0sXG4gICAgICAgICAgICAgICAgYXR0cmlidXRlczogaW5wdXRBdHRyaWJ1dGVzXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgY29uc3QgbGFiZWwgPSBkb21VdGlsLmNyZWF0ZSgnbGFiZWwnLCBsYWJlbFRleHRMaXN0W2ldLCB7XG4gICAgICAgICAgICAgICAgY2xhc3M6ICdyYWRpby1sYWJlbCcsXG4gICAgICAgICAgICAgICAgYXR0cmlidXRlczoge1xuICAgICAgICAgICAgICAgICAgICBmb3I6IGlkTGlzdFtpXVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBjaGlsZHJlbi5wdXNoKGlucHV0LCBsYWJlbCk7XG4gICAgICAgIH1cbiAgICBcbiAgICAgICAgLy8gQXBwZW5kIGNoaWxkcmVuIHRvIHBhcmVudFxuICAgICAgICBkb21VdGlsLmFwcGVuZENoaWxkcmVuKGNvbnRhaW5lciwgY2hpbGRyZW4pO1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuIGNvbnRhaW5lcjtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBjcmVhdGVUaXRsZVNlY3Rpb24sXG4gICAgICAgIGNyZWF0ZURlc2NyaXB0aW9uU2VjdGlvbixcbiAgICAgICAgY3JlYXRlRGF0ZVNlY3Rpb24sXG4gICAgICAgIGNyZWF0ZVByaW9yaXR5U2VjdGlvblxuICAgIH07XG59KSgpO1xuXG5leHBvcnQgeyB0b2RvRm9ybSB9OyIsImltcG9ydCB7IGRvbVV0aWwgfSBmcm9tICcuL3V0aWwuanMnO1xuaW1wb3J0IHsgdG9kb0Zvcm0gfSBmcm9tICcuL3RvZG9Gb3JtJztcblxuZnVuY3Rpb24gZ2VuZXJhdGVUb2RvRGl2Q2xhc3NMaXN0KHRvZG8sIGlzQWN0aXZlVG9kbykge1xuICAgIGNvbnN0IGNsYXNzTGlzdCA9IFtdO1xuXG4gICAgLy8gQWRkIGNsYXNzZXMgYmFzZWQgb24gdG9kbyBwcm9wZXJ0eSB2YWx1ZXNcbiAgICBpZiAoaXNBY3RpdmVUb2RvKSB7XG4gICAgICAgIGNsYXNzTGlzdC5wdXNoKCdhY3RpdmUtdG9kbycpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGNsYXNzTGlzdC5wdXNoKCdpbmFjdGl2ZS10b2RvJyk7XG4gICAgfVxuXG4gICAgaWYgKHRvZG8uY29tcGxldGUpIHtcbiAgICAgICAgY2xhc3NMaXN0LnB1c2goJ2NvbXBsZXRlJyk7XG4gICAgfVxuXG4gICAgaWYgKHRvZG8ucHJpb3JpdHkgPT09ICdsb3cnKSB7XG4gICAgICAgIGNsYXNzTGlzdC5wdXNoKCdsb3ctcHJpb3JpdHknKVxuICAgIH0gZWxzZSBpZiAodG9kby5wcmlvcml0eSA9PT0gJ21pZCcpIHtcbiAgICAgICAgY2xhc3NMaXN0LnB1c2goJ21pZC1wcmlvcml0eScpO1xuICAgIH0gZWxzZSBpZiAodG9kby5wcmlvcml0eSA9PT0gJ2hpZ2gnKSB7XG4gICAgICAgIGNsYXNzTGlzdC5wdXNoKCdoaWdoLXByaW9yaXR5Jyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNsYXNzTGlzdDtcbn1cblxuZnVuY3Rpb24gY3JlYXRlSW5hY3RpdmVUb2RvRGl2KHRvZG8pIHtcbiAgICBjb25zdCBjbGFzc0xpc3QgPSBnZW5lcmF0ZVRvZG9EaXZDbGFzc0xpc3QodG9kbywgZmFsc2UpO1xuXG4gICAgLy8gUGFyZW50XG4gICAgY29uc3QgY29udGFpbmVyID0gZG9tVXRpbC5jcmVhdGUoJ2RpdicsICcnLCB7XG4gICAgICAgIGNsYXNzOiBjbGFzc0xpc3QsXG4gICAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgICAgICdkYXRhLXRpdGxlJzogdG9kby50aXRsZVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBDaGlsZHJlblxuICAgIGNvbnN0IGg0ID0gZG9tVXRpbC5jcmVhdGUoJ2g0JywgdG9kby50aXRsZSk7XG4gICAgY29uc3QgcCA9IGRvbVV0aWwuY3JlYXRlKCdwJywgYER1ZTogJHt0b2RvLmR1ZURhdGV9YCk7XG4gICAgY29uc3QgY2hpbGRyZW4gPSBbIGg0LCBwIF07XG5cbiAgICAvLyBBcHBlbmQgY2hpbGRyZW4gdG8gcGFyZW50XG4gICAgZG9tVXRpbC5hcHBlbmRDaGlsZHJlbihjb250YWluZXIsIGNoaWxkcmVuKTtcblxuICAgIHJldHVybiBjb250YWluZXI7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUFjdGl2ZVRvZG9EaXYodG9kbykge1xuICAgIGNvbnN0IGNsYXNzTGlzdCA9IGdlbmVyYXRlVG9kb0RpdkNsYXNzTGlzdCh0b2RvLCB0cnVlKTtcblxuICAgIC8vIFBhcmVudFxuICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvbVV0aWwuY3JlYXRlKCdkaXYnLCAnJywge1xuICAgICAgICBjbGFzczogY2xhc3NMaXN0LFxuICAgICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgICAnZGF0YS10aXRsZSc6IHRvZG8udGl0bGVcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gQ2hpbGRyZW5cbiAgICBjb25zdCB0b2dnbGVDb21wbGV0ZUJ0biA9IGRvbVV0aWwuY3JlYXRlKCdidXR0b24nLCAnJywgeyBpZDogJ3RvZ2dsZS1jb21wbGV0ZScgfSk7XG4gICAgdG9nZ2xlQ29tcGxldGVCdG4uaW5uZXJIVE1MID0gJyZjaGVjazsnO1xuICAgIGNvbnN0IGRlbEFjdGl2ZVRvZG9CdG4gPSBkb21VdGlsLmNyZWF0ZSgnYnV0dG9uJywgJ1gnLCB7IGlkOiAnZGVsLWFjdGl2ZS10b2RvJyB9KTtcbiAgICBjb25zdCB0aXRsZVNlY3Rpb24gPSB0b2RvRm9ybS5jcmVhdGVUaXRsZVNlY3Rpb24oJ3VwZGF0ZS10aXRsZScsIHRvZG8udGl0bGUpXG4gICAgY29uc3QgZGVzY3JpcHRpb25TZWN0aW9uID0gdG9kb0Zvcm0uY3JlYXRlRGVzY3JpcHRpb25TZWN0aW9uKCd1cGRhdGUtZGVzY3JpcHRpb24nLCB0b2RvLmRlc2NyaXB0aW9uKTtcbiAgICBjb25zdCBkYXRlU2VjdGlvbiA9IHRvZG9Gb3JtLmNyZWF0ZURhdGVTZWN0aW9uKCd1cGRhdGUtZGF0ZScsIHRvZG8uZHVlRGF0ZSk7XG4gICAgY29uc3QgcHJpb3JpdHlTZWN0aW9uID0gdG9kb0Zvcm0uY3JlYXRlUHJpb3JpdHlTZWN0aW9uKFsgJ3VwZGF0ZS1sb3cnLCAndXBkYXRlLW1pZCcsICd1cGRhdGUtaGlnaCcgXSxcbiAgICAgICAgWyAnbG93JywgJ21pZCcsICdoaWdoJyBdLFxuICAgICAgICBbICdMb3cnLCAnTWlkJywgJ0hpZ2gnIF0sXG4gICAgICAgICd1cGRhdGUtcHJpb3JpdHknLFxuICAgICAgICB0b2RvLnByaW9yaXR5ICAgIFxuICAgICk7XG4gICAgY29uc3Qgc2F2ZUJ0biA9IGRvbVV0aWwuY3JlYXRlKCdidXR0b24nLCAnU2F2ZScsIHtcbiAgICAgICAgaWQ6ICdzYXZlLWJ0bidcbiAgICB9KTtcblxuICAgIGNvbnN0IGNoaWxkcmVuID0gW1xuICAgICAgICB0b2dnbGVDb21wbGV0ZUJ0bixcbiAgICAgICAgZGVsQWN0aXZlVG9kb0J0bixcbiAgICAgICAgdGl0bGVTZWN0aW9uLFxuICAgICAgICBkZXNjcmlwdGlvblNlY3Rpb24sXG4gICAgICAgIGRhdGVTZWN0aW9uLFxuICAgICAgICBwcmlvcml0eVNlY3Rpb24sXG4gICAgICAgIHNhdmVCdG5cbiAgICBdO1xuXG4gICAgLy8gQXBwZW5kIGNoaWxkcmVuIHRvIHBhcmVudFxuICAgIGRvbVV0aWwuYXBwZW5kQ2hpbGRyZW4oY29udGFpbmVyLCBjaGlsZHJlbik7XG5cbiAgICByZXR1cm4gY29udGFpbmVyO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVUb2RvTGlzdEl0ZW1zKHRvZG9zLCBhY3RpdmVUb2RvKSB7XG4gICAgLy8gUGFyZW50XG4gICAgY29uc3QgY29udGFpbmVyID0gZG9tVXRpbC5jcmVhdGUoJ2RpdicsICcnLCB7IGlkOiAndG9kby1saXN0LWl0ZW1zJyB9KTtcblxuICAgIC8vIENoaWxkcmVuXG4gICAgdG9kb3MuZm9yRWFjaCh0b2RvID0+IHtcbiAgICAgICAgbGV0IHRvZG9EaXY7XG4gICAgICAgIGlmIChhY3RpdmVUb2RvID09PSBudWxsIHx8IHRvZG8udGl0bGUgIT0gYWN0aXZlVG9kby50aXRsZSkge1xuICAgICAgICAgICAgdG9kb0RpdiA9IGNyZWF0ZUluYWN0aXZlVG9kb0Rpdih0b2RvKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRvZG9EaXYgPSBjcmVhdGVBY3RpdmVUb2RvRGl2KHRvZG8pO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAvLyBBcHBlbmQgY2hpbGRyZW4gdG8gcGFyZW50XG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0b2RvRGl2KTtcbiAgICB9KTtcblxuICAgIHJldHVybiBjb250YWluZXI7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVRvZG9MaXN0Q29udGVudCh0b2RvcywgYWN0aXZlVG9kbykge1xuICAgIC8vIFBhcmVudFxuICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvbVV0aWwuY3JlYXRlKCdkaXYnLCAnJyk7XG5cbiAgICAvLyBDaGlsZHJlblxuICAgIGNvbnN0IGgzID0gZG9tVXRpbC5jcmVhdGUoJ2gzJywgJ1RvZG8gSXRlbXMnKTtcbiAgICBjb25zdCB0b2RvTGlzdEl0ZW1zID0gY3JlYXRlVG9kb0xpc3RJdGVtcyh0b2RvcywgYWN0aXZlVG9kbyk7XG4gICAgY29uc3QgY2hpbGRyZW4gPSBbIGgzLCB0b2RvTGlzdEl0ZW1zIF07XG5cbiAgICAvLyBBcHBlbmQgY2hpbGRyZW4gdG8gcGFyZW50XG4gICAgZG9tVXRpbC5hcHBlbmRDaGlsZHJlbihjb250YWluZXIsIGNoaWxkcmVuKTtcblxuICAgIHJldHVybiBjb250YWluZXI7XG59XG5cbmV4cG9ydCB7IGNyZWF0ZVRvZG9MaXN0Q29udGVudCB9OyIsIi8vIGRvbVV0aWwgbW9kdWxlIC0gY29udGFpbnMgZnVuY3Rpb25zIHRvIHNpbXBsaWZ5IERPTSBub2RlIG1hbmlwdWxhdGlvbiBhbmQgY3JlYXRpb25cbmNvbnN0IGRvbVV0aWwgPSAoZnVuY3Rpb24oKSB7XG4gICAgLy8gX2FkZElkIGZ1bmN0aW9uIC0gYWRkcyBpZCB0byBhIHNwZWNpZmllZCBlbGVtZW50XG4gICAgZnVuY3Rpb24gX2FkZElkKGVsZW0sIGlkKSB7XG4gICAgICAgIGVsZW0uaWQgPSBpZDtcbiAgICAgICAgcmV0dXJuIGVsZW07XG4gICAgfVxuICAgIFxuICAgIC8vIF9hZGRDbGFzcyAtIGFkZHMgc3BlY2lmaWVkIGNsYXNzZXMgdG8gYW4gZWxlbWVudFxuICAgIGZ1bmN0aW9uIF9hZGRDbGFzcyhlbGVtLCBjbGFzc2VzKSB7XG4gICAgICAgIGlmICh0eXBlb2YgY2xhc3NlcyA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGVsZW0uY2xhc3NMaXN0LmFkZChjbGFzc2VzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNsYXNzZXMuZm9yRWFjaChjbGFzc05hbWUgPT4ge1xuICAgICAgICAgICAgICAgIGVsZW0uY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGVsZW07XG4gICAgfVxuXG4gICAgLy8gX2FkZEF0dHJpYnV0ZSAtIGFkZHMgc3BlY2lmaWVkIGF0dHJpYnV0ZXMgdG8gYW4gZWxlbWVudFxuICAgIGZ1bmN0aW9uIF9hZGRBdHRyaWJ1dGUoZWxlbSwgYXR0cmlidXRlcykge1xuICAgICAgICBmb3IgKGxldCBrZXkgaW4gYXR0cmlidXRlcykge1xuICAgICAgICAgICAgZWxlbS5zZXRBdHRyaWJ1dGUoa2V5LCBhdHRyaWJ1dGVzW2tleV0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBlbGVtO1xuICAgIH1cbiAgICBcbiAgICAvKiBjcmVhdGUgbWV0aG9kIC0gY3JlYXRlcyBhbiBlbGVtZW50IHdpdGggc3BlY2lmaWVkIHRhZywgZ2l2ZW4gdGV4dCwgYW5kIHN1cHBsaWVkIG9wdGlvbnNcbiAgICBvcHRpb25zIHBhcmVtdGVyIGlzIG9mIHRoZSBmb3JtOiBcbiAgICB7XG4gICAgICAgIGlkOiBTdHJpbmcsXG4gICAgICAgIGNsYXNzOiBTdHJpbmcgfCBbU3RyaW5nXVxuICAgICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgICBhdHRyaWJ1dGUxOiBTdHJpbmcsXG4gICAgICAgICAgICBhdHRyaWJ1dGUyOiBTdHJpbmdcbiAgICAgICAgfVxuICAgIH1cbiAgICAqL1xuICAgIGZ1bmN0aW9uIGNyZWF0ZSh0YWcsIHRleHQsIG9wdGlvbnMpIHtcbiAgICAgICAgY29uc3QgZWxlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnKTtcbiAgICAgICAgZWxlbS50ZXh0Q29udGVudCA9IHRleHQ7XG5cbiAgICAgICAgLy8gcmV0dXJuIHRoZSBlbGVtZW50IGlmIG5vIG9wdGlvbnMgd2VyZSBzcGVjaWZpZWRcbiAgICAgICAgaWYgKG9wdGlvbnMgPT09IHVuZGVmaW5lZCB8fCBPYmplY3Qua2V5cyhvcHRpb25zKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiBlbGVtO1xuICAgICAgICB9IFxuICAgICAgICBcbiAgICAgICAgLy8gQWRkIHNwZWNpZmllZCBpZFxuICAgICAgICBpZiAob3B0aW9ucy5pZCkge1xuICAgICAgICAgICAgX2FkZElkKGVsZW0sIG9wdGlvbnMuaWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQWRkIHNwZWNpZmllZCBjbGFzc1xuICAgICAgICBpZiAob3B0aW9ucy5jbGFzcykge1xuICAgICAgICAgICAgX2FkZENsYXNzKGVsZW0sIG9wdGlvbnMuY2xhc3MpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQWRkIHNwZWNpZmllZCBhdHRyaWJ1dGVzXG4gICAgICAgIGlmIChvcHRpb25zLmF0dHJpYnV0ZXMgIT09IHVuZGVmaW5lZCAmJiBPYmplY3Qua2V5cyhvcHRpb25zLmF0dHJpYnV0ZXMpLmxlbmd0aCAhPT0gMCkge1xuICAgICAgICAgICAgX2FkZEF0dHJpYnV0ZShlbGVtLCBvcHRpb25zLmF0dHJpYnV0ZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGVsZW07XG4gICAgfVxuXG4gICAgLy8gYXBwZW5kQ2hpbGRyZW4gbWV0aG9kIC0gYXBwZW5kcyBhbiBhcnJheSBvZiBjaGlsZHJlbiB0byB0aGUgcGFyZW50IG5vZGUgaW4gdGhlIHByb3ZpZGVkIG9yZGVyXG4gICAgZnVuY3Rpb24gYXBwZW5kQ2hpbGRyZW4ocGFyZW50LCBjaGlsZHJlbikge1xuICAgICAgICBjaGlsZHJlbi5mb3JFYWNoKGNoaWxkID0+IHtcbiAgICAgICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZChjaGlsZCk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcGFyZW50O1xuICAgIH1cblxuICAgIC8vIENsZWFyIFxuICAgIHJldHVybiB7XG4gICAgICAgIGNyZWF0ZSxcbiAgICAgICAgYXBwZW5kQ2hpbGRyZW4sXG4gICAgfTtcbn0pKCk7XG5cbmV4cG9ydCB7IGRvbVV0aWwgfTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IHZpZXdDb250cm9sbGVyIH0gZnJvbSAnLi9tb2R1bGVzL3ZpZXdDb250cm9sbGVyLmpzJztcbmltcG9ydCB7IGV2ZW50cyB9IGZyb20gJy4vbW9kdWxlcy9ldmVudHMuanMnO1xuaW1wb3J0IHsgc3RvcmFnZSB9IGZyb20gJy4vbW9kdWxlcy9zdG9yYWdlLmpzJztcbmltcG9ydCB7IGFwcCB9IGZyb20gJy4vbW9kdWxlcy9hcHAuanMnO1xuXG4vLyBSZXRyaWV2ZSBwcm9qZWN0cyBmcm9tIGxvY2FsU3RvcmFnZVxuY29uc3QgcHJvamVjdHMgPSBzdG9yYWdlLmxvYWQoKTtcblxuLy8gSW5pdGlhbGl6ZSB2aWV3Q29udHJvbGxlciwgZXZlbnRzLCBhbmQgc3RvcmFnZSBtb2R1bGVzXG52aWV3Q29udHJvbGxlci5pbml0KCk7XG5ldmVudHMuaW5pdCgpO1xuc3RvcmFnZS5pbml0KCk7XG5cbi8vIEluaXRpYWxpemUgYXBwbGljYXRpb25cbmFwcC5pbml0KHByb2plY3RzKTsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=