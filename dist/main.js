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
        return !this.complete;
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

        // IMPLEMENT LOGIC THAT HANDLES WHEN THE DELETED PROJECT IS THE ACTIVE PROJECT
        _projects.splice(index, 1);
        _pubSub_js__WEBPACK_IMPORTED_MODULE_2__.pubSub.publish('projectsChange', _getStateData());
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
        console.log(activeTodo);
        activeTodo.update(newTitle, newDescription, newDueDate, newPriority); // CHECK THAT THIS IS WORKING IN THE FINAL APP VERSION, CURRENTLY THE ACTIVETODO IS SET TO NULL SINCE FORM WASN'T CLICKED BEFOREHAND
        _pubSub_js__WEBPACK_IMPORTED_MODULE_2__.pubSub.publish('todosChange', _getStateData());
    }

    // changeActiveTodo function - changes the active todo item for the current project
    function changeActiveTodo(todoTitle) {
        const activeTodo = _activeProject.activeTodo;
        activeTodo.setActiveTodo(todoTitle);
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
        _app_js__WEBPACK_IMPORTED_MODULE_1__.app.deleteProject(projectName);
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
        const priority = document.querySelector('input[name="new-priority"]:checked').value;

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
        _app_js__WEBPACK_IMPORTED_MODULE_1__.app.deleteActiveTodo();
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
        toggleCompleteBtn.addEventListener('click', _toggleTodoComplete);
    }

    // _assignDeleteActiveTodoEvent function - Adds event handler to button that deletes the active todo
    function _assignDeleteActiveTodoEvent() {
        const delTodoBtn = document.querySelector('#del-active-todo');
        delTodoBtn.addEventListener('click', _deleteActiveTodo);
    }

    // _assignUpdateActiveTodoEvent function - Adds event handler to save button that updates active todo information
    function _assignUpdateActiveTodoEvent() {
        const saveBtn = document.querySelector('#save-btn');
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
/* harmony import */ var _pubSub_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./pubSub.js */ "./src/modules/pubSub.js");


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
        
        _pubSub_js__WEBPACK_IMPORTED_MODULE_0__.pubSub.publish('projectsRender');
    }

    // _renderProjectTitle function - renders the project title on the page
    function _renderProjectTitle(data) {
        console.log(data);

        // Clear project-title-content
        const projectTitleDiv = document.querySelector('#project-title-content');
        projectTitleDiv.textContent = '';

        // Generate project-title html
        const projectTitleContent = '';
        
        _pubSub_js__WEBPACK_IMPORTED_MODULE_0__.pubSub.publish('projectTitleRender');
    }

    // _renderNewTodoContent function - renders page content related to adding new todo
    function _renderNewTodoContent(data) {
        console.log(data);
        
        _pubSub_js__WEBPACK_IMPORTED_MODULE_0__.pubSub.publish('newTodoContentRender');
    }

    // _renderTodos function - renders todo content
    function _renderTodos(data) {
        console.log(data);
        
        _pubSub_js__WEBPACK_IMPORTED_MODULE_0__.pubSub.publish('todosRender');
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
        _pubSub_js__WEBPACK_IMPORTED_MODULE_0__.pubSub.subscribe('appInit', _renderFullPage);
        _pubSub_js__WEBPACK_IMPORTED_MODULE_0__.pubSub.subscribe('activateNewTodoForm', _showNewTodoForm);
        _pubSub_js__WEBPACK_IMPORTED_MODULE_0__.pubSub.subscribe('disableNewTodoForm', _hideNewTodoForm);
        _pubSub_js__WEBPACK_IMPORTED_MODULE_0__.pubSub.subscribe('projectsChange', _renderProjects);
        _pubSub_js__WEBPACK_IMPORTED_MODULE_0__.pubSub.subscribe('todosChange', _renderTodos);
        _pubSub_js__WEBPACK_IMPORTED_MODULE_0__.pubSub.subscribe('activeProjectChange', _renderFullPage);
    }
    
    return { init };
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
                dueDate: '10/22/12',
                priority: 'high'
            },
            {
                title: 'Eat some chicken wings',
                description: 'Eat some pizza with garlic sauce',
                dueDate: '03/14/18',
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
                dueDate: '05/18/21',
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOzs7Ozs7Ozs7Ozs7Ozs7O0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2xDb0Q7QUFDTTtBQUNyQjs7QUFFckM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUSxzREFBYztBQUN0Qjs7QUFFQTtBQUNBO0FBQ0EsMkJBQTJCLHNFQUFPO0FBQ2xDO0FBQ0EsUUFBUSxzREFBYztBQUN0Qjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFFBQVEsc0RBQWM7QUFDdEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0EseUJBQXlCLGdFQUFJOztBQUU3QjtBQUNBOztBQUVBLFFBQVEsc0RBQWM7QUFDdEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4RUFBOEU7QUFDOUUsUUFBUSxzREFBYztBQUN0Qjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVEsc0RBQWM7QUFDdEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsUUFBUSxzREFBYztBQUN0Qjs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxRQUFRLHNEQUFjO0FBQ3RCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0Isc0VBQU87O0FBRXRDO0FBQ0E7QUFDQSxpQ0FBaUMsZ0VBQUk7QUFDckM7QUFDQSxhQUFhOztBQUViO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7O0FBRUE7QUFDQSxRQUFRLHNEQUFjO0FBQ3RCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzdJb0M7QUFDTjtBQUNzQjs7QUFFckQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsWUFBWSxtREFBYztBQUMxQjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsUUFBUSw0REFBdUI7QUFDL0I7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsUUFBUSxzREFBaUI7QUFDekI7O0FBRUE7QUFDQTtBQUNBLFFBQVEsc0RBQWM7QUFDdEI7O0FBRUE7QUFDQTtBQUNBLFFBQVEsc0RBQWM7QUFDdEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsUUFBUSxnREFBVztBQUNuQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxRQUFRLHlEQUFvQjtBQUM1Qjs7QUFFQTtBQUNBO0FBQ0EsUUFBUSwyREFBc0I7QUFDOUI7O0FBRUE7QUFDQTtBQUNBLFFBQVEseURBQW9CO0FBQzVCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFFBQVEsbURBQWM7QUFDdEI7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUSx3REFBZ0I7O0FBRXhCO0FBQ0EsUUFBUSx3REFBZ0I7O0FBRXhCO0FBQ0EsUUFBUSx3REFBZ0I7O0FBRXhCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7OztBQzVNRDtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLHdCQUF3QixtQ0FBbUM7QUFDM0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN2QnFDOztBQUVyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNab0M7O0FBRXJDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxRQUFRLHNEQUFjO0FBQ3RCOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsUUFBUSxzREFBYztBQUN0Qjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVEsc0RBQWM7QUFDdEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRLHNEQUFjO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVEsd0RBQWdCO0FBQ3hCLFFBQVEsd0RBQWdCO0FBQ3hCLFFBQVEsd0RBQWdCO0FBQ3hCLFFBQVEsd0RBQWdCO0FBQ3hCLFFBQVEsd0RBQWdCO0FBQ3hCLFFBQVEsd0RBQWdCO0FBQ3hCO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsQ0FBQzs7Ozs7Ozs7VUNqRkQ7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7OztBQ042RDtBQUNoQjtBQUNFO0FBQ1I7O0FBRXZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDJFQUFtQjtBQUNuQiwyREFBVztBQUNYLDZEQUFZOztBQUVaO0FBQ0EscURBQVEsVyIsInNvdXJjZXMiOlsid2VicGFjazovL3RvZG8tbGlzdC8uL3NyYy9mYWN0b3J5X2Z1bmN0aW9ucy9wcm9qZWN0LmpzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL3NyYy9mYWN0b3J5X2Z1bmN0aW9ucy90b2RvLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL3NyYy9tb2R1bGVzL2FwcC5qcyIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9zcmMvbW9kdWxlcy9ldmVudHMuanMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vc3JjL21vZHVsZXMvcHViU3ViLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL3NyYy9tb2R1bGVzL3N0b3JhZ2UuanMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vc3JjL21vZHVsZXMvdmlld0NvbnRyb2xsZXIuanMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3RvZG8tbGlzdC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0L3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vdG9kby1saXN0L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIHByb2plY3QgcHJvdG90eXBlXG5jb25zdCBwcm9qZWN0UHJvdG8gPSB7XG4gICAgZmluZEluZGV4QnlUaXRsZTogZnVuY3Rpb24odG9kb1RpdGxlKSB7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy50b2Rvcy5maW5kSW5kZXgodG9kbyA9PiB7XG4gICAgICAgICAgICByZXR1cm4gdG9kby50aXRsZSA9PT0gdG9kb1RpdGxlO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGluZGV4O1xuICAgIH0sXG4gICAgYWRkVG9kbzogZnVuY3Rpb24obmV3VG9kbykge1xuICAgICAgICB0aGlzLnRvZG9zLnB1c2gobmV3VG9kbyk7XG4gICAgfSxcbiAgICBkZWxldGVUb2RvOiBmdW5jdGlvbih0b2RvVGl0bGUpIHtcbiAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLmZpbmRJbmRleEJ5VGl0bGUodG9kb1RpdGxlKTtcbiAgICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgICAgICAgdGhpcy50b2Rvcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBkZWxldGVBY3RpdmVUb2RvOiBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLmZpbmRJbmRleEJ5VGl0bGUodGhpcy5hY3RpdmVUb2RvLnRpdGxlKTtcbiAgICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgICAgICAgdGhpcy5hY3RpdmVUb2RvID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMudG9kb3Muc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgc2V0QWN0aXZlVG9kbzogZnVuY3Rpb24odG9kb1RpdGxlKSB7XG4gICAgICAgIC8vIElmIHNldEFjdGl2ZVRvZG8gaXMgY2FsbGVkIHdpdGggbm8gYXJndW1lbnRzLCBzZXQgYWN0aXZlVG9kbyB0byBudWxsXG4gICAgICAgIGlmICh0b2RvVGl0bGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5hY3RpdmVUb2RvID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5maW5kSW5kZXhCeVRpdGxlKHRvZG9UaXRsZSk7XG4gICAgICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlVG9kbyA9IHRoaXMudG9kb3NbaW5kZXhdO1xuICAgICAgICB9XG4gICAgfVxufTtcblxuLy8gcHJvamVjdCBmYWN0b3J5IGZ1bmN0aW9uXG5mdW5jdGlvbiBwcm9qZWN0KG5hbWUpIHtcbiAgICBjb25zdCB0b2RvcyA9IFtdO1xuICAgIGxldCBhY3RpdmVUb2RvID0gbnVsbDtcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKHByb2plY3RQcm90byksIHtcbiAgICAgICAgbmFtZSxcbiAgICAgICAgYWN0aXZlVG9kbyxcbiAgICAgICAgdG9kb3NcbiAgICB9KTtcbn1cblxuZXhwb3J0IHsgcHJvamVjdCB9OyIsIi8vIHRvZG8gcHJvdG90eXBlXG5jb25zdCB0b2RvUHJvdG8gPSB7XG4gICAgY2hhbmdlVGl0bGU6IGZ1bmN0aW9uKG5ld1RpdGxlKSB7XG4gICAgICAgIHRoaXMudGl0bGUgPSBuZXdUaXRsZTtcbiAgICB9LFxuICAgIGNoYW5nZURlc2NyaXB0aW9uOiBmdW5jdGlvbihuZXdEZXNjcmlwdGlvbikge1xuICAgICAgICB0aGlzLmRlc2NyaXB0aW9uID0gbmV3RGVzY3JpcHRpb247XG4gICAgfSwgICAgXG4gICAgY2hhbmdlRHVlRGF0ZTogZnVuY3Rpb24obmV3RHVlRGF0ZSkge1xuICAgICAgICB0aGlzLmR1ZURhdGUgPSBuZXdEdWVEYXRlO1xuICAgIH0sXG4gICAgY2hhbmdlUHJpb3JpdHk6IGZ1bmN0aW9uKG5ld1ByaW9yaXR5KSB7XG4gICAgICAgIHRoaXMucHJpb3JpdHkgPSBuZXdQcmlvcml0eTtcbiAgICB9LFxuICAgIHRvZ2dsZUNvbXBsZXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuICF0aGlzLmNvbXBsZXRlO1xuICAgIH0sXG4gICAgdXBkYXRlOiBmdW5jdGlvbihuZXdUaXRsZSwgbmV3RGVzY3JpcHRpb24sIG5ld0R1ZURhdGUsIG5ld1ByaW9yaXR5KSB7XG4gICAgICAgIHRoaXMuY2hhbmdlVGl0bGUobmV3VGl0bGUpO1xuICAgICAgICB0aGlzLmNoYW5nZURlc2NyaXB0aW9uKG5ld0Rlc2NyaXB0aW9uKTtcbiAgICAgICAgdGhpcy5jaGFuZ2VEdWVEYXRlKG5ld0R1ZURhdGUpO1xuICAgICAgICB0aGlzLmNoYW5nZVByaW9yaXR5KG5ld1ByaW9yaXR5KTtcbiAgICB9XG59O1xuXG4vLyB0b2RvIGZhY3RvcnkgZnVuY3Rpb25cbmZ1bmN0aW9uIHRvZG8odGl0bGUsIGRlc2NyaXB0aW9uLCBkdWVEYXRlLCBwcmlvcml0eSkge1xuICAgIHJldHVybiBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUodG9kb1Byb3RvKSwge1xuICAgICAgICB0aXRsZSxcbiAgICAgICAgZGVzY3JpcHRpb24sXG4gICAgICAgIGR1ZURhdGUsXG4gICAgICAgIHByaW9yaXR5LFxuICAgICAgICBjb21wbGV0ZTogZmFsc2VcbiAgICB9KTtcbn1cblxuZXhwb3J0IHsgdG9kbyB9OyIsImltcG9ydCB7IHRvZG8gfSBmcm9tICcuLi9mYWN0b3J5X2Z1bmN0aW9ucy90b2RvLmpzJztcbmltcG9ydCB7IHByb2plY3QgfSBmcm9tICcuLi9mYWN0b3J5X2Z1bmN0aW9ucy9wcm9qZWN0LmpzJztcbmltcG9ydCB7IHB1YlN1YiB9IGZyb20gJy4vcHViU3ViLmpzJztcblxuLy8gYXBwIG1vZHVsZSBjb250YWlucyB0b2RvIGxpc3QgYXBwbGljYXRpb24gZGF0YSBhbmQgZnVuY3Rpb25hbGl0eVxuY29uc3QgYXBwID0gKGZ1bmN0aW9uKCkge1xuICAgIGxldCBfcHJvamVjdHMgPSBbXTtcbiAgICBsZXQgX2FjdGl2ZVByb2plY3Q7XG5cbiAgICAvLyBfZ2V0U3RhdGVEYXRhIGZ1bmN0aW9uIC0gYnVuZGxlcyBhcHAgc3RhdGUgZGF0YSAoX3Byb2plY3RzIGFuZCBfYWN0aXZlUHJvamVjdCkgZm9yIHB1Ymxpc2hpbmcgdGhyb3VnaCBwdWJTdWJcbiAgICBmdW5jdGlvbiBfZ2V0U3RhdGVEYXRhKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcHJvamVjdHM6IF9wcm9qZWN0cyxcbiAgICAgICAgICAgIGFjdGl2ZVByb2plY3Q6IF9hY3RpdmVQcm9qZWN0LFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8vIF9nZXRQcm9qZWN0RnJvbU5hbWUgZnVuY3Rpb24gLSBvYnRhaW5zIHRoZSBwcm9qZWN0IG9iamVjdCB3aXRoIGEgbWF0Y2hpbmcgcHJvamVjdCBuYW1lXG4gICAgZnVuY3Rpb24gX2dldFByb2plY3RGcm9tTmFtZShwcm9qZWN0TmFtZSkge1xuICAgICAgICBjb25zdCBwcm9qZWN0ID0gX3Byb2plY3RzLmZpbmQocHJvamVjdCA9PiB7XG4gICAgICAgICAgICByZXR1cm4gcHJvamVjdC5uYW1lID09PSBwcm9qZWN0TmFtZTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBwcm9qZWN0O1xuICAgIH1cblxuICAgIC8vIF9nZXRQcm9qZWN0SW5kZXhGcm9tTmFtZSAtIG9idGFpbnMgdGhlIGluZGV4IG9mIHRoZSBwcm9qZWN0IHdpdGggdGhlIHNwZWNpZmllZCBuYW1lIHdpdGhpbiB0aGUgX3Byb2plY3RzIGFycmF5XG4gICAgZnVuY3Rpb24gX2dldFByb2plY3RJbmRleEZyb21OYW1lKHByb2plY3ROYW1lKSB7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gX3Byb2plY3RzLmZpbmRJbmRleChwcm9qZWN0ID0+IHtcbiAgICAgICAgICAgIHJldHVybiBwcm9qZWN0Lm5hbWUgPT09IHByb2plY3ROYW1lO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGluZGV4O1xuICAgIH1cblxuICAgIC8vIGdldFByb2plY3RzIGZ1bmN0aW9ucyAtIHJldHVybnMgYW4gYXJyYXkgb2YgYXBwIHByb2plY3RzXG4gICAgZnVuY3Rpb24gZ2V0UHJvamVjdHMoKSB7XG4gICAgICAgIHJldHVybiBfcHJvamVjdHM7XG4gICAgfVxuXG4gICAgLy8gZ2V0QWN0aXZlUHJvamVjdCBmdW5jdGlvbiAtIHJldHVybnMgdGhlIGN1cnJlbnQgYWN0aXZlIHByb2plY3RcbiAgICBmdW5jdGlvbiBnZXRBY3RpdmVQcm9qZWN0KCkge1xuICAgICAgICByZXR1cm4gX2FjdGl2ZVByb2plY3Q7XG4gICAgfVxuXG4gICAgLy8gY2hhbmdlQWN0aXZlUHJvamVjdCBmdW5jdGlvbiAtIGNoYW5nZXMgdGhlIGFjdGl2ZSBhcHBsaWNhdGlvbiBwcm9qZWN0XG4gICAgZnVuY3Rpb24gY2hhbmdlQWN0aXZlUHJvamVjdChwcm9qZWN0TmFtZSkge1xuICAgICAgICBjb25zdCBwcm9qZWN0ID0gX2dldFByb2plY3RGcm9tTmFtZShwcm9qZWN0TmFtZSk7XG4gICAgICAgIF9hY3RpdmVQcm9qZWN0ID0gcHJvamVjdDtcbiAgICAgICAgcHViU3ViLnB1Ymxpc2goJ2FjdGl2ZVByb2plY3RDaGFuZ2UnLCBfZ2V0U3RhdGVEYXRhKCkpO1xuICAgIH1cblxuICAgIC8vIGFkZFByb2plY3QgZnVuY3Rpb24gLSBhZGRzIGEgbmV3IHByb2plY3QgdG8gdGhlIF9wcm9qZWN0cyBhcnJheVxuICAgIGZ1bmN0aW9uIGFkZFByb2plY3QocHJvamVjdE5hbWUpIHtcbiAgICAgICAgY29uc3QgbmV3UHJvamVjdCA9IHByb2plY3QocHJvamVjdE5hbWUpO1xuICAgICAgICBfcHJvamVjdHMucHVzaChuZXdQcm9qZWN0KTtcbiAgICAgICAgcHViU3ViLnB1Ymxpc2goJ3Byb2plY3RzQ2hhbmdlJywgX2dldFN0YXRlRGF0YSgpKTtcbiAgICB9XG5cbiAgICAvLyBkZWxldGVQcm9qZWN0IGZ1bmN0aW9uIC0gZGVsZXRlcyB0aGUgcHJvamVjdCB3aXRoIHRoZSBzcGVjaWZpZWQgbmFtZSBmcm9tIF9wcm9qZWN0cyBhcnJheVxuICAgIGZ1bmN0aW9uIGRlbGV0ZVByb2plY3QocHJvamVjdE5hbWUpIHtcbiAgICAgICAgY29uc3QgaW5kZXggPSBfZ2V0UHJvamVjdEluZGV4RnJvbU5hbWUocHJvamVjdE5hbWUpO1xuXG4gICAgICAgIC8vIElNUExFTUVOVCBMT0dJQyBUSEFUIEhBTkRMRVMgV0hFTiBUSEUgREVMRVRFRCBQUk9KRUNUIElTIFRIRSBBQ1RJVkUgUFJPSkVDVFxuICAgICAgICBfcHJvamVjdHMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgcHViU3ViLnB1Ymxpc2goJ3Byb2plY3RzQ2hhbmdlJywgX2dldFN0YXRlRGF0YSgpKTtcbiAgICB9XG5cbiAgICAvLyBhZGRUb2RvIGZ1bmN0aW9uIC0gYWRkcyBhIHRvZG8gaXRlbSB0byB0aGUgYWN0aXZlUHJvamVjdFxuICAgIGZ1bmN0aW9uIGFkZFRvZG8odGl0bGUsIGRlc2NyaXB0aW9uLCBkdWVEYXRlLCBwcmlvcml0eSkge1xuICAgICAgICAvLyBDcmVhdGUgdG9kbyBpdGVtXG4gICAgICAgIGNvbnN0IHRvZG9JdGVtID0gdG9kbyh0aXRsZSwgZGVzY3JpcHRpb24sIGR1ZURhdGUsIHByaW9yaXR5KTtcblxuICAgICAgICAvLyBBcHBlbmQgdG9kbyBpdGVtIHRvIGFjdGl2ZVByb2plY3QgdG9kb3MgYXJyYXlcbiAgICAgICAgX2FjdGl2ZVByb2plY3QuYWRkVG9kbyh0b2RvSXRlbSk7XG5cbiAgICAgICAgcHViU3ViLnB1Ymxpc2goJ3RvZG9zQ2hhbmdlJywgX2dldFN0YXRlRGF0YSgpKTtcbiAgICB9XG5cbiAgICAvLyBjaGFuZ2VUb2RvIGZ1bmN0aW9uIC0gbW9kaWZpZXMgYWN0aXZlIHRvZG8gaXRlbSBvZiBhY3RpdmVwcm9qZWN0IHRvIHNwZWNpZmllZCBwYXJhbWV0ZXJzXG4gICAgZnVuY3Rpb24gY2hhbmdlVG9kbyhuZXdUaXRsZSwgbmV3RGVzY3JpcHRpb24sIG5ld0R1ZURhdGUsIG5ld1ByaW9yaXR5KSB7XG4gICAgICAgIGNvbnN0IGFjdGl2ZVRvZG8gPSBfYWN0aXZlUHJvamVjdC5hY3RpdmVUb2RvO1xuICAgICAgICBjb25zb2xlLmxvZyhhY3RpdmVUb2RvKTtcbiAgICAgICAgYWN0aXZlVG9kby51cGRhdGUobmV3VGl0bGUsIG5ld0Rlc2NyaXB0aW9uLCBuZXdEdWVEYXRlLCBuZXdQcmlvcml0eSk7IC8vIENIRUNLIFRIQVQgVEhJUyBJUyBXT1JLSU5HIElOIFRIRSBGSU5BTCBBUFAgVkVSU0lPTiwgQ1VSUkVOVExZIFRIRSBBQ1RJVkVUT0RPIElTIFNFVCBUTyBOVUxMIFNJTkNFIEZPUk0gV0FTTidUIENMSUNLRUQgQkVGT1JFSEFORFxuICAgICAgICBwdWJTdWIucHVibGlzaCgndG9kb3NDaGFuZ2UnLCBfZ2V0U3RhdGVEYXRhKCkpO1xuICAgIH1cblxuICAgIC8vIGNoYW5nZUFjdGl2ZVRvZG8gZnVuY3Rpb24gLSBjaGFuZ2VzIHRoZSBhY3RpdmUgdG9kbyBpdGVtIGZvciB0aGUgY3VycmVudCBwcm9qZWN0XG4gICAgZnVuY3Rpb24gY2hhbmdlQWN0aXZlVG9kbyh0b2RvVGl0bGUpIHtcbiAgICAgICAgY29uc3QgYWN0aXZlVG9kbyA9IF9hY3RpdmVQcm9qZWN0LmFjdGl2ZVRvZG87XG4gICAgICAgIGFjdGl2ZVRvZG8uc2V0QWN0aXZlVG9kbyh0b2RvVGl0bGUpO1xuICAgICAgICBwdWJTdWIucHVibGlzaCgndG9kb3NDaGFuZ2UnLCBfZ2V0U3RhdGVEYXRhKCkpO1xuICAgIH1cblxuICAgIC8vIGRlbGV0ZVRvZG8gZnVuY3Rpb24gLSBkZWxldGVzIHRoZSBhY3RpdmUgdG9kbyBpdGVtIGZyb20gdGhlIGFjdGl2ZVByb2plY3RcbiAgICBmdW5jdGlvbiBkZWxldGVBY3RpdmVUb2RvKCkge1xuICAgICAgICBfYWN0aXZlUHJvamVjdC5kZWxldGVBY3RpdmVUb2RvKCk7XG4gICAgICAgIHB1YlN1Yi5wdWJsaXNoKCd0b2Rvc0NoYW5nZScsIF9nZXRTdGF0ZURhdGEoKSk7XG4gICAgfVxuXG4gICAgLy8gdG9nZ2xlVG9kb0NvbXBsZXRlIGZ1bmN0aW9uIC0gdG9nZ2xlcyB0aGUgYWN0aXZlIHRvZG8gaXRlbXMgY29tcGxldGUgc3RhdHVzXG4gICAgZnVuY3Rpb24gdG9nZ2xlVG9kb0NvbXBsZXRlKCkge1xuICAgICAgICBfYWN0aXZlUHJvamVjdC5hY3RpdmVUb2RvLnRvZ2dsZUNvbXBsZXRlKCk7XG4gICAgICAgIHB1YlN1Yi5wdWJsaXNoKCd0b2Rvc0NoYW5nZScsIF9nZXRTdGF0ZURhdGEoKSk7XG4gICAgfVxuXG4gICAgLy8gaW5pdCBmdW5jdGlvbiAtIGluaXRpYWxpemVzIHRoZSBhcHBsaWNhdGlvbiB3aXRoIHRoZSBnaXZlbiBwcm9qZWN0cyBhcnJheSBmcm9tIGxvY2FsU3RvcmFnZVxuICAgIGZ1bmN0aW9uIGluaXQocHJvamVjdHMpIHtcbiAgICAgICAgLy8gQ29udmVydCBsb2NhbFN0b3JhZ2UgcHJvamVjdHMgYXJyYXkgdG8gb2JqZWN0cyB3aXRoIHByb3RvdHlwZSBtZXRob2RzIHVzaW5nIGZhY3RvcnkgZnVuY3Rpb25zXG4gICAgICAgIHByb2plY3RzLmZvckVhY2gocHJvamVjdE9iaiA9PiB7XG4gICAgICAgICAgICAvLyBDcmVhdGUgYSBuZXcgcHJvamVjdFxuICAgICAgICAgICAgY29uc3QgbmV3UHJvamVjdCA9IHByb2plY3QocHJvamVjdE9iai5uYW1lKTtcblxuICAgICAgICAgICAgLy8gQWRkIGVhY2ggdG9kbyB0byB0aGUgY29ycmVzcG9uZGluZyBwcm9qZWN0XG4gICAgICAgICAgICBwcm9qZWN0T2JqLnRvZG9zLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgdG9kb0l0ZW0gPSB0b2RvKGl0ZW0udGl0bGUsIGl0ZW0uZGVzY3JpcHRpb24sIGl0ZW0uZHVlRGF0ZSwgaXRlbS5wcmlvcml0eSk7XG4gICAgICAgICAgICAgICAgbmV3UHJvamVjdC5hZGRUb2RvKHRvZG9JdGVtKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBBZGQgcHJvamVjdCB0byBfcHJvamVjdHMgYXJyYXlcbiAgICAgICAgICAgIF9wcm9qZWN0cy5wdXNoKG5ld1Byb2plY3QpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBTZXQgdGhlIGFjdGl2ZSBwcm9qZWN0IHRvIHRoZSBmaXJzdCBpdGVtIGluIHRoZSBhcnJheVxuICAgICAgICBfYWN0aXZlUHJvamVjdCA9IF9wcm9qZWN0c1swXTtcblxuICAgICAgICAvLyBQdWJsaXNoICdpbml0aWFsaXplJyBldmVudFxuICAgICAgICBwdWJTdWIucHVibGlzaCgnYXBwSW5pdCcsIF9nZXRTdGF0ZURhdGEoKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgZ2V0UHJvamVjdHMsXG4gICAgICAgIGdldEFjdGl2ZVByb2plY3QsXG4gICAgICAgIGNoYW5nZUFjdGl2ZVByb2plY3QsXG4gICAgICAgIGFkZFByb2plY3QsXG4gICAgICAgIGRlbGV0ZVByb2plY3QsXG4gICAgICAgIGFkZFRvZG8sXG4gICAgICAgIGNoYW5nZVRvZG8sXG4gICAgICAgIGNoYW5nZUFjdGl2ZVRvZG8sXG4gICAgICAgIGRlbGV0ZUFjdGl2ZVRvZG8sXG4gICAgICAgIHRvZ2dsZVRvZG9Db21wbGV0ZSxcbiAgICAgICAgaW5pdFxuICAgIH07XG59KSgpO1xuXG5leHBvcnQgeyBhcHAgfTsiLCJpbXBvcnQgeyBwdWJTdWIgfSBmcm9tICcuL3B1YlN1Yi5qcyc7XG5pbXBvcnQgeyBhcHAgfSBmcm9tICcuL2FwcC5qcyc7XG5pbXBvcnQgeyB2aWV3Q29udHJvbGxlciB9IGZyb20gJy4vdmlld0NvbnRyb2xsZXIuanMnO1xuXG4vLyBFdmVudHMgbW9kdWxlIC0gY29vcmRpbmF0ZXMgZXZlbnQgYWRkaXRpb24vbW9kaWZpY2F0aW9uIHRvIGRvbSBub2Rlc1xuY29uc3QgZXZlbnRzID0gKGZ1bmN0aW9uKCkge1xuICAgIC8qIEV2ZW50IGhhbmRsZXIgZnVuY3Rpb25zICovXG4gICAgLy8gX2NyZWF0ZU5ld1Byb2plY3QgZnVuY3Rpb24gLSBDcmVhdGVzIGEgbmV3IHByb2plY3RcbiAgICBmdW5jdGlvbiBfY3JlYXRlTmV3UHJvamVjdCgpIHtcbiAgICAgICAgLy8gRXh0cmFjdCBuZXcgcHJvamVjdCBuYW1lXG4gICAgICAgIGNvbnN0IHByb2plY3ROYW1lSW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYWRkLXByb2plY3QgaW5wdXQnKTtcbiAgICAgICAgY29uc3QgcHJvamVjdE5hbWUgPSBwcm9qZWN0TmFtZUlucHV0LnZhbHVlO1xuXG4gICAgICAgIC8vIEFkZCBwcm9qZWN0IHRvIGFwcCBtb2RlbFxuICAgICAgICBpZiAocHJvamVjdE5hbWUpIHtcbiAgICAgICAgICAgIGFwcC5hZGRQcm9qZWN0KHByb2plY3ROYW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENsZWFyIHByb2plY3QgbmFtZSBmaWVsZFxuICAgICAgICBwcm9qZWN0TmFtZUlucHV0LnZhbHVlID0gJyc7XG4gICAgfVxuXG4gICAgLy8gX3NlbGVjdFByb2plY3QgZnVuY3Rpb24gLSBTZXRzIHRoZSBhY3RpdmUgcHJvamVjdFxuICAgIGZ1bmN0aW9uIF9zZWxlY3RQcm9qZWN0KGUpIHtcbiAgICAgICAgY29uc3QgcHJvamVjdE5hbWUgPSBlLnRhcmdldC5wYXJlbnROb2RlLmdldEF0dHJpYnV0ZSgnZGF0YS1uYW1lJyk7XG4gICAgICAgIGFwcC5jaGFuZ2VBY3RpdmVQcm9qZWN0KHByb2plY3ROYW1lKTtcbiAgICB9XG5cbiAgICAvLyBfZGVsZXRlUHJvamVjdCBmdW5jdGlvbiAtIERlbGV0ZXMgdGhlIHNlbGVjdGVkIHByb2plY3RcbiAgICBmdW5jdGlvbiBfZGVsZXRlUHJvamVjdChlKSB7XG4gICAgICAgIGNvbnN0IHByb2plY3ROYW1lID0gZS50YXJnZXQucGFyZW50Tm9kZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtbmFtZScpO1xuICAgICAgICBhcHAuZGVsZXRlUHJvamVjdChwcm9qZWN0TmFtZSk7XG4gICAgfVxuXG4gICAgLy8gX3Nob3dOZXdUb2RvRm9ybSBmdW5jdGlvbiAtIFNob3dzIHRoZSBuZXcgdG9kbyBmb3JtIGFuZCBoaWRlcyB0aGUgXCJBZGQgVG9kb1wiIGJ1dHRvblxuICAgIGZ1bmN0aW9uIF9zaG93TmV3VG9kb0Zvcm0oKSB7XG4gICAgICAgIHB1YlN1Yi5wdWJsaXNoKCdhY3RpdmF0ZU5ld1RvZG9Gb3JtJyk7XG4gICAgfVxuXG4gICAgLy8gX2V4aXROZXdUb2RvRm9ybSBmdW5jdGlvbiAtIEhpZGVzIHRoZSBuZXcgdG9kbyBmb3JtIGFuZCBkaXNwbGF5cyB0aGUgXCJBZGQgVG9kb1wiIGJ1dHRvblxuICAgIGZ1bmN0aW9uIF9leGl0TmV3VG9kb0Zvcm0oKSB7XG4gICAgICAgIHB1YlN1Yi5wdWJsaXNoKCdkaXNhYmxlTmV3VG9kb0Zvcm0nKTtcbiAgICB9XG5cbiAgICAvLyBfYWRkTmV3VG9kbyBmdW5jdGlvbiAtIEV4dHJhY3RzIGZvcm0gdmFsdWVzIGFuZCBhZGRzIGEgbmV3IHRvZG8gdG8gdGhlIGFjdGl2ZSBwcm9qZWN0XG4gICAgZnVuY3Rpb24gX2FkZE5ld1RvZG8oKSB7XG4gICAgICAgIC8vIEV4dHJhY3QgZm9ybSB2YWx1ZXNcbiAgICAgICAgY29uc3QgdGl0bGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbmV3LXRpdGxlJykudmFsdWU7XG4gICAgICAgIGNvbnN0IGRlc2NyaXB0aW9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI25ldy1kZXNjcmlwdGlvbicpLnZhbHVlO1xuICAgICAgICBjb25zdCBkdWVEYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI25ldy1kYXRlJykudmFsdWU7XG4gICAgICAgIGNvbnN0IHByaW9yaXR5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaW5wdXRbbmFtZT1cIm5ldy1wcmlvcml0eVwiXTpjaGVja2VkJykudmFsdWU7XG5cbiAgICAgICAgYXBwLmFkZFRvZG8odGl0bGUsIGRlc2NyaXB0aW9uLCBkdWVEYXRlLCBwcmlvcml0eSk7IFxuICAgIH1cblxuICAgIC8vIF9zZXRBY3RpdmVUb2RvIGZ1bmN0aW9uIC0gU2V0cyBhbiBpbmFjdGl2ZSB0b2RvIHRvIGFjdGl2ZVxuICAgIGZ1bmN0aW9uIF9zZXRBY3RpdmVUb2RvKGUpIHtcbiAgICAgICAgY29uc3QgdG9kb1RpdGxlID0gZS50YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLXRpdGxlJyk7XG4gICAgICAgIGFwcC5jaGFuZ2VBY3RpdmVUb2RvKHRvZG9UaXRsZSk7XG4gICAgfVxuXG4gICAgLy8gX3RvZ2dsZVRvZG9Db21wbGV0ZSBmdW5jdGlvbiAtIFRvZ2dsZXMgdGhlIGFjdGl2ZSB0b2RvJ3MgY29tcGxldGlvbiBzdGF0dXNcbiAgICBmdW5jdGlvbiBfdG9nZ2xlVG9kb0NvbXBsZXRlKCkge1xuICAgICAgICBhcHAudG9nZ2xlVG9kb0NvbXBsZXRlKCk7XG4gICAgfVxuXG4gICAgLy8gX2RlbGV0ZUFjdGl2ZVRvZG8gZnVuY3Rpb24gLSBEZWxldGVzIHRoZSBhY3RpdmUgdG9kb1xuICAgIGZ1bmN0aW9uIF9kZWxldGVBY3RpdmVUb2RvKCkge1xuICAgICAgICBhcHAuZGVsZXRlQWN0aXZlVG9kbygpO1xuICAgIH1cblxuICAgIC8vIF91cGRhdGVBY3RpdmVUb2RvIGZ1bmN0aW9uIC0gVXBkYXRlcyB0aGUgYWN0aXZlIHRvZG8gZnVuY3Rpb24gd2l0aCB1cGRhdGVkIGZvcm0gdmFsdWVzXG4gICAgZnVuY3Rpb24gX3VwZGF0ZUFjdGl2ZVRvZG8oKSB7XG4gICAgICAgIC8vIEV4dHJhY3QgZm9ybSB2YWx1ZXNcbiAgICAgICAgY29uc3QgbmV3VGl0bGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjdXBkYXRlLXRpdGxlJykudmFsdWU7XG4gICAgICAgIGNvbnN0IG5ld0Rlc2NyaXB0aW9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3VwZGF0ZS1kZXNjcmlwdGlvbicpLnZhbHVlO1xuICAgICAgICBjb25zdCBuZXdEdWVEYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3VwZGF0ZS1kYXRlJykudmFsdWU7XG4gICAgICAgIGNvbnN0IG5ld1ByaW9yaXR5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaW5wdXRbbmFtZT1cInVwZGF0ZS1wcmlvcml0eVwiXTpjaGVja2VkJykudmFsdWU7XG5cbiAgICAgICAgYXBwLmNoYW5nZVRvZG8obmV3VGl0bGUsIG5ld0Rlc2NyaXB0aW9uLCBuZXdEdWVEYXRlLCBuZXdQcmlvcml0eSk7XG4gICAgfVxuXG4gICAgLyogRXZlbnQgU2V0dGluZyBmdW5jdGlvbnMgLSBUaGVzZSBmdW5jdGlvbnMgYXBwbHkgZXZlbnQgaGFuZGxlcnMgdG8gRE9NIGVsZW1lbnRzICovXG5cbiAgICAvLyBfYXNzaWduTmV3UHJvamVjdEV2ZW50IGZ1bmN0aW9uIC0gQWRkcyBldmVudCBoYW5kbGVyIHRvIHRoZSBzaWRlYmFyIE5ldyBQcm9qZWN0IGJ1dHRvblxuICAgIGZ1bmN0aW9uIF9hc3NpZ25OZXdQcm9qZWN0RXZlbnQoKSB7XG4gICAgICAgIGNvbnN0IG5ld1Byb2plY3RCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYWRkLXByb2plY3QtYnRuJyk7XG4gICAgICAgIG5ld1Byb2plY3RCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBfY3JlYXRlTmV3UHJvamVjdCk7XG4gICAgfVxuXG4gICAgLy8gX2Fzc2lnblByb2plY3RFdmVudHMgZnVuY3Rpb24gLSBBZGRzIGV2ZW50IGhhbmRsZXJzIHRvIHByb2plY3QgaXRlbXMgaW4gdGhlIHNpZGViYXJcbiAgICBmdW5jdGlvbiBfYXNzaWduUHJvamVjdEV2ZW50cygpIHtcbiAgICAgICAgY29uc3QgcHJvamVjdEl0ZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnByb2plY3QtbmFtZScpO1xuICAgICAgICBwcm9qZWN0SXRlbXMuZm9yRWFjaChwcm9qZWN0ID0+IHtcbiAgICAgICAgICAgIHByb2plY3QuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBfc2VsZWN0UHJvamVjdCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIF9hc3NpZ25EZWxQcm9qZWN0RXZlbnRzIGZ1bmN0aW9uIC0gQWRkcyBldmVudCBoYW5kbGVycyB0byBwcm9qZWN0IGRlbGV0ZSBidXR0b25zXG4gICAgZnVuY3Rpb24gX2Fzc2lnbkRlbFByb2plY3RFdmVudHMoKSB7XG4gICAgICAgIGNvbnN0IHByb2plY3REZWxCdXR0b25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmRlbC1wcm9qZWN0Jyk7XG4gICAgICAgIHByb2plY3REZWxCdXR0b25zLmZvckVhY2goYnV0dG9uID0+IHtcbiAgICAgICAgICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIF9kZWxldGVQcm9qZWN0KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gX2Fzc2lnbkFkZFRvZG9FdmVudCBmdW5jdGlvbiAtIEFkZCBldmVudCBoYW5kbGVyIHRvIEFkZCBUb2RvIGJ1dHRvblxuICAgIGZ1bmN0aW9uIF9hc3NpZ25BZGRUb2RvRXZlbnQoKSB7XG4gICAgICAgIGNvbnN0IGFkZFRvZG9CdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYWRkLXRvZG8tYnRuJyk7XG4gICAgICAgIGFkZFRvZG9CdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBfc2hvd05ld1RvZG9Gb3JtKTtcbiAgICB9XG5cbiAgICAvLyBfYXNzaWduQ2xvc2VUb2RvRXZlbnQgZnVuY3Rpb24gLSBBZGQgZXZlbnQgaGFuZGxlciB0byBidXR0b24gdGhhdCBjbG9zZXMgdGhlIG5ldyB0b2RvIGZvcm1cbiAgICBmdW5jdGlvbiBfYXNzaWduQ2xvc2VUb2RvRXZlbnQoKSB7XG4gICAgICAgIGNvbnN0IGNsb3NlTmV3VG9kb0J0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjbG9zZS1uZXctdG9kby1mb3JtJyk7XG4gICAgICAgIGNsb3NlTmV3VG9kb0J0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIF9leGl0TmV3VG9kb0Zvcm0pO1xuICAgIH1cblxuICAgIC8vIF9hc3NpZ25TdWJtaXRUb2RvRXZlbnQgZnVuY3Rpb24gLSBBZGQgZXZlbnQgaGFuZGxlciB0byBcIkFkZFwiIGJ1dHRvbiB3aGljaCBzdWJtaXRzIGNvbnRlbnQgZnJvbSB0aGUgbmV3IHRvZG8gZm9ybVxuICAgIGZ1bmN0aW9uIF9hc3NpZ25TdWJtaXRUb2RvRXZlbnQoKSB7XG4gICAgICAgIGNvbnN0IHN1Ym1pdFRvZG9CdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc3VibWl0LXRvZG8tYnRuJyk7XG4gICAgICAgIHN1Ym1pdFRvZG9CdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBfYWRkTmV3VG9kbyk7XG4gICAgfVxuXG4gICAgLy8gX2Fzc2lnblNldEFjdGl2ZUV2ZW50cyBmdW5jdGlvbiAtIEFkZHMgZXZlbnQgaGFuZGxlcnMgdG8gaW5hY3RpdmUgdG9kbyBpdGVtcyBvbiB0aGUgcGFnZVxuICAgIGZ1bmN0aW9uIF9hc3NpZ25TZXRBY3RpdmVFdmVudHMoKSB7XG4gICAgICAgIGNvbnN0IGluYWN0aXZlVG9kb3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuaW5hY3RpdmUtdG9kbycpO1xuICAgICAgICBpbmFjdGl2ZVRvZG9zLmZvckVhY2godG9kbyA9PiB7XG4gICAgICAgICAgICB0b2RvLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgX3NldEFjdGl2ZVRvZG8pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBfYXNzaWduVG9nZ2xlVG9kb0NvbXBsZXRlRXZlbnQgZnVuY3Rpb24gLSBBZGRzIGV2ZW50IGhhbmRsZXIgdG8gYnV0dG9uIGZvciB0b2dnbGluZyB0b2RvIGNvbXBsZXRpb25cbiAgICBmdW5jdGlvbiBfYXNzaWduVG9nZ2xlVG9kb0NvbXBsZXRlRXZlbnQoKSB7XG4gICAgICAgIGNvbnN0IHRvZ2dsZUNvbXBsZXRlQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3RvZ2dsZS1jb21wbGV0ZScpO1xuICAgICAgICB0b2dnbGVDb21wbGV0ZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIF90b2dnbGVUb2RvQ29tcGxldGUpO1xuICAgIH1cblxuICAgIC8vIF9hc3NpZ25EZWxldGVBY3RpdmVUb2RvRXZlbnQgZnVuY3Rpb24gLSBBZGRzIGV2ZW50IGhhbmRsZXIgdG8gYnV0dG9uIHRoYXQgZGVsZXRlcyB0aGUgYWN0aXZlIHRvZG9cbiAgICBmdW5jdGlvbiBfYXNzaWduRGVsZXRlQWN0aXZlVG9kb0V2ZW50KCkge1xuICAgICAgICBjb25zdCBkZWxUb2RvQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2RlbC1hY3RpdmUtdG9kbycpO1xuICAgICAgICBkZWxUb2RvQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgX2RlbGV0ZUFjdGl2ZVRvZG8pO1xuICAgIH1cblxuICAgIC8vIF9hc3NpZ25VcGRhdGVBY3RpdmVUb2RvRXZlbnQgZnVuY3Rpb24gLSBBZGRzIGV2ZW50IGhhbmRsZXIgdG8gc2F2ZSBidXR0b24gdGhhdCB1cGRhdGVzIGFjdGl2ZSB0b2RvIGluZm9ybWF0aW9uXG4gICAgZnVuY3Rpb24gX2Fzc2lnblVwZGF0ZUFjdGl2ZVRvZG9FdmVudCgpIHtcbiAgICAgICAgY29uc3Qgc2F2ZUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzYXZlLWJ0bicpO1xuICAgICAgICBzYXZlQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgX3VwZGF0ZUFjdGl2ZVRvZG8pO1xuICAgIH1cblxuICAgIC8vIF9hc3NpZ25TaWRlYmFyRXZlbnRzIHdyYXBwZXIgZnVuY3Rpb24gLSBBZGQgZXZlbnQgaGFuZGxlcnMgdG8gdGhlIFByb2plY3RzIHNpZGUgYmFyXG4gICAgZnVuY3Rpb24gX2Fzc2lnblNpZGViYXJFdmVudHMoKSB7XG4gICAgICAgIF9hc3NpZ25OZXdQcm9qZWN0RXZlbnQoKTtcbiAgICAgICAgX2Fzc2lnblByb2plY3RFdmVudHMoKTtcbiAgICAgICAgX2Fzc2lnbkRlbFByb2plY3RFdmVudHMoKVxuICAgIH1cblxuICAgIC8vIF9hc3NpZ25OZXdUb2RvRXZlbnRzIHdyYXBwZXIgZnVuY3Rpb24gLSBBZGQgZXZlbnQgaGFuZGxlcnMgYXNzb2NpYXRlZCB3aXRoIGFkZGluZyBhIG5ldyB0b2RvXG4gICAgZnVuY3Rpb24gX2Fzc2lnbk5ld1RvZG9FdmVudHMoKSB7XG4gICAgICAgIF9hc3NpZ25BZGRUb2RvRXZlbnQoKTtcbiAgICAgICAgX2Fzc2lnbkNsb3NlVG9kb0V2ZW50KCk7XG4gICAgICAgIF9hc3NpZ25TdWJtaXRUb2RvRXZlbnQoKTtcbiAgICB9XG5cbiAgICAvLyBfYXNzaWduVG9kb0xpc3RFdmVudHMgd3JhcHBlciBmdW5jdGlvbiAtIEFkZCBldmVudCBoYW5kbGVycyB0byBUb2RvIEl0ZW1zIHNlY3Rpb25cbiAgICBmdW5jdGlvbiBfYXNzaWduVG9kb0xpc3RFdmVudHMoKSB7XG4gICAgICAgIF9hc3NpZ25TZXRBY3RpdmVFdmVudHMoKTtcbiAgICAgICAgX2Fzc2lnblRvZ2dsZVRvZG9Db21wbGV0ZUV2ZW50KCk7XG4gICAgICAgIF9hc3NpZ25EZWxldGVBY3RpdmVUb2RvRXZlbnQoKTtcbiAgICAgICAgX2Fzc2lnblVwZGF0ZUFjdGl2ZVRvZG9FdmVudCgpO1xuICAgIH1cblxuLypcbiAgICAvLyBfYXNzaWduTWFpbkV2ZW50cyB3cmFwcGVyIGZ1bmN0aW9uIC0gQWRkIGV2ZW50IGhhbmRsZXJzIHRvIHRoZSBtYWluIHBhZ2UgVG9kbyBsaXN0IGNvbnRlbnRcbiAgICBmdW5jdGlvbiBfYXNzaWduTWFpbkV2ZW50cygpIHtcbiAgICAgICAgX2Fzc2lnbk5ld1RvZG9FdmVudHMoKTtcbiAgICAgICAgX2Fzc2lnblRvZG9MaXN0RXZlbnRzKCk7XG4gICAgfVxuXG4gICAgLy8gX2Fzc2lnbkZ1bGxQYWdlRXZlbnRzIHdyYXBwZXIgZnVuY3Rpb24gLSBBZGRzIGV2ZW50IGhhbmRsZXJzIHRvIHRoZSBlbnRpcmUgcGFnZVxuICAgIGZ1bmN0aW9uIF9hc3NpZ25GdWxsUGFnZUV2ZW50cygpIHtcbiAgICAgICAgX2Fzc2lnblNpZGViYXJFdmVudHMoKTtcbiAgICAgICAgX2Fzc2lnbk1haW5FdmVudHMoKTtcbiAgICB9XG4qL1xuICAgIFxuICAgIC8vIGluaXQgZnVuY3Rpb24gLSBjcmVhdGVzIHB1YlN1YiBzdWJzY3JpcHRpb25zXG4gICAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICAgICAgLy8gcHViU3ViLnN1YnNjcmliZSgnZnVsbFBhZ2VSZW5kZXInLCBfYXNzaWduRnVsbFBhZ2VFdmVudHMpO1xuICAgICAgICAvLyBPbiBwcm9qZWN0c1JlbmRlciwgYXNzaWduIGV2ZW50IGhhbmRsZXJzIHRvIHRoZSBwcm9qZWN0cyBzaWRlYmFyXG4gICAgICAgIHB1YlN1Yi5zdWJzY3JpYmUoJ3Byb2plY3RzUmVuZGVyJywgX2Fzc2lnblNpZGViYXJFdmVudHMpO1xuXG4gICAgICAgIC8vIE9uIG5ld1RvZG9Db250ZW50UmVuZGVyLCBhc3NpZ24gYXNzb2NpYXRlZCBmb3JtIGV2ZW50IGhhbmRsZXJzXG4gICAgICAgIHB1YlN1Yi5zdWJzY3JpYmUoJ25ld1RvZG9Db250ZW50UmVuZGVyJywgX2Fzc2lnbk5ld1RvZG9FdmVudHMpO1xuXG4gICAgICAgIC8vIE9uIHRvZG9zUmVuZGVyLCBhc3NpZ24gYXNzb2NpYXRlZCBwYWdlIGV2ZW50IGhhbmRsZXJzXG4gICAgICAgIHB1YlN1Yi5zdWJzY3JpYmUoJ3RvZG9zUmVuZGVyJywgX2Fzc2lnblRvZG9MaXN0RXZlbnRzKTtcblxuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgaW5pdFxuICAgIH07XG59KSgpO1xuXG5leHBvcnQgeyBldmVudHMgfTsiLCJjb25zdCBwdWJTdWIgPSB7XG4gICAgZXZlbnRzOiB7fSxcbiAgICBzdWJzY3JpYmU6IGZ1bmN0aW9uKGV2ZW50TmFtZSwgZm4pIHtcbiAgICAgICAgdGhpcy5ldmVudHNbZXZlbnROYW1lXSA9IHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0gfHwgW107XG4gICAgICAgIHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0ucHVzaChmbik7XG4gICAgfSxcbiAgICB1bnN1YnNjcmliZTogZnVuY3Rpb24oZXZlbnROYW1lLCBmbikge1xuICAgICAgICBpZiAodGhpcy5ldmVudHNbZXZlbnROYW1lXSkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmV2ZW50c1tldmVudE5hbWVdW2ldID09PSBmbikge1xuICAgICAgICAgICAgdGhpcy5ldmVudHNbZXZlbnROYW1lXS5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgcHVibGlzaDogZnVuY3Rpb24oZXZlbnROYW1lLCBkYXRhKSB7XG4gICAgICAgIGlmICh0aGlzLmV2ZW50c1tldmVudE5hbWVdKSB7XG4gICAgICAgIHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0uZm9yRWFjaChmdW5jdGlvbihmbikge1xuICAgICAgICAgICAgZm4oZGF0YSk7XG4gICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxufTtcblxuZXhwb3J0IHsgcHViU3ViIH07IiwiaW1wb3J0IHsgcHViU3ViIH0gZnJvbSAnLi9wdWJTdWIuanMnO1xuXG4vLyBTdG9yYWdlIG1vZHVsZSAtIGhhbmRsZXMgc3RvcmFnZS9yZXRyaWV2YWwgb2YgYnJvd3NlciBsb2NhbFN0b3JhZ2UgZGF0YVxuY29uc3Qgc3RvcmFnZSA9IChmdW5jdGlvbigpIHtcbiAgICAvLyBpbml0IGZ1bmN0aW9uIC0gU2V0cyB1cCBwdWJTdWIgc3Vic2NyaXB0aW9uc1xuICAgIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBpbml0XG4gICAgfTtcbn0pKCk7XG5cbmV4cG9ydCB7IHN0b3JhZ2UgfTsiLCJpbXBvcnQgeyBwdWJTdWIgfSBmcm9tICcuL3B1YlN1Yi5qcyc7XG5cbi8vIHZpZXdDb250cm9sbGVyIG1vZHVsZSAtIGNvbnRyb2xzIERPTSBtYW5pcHVsYXRpb25cbmNvbnN0IHZpZXdDb250cm9sbGVyID0gKGZ1bmN0aW9uKCkge1xuICAgIC8vIF9zaG93TmV3VG9kb0Zvcm0gZnVuY3Rpb24gLSBNYWtlcyB0aGUgXCJBZGQgTmV3IFRvZG9cIiBmb3JtIHZpc2libGVcbiAgICBmdW5jdGlvbiBfc2hvd05ld1RvZG9Gb3JtKCkge1xuICAgICAgICBjb25zdCBmb3JtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmFkZC10b2RvJyk7XG4gICAgICAgIGNvbnN0IGZvcm1Ub2dnbGVCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYWRkLXRvZG8tYnRuJyk7XG4gICAgICAgIGZvcm0uc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgIGZvcm1Ub2dnbGVCdG4uc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICB9XG5cbiAgICAvLyBfaGlkZU5ld1RvZG9Gb3JtIGZ1bmN0aW9uIC0gSGlkZXMgdGhlIFwiQWRkIE5ldyBUb2RvXCIgZm9ybVxuICAgIGZ1bmN0aW9uIF9oaWRlTmV3VG9kb0Zvcm0oKSB7XG4gICAgICAgIGNvbnN0IGZvcm0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYWRkLXRvZG8nKTtcbiAgICAgICAgY29uc3QgZm9ybVRvZ2dsZUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNhZGQtdG9kby1idG4nKTtcbiAgICAgICAgZm9ybS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICBmb3JtVG9nZ2xlQnRuLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgIH1cbiAgICBcbiAgICAvLyBfcmVuZGVyUHJvamVjdHMgZnVuY3Rpb24gLSByZW5kZXJzIHNpZGViYXIgY29udGVudFxuICAgIGZ1bmN0aW9uIF9yZW5kZXJQcm9qZWN0cyhkYXRhKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuXG4gICAgICAgIC8vIENsZWFyIHRoZSBwcm9qZWN0LWxpc3Qgc2lkZWJhclxuICAgICAgICBjb25zdCBwcm9qZWN0TGlzdERpdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNwcm9qZWN0LWxpc3QnKVxuICAgICAgICBwcm9qZWN0TGlzdERpdi50ZXh0Q29udGVudCA9ICcnO1xuXG4gICAgICAgIC8vIEdlbmVyYXRlIHByb2plY3QtbGlzdCBzaWRlYmFyIGh0bWxcbiAgICAgICAgY29uc3Qgc2lkZWJhckNvbnRlbnQgPSAnJztcbiAgICAgICAgXG4gICAgICAgIHB1YlN1Yi5wdWJsaXNoKCdwcm9qZWN0c1JlbmRlcicpO1xuICAgIH1cblxuICAgIC8vIF9yZW5kZXJQcm9qZWN0VGl0bGUgZnVuY3Rpb24gLSByZW5kZXJzIHRoZSBwcm9qZWN0IHRpdGxlIG9uIHRoZSBwYWdlXG4gICAgZnVuY3Rpb24gX3JlbmRlclByb2plY3RUaXRsZShkYXRhKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuXG4gICAgICAgIC8vIENsZWFyIHByb2plY3QtdGl0bGUtY29udGVudFxuICAgICAgICBjb25zdCBwcm9qZWN0VGl0bGVEaXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcHJvamVjdC10aXRsZS1jb250ZW50Jyk7XG4gICAgICAgIHByb2plY3RUaXRsZURpdi50ZXh0Q29udGVudCA9ICcnO1xuXG4gICAgICAgIC8vIEdlbmVyYXRlIHByb2plY3QtdGl0bGUgaHRtbFxuICAgICAgICBjb25zdCBwcm9qZWN0VGl0bGVDb250ZW50ID0gJyc7XG4gICAgICAgIFxuICAgICAgICBwdWJTdWIucHVibGlzaCgncHJvamVjdFRpdGxlUmVuZGVyJyk7XG4gICAgfVxuXG4gICAgLy8gX3JlbmRlck5ld1RvZG9Db250ZW50IGZ1bmN0aW9uIC0gcmVuZGVycyBwYWdlIGNvbnRlbnQgcmVsYXRlZCB0byBhZGRpbmcgbmV3IHRvZG9cbiAgICBmdW5jdGlvbiBfcmVuZGVyTmV3VG9kb0NvbnRlbnQoZGF0YSkge1xuICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgXG4gICAgICAgIHB1YlN1Yi5wdWJsaXNoKCduZXdUb2RvQ29udGVudFJlbmRlcicpO1xuICAgIH1cblxuICAgIC8vIF9yZW5kZXJUb2RvcyBmdW5jdGlvbiAtIHJlbmRlcnMgdG9kbyBjb250ZW50XG4gICAgZnVuY3Rpb24gX3JlbmRlclRvZG9zKGRhdGEpIHtcbiAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgICAgIFxuICAgICAgICBwdWJTdWIucHVibGlzaCgndG9kb3NSZW5kZXInKTtcbiAgICB9XG4gICAgXG4gICAgLy8gX3JlbmRlckZ1bGxQYWdlIGZ1bmN0aW9uIC0gcmVuZGVycyB0aGUgZW50aXJlIHBhZ2UncyBjb250ZW50XG4gICAgZnVuY3Rpb24gX3JlbmRlckZ1bGxQYWdlKGRhdGEpIHtcbiAgICAgICAgX3JlbmRlclByb2plY3RzKGRhdGEpO1xuICAgICAgICBfcmVuZGVyUHJvamVjdFRpdGxlKGRhdGEpO1xuICAgICAgICBfcmVuZGVyTmV3VG9kb0NvbnRlbnQoZGF0YSk7XG4gICAgICAgIF9yZW5kZXJUb2RvcyhkYXRhKTtcbiAgICB9XG4gICAgXG4gICAgLy8gaW5pdCBmdW5jdGlvbiAtIFN1YnNjcmliZXMgdG8gcHViU3ViIGV2ZW50c1xuICAgIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgICAgIHB1YlN1Yi5zdWJzY3JpYmUoJ2FwcEluaXQnLCBfcmVuZGVyRnVsbFBhZ2UpO1xuICAgICAgICBwdWJTdWIuc3Vic2NyaWJlKCdhY3RpdmF0ZU5ld1RvZG9Gb3JtJywgX3Nob3dOZXdUb2RvRm9ybSk7XG4gICAgICAgIHB1YlN1Yi5zdWJzY3JpYmUoJ2Rpc2FibGVOZXdUb2RvRm9ybScsIF9oaWRlTmV3VG9kb0Zvcm0pO1xuICAgICAgICBwdWJTdWIuc3Vic2NyaWJlKCdwcm9qZWN0c0NoYW5nZScsIF9yZW5kZXJQcm9qZWN0cyk7XG4gICAgICAgIHB1YlN1Yi5zdWJzY3JpYmUoJ3RvZG9zQ2hhbmdlJywgX3JlbmRlclRvZG9zKTtcbiAgICAgICAgcHViU3ViLnN1YnNjcmliZSgnYWN0aXZlUHJvamVjdENoYW5nZScsIF9yZW5kZXJGdWxsUGFnZSk7XG4gICAgfVxuICAgIFxuICAgIHJldHVybiB7IGluaXQgfTtcbn0pKCk7XG5cbmV4cG9ydCB7IHZpZXdDb250cm9sbGVyIH07IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgeyB2aWV3Q29udHJvbGxlciB9IGZyb20gJy4vbW9kdWxlcy92aWV3Q29udHJvbGxlci5qcyc7XG5pbXBvcnQgeyBldmVudHMgfSBmcm9tICcuL21vZHVsZXMvZXZlbnRzLmpzJztcbmltcG9ydCB7IHN0b3JhZ2UgfSBmcm9tICcuL21vZHVsZXMvc3RvcmFnZS5qcyc7XG5pbXBvcnQgeyBhcHAgfSBmcm9tICcuL21vZHVsZXMvYXBwLmpzJztcblxuLy8gVEVNUE9SQVJZIHByb2plY3RzIGFycmF5IHRoYXQgd2lsbCBzdGFuZCBpbiBmb3IgbG9jYWxTdG9yYWdlIHRvIHJlaHlkcmF0ZSBpbnRvIGFwcHJvcHJpYXRlIG9iamVjdHMgd2l0aCBwcm90b3R5cGVzXG5jb25zdCBwcm9qZWN0cyA9IFtcbiAgICB7XG4gICAgICAgIG5hbWU6ICdGb29kIFByb2plY3QnLFxuICAgICAgICB0b2RvczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRpdGxlOiAnRWF0IHNvbWUgcGl6emEnLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnRWF0IHNvbWUgcGl6emEgd2l0aCBnYXJsaWMgc2F1Y2UnLFxuICAgICAgICAgICAgICAgIGR1ZURhdGU6ICcxMC8yMi8xMicsXG4gICAgICAgICAgICAgICAgcHJpb3JpdHk6ICdoaWdoJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aXRsZTogJ0VhdCBzb21lIGNoaWNrZW4gd2luZ3MnLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnRWF0IHNvbWUgcGl6emEgd2l0aCBnYXJsaWMgc2F1Y2UnLFxuICAgICAgICAgICAgICAgIGR1ZURhdGU6ICcwMy8xNC8xOCcsXG4gICAgICAgICAgICAgICAgcHJpb3JpdHk6ICdtaWQnXG4gICAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgICAgbmFtZTogJ0d1aXRhciBQcm9qZWN0JyxcbiAgICAgICAgdG9kb3M6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aXRsZTogJ1ByYWN0aWNlIFN0YWlyd2F5IHRvIEhlYXZlbicsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdQcmFjdGljZSB0aGUgY2hvcnVzIG9mIFN0YWlyd2F5IHRvIEhlYXZlbicsXG4gICAgICAgICAgICAgICAgZHVlRGF0ZTogJzA1LzE4LzIxJyxcbiAgICAgICAgICAgICAgICBwcmlvcml0eTogJ2xvdydcbiAgICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgIH1cbl07XG5cbi8vIEluaXRpYWxpemUgdmlld0NvbnRyb2xsZXIsIGV2ZW50cywgYW5kIHN0b3JhZ2UgbW9kdWxlc1xudmlld0NvbnRyb2xsZXIuaW5pdCgpO1xuZXZlbnRzLmluaXQoKTtcbnN0b3JhZ2UuaW5pdCgpO1xuXG4vLyBJbml0aWFsaXplIGFwcGxpY2F0aW9uXG5hcHAuaW5pdChwcm9qZWN0cyk7Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9