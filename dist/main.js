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
    
    // _renderProjects function - renders sidebar content
    function _renderProjects(data) {
        console.log(data);

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
        console.log(data);

        // Clear project-title-content
        const projectTitleDiv = document.querySelector('#project-title-content');
        projectTitleDiv.textContent = '';

        // Extract relevant data

        // Generate project-title html
        const projectTitleContent = (0,_views_title_js__WEBPACK_IMPORTED_MODULE_1__.createProjectTitleContent)();
        //projectTitleDiv.appendChild(projectTitleContent);
        
        _pubSub_js__WEBPACK_IMPORTED_MODULE_4__.pubSub.publish('projectTitleRender');
    }

    // _renderNewTodoContent function - renders page content related to adding new todo
    function _renderNewTodoContent(data) {
        console.log(data);

        // Clear new-todo-content div
        const newTodoContentDiv = document.querySelector('#new-todo-content');
        newTodoContentDiv.textContent = '';

        // Extract relevant data

        // Generate new-todo-content html
        const newTodoContent = (0,_views_newTodoSection_js__WEBPACK_IMPORTED_MODULE_2__.createNewTodoContent)();
        //newTodoContentDiv.appendChild(newTodoContent);

        
        _pubSub_js__WEBPACK_IMPORTED_MODULE_4__.pubSub.publish('newTodoContentRender');
    }

    // _renderTodos function - renders todo content
    function _renderTodos(data) {
        console.log(data);

        // Clear todo-list-items div
        const todoListItemsDiv = document.querySelector('#todo-list-items');
        todoListItemsDiv.textContent = '';
        console.log('yes');

        // Extract relevant data

        // Generate todo-list-items content
        const todoListItemsContent = (0,_views_todoItems_js__WEBPACK_IMPORTED_MODULE_3__.createTodoItemContent)();
        //todoListItemsDiv.appendChild(todoListItemsContent);
        
        _pubSub_js__WEBPACK_IMPORTED_MODULE_4__.pubSub.publish('todosRender');
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
        _pubSub_js__WEBPACK_IMPORTED_MODULE_4__.pubSub.subscribe('appInit', _renderFullPage);
        _pubSub_js__WEBPACK_IMPORTED_MODULE_4__.pubSub.subscribe('activateNewTodoForm', _showNewTodoForm);
        _pubSub_js__WEBPACK_IMPORTED_MODULE_4__.pubSub.subscribe('disableNewTodoForm', _hideNewTodoForm);
        _pubSub_js__WEBPACK_IMPORTED_MODULE_4__.pubSub.subscribe('projectsChange', _renderProjects);
        _pubSub_js__WEBPACK_IMPORTED_MODULE_4__.pubSub.subscribe('todosChange', _renderTodos);
        _pubSub_js__WEBPACK_IMPORTED_MODULE_4__.pubSub.subscribe('activeProjectChange', _renderFullPage);
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


function createNewTodoContent() {
    return;
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
    const projectDivClassList = isActiveProject ? [ 'project' ] : [ 'project', 'active-project' ];
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


function createProjectTitleContent() {
    return;
}



/***/ }),

/***/ "./src/views/todoItems.js":
/*!********************************!*\
  !*** ./src/views/todoItems.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createTodoItemContent": () => (/* binding */ createTodoItemContent)
/* harmony export */ });
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util.js */ "./src/views/util.js");


function createTodoItemContent() {
    return;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOzs7Ozs7Ozs7Ozs7Ozs7O0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2xDb0Q7QUFDTTtBQUNyQjs7QUFFckM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUSxzREFBYztBQUN0Qjs7QUFFQTtBQUNBO0FBQ0EsMkJBQTJCLHNFQUFPO0FBQ2xDO0FBQ0EsUUFBUSxzREFBYztBQUN0Qjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFFBQVEsc0RBQWM7QUFDdEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0EseUJBQXlCLGdFQUFJOztBQUU3QjtBQUNBOztBQUVBLFFBQVEsc0RBQWM7QUFDdEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4RUFBOEU7QUFDOUUsUUFBUSxzREFBYztBQUN0Qjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVEsc0RBQWM7QUFDdEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsUUFBUSxzREFBYztBQUN0Qjs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxRQUFRLHNEQUFjO0FBQ3RCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0Isc0VBQU87O0FBRXRDO0FBQ0E7QUFDQSxpQ0FBaUMsZ0VBQUk7QUFDckM7QUFDQSxhQUFhOztBQUViO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7O0FBRUE7QUFDQSxRQUFRLHNEQUFjO0FBQ3RCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzdJb0M7QUFDTjtBQUNzQjs7QUFFckQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsWUFBWSxtREFBYztBQUMxQjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsUUFBUSw0REFBdUI7QUFDL0I7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsUUFBUSxzREFBaUI7QUFDekI7O0FBRUE7QUFDQTtBQUNBLFFBQVEsc0RBQWM7QUFDdEI7O0FBRUE7QUFDQTtBQUNBLFFBQVEsc0RBQWM7QUFDdEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsUUFBUSxnREFBVztBQUNuQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxRQUFRLHlEQUFvQjtBQUM1Qjs7QUFFQTtBQUNBO0FBQ0EsUUFBUSwyREFBc0I7QUFDOUI7O0FBRUE7QUFDQTtBQUNBLFFBQVEseURBQW9CO0FBQzVCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFFBQVEsbURBQWM7QUFDdEI7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUSx3REFBZ0I7O0FBRXhCO0FBQ0EsUUFBUSx3REFBZ0I7O0FBRXhCO0FBQ0EsUUFBUSx3REFBZ0I7O0FBRXhCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7OztBQzVNRDtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLHdCQUF3QixtQ0FBbUM7QUFDM0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN2QnFDOztBQUVyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtB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QUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7Ozs7QUNONkQ7QUFDaEI7QUFDRTtBQUNSOztBQUV2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwyRUFBbUI7QUFDbkIsMkRBQVc7QUFDWCw2REFBWTs7QUFFWjtBQUNBLHFEQUFRLFciLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9zcmMvZmFjdG9yeV9mdW5jdGlvbnMvcHJvamVjdC5qcyIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9zcmMvZmFjdG9yeV9mdW5jdGlvbnMvdG9kby5qcyIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9zcmMvbW9kdWxlcy9hcHAuanMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vc3JjL21vZHVsZXMvZXZlbnRzLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL3NyYy9tb2R1bGVzL3B1YlN1Yi5qcyIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9zcmMvbW9kdWxlcy9zdG9yYWdlLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL3NyYy9tb2R1bGVzL3ZpZXdDb250cm9sbGVyLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL3NyYy92aWV3cy9uZXdUb2RvU2VjdGlvbi5qcyIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9zcmMvdmlld3Mvc2lkZWJhci5qcyIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9zcmMvdmlld3MvdGl0bGUuanMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vc3JjL3ZpZXdzL3RvZG9JdGVtcy5qcyIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9zcmMvdmlld3MvdXRpbC5qcyIsIndlYnBhY2s6Ly90b2RvLWxpc3Qvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vdG9kby1saXN0L3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly90b2RvLWxpc3Qvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly90b2RvLWxpc3Qvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gcHJvamVjdCBwcm90b3R5cGVcbmNvbnN0IHByb2plY3RQcm90byA9IHtcbiAgICBmaW5kSW5kZXhCeVRpdGxlOiBmdW5jdGlvbih0b2RvVGl0bGUpIHtcbiAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLnRvZG9zLmZpbmRJbmRleCh0b2RvID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0b2RvLnRpdGxlID09PSB0b2RvVGl0bGU7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gaW5kZXg7XG4gICAgfSxcbiAgICBhZGRUb2RvOiBmdW5jdGlvbihuZXdUb2RvKSB7XG4gICAgICAgIHRoaXMudG9kb3MucHVzaChuZXdUb2RvKTtcbiAgICB9LFxuICAgIGRlbGV0ZVRvZG86IGZ1bmN0aW9uKHRvZG9UaXRsZSkge1xuICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMuZmluZEluZGV4QnlUaXRsZSh0b2RvVGl0bGUpO1xuICAgICAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICAgICAgICB0aGlzLnRvZG9zLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGRlbGV0ZUFjdGl2ZVRvZG86IGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMuZmluZEluZGV4QnlUaXRsZSh0aGlzLmFjdGl2ZVRvZG8udGl0bGUpO1xuICAgICAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICAgICAgICB0aGlzLmFjdGl2ZVRvZG8gPSBudWxsO1xuICAgICAgICAgICAgdGhpcy50b2Rvcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBzZXRBY3RpdmVUb2RvOiBmdW5jdGlvbih0b2RvVGl0bGUpIHtcbiAgICAgICAgLy8gSWYgc2V0QWN0aXZlVG9kbyBpcyBjYWxsZWQgd2l0aCBubyBhcmd1bWVudHMsIHNldCBhY3RpdmVUb2RvIHRvIG51bGxcbiAgICAgICAgaWYgKHRvZG9UaXRsZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLmFjdGl2ZVRvZG8gPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLmZpbmRJbmRleEJ5VGl0bGUodG9kb1RpdGxlKTtcbiAgICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgICAgICAgdGhpcy5hY3RpdmVUb2RvID0gdGhpcy50b2Rvc1tpbmRleF07XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG4vLyBwcm9qZWN0IGZhY3RvcnkgZnVuY3Rpb25cbmZ1bmN0aW9uIHByb2plY3QobmFtZSkge1xuICAgIGNvbnN0IHRvZG9zID0gW107XG4gICAgbGV0IGFjdGl2ZVRvZG8gPSBudWxsO1xuICAgIHJldHVybiBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUocHJvamVjdFByb3RvKSwge1xuICAgICAgICBuYW1lLFxuICAgICAgICBhY3RpdmVUb2RvLFxuICAgICAgICB0b2Rvc1xuICAgIH0pO1xufVxuXG5leHBvcnQgeyBwcm9qZWN0IH07IiwiLy8gdG9kbyBwcm90b3R5cGVcbmNvbnN0IHRvZG9Qcm90byA9IHtcbiAgICBjaGFuZ2VUaXRsZTogZnVuY3Rpb24obmV3VGl0bGUpIHtcbiAgICAgICAgdGhpcy50aXRsZSA9IG5ld1RpdGxlO1xuICAgIH0sXG4gICAgY2hhbmdlRGVzY3JpcHRpb246IGZ1bmN0aW9uKG5ld0Rlc2NyaXB0aW9uKSB7XG4gICAgICAgIHRoaXMuZGVzY3JpcHRpb24gPSBuZXdEZXNjcmlwdGlvbjtcbiAgICB9LCAgICBcbiAgICBjaGFuZ2VEdWVEYXRlOiBmdW5jdGlvbihuZXdEdWVEYXRlKSB7XG4gICAgICAgIHRoaXMuZHVlRGF0ZSA9IG5ld0R1ZURhdGU7XG4gICAgfSxcbiAgICBjaGFuZ2VQcmlvcml0eTogZnVuY3Rpb24obmV3UHJpb3JpdHkpIHtcbiAgICAgICAgdGhpcy5wcmlvcml0eSA9IG5ld1ByaW9yaXR5O1xuICAgIH0sXG4gICAgdG9nZ2xlQ29tcGxldGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gIXRoaXMuY29tcGxldGU7XG4gICAgfSxcbiAgICB1cGRhdGU6IGZ1bmN0aW9uKG5ld1RpdGxlLCBuZXdEZXNjcmlwdGlvbiwgbmV3RHVlRGF0ZSwgbmV3UHJpb3JpdHkpIHtcbiAgICAgICAgdGhpcy5jaGFuZ2VUaXRsZShuZXdUaXRsZSk7XG4gICAgICAgIHRoaXMuY2hhbmdlRGVzY3JpcHRpb24obmV3RGVzY3JpcHRpb24pO1xuICAgICAgICB0aGlzLmNoYW5nZUR1ZURhdGUobmV3RHVlRGF0ZSk7XG4gICAgICAgIHRoaXMuY2hhbmdlUHJpb3JpdHkobmV3UHJpb3JpdHkpO1xuICAgIH1cbn07XG5cbi8vIHRvZG8gZmFjdG9yeSBmdW5jdGlvblxuZnVuY3Rpb24gdG9kbyh0aXRsZSwgZGVzY3JpcHRpb24sIGR1ZURhdGUsIHByaW9yaXR5KSB7XG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZSh0b2RvUHJvdG8pLCB7XG4gICAgICAgIHRpdGxlLFxuICAgICAgICBkZXNjcmlwdGlvbixcbiAgICAgICAgZHVlRGF0ZSxcbiAgICAgICAgcHJpb3JpdHksXG4gICAgICAgIGNvbXBsZXRlOiBmYWxzZVxuICAgIH0pO1xufVxuXG5leHBvcnQgeyB0b2RvIH07IiwiaW1wb3J0IHsgdG9kbyB9IGZyb20gJy4uL2ZhY3RvcnlfZnVuY3Rpb25zL3RvZG8uanMnO1xuaW1wb3J0IHsgcHJvamVjdCB9IGZyb20gJy4uL2ZhY3RvcnlfZnVuY3Rpb25zL3Byb2plY3QuanMnO1xuaW1wb3J0IHsgcHViU3ViIH0gZnJvbSAnLi9wdWJTdWIuanMnO1xuXG4vLyBhcHAgbW9kdWxlIGNvbnRhaW5zIHRvZG8gbGlzdCBhcHBsaWNhdGlvbiBkYXRhIGFuZCBmdW5jdGlvbmFsaXR5XG5jb25zdCBhcHAgPSAoZnVuY3Rpb24oKSB7XG4gICAgbGV0IF9wcm9qZWN0cyA9IFtdO1xuICAgIGxldCBfYWN0aXZlUHJvamVjdDtcblxuICAgIC8vIF9nZXRTdGF0ZURhdGEgZnVuY3Rpb24gLSBidW5kbGVzIGFwcCBzdGF0ZSBkYXRhIChfcHJvamVjdHMgYW5kIF9hY3RpdmVQcm9qZWN0KSBmb3IgcHVibGlzaGluZyB0aHJvdWdoIHB1YlN1YlxuICAgIGZ1bmN0aW9uIF9nZXRTdGF0ZURhdGEoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBwcm9qZWN0czogX3Byb2plY3RzLFxuICAgICAgICAgICAgYWN0aXZlUHJvamVjdDogX2FjdGl2ZVByb2plY3QsXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gX2dldFByb2plY3RGcm9tTmFtZSBmdW5jdGlvbiAtIG9idGFpbnMgdGhlIHByb2plY3Qgb2JqZWN0IHdpdGggYSBtYXRjaGluZyBwcm9qZWN0IG5hbWVcbiAgICBmdW5jdGlvbiBfZ2V0UHJvamVjdEZyb21OYW1lKHByb2plY3ROYW1lKSB7XG4gICAgICAgIGNvbnN0IHByb2plY3QgPSBfcHJvamVjdHMuZmluZChwcm9qZWN0ID0+IHtcbiAgICAgICAgICAgIHJldHVybiBwcm9qZWN0Lm5hbWUgPT09IHByb2plY3ROYW1lO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHByb2plY3Q7XG4gICAgfVxuXG4gICAgLy8gX2dldFByb2plY3RJbmRleEZyb21OYW1lIC0gb2J0YWlucyB0aGUgaW5kZXggb2YgdGhlIHByb2plY3Qgd2l0aCB0aGUgc3BlY2lmaWVkIG5hbWUgd2l0aGluIHRoZSBfcHJvamVjdHMgYXJyYXlcbiAgICBmdW5jdGlvbiBfZ2V0UHJvamVjdEluZGV4RnJvbU5hbWUocHJvamVjdE5hbWUpIHtcbiAgICAgICAgY29uc3QgaW5kZXggPSBfcHJvamVjdHMuZmluZEluZGV4KHByb2plY3QgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHByb2plY3QubmFtZSA9PT0gcHJvamVjdE5hbWU7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gaW5kZXg7XG4gICAgfVxuXG4gICAgLy8gZ2V0UHJvamVjdHMgZnVuY3Rpb25zIC0gcmV0dXJucyBhbiBhcnJheSBvZiBhcHAgcHJvamVjdHNcbiAgICBmdW5jdGlvbiBnZXRQcm9qZWN0cygpIHtcbiAgICAgICAgcmV0dXJuIF9wcm9qZWN0cztcbiAgICB9XG5cbiAgICAvLyBnZXRBY3RpdmVQcm9qZWN0IGZ1bmN0aW9uIC0gcmV0dXJucyB0aGUgY3VycmVudCBhY3RpdmUgcHJvamVjdFxuICAgIGZ1bmN0aW9uIGdldEFjdGl2ZVByb2plY3QoKSB7XG4gICAgICAgIHJldHVybiBfYWN0aXZlUHJvamVjdDtcbiAgICB9XG5cbiAgICAvLyBjaGFuZ2VBY3RpdmVQcm9qZWN0IGZ1bmN0aW9uIC0gY2hhbmdlcyB0aGUgYWN0aXZlIGFwcGxpY2F0aW9uIHByb2plY3RcbiAgICBmdW5jdGlvbiBjaGFuZ2VBY3RpdmVQcm9qZWN0KHByb2plY3ROYW1lKSB7XG4gICAgICAgIGNvbnN0IHByb2plY3QgPSBfZ2V0UHJvamVjdEZyb21OYW1lKHByb2plY3ROYW1lKTtcbiAgICAgICAgX2FjdGl2ZVByb2plY3QgPSBwcm9qZWN0O1xuICAgICAgICBwdWJTdWIucHVibGlzaCgnYWN0aXZlUHJvamVjdENoYW5nZScsIF9nZXRTdGF0ZURhdGEoKSk7XG4gICAgfVxuXG4gICAgLy8gYWRkUHJvamVjdCBmdW5jdGlvbiAtIGFkZHMgYSBuZXcgcHJvamVjdCB0byB0aGUgX3Byb2plY3RzIGFycmF5XG4gICAgZnVuY3Rpb24gYWRkUHJvamVjdChwcm9qZWN0TmFtZSkge1xuICAgICAgICBjb25zdCBuZXdQcm9qZWN0ID0gcHJvamVjdChwcm9qZWN0TmFtZSk7XG4gICAgICAgIF9wcm9qZWN0cy5wdXNoKG5ld1Byb2plY3QpO1xuICAgICAgICBwdWJTdWIucHVibGlzaCgncHJvamVjdHNDaGFuZ2UnLCBfZ2V0U3RhdGVEYXRhKCkpO1xuICAgIH1cblxuICAgIC8vIGRlbGV0ZVByb2plY3QgZnVuY3Rpb24gLSBkZWxldGVzIHRoZSBwcm9qZWN0IHdpdGggdGhlIHNwZWNpZmllZCBuYW1lIGZyb20gX3Byb2plY3RzIGFycmF5XG4gICAgZnVuY3Rpb24gZGVsZXRlUHJvamVjdChwcm9qZWN0TmFtZSkge1xuICAgICAgICBjb25zdCBpbmRleCA9IF9nZXRQcm9qZWN0SW5kZXhGcm9tTmFtZShwcm9qZWN0TmFtZSk7XG5cbiAgICAgICAgLy8gSU1QTEVNRU5UIExPR0lDIFRIQVQgSEFORExFUyBXSEVOIFRIRSBERUxFVEVEIFBST0pFQ1QgSVMgVEhFIEFDVElWRSBQUk9KRUNUXG4gICAgICAgIF9wcm9qZWN0cy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICBwdWJTdWIucHVibGlzaCgncHJvamVjdHNDaGFuZ2UnLCBfZ2V0U3RhdGVEYXRhKCkpO1xuICAgIH1cblxuICAgIC8vIGFkZFRvZG8gZnVuY3Rpb24gLSBhZGRzIGEgdG9kbyBpdGVtIHRvIHRoZSBhY3RpdmVQcm9qZWN0XG4gICAgZnVuY3Rpb24gYWRkVG9kbyh0aXRsZSwgZGVzY3JpcHRpb24sIGR1ZURhdGUsIHByaW9yaXR5KSB7XG4gICAgICAgIC8vIENyZWF0ZSB0b2RvIGl0ZW1cbiAgICAgICAgY29uc3QgdG9kb0l0ZW0gPSB0b2RvKHRpdGxlLCBkZXNjcmlwdGlvbiwgZHVlRGF0ZSwgcHJpb3JpdHkpO1xuXG4gICAgICAgIC8vIEFwcGVuZCB0b2RvIGl0ZW0gdG8gYWN0aXZlUHJvamVjdCB0b2RvcyBhcnJheVxuICAgICAgICBfYWN0aXZlUHJvamVjdC5hZGRUb2RvKHRvZG9JdGVtKTtcblxuICAgICAgICBwdWJTdWIucHVibGlzaCgndG9kb3NDaGFuZ2UnLCBfZ2V0U3RhdGVEYXRhKCkpO1xuICAgIH1cblxuICAgIC8vIGNoYW5nZVRvZG8gZnVuY3Rpb24gLSBtb2RpZmllcyBhY3RpdmUgdG9kbyBpdGVtIG9mIGFjdGl2ZXByb2plY3QgdG8gc3BlY2lmaWVkIHBhcmFtZXRlcnNcbiAgICBmdW5jdGlvbiBjaGFuZ2VUb2RvKG5ld1RpdGxlLCBuZXdEZXNjcmlwdGlvbiwgbmV3RHVlRGF0ZSwgbmV3UHJpb3JpdHkpIHtcbiAgICAgICAgY29uc3QgYWN0aXZlVG9kbyA9IF9hY3RpdmVQcm9qZWN0LmFjdGl2ZVRvZG87XG4gICAgICAgIGNvbnNvbGUubG9nKGFjdGl2ZVRvZG8pO1xuICAgICAgICBhY3RpdmVUb2RvLnVwZGF0ZShuZXdUaXRsZSwgbmV3RGVzY3JpcHRpb24sIG5ld0R1ZURhdGUsIG5ld1ByaW9yaXR5KTsgLy8gQ0hFQ0sgVEhBVCBUSElTIElTIFdPUktJTkcgSU4gVEhFIEZJTkFMIEFQUCBWRVJTSU9OLCBDVVJSRU5UTFkgVEhFIEFDVElWRVRPRE8gSVMgU0VUIFRPIE5VTEwgU0lOQ0UgRk9STSBXQVNOJ1QgQ0xJQ0tFRCBCRUZPUkVIQU5EXG4gICAgICAgIHB1YlN1Yi5wdWJsaXNoKCd0b2Rvc0NoYW5nZScsIF9nZXRTdGF0ZURhdGEoKSk7XG4gICAgfVxuXG4gICAgLy8gY2hhbmdlQWN0aXZlVG9kbyBmdW5jdGlvbiAtIGNoYW5nZXMgdGhlIGFjdGl2ZSB0b2RvIGl0ZW0gZm9yIHRoZSBjdXJyZW50IHByb2plY3RcbiAgICBmdW5jdGlvbiBjaGFuZ2VBY3RpdmVUb2RvKHRvZG9UaXRsZSkge1xuICAgICAgICBjb25zdCBhY3RpdmVUb2RvID0gX2FjdGl2ZVByb2plY3QuYWN0aXZlVG9kbztcbiAgICAgICAgYWN0aXZlVG9kby5zZXRBY3RpdmVUb2RvKHRvZG9UaXRsZSk7XG4gICAgICAgIHB1YlN1Yi5wdWJsaXNoKCd0b2Rvc0NoYW5nZScsIF9nZXRTdGF0ZURhdGEoKSk7XG4gICAgfVxuXG4gICAgLy8gZGVsZXRlVG9kbyBmdW5jdGlvbiAtIGRlbGV0ZXMgdGhlIGFjdGl2ZSB0b2RvIGl0ZW0gZnJvbSB0aGUgYWN0aXZlUHJvamVjdFxuICAgIGZ1bmN0aW9uIGRlbGV0ZUFjdGl2ZVRvZG8oKSB7XG4gICAgICAgIF9hY3RpdmVQcm9qZWN0LmRlbGV0ZUFjdGl2ZVRvZG8oKTtcbiAgICAgICAgcHViU3ViLnB1Ymxpc2goJ3RvZG9zQ2hhbmdlJywgX2dldFN0YXRlRGF0YSgpKTtcbiAgICB9XG5cbiAgICAvLyB0b2dnbGVUb2RvQ29tcGxldGUgZnVuY3Rpb24gLSB0b2dnbGVzIHRoZSBhY3RpdmUgdG9kbyBpdGVtcyBjb21wbGV0ZSBzdGF0dXNcbiAgICBmdW5jdGlvbiB0b2dnbGVUb2RvQ29tcGxldGUoKSB7XG4gICAgICAgIF9hY3RpdmVQcm9qZWN0LmFjdGl2ZVRvZG8udG9nZ2xlQ29tcGxldGUoKTtcbiAgICAgICAgcHViU3ViLnB1Ymxpc2goJ3RvZG9zQ2hhbmdlJywgX2dldFN0YXRlRGF0YSgpKTtcbiAgICB9XG5cbiAgICAvLyBpbml0IGZ1bmN0aW9uIC0gaW5pdGlhbGl6ZXMgdGhlIGFwcGxpY2F0aW9uIHdpdGggdGhlIGdpdmVuIHByb2plY3RzIGFycmF5IGZyb20gbG9jYWxTdG9yYWdlXG4gICAgZnVuY3Rpb24gaW5pdChwcm9qZWN0cykge1xuICAgICAgICAvLyBDb252ZXJ0IGxvY2FsU3RvcmFnZSBwcm9qZWN0cyBhcnJheSB0byBvYmplY3RzIHdpdGggcHJvdG90eXBlIG1ldGhvZHMgdXNpbmcgZmFjdG9yeSBmdW5jdGlvbnNcbiAgICAgICAgcHJvamVjdHMuZm9yRWFjaChwcm9qZWN0T2JqID0+IHtcbiAgICAgICAgICAgIC8vIENyZWF0ZSBhIG5ldyBwcm9qZWN0XG4gICAgICAgICAgICBjb25zdCBuZXdQcm9qZWN0ID0gcHJvamVjdChwcm9qZWN0T2JqLm5hbWUpO1xuXG4gICAgICAgICAgICAvLyBBZGQgZWFjaCB0b2RvIHRvIHRoZSBjb3JyZXNwb25kaW5nIHByb2plY3RcbiAgICAgICAgICAgIHByb2plY3RPYmoudG9kb3MuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB0b2RvSXRlbSA9IHRvZG8oaXRlbS50aXRsZSwgaXRlbS5kZXNjcmlwdGlvbiwgaXRlbS5kdWVEYXRlLCBpdGVtLnByaW9yaXR5KTtcbiAgICAgICAgICAgICAgICBuZXdQcm9qZWN0LmFkZFRvZG8odG9kb0l0ZW0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIEFkZCBwcm9qZWN0IHRvIF9wcm9qZWN0cyBhcnJheVxuICAgICAgICAgICAgX3Byb2plY3RzLnB1c2gobmV3UHJvamVjdCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFNldCB0aGUgYWN0aXZlIHByb2plY3QgdG8gdGhlIGZpcnN0IGl0ZW0gaW4gdGhlIGFycmF5XG4gICAgICAgIF9hY3RpdmVQcm9qZWN0ID0gX3Byb2plY3RzWzBdO1xuXG4gICAgICAgIC8vIFB1Ymxpc2ggJ2luaXRpYWxpemUnIGV2ZW50XG4gICAgICAgIHB1YlN1Yi5wdWJsaXNoKCdhcHBJbml0JywgX2dldFN0YXRlRGF0YSgpKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBnZXRQcm9qZWN0cyxcbiAgICAgICAgZ2V0QWN0aXZlUHJvamVjdCxcbiAgICAgICAgY2hhbmdlQWN0aXZlUHJvamVjdCxcbiAgICAgICAgYWRkUHJvamVjdCxcbiAgICAgICAgZGVsZXRlUHJvamVjdCxcbiAgICAgICAgYWRkVG9kbyxcbiAgICAgICAgY2hhbmdlVG9kbyxcbiAgICAgICAgY2hhbmdlQWN0aXZlVG9kbyxcbiAgICAgICAgZGVsZXRlQWN0aXZlVG9kbyxcbiAgICAgICAgdG9nZ2xlVG9kb0NvbXBsZXRlLFxuICAgICAgICBpbml0XG4gICAgfTtcbn0pKCk7XG5cbmV4cG9ydCB7IGFwcCB9OyIsImltcG9ydCB7IHB1YlN1YiB9IGZyb20gJy4vcHViU3ViLmpzJztcbmltcG9ydCB7IGFwcCB9IGZyb20gJy4vYXBwLmpzJztcbmltcG9ydCB7IHZpZXdDb250cm9sbGVyIH0gZnJvbSAnLi92aWV3Q29udHJvbGxlci5qcyc7XG5cbi8vIEV2ZW50cyBtb2R1bGUgLSBjb29yZGluYXRlcyBldmVudCBhZGRpdGlvbi9tb2RpZmljYXRpb24gdG8gZG9tIG5vZGVzXG5jb25zdCBldmVudHMgPSAoZnVuY3Rpb24oKSB7XG4gICAgLyogRXZlbnQgaGFuZGxlciBmdW5jdGlvbnMgKi9cbiAgICAvLyBfY3JlYXRlTmV3UHJvamVjdCBmdW5jdGlvbiAtIENyZWF0ZXMgYSBuZXcgcHJvamVjdFxuICAgIGZ1bmN0aW9uIF9jcmVhdGVOZXdQcm9qZWN0KCkge1xuICAgICAgICAvLyBFeHRyYWN0IG5ldyBwcm9qZWN0IG5hbWVcbiAgICAgICAgY29uc3QgcHJvamVjdE5hbWVJbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNhZGQtcHJvamVjdCBpbnB1dCcpO1xuICAgICAgICBjb25zdCBwcm9qZWN0TmFtZSA9IHByb2plY3ROYW1lSW5wdXQudmFsdWU7XG5cbiAgICAgICAgLy8gQWRkIHByb2plY3QgdG8gYXBwIG1vZGVsXG4gICAgICAgIGlmIChwcm9qZWN0TmFtZSkge1xuICAgICAgICAgICAgYXBwLmFkZFByb2plY3QocHJvamVjdE5hbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ2xlYXIgcHJvamVjdCBuYW1lIGZpZWxkXG4gICAgICAgIHByb2plY3ROYW1lSW5wdXQudmFsdWUgPSAnJztcbiAgICB9XG5cbiAgICAvLyBfc2VsZWN0UHJvamVjdCBmdW5jdGlvbiAtIFNldHMgdGhlIGFjdGl2ZSBwcm9qZWN0XG4gICAgZnVuY3Rpb24gX3NlbGVjdFByb2plY3QoZSkge1xuICAgICAgICBjb25zdCBwcm9qZWN0TmFtZSA9IGUudGFyZ2V0LnBhcmVudE5vZGUuZ2V0QXR0cmlidXRlKCdkYXRhLW5hbWUnKTtcbiAgICAgICAgYXBwLmNoYW5nZUFjdGl2ZVByb2plY3QocHJvamVjdE5hbWUpO1xuICAgIH1cblxuICAgIC8vIF9kZWxldGVQcm9qZWN0IGZ1bmN0aW9uIC0gRGVsZXRlcyB0aGUgc2VsZWN0ZWQgcHJvamVjdFxuICAgIGZ1bmN0aW9uIF9kZWxldGVQcm9qZWN0KGUpIHtcbiAgICAgICAgY29uc3QgcHJvamVjdE5hbWUgPSBlLnRhcmdldC5wYXJlbnROb2RlLmdldEF0dHJpYnV0ZSgnZGF0YS1uYW1lJyk7XG4gICAgICAgIGFwcC5kZWxldGVQcm9qZWN0KHByb2plY3ROYW1lKTtcbiAgICB9XG5cbiAgICAvLyBfc2hvd05ld1RvZG9Gb3JtIGZ1bmN0aW9uIC0gU2hvd3MgdGhlIG5ldyB0b2RvIGZvcm0gYW5kIGhpZGVzIHRoZSBcIkFkZCBUb2RvXCIgYnV0dG9uXG4gICAgZnVuY3Rpb24gX3Nob3dOZXdUb2RvRm9ybSgpIHtcbiAgICAgICAgcHViU3ViLnB1Ymxpc2goJ2FjdGl2YXRlTmV3VG9kb0Zvcm0nKTtcbiAgICB9XG5cbiAgICAvLyBfZXhpdE5ld1RvZG9Gb3JtIGZ1bmN0aW9uIC0gSGlkZXMgdGhlIG5ldyB0b2RvIGZvcm0gYW5kIGRpc3BsYXlzIHRoZSBcIkFkZCBUb2RvXCIgYnV0dG9uXG4gICAgZnVuY3Rpb24gX2V4aXROZXdUb2RvRm9ybSgpIHtcbiAgICAgICAgcHViU3ViLnB1Ymxpc2goJ2Rpc2FibGVOZXdUb2RvRm9ybScpO1xuICAgIH1cblxuICAgIC8vIF9hZGROZXdUb2RvIGZ1bmN0aW9uIC0gRXh0cmFjdHMgZm9ybSB2YWx1ZXMgYW5kIGFkZHMgYSBuZXcgdG9kbyB0byB0aGUgYWN0aXZlIHByb2plY3RcbiAgICBmdW5jdGlvbiBfYWRkTmV3VG9kbygpIHtcbiAgICAgICAgLy8gRXh0cmFjdCBmb3JtIHZhbHVlc1xuICAgICAgICBjb25zdCB0aXRsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNuZXctdGl0bGUnKS52YWx1ZTtcbiAgICAgICAgY29uc3QgZGVzY3JpcHRpb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbmV3LWRlc2NyaXB0aW9uJykudmFsdWU7XG4gICAgICAgIGNvbnN0IGR1ZURhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbmV3LWRhdGUnKS52YWx1ZTtcbiAgICAgICAgY29uc3QgcHJpb3JpdHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdpbnB1dFtuYW1lPVwibmV3LXByaW9yaXR5XCJdOmNoZWNrZWQnKS52YWx1ZTtcblxuICAgICAgICBhcHAuYWRkVG9kbyh0aXRsZSwgZGVzY3JpcHRpb24sIGR1ZURhdGUsIHByaW9yaXR5KTsgXG4gICAgfVxuXG4gICAgLy8gX3NldEFjdGl2ZVRvZG8gZnVuY3Rpb24gLSBTZXRzIGFuIGluYWN0aXZlIHRvZG8gdG8gYWN0aXZlXG4gICAgZnVuY3Rpb24gX3NldEFjdGl2ZVRvZG8oZSkge1xuICAgICAgICBjb25zdCB0b2RvVGl0bGUgPSBlLnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGl0bGUnKTtcbiAgICAgICAgYXBwLmNoYW5nZUFjdGl2ZVRvZG8odG9kb1RpdGxlKTtcbiAgICB9XG5cbiAgICAvLyBfdG9nZ2xlVG9kb0NvbXBsZXRlIGZ1bmN0aW9uIC0gVG9nZ2xlcyB0aGUgYWN0aXZlIHRvZG8ncyBjb21wbGV0aW9uIHN0YXR1c1xuICAgIGZ1bmN0aW9uIF90b2dnbGVUb2RvQ29tcGxldGUoKSB7XG4gICAgICAgIGFwcC50b2dnbGVUb2RvQ29tcGxldGUoKTtcbiAgICB9XG5cbiAgICAvLyBfZGVsZXRlQWN0aXZlVG9kbyBmdW5jdGlvbiAtIERlbGV0ZXMgdGhlIGFjdGl2ZSB0b2RvXG4gICAgZnVuY3Rpb24gX2RlbGV0ZUFjdGl2ZVRvZG8oKSB7XG4gICAgICAgIGFwcC5kZWxldGVBY3RpdmVUb2RvKCk7XG4gICAgfVxuXG4gICAgLy8gX3VwZGF0ZUFjdGl2ZVRvZG8gZnVuY3Rpb24gLSBVcGRhdGVzIHRoZSBhY3RpdmUgdG9kbyBmdW5jdGlvbiB3aXRoIHVwZGF0ZWQgZm9ybSB2YWx1ZXNcbiAgICBmdW5jdGlvbiBfdXBkYXRlQWN0aXZlVG9kbygpIHtcbiAgICAgICAgLy8gRXh0cmFjdCBmb3JtIHZhbHVlc1xuICAgICAgICBjb25zdCBuZXdUaXRsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN1cGRhdGUtdGl0bGUnKS52YWx1ZTtcbiAgICAgICAgY29uc3QgbmV3RGVzY3JpcHRpb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjdXBkYXRlLWRlc2NyaXB0aW9uJykudmFsdWU7XG4gICAgICAgIGNvbnN0IG5ld0R1ZURhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjdXBkYXRlLWRhdGUnKS52YWx1ZTtcbiAgICAgICAgY29uc3QgbmV3UHJpb3JpdHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdpbnB1dFtuYW1lPVwidXBkYXRlLXByaW9yaXR5XCJdOmNoZWNrZWQnKS52YWx1ZTtcblxuICAgICAgICBhcHAuY2hhbmdlVG9kbyhuZXdUaXRsZSwgbmV3RGVzY3JpcHRpb24sIG5ld0R1ZURhdGUsIG5ld1ByaW9yaXR5KTtcbiAgICB9XG5cbiAgICAvKiBFdmVudCBTZXR0aW5nIGZ1bmN0aW9ucyAtIFRoZXNlIGZ1bmN0aW9ucyBhcHBseSBldmVudCBoYW5kbGVycyB0byBET00gZWxlbWVudHMgKi9cblxuICAgIC8vIF9hc3NpZ25OZXdQcm9qZWN0RXZlbnQgZnVuY3Rpb24gLSBBZGRzIGV2ZW50IGhhbmRsZXIgdG8gdGhlIHNpZGViYXIgTmV3IFByb2plY3QgYnV0dG9uXG4gICAgZnVuY3Rpb24gX2Fzc2lnbk5ld1Byb2plY3RFdmVudCgpIHtcbiAgICAgICAgY29uc3QgbmV3UHJvamVjdEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNhZGQtcHJvamVjdC1idG4nKTtcbiAgICAgICAgbmV3UHJvamVjdEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIF9jcmVhdGVOZXdQcm9qZWN0KTtcbiAgICB9XG5cbiAgICAvLyBfYXNzaWduUHJvamVjdEV2ZW50cyBmdW5jdGlvbiAtIEFkZHMgZXZlbnQgaGFuZGxlcnMgdG8gcHJvamVjdCBpdGVtcyBpbiB0aGUgc2lkZWJhclxuICAgIGZ1bmN0aW9uIF9hc3NpZ25Qcm9qZWN0RXZlbnRzKCkge1xuICAgICAgICBjb25zdCBwcm9qZWN0SXRlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucHJvamVjdC1uYW1lJyk7XG4gICAgICAgIHByb2plY3RJdGVtcy5mb3JFYWNoKHByb2plY3QgPT4ge1xuICAgICAgICAgICAgcHJvamVjdC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIF9zZWxlY3RQcm9qZWN0KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gX2Fzc2lnbkRlbFByb2plY3RFdmVudHMgZnVuY3Rpb24gLSBBZGRzIGV2ZW50IGhhbmRsZXJzIHRvIHByb2plY3QgZGVsZXRlIGJ1dHRvbnNcbiAgICBmdW5jdGlvbiBfYXNzaWduRGVsUHJvamVjdEV2ZW50cygpIHtcbiAgICAgICAgY29uc3QgcHJvamVjdERlbEJ1dHRvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuZGVsLXByb2plY3QnKTtcbiAgICAgICAgcHJvamVjdERlbEJ1dHRvbnMuZm9yRWFjaChidXR0b24gPT4ge1xuICAgICAgICAgICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgX2RlbGV0ZVByb2plY3QpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBfYXNzaWduQWRkVG9kb0V2ZW50IGZ1bmN0aW9uIC0gQWRkIGV2ZW50IGhhbmRsZXIgdG8gQWRkIFRvZG8gYnV0dG9uXG4gICAgZnVuY3Rpb24gX2Fzc2lnbkFkZFRvZG9FdmVudCgpIHtcbiAgICAgICAgY29uc3QgYWRkVG9kb0J0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNhZGQtdG9kby1idG4nKTtcbiAgICAgICAgYWRkVG9kb0J0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIF9zaG93TmV3VG9kb0Zvcm0pO1xuICAgIH1cblxuICAgIC8vIF9hc3NpZ25DbG9zZVRvZG9FdmVudCBmdW5jdGlvbiAtIEFkZCBldmVudCBoYW5kbGVyIHRvIGJ1dHRvbiB0aGF0IGNsb3NlcyB0aGUgbmV3IHRvZG8gZm9ybVxuICAgIGZ1bmN0aW9uIF9hc3NpZ25DbG9zZVRvZG9FdmVudCgpIHtcbiAgICAgICAgY29uc3QgY2xvc2VOZXdUb2RvQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2Nsb3NlLW5ldy10b2RvLWZvcm0nKTtcbiAgICAgICAgY2xvc2VOZXdUb2RvQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgX2V4aXROZXdUb2RvRm9ybSk7XG4gICAgfVxuXG4gICAgLy8gX2Fzc2lnblN1Ym1pdFRvZG9FdmVudCBmdW5jdGlvbiAtIEFkZCBldmVudCBoYW5kbGVyIHRvIFwiQWRkXCIgYnV0dG9uIHdoaWNoIHN1Ym1pdHMgY29udGVudCBmcm9tIHRoZSBuZXcgdG9kbyBmb3JtXG4gICAgZnVuY3Rpb24gX2Fzc2lnblN1Ym1pdFRvZG9FdmVudCgpIHtcbiAgICAgICAgY29uc3Qgc3VibWl0VG9kb0J0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzdWJtaXQtdG9kby1idG4nKTtcbiAgICAgICAgc3VibWl0VG9kb0J0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIF9hZGROZXdUb2RvKTtcbiAgICB9XG5cbiAgICAvLyBfYXNzaWduU2V0QWN0aXZlRXZlbnRzIGZ1bmN0aW9uIC0gQWRkcyBldmVudCBoYW5kbGVycyB0byBpbmFjdGl2ZSB0b2RvIGl0ZW1zIG9uIHRoZSBwYWdlXG4gICAgZnVuY3Rpb24gX2Fzc2lnblNldEFjdGl2ZUV2ZW50cygpIHtcbiAgICAgICAgY29uc3QgaW5hY3RpdmVUb2RvcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5pbmFjdGl2ZS10b2RvJyk7XG4gICAgICAgIGluYWN0aXZlVG9kb3MuZm9yRWFjaCh0b2RvID0+IHtcbiAgICAgICAgICAgIHRvZG8uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBfc2V0QWN0aXZlVG9kbyk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIF9hc3NpZ25Ub2dnbGVUb2RvQ29tcGxldGVFdmVudCBmdW5jdGlvbiAtIEFkZHMgZXZlbnQgaGFuZGxlciB0byBidXR0b24gZm9yIHRvZ2dsaW5nIHRvZG8gY29tcGxldGlvblxuICAgIGZ1bmN0aW9uIF9hc3NpZ25Ub2dnbGVUb2RvQ29tcGxldGVFdmVudCgpIHtcbiAgICAgICAgY29uc3QgdG9nZ2xlQ29tcGxldGVCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjdG9nZ2xlLWNvbXBsZXRlJyk7XG4gICAgICAgIHRvZ2dsZUNvbXBsZXRlQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgX3RvZ2dsZVRvZG9Db21wbGV0ZSk7XG4gICAgfVxuXG4gICAgLy8gX2Fzc2lnbkRlbGV0ZUFjdGl2ZVRvZG9FdmVudCBmdW5jdGlvbiAtIEFkZHMgZXZlbnQgaGFuZGxlciB0byBidXR0b24gdGhhdCBkZWxldGVzIHRoZSBhY3RpdmUgdG9kb1xuICAgIGZ1bmN0aW9uIF9hc3NpZ25EZWxldGVBY3RpdmVUb2RvRXZlbnQoKSB7XG4gICAgICAgIGNvbnN0IGRlbFRvZG9CdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZGVsLWFjdGl2ZS10b2RvJyk7XG4gICAgICAgIGRlbFRvZG9CdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBfZGVsZXRlQWN0aXZlVG9kbyk7XG4gICAgfVxuXG4gICAgLy8gX2Fzc2lnblVwZGF0ZUFjdGl2ZVRvZG9FdmVudCBmdW5jdGlvbiAtIEFkZHMgZXZlbnQgaGFuZGxlciB0byBzYXZlIGJ1dHRvbiB0aGF0IHVwZGF0ZXMgYWN0aXZlIHRvZG8gaW5mb3JtYXRpb25cbiAgICBmdW5jdGlvbiBfYXNzaWduVXBkYXRlQWN0aXZlVG9kb0V2ZW50KCkge1xuICAgICAgICBjb25zdCBzYXZlQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3NhdmUtYnRuJyk7XG4gICAgICAgIHNhdmVCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBfdXBkYXRlQWN0aXZlVG9kbyk7XG4gICAgfVxuXG4gICAgLy8gX2Fzc2lnblNpZGViYXJFdmVudHMgd3JhcHBlciBmdW5jdGlvbiAtIEFkZCBldmVudCBoYW5kbGVycyB0byB0aGUgUHJvamVjdHMgc2lkZSBiYXJcbiAgICBmdW5jdGlvbiBfYXNzaWduU2lkZWJhckV2ZW50cygpIHtcbiAgICAgICAgX2Fzc2lnbk5ld1Byb2plY3RFdmVudCgpO1xuICAgICAgICBfYXNzaWduUHJvamVjdEV2ZW50cygpO1xuICAgICAgICBfYXNzaWduRGVsUHJvamVjdEV2ZW50cygpXG4gICAgfVxuXG4gICAgLy8gX2Fzc2lnbk5ld1RvZG9FdmVudHMgd3JhcHBlciBmdW5jdGlvbiAtIEFkZCBldmVudCBoYW5kbGVycyBhc3NvY2lhdGVkIHdpdGggYWRkaW5nIGEgbmV3IHRvZG9cbiAgICBmdW5jdGlvbiBfYXNzaWduTmV3VG9kb0V2ZW50cygpIHtcbiAgICAgICAgX2Fzc2lnbkFkZFRvZG9FdmVudCgpO1xuICAgICAgICBfYXNzaWduQ2xvc2VUb2RvRXZlbnQoKTtcbiAgICAgICAgX2Fzc2lnblN1Ym1pdFRvZG9FdmVudCgpO1xuICAgIH1cblxuICAgIC8vIF9hc3NpZ25Ub2RvTGlzdEV2ZW50cyB3cmFwcGVyIGZ1bmN0aW9uIC0gQWRkIGV2ZW50IGhhbmRsZXJzIHRvIFRvZG8gSXRlbXMgc2VjdGlvblxuICAgIGZ1bmN0aW9uIF9hc3NpZ25Ub2RvTGlzdEV2ZW50cygpIHtcbiAgICAgICAgX2Fzc2lnblNldEFjdGl2ZUV2ZW50cygpO1xuICAgICAgICBfYXNzaWduVG9nZ2xlVG9kb0NvbXBsZXRlRXZlbnQoKTtcbiAgICAgICAgX2Fzc2lnbkRlbGV0ZUFjdGl2ZVRvZG9FdmVudCgpO1xuICAgICAgICBfYXNzaWduVXBkYXRlQWN0aXZlVG9kb0V2ZW50KCk7XG4gICAgfVxuXG4vKlxuICAgIC8vIF9hc3NpZ25NYWluRXZlbnRzIHdyYXBwZXIgZnVuY3Rpb24gLSBBZGQgZXZlbnQgaGFuZGxlcnMgdG8gdGhlIG1haW4gcGFnZSBUb2RvIGxpc3QgY29udGVudFxuICAgIGZ1bmN0aW9uIF9hc3NpZ25NYWluRXZlbnRzKCkge1xuICAgICAgICBfYXNzaWduTmV3VG9kb0V2ZW50cygpO1xuICAgICAgICBfYXNzaWduVG9kb0xpc3RFdmVudHMoKTtcbiAgICB9XG5cbiAgICAvLyBfYXNzaWduRnVsbFBhZ2VFdmVudHMgd3JhcHBlciBmdW5jdGlvbiAtIEFkZHMgZXZlbnQgaGFuZGxlcnMgdG8gdGhlIGVudGlyZSBwYWdlXG4gICAgZnVuY3Rpb24gX2Fzc2lnbkZ1bGxQYWdlRXZlbnRzKCkge1xuICAgICAgICBfYXNzaWduU2lkZWJhckV2ZW50cygpO1xuICAgICAgICBfYXNzaWduTWFpbkV2ZW50cygpO1xuICAgIH1cbiovXG4gICAgXG4gICAgLy8gaW5pdCBmdW5jdGlvbiAtIGNyZWF0ZXMgcHViU3ViIHN1YnNjcmlwdGlvbnNcbiAgICBmdW5jdGlvbiBpbml0KCkge1xuICAgICAgICAvLyBwdWJTdWIuc3Vic2NyaWJlKCdmdWxsUGFnZVJlbmRlcicsIF9hc3NpZ25GdWxsUGFnZUV2ZW50cyk7XG4gICAgICAgIC8vIE9uIHByb2plY3RzUmVuZGVyLCBhc3NpZ24gZXZlbnQgaGFuZGxlcnMgdG8gdGhlIHByb2plY3RzIHNpZGViYXJcbiAgICAgICAgcHViU3ViLnN1YnNjcmliZSgncHJvamVjdHNSZW5kZXInLCBfYXNzaWduU2lkZWJhckV2ZW50cyk7XG5cbiAgICAgICAgLy8gT24gbmV3VG9kb0NvbnRlbnRSZW5kZXIsIGFzc2lnbiBhc3NvY2lhdGVkIGZvcm0gZXZlbnQgaGFuZGxlcnNcbiAgICAgICAgcHViU3ViLnN1YnNjcmliZSgnbmV3VG9kb0NvbnRlbnRSZW5kZXInLCBfYXNzaWduTmV3VG9kb0V2ZW50cyk7XG5cbiAgICAgICAgLy8gT24gdG9kb3NSZW5kZXIsIGFzc2lnbiBhc3NvY2lhdGVkIHBhZ2UgZXZlbnQgaGFuZGxlcnNcbiAgICAgICAgcHViU3ViLnN1YnNjcmliZSgndG9kb3NSZW5kZXInLCBfYXNzaWduVG9kb0xpc3RFdmVudHMpO1xuXG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBpbml0XG4gICAgfTtcbn0pKCk7XG5cbmV4cG9ydCB7IGV2ZW50cyB9OyIsImNvbnN0IHB1YlN1YiA9IHtcbiAgICBldmVudHM6IHt9LFxuICAgIHN1YnNjcmliZTogZnVuY3Rpb24oZXZlbnROYW1lLCBmbikge1xuICAgICAgICB0aGlzLmV2ZW50c1tldmVudE5hbWVdID0gdGhpcy5ldmVudHNbZXZlbnROYW1lXSB8fCBbXTtcbiAgICAgICAgdGhpcy5ldmVudHNbZXZlbnROYW1lXS5wdXNoKGZuKTtcbiAgICB9LFxuICAgIHVuc3Vic2NyaWJlOiBmdW5jdGlvbihldmVudE5hbWUsIGZuKSB7XG4gICAgICAgIGlmICh0aGlzLmV2ZW50c1tldmVudE5hbWVdKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5ldmVudHNbZXZlbnROYW1lXS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMuZXZlbnRzW2V2ZW50TmFtZV1baV0gPT09IGZuKSB7XG4gICAgICAgICAgICB0aGlzLmV2ZW50c1tldmVudE5hbWVdLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfSxcbiAgICBwdWJsaXNoOiBmdW5jdGlvbihldmVudE5hbWUsIGRhdGEpIHtcbiAgICAgICAgaWYgKHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0pIHtcbiAgICAgICAgdGhpcy5ldmVudHNbZXZlbnROYW1lXS5mb3JFYWNoKGZ1bmN0aW9uKGZuKSB7XG4gICAgICAgICAgICBmbihkYXRhKTtcbiAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5leHBvcnQgeyBwdWJTdWIgfTsiLCJpbXBvcnQgeyBwdWJTdWIgfSBmcm9tICcuL3B1YlN1Yi5qcyc7XG5cbi8vIFN0b3JhZ2UgbW9kdWxlIC0gaGFuZGxlcyBzdG9yYWdlL3JldHJpZXZhbCBvZiBicm93c2VyIGxvY2FsU3RvcmFnZSBkYXRhXG5jb25zdCBzdG9yYWdlID0gKGZ1bmN0aW9uKCkge1xuICAgIC8vIGluaXQgZnVuY3Rpb24gLSBTZXRzIHVwIHB1YlN1YiBzdWJzY3JpcHRpb25zXG4gICAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIGluaXRcbiAgICB9O1xufSkoKTtcblxuZXhwb3J0IHsgc3RvcmFnZSB9OyIsImltcG9ydCB7IGNyZWF0ZVNpZGViYXJDb250ZW50IH0gZnJvbSAnLi4vdmlld3Mvc2lkZWJhci5qcyc7XG5pbXBvcnQgeyBjcmVhdGVQcm9qZWN0VGl0bGVDb250ZW50IH0gZnJvbSAnLi4vdmlld3MvdGl0bGUuanMnO1xuaW1wb3J0IHsgY3JlYXRlTmV3VG9kb0NvbnRlbnQgfSBmcm9tICcuLi92aWV3cy9uZXdUb2RvU2VjdGlvbi5qcyc7XG5pbXBvcnQgeyBjcmVhdGVUb2RvSXRlbUNvbnRlbnQgfSBmcm9tICcuLi92aWV3cy90b2RvSXRlbXMuanMnO1xuaW1wb3J0IHsgcHViU3ViIH0gZnJvbSAnLi9wdWJTdWIuanMnO1xuXG4vLyB2aWV3Q29udHJvbGxlciBtb2R1bGUgLSBjb250cm9scyBET00gbWFuaXB1bGF0aW9uXG5jb25zdCB2aWV3Q29udHJvbGxlciA9IChmdW5jdGlvbigpIHtcbiAgICAvLyBfc2hvd05ld1RvZG9Gb3JtIGZ1bmN0aW9uIC0gTWFrZXMgdGhlIFwiQWRkIE5ldyBUb2RvXCIgZm9ybSB2aXNpYmxlXG4gICAgZnVuY3Rpb24gX3Nob3dOZXdUb2RvRm9ybSgpIHtcbiAgICAgICAgY29uc3QgZm9ybSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5hZGQtdG9kbycpO1xuICAgICAgICBjb25zdCBmb3JtVG9nZ2xlQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2FkZC10b2RvLWJ0bicpO1xuICAgICAgICBmb3JtLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICBmb3JtVG9nZ2xlQnRuLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgfVxuXG4gICAgLy8gX2hpZGVOZXdUb2RvRm9ybSBmdW5jdGlvbiAtIEhpZGVzIHRoZSBcIkFkZCBOZXcgVG9kb1wiIGZvcm1cbiAgICBmdW5jdGlvbiBfaGlkZU5ld1RvZG9Gb3JtKCkge1xuICAgICAgICBjb25zdCBmb3JtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmFkZC10b2RvJyk7XG4gICAgICAgIGNvbnN0IGZvcm1Ub2dnbGVCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYWRkLXRvZG8tYnRuJyk7XG4gICAgICAgIGZvcm0uc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgZm9ybVRvZ2dsZUJ0bi5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICB9XG4gICAgXG4gICAgLy8gX3JlbmRlclByb2plY3RzIGZ1bmN0aW9uIC0gcmVuZGVycyBzaWRlYmFyIGNvbnRlbnRcbiAgICBmdW5jdGlvbiBfcmVuZGVyUHJvamVjdHMoZGF0YSkge1xuICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcblxuICAgICAgICAvLyBDbGVhciB0aGUgcHJvamVjdC1saXN0IHNpZGViYXJcbiAgICAgICAgY29uc3QgcHJvamVjdExpc3REaXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcHJvamVjdC1saXN0JylcbiAgICAgICAgcHJvamVjdExpc3REaXYudGV4dENvbnRlbnQgPSAnJztcblxuICAgICAgICAvLyBFeHRyYWN0IHJlbGV2YW50IGRhdGFcbiAgICAgICAgY29uc3QgcHJvamVjdE5hbWVMaXN0ID0gZGF0YS5wcm9qZWN0cy5tYXAocHJvamVjdCA9PiB7XG4gICAgICAgICAgICByZXR1cm4gcHJvamVjdC5uYW1lO1xuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBhY3RpdmVQcm9qZWN0TmFtZSA9IGRhdGEuYWN0aXZlUHJvamVjdC5uYW1lO1xuXG4gICAgICAgIC8vIEdlbmVyYXRlIHByb2plY3QtbGlzdCBzaWRlYmFyIGh0bWxcbiAgICAgICAgY29uc3Qgc2lkZWJhckNvbnRlbnQgPSBjcmVhdGVTaWRlYmFyQ29udGVudChwcm9qZWN0TmFtZUxpc3QsIGFjdGl2ZVByb2plY3ROYW1lKTtcbiAgICAgICAgcHJvamVjdExpc3REaXYuYXBwZW5kQ2hpbGQoc2lkZWJhckNvbnRlbnQpO1xuICAgICAgICBcbiAgICAgICAgcHViU3ViLnB1Ymxpc2goJ3Byb2plY3RzUmVuZGVyJyk7XG4gICAgfVxuXG4gICAgLy8gX3JlbmRlclByb2plY3RUaXRsZSBmdW5jdGlvbiAtIHJlbmRlcnMgdGhlIHByb2plY3QgdGl0bGUgb24gdGhlIHBhZ2VcbiAgICBmdW5jdGlvbiBfcmVuZGVyUHJvamVjdFRpdGxlKGRhdGEpIHtcbiAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XG5cbiAgICAgICAgLy8gQ2xlYXIgcHJvamVjdC10aXRsZS1jb250ZW50XG4gICAgICAgIGNvbnN0IHByb2plY3RUaXRsZURpdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNwcm9qZWN0LXRpdGxlLWNvbnRlbnQnKTtcbiAgICAgICAgcHJvamVjdFRpdGxlRGl2LnRleHRDb250ZW50ID0gJyc7XG5cbiAgICAgICAgLy8gRXh0cmFjdCByZWxldmFudCBkYXRhXG5cbiAgICAgICAgLy8gR2VuZXJhdGUgcHJvamVjdC10aXRsZSBodG1sXG4gICAgICAgIGNvbnN0IHByb2plY3RUaXRsZUNvbnRlbnQgPSBjcmVhdGVQcm9qZWN0VGl0bGVDb250ZW50KCk7XG4gICAgICAgIC8vcHJvamVjdFRpdGxlRGl2LmFwcGVuZENoaWxkKHByb2plY3RUaXRsZUNvbnRlbnQpO1xuICAgICAgICBcbiAgICAgICAgcHViU3ViLnB1Ymxpc2goJ3Byb2plY3RUaXRsZVJlbmRlcicpO1xuICAgIH1cblxuICAgIC8vIF9yZW5kZXJOZXdUb2RvQ29udGVudCBmdW5jdGlvbiAtIHJlbmRlcnMgcGFnZSBjb250ZW50IHJlbGF0ZWQgdG8gYWRkaW5nIG5ldyB0b2RvXG4gICAgZnVuY3Rpb24gX3JlbmRlck5ld1RvZG9Db250ZW50KGRhdGEpIHtcbiAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XG5cbiAgICAgICAgLy8gQ2xlYXIgbmV3LXRvZG8tY29udGVudCBkaXZcbiAgICAgICAgY29uc3QgbmV3VG9kb0NvbnRlbnREaXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbmV3LXRvZG8tY29udGVudCcpO1xuICAgICAgICBuZXdUb2RvQ29udGVudERpdi50ZXh0Q29udGVudCA9ICcnO1xuXG4gICAgICAgIC8vIEV4dHJhY3QgcmVsZXZhbnQgZGF0YVxuXG4gICAgICAgIC8vIEdlbmVyYXRlIG5ldy10b2RvLWNvbnRlbnQgaHRtbFxuICAgICAgICBjb25zdCBuZXdUb2RvQ29udGVudCA9IGNyZWF0ZU5ld1RvZG9Db250ZW50KCk7XG4gICAgICAgIC8vbmV3VG9kb0NvbnRlbnREaXYuYXBwZW5kQ2hpbGQobmV3VG9kb0NvbnRlbnQpO1xuXG4gICAgICAgIFxuICAgICAgICBwdWJTdWIucHVibGlzaCgnbmV3VG9kb0NvbnRlbnRSZW5kZXInKTtcbiAgICB9XG5cbiAgICAvLyBfcmVuZGVyVG9kb3MgZnVuY3Rpb24gLSByZW5kZXJzIHRvZG8gY29udGVudFxuICAgIGZ1bmN0aW9uIF9yZW5kZXJUb2RvcyhkYXRhKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuXG4gICAgICAgIC8vIENsZWFyIHRvZG8tbGlzdC1pdGVtcyBkaXZcbiAgICAgICAgY29uc3QgdG9kb0xpc3RJdGVtc0RpdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN0b2RvLWxpc3QtaXRlbXMnKTtcbiAgICAgICAgdG9kb0xpc3RJdGVtc0Rpdi50ZXh0Q29udGVudCA9ICcnO1xuICAgICAgICBjb25zb2xlLmxvZygneWVzJyk7XG5cbiAgICAgICAgLy8gRXh0cmFjdCByZWxldmFudCBkYXRhXG5cbiAgICAgICAgLy8gR2VuZXJhdGUgdG9kby1saXN0LWl0ZW1zIGNvbnRlbnRcbiAgICAgICAgY29uc3QgdG9kb0xpc3RJdGVtc0NvbnRlbnQgPSBjcmVhdGVUb2RvSXRlbUNvbnRlbnQoKTtcbiAgICAgICAgLy90b2RvTGlzdEl0ZW1zRGl2LmFwcGVuZENoaWxkKHRvZG9MaXN0SXRlbXNDb250ZW50KTtcbiAgICAgICAgXG4gICAgICAgIHB1YlN1Yi5wdWJsaXNoKCd0b2Rvc1JlbmRlcicpO1xuICAgIH1cbiAgICBcbiAgICAvLyBfcmVuZGVyRnVsbFBhZ2UgZnVuY3Rpb24gLSByZW5kZXJzIHRoZSBlbnRpcmUgcGFnZSdzIGNvbnRlbnRcbiAgICBmdW5jdGlvbiBfcmVuZGVyRnVsbFBhZ2UoZGF0YSkge1xuICAgICAgICBfcmVuZGVyUHJvamVjdHMoZGF0YSk7XG4gICAgICAgIF9yZW5kZXJQcm9qZWN0VGl0bGUoZGF0YSk7XG4gICAgICAgIF9yZW5kZXJOZXdUb2RvQ29udGVudChkYXRhKTtcbiAgICAgICAgX3JlbmRlclRvZG9zKGRhdGEpO1xuICAgIH1cbiAgICBcbiAgICAvLyBpbml0IGZ1bmN0aW9uIC0gU3Vic2NyaWJlcyB0byBwdWJTdWIgZXZlbnRzXG4gICAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICAgICAgcHViU3ViLnN1YnNjcmliZSgnYXBwSW5pdCcsIF9yZW5kZXJGdWxsUGFnZSk7XG4gICAgICAgIHB1YlN1Yi5zdWJzY3JpYmUoJ2FjdGl2YXRlTmV3VG9kb0Zvcm0nLCBfc2hvd05ld1RvZG9Gb3JtKTtcbiAgICAgICAgcHViU3ViLnN1YnNjcmliZSgnZGlzYWJsZU5ld1RvZG9Gb3JtJywgX2hpZGVOZXdUb2RvRm9ybSk7XG4gICAgICAgIHB1YlN1Yi5zdWJzY3JpYmUoJ3Byb2plY3RzQ2hhbmdlJywgX3JlbmRlclByb2plY3RzKTtcbiAgICAgICAgcHViU3ViLnN1YnNjcmliZSgndG9kb3NDaGFuZ2UnLCBfcmVuZGVyVG9kb3MpO1xuICAgICAgICBwdWJTdWIuc3Vic2NyaWJlKCdhY3RpdmVQcm9qZWN0Q2hhbmdlJywgX3JlbmRlckZ1bGxQYWdlKTtcbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIHsgaW5pdCB9O1xufSkoKTtcblxuZXhwb3J0IHsgdmlld0NvbnRyb2xsZXIgfTsiLCJpbXBvcnQgeyBkb21VdGlsIH0gZnJvbSAnLi91dGlsLmpzJztcblxuZnVuY3Rpb24gY3JlYXRlTmV3VG9kb0NvbnRlbnQoKSB7XG4gICAgcmV0dXJuO1xufVxuXG5leHBvcnQgeyBjcmVhdGVOZXdUb2RvQ29udGVudCB9OyIsImltcG9ydCB7IGRvbVV0aWwgfSBmcm9tICcuL3V0aWwuanMnO1xuXG5mdW5jdGlvbiBjcmVhdGVQcm9qZWN0RGl2KHByb2plY3ROYW1lLCBpc0FjdGl2ZVByb2plY3QpIHtcbiAgICAvLyBQYXJlbnRcbiAgICBjb25zdCBwcm9qZWN0RGl2Q2xhc3NMaXN0ID0gaXNBY3RpdmVQcm9qZWN0ID8gWyAncHJvamVjdCcgXSA6IFsgJ3Byb2plY3QnLCAnYWN0aXZlLXByb2plY3QnIF07XG4gICAgY29uc3QgcHJvamVjdERpdiA9IGRvbVV0aWwuY3JlYXRlKCdkaXYnLCAnJywge1xuICAgICAgICBjbGFzczogcHJvamVjdERpdkNsYXNzTGlzdCxcbiAgICAgICAgYXR0cmlidXRlczoge1xuICAgICAgICAgICAgJ2RhdGEtbmFtZSc6IHByb2plY3ROYW1lXG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIENoaWxkcmVuXG4gICAgY29uc3QgbmFtZVAgPSBkb21VdGlsLmNyZWF0ZSgncCcsIHByb2plY3ROYW1lLCB7IGNsYXNzOiAncHJvamVjdC1uYW1lJyB9KTtcbiAgICBjb25zdCBkZWxCdXR0b24gPSBkb21VdGlsLmNyZWF0ZSgnYnV0dG9uJywgJy0nLCB7IGNsYXNzOiAnZGVsLXByb2plY3QnIH0pO1xuICAgIGNvbnN0IGNoaWxkcmVuID0gWyBuYW1lUCwgZGVsQnV0dG9uIF07XG5cbiAgICAvLyBBcHBlbmQgY2hpbGRyZW4gdG8gcGFyZW50XG4gICAgZG9tVXRpbC5hcHBlbmRDaGlsZHJlbihwcm9qZWN0RGl2LCBjaGlsZHJlbik7XG5cbiAgICByZXR1cm4gcHJvamVjdERpdjtcbn1cblxuZnVuY3Rpb24gY3JlYXRlU2lkZWJhckNvbnRlbnQocHJvamVjdE5hbWVMaXN0LCBhY3RpdmVQcm9qZWN0TmFtZSkge1xuICAgIC8vIHBhcmVudFxuICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvbVV0aWwuY3JlYXRlKCdkaXYnLCAnJyk7XG4gICAgXG4gICAgLy8gY2hpbGRyZW5cbiAgICBwcm9qZWN0TmFtZUxpc3QuZm9yRWFjaChwcm9qZWN0TmFtZSA9PiB7XG4gICAgICAgIC8vIEFwcGVuZCBjaGlsZHJlbiB0byBwYXJlbnRcbiAgICAgICAgY29uc3QgaXNBY3RpdmVQcm9qZWN0ID0gcHJvamVjdE5hbWUgPT09IGFjdGl2ZVByb2plY3ROYW1lO1xuICAgICAgICBjb25zdCBwcm9qZWN0RGl2ID0gY3JlYXRlUHJvamVjdERpdihwcm9qZWN0TmFtZSwgaXNBY3RpdmVQcm9qZWN0KTtcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZChwcm9qZWN0RGl2KTtcbiAgICB9KTtcblxuICAgIHJldHVybiBjb250YWluZXI7XG59XG5cbmV4cG9ydCB7IGNyZWF0ZVNpZGViYXJDb250ZW50IH07IiwiaW1wb3J0IHsgZG9tVXRpbCB9IGZyb20gJy4vdXRpbC5qcyc7XG5cbmZ1bmN0aW9uIGNyZWF0ZVByb2plY3RUaXRsZUNvbnRlbnQoKSB7XG4gICAgcmV0dXJuO1xufVxuXG5leHBvcnQgeyBjcmVhdGVQcm9qZWN0VGl0bGVDb250ZW50IH07IiwiaW1wb3J0IHsgZG9tVXRpbCB9IGZyb20gJy4vdXRpbC5qcyc7XG5cbmZ1bmN0aW9uIGNyZWF0ZVRvZG9JdGVtQ29udGVudCgpIHtcbiAgICByZXR1cm47XG59XG5cbmV4cG9ydCB7IGNyZWF0ZVRvZG9JdGVtQ29udGVudCB9OyIsIi8vIGRvbVV0aWwgbW9kdWxlIC0gY29udGFpbnMgZnVuY3Rpb25zIHRvIHNpbXBsaWZ5IERPTSBub2RlIG1hbmlwdWxhdGlvbiBhbmQgY3JlYXRpb25cbmNvbnN0IGRvbVV0aWwgPSAoZnVuY3Rpb24oKSB7XG4gICAgLy8gX2FkZElkIGZ1bmN0aW9uIC0gYWRkcyBpZCB0byBhIHNwZWNpZmllZCBlbGVtZW50XG4gICAgZnVuY3Rpb24gX2FkZElkKGVsZW0sIGlkKSB7XG4gICAgICAgIGVsZW0uaWQgPSBpZDtcbiAgICAgICAgcmV0dXJuIGVsZW07XG4gICAgfVxuICAgIFxuICAgIC8vIF9hZGRDbGFzcyAtIGFkZHMgc3BlY2lmaWVkIGNsYXNzZXMgdG8gYW4gZWxlbWVudFxuICAgIGZ1bmN0aW9uIF9hZGRDbGFzcyhlbGVtLCBjbGFzc2VzKSB7XG4gICAgICAgIGlmICh0eXBlb2YgY2xhc3NlcyA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGVsZW0uY2xhc3NMaXN0LmFkZChjbGFzc2VzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNsYXNzZXMuZm9yRWFjaChjbGFzc05hbWUgPT4ge1xuICAgICAgICAgICAgICAgIGVsZW0uY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGVsZW07XG4gICAgfVxuXG4gICAgLy8gX2FkZEF0dHJpYnV0ZSAtIGFkZHMgc3BlY2lmaWVkIGF0dHJpYnV0ZXMgdG8gYW4gZWxlbWVudFxuICAgIGZ1bmN0aW9uIF9hZGRBdHRyaWJ1dGUoZWxlbSwgYXR0cmlidXRlcykge1xuICAgICAgICBmb3IgKGxldCBrZXkgaW4gYXR0cmlidXRlcykge1xuICAgICAgICAgICAgZWxlbS5zZXRBdHRyaWJ1dGUoa2V5LCBhdHRyaWJ1dGVzW2tleV0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBlbGVtO1xuICAgIH1cbiAgICBcbiAgICAvKiBjcmVhdGUgbWV0aG9kIC0gY3JlYXRlcyBhbiBlbGVtZW50IHdpdGggc3BlY2lmaWVkIHRhZywgZ2l2ZW4gdGV4dCwgYW5kIHN1cHBsaWVkIG9wdGlvbnNcbiAgICBvcHRpb25zIHBhcmVtdGVyIGlzIG9mIHRoZSBmb3JtOiBcbiAgICB7XG4gICAgICAgIGlkOiBTdHJpbmcsXG4gICAgICAgIGNsYXNzOiBTdHJpbmcgfCBbU3RyaW5nXVxuICAgICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgICBhdHRyaWJ1dGUxOiBTdHJpbmcsXG4gICAgICAgICAgICBhdHRyaWJ1dGUyOiBTdHJpbmdcbiAgICAgICAgfVxuICAgIH1cbiAgICAqL1xuICAgIGZ1bmN0aW9uIGNyZWF0ZSh0YWcsIHRleHQsIG9wdGlvbnMpIHtcbiAgICAgICAgY29uc3QgZWxlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnKTtcbiAgICAgICAgZWxlbS50ZXh0Q29udGVudCA9IHRleHQ7XG5cbiAgICAgICAgLy8gcmV0dXJuIHRoZSBlbGVtZW50IGlmIG5vIG9wdGlvbnMgd2VyZSBzcGVjaWZpZWRcbiAgICAgICAgaWYgKG9wdGlvbnMgPT09IHVuZGVmaW5lZCB8fCBPYmplY3Qua2V5cyhvcHRpb25zKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiBlbGVtO1xuICAgICAgICB9IFxuICAgICAgICBcbiAgICAgICAgLy8gQWRkIHNwZWNpZmllZCBpZFxuICAgICAgICBpZiAob3B0aW9ucy5pZCkge1xuICAgICAgICAgICAgX2FkZElkKGVsZW0sIG9wdGlvbnMuaWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQWRkIHNwZWNpZmllZCBjbGFzc1xuICAgICAgICBpZiAob3B0aW9ucy5jbGFzcykge1xuICAgICAgICAgICAgX2FkZENsYXNzKGVsZW0sIG9wdGlvbnMuY2xhc3MpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQWRkIHNwZWNpZmllZCBhdHRyaWJ1dGVzXG4gICAgICAgIGlmIChvcHRpb25zLmF0dHJpYnV0ZXMgIT09IHVuZGVmaW5lZCAmJiBPYmplY3Qua2V5cyhvcHRpb25zLmF0dHJpYnV0ZXMpLmxlbmd0aCAhPT0gMCkge1xuICAgICAgICAgICAgX2FkZEF0dHJpYnV0ZShlbGVtLCBvcHRpb25zLmF0dHJpYnV0ZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGVsZW07XG4gICAgfVxuXG4gICAgLy8gYXBwZW5kQ2hpbGRyZW4gbWV0aG9kIC0gYXBwZW5kcyBhbiBhcnJheSBvZiBjaGlsZHJlbiB0byB0aGUgcGFyZW50IG5vZGUgaW4gdGhlIHByb3ZpZGVkIG9yZGVyXG4gICAgZnVuY3Rpb24gYXBwZW5kQ2hpbGRyZW4ocGFyZW50LCBjaGlsZHJlbikge1xuICAgICAgICBjaGlsZHJlbi5mb3JFYWNoKGNoaWxkID0+IHtcbiAgICAgICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZChjaGlsZCk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcGFyZW50O1xuICAgIH1cblxuICAgIC8vIENsZWFyIFxuICAgIHJldHVybiB7XG4gICAgICAgIGNyZWF0ZSxcbiAgICAgICAgYXBwZW5kQ2hpbGRyZW4sXG4gICAgfTtcbn0pKCk7XG5cbmV4cG9ydCB7IGRvbVV0aWwgfTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IHZpZXdDb250cm9sbGVyIH0gZnJvbSAnLi9tb2R1bGVzL3ZpZXdDb250cm9sbGVyLmpzJztcbmltcG9ydCB7IGV2ZW50cyB9IGZyb20gJy4vbW9kdWxlcy9ldmVudHMuanMnO1xuaW1wb3J0IHsgc3RvcmFnZSB9IGZyb20gJy4vbW9kdWxlcy9zdG9yYWdlLmpzJztcbmltcG9ydCB7IGFwcCB9IGZyb20gJy4vbW9kdWxlcy9hcHAuanMnO1xuXG4vLyBURU1QT1JBUlkgcHJvamVjdHMgYXJyYXkgdGhhdCB3aWxsIHN0YW5kIGluIGZvciBsb2NhbFN0b3JhZ2UgdG8gcmVoeWRyYXRlIGludG8gYXBwcm9wcmlhdGUgb2JqZWN0cyB3aXRoIHByb3RvdHlwZXNcbmNvbnN0IHByb2plY3RzID0gW1xuICAgIHtcbiAgICAgICAgbmFtZTogJ0Zvb2QgUHJvamVjdCcsXG4gICAgICAgIHRvZG9zOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGl0bGU6ICdFYXQgc29tZSBwaXp6YScsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdFYXQgc29tZSBwaXp6YSB3aXRoIGdhcmxpYyBzYXVjZScsXG4gICAgICAgICAgICAgICAgZHVlRGF0ZTogJzEwLzIyLzEyJyxcbiAgICAgICAgICAgICAgICBwcmlvcml0eTogJ2hpZ2gnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRpdGxlOiAnRWF0IHNvbWUgY2hpY2tlbiB3aW5ncycsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdFYXQgc29tZSBwaXp6YSB3aXRoIGdhcmxpYyBzYXVjZScsXG4gICAgICAgICAgICAgICAgZHVlRGF0ZTogJzAzLzE0LzE4JyxcbiAgICAgICAgICAgICAgICBwcmlvcml0eTogJ21pZCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnR3VpdGFyIFByb2plY3QnLFxuICAgICAgICB0b2RvczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRpdGxlOiAnUHJhY3RpY2UgU3RhaXJ3YXkgdG8gSGVhdmVuJyxcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ1ByYWN0aWNlIHRoZSBjaG9ydXMgb2YgU3RhaXJ3YXkgdG8gSGVhdmVuJyxcbiAgICAgICAgICAgICAgICBkdWVEYXRlOiAnMDUvMTgvMjEnLFxuICAgICAgICAgICAgICAgIHByaW9yaXR5OiAnbG93J1xuICAgICAgICAgICAgfVxuICAgICAgICBdXG4gICAgfVxuXTtcblxuLy8gSW5pdGlhbGl6ZSB2aWV3Q29udHJvbGxlciwgZXZlbnRzLCBhbmQgc3RvcmFnZSBtb2R1bGVzXG52aWV3Q29udHJvbGxlci5pbml0KCk7XG5ldmVudHMuaW5pdCgpO1xuc3RvcmFnZS5pbml0KCk7XG5cbi8vIEluaXRpYWxpemUgYXBwbGljYXRpb25cbmFwcC5pbml0KHByb2plY3RzKTsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=