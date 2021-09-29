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
    function isValidTodo(title, description, dueDate, priority, isUpdate) {
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
        // Create todo item
        const todoItem = (0,_factory_functions_todo_js__WEBPACK_IMPORTED_MODULE_0__.todo)(title, description, dueDate, priority);

        // Append todo item to activeProject todos array
        _activeProject.addTodo(todoItem);

        _pubSub_js__WEBPACK_IMPORTED_MODULE_2__.pubSub.publish('todosChange', _getStateData());
    }

    // changeTodo function - modifies active todo item of activeproject to specified parameters
    function changeTodo(newTitle, newDescription, newDueDate, newPriority) {
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
        isValidTodo,
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

        if (_app_js__WEBPACK_IMPORTED_MODULE_1__.app.isValidTodo(title, description, dueDate, priority, false)) {
            _app_js__WEBPACK_IMPORTED_MODULE_1__.app.addTodo(title, description, dueDate, priority); 
        }
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

        if (_app_js__WEBPACK_IMPORTED_MODULE_1__.app.isValidTodo(newTitle, newDescription, newDueDate, newPriority, true)) {
            _app_js__WEBPACK_IMPORTED_MODULE_1__.app.changeTodo(newTitle, newDescription, newDueDate, newPriority);
        }
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

/*
    // _assignMainEvents wrapper function - Add event handlers to the main page Todo list content
    function _assignMainEvents() {
        _assignNewTodoEvents();
        _assignTodoListEvents();
    }

    // _assignFullPageEvents wrapper function - Adds event handlers to the entire page
    function _assignFullPageEvents() {
        _assignSidebarEvents();
        _assignMainEvents();
    }
*/
    
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7Ozs7QUNONkQ7QUFDaEI7QUFDRTtBQUNSOztBQUV2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwyRUFBbUI7QUFDbkIsMkRBQVc7QUFDWCw2REFBWTs7QUFFWjtBQUNBLHFEQUFRLFciLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9zcmMvZmFjdG9yeV9mdW5jdGlvbnMvcHJvamVjdC5qcyIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9zcmMvZmFjdG9yeV9mdW5jdGlvbnMvdG9kby5qcyIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9zcmMvbW9kdWxlcy9hcHAuanMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vc3JjL21vZHVsZXMvZXZlbnRzLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL3NyYy9tb2R1bGVzL3B1YlN1Yi5qcyIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9zcmMvbW9kdWxlcy9zdG9yYWdlLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL3NyYy9tb2R1bGVzL3ZpZXdDb250cm9sbGVyLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL3NyYy92aWV3cy9uZXdUb2RvU2VjdGlvbi5qcyIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9zcmMvdmlld3Mvc2lkZWJhci5qcyIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9zcmMvdmlld3MvdGl0bGUuanMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vc3JjL3ZpZXdzL3RvZG9Gb3JtLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL3NyYy92aWV3cy90b2RvSXRlbXMuanMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vc3JjL3ZpZXdzL3V0aWwuanMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3RvZG8tbGlzdC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0L3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vdG9kby1saXN0L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIHByb2plY3QgcHJvdG90eXBlXG5jb25zdCBwcm9qZWN0UHJvdG8gPSB7XG4gICAgZmluZEluZGV4QnlUaXRsZTogZnVuY3Rpb24odG9kb1RpdGxlKSB7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy50b2Rvcy5maW5kSW5kZXgodG9kbyA9PiB7XG4gICAgICAgICAgICByZXR1cm4gdG9kby50aXRsZSA9PT0gdG9kb1RpdGxlO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGluZGV4O1xuICAgIH0sXG4gICAgYWRkVG9kbzogZnVuY3Rpb24obmV3VG9kbykge1xuICAgICAgICB0aGlzLnRvZG9zLnB1c2gobmV3VG9kbyk7XG4gICAgfSxcbiAgICBkZWxldGVUb2RvOiBmdW5jdGlvbih0b2RvVGl0bGUpIHtcbiAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLmZpbmRJbmRleEJ5VGl0bGUodG9kb1RpdGxlKTtcbiAgICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgICAgICAgdGhpcy50b2Rvcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBkZWxldGVBY3RpdmVUb2RvOiBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLmZpbmRJbmRleEJ5VGl0bGUodGhpcy5hY3RpdmVUb2RvLnRpdGxlKTtcbiAgICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgICAgICAgdGhpcy5hY3RpdmVUb2RvID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMudG9kb3Muc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgc2V0QWN0aXZlVG9kbzogZnVuY3Rpb24odG9kb1RpdGxlKSB7XG4gICAgICAgIC8vIElmIHNldEFjdGl2ZVRvZG8gaXMgY2FsbGVkIHdpdGggbm8gYXJndW1lbnRzLCBzZXQgYWN0aXZlVG9kbyB0byBudWxsXG4gICAgICAgIGlmICh0b2RvVGl0bGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5hY3RpdmVUb2RvID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5maW5kSW5kZXhCeVRpdGxlKHRvZG9UaXRsZSk7XG4gICAgICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlVG9kbyA9IHRoaXMudG9kb3NbaW5kZXhdO1xuICAgICAgICB9XG4gICAgfVxufTtcblxuLy8gcHJvamVjdCBmYWN0b3J5IGZ1bmN0aW9uXG5mdW5jdGlvbiBwcm9qZWN0KG5hbWUpIHtcbiAgICBjb25zdCB0b2RvcyA9IFtdO1xuICAgIGxldCBhY3RpdmVUb2RvID0gbnVsbDtcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKHByb2plY3RQcm90byksIHtcbiAgICAgICAgbmFtZSxcbiAgICAgICAgYWN0aXZlVG9kbyxcbiAgICAgICAgdG9kb3NcbiAgICB9KTtcbn1cblxuZXhwb3J0IHsgcHJvamVjdCB9OyIsIi8vIHRvZG8gcHJvdG90eXBlXG5jb25zdCB0b2RvUHJvdG8gPSB7XG4gICAgY2hhbmdlVGl0bGU6IGZ1bmN0aW9uKG5ld1RpdGxlKSB7XG4gICAgICAgIHRoaXMudGl0bGUgPSBuZXdUaXRsZTtcbiAgICB9LFxuICAgIGNoYW5nZURlc2NyaXB0aW9uOiBmdW5jdGlvbihuZXdEZXNjcmlwdGlvbikge1xuICAgICAgICB0aGlzLmRlc2NyaXB0aW9uID0gbmV3RGVzY3JpcHRpb247XG4gICAgfSwgICAgXG4gICAgY2hhbmdlRHVlRGF0ZTogZnVuY3Rpb24obmV3RHVlRGF0ZSkge1xuICAgICAgICB0aGlzLmR1ZURhdGUgPSBuZXdEdWVEYXRlO1xuICAgIH0sXG4gICAgY2hhbmdlUHJpb3JpdHk6IGZ1bmN0aW9uKG5ld1ByaW9yaXR5KSB7XG4gICAgICAgIHRoaXMucHJpb3JpdHkgPSBuZXdQcmlvcml0eTtcbiAgICB9LFxuICAgIHRvZ2dsZUNvbXBsZXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5jb21wbGV0ZSA9ICF0aGlzLmNvbXBsZXRlO1xuICAgIH0sXG4gICAgdXBkYXRlOiBmdW5jdGlvbihuZXdUaXRsZSwgbmV3RGVzY3JpcHRpb24sIG5ld0R1ZURhdGUsIG5ld1ByaW9yaXR5KSB7XG4gICAgICAgIHRoaXMuY2hhbmdlVGl0bGUobmV3VGl0bGUpO1xuICAgICAgICB0aGlzLmNoYW5nZURlc2NyaXB0aW9uKG5ld0Rlc2NyaXB0aW9uKTtcbiAgICAgICAgdGhpcy5jaGFuZ2VEdWVEYXRlKG5ld0R1ZURhdGUpO1xuICAgICAgICB0aGlzLmNoYW5nZVByaW9yaXR5KG5ld1ByaW9yaXR5KTtcbiAgICB9XG59O1xuXG4vLyB0b2RvIGZhY3RvcnkgZnVuY3Rpb25cbmZ1bmN0aW9uIHRvZG8odGl0bGUsIGRlc2NyaXB0aW9uLCBkdWVEYXRlLCBwcmlvcml0eSkge1xuICAgIHJldHVybiBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUodG9kb1Byb3RvKSwge1xuICAgICAgICB0aXRsZSxcbiAgICAgICAgZGVzY3JpcHRpb24sXG4gICAgICAgIGR1ZURhdGUsXG4gICAgICAgIHByaW9yaXR5LFxuICAgICAgICBjb21wbGV0ZTogZmFsc2VcbiAgICB9KTtcbn1cblxuZXhwb3J0IHsgdG9kbyB9OyIsImltcG9ydCB7IHRvZG8gfSBmcm9tICcuLi9mYWN0b3J5X2Z1bmN0aW9ucy90b2RvLmpzJztcbmltcG9ydCB7IHByb2plY3QgfSBmcm9tICcuLi9mYWN0b3J5X2Z1bmN0aW9ucy9wcm9qZWN0LmpzJztcbmltcG9ydCB7IHB1YlN1YiB9IGZyb20gJy4vcHViU3ViLmpzJztcblxuLy8gYXBwIG1vZHVsZSBjb250YWlucyB0b2RvIGxpc3QgYXBwbGljYXRpb24gZGF0YSBhbmQgZnVuY3Rpb25hbGl0eVxuY29uc3QgYXBwID0gKGZ1bmN0aW9uKCkge1xuICAgIGxldCBfcHJvamVjdHMgPSBbXTtcbiAgICBsZXQgX2FjdGl2ZVByb2plY3Q7XG5cbiAgICAvLyBfZ2V0U3RhdGVEYXRhIGZ1bmN0aW9uIC0gYnVuZGxlcyBhcHAgc3RhdGUgZGF0YSAoX3Byb2plY3RzIGFuZCBfYWN0aXZlUHJvamVjdCkgZm9yIHB1Ymxpc2hpbmcgdGhyb3VnaCBwdWJTdWJcbiAgICBmdW5jdGlvbiBfZ2V0U3RhdGVEYXRhKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcHJvamVjdHM6IF9wcm9qZWN0cyxcbiAgICAgICAgICAgIGFjdGl2ZVByb2plY3Q6IF9hY3RpdmVQcm9qZWN0LFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8vIF9nZXRQcm9qZWN0RnJvbU5hbWUgZnVuY3Rpb24gLSBvYnRhaW5zIHRoZSBwcm9qZWN0IG9iamVjdCB3aXRoIGEgbWF0Y2hpbmcgcHJvamVjdCBuYW1lXG4gICAgZnVuY3Rpb24gX2dldFByb2plY3RGcm9tTmFtZShwcm9qZWN0TmFtZSkge1xuICAgICAgICBjb25zdCBwcm9qZWN0ID0gX3Byb2plY3RzLmZpbmQocHJvamVjdCA9PiB7XG4gICAgICAgICAgICByZXR1cm4gcHJvamVjdC5uYW1lID09PSBwcm9qZWN0TmFtZTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBwcm9qZWN0O1xuICAgIH1cblxuICAgIC8vIF9nZXRQcm9qZWN0SW5kZXhGcm9tTmFtZSAtIG9idGFpbnMgdGhlIGluZGV4IG9mIHRoZSBwcm9qZWN0IHdpdGggdGhlIHNwZWNpZmllZCBuYW1lIHdpdGhpbiB0aGUgX3Byb2plY3RzIGFycmF5XG4gICAgZnVuY3Rpb24gX2dldFByb2plY3RJbmRleEZyb21OYW1lKHByb2plY3ROYW1lKSB7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gX3Byb2plY3RzLmZpbmRJbmRleChwcm9qZWN0ID0+IHtcbiAgICAgICAgICAgIHJldHVybiBwcm9qZWN0Lm5hbWUgPT09IHByb2plY3ROYW1lO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGluZGV4O1xuICAgIH1cblxuICAgIC8vIF9pc1VuaXF1ZVRvZG9UaXRsZSBmdW5jdGlvbiAtIFJldHVybnMgdHJ1ZSBpZiB0b2RvIGhhcyBhIHZhbGlkIHVuaXF1ZSBuYW1lXG4gICAgZnVuY3Rpb24gX2lzVW5pcXVlVG9kb1RpdGxlKHRpdGxlLCBpc1VwZGF0ZSkge1xuICAgICAgICBjb25zdCB0b2RvVGl0bGVzID0gX2FjdGl2ZVByb2plY3QudG9kb3MubWFwKHRvZG8gPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHRvZG8udGl0bGU7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICh0b2RvVGl0bGVzLmluY2x1ZGVzKHRpdGxlKSkge1xuICAgICAgICAgICAgLy8gSWYgdGhpcyBjaGVjayBpcyBwZXJmb3JtZWQgZm9yIGEgdG9kbyB1cGRhdGUsIHRoZSB0aXRsZSBtYXkgYmUgdGhlIHNhbWUgYXMgdGhlIGFjdGl2ZVRvZG8gb2YgdGhlIGFjdGl2ZSBwcm9qZWN0XG4gICAgICAgICAgICBpZiAoaXNVcGRhdGUpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBhY3RpdmVUb2RvVGl0bGUgPSBfYWN0aXZlUHJvamVjdC5hY3RpdmVUb2RvLnRpdGxlO1xuICAgICAgICAgICAgICAgIGlmIChhY3RpdmVUb2RvVGl0bGUgPT09IHRpdGxlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gX2lzVmFsaWRUb2RvIGZ1bmN0aW9uIC0gdmFsaWRhdGVzIHRoZSBBZGQgTmV3IFRvZG8gZm9ybSB2YWx1ZXMgYW5kIHVwZGF0ZXMgdG8gZXhpc3RpbmcgdG9kb3NcbiAgICBmdW5jdGlvbiBpc1ZhbGlkVG9kbyh0aXRsZSwgZGVzY3JpcHRpb24sIGR1ZURhdGUsIHByaW9yaXR5LCBpc1VwZGF0ZSkge1xuICAgICAgICAvLyBUaXRsZSwgZGVzY3JpcHRpb24sIGR1ZURhdGUsIGFuZCBwcmlvcml0eSBmaWVsZHMgbXVzdCBhbGwgYmUgZmlsbGVkIGluXG4gICAgICAgIGxldCBhbGVydE1lc3NhZ2U7XG4gICAgICAgIGlmICghX2lzVW5pcXVlVG9kb1RpdGxlKHRpdGxlLCBpc1VwZGF0ZSkpIHtcbiAgICAgICAgICAgIGFsZXJ0TWVzc2FnZSA9ICdUb2RvIHRpdGxlIG11c3QgYmUgdW5pcXVlJztcbiAgICAgICAgfSBlbHNlIGlmICh0aXRsZSA9PT0gdW5kZWZpbmVkIHx8IHRpdGxlID09PSAnJykge1xuICAgICAgICAgICAgYWxlcnRNZXNzYWdlID0gJ1BsZWFzZSBlbnRlciBhIHRvZG8gdGl0bGUnO1xuICAgICAgICB9IGVsc2UgaWYgKGRlc2NyaXB0aW9uID09PSB1bmRlZmluZWQgfHwgZGVzY3JpcHRpb24gPT09ICcnKSB7XG4gICAgICAgICAgICBhbGVydE1lc3NhZ2UgPSAnUGxlYXNlIGVudGVyIGEgdG9kbyBkZXNjcmlwdGlvbic7XG4gICAgICAgIH0gZWxzZSBpZiAoZHVlRGF0ZSA9PT0gdW5kZWZpbmVkIHx8IGR1ZURhdGUgPT09ICcnKSB7XG4gICAgICAgICAgICBhbGVydE1lc3NhZ2UgPSAnUGxlYXNlIGVudGVyIGEgdG9kbyBkdWUgZGF0ZSc7XG4gICAgICAgIH0gZWxzZSBpZiAocHJpb3JpdHkgPT09IG51bGwpIHtcbiAgICAgICAgICAgIGFsZXJ0TWVzc2FnZSA9ICdQbGVhc2Ugc2VsZWN0IGEgdG9kbyBwcmlvcml0eSc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBwdWJTdWIucHVibGlzaCgnaW52YWxpZFRvZG9GaWVsZHMnLCBhbGVydE1lc3NhZ2UpO1xuICAgIH1cbiAgICBcbiAgICAvLyBnZXRQcm9qZWN0cyBmdW5jdGlvbnMgLSByZXR1cm5zIGFuIGFycmF5IG9mIGFwcCBwcm9qZWN0c1xuICAgIGZ1bmN0aW9uIGdldFByb2plY3RzKCkge1xuICAgICAgICByZXR1cm4gX3Byb2plY3RzO1xuICAgIH1cblxuICAgIC8vIGdldEFjdGl2ZVByb2plY3QgZnVuY3Rpb24gLSByZXR1cm5zIHRoZSBjdXJyZW50IGFjdGl2ZSBwcm9qZWN0XG4gICAgZnVuY3Rpb24gZ2V0QWN0aXZlUHJvamVjdCgpIHtcbiAgICAgICAgcmV0dXJuIF9hY3RpdmVQcm9qZWN0O1xuICAgIH1cblxuICAgIC8vIGNoYW5nZUFjdGl2ZVByb2plY3QgZnVuY3Rpb24gLSBjaGFuZ2VzIHRoZSBhY3RpdmUgYXBwbGljYXRpb24gcHJvamVjdFxuICAgIGZ1bmN0aW9uIGNoYW5nZUFjdGl2ZVByb2plY3QocHJvamVjdE5hbWUpIHtcbiAgICAgICAgY29uc3QgcHJvamVjdCA9IF9nZXRQcm9qZWN0RnJvbU5hbWUocHJvamVjdE5hbWUpO1xuICAgICAgICBfYWN0aXZlUHJvamVjdCA9IHByb2plY3Q7XG4gICAgICAgIHB1YlN1Yi5wdWJsaXNoKCdhY3RpdmVQcm9qZWN0Q2hhbmdlJywgX2dldFN0YXRlRGF0YSgpKTtcbiAgICB9XG5cbiAgICAvLyBhZGRQcm9qZWN0IGZ1bmN0aW9uIC0gYWRkcyBhIG5ldyBwcm9qZWN0IHRvIHRoZSBfcHJvamVjdHMgYXJyYXlcbiAgICBmdW5jdGlvbiBhZGRQcm9qZWN0KHByb2plY3ROYW1lKSB7XG4gICAgICAgIGNvbnN0IG5ld1Byb2plY3QgPSBwcm9qZWN0KHByb2plY3ROYW1lKTtcbiAgICAgICAgX3Byb2plY3RzLnB1c2gobmV3UHJvamVjdCk7XG4gICAgICAgIHB1YlN1Yi5wdWJsaXNoKCdwcm9qZWN0c0NoYW5nZScsIF9nZXRTdGF0ZURhdGEoKSk7XG4gICAgfVxuXG4gICAgLy8gZGVsZXRlUHJvamVjdCBmdW5jdGlvbiAtIGRlbGV0ZXMgdGhlIHByb2plY3Qgd2l0aCB0aGUgc3BlY2lmaWVkIG5hbWUgZnJvbSBfcHJvamVjdHMgYXJyYXlcbiAgICBmdW5jdGlvbiBkZWxldGVQcm9qZWN0KHByb2plY3ROYW1lKSB7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gX2dldFByb2plY3RJbmRleEZyb21OYW1lKHByb2plY3ROYW1lKTtcbiAgICAgICAgXG4gICAgICAgIC8vIElmIHRoZSBkZWxldGVkIHByb2plY3QgaXMgdGhlIGFjdGl2ZSBwcm9qZWN0LCBzZXQgdGhlIGFjdGl2ZSBwcm9qZWN0IHRvIHRoZSBmaXJzdCBpdGVtIGluIHRoZSBwcm9qZWN0cyBsaXN0XG4gICAgICAgIGxldCBhY3RpdmVQcm9qZWN0RGVsZXRlZDtcbiAgICAgICAgaWYgKF9hY3RpdmVQcm9qZWN0Lm5hbWUgPT09IHByb2plY3ROYW1lKSB7XG4gICAgICAgICAgICBhY3RpdmVQcm9qZWN0RGVsZXRlZCA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBfcHJvamVjdHMuc3BsaWNlKGluZGV4LCAxKTtcblxuICAgICAgICAvLyBTZXQgYSBuZXcgYWN0aXZlIHByb2plY3QgaWYgdGhlIGFjdGl2ZSBwcm9qZWN0IHdhcyBkZWxldGVkXG4gICAgICAgIGlmIChhY3RpdmVQcm9qZWN0RGVsZXRlZCkge1xuICAgICAgICAgICAgY29uc3QgbmV3QWN0aXZlUHJvamVjdE5hbWUgPSBfcHJvamVjdHNbMF0ubmFtZTtcbiAgICAgICAgICAgIGNoYW5nZUFjdGl2ZVByb2plY3QobmV3QWN0aXZlUHJvamVjdE5hbWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcHViU3ViLnB1Ymxpc2goJ3Byb2plY3RzQ2hhbmdlJywgX2dldFN0YXRlRGF0YSgpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIGFkZFRvZG8gZnVuY3Rpb24gLSBhZGRzIGEgdG9kbyBpdGVtIHRvIHRoZSBhY3RpdmVQcm9qZWN0XG4gICAgZnVuY3Rpb24gYWRkVG9kbyh0aXRsZSwgZGVzY3JpcHRpb24sIGR1ZURhdGUsIHByaW9yaXR5KSB7XG4gICAgICAgIC8vIENyZWF0ZSB0b2RvIGl0ZW1cbiAgICAgICAgY29uc3QgdG9kb0l0ZW0gPSB0b2RvKHRpdGxlLCBkZXNjcmlwdGlvbiwgZHVlRGF0ZSwgcHJpb3JpdHkpO1xuXG4gICAgICAgIC8vIEFwcGVuZCB0b2RvIGl0ZW0gdG8gYWN0aXZlUHJvamVjdCB0b2RvcyBhcnJheVxuICAgICAgICBfYWN0aXZlUHJvamVjdC5hZGRUb2RvKHRvZG9JdGVtKTtcblxuICAgICAgICBwdWJTdWIucHVibGlzaCgndG9kb3NDaGFuZ2UnLCBfZ2V0U3RhdGVEYXRhKCkpO1xuICAgIH1cblxuICAgIC8vIGNoYW5nZVRvZG8gZnVuY3Rpb24gLSBtb2RpZmllcyBhY3RpdmUgdG9kbyBpdGVtIG9mIGFjdGl2ZXByb2plY3QgdG8gc3BlY2lmaWVkIHBhcmFtZXRlcnNcbiAgICBmdW5jdGlvbiBjaGFuZ2VUb2RvKG5ld1RpdGxlLCBuZXdEZXNjcmlwdGlvbiwgbmV3RHVlRGF0ZSwgbmV3UHJpb3JpdHkpIHtcbiAgICAgICAgY29uc3QgYWN0aXZlVG9kbyA9IF9hY3RpdmVQcm9qZWN0LmFjdGl2ZVRvZG87XG4gICAgICAgIGFjdGl2ZVRvZG8udXBkYXRlKG5ld1RpdGxlLCBuZXdEZXNjcmlwdGlvbiwgbmV3RHVlRGF0ZSwgbmV3UHJpb3JpdHkpO1xuICAgICAgICAvLyBSZXNldCB0aGUgcHJvamVjdCBhY3RpdmUgdG9kbyB0byBudWxsIFxuICAgICAgICBfYWN0aXZlUHJvamVjdC5zZXRBY3RpdmVUb2RvKCk7XG5cbiAgICAgICAgcHViU3ViLnB1Ymxpc2goJ3RvZG9zQ2hhbmdlJywgX2dldFN0YXRlRGF0YSgpKTtcbiAgICB9XG5cbiAgICAvLyBjaGFuZ2VBY3RpdmVUb2RvIGZ1bmN0aW9uIC0gY2hhbmdlcyB0aGUgYWN0aXZlIHRvZG8gaXRlbSBmb3IgdGhlIGN1cnJlbnQgcHJvamVjdFxuICAgIGZ1bmN0aW9uIGNoYW5nZUFjdGl2ZVRvZG8odG9kb1RpdGxlKSB7XG4gICAgICAgIF9hY3RpdmVQcm9qZWN0LnNldEFjdGl2ZVRvZG8odG9kb1RpdGxlKTtcbiAgICAgICAgcHViU3ViLnB1Ymxpc2goJ3RvZG9zQ2hhbmdlJywgX2dldFN0YXRlRGF0YSgpKTtcbiAgICB9XG5cbiAgICAvLyBkZWxldGVUb2RvIGZ1bmN0aW9uIC0gZGVsZXRlcyB0aGUgYWN0aXZlIHRvZG8gaXRlbSBmcm9tIHRoZSBhY3RpdmVQcm9qZWN0XG4gICAgZnVuY3Rpb24gZGVsZXRlQWN0aXZlVG9kbygpIHtcbiAgICAgICAgX2FjdGl2ZVByb2plY3QuZGVsZXRlQWN0aXZlVG9kbygpO1xuICAgICAgICBwdWJTdWIucHVibGlzaCgndG9kb3NDaGFuZ2UnLCBfZ2V0U3RhdGVEYXRhKCkpO1xuICAgIH1cblxuICAgIC8vIHRvZ2dsZVRvZG9Db21wbGV0ZSBmdW5jdGlvbiAtIHRvZ2dsZXMgdGhlIGFjdGl2ZSB0b2RvIGl0ZW1zIGNvbXBsZXRlIHN0YXR1c1xuICAgIGZ1bmN0aW9uIHRvZ2dsZVRvZG9Db21wbGV0ZSgpIHtcbiAgICAgICAgX2FjdGl2ZVByb2plY3QuYWN0aXZlVG9kby50b2dnbGVDb21wbGV0ZSgpO1xuICAgICAgICBwdWJTdWIucHVibGlzaCgndG9kb3NDaGFuZ2UnLCBfZ2V0U3RhdGVEYXRhKCkpO1xuICAgIH1cblxuICAgIC8vIGluaXQgZnVuY3Rpb24gLSBpbml0aWFsaXplcyB0aGUgYXBwbGljYXRpb24gd2l0aCB0aGUgZ2l2ZW4gcHJvamVjdHMgYXJyYXkgZnJvbSBsb2NhbFN0b3JhZ2VcbiAgICBmdW5jdGlvbiBpbml0KHByb2plY3RzKSB7XG4gICAgICAgIC8vIENvbnZlcnQgbG9jYWxTdG9yYWdlIHByb2plY3RzIGFycmF5IHRvIG9iamVjdHMgd2l0aCBwcm90b3R5cGUgbWV0aG9kcyB1c2luZyBmYWN0b3J5IGZ1bmN0aW9uc1xuICAgICAgICBwcm9qZWN0cy5mb3JFYWNoKHByb2plY3RPYmogPT4ge1xuICAgICAgICAgICAgLy8gQ3JlYXRlIGEgbmV3IHByb2plY3RcbiAgICAgICAgICAgIGNvbnN0IG5ld1Byb2plY3QgPSBwcm9qZWN0KHByb2plY3RPYmoubmFtZSk7XG5cbiAgICAgICAgICAgIC8vIEFkZCBlYWNoIHRvZG8gdG8gdGhlIGNvcnJlc3BvbmRpbmcgcHJvamVjdFxuICAgICAgICAgICAgcHJvamVjdE9iai50b2Rvcy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRvZG9JdGVtID0gdG9kbyhpdGVtLnRpdGxlLCBpdGVtLmRlc2NyaXB0aW9uLCBpdGVtLmR1ZURhdGUsIGl0ZW0ucHJpb3JpdHkpO1xuICAgICAgICAgICAgICAgIG5ld1Byb2plY3QuYWRkVG9kbyh0b2RvSXRlbSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gQWRkIHByb2plY3QgdG8gX3Byb2plY3RzIGFycmF5XG4gICAgICAgICAgICBfcHJvamVjdHMucHVzaChuZXdQcm9qZWN0KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gU2V0IHRoZSBhY3RpdmUgcHJvamVjdCB0byB0aGUgZmlyc3QgaXRlbSBpbiB0aGUgYXJyYXlcbiAgICAgICAgX2FjdGl2ZVByb2plY3QgPSBfcHJvamVjdHNbMF07XG5cbiAgICAgICAgLy8gUHVibGlzaCAnaW5pdGlhbGl6ZScgZXZlbnRcbiAgICAgICAgcHViU3ViLnB1Ymxpc2goJ2FwcEluaXQnLCBfZ2V0U3RhdGVEYXRhKCkpO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIGlzVmFsaWRUb2RvLFxuICAgICAgICBnZXRQcm9qZWN0cyxcbiAgICAgICAgZ2V0QWN0aXZlUHJvamVjdCxcbiAgICAgICAgY2hhbmdlQWN0aXZlUHJvamVjdCxcbiAgICAgICAgYWRkUHJvamVjdCxcbiAgICAgICAgZGVsZXRlUHJvamVjdCxcbiAgICAgICAgYWRkVG9kbyxcbiAgICAgICAgY2hhbmdlVG9kbyxcbiAgICAgICAgY2hhbmdlQWN0aXZlVG9kbyxcbiAgICAgICAgZGVsZXRlQWN0aXZlVG9kbyxcbiAgICAgICAgdG9nZ2xlVG9kb0NvbXBsZXRlLFxuICAgICAgICBpbml0XG4gICAgfTtcbn0pKCk7XG5cbmV4cG9ydCB7IGFwcCB9OyIsImltcG9ydCB7IHB1YlN1YiB9IGZyb20gJy4vcHViU3ViLmpzJztcbmltcG9ydCB7IGFwcCB9IGZyb20gJy4vYXBwLmpzJztcbmltcG9ydCB7IHZpZXdDb250cm9sbGVyIH0gZnJvbSAnLi92aWV3Q29udHJvbGxlci5qcyc7XG5cbi8vIEV2ZW50cyBtb2R1bGUgLSBjb29yZGluYXRlcyBldmVudCBhZGRpdGlvbi9tb2RpZmljYXRpb24gdG8gZG9tIG5vZGVzXG5jb25zdCBldmVudHMgPSAoZnVuY3Rpb24oKSB7XG4gICAgLyogRXZlbnQgaGFuZGxlciBmdW5jdGlvbnMgKi9cbiAgICAvLyBfY3JlYXRlTmV3UHJvamVjdCBmdW5jdGlvbiAtIENyZWF0ZXMgYSBuZXcgcHJvamVjdFxuICAgIGZ1bmN0aW9uIF9jcmVhdGVOZXdQcm9qZWN0KCkge1xuICAgICAgICAvLyBFeHRyYWN0IG5ldyBwcm9qZWN0IG5hbWVcbiAgICAgICAgY29uc3QgcHJvamVjdE5hbWVJbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNhZGQtcHJvamVjdCBpbnB1dCcpO1xuICAgICAgICBjb25zdCBwcm9qZWN0TmFtZSA9IHByb2plY3ROYW1lSW5wdXQudmFsdWU7XG5cbiAgICAgICAgLy8gQWRkIHByb2plY3QgdG8gYXBwIG1vZGVsXG4gICAgICAgIGlmIChwcm9qZWN0TmFtZSkge1xuICAgICAgICAgICAgYXBwLmFkZFByb2plY3QocHJvamVjdE5hbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ2xlYXIgcHJvamVjdCBuYW1lIGZpZWxkXG4gICAgICAgIHByb2plY3ROYW1lSW5wdXQudmFsdWUgPSAnJztcbiAgICB9XG5cbiAgICAvLyBfc2VsZWN0UHJvamVjdCBmdW5jdGlvbiAtIFNldHMgdGhlIGFjdGl2ZSBwcm9qZWN0XG4gICAgZnVuY3Rpb24gX3NlbGVjdFByb2plY3QoZSkge1xuICAgICAgICBjb25zdCBwcm9qZWN0TmFtZSA9IGUudGFyZ2V0LnBhcmVudE5vZGUuZ2V0QXR0cmlidXRlKCdkYXRhLW5hbWUnKTtcbiAgICAgICAgYXBwLmNoYW5nZUFjdGl2ZVByb2plY3QocHJvamVjdE5hbWUpO1xuICAgIH1cblxuICAgIC8vIF9kZWxldGVQcm9qZWN0IGZ1bmN0aW9uIC0gRGVsZXRlcyB0aGUgc2VsZWN0ZWQgcHJvamVjdFxuICAgIGZ1bmN0aW9uIF9kZWxldGVQcm9qZWN0KGUpIHtcbiAgICAgICAgY29uc3QgcHJvamVjdE5hbWUgPSBlLnRhcmdldC5wYXJlbnROb2RlLmdldEF0dHJpYnV0ZSgnZGF0YS1uYW1lJyk7XG4gICAgICAgIGlmICh3aW5kb3cuY29uZmlybShgQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIGRlbGV0ZSB0aGUgJHtwcm9qZWN0TmFtZX0gcHJvamVjdD9gKSkge1xuICAgICAgICAgICAgYXBwLmRlbGV0ZVByb2plY3QocHJvamVjdE5hbWUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gX3Nob3dOZXdUb2RvRm9ybSBmdW5jdGlvbiAtIFNob3dzIHRoZSBuZXcgdG9kbyBmb3JtIGFuZCBoaWRlcyB0aGUgXCJBZGQgVG9kb1wiIGJ1dHRvblxuICAgIGZ1bmN0aW9uIF9zaG93TmV3VG9kb0Zvcm0oKSB7XG4gICAgICAgIHB1YlN1Yi5wdWJsaXNoKCdhY3RpdmF0ZU5ld1RvZG9Gb3JtJyk7XG4gICAgfVxuXG4gICAgLy8gX2V4aXROZXdUb2RvRm9ybSBmdW5jdGlvbiAtIEhpZGVzIHRoZSBuZXcgdG9kbyBmb3JtIGFuZCBkaXNwbGF5cyB0aGUgXCJBZGQgVG9kb1wiIGJ1dHRvblxuICAgIGZ1bmN0aW9uIF9leGl0TmV3VG9kb0Zvcm0oKSB7XG4gICAgICAgIHB1YlN1Yi5wdWJsaXNoKCdkaXNhYmxlTmV3VG9kb0Zvcm0nKTtcbiAgICB9XG5cbiAgICAvLyBfYWRkTmV3VG9kbyBmdW5jdGlvbiAtIEV4dHJhY3RzIGZvcm0gdmFsdWVzIGFuZCBhZGRzIGEgbmV3IHRvZG8gdG8gdGhlIGFjdGl2ZSBwcm9qZWN0XG4gICAgZnVuY3Rpb24gX2FkZE5ld1RvZG8oKSB7XG4gICAgICAgIC8vIEV4dHJhY3QgZm9ybSB2YWx1ZXNcbiAgICAgICAgY29uc3QgdGl0bGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbmV3LXRpdGxlJykudmFsdWU7XG4gICAgICAgIGNvbnN0IGRlc2NyaXB0aW9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI25ldy1kZXNjcmlwdGlvbicpLnZhbHVlO1xuICAgICAgICBjb25zdCBkdWVEYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI25ldy1kYXRlJykudmFsdWU7XG4gICAgICAgIGNvbnN0IHByaW9yaXR5SW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdpbnB1dFtuYW1lPVwibmV3LXByaW9yaXR5XCJdOmNoZWNrZWQnKTtcbiAgICAgICAgbGV0IHByaW9yaXR5O1xuICAgICAgICBpZiAocHJpb3JpdHlJbnB1dCkge1xuICAgICAgICAgICAgcHJpb3JpdHkgPSBwcmlvcml0eUlucHV0LnZhbHVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcHJpb3JpdHkgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGFwcC5pc1ZhbGlkVG9kbyh0aXRsZSwgZGVzY3JpcHRpb24sIGR1ZURhdGUsIHByaW9yaXR5LCBmYWxzZSkpIHtcbiAgICAgICAgICAgIGFwcC5hZGRUb2RvKHRpdGxlLCBkZXNjcmlwdGlvbiwgZHVlRGF0ZSwgcHJpb3JpdHkpOyBcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIF9zZXRBY3RpdmVUb2RvIGZ1bmN0aW9uIC0gU2V0cyBhbiBpbmFjdGl2ZSB0b2RvIHRvIGFjdGl2ZVxuICAgIGZ1bmN0aW9uIF9zZXRBY3RpdmVUb2RvKGUpIHtcbiAgICAgICAgY29uc3QgdG9kb1RpdGxlID0gZS50YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLXRpdGxlJyk7XG4gICAgICAgIGFwcC5jaGFuZ2VBY3RpdmVUb2RvKHRvZG9UaXRsZSk7XG4gICAgfVxuXG4gICAgLy8gX3RvZ2dsZVRvZG9Db21wbGV0ZSBmdW5jdGlvbiAtIFRvZ2dsZXMgdGhlIGFjdGl2ZSB0b2RvJ3MgY29tcGxldGlvbiBzdGF0dXNcbiAgICBmdW5jdGlvbiBfdG9nZ2xlVG9kb0NvbXBsZXRlKCkge1xuICAgICAgICBhcHAudG9nZ2xlVG9kb0NvbXBsZXRlKCk7XG4gICAgfVxuXG4gICAgLy8gX2RlbGV0ZUFjdGl2ZVRvZG8gZnVuY3Rpb24gLSBEZWxldGVzIHRoZSBhY3RpdmUgdG9kb1xuICAgIGZ1bmN0aW9uIF9kZWxldGVBY3RpdmVUb2RvKCkge1xuICAgICAgICBpZih3aW5kb3cuY29uZmlybSgnRG8geW91IHdhbnQgdG8gZGVsZXRlIHRoaXMgdG9kbyBpdGVtPycpKSB7XG4gICAgICAgICAgICBhcHAuZGVsZXRlQWN0aXZlVG9kbygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gX3VwZGF0ZUFjdGl2ZVRvZG8gZnVuY3Rpb24gLSBVcGRhdGVzIHRoZSBhY3RpdmUgdG9kbyBmdW5jdGlvbiB3aXRoIHVwZGF0ZWQgZm9ybSB2YWx1ZXNcbiAgICBmdW5jdGlvbiBfdXBkYXRlQWN0aXZlVG9kbygpIHtcbiAgICAgICAgLy8gRXh0cmFjdCBmb3JtIHZhbHVlc1xuICAgICAgICBjb25zdCBuZXdUaXRsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN1cGRhdGUtdGl0bGUnKS52YWx1ZTtcbiAgICAgICAgY29uc3QgbmV3RGVzY3JpcHRpb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjdXBkYXRlLWRlc2NyaXB0aW9uJykudmFsdWU7XG4gICAgICAgIGNvbnN0IG5ld0R1ZURhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjdXBkYXRlLWRhdGUnKS52YWx1ZTtcbiAgICAgICAgY29uc3QgbmV3UHJpb3JpdHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdpbnB1dFtuYW1lPVwidXBkYXRlLXByaW9yaXR5XCJdOmNoZWNrZWQnKS52YWx1ZTtcblxuICAgICAgICBpZiAoYXBwLmlzVmFsaWRUb2RvKG5ld1RpdGxlLCBuZXdEZXNjcmlwdGlvbiwgbmV3RHVlRGF0ZSwgbmV3UHJpb3JpdHksIHRydWUpKSB7XG4gICAgICAgICAgICBhcHAuY2hhbmdlVG9kbyhuZXdUaXRsZSwgbmV3RGVzY3JpcHRpb24sIG5ld0R1ZURhdGUsIG5ld1ByaW9yaXR5KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qIEV2ZW50IFNldHRpbmcgZnVuY3Rpb25zIC0gVGhlc2UgZnVuY3Rpb25zIGFwcGx5IGV2ZW50IGhhbmRsZXJzIHRvIERPTSBlbGVtZW50cyAqL1xuXG4gICAgLy8gX2Fzc2lnbk5ld1Byb2plY3RFdmVudCBmdW5jdGlvbiAtIEFkZHMgZXZlbnQgaGFuZGxlciB0byB0aGUgc2lkZWJhciBOZXcgUHJvamVjdCBidXR0b25cbiAgICBmdW5jdGlvbiBfYXNzaWduTmV3UHJvamVjdEV2ZW50KCkge1xuICAgICAgICBjb25zdCBuZXdQcm9qZWN0QnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2FkZC1wcm9qZWN0LWJ0bicpO1xuICAgICAgICBuZXdQcm9qZWN0QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgX2NyZWF0ZU5ld1Byb2plY3QpO1xuICAgIH1cblxuICAgIC8vIF9hc3NpZ25Qcm9qZWN0RXZlbnRzIGZ1bmN0aW9uIC0gQWRkcyBldmVudCBoYW5kbGVycyB0byBwcm9qZWN0IGl0ZW1zIGluIHRoZSBzaWRlYmFyXG4gICAgZnVuY3Rpb24gX2Fzc2lnblByb2plY3RFdmVudHMoKSB7XG4gICAgICAgIGNvbnN0IHByb2plY3RJdGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5wcm9qZWN0LW5hbWUnKTtcbiAgICAgICAgcHJvamVjdEl0ZW1zLmZvckVhY2gocHJvamVjdCA9PiB7XG4gICAgICAgICAgICBwcm9qZWN0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgX3NlbGVjdFByb2plY3QpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBfYXNzaWduRGVsUHJvamVjdEV2ZW50cyBmdW5jdGlvbiAtIEFkZHMgZXZlbnQgaGFuZGxlcnMgdG8gcHJvamVjdCBkZWxldGUgYnV0dG9uc1xuICAgIGZ1bmN0aW9uIF9hc3NpZ25EZWxQcm9qZWN0RXZlbnRzKCkge1xuICAgICAgICBjb25zdCBwcm9qZWN0RGVsQnV0dG9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5kZWwtcHJvamVjdCcpO1xuICAgICAgICBwcm9qZWN0RGVsQnV0dG9ucy5mb3JFYWNoKGJ1dHRvbiA9PiB7XG4gICAgICAgICAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBfZGVsZXRlUHJvamVjdCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIF9hc3NpZ25BZGRUb2RvRXZlbnQgZnVuY3Rpb24gLSBBZGQgZXZlbnQgaGFuZGxlciB0byBBZGQgVG9kbyBidXR0b25cbiAgICBmdW5jdGlvbiBfYXNzaWduQWRkVG9kb0V2ZW50KCkge1xuICAgICAgICBjb25zdCBhZGRUb2RvQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2FkZC10b2RvLWJ0bicpO1xuICAgICAgICBhZGRUb2RvQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgX3Nob3dOZXdUb2RvRm9ybSk7XG4gICAgfVxuXG4gICAgLy8gX2Fzc2lnbkNsb3NlVG9kb0V2ZW50IGZ1bmN0aW9uIC0gQWRkIGV2ZW50IGhhbmRsZXIgdG8gYnV0dG9uIHRoYXQgY2xvc2VzIHRoZSBuZXcgdG9kbyBmb3JtXG4gICAgZnVuY3Rpb24gX2Fzc2lnbkNsb3NlVG9kb0V2ZW50KCkge1xuICAgICAgICBjb25zdCBjbG9zZU5ld1RvZG9CdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjY2xvc2UtbmV3LXRvZG8tZm9ybScpO1xuICAgICAgICBjbG9zZU5ld1RvZG9CdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBfZXhpdE5ld1RvZG9Gb3JtKTtcbiAgICB9XG5cbiAgICAvLyBfYXNzaWduU3VibWl0VG9kb0V2ZW50IGZ1bmN0aW9uIC0gQWRkIGV2ZW50IGhhbmRsZXIgdG8gXCJBZGRcIiBidXR0b24gd2hpY2ggc3VibWl0cyBjb250ZW50IGZyb20gdGhlIG5ldyB0b2RvIGZvcm1cbiAgICBmdW5jdGlvbiBfYXNzaWduU3VibWl0VG9kb0V2ZW50KCkge1xuICAgICAgICBjb25zdCBzdWJtaXRUb2RvQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3N1Ym1pdC10b2RvLWJ0bicpO1xuICAgICAgICBzdWJtaXRUb2RvQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgX2FkZE5ld1RvZG8pO1xuICAgIH1cblxuICAgIC8vIF9hc3NpZ25TZXRBY3RpdmVFdmVudHMgZnVuY3Rpb24gLSBBZGRzIGV2ZW50IGhhbmRsZXJzIHRvIGluYWN0aXZlIHRvZG8gaXRlbXMgb24gdGhlIHBhZ2VcbiAgICBmdW5jdGlvbiBfYXNzaWduU2V0QWN0aXZlRXZlbnRzKCkge1xuICAgICAgICBjb25zdCBpbmFjdGl2ZVRvZG9zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmluYWN0aXZlLXRvZG8nKTtcbiAgICAgICAgaW5hY3RpdmVUb2Rvcy5mb3JFYWNoKHRvZG8gPT4ge1xuICAgICAgICAgICAgdG9kby5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIF9zZXRBY3RpdmVUb2RvKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gX2Fzc2lnblRvZ2dsZVRvZG9Db21wbGV0ZUV2ZW50IGZ1bmN0aW9uIC0gQWRkcyBldmVudCBoYW5kbGVyIHRvIGJ1dHRvbiBmb3IgdG9nZ2xpbmcgdG9kbyBjb21wbGV0aW9uXG4gICAgZnVuY3Rpb24gX2Fzc2lnblRvZ2dsZVRvZG9Db21wbGV0ZUV2ZW50KCkge1xuICAgICAgICBjb25zdCB0b2dnbGVDb21wbGV0ZUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN0b2dnbGUtY29tcGxldGUnKTtcbiAgICAgICAgaWYgKHRvZ2dsZUNvbXBsZXRlQnRuID09PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdG9nZ2xlQ29tcGxldGVCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBfdG9nZ2xlVG9kb0NvbXBsZXRlKTtcbiAgICB9XG5cbiAgICAvLyBfYXNzaWduRGVsZXRlQWN0aXZlVG9kb0V2ZW50IGZ1bmN0aW9uIC0gQWRkcyBldmVudCBoYW5kbGVyIHRvIGJ1dHRvbiB0aGF0IGRlbGV0ZXMgdGhlIGFjdGl2ZSB0b2RvXG4gICAgZnVuY3Rpb24gX2Fzc2lnbkRlbGV0ZUFjdGl2ZVRvZG9FdmVudCgpIHtcbiAgICAgICAgY29uc3QgZGVsVG9kb0J0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNkZWwtYWN0aXZlLXRvZG8nKTtcbiAgICAgICAgaWYgKGRlbFRvZG9CdG4gPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBkZWxUb2RvQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgX2RlbGV0ZUFjdGl2ZVRvZG8pO1xuICAgIH1cblxuICAgIC8vIF9hc3NpZ25VcGRhdGVBY3RpdmVUb2RvRXZlbnQgZnVuY3Rpb24gLSBBZGRzIGV2ZW50IGhhbmRsZXIgdG8gc2F2ZSBidXR0b24gdGhhdCB1cGRhdGVzIGFjdGl2ZSB0b2RvIGluZm9ybWF0aW9uXG4gICAgZnVuY3Rpb24gX2Fzc2lnblVwZGF0ZUFjdGl2ZVRvZG9FdmVudCgpIHtcbiAgICAgICAgY29uc3Qgc2F2ZUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzYXZlLWJ0bicpO1xuICAgICAgICBpZiAoc2F2ZUJ0biA9PT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHNhdmVCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBfdXBkYXRlQWN0aXZlVG9kbyk7XG4gICAgfVxuXG4gICAgLy8gX2Fzc2lnblNpZGViYXJFdmVudHMgd3JhcHBlciBmdW5jdGlvbiAtIEFkZCBldmVudCBoYW5kbGVycyB0byB0aGUgUHJvamVjdHMgc2lkZSBiYXJcbiAgICBmdW5jdGlvbiBfYXNzaWduU2lkZWJhckV2ZW50cygpIHtcbiAgICAgICAgX2Fzc2lnbk5ld1Byb2plY3RFdmVudCgpO1xuICAgICAgICBfYXNzaWduUHJvamVjdEV2ZW50cygpO1xuICAgICAgICBfYXNzaWduRGVsUHJvamVjdEV2ZW50cygpXG4gICAgfVxuXG4gICAgLy8gX2Fzc2lnbk5ld1RvZG9FdmVudHMgd3JhcHBlciBmdW5jdGlvbiAtIEFkZCBldmVudCBoYW5kbGVycyBhc3NvY2lhdGVkIHdpdGggYWRkaW5nIGEgbmV3IHRvZG9cbiAgICBmdW5jdGlvbiBfYXNzaWduTmV3VG9kb0V2ZW50cygpIHtcbiAgICAgICAgX2Fzc2lnbkFkZFRvZG9FdmVudCgpO1xuICAgICAgICBfYXNzaWduQ2xvc2VUb2RvRXZlbnQoKTtcbiAgICAgICAgX2Fzc2lnblN1Ym1pdFRvZG9FdmVudCgpO1xuICAgIH1cblxuICAgIC8vIF9hc3NpZ25Ub2RvTGlzdEV2ZW50cyB3cmFwcGVyIGZ1bmN0aW9uIC0gQWRkIGV2ZW50IGhhbmRsZXJzIHRvIFRvZG8gSXRlbXMgc2VjdGlvblxuICAgIGZ1bmN0aW9uIF9hc3NpZ25Ub2RvTGlzdEV2ZW50cygpIHtcbiAgICAgICAgX2Fzc2lnblNldEFjdGl2ZUV2ZW50cygpO1xuICAgICAgICBfYXNzaWduVG9nZ2xlVG9kb0NvbXBsZXRlRXZlbnQoKTtcbiAgICAgICAgX2Fzc2lnbkRlbGV0ZUFjdGl2ZVRvZG9FdmVudCgpO1xuICAgICAgICBfYXNzaWduVXBkYXRlQWN0aXZlVG9kb0V2ZW50KCk7XG4gICAgfVxuXG4vKlxuICAgIC8vIF9hc3NpZ25NYWluRXZlbnRzIHdyYXBwZXIgZnVuY3Rpb24gLSBBZGQgZXZlbnQgaGFuZGxlcnMgdG8gdGhlIG1haW4gcGFnZSBUb2RvIGxpc3QgY29udGVudFxuICAgIGZ1bmN0aW9uIF9hc3NpZ25NYWluRXZlbnRzKCkge1xuICAgICAgICBfYXNzaWduTmV3VG9kb0V2ZW50cygpO1xuICAgICAgICBfYXNzaWduVG9kb0xpc3RFdmVudHMoKTtcbiAgICB9XG5cbiAgICAvLyBfYXNzaWduRnVsbFBhZ2VFdmVudHMgd3JhcHBlciBmdW5jdGlvbiAtIEFkZHMgZXZlbnQgaGFuZGxlcnMgdG8gdGhlIGVudGlyZSBwYWdlXG4gICAgZnVuY3Rpb24gX2Fzc2lnbkZ1bGxQYWdlRXZlbnRzKCkge1xuICAgICAgICBfYXNzaWduU2lkZWJhckV2ZW50cygpO1xuICAgICAgICBfYXNzaWduTWFpbkV2ZW50cygpO1xuICAgIH1cbiovXG4gICAgXG4gICAgLy8gaW5pdCBmdW5jdGlvbiAtIGNyZWF0ZXMgcHViU3ViIHN1YnNjcmlwdGlvbnNcbiAgICBmdW5jdGlvbiBpbml0KCkge1xuICAgICAgICAvLyBwdWJTdWIuc3Vic2NyaWJlKCdmdWxsUGFnZVJlbmRlcicsIF9hc3NpZ25GdWxsUGFnZUV2ZW50cyk7XG4gICAgICAgIC8vIE9uIHByb2plY3RzUmVuZGVyLCBhc3NpZ24gZXZlbnQgaGFuZGxlcnMgdG8gdGhlIHByb2plY3RzIHNpZGViYXJcbiAgICAgICAgcHViU3ViLnN1YnNjcmliZSgncHJvamVjdHNSZW5kZXInLCBfYXNzaWduU2lkZWJhckV2ZW50cyk7XG5cbiAgICAgICAgLy8gT24gbmV3VG9kb0NvbnRlbnRSZW5kZXIsIGFzc2lnbiBhc3NvY2lhdGVkIGZvcm0gZXZlbnQgaGFuZGxlcnNcbiAgICAgICAgcHViU3ViLnN1YnNjcmliZSgnbmV3VG9kb0NvbnRlbnRSZW5kZXInLCBfYXNzaWduTmV3VG9kb0V2ZW50cyk7XG5cbiAgICAgICAgLy8gT24gdG9kb3NSZW5kZXIsIGFzc2lnbiBhc3NvY2lhdGVkIHBhZ2UgZXZlbnQgaGFuZGxlcnNcbiAgICAgICAgcHViU3ViLnN1YnNjcmliZSgndG9kb3NSZW5kZXInLCBfYXNzaWduVG9kb0xpc3RFdmVudHMpO1xuXG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBpbml0XG4gICAgfTtcbn0pKCk7XG5cbmV4cG9ydCB7IGV2ZW50cyB9OyIsImNvbnN0IHB1YlN1YiA9IHtcbiAgICBldmVudHM6IHt9LFxuICAgIHN1YnNjcmliZTogZnVuY3Rpb24oZXZlbnROYW1lLCBmbikge1xuICAgICAgICB0aGlzLmV2ZW50c1tldmVudE5hbWVdID0gdGhpcy5ldmVudHNbZXZlbnROYW1lXSB8fCBbXTtcbiAgICAgICAgdGhpcy5ldmVudHNbZXZlbnROYW1lXS5wdXNoKGZuKTtcbiAgICB9LFxuICAgIHVuc3Vic2NyaWJlOiBmdW5jdGlvbihldmVudE5hbWUsIGZuKSB7XG4gICAgICAgIGlmICh0aGlzLmV2ZW50c1tldmVudE5hbWVdKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5ldmVudHNbZXZlbnROYW1lXS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMuZXZlbnRzW2V2ZW50TmFtZV1baV0gPT09IGZuKSB7XG4gICAgICAgICAgICB0aGlzLmV2ZW50c1tldmVudE5hbWVdLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfSxcbiAgICBwdWJsaXNoOiBmdW5jdGlvbihldmVudE5hbWUsIGRhdGEpIHtcbiAgICAgICAgaWYgKHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0pIHtcbiAgICAgICAgdGhpcy5ldmVudHNbZXZlbnROYW1lXS5mb3JFYWNoKGZ1bmN0aW9uKGZuKSB7XG4gICAgICAgICAgICBmbihkYXRhKTtcbiAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5leHBvcnQgeyBwdWJTdWIgfTsiLCJpbXBvcnQgeyBwdWJTdWIgfSBmcm9tICcuL3B1YlN1Yi5qcyc7XG5cbi8vIFN0b3JhZ2UgbW9kdWxlIC0gaGFuZGxlcyBzdG9yYWdlL3JldHJpZXZhbCBvZiBicm93c2VyIGxvY2FsU3RvcmFnZSBkYXRhXG5jb25zdCBzdG9yYWdlID0gKGZ1bmN0aW9uKCkge1xuICAgIC8vIGluaXQgZnVuY3Rpb24gLSBTZXRzIHVwIHB1YlN1YiBzdWJzY3JpcHRpb25zXG4gICAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIGluaXRcbiAgICB9O1xufSkoKTtcblxuZXhwb3J0IHsgc3RvcmFnZSB9OyIsImltcG9ydCB7IGNyZWF0ZVNpZGViYXJDb250ZW50IH0gZnJvbSAnLi4vdmlld3Mvc2lkZWJhci5qcyc7XG5pbXBvcnQgeyBjcmVhdGVQcm9qZWN0VGl0bGVDb250ZW50IH0gZnJvbSAnLi4vdmlld3MvdGl0bGUuanMnO1xuaW1wb3J0IHsgY3JlYXRlTmV3VG9kb0NvbnRlbnQgfSBmcm9tICcuLi92aWV3cy9uZXdUb2RvU2VjdGlvbi5qcyc7XG5pbXBvcnQgeyBjcmVhdGVUb2RvTGlzdENvbnRlbnQgfSBmcm9tICcuLi92aWV3cy90b2RvSXRlbXMuanMnO1xuaW1wb3J0IHsgcHViU3ViIH0gZnJvbSAnLi9wdWJTdWIuanMnO1xuXG4vLyB2aWV3Q29udHJvbGxlciBtb2R1bGUgLSBjb250cm9scyBET00gbWFuaXB1bGF0aW9uXG5jb25zdCB2aWV3Q29udHJvbGxlciA9IChmdW5jdGlvbigpIHtcbiAgICAvLyBfc2hvd05ld1RvZG9Gb3JtIGZ1bmN0aW9uIC0gTWFrZXMgdGhlIFwiQWRkIE5ldyBUb2RvXCIgZm9ybSB2aXNpYmxlXG4gICAgZnVuY3Rpb24gX3Nob3dOZXdUb2RvRm9ybSgpIHtcbiAgICAgICAgY29uc3QgZm9ybSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5hZGQtdG9kbycpO1xuICAgICAgICBjb25zdCBmb3JtVG9nZ2xlQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2FkZC10b2RvLWJ0bicpO1xuICAgICAgICBmb3JtLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICBmb3JtVG9nZ2xlQnRuLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgfVxuXG4gICAgLy8gX2hpZGVOZXdUb2RvRm9ybSBmdW5jdGlvbiAtIEhpZGVzIHRoZSBcIkFkZCBOZXcgVG9kb1wiIGZvcm1cbiAgICBmdW5jdGlvbiBfaGlkZU5ld1RvZG9Gb3JtKCkge1xuICAgICAgICBjb25zdCBmb3JtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmFkZC10b2RvJyk7XG4gICAgICAgIGNvbnN0IGZvcm1Ub2dnbGVCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYWRkLXRvZG8tYnRuJyk7XG4gICAgICAgIGZvcm0uc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgZm9ybVRvZ2dsZUJ0bi5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICB9XG5cbiAgICAvLyBfc2hvd0FsZXJ0IGZ1bmN0aW9uIC0gYWxlcnRzIHRoZSBnaXZlbiBhbGVydCBtZXNzYWdlIHRvIHRoZSB3aW5kb3dcbiAgICBmdW5jdGlvbiBfc2hvd0FsZXJ0KGFsZXJ0TWVzc2FnZSkge1xuICAgICAgICB3aW5kb3cuYWxlcnQoYWxlcnRNZXNzYWdlKTtcbiAgICB9XG4gICAgXG4gICAgLy8gX3JlbmRlclByb2plY3RzIGZ1bmN0aW9uIC0gcmVuZGVycyBzaWRlYmFyIGNvbnRlbnRcbiAgICBmdW5jdGlvbiBfcmVuZGVyUHJvamVjdHMoZGF0YSkge1xuICAgICAgICAvLyBDbGVhciB0aGUgcHJvamVjdC1saXN0IHNpZGViYXJcbiAgICAgICAgY29uc3QgcHJvamVjdExpc3REaXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcHJvamVjdC1saXN0JylcbiAgICAgICAgcHJvamVjdExpc3REaXYudGV4dENvbnRlbnQgPSAnJztcblxuICAgICAgICAvLyBFeHRyYWN0IHJlbGV2YW50IGRhdGFcbiAgICAgICAgY29uc3QgcHJvamVjdE5hbWVMaXN0ID0gZGF0YS5wcm9qZWN0cy5tYXAocHJvamVjdCA9PiB7XG4gICAgICAgICAgICByZXR1cm4gcHJvamVjdC5uYW1lO1xuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBhY3RpdmVQcm9qZWN0TmFtZSA9IGRhdGEuYWN0aXZlUHJvamVjdC5uYW1lO1xuXG4gICAgICAgIC8vIEdlbmVyYXRlIHByb2plY3QtbGlzdCBzaWRlYmFyIGh0bWxcbiAgICAgICAgY29uc3Qgc2lkZWJhckNvbnRlbnQgPSBjcmVhdGVTaWRlYmFyQ29udGVudChwcm9qZWN0TmFtZUxpc3QsIGFjdGl2ZVByb2plY3ROYW1lKTtcbiAgICAgICAgcHJvamVjdExpc3REaXYuYXBwZW5kQ2hpbGQoc2lkZWJhckNvbnRlbnQpO1xuICAgICAgICBcbiAgICAgICAgcHViU3ViLnB1Ymxpc2goJ3Byb2plY3RzUmVuZGVyJyk7XG4gICAgfVxuXG4gICAgLy8gX3JlbmRlclByb2plY3RUaXRsZSBmdW5jdGlvbiAtIHJlbmRlcnMgdGhlIHByb2plY3QgdGl0bGUgb24gdGhlIHBhZ2VcbiAgICBmdW5jdGlvbiBfcmVuZGVyUHJvamVjdFRpdGxlKGRhdGEpIHtcbiAgICAgICAgLy8gQ2xlYXIgcHJvamVjdC10aXRsZS1jb250ZW50XG4gICAgICAgIGNvbnN0IHByb2plY3RUaXRsZURpdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNwcm9qZWN0LXRpdGxlLWNvbnRlbnQnKTtcbiAgICAgICAgcHJvamVjdFRpdGxlRGl2LnRleHRDb250ZW50ID0gJyc7XG5cbiAgICAgICAgLy8gRXh0cmFjdCByZWxldmFudCBkYXRhXG4gICAgICAgIGNvbnN0IGFjdGl2ZVByb2plY3ROYW1lID0gZGF0YS5hY3RpdmVQcm9qZWN0Lm5hbWU7XG5cbiAgICAgICAgLy8gR2VuZXJhdGUgcHJvamVjdC10aXRsZSBodG1sXG4gICAgICAgIGNvbnN0IHByb2plY3RUaXRsZUNvbnRlbnQgPSBjcmVhdGVQcm9qZWN0VGl0bGVDb250ZW50KGFjdGl2ZVByb2plY3ROYW1lKTtcbiAgICAgICAgcHJvamVjdFRpdGxlRGl2LmFwcGVuZENoaWxkKHByb2plY3RUaXRsZUNvbnRlbnQpO1xuICAgICAgICBcbiAgICAgICAgcHViU3ViLnB1Ymxpc2goJ3Byb2plY3RUaXRsZVJlbmRlcicpO1xuICAgIH1cblxuICAgIC8vIF9yZW5kZXJOZXdUb2RvQ29udGVudCBmdW5jdGlvbiAtIHJlbmRlcnMgcGFnZSBjb250ZW50IHJlbGF0ZWQgdG8gYWRkaW5nIG5ldyB0b2RvXG4gICAgZnVuY3Rpb24gX3JlbmRlck5ld1RvZG9Db250ZW50KCkge1xuICAgICAgICAvLyBDbGVhciBuZXctdG9kby1jb250ZW50IGRpdlxuICAgICAgICBjb25zdCBuZXdUb2RvQ29udGVudERpdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNuZXctdG9kby1jb250ZW50Jyk7XG4gICAgICAgIG5ld1RvZG9Db250ZW50RGl2LnRleHRDb250ZW50ID0gJyc7XG5cbiAgICAgICAgLy8gR2VuZXJhdGUgbmV3LXRvZG8tY29udGVudCBodG1sXG4gICAgICAgIGNvbnN0IG5ld1RvZG9Db250ZW50ID0gY3JlYXRlTmV3VG9kb0NvbnRlbnQoKTtcbiAgICAgICAgbmV3VG9kb0NvbnRlbnREaXYuYXBwZW5kQ2hpbGQobmV3VG9kb0NvbnRlbnQpO1xuICAgICAgICBcbiAgICAgICAgcHViU3ViLnB1Ymxpc2goJ25ld1RvZG9Db250ZW50UmVuZGVyJyk7XG4gICAgfVxuXG4gICAgLy8gX3JlbmRlclRvZG9zIGZ1bmN0aW9uIC0gcmVuZGVycyB0b2RvIGNvbnRlbnRcbiAgICBmdW5jdGlvbiBfcmVuZGVyVG9kb3MoZGF0YSkge1xuICAgICAgICAvLyBDbGVhciB0b2RvLWxpc3QtaXRlbXMgZGl2XG4gICAgICAgIGNvbnN0IHRvZG9MaXN0RGl2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3RvZG8tbGlzdCcpO1xuICAgICAgICB0b2RvTGlzdERpdi50ZXh0Q29udGVudCA9ICcnO1xuXG4gICAgICAgIC8vIEV4dHJhY3QgcmVsZXZhbnQgZGF0YVxuICAgICAgICBjb25zdCB0b2RvcyA9IGRhdGEuYWN0aXZlUHJvamVjdC50b2RvcztcbiAgICAgICAgY29uc3QgYWN0aXZlVG9kbyA9IGRhdGEuYWN0aXZlUHJvamVjdC5hY3RpdmVUb2RvO1xuXG4gICAgICAgIC8vIEdlbmVyYXRlIHRvZG8tbGlzdC1pdGVtcyBjb250ZW50XG4gICAgICAgIGNvbnN0IHRvZG9MaXN0Q29udGVudCA9IGNyZWF0ZVRvZG9MaXN0Q29udGVudCh0b2RvcywgYWN0aXZlVG9kbyk7XG4gICAgICAgIHRvZG9MaXN0RGl2LmFwcGVuZENoaWxkKHRvZG9MaXN0Q29udGVudCk7XG4gICAgICAgIFxuICAgICAgICBwdWJTdWIucHVibGlzaCgndG9kb3NSZW5kZXInKTtcbiAgICB9XG4gICAgXG4gICAgLy8gX3JlbmRlckZ1bGxQYWdlIGZ1bmN0aW9uIC0gcmVuZGVycyB0aGUgZW50aXJlIHBhZ2UncyBjb250ZW50XG4gICAgZnVuY3Rpb24gX3JlbmRlckZ1bGxQYWdlKGRhdGEpIHtcbiAgICAgICAgX3JlbmRlclByb2plY3RzKGRhdGEpO1xuICAgICAgICBfcmVuZGVyUHJvamVjdFRpdGxlKGRhdGEpO1xuICAgICAgICBfcmVuZGVyTmV3VG9kb0NvbnRlbnQoKTtcbiAgICAgICAgX3JlbmRlclRvZG9zKGRhdGEpO1xuICAgIH1cbiAgICBcbiAgICAvLyBpbml0IGZ1bmN0aW9uIC0gU3Vic2NyaWJlcyB0byBwdWJTdWIgZXZlbnRzXG4gICAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICAgICAgcHViU3ViLnN1YnNjcmliZSgnYXBwSW5pdCcsIF9yZW5kZXJGdWxsUGFnZSk7XG4gICAgICAgIHB1YlN1Yi5zdWJzY3JpYmUoJ2FjdGl2YXRlTmV3VG9kb0Zvcm0nLCBfc2hvd05ld1RvZG9Gb3JtKTtcbiAgICAgICAgcHViU3ViLnN1YnNjcmliZSgnZGlzYWJsZU5ld1RvZG9Gb3JtJywgX2hpZGVOZXdUb2RvRm9ybSk7XG4gICAgICAgIHB1YlN1Yi5zdWJzY3JpYmUoJ3Byb2plY3RzQ2hhbmdlJywgX3JlbmRlclByb2plY3RzKTtcbiAgICAgICAgcHViU3ViLnN1YnNjcmliZSgndG9kb3NDaGFuZ2UnLCBfcmVuZGVyVG9kb3MpO1xuICAgICAgICBwdWJTdWIuc3Vic2NyaWJlKCdhY3RpdmVQcm9qZWN0Q2hhbmdlJywgX3JlbmRlckZ1bGxQYWdlKTtcbiAgICAgICAgcHViU3ViLnN1YnNjcmliZSgnaW52YWxpZFRvZG9GaWVsZHMnLCBfc2hvd0FsZXJ0KTtcbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIHsgaW5pdCB9O1xufSkoKTtcblxuZXhwb3J0IHsgdmlld0NvbnRyb2xsZXIgfTsiLCJpbXBvcnQgeyBkb21VdGlsIH0gZnJvbSAnLi91dGlsLmpzJztcbmltcG9ydCB7IHRvZG9Gb3JtIH0gZnJvbSAnLi90b2RvRm9ybSc7XG5cbmZ1bmN0aW9uIGNyZWF0ZVRpdGxlU2VjdGlvbigpIHtcbiAgICAvLyBQYXJlbnRcbiAgICBjb25zdCBjb250YWluZXIgPSBkb21VdGlsLmNyZWF0ZSgnZGl2JywgJycpO1xuXG4gICAgLy8gQ2hpbGRyZW5cbiAgICBjb25zdCB0aXRsZUxhYmVsID0gZG9tVXRpbC5jcmVhdGUoJ2xhYmVsJywgJ1RpdGxlJywge1xuICAgICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgICBmb3I6ICduZXctdGl0bGUnXG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBjb25zdCB0aXRsZUlucHV0ID0gZG9tVXRpbC5jcmVhdGUoJ2lucHV0JywgJycsIHtcbiAgICAgICAgaWQ6ICduZXctdGl0bGUnLFxuICAgICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgICBuYW1lOiAnbmV3LXRpdGxlJyxcbiAgICAgICAgICAgIHR5cGU6ICd0ZXh0J1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgY29uc3QgY2hpbGRyZW4gPSBbIHRpdGxlTGFiZWwsIHRpdGxlSW5wdXQgXTtcblxuICAgIC8vIEFwcGVuZCBjaGlsZHJlbiB0byBwYXJlbnRcbiAgICBkb21VdGlsLmFwcGVuZENoaWxkcmVuKGNvbnRhaW5lciwgY2hpbGRyZW4pO1xuXG4gICAgcmV0dXJuIGNvbnRhaW5lcjtcbn1cblxuZnVuY3Rpb24gY3JlYXRlRGVzY3JpcHRpb25TZWN0aW9uKCkge1xuICAgIC8vIFBhcmVudFxuICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvbVV0aWwuY3JlYXRlKCdkaXYnLCAnJyk7XG5cbiAgICAvLyBDaGlsZHJlblxuICAgIGNvbnN0IGRlc2NyaXB0aW9uTGFiZWwgPSBkb21VdGlsLmNyZWF0ZSgnbGFiZWwnLCAnRGVzY3JpcHRpb24nLCB7XG4gICAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgICAgIGZvcjogJ25ldy1kZXNjcmlwdGlvbidcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIGNvbnN0IGRlc2NyaXB0aW9uSW5wdXQgPSBkb21VdGlsLmNyZWF0ZSgndGV4dGFyZWEnLCAnJywge1xuICAgICAgICBpZDogJ25ldy1kZXNjcmlwdGlvbicsXG4gICAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgICAgIG5hbWU6ICduZXctZGVzY3JpcHRpb24nLFxuICAgICAgICAgICAgcm93czogJzUnLFxuICAgICAgICAgICAgY29sczogJzMwJ1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgY29uc3QgY2hpbGRyZW4gPSBbIGRlc2NyaXB0aW9uTGFiZWwsIGRlc2NyaXB0aW9uSW5wdXQgXTtcblxuICAgIC8vIEFwcGVuZCBjaGlsZHJlbiB0byBwYXJlbnRcbiAgICBkb21VdGlsLmFwcGVuZENoaWxkcmVuKGNvbnRhaW5lciwgY2hpbGRyZW4pO1xuICAgIFxuICAgIHJldHVybiBjb250YWluZXI7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZURhdGVTZWN0aW9uKCkge1xuICAgIC8vIFBhcmVudFxuICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvbVV0aWwuY3JlYXRlKCdkaXYnLCAnJyk7XG5cbiAgICAvLyBDaGlsZHJlblxuICAgIGNvbnN0IGRhdGVMYWJlbCA9IGRvbVV0aWwuY3JlYXRlKCdsYWJlbCcsICdEdWUgRGF0ZScsIHtcbiAgICAgICAgYXR0cmlidXRlczoge1xuICAgICAgICAgICAgZm9yOiAnbmV3LWRhdGUnXG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBjb25zdCBkYXRlSW5wdXQgPSBkb21VdGlsLmNyZWF0ZSgnaW5wdXQnLCAnJywge1xuICAgICAgICBpZDogJ25ldy1kYXRlJyxcbiAgICAgICAgYXR0cmlidXRlczoge1xuICAgICAgICAgICAgbmFtZTogJ25ldy1kYXRlJyxcbiAgICAgICAgICAgIHR5cGU6ICdkYXRlJ1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgY29uc3QgY2hpbGRyZW4gPSBbIGRhdGVMYWJlbCwgZGF0ZUlucHV0IF07XG5cbiAgICAvLyBBcHBlbmQgY2hpbGRyZW4gdG8gcGFyZW50XG4gICAgZG9tVXRpbC5hcHBlbmRDaGlsZHJlbihjb250YWluZXIsIGNoaWxkcmVuKTtcbiAgICBcbiAgICByZXR1cm4gY29udGFpbmVyO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVQcmlvcml0eVNlY3Rpb24oKSB7XG4gICAgLy8gUGFyZW50XG4gICAgY29uc3QgY29udGFpbmVyID0gZG9tVXRpbC5jcmVhdGUoJ2RpdicsICcnKTtcblxuICAgIC8vIENoaWxkcmVuXG4gICAgY29uc3QgcCA9IGRvbVV0aWwuY3JlYXRlKCdwJywgJ1ByaW9yaXR5Jyk7XG4gICAgY29uc3QgbG93SW5wdXQgPSBkb21VdGlsLmNyZWF0ZSgnaW5wdXQnLCAnJywge1xuICAgICAgICBpZDogJ25ldy1sb3cnLFxuICAgICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgICB0eXBlOiAncmFkaW8nLFxuICAgICAgICAgICAgbmFtZTogJ25ldy1wcmlvcml0eScsXG4gICAgICAgICAgICB2YWx1ZTogJ2xvdydcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIGNvbnN0IGxvd0xhYmVsID0gZG9tVXRpbC5jcmVhdGUoJ2xhYmVsJywgJ0xvdycsIHtcbiAgICAgICAgY2xhc3M6ICdyYWRpby1sYWJlbCcsXG4gICAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgICAgIGZvcjogJ25ldy1sb3cnXG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBjb25zdCBtaWRJbnB1dCA9IGRvbVV0aWwuY3JlYXRlKCdpbnB1dCcsICcnLCB7XG4gICAgICAgIGlkOiAnbmV3LW1pZCcsXG4gICAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgICAgIHR5cGU6ICdyYWRpbycsXG4gICAgICAgICAgICBuYW1lOiAnbmV3LXByaW9yaXR5JyxcbiAgICAgICAgICAgIHZhbHVlOiAnbWlkJ1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgY29uc3QgbWlkTGFiZWwgPSBkb21VdGlsLmNyZWF0ZSgnbGFiZWwnLCAnTWlkJywge1xuICAgICAgICBjbGFzczogJ3JhZGlvLWxhYmVsJyxcbiAgICAgICAgYXR0cmlidXRlczoge1xuICAgICAgICAgICAgZm9yOiAnbmV3LW1pZCdcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIGNvbnN0IGhpZ2hJbnB1dCA9IGRvbVV0aWwuY3JlYXRlKCdpbnB1dCcsICcnLCB7XG4gICAgICAgIGlkOiAnbmV3LWhpZ2gnLFxuICAgICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgICB0eXBlOiAncmFkaW8nLFxuICAgICAgICAgICAgbmFtZTogJ25ldy1wcmlvcml0eScsXG4gICAgICAgICAgICB2YWx1ZTogJ2hpZ2gnXG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBjb25zdCBoaWdoTGFiZWwgPSBkb21VdGlsLmNyZWF0ZSgnbGFiZWwnLCAnSGlnaCcsIHtcbiAgICAgICAgY2xhc3M6ICdyYWRpby1sYWJlbCcsXG4gICAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgICAgIGZvcjogJ25ldy1oaWdoJ1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgY29uc3QgY2hpbGRyZW4gPSBbXG4gICAgICAgIHAsXG4gICAgICAgIGxvd0lucHV0LFxuICAgICAgICBsb3dMYWJlbCxcbiAgICAgICAgbWlkSW5wdXQsXG4gICAgICAgIG1pZExhYmVsLFxuICAgICAgICBoaWdoSW5wdXQsXG4gICAgICAgIGhpZ2hMYWJlbFxuICAgIF07XG5cbiAgICAvLyBBcHBlbmQgY2hpbGRyZW4gdG8gcGFyZW50XG4gICAgZG9tVXRpbC5hcHBlbmRDaGlsZHJlbihjb250YWluZXIsIGNoaWxkcmVuKTtcbiAgICBcbiAgICByZXR1cm4gY29udGFpbmVyO1xufVxuXG5cbmZ1bmN0aW9uIGNyZWF0ZUFkZFRvZG9Gb3JtRGl2KCkge1xuICAgIC8vIFBhcmVudFxuICAgIGNvbnN0IGFkZFRvZG9Gb3JtRGl2ID0gZG9tVXRpbC5jcmVhdGUoJ2RpdicsICcnLCB7IGNsYXNzOiAnYWRkLXRvZG8nIH0pO1xuXG4gICAgLy8gQ2hpbGRyZW5cbiAgICBjb25zdCBjbG9zZVRvZG9Gb3JtQnRuID0gZG9tVXRpbC5jcmVhdGUoJ2J1dHRvbicsICdYJywgeyBpZDogJ2Nsb3NlLW5ldy10b2RvLWZvcm0nIH0pO1xuICAgIGNvbnN0IGgzID0gZG9tVXRpbC5jcmVhdGUoJ2gzJywgJ0FkZCBOZXcgVG9kbycpO1xuICAgIGNvbnN0IHRpdGxlU2VjdGlvbiA9IHRvZG9Gb3JtLmNyZWF0ZVRpdGxlU2VjdGlvbignbmV3LXRpdGxlJylcbiAgICBjb25zdCBkZXNjcmlwdGlvblNlY3Rpb24gPSB0b2RvRm9ybS5jcmVhdGVEZXNjcmlwdGlvblNlY3Rpb24oJ25ldy1kZXNjcmlwdGlvbicpO1xuICAgIGNvbnN0IGRhdGVTZWN0aW9uID0gdG9kb0Zvcm0uY3JlYXRlRGF0ZVNlY3Rpb24oJ25ldy1kYXRlJyk7XG4gICAgY29uc3QgcHJpb3JpdHlTZWN0aW9uID0gdG9kb0Zvcm0uY3JlYXRlUHJpb3JpdHlTZWN0aW9uKFsgJ25ldy1sb3cnLCAnbmV3LW1pZCcsICduZXctaGlnaCcgXSxcbiAgICAgICAgWyAnbG93JywgJ21pZCcsICdoaWdoJyBdLFxuICAgICAgICBbICdMb3cnLCAnTWlkJywgJ0hpZ2gnIF0sXG4gICAgICAgICduZXctcHJpb3JpdHknICAgIFxuICAgICk7XG4gICAgY29uc3Qgc3VibWl0VG9kb0J0biA9IGRvbVV0aWwuY3JlYXRlKCdidXR0b24nLCAnQWRkJywgeyBpZDogJ3N1Ym1pdC10b2RvLWJ0bicgfSk7XG4gICAgY29uc3QgY2hpbGRyZW4gPSBbIFxuICAgICAgICBjbG9zZVRvZG9Gb3JtQnRuLFxuICAgICAgICBoMyxcbiAgICAgICAgdGl0bGVTZWN0aW9uLFxuICAgICAgICBkZXNjcmlwdGlvblNlY3Rpb24sXG4gICAgICAgIGRhdGVTZWN0aW9uLFxuICAgICAgICBwcmlvcml0eVNlY3Rpb24sXG4gICAgICAgIHN1Ym1pdFRvZG9CdG4sXG4gICAgXTtcblxuICAgIC8vIEFwcGVuZCBjaGlsZHJlbiB0byBwYXJlbnRcbiAgICBkb21VdGlsLmFwcGVuZENoaWxkcmVuKGFkZFRvZG9Gb3JtRGl2LCBjaGlsZHJlbik7XG5cbiAgICByZXR1cm4gYWRkVG9kb0Zvcm1EaXY7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZU5ld1RvZG9Db250ZW50KCkge1xuICAgIC8vIFBhcmVudFxuICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvbVV0aWwuY3JlYXRlKCdkaXYnLCAnJyk7XG5cbiAgICAvLyBDaGlsZHJlblxuICAgIGNvbnN0IGFkZFRvZG9CdG4gPSBkb21VdGlsLmNyZWF0ZSgnYnV0dG9uJywgJ0FkZCBUb2RvJywgeyBpZDogJ2FkZC10b2RvLWJ0bicgfSk7XG4gICAgY29uc3QgYWRkVG9kb0Zvcm1EaXYgPSBjcmVhdGVBZGRUb2RvRm9ybURpdigpO1xuICAgIGNvbnN0IGNoaWxkcmVuID0gWyBhZGRUb2RvQnRuLCBhZGRUb2RvRm9ybURpdiBdO1xuXG4gICAgLy8gQXBwZW5kIGNoaWxkcmVuIHRvIHBhcmVudFxuICAgIGRvbVV0aWwuYXBwZW5kQ2hpbGRyZW4oY29udGFpbmVyLCBjaGlsZHJlbik7XG5cbiAgICByZXR1cm4gY29udGFpbmVyO1xufVxuXG5leHBvcnQgeyBjcmVhdGVOZXdUb2RvQ29udGVudCB9OyIsImltcG9ydCB7IGRvbVV0aWwgfSBmcm9tICcuL3V0aWwuanMnO1xuXG5mdW5jdGlvbiBjcmVhdGVQcm9qZWN0RGl2KHByb2plY3ROYW1lLCBpc0FjdGl2ZVByb2plY3QpIHtcbiAgICAvLyBQYXJlbnRcbiAgICBjb25zdCBwcm9qZWN0RGl2Q2xhc3NMaXN0ID0gaXNBY3RpdmVQcm9qZWN0ID8gWyAncHJvamVjdCcsICdhY3RpdmUtcHJvamVjdCcgXSA6ICBbICdwcm9qZWN0JyBdO1xuICAgIGNvbnN0IHByb2plY3REaXYgPSBkb21VdGlsLmNyZWF0ZSgnZGl2JywgJycsIHtcbiAgICAgICAgY2xhc3M6IHByb2plY3REaXZDbGFzc0xpc3QsXG4gICAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgICAgICdkYXRhLW5hbWUnOiBwcm9qZWN0TmFtZVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBDaGlsZHJlblxuICAgIGNvbnN0IG5hbWVQID0gZG9tVXRpbC5jcmVhdGUoJ3AnLCBwcm9qZWN0TmFtZSwgeyBjbGFzczogJ3Byb2plY3QtbmFtZScgfSk7XG4gICAgY29uc3QgZGVsQnV0dG9uID0gZG9tVXRpbC5jcmVhdGUoJ2J1dHRvbicsICctJywgeyBjbGFzczogJ2RlbC1wcm9qZWN0JyB9KTtcbiAgICBjb25zdCBjaGlsZHJlbiA9IFsgbmFtZVAsIGRlbEJ1dHRvbiBdO1xuXG4gICAgLy8gQXBwZW5kIGNoaWxkcmVuIHRvIHBhcmVudFxuICAgIGRvbVV0aWwuYXBwZW5kQ2hpbGRyZW4ocHJvamVjdERpdiwgY2hpbGRyZW4pO1xuXG4gICAgcmV0dXJuIHByb2plY3REaXY7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVNpZGViYXJDb250ZW50KHByb2plY3ROYW1lTGlzdCwgYWN0aXZlUHJvamVjdE5hbWUpIHtcbiAgICAvLyBwYXJlbnRcbiAgICBjb25zdCBjb250YWluZXIgPSBkb21VdGlsLmNyZWF0ZSgnZGl2JywgJycpO1xuICAgIFxuICAgIC8vIGNoaWxkcmVuXG4gICAgcHJvamVjdE5hbWVMaXN0LmZvckVhY2gocHJvamVjdE5hbWUgPT4ge1xuICAgICAgICAvLyBBcHBlbmQgY2hpbGRyZW4gdG8gcGFyZW50XG4gICAgICAgIGNvbnN0IGlzQWN0aXZlUHJvamVjdCA9IHByb2plY3ROYW1lID09PSBhY3RpdmVQcm9qZWN0TmFtZTtcbiAgICAgICAgY29uc3QgcHJvamVjdERpdiA9IGNyZWF0ZVByb2plY3REaXYocHJvamVjdE5hbWUsIGlzQWN0aXZlUHJvamVjdCk7XG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmQocHJvamVjdERpdik7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gY29udGFpbmVyO1xufVxuXG5leHBvcnQgeyBjcmVhdGVTaWRlYmFyQ29udGVudCB9OyIsImltcG9ydCB7IGRvbVV0aWwgfSBmcm9tICcuL3V0aWwuanMnO1xuXG5mdW5jdGlvbiBjcmVhdGVQcm9qZWN0VGl0bGVDb250ZW50KGFjdGl2ZVByb2plY3ROYW1lKSB7XG4gICAgY29uc3QgaDIgPSBkb21VdGlsLmNyZWF0ZSgnaDInLCBhY3RpdmVQcm9qZWN0TmFtZSk7XG4gICAgcmV0dXJuIGgyO1xufVxuXG5leHBvcnQgeyBjcmVhdGVQcm9qZWN0VGl0bGVDb250ZW50IH07IiwiaW1wb3J0IHsgZG9tVXRpbCB9IGZyb20gJy4vdXRpbC5qcyc7XG5cbi8vIHRvZG9Gb3JtIG1vZHVsZSAtIGdlbmVyYXRlcyBmb3JtIGZpZWxkcyB1dGlsaXplZCBieSB0aGUgbmV3IHRvZG8gYW5kIGFjdGl2ZSB0b2RvIHNlY3Rpb25zXG5jb25zdCB0b2RvRm9ybSA9IChmdW5jdGlvbigpIHtcblxuICAgIGZ1bmN0aW9uIGNyZWF0ZVRpdGxlU2VjdGlvbihpZCwgaW5pdGlhbFZhbHVlPScnKSB7XG4gICAgICAgIC8vIFBhcmVudFxuICAgICAgICBjb25zdCBjb250YWluZXIgPSBkb21VdGlsLmNyZWF0ZSgnZGl2JywgJycpO1xuICAgIFxuICAgICAgICAvLyBDaGlsZHJlblxuICAgICAgICBjb25zdCB0aXRsZUxhYmVsID0gZG9tVXRpbC5jcmVhdGUoJ2xhYmVsJywgJ1RpdGxlJywge1xuICAgICAgICAgICAgYXR0cmlidXRlczoge1xuICAgICAgICAgICAgICAgIGZvcjogaWRcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IHRpdGxlSW5wdXQgPSBkb21VdGlsLmNyZWF0ZSgnaW5wdXQnLCAnJywge1xuICAgICAgICAgICAgaWQ6IGlkLFxuICAgICAgICAgICAgYXR0cmlidXRlczoge1xuICAgICAgICAgICAgICAgIG5hbWU6IGlkLFxuICAgICAgICAgICAgICAgIHR5cGU6ICd0ZXh0JyxcbiAgICAgICAgICAgICAgICB2YWx1ZTogaW5pdGlhbFZhbHVlXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCBjaGlsZHJlbiA9IFsgdGl0bGVMYWJlbCwgdGl0bGVJbnB1dCBdO1xuICAgIFxuICAgICAgICAvLyBBcHBlbmQgY2hpbGRyZW4gdG8gcGFyZW50XG4gICAgICAgIGRvbVV0aWwuYXBwZW5kQ2hpbGRyZW4oY29udGFpbmVyLCBjaGlsZHJlbik7XG4gICAgXG4gICAgICAgIHJldHVybiBjb250YWluZXI7XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIGNyZWF0ZURlc2NyaXB0aW9uU2VjdGlvbihpZCwgaW5pdGlhbFZhbHVlPScnKSB7XG4gICAgICAgIC8vIFBhcmVudFxuICAgICAgICBjb25zdCBjb250YWluZXIgPSBkb21VdGlsLmNyZWF0ZSgnZGl2JywgJycpO1xuICAgIFxuICAgICAgICAvLyBDaGlsZHJlblxuICAgICAgICBjb25zdCBkZXNjcmlwdGlvbkxhYmVsID0gZG9tVXRpbC5jcmVhdGUoJ2xhYmVsJywgJ0Rlc2NyaXB0aW9uJywge1xuICAgICAgICAgICAgYXR0cmlidXRlczoge1xuICAgICAgICAgICAgICAgIGZvcjogaWRcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IGRlc2NyaXB0aW9uSW5wdXQgPSBkb21VdGlsLmNyZWF0ZSgndGV4dGFyZWEnLCBpbml0aWFsVmFsdWUsIHtcbiAgICAgICAgICAgIGlkOiBpZCxcbiAgICAgICAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgICAgICAgICBuYW1lOiBpZCxcbiAgICAgICAgICAgICAgICByb3dzOiAnNScsXG4gICAgICAgICAgICAgICAgY29sczogJzMwJ1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgY2hpbGRyZW4gPSBbIGRlc2NyaXB0aW9uTGFiZWwsIGRlc2NyaXB0aW9uSW5wdXQgXTtcbiAgICBcbiAgICAgICAgLy8gQXBwZW5kIGNoaWxkcmVuIHRvIHBhcmVudFxuICAgICAgICBkb21VdGlsLmFwcGVuZENoaWxkcmVuKGNvbnRhaW5lciwgY2hpbGRyZW4pO1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuIGNvbnRhaW5lcjtcbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gY3JlYXRlRGF0ZVNlY3Rpb24oaWQsIGluaXRpYWxWYWx1ZT0nJykge1xuICAgICAgICAvLyBQYXJlbnRcbiAgICAgICAgY29uc3QgY29udGFpbmVyID0gZG9tVXRpbC5jcmVhdGUoJ2RpdicsICcnKTtcbiAgICBcbiAgICAgICAgLy8gQ2hpbGRyZW5cbiAgICAgICAgY29uc3QgZGF0ZUxhYmVsID0gZG9tVXRpbC5jcmVhdGUoJ2xhYmVsJywgJ0R1ZSBEYXRlJywge1xuICAgICAgICAgICAgYXR0cmlidXRlczoge1xuICAgICAgICAgICAgICAgIGZvcjogaWRcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IGRhdGVJbnB1dCA9IGRvbVV0aWwuY3JlYXRlKCdpbnB1dCcsICcnLCB7XG4gICAgICAgICAgICBpZDogaWQsXG4gICAgICAgICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgICAgICAgbmFtZTogaWQsXG4gICAgICAgICAgICAgICAgdHlwZTogJ2RhdGUnLFxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgZGF0ZUlucHV0LnZhbHVlID0gaW5pdGlhbFZhbHVlO1xuICAgICAgICBjb25zdCBjaGlsZHJlbiA9IFsgZGF0ZUxhYmVsLCBkYXRlSW5wdXQgXTtcbiAgICBcbiAgICAgICAgLy8gQXBwZW5kIGNoaWxkcmVuIHRvIHBhcmVudFxuICAgICAgICBkb21VdGlsLmFwcGVuZENoaWxkcmVuKGNvbnRhaW5lciwgY2hpbGRyZW4pO1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuIGNvbnRhaW5lcjtcbiAgICB9XG4gICAgXG4gICAgLy8gQ3JlYXRlcyByYWRpbyBidXR0b24gaW5wdXQgc2VjdGlvbiBvZiBmb3JtXG4gICAgZnVuY3Rpb24gY3JlYXRlUHJpb3JpdHlTZWN0aW9uKGlkTGlzdCwgdmFsdWVMaXN0LCBsYWJlbFRleHRMaXN0LCBuYW1lQXR0ciwgaW5pdGlhbENoZWNrZWRWYWx1ZSkge1xuICAgICAgICAvLyBQYXJlbnRcbiAgICAgICAgY29uc3QgY29udGFpbmVyID0gZG9tVXRpbC5jcmVhdGUoJ2RpdicsICcnKTtcbiAgICBcbiAgICAgICAgLy8gQ2hpbGRyZW5cbiAgICAgICAgY29uc3QgY2hpbGRyZW4gPSBbXTtcbiAgICAgICAgY29uc3QgcCA9IGRvbVV0aWwuY3JlYXRlKCdwJywgJ1ByaW9yaXR5Jyk7XG4gICAgICAgIGNoaWxkcmVuLnB1c2gocCk7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpZExpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGlucHV0QXR0cmlidXRlcyA9IHtcbiAgICAgICAgICAgICAgICB0eXBlOiAncmFkaW8nLFxuICAgICAgICAgICAgICAgIG5hbWU6IG5hbWVBdHRyLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZUxpc3RbaV1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHZhbHVlTGlzdFtpXSA9PT0gaW5pdGlhbENoZWNrZWRWYWx1ZSkge1xuICAgICAgICAgICAgICAgIGlucHV0QXR0cmlidXRlcy5jaGVja2VkID0gJ2NoZWNrZWQnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCBpbnB1dCA9IGRvbVV0aWwuY3JlYXRlKCdpbnB1dCcsICcnLCB7XG4gICAgICAgICAgICAgICAgaWQ6IGlkTGlzdFtpXSxcbiAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzOiBpbnB1dEF0dHJpYnV0ZXNcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBjb25zdCBsYWJlbCA9IGRvbVV0aWwuY3JlYXRlKCdsYWJlbCcsIGxhYmVsVGV4dExpc3RbaV0sIHtcbiAgICAgICAgICAgICAgICBjbGFzczogJ3JhZGlvLWxhYmVsJyxcbiAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgICAgICAgICAgIGZvcjogaWRMaXN0W2ldXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGNoaWxkcmVuLnB1c2goaW5wdXQsIGxhYmVsKTtcbiAgICAgICAgfVxuICAgIFxuICAgICAgICAvLyBBcHBlbmQgY2hpbGRyZW4gdG8gcGFyZW50XG4gICAgICAgIGRvbVV0aWwuYXBwZW5kQ2hpbGRyZW4oY29udGFpbmVyLCBjaGlsZHJlbik7XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gY29udGFpbmVyO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIGNyZWF0ZVRpdGxlU2VjdGlvbixcbiAgICAgICAgY3JlYXRlRGVzY3JpcHRpb25TZWN0aW9uLFxuICAgICAgICBjcmVhdGVEYXRlU2VjdGlvbixcbiAgICAgICAgY3JlYXRlUHJpb3JpdHlTZWN0aW9uXG4gICAgfTtcbn0pKCk7XG5cbmV4cG9ydCB7IHRvZG9Gb3JtIH07IiwiaW1wb3J0IHsgZG9tVXRpbCB9IGZyb20gJy4vdXRpbC5qcyc7XG5pbXBvcnQgeyB0b2RvRm9ybSB9IGZyb20gJy4vdG9kb0Zvcm0nO1xuXG5mdW5jdGlvbiBnZW5lcmF0ZVRvZG9EaXZDbGFzc0xpc3QodG9kbywgaXNBY3RpdmVUb2RvKSB7XG4gICAgY29uc3QgY2xhc3NMaXN0ID0gW107XG5cbiAgICAvLyBBZGQgY2xhc3NlcyBiYXNlZCBvbiB0b2RvIHByb3BlcnR5IHZhbHVlc1xuICAgIGlmIChpc0FjdGl2ZVRvZG8pIHtcbiAgICAgICAgY2xhc3NMaXN0LnB1c2goJ2FjdGl2ZS10b2RvJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgY2xhc3NMaXN0LnB1c2goJ2luYWN0aXZlLXRvZG8nKTtcbiAgICB9XG5cbiAgICBpZiAodG9kby5jb21wbGV0ZSkge1xuICAgICAgICBjbGFzc0xpc3QucHVzaCgnY29tcGxldGUnKTtcbiAgICB9XG5cbiAgICBpZiAodG9kby5wcmlvcml0eSA9PT0gJ2xvdycpIHtcbiAgICAgICAgY2xhc3NMaXN0LnB1c2goJ2xvdy1wcmlvcml0eScpXG4gICAgfSBlbHNlIGlmICh0b2RvLnByaW9yaXR5ID09PSAnbWlkJykge1xuICAgICAgICBjbGFzc0xpc3QucHVzaCgnbWlkLXByaW9yaXR5Jyk7XG4gICAgfSBlbHNlIGlmICh0b2RvLnByaW9yaXR5ID09PSAnaGlnaCcpIHtcbiAgICAgICAgY2xhc3NMaXN0LnB1c2goJ2hpZ2gtcHJpb3JpdHknKTtcbiAgICB9XG5cbiAgICByZXR1cm4gY2xhc3NMaXN0O1xufVxuXG5mdW5jdGlvbiBjcmVhdGVJbmFjdGl2ZVRvZG9EaXYodG9kbykge1xuICAgIGNvbnN0IGNsYXNzTGlzdCA9IGdlbmVyYXRlVG9kb0RpdkNsYXNzTGlzdCh0b2RvLCBmYWxzZSk7XG5cbiAgICAvLyBQYXJlbnRcbiAgICBjb25zdCBjb250YWluZXIgPSBkb21VdGlsLmNyZWF0ZSgnZGl2JywgJycsIHtcbiAgICAgICAgY2xhc3M6IGNsYXNzTGlzdCxcbiAgICAgICAgYXR0cmlidXRlczoge1xuICAgICAgICAgICAgJ2RhdGEtdGl0bGUnOiB0b2RvLnRpdGxlXG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIENoaWxkcmVuXG4gICAgY29uc3QgaDQgPSBkb21VdGlsLmNyZWF0ZSgnaDQnLCB0b2RvLnRpdGxlKTtcbiAgICBjb25zdCBwID0gZG9tVXRpbC5jcmVhdGUoJ3AnLCBgRHVlOiAke3RvZG8uZHVlRGF0ZX1gKTtcbiAgICBjb25zdCBjaGlsZHJlbiA9IFsgaDQsIHAgXTtcblxuICAgIC8vIEFwcGVuZCBjaGlsZHJlbiB0byBwYXJlbnRcbiAgICBkb21VdGlsLmFwcGVuZENoaWxkcmVuKGNvbnRhaW5lciwgY2hpbGRyZW4pO1xuXG4gICAgcmV0dXJuIGNvbnRhaW5lcjtcbn1cblxuZnVuY3Rpb24gY3JlYXRlQWN0aXZlVG9kb0Rpdih0b2RvKSB7XG4gICAgY29uc3QgY2xhc3NMaXN0ID0gZ2VuZXJhdGVUb2RvRGl2Q2xhc3NMaXN0KHRvZG8sIHRydWUpO1xuXG4gICAgLy8gUGFyZW50XG4gICAgY29uc3QgY29udGFpbmVyID0gZG9tVXRpbC5jcmVhdGUoJ2RpdicsICcnLCB7XG4gICAgICAgIGNsYXNzOiBjbGFzc0xpc3QsXG4gICAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgICAgICdkYXRhLXRpdGxlJzogdG9kby50aXRsZVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBDaGlsZHJlblxuICAgIGNvbnN0IHRvZ2dsZUNvbXBsZXRlQnRuID0gZG9tVXRpbC5jcmVhdGUoJ2J1dHRvbicsICcnLCB7IGlkOiAndG9nZ2xlLWNvbXBsZXRlJyB9KTtcbiAgICB0b2dnbGVDb21wbGV0ZUJ0bi5pbm5lckhUTUwgPSAnJmNoZWNrOyc7XG4gICAgY29uc3QgZGVsQWN0aXZlVG9kb0J0biA9IGRvbVV0aWwuY3JlYXRlKCdidXR0b24nLCAnWCcsIHsgaWQ6ICdkZWwtYWN0aXZlLXRvZG8nIH0pO1xuICAgIGNvbnN0IHRpdGxlU2VjdGlvbiA9IHRvZG9Gb3JtLmNyZWF0ZVRpdGxlU2VjdGlvbigndXBkYXRlLXRpdGxlJywgdG9kby50aXRsZSlcbiAgICBjb25zdCBkZXNjcmlwdGlvblNlY3Rpb24gPSB0b2RvRm9ybS5jcmVhdGVEZXNjcmlwdGlvblNlY3Rpb24oJ3VwZGF0ZS1kZXNjcmlwdGlvbicsIHRvZG8uZGVzY3JpcHRpb24pO1xuICAgIGNvbnN0IGRhdGVTZWN0aW9uID0gdG9kb0Zvcm0uY3JlYXRlRGF0ZVNlY3Rpb24oJ3VwZGF0ZS1kYXRlJywgdG9kby5kdWVEYXRlKTtcbiAgICBjb25zdCBwcmlvcml0eVNlY3Rpb24gPSB0b2RvRm9ybS5jcmVhdGVQcmlvcml0eVNlY3Rpb24oWyAndXBkYXRlLWxvdycsICd1cGRhdGUtbWlkJywgJ3VwZGF0ZS1oaWdoJyBdLFxuICAgICAgICBbICdsb3cnLCAnbWlkJywgJ2hpZ2gnIF0sXG4gICAgICAgIFsgJ0xvdycsICdNaWQnLCAnSGlnaCcgXSxcbiAgICAgICAgJ3VwZGF0ZS1wcmlvcml0eScsXG4gICAgICAgIHRvZG8ucHJpb3JpdHkgICAgXG4gICAgKTtcbiAgICBjb25zdCBzYXZlQnRuID0gZG9tVXRpbC5jcmVhdGUoJ2J1dHRvbicsICdTYXZlJywge1xuICAgICAgICBpZDogJ3NhdmUtYnRuJ1xuICAgIH0pO1xuXG4gICAgY29uc3QgY2hpbGRyZW4gPSBbXG4gICAgICAgIHRvZ2dsZUNvbXBsZXRlQnRuLFxuICAgICAgICBkZWxBY3RpdmVUb2RvQnRuLFxuICAgICAgICB0aXRsZVNlY3Rpb24sXG4gICAgICAgIGRlc2NyaXB0aW9uU2VjdGlvbixcbiAgICAgICAgZGF0ZVNlY3Rpb24sXG4gICAgICAgIHByaW9yaXR5U2VjdGlvbixcbiAgICAgICAgc2F2ZUJ0blxuICAgIF07XG5cbiAgICAvLyBBcHBlbmQgY2hpbGRyZW4gdG8gcGFyZW50XG4gICAgZG9tVXRpbC5hcHBlbmRDaGlsZHJlbihjb250YWluZXIsIGNoaWxkcmVuKTtcblxuICAgIHJldHVybiBjb250YWluZXI7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVRvZG9MaXN0SXRlbXModG9kb3MsIGFjdGl2ZVRvZG8pIHtcbiAgICAvLyBQYXJlbnRcbiAgICBjb25zdCBjb250YWluZXIgPSBkb21VdGlsLmNyZWF0ZSgnZGl2JywgJycsIHsgaWQ6ICd0b2RvLWxpc3QtaXRlbXMnIH0pO1xuXG4gICAgLy8gQ2hpbGRyZW5cbiAgICB0b2Rvcy5mb3JFYWNoKHRvZG8gPT4ge1xuICAgICAgICBsZXQgdG9kb0RpdjtcbiAgICAgICAgaWYgKGFjdGl2ZVRvZG8gPT09IG51bGwgfHwgdG9kby50aXRsZSAhPSBhY3RpdmVUb2RvLnRpdGxlKSB7XG4gICAgICAgICAgICB0b2RvRGl2ID0gY3JlYXRlSW5hY3RpdmVUb2RvRGl2KHRvZG8pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdG9kb0RpdiA9IGNyZWF0ZUFjdGl2ZVRvZG9EaXYodG9kbyk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIC8vIEFwcGVuZCBjaGlsZHJlbiB0byBwYXJlbnRcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHRvZG9EaXYpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGNvbnRhaW5lcjtcbn1cblxuZnVuY3Rpb24gY3JlYXRlVG9kb0xpc3RDb250ZW50KHRvZG9zLCBhY3RpdmVUb2RvKSB7XG4gICAgLy8gUGFyZW50XG4gICAgY29uc3QgY29udGFpbmVyID0gZG9tVXRpbC5jcmVhdGUoJ2RpdicsICcnKTtcblxuICAgIC8vIENoaWxkcmVuXG4gICAgY29uc3QgaDMgPSBkb21VdGlsLmNyZWF0ZSgnaDMnLCAnVG9kbyBJdGVtcycpO1xuICAgIGNvbnN0IHRvZG9MaXN0SXRlbXMgPSBjcmVhdGVUb2RvTGlzdEl0ZW1zKHRvZG9zLCBhY3RpdmVUb2RvKTtcbiAgICBjb25zdCBjaGlsZHJlbiA9IFsgaDMsIHRvZG9MaXN0SXRlbXMgXTtcblxuICAgIC8vIEFwcGVuZCBjaGlsZHJlbiB0byBwYXJlbnRcbiAgICBkb21VdGlsLmFwcGVuZENoaWxkcmVuKGNvbnRhaW5lciwgY2hpbGRyZW4pO1xuXG4gICAgcmV0dXJuIGNvbnRhaW5lcjtcbn1cblxuZXhwb3J0IHsgY3JlYXRlVG9kb0xpc3RDb250ZW50IH07IiwiLy8gZG9tVXRpbCBtb2R1bGUgLSBjb250YWlucyBmdW5jdGlvbnMgdG8gc2ltcGxpZnkgRE9NIG5vZGUgbWFuaXB1bGF0aW9uIGFuZCBjcmVhdGlvblxuY29uc3QgZG9tVXRpbCA9IChmdW5jdGlvbigpIHtcbiAgICAvLyBfYWRkSWQgZnVuY3Rpb24gLSBhZGRzIGlkIHRvIGEgc3BlY2lmaWVkIGVsZW1lbnRcbiAgICBmdW5jdGlvbiBfYWRkSWQoZWxlbSwgaWQpIHtcbiAgICAgICAgZWxlbS5pZCA9IGlkO1xuICAgICAgICByZXR1cm4gZWxlbTtcbiAgICB9XG4gICAgXG4gICAgLy8gX2FkZENsYXNzIC0gYWRkcyBzcGVjaWZpZWQgY2xhc3NlcyB0byBhbiBlbGVtZW50XG4gICAgZnVuY3Rpb24gX2FkZENsYXNzKGVsZW0sIGNsYXNzZXMpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBjbGFzc2VzID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgZWxlbS5jbGFzc0xpc3QuYWRkKGNsYXNzZXMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2xhc3Nlcy5mb3JFYWNoKGNsYXNzTmFtZSA9PiB7XG4gICAgICAgICAgICAgICAgZWxlbS5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZWxlbTtcbiAgICB9XG5cbiAgICAvLyBfYWRkQXR0cmlidXRlIC0gYWRkcyBzcGVjaWZpZWQgYXR0cmlidXRlcyB0byBhbiBlbGVtZW50XG4gICAgZnVuY3Rpb24gX2FkZEF0dHJpYnV0ZShlbGVtLCBhdHRyaWJ1dGVzKSB7XG4gICAgICAgIGZvciAobGV0IGtleSBpbiBhdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgICBlbGVtLnNldEF0dHJpYnV0ZShrZXksIGF0dHJpYnV0ZXNba2V5XSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGVsZW07XG4gICAgfVxuICAgIFxuICAgIC8qIGNyZWF0ZSBtZXRob2QgLSBjcmVhdGVzIGFuIGVsZW1lbnQgd2l0aCBzcGVjaWZpZWQgdGFnLCBnaXZlbiB0ZXh0LCBhbmQgc3VwcGxpZWQgb3B0aW9uc1xuICAgIG9wdGlvbnMgcGFyZW10ZXIgaXMgb2YgdGhlIGZvcm06IFxuICAgIHtcbiAgICAgICAgaWQ6IFN0cmluZyxcbiAgICAgICAgY2xhc3M6IFN0cmluZyB8IFtTdHJpbmddXG4gICAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgICAgIGF0dHJpYnV0ZTE6IFN0cmluZyxcbiAgICAgICAgICAgIGF0dHJpYnV0ZTI6IFN0cmluZ1xuICAgICAgICB9XG4gICAgfVxuICAgICovXG4gICAgZnVuY3Rpb24gY3JlYXRlKHRhZywgdGV4dCwgb3B0aW9ucykge1xuICAgICAgICBjb25zdCBlbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWcpO1xuICAgICAgICBlbGVtLnRleHRDb250ZW50ID0gdGV4dDtcblxuICAgICAgICAvLyByZXR1cm4gdGhlIGVsZW1lbnQgaWYgbm8gb3B0aW9ucyB3ZXJlIHNwZWNpZmllZFxuICAgICAgICBpZiAob3B0aW9ucyA9PT0gdW5kZWZpbmVkIHx8IE9iamVjdC5rZXlzKG9wdGlvbnMpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIGVsZW07XG4gICAgICAgIH0gXG4gICAgICAgIFxuICAgICAgICAvLyBBZGQgc3BlY2lmaWVkIGlkXG4gICAgICAgIGlmIChvcHRpb25zLmlkKSB7XG4gICAgICAgICAgICBfYWRkSWQoZWxlbSwgb3B0aW9ucy5pZCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBBZGQgc3BlY2lmaWVkIGNsYXNzXG4gICAgICAgIGlmIChvcHRpb25zLmNsYXNzKSB7XG4gICAgICAgICAgICBfYWRkQ2xhc3MoZWxlbSwgb3B0aW9ucy5jbGFzcyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBBZGQgc3BlY2lmaWVkIGF0dHJpYnV0ZXNcbiAgICAgICAgaWYgKG9wdGlvbnMuYXR0cmlidXRlcyAhPT0gdW5kZWZpbmVkICYmIE9iamVjdC5rZXlzKG9wdGlvbnMuYXR0cmlidXRlcykubGVuZ3RoICE9PSAwKSB7XG4gICAgICAgICAgICBfYWRkQXR0cmlidXRlKGVsZW0sIG9wdGlvbnMuYXR0cmlidXRlcyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZWxlbTtcbiAgICB9XG5cbiAgICAvLyBhcHBlbmRDaGlsZHJlbiBtZXRob2QgLSBhcHBlbmRzIGFuIGFycmF5IG9mIGNoaWxkcmVuIHRvIHRoZSBwYXJlbnQgbm9kZSBpbiB0aGUgcHJvdmlkZWQgb3JkZXJcbiAgICBmdW5jdGlvbiBhcHBlbmRDaGlsZHJlbihwYXJlbnQsIGNoaWxkcmVuKSB7XG4gICAgICAgIGNoaWxkcmVuLmZvckVhY2goY2hpbGQgPT4ge1xuICAgICAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKGNoaWxkKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBwYXJlbnQ7XG4gICAgfVxuXG4gICAgLy8gQ2xlYXIgXG4gICAgcmV0dXJuIHtcbiAgICAgICAgY3JlYXRlLFxuICAgICAgICBhcHBlbmRDaGlsZHJlbixcbiAgICB9O1xufSkoKTtcblxuZXhwb3J0IHsgZG9tVXRpbCB9OyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHsgdmlld0NvbnRyb2xsZXIgfSBmcm9tICcuL21vZHVsZXMvdmlld0NvbnRyb2xsZXIuanMnO1xuaW1wb3J0IHsgZXZlbnRzIH0gZnJvbSAnLi9tb2R1bGVzL2V2ZW50cy5qcyc7XG5pbXBvcnQgeyBzdG9yYWdlIH0gZnJvbSAnLi9tb2R1bGVzL3N0b3JhZ2UuanMnO1xuaW1wb3J0IHsgYXBwIH0gZnJvbSAnLi9tb2R1bGVzL2FwcC5qcyc7XG5cbi8vIFRFTVBPUkFSWSBwcm9qZWN0cyBhcnJheSB0aGF0IHdpbGwgc3RhbmQgaW4gZm9yIGxvY2FsU3RvcmFnZSB0byByZWh5ZHJhdGUgaW50byBhcHByb3ByaWF0ZSBvYmplY3RzIHdpdGggcHJvdG90eXBlc1xuY29uc3QgcHJvamVjdHMgPSBbXG4gICAge1xuICAgICAgICBuYW1lOiAnRm9vZCBQcm9qZWN0JyxcbiAgICAgICAgdG9kb3M6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aXRsZTogJ0VhdCBzb21lIHBpenphJyxcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0VhdCBzb21lIHBpenphIHdpdGggZ2FybGljIHNhdWNlJyxcbiAgICAgICAgICAgICAgICBkdWVEYXRlOiAnMjAxMi0xMC0yMicsXG4gICAgICAgICAgICAgICAgcHJpb3JpdHk6ICdoaWdoJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aXRsZTogJ0VhdCBzb21lIGNoaWNrZW4gd2luZ3MnLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnRWF0IHNvbWUgY2hpY2tlbiB3aW5ncyB3aXRoIHJhbmNoJyxcbiAgICAgICAgICAgICAgICBkdWVEYXRlOiAnMjAxOC0wMy0xNCcsXG4gICAgICAgICAgICAgICAgcHJpb3JpdHk6ICdtaWQnXG4gICAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgICAgbmFtZTogJ0d1aXRhciBQcm9qZWN0JyxcbiAgICAgICAgdG9kb3M6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aXRsZTogJ1ByYWN0aWNlIFN0YWlyd2F5IHRvIEhlYXZlbicsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdQcmFjdGljZSB0aGUgY2hvcnVzIG9mIFN0YWlyd2F5IHRvIEhlYXZlbicsXG4gICAgICAgICAgICAgICAgZHVlRGF0ZTogJzIwMjEtMDUtMTgnLFxuICAgICAgICAgICAgICAgIHByaW9yaXR5OiAnbG93J1xuICAgICAgICAgICAgfVxuICAgICAgICBdXG4gICAgfVxuXTtcblxuLy8gSW5pdGlhbGl6ZSB2aWV3Q29udHJvbGxlciwgZXZlbnRzLCBhbmQgc3RvcmFnZSBtb2R1bGVzXG52aWV3Q29udHJvbGxlci5pbml0KCk7XG5ldmVudHMuaW5pdCgpO1xuc3RvcmFnZS5pbml0KCk7XG5cbi8vIEluaXRpYWxpemUgYXBwbGljYXRpb25cbmFwcC5pbml0KHByb2plY3RzKTsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=