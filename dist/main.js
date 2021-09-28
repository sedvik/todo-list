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
        console.log(activeProjectName);

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
        const activeProjectName = data.activeProject.name;
        console.log(activeProjectName);

        // Generate project-title html
        const projectTitleContent = (0,_views_title_js__WEBPACK_IMPORTED_MODULE_1__.createProjectTitleContent)(activeProjectName);
        projectTitleDiv.appendChild(projectTitleContent);
        
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QzVCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFFBQVEsbURBQWM7QUFDdEI7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUSx3REFBZ0I7O0FBRXhCO0FBQ0EsUUFBUSx3REFBZ0I7O0FBRXhCO0FBQ0EsUUFBUSx3REFBZ0I7O0FBRXhCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7OztBQzVNRDtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLHdCQUF3QixtQ0FBbUM7QUFDM0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN2QnFDOztBQUVyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtB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V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7OztBQ042RDtBQUNoQjtBQUNFO0FBQ1I7O0FBRXZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDJFQUFtQjtBQUNuQiwyREFBVztBQUNYLDZEQUFZOztBQUVaO0FBQ0EscURBQVEsVyIsInNvdXJjZXMiOlsid2VicGFjazovL3RvZG8tbGlzdC8uL3NyYy9mYWN0b3J5X2Z1bmN0aW9ucy9wcm9qZWN0LmpzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL3NyYy9mYWN0b3J5X2Z1bmN0aW9ucy90b2RvLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL3NyYy9tb2R1bGVzL2FwcC5qcyIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9zcmMvbW9kdWxlcy9ldmVudHMuanMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vc3JjL21vZHVsZXMvcHViU3ViLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL3NyYy9tb2R1bGVzL3N0b3JhZ2UuanMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vc3JjL21vZHVsZXMvdmlld0NvbnRyb2xsZXIuanMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vc3JjL3ZpZXdzL25ld1RvZG9TZWN0aW9uLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL3NyYy92aWV3cy9zaWRlYmFyLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL3NyYy92aWV3cy90aXRsZS5qcyIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9zcmMvdmlld3MvdG9kb0l0ZW1zLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL3NyYy92aWV3cy91dGlsLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly90b2RvLWxpc3Qvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3RvZG8tbGlzdC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3RvZG8tbGlzdC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3RvZG8tbGlzdC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBwcm9qZWN0IHByb3RvdHlwZVxuY29uc3QgcHJvamVjdFByb3RvID0ge1xuICAgIGZpbmRJbmRleEJ5VGl0bGU6IGZ1bmN0aW9uKHRvZG9UaXRsZSkge1xuICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMudG9kb3MuZmluZEluZGV4KHRvZG8gPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHRvZG8udGl0bGUgPT09IHRvZG9UaXRsZTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBpbmRleDtcbiAgICB9LFxuICAgIGFkZFRvZG86IGZ1bmN0aW9uKG5ld1RvZG8pIHtcbiAgICAgICAgdGhpcy50b2Rvcy5wdXNoKG5ld1RvZG8pO1xuICAgIH0sXG4gICAgZGVsZXRlVG9kbzogZnVuY3Rpb24odG9kb1RpdGxlKSB7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5maW5kSW5kZXhCeVRpdGxlKHRvZG9UaXRsZSk7XG4gICAgICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICAgIHRoaXMudG9kb3Muc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgZGVsZXRlQWN0aXZlVG9kbzogZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5maW5kSW5kZXhCeVRpdGxlKHRoaXMuYWN0aXZlVG9kby50aXRsZSk7XG4gICAgICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlVG9kbyA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLnRvZG9zLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHNldEFjdGl2ZVRvZG86IGZ1bmN0aW9uKHRvZG9UaXRsZSkge1xuICAgICAgICAvLyBJZiBzZXRBY3RpdmVUb2RvIGlzIGNhbGxlZCB3aXRoIG5vIGFyZ3VtZW50cywgc2V0IGFjdGl2ZVRvZG8gdG8gbnVsbFxuICAgICAgICBpZiAodG9kb1RpdGxlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlVG9kbyA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMuZmluZEluZGV4QnlUaXRsZSh0b2RvVGl0bGUpO1xuICAgICAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICAgICAgICB0aGlzLmFjdGl2ZVRvZG8gPSB0aGlzLnRvZG9zW2luZGV4XTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbi8vIHByb2plY3QgZmFjdG9yeSBmdW5jdGlvblxuZnVuY3Rpb24gcHJvamVjdChuYW1lKSB7XG4gICAgY29uc3QgdG9kb3MgPSBbXTtcbiAgICBsZXQgYWN0aXZlVG9kbyA9IG51bGw7XG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShwcm9qZWN0UHJvdG8pLCB7XG4gICAgICAgIG5hbWUsXG4gICAgICAgIGFjdGl2ZVRvZG8sXG4gICAgICAgIHRvZG9zXG4gICAgfSk7XG59XG5cbmV4cG9ydCB7IHByb2plY3QgfTsiLCIvLyB0b2RvIHByb3RvdHlwZVxuY29uc3QgdG9kb1Byb3RvID0ge1xuICAgIGNoYW5nZVRpdGxlOiBmdW5jdGlvbihuZXdUaXRsZSkge1xuICAgICAgICB0aGlzLnRpdGxlID0gbmV3VGl0bGU7XG4gICAgfSxcbiAgICBjaGFuZ2VEZXNjcmlwdGlvbjogZnVuY3Rpb24obmV3RGVzY3JpcHRpb24pIHtcbiAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiA9IG5ld0Rlc2NyaXB0aW9uO1xuICAgIH0sICAgIFxuICAgIGNoYW5nZUR1ZURhdGU6IGZ1bmN0aW9uKG5ld0R1ZURhdGUpIHtcbiAgICAgICAgdGhpcy5kdWVEYXRlID0gbmV3RHVlRGF0ZTtcbiAgICB9LFxuICAgIGNoYW5nZVByaW9yaXR5OiBmdW5jdGlvbihuZXdQcmlvcml0eSkge1xuICAgICAgICB0aGlzLnByaW9yaXR5ID0gbmV3UHJpb3JpdHk7XG4gICAgfSxcbiAgICB0b2dnbGVDb21wbGV0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiAhdGhpcy5jb21wbGV0ZTtcbiAgICB9LFxuICAgIHVwZGF0ZTogZnVuY3Rpb24obmV3VGl0bGUsIG5ld0Rlc2NyaXB0aW9uLCBuZXdEdWVEYXRlLCBuZXdQcmlvcml0eSkge1xuICAgICAgICB0aGlzLmNoYW5nZVRpdGxlKG5ld1RpdGxlKTtcbiAgICAgICAgdGhpcy5jaGFuZ2VEZXNjcmlwdGlvbihuZXdEZXNjcmlwdGlvbik7XG4gICAgICAgIHRoaXMuY2hhbmdlRHVlRGF0ZShuZXdEdWVEYXRlKTtcbiAgICAgICAgdGhpcy5jaGFuZ2VQcmlvcml0eShuZXdQcmlvcml0eSk7XG4gICAgfVxufTtcblxuLy8gdG9kbyBmYWN0b3J5IGZ1bmN0aW9uXG5mdW5jdGlvbiB0b2RvKHRpdGxlLCBkZXNjcmlwdGlvbiwgZHVlRGF0ZSwgcHJpb3JpdHkpIHtcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKHRvZG9Qcm90byksIHtcbiAgICAgICAgdGl0bGUsXG4gICAgICAgIGRlc2NyaXB0aW9uLFxuICAgICAgICBkdWVEYXRlLFxuICAgICAgICBwcmlvcml0eSxcbiAgICAgICAgY29tcGxldGU6IGZhbHNlXG4gICAgfSk7XG59XG5cbmV4cG9ydCB7IHRvZG8gfTsiLCJpbXBvcnQgeyB0b2RvIH0gZnJvbSAnLi4vZmFjdG9yeV9mdW5jdGlvbnMvdG9kby5qcyc7XG5pbXBvcnQgeyBwcm9qZWN0IH0gZnJvbSAnLi4vZmFjdG9yeV9mdW5jdGlvbnMvcHJvamVjdC5qcyc7XG5pbXBvcnQgeyBwdWJTdWIgfSBmcm9tICcuL3B1YlN1Yi5qcyc7XG5cbi8vIGFwcCBtb2R1bGUgY29udGFpbnMgdG9kbyBsaXN0IGFwcGxpY2F0aW9uIGRhdGEgYW5kIGZ1bmN0aW9uYWxpdHlcbmNvbnN0IGFwcCA9IChmdW5jdGlvbigpIHtcbiAgICBsZXQgX3Byb2plY3RzID0gW107XG4gICAgbGV0IF9hY3RpdmVQcm9qZWN0O1xuXG4gICAgLy8gX2dldFN0YXRlRGF0YSBmdW5jdGlvbiAtIGJ1bmRsZXMgYXBwIHN0YXRlIGRhdGEgKF9wcm9qZWN0cyBhbmQgX2FjdGl2ZVByb2plY3QpIGZvciBwdWJsaXNoaW5nIHRocm91Z2ggcHViU3ViXG4gICAgZnVuY3Rpb24gX2dldFN0YXRlRGF0YSgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHByb2plY3RzOiBfcHJvamVjdHMsXG4gICAgICAgICAgICBhY3RpdmVQcm9qZWN0OiBfYWN0aXZlUHJvamVjdCxcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBfZ2V0UHJvamVjdEZyb21OYW1lIGZ1bmN0aW9uIC0gb2J0YWlucyB0aGUgcHJvamVjdCBvYmplY3Qgd2l0aCBhIG1hdGNoaW5nIHByb2plY3QgbmFtZVxuICAgIGZ1bmN0aW9uIF9nZXRQcm9qZWN0RnJvbU5hbWUocHJvamVjdE5hbWUpIHtcbiAgICAgICAgY29uc3QgcHJvamVjdCA9IF9wcm9qZWN0cy5maW5kKHByb2plY3QgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHByb2plY3QubmFtZSA9PT0gcHJvamVjdE5hbWU7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcHJvamVjdDtcbiAgICB9XG5cbiAgICAvLyBfZ2V0UHJvamVjdEluZGV4RnJvbU5hbWUgLSBvYnRhaW5zIHRoZSBpbmRleCBvZiB0aGUgcHJvamVjdCB3aXRoIHRoZSBzcGVjaWZpZWQgbmFtZSB3aXRoaW4gdGhlIF9wcm9qZWN0cyBhcnJheVxuICAgIGZ1bmN0aW9uIF9nZXRQcm9qZWN0SW5kZXhGcm9tTmFtZShwcm9qZWN0TmFtZSkge1xuICAgICAgICBjb25zdCBpbmRleCA9IF9wcm9qZWN0cy5maW5kSW5kZXgocHJvamVjdCA9PiB7XG4gICAgICAgICAgICByZXR1cm4gcHJvamVjdC5uYW1lID09PSBwcm9qZWN0TmFtZTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBpbmRleDtcbiAgICB9XG5cbiAgICAvLyBnZXRQcm9qZWN0cyBmdW5jdGlvbnMgLSByZXR1cm5zIGFuIGFycmF5IG9mIGFwcCBwcm9qZWN0c1xuICAgIGZ1bmN0aW9uIGdldFByb2plY3RzKCkge1xuICAgICAgICByZXR1cm4gX3Byb2plY3RzO1xuICAgIH1cblxuICAgIC8vIGdldEFjdGl2ZVByb2plY3QgZnVuY3Rpb24gLSByZXR1cm5zIHRoZSBjdXJyZW50IGFjdGl2ZSBwcm9qZWN0XG4gICAgZnVuY3Rpb24gZ2V0QWN0aXZlUHJvamVjdCgpIHtcbiAgICAgICAgcmV0dXJuIF9hY3RpdmVQcm9qZWN0O1xuICAgIH1cblxuICAgIC8vIGNoYW5nZUFjdGl2ZVByb2plY3QgZnVuY3Rpb24gLSBjaGFuZ2VzIHRoZSBhY3RpdmUgYXBwbGljYXRpb24gcHJvamVjdFxuICAgIGZ1bmN0aW9uIGNoYW5nZUFjdGl2ZVByb2plY3QocHJvamVjdE5hbWUpIHtcbiAgICAgICAgY29uc3QgcHJvamVjdCA9IF9nZXRQcm9qZWN0RnJvbU5hbWUocHJvamVjdE5hbWUpO1xuICAgICAgICBfYWN0aXZlUHJvamVjdCA9IHByb2plY3Q7XG4gICAgICAgIHB1YlN1Yi5wdWJsaXNoKCdhY3RpdmVQcm9qZWN0Q2hhbmdlJywgX2dldFN0YXRlRGF0YSgpKTtcbiAgICB9XG5cbiAgICAvLyBhZGRQcm9qZWN0IGZ1bmN0aW9uIC0gYWRkcyBhIG5ldyBwcm9qZWN0IHRvIHRoZSBfcHJvamVjdHMgYXJyYXlcbiAgICBmdW5jdGlvbiBhZGRQcm9qZWN0KHByb2plY3ROYW1lKSB7XG4gICAgICAgIGNvbnN0IG5ld1Byb2plY3QgPSBwcm9qZWN0KHByb2plY3ROYW1lKTtcbiAgICAgICAgX3Byb2plY3RzLnB1c2gobmV3UHJvamVjdCk7XG4gICAgICAgIHB1YlN1Yi5wdWJsaXNoKCdwcm9qZWN0c0NoYW5nZScsIF9nZXRTdGF0ZURhdGEoKSk7XG4gICAgfVxuXG4gICAgLy8gZGVsZXRlUHJvamVjdCBmdW5jdGlvbiAtIGRlbGV0ZXMgdGhlIHByb2plY3Qgd2l0aCB0aGUgc3BlY2lmaWVkIG5hbWUgZnJvbSBfcHJvamVjdHMgYXJyYXlcbiAgICBmdW5jdGlvbiBkZWxldGVQcm9qZWN0KHByb2plY3ROYW1lKSB7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gX2dldFByb2plY3RJbmRleEZyb21OYW1lKHByb2plY3ROYW1lKTtcblxuICAgICAgICAvLyBJTVBMRU1FTlQgTE9HSUMgVEhBVCBIQU5ETEVTIFdIRU4gVEhFIERFTEVURUQgUFJPSkVDVCBJUyBUSEUgQUNUSVZFIFBST0pFQ1RcbiAgICAgICAgX3Byb2plY3RzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIHB1YlN1Yi5wdWJsaXNoKCdwcm9qZWN0c0NoYW5nZScsIF9nZXRTdGF0ZURhdGEoKSk7XG4gICAgfVxuXG4gICAgLy8gYWRkVG9kbyBmdW5jdGlvbiAtIGFkZHMgYSB0b2RvIGl0ZW0gdG8gdGhlIGFjdGl2ZVByb2plY3RcbiAgICBmdW5jdGlvbiBhZGRUb2RvKHRpdGxlLCBkZXNjcmlwdGlvbiwgZHVlRGF0ZSwgcHJpb3JpdHkpIHtcbiAgICAgICAgLy8gQ3JlYXRlIHRvZG8gaXRlbVxuICAgICAgICBjb25zdCB0b2RvSXRlbSA9IHRvZG8odGl0bGUsIGRlc2NyaXB0aW9uLCBkdWVEYXRlLCBwcmlvcml0eSk7XG5cbiAgICAgICAgLy8gQXBwZW5kIHRvZG8gaXRlbSB0byBhY3RpdmVQcm9qZWN0IHRvZG9zIGFycmF5XG4gICAgICAgIF9hY3RpdmVQcm9qZWN0LmFkZFRvZG8odG9kb0l0ZW0pO1xuXG4gICAgICAgIHB1YlN1Yi5wdWJsaXNoKCd0b2Rvc0NoYW5nZScsIF9nZXRTdGF0ZURhdGEoKSk7XG4gICAgfVxuXG4gICAgLy8gY2hhbmdlVG9kbyBmdW5jdGlvbiAtIG1vZGlmaWVzIGFjdGl2ZSB0b2RvIGl0ZW0gb2YgYWN0aXZlcHJvamVjdCB0byBzcGVjaWZpZWQgcGFyYW1ldGVyc1xuICAgIGZ1bmN0aW9uIGNoYW5nZVRvZG8obmV3VGl0bGUsIG5ld0Rlc2NyaXB0aW9uLCBuZXdEdWVEYXRlLCBuZXdQcmlvcml0eSkge1xuICAgICAgICBjb25zdCBhY3RpdmVUb2RvID0gX2FjdGl2ZVByb2plY3QuYWN0aXZlVG9kbztcbiAgICAgICAgY29uc29sZS5sb2coYWN0aXZlVG9kbyk7XG4gICAgICAgIGFjdGl2ZVRvZG8udXBkYXRlKG5ld1RpdGxlLCBuZXdEZXNjcmlwdGlvbiwgbmV3RHVlRGF0ZSwgbmV3UHJpb3JpdHkpOyAvLyBDSEVDSyBUSEFUIFRISVMgSVMgV09SS0lORyBJTiBUSEUgRklOQUwgQVBQIFZFUlNJT04sIENVUlJFTlRMWSBUSEUgQUNUSVZFVE9ETyBJUyBTRVQgVE8gTlVMTCBTSU5DRSBGT1JNIFdBU04nVCBDTElDS0VEIEJFRk9SRUhBTkRcbiAgICAgICAgcHViU3ViLnB1Ymxpc2goJ3RvZG9zQ2hhbmdlJywgX2dldFN0YXRlRGF0YSgpKTtcbiAgICB9XG5cbiAgICAvLyBjaGFuZ2VBY3RpdmVUb2RvIGZ1bmN0aW9uIC0gY2hhbmdlcyB0aGUgYWN0aXZlIHRvZG8gaXRlbSBmb3IgdGhlIGN1cnJlbnQgcHJvamVjdFxuICAgIGZ1bmN0aW9uIGNoYW5nZUFjdGl2ZVRvZG8odG9kb1RpdGxlKSB7XG4gICAgICAgIGNvbnN0IGFjdGl2ZVRvZG8gPSBfYWN0aXZlUHJvamVjdC5hY3RpdmVUb2RvO1xuICAgICAgICBhY3RpdmVUb2RvLnNldEFjdGl2ZVRvZG8odG9kb1RpdGxlKTtcbiAgICAgICAgcHViU3ViLnB1Ymxpc2goJ3RvZG9zQ2hhbmdlJywgX2dldFN0YXRlRGF0YSgpKTtcbiAgICB9XG5cbiAgICAvLyBkZWxldGVUb2RvIGZ1bmN0aW9uIC0gZGVsZXRlcyB0aGUgYWN0aXZlIHRvZG8gaXRlbSBmcm9tIHRoZSBhY3RpdmVQcm9qZWN0XG4gICAgZnVuY3Rpb24gZGVsZXRlQWN0aXZlVG9kbygpIHtcbiAgICAgICAgX2FjdGl2ZVByb2plY3QuZGVsZXRlQWN0aXZlVG9kbygpO1xuICAgICAgICBwdWJTdWIucHVibGlzaCgndG9kb3NDaGFuZ2UnLCBfZ2V0U3RhdGVEYXRhKCkpO1xuICAgIH1cblxuICAgIC8vIHRvZ2dsZVRvZG9Db21wbGV0ZSBmdW5jdGlvbiAtIHRvZ2dsZXMgdGhlIGFjdGl2ZSB0b2RvIGl0ZW1zIGNvbXBsZXRlIHN0YXR1c1xuICAgIGZ1bmN0aW9uIHRvZ2dsZVRvZG9Db21wbGV0ZSgpIHtcbiAgICAgICAgX2FjdGl2ZVByb2plY3QuYWN0aXZlVG9kby50b2dnbGVDb21wbGV0ZSgpO1xuICAgICAgICBwdWJTdWIucHVibGlzaCgndG9kb3NDaGFuZ2UnLCBfZ2V0U3RhdGVEYXRhKCkpO1xuICAgIH1cblxuICAgIC8vIGluaXQgZnVuY3Rpb24gLSBpbml0aWFsaXplcyB0aGUgYXBwbGljYXRpb24gd2l0aCB0aGUgZ2l2ZW4gcHJvamVjdHMgYXJyYXkgZnJvbSBsb2NhbFN0b3JhZ2VcbiAgICBmdW5jdGlvbiBpbml0KHByb2plY3RzKSB7XG4gICAgICAgIC8vIENvbnZlcnQgbG9jYWxTdG9yYWdlIHByb2plY3RzIGFycmF5IHRvIG9iamVjdHMgd2l0aCBwcm90b3R5cGUgbWV0aG9kcyB1c2luZyBmYWN0b3J5IGZ1bmN0aW9uc1xuICAgICAgICBwcm9qZWN0cy5mb3JFYWNoKHByb2plY3RPYmogPT4ge1xuICAgICAgICAgICAgLy8gQ3JlYXRlIGEgbmV3IHByb2plY3RcbiAgICAgICAgICAgIGNvbnN0IG5ld1Byb2plY3QgPSBwcm9qZWN0KHByb2plY3RPYmoubmFtZSk7XG5cbiAgICAgICAgICAgIC8vIEFkZCBlYWNoIHRvZG8gdG8gdGhlIGNvcnJlc3BvbmRpbmcgcHJvamVjdFxuICAgICAgICAgICAgcHJvamVjdE9iai50b2Rvcy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRvZG9JdGVtID0gdG9kbyhpdGVtLnRpdGxlLCBpdGVtLmRlc2NyaXB0aW9uLCBpdGVtLmR1ZURhdGUsIGl0ZW0ucHJpb3JpdHkpO1xuICAgICAgICAgICAgICAgIG5ld1Byb2plY3QuYWRkVG9kbyh0b2RvSXRlbSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gQWRkIHByb2plY3QgdG8gX3Byb2plY3RzIGFycmF5XG4gICAgICAgICAgICBfcHJvamVjdHMucHVzaChuZXdQcm9qZWN0KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gU2V0IHRoZSBhY3RpdmUgcHJvamVjdCB0byB0aGUgZmlyc3QgaXRlbSBpbiB0aGUgYXJyYXlcbiAgICAgICAgX2FjdGl2ZVByb2plY3QgPSBfcHJvamVjdHNbMF07XG5cbiAgICAgICAgLy8gUHVibGlzaCAnaW5pdGlhbGl6ZScgZXZlbnRcbiAgICAgICAgcHViU3ViLnB1Ymxpc2goJ2FwcEluaXQnLCBfZ2V0U3RhdGVEYXRhKCkpO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIGdldFByb2plY3RzLFxuICAgICAgICBnZXRBY3RpdmVQcm9qZWN0LFxuICAgICAgICBjaGFuZ2VBY3RpdmVQcm9qZWN0LFxuICAgICAgICBhZGRQcm9qZWN0LFxuICAgICAgICBkZWxldGVQcm9qZWN0LFxuICAgICAgICBhZGRUb2RvLFxuICAgICAgICBjaGFuZ2VUb2RvLFxuICAgICAgICBjaGFuZ2VBY3RpdmVUb2RvLFxuICAgICAgICBkZWxldGVBY3RpdmVUb2RvLFxuICAgICAgICB0b2dnbGVUb2RvQ29tcGxldGUsXG4gICAgICAgIGluaXRcbiAgICB9O1xufSkoKTtcblxuZXhwb3J0IHsgYXBwIH07IiwiaW1wb3J0IHsgcHViU3ViIH0gZnJvbSAnLi9wdWJTdWIuanMnO1xuaW1wb3J0IHsgYXBwIH0gZnJvbSAnLi9hcHAuanMnO1xuaW1wb3J0IHsgdmlld0NvbnRyb2xsZXIgfSBmcm9tICcuL3ZpZXdDb250cm9sbGVyLmpzJztcblxuLy8gRXZlbnRzIG1vZHVsZSAtIGNvb3JkaW5hdGVzIGV2ZW50IGFkZGl0aW9uL21vZGlmaWNhdGlvbiB0byBkb20gbm9kZXNcbmNvbnN0IGV2ZW50cyA9IChmdW5jdGlvbigpIHtcbiAgICAvKiBFdmVudCBoYW5kbGVyIGZ1bmN0aW9ucyAqL1xuICAgIC8vIF9jcmVhdGVOZXdQcm9qZWN0IGZ1bmN0aW9uIC0gQ3JlYXRlcyBhIG5ldyBwcm9qZWN0XG4gICAgZnVuY3Rpb24gX2NyZWF0ZU5ld1Byb2plY3QoKSB7XG4gICAgICAgIC8vIEV4dHJhY3QgbmV3IHByb2plY3QgbmFtZVxuICAgICAgICBjb25zdCBwcm9qZWN0TmFtZUlucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2FkZC1wcm9qZWN0IGlucHV0Jyk7XG4gICAgICAgIGNvbnN0IHByb2plY3ROYW1lID0gcHJvamVjdE5hbWVJbnB1dC52YWx1ZTtcblxuICAgICAgICAvLyBBZGQgcHJvamVjdCB0byBhcHAgbW9kZWxcbiAgICAgICAgaWYgKHByb2plY3ROYW1lKSB7XG4gICAgICAgICAgICBhcHAuYWRkUHJvamVjdChwcm9qZWN0TmFtZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDbGVhciBwcm9qZWN0IG5hbWUgZmllbGRcbiAgICAgICAgcHJvamVjdE5hbWVJbnB1dC52YWx1ZSA9ICcnO1xuICAgIH1cblxuICAgIC8vIF9zZWxlY3RQcm9qZWN0IGZ1bmN0aW9uIC0gU2V0cyB0aGUgYWN0aXZlIHByb2plY3RcbiAgICBmdW5jdGlvbiBfc2VsZWN0UHJvamVjdChlKSB7XG4gICAgICAgIGNvbnN0IHByb2plY3ROYW1lID0gZS50YXJnZXQucGFyZW50Tm9kZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtbmFtZScpO1xuICAgICAgICBhcHAuY2hhbmdlQWN0aXZlUHJvamVjdChwcm9qZWN0TmFtZSk7XG4gICAgfVxuXG4gICAgLy8gX2RlbGV0ZVByb2plY3QgZnVuY3Rpb24gLSBEZWxldGVzIHRoZSBzZWxlY3RlZCBwcm9qZWN0XG4gICAgZnVuY3Rpb24gX2RlbGV0ZVByb2plY3QoZSkge1xuICAgICAgICBjb25zdCBwcm9qZWN0TmFtZSA9IGUudGFyZ2V0LnBhcmVudE5vZGUuZ2V0QXR0cmlidXRlKCdkYXRhLW5hbWUnKTtcbiAgICAgICAgYXBwLmRlbGV0ZVByb2plY3QocHJvamVjdE5hbWUpO1xuICAgIH1cblxuICAgIC8vIF9zaG93TmV3VG9kb0Zvcm0gZnVuY3Rpb24gLSBTaG93cyB0aGUgbmV3IHRvZG8gZm9ybSBhbmQgaGlkZXMgdGhlIFwiQWRkIFRvZG9cIiBidXR0b25cbiAgICBmdW5jdGlvbiBfc2hvd05ld1RvZG9Gb3JtKCkge1xuICAgICAgICBwdWJTdWIucHVibGlzaCgnYWN0aXZhdGVOZXdUb2RvRm9ybScpO1xuICAgIH1cblxuICAgIC8vIF9leGl0TmV3VG9kb0Zvcm0gZnVuY3Rpb24gLSBIaWRlcyB0aGUgbmV3IHRvZG8gZm9ybSBhbmQgZGlzcGxheXMgdGhlIFwiQWRkIFRvZG9cIiBidXR0b25cbiAgICBmdW5jdGlvbiBfZXhpdE5ld1RvZG9Gb3JtKCkge1xuICAgICAgICBwdWJTdWIucHVibGlzaCgnZGlzYWJsZU5ld1RvZG9Gb3JtJyk7XG4gICAgfVxuXG4gICAgLy8gX2FkZE5ld1RvZG8gZnVuY3Rpb24gLSBFeHRyYWN0cyBmb3JtIHZhbHVlcyBhbmQgYWRkcyBhIG5ldyB0b2RvIHRvIHRoZSBhY3RpdmUgcHJvamVjdFxuICAgIGZ1bmN0aW9uIF9hZGROZXdUb2RvKCkge1xuICAgICAgICAvLyBFeHRyYWN0IGZvcm0gdmFsdWVzXG4gICAgICAgIGNvbnN0IHRpdGxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI25ldy10aXRsZScpLnZhbHVlO1xuICAgICAgICBjb25zdCBkZXNjcmlwdGlvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNuZXctZGVzY3JpcHRpb24nKS52YWx1ZTtcbiAgICAgICAgY29uc3QgZHVlRGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNuZXctZGF0ZScpLnZhbHVlO1xuICAgICAgICBjb25zdCBwcmlvcml0eSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W25hbWU9XCJuZXctcHJpb3JpdHlcIl06Y2hlY2tlZCcpLnZhbHVlO1xuXG4gICAgICAgIGFwcC5hZGRUb2RvKHRpdGxlLCBkZXNjcmlwdGlvbiwgZHVlRGF0ZSwgcHJpb3JpdHkpOyBcbiAgICB9XG5cbiAgICAvLyBfc2V0QWN0aXZlVG9kbyBmdW5jdGlvbiAtIFNldHMgYW4gaW5hY3RpdmUgdG9kbyB0byBhY3RpdmVcbiAgICBmdW5jdGlvbiBfc2V0QWN0aXZlVG9kbyhlKSB7XG4gICAgICAgIGNvbnN0IHRvZG9UaXRsZSA9IGUudGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS10aXRsZScpO1xuICAgICAgICBhcHAuY2hhbmdlQWN0aXZlVG9kbyh0b2RvVGl0bGUpO1xuICAgIH1cblxuICAgIC8vIF90b2dnbGVUb2RvQ29tcGxldGUgZnVuY3Rpb24gLSBUb2dnbGVzIHRoZSBhY3RpdmUgdG9kbydzIGNvbXBsZXRpb24gc3RhdHVzXG4gICAgZnVuY3Rpb24gX3RvZ2dsZVRvZG9Db21wbGV0ZSgpIHtcbiAgICAgICAgYXBwLnRvZ2dsZVRvZG9Db21wbGV0ZSgpO1xuICAgIH1cblxuICAgIC8vIF9kZWxldGVBY3RpdmVUb2RvIGZ1bmN0aW9uIC0gRGVsZXRlcyB0aGUgYWN0aXZlIHRvZG9cbiAgICBmdW5jdGlvbiBfZGVsZXRlQWN0aXZlVG9kbygpIHtcbiAgICAgICAgYXBwLmRlbGV0ZUFjdGl2ZVRvZG8oKTtcbiAgICB9XG5cbiAgICAvLyBfdXBkYXRlQWN0aXZlVG9kbyBmdW5jdGlvbiAtIFVwZGF0ZXMgdGhlIGFjdGl2ZSB0b2RvIGZ1bmN0aW9uIHdpdGggdXBkYXRlZCBmb3JtIHZhbHVlc1xuICAgIGZ1bmN0aW9uIF91cGRhdGVBY3RpdmVUb2RvKCkge1xuICAgICAgICAvLyBFeHRyYWN0IGZvcm0gdmFsdWVzXG4gICAgICAgIGNvbnN0IG5ld1RpdGxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3VwZGF0ZS10aXRsZScpLnZhbHVlO1xuICAgICAgICBjb25zdCBuZXdEZXNjcmlwdGlvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN1cGRhdGUtZGVzY3JpcHRpb24nKS52YWx1ZTtcbiAgICAgICAgY29uc3QgbmV3RHVlRGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN1cGRhdGUtZGF0ZScpLnZhbHVlO1xuICAgICAgICBjb25zdCBuZXdQcmlvcml0eSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W25hbWU9XCJ1cGRhdGUtcHJpb3JpdHlcIl06Y2hlY2tlZCcpLnZhbHVlO1xuXG4gICAgICAgIGFwcC5jaGFuZ2VUb2RvKG5ld1RpdGxlLCBuZXdEZXNjcmlwdGlvbiwgbmV3RHVlRGF0ZSwgbmV3UHJpb3JpdHkpO1xuICAgIH1cblxuICAgIC8qIEV2ZW50IFNldHRpbmcgZnVuY3Rpb25zIC0gVGhlc2UgZnVuY3Rpb25zIGFwcGx5IGV2ZW50IGhhbmRsZXJzIHRvIERPTSBlbGVtZW50cyAqL1xuXG4gICAgLy8gX2Fzc2lnbk5ld1Byb2plY3RFdmVudCBmdW5jdGlvbiAtIEFkZHMgZXZlbnQgaGFuZGxlciB0byB0aGUgc2lkZWJhciBOZXcgUHJvamVjdCBidXR0b25cbiAgICBmdW5jdGlvbiBfYXNzaWduTmV3UHJvamVjdEV2ZW50KCkge1xuICAgICAgICBjb25zdCBuZXdQcm9qZWN0QnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2FkZC1wcm9qZWN0LWJ0bicpO1xuICAgICAgICBuZXdQcm9qZWN0QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgX2NyZWF0ZU5ld1Byb2plY3QpO1xuICAgIH1cblxuICAgIC8vIF9hc3NpZ25Qcm9qZWN0RXZlbnRzIGZ1bmN0aW9uIC0gQWRkcyBldmVudCBoYW5kbGVycyB0byBwcm9qZWN0IGl0ZW1zIGluIHRoZSBzaWRlYmFyXG4gICAgZnVuY3Rpb24gX2Fzc2lnblByb2plY3RFdmVudHMoKSB7XG4gICAgICAgIGNvbnN0IHByb2plY3RJdGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5wcm9qZWN0LW5hbWUnKTtcbiAgICAgICAgcHJvamVjdEl0ZW1zLmZvckVhY2gocHJvamVjdCA9PiB7XG4gICAgICAgICAgICBwcm9qZWN0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgX3NlbGVjdFByb2plY3QpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBfYXNzaWduRGVsUHJvamVjdEV2ZW50cyBmdW5jdGlvbiAtIEFkZHMgZXZlbnQgaGFuZGxlcnMgdG8gcHJvamVjdCBkZWxldGUgYnV0dG9uc1xuICAgIGZ1bmN0aW9uIF9hc3NpZ25EZWxQcm9qZWN0RXZlbnRzKCkge1xuICAgICAgICBjb25zdCBwcm9qZWN0RGVsQnV0dG9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5kZWwtcHJvamVjdCcpO1xuICAgICAgICBwcm9qZWN0RGVsQnV0dG9ucy5mb3JFYWNoKGJ1dHRvbiA9PiB7XG4gICAgICAgICAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBfZGVsZXRlUHJvamVjdCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIF9hc3NpZ25BZGRUb2RvRXZlbnQgZnVuY3Rpb24gLSBBZGQgZXZlbnQgaGFuZGxlciB0byBBZGQgVG9kbyBidXR0b25cbiAgICBmdW5jdGlvbiBfYXNzaWduQWRkVG9kb0V2ZW50KCkge1xuICAgICAgICBjb25zdCBhZGRUb2RvQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2FkZC10b2RvLWJ0bicpO1xuICAgICAgICBhZGRUb2RvQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgX3Nob3dOZXdUb2RvRm9ybSk7XG4gICAgfVxuXG4gICAgLy8gX2Fzc2lnbkNsb3NlVG9kb0V2ZW50IGZ1bmN0aW9uIC0gQWRkIGV2ZW50IGhhbmRsZXIgdG8gYnV0dG9uIHRoYXQgY2xvc2VzIHRoZSBuZXcgdG9kbyBmb3JtXG4gICAgZnVuY3Rpb24gX2Fzc2lnbkNsb3NlVG9kb0V2ZW50KCkge1xuICAgICAgICBjb25zdCBjbG9zZU5ld1RvZG9CdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjY2xvc2UtbmV3LXRvZG8tZm9ybScpO1xuICAgICAgICBjbG9zZU5ld1RvZG9CdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBfZXhpdE5ld1RvZG9Gb3JtKTtcbiAgICB9XG5cbiAgICAvLyBfYXNzaWduU3VibWl0VG9kb0V2ZW50IGZ1bmN0aW9uIC0gQWRkIGV2ZW50IGhhbmRsZXIgdG8gXCJBZGRcIiBidXR0b24gd2hpY2ggc3VibWl0cyBjb250ZW50IGZyb20gdGhlIG5ldyB0b2RvIGZvcm1cbiAgICBmdW5jdGlvbiBfYXNzaWduU3VibWl0VG9kb0V2ZW50KCkge1xuICAgICAgICBjb25zdCBzdWJtaXRUb2RvQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3N1Ym1pdC10b2RvLWJ0bicpO1xuICAgICAgICBzdWJtaXRUb2RvQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgX2FkZE5ld1RvZG8pO1xuICAgIH1cblxuICAgIC8vIF9hc3NpZ25TZXRBY3RpdmVFdmVudHMgZnVuY3Rpb24gLSBBZGRzIGV2ZW50IGhhbmRsZXJzIHRvIGluYWN0aXZlIHRvZG8gaXRlbXMgb24gdGhlIHBhZ2VcbiAgICBmdW5jdGlvbiBfYXNzaWduU2V0QWN0aXZlRXZlbnRzKCkge1xuICAgICAgICBjb25zdCBpbmFjdGl2ZVRvZG9zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmluYWN0aXZlLXRvZG8nKTtcbiAgICAgICAgaW5hY3RpdmVUb2Rvcy5mb3JFYWNoKHRvZG8gPT4ge1xuICAgICAgICAgICAgdG9kby5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIF9zZXRBY3RpdmVUb2RvKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gX2Fzc2lnblRvZ2dsZVRvZG9Db21wbGV0ZUV2ZW50IGZ1bmN0aW9uIC0gQWRkcyBldmVudCBoYW5kbGVyIHRvIGJ1dHRvbiBmb3IgdG9nZ2xpbmcgdG9kbyBjb21wbGV0aW9uXG4gICAgZnVuY3Rpb24gX2Fzc2lnblRvZ2dsZVRvZG9Db21wbGV0ZUV2ZW50KCkge1xuICAgICAgICBjb25zdCB0b2dnbGVDb21wbGV0ZUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN0b2dnbGUtY29tcGxldGUnKTtcbiAgICAgICAgdG9nZ2xlQ29tcGxldGVCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBfdG9nZ2xlVG9kb0NvbXBsZXRlKTtcbiAgICB9XG5cbiAgICAvLyBfYXNzaWduRGVsZXRlQWN0aXZlVG9kb0V2ZW50IGZ1bmN0aW9uIC0gQWRkcyBldmVudCBoYW5kbGVyIHRvIGJ1dHRvbiB0aGF0IGRlbGV0ZXMgdGhlIGFjdGl2ZSB0b2RvXG4gICAgZnVuY3Rpb24gX2Fzc2lnbkRlbGV0ZUFjdGl2ZVRvZG9FdmVudCgpIHtcbiAgICAgICAgY29uc3QgZGVsVG9kb0J0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNkZWwtYWN0aXZlLXRvZG8nKTtcbiAgICAgICAgZGVsVG9kb0J0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIF9kZWxldGVBY3RpdmVUb2RvKTtcbiAgICB9XG5cbiAgICAvLyBfYXNzaWduVXBkYXRlQWN0aXZlVG9kb0V2ZW50IGZ1bmN0aW9uIC0gQWRkcyBldmVudCBoYW5kbGVyIHRvIHNhdmUgYnV0dG9uIHRoYXQgdXBkYXRlcyBhY3RpdmUgdG9kbyBpbmZvcm1hdGlvblxuICAgIGZ1bmN0aW9uIF9hc3NpZ25VcGRhdGVBY3RpdmVUb2RvRXZlbnQoKSB7XG4gICAgICAgIGNvbnN0IHNhdmVCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc2F2ZS1idG4nKTtcbiAgICAgICAgc2F2ZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIF91cGRhdGVBY3RpdmVUb2RvKTtcbiAgICB9XG5cbiAgICAvLyBfYXNzaWduU2lkZWJhckV2ZW50cyB3cmFwcGVyIGZ1bmN0aW9uIC0gQWRkIGV2ZW50IGhhbmRsZXJzIHRvIHRoZSBQcm9qZWN0cyBzaWRlIGJhclxuICAgIGZ1bmN0aW9uIF9hc3NpZ25TaWRlYmFyRXZlbnRzKCkge1xuICAgICAgICBfYXNzaWduTmV3UHJvamVjdEV2ZW50KCk7XG4gICAgICAgIF9hc3NpZ25Qcm9qZWN0RXZlbnRzKCk7XG4gICAgICAgIF9hc3NpZ25EZWxQcm9qZWN0RXZlbnRzKClcbiAgICB9XG5cbiAgICAvLyBfYXNzaWduTmV3VG9kb0V2ZW50cyB3cmFwcGVyIGZ1bmN0aW9uIC0gQWRkIGV2ZW50IGhhbmRsZXJzIGFzc29jaWF0ZWQgd2l0aCBhZGRpbmcgYSBuZXcgdG9kb1xuICAgIGZ1bmN0aW9uIF9hc3NpZ25OZXdUb2RvRXZlbnRzKCkge1xuICAgICAgICBfYXNzaWduQWRkVG9kb0V2ZW50KCk7XG4gICAgICAgIF9hc3NpZ25DbG9zZVRvZG9FdmVudCgpO1xuICAgICAgICBfYXNzaWduU3VibWl0VG9kb0V2ZW50KCk7XG4gICAgfVxuXG4gICAgLy8gX2Fzc2lnblRvZG9MaXN0RXZlbnRzIHdyYXBwZXIgZnVuY3Rpb24gLSBBZGQgZXZlbnQgaGFuZGxlcnMgdG8gVG9kbyBJdGVtcyBzZWN0aW9uXG4gICAgZnVuY3Rpb24gX2Fzc2lnblRvZG9MaXN0RXZlbnRzKCkge1xuICAgICAgICBfYXNzaWduU2V0QWN0aXZlRXZlbnRzKCk7XG4gICAgICAgIF9hc3NpZ25Ub2dnbGVUb2RvQ29tcGxldGVFdmVudCgpO1xuICAgICAgICBfYXNzaWduRGVsZXRlQWN0aXZlVG9kb0V2ZW50KCk7XG4gICAgICAgIF9hc3NpZ25VcGRhdGVBY3RpdmVUb2RvRXZlbnQoKTtcbiAgICB9XG5cbi8qXG4gICAgLy8gX2Fzc2lnbk1haW5FdmVudHMgd3JhcHBlciBmdW5jdGlvbiAtIEFkZCBldmVudCBoYW5kbGVycyB0byB0aGUgbWFpbiBwYWdlIFRvZG8gbGlzdCBjb250ZW50XG4gICAgZnVuY3Rpb24gX2Fzc2lnbk1haW5FdmVudHMoKSB7XG4gICAgICAgIF9hc3NpZ25OZXdUb2RvRXZlbnRzKCk7XG4gICAgICAgIF9hc3NpZ25Ub2RvTGlzdEV2ZW50cygpO1xuICAgIH1cblxuICAgIC8vIF9hc3NpZ25GdWxsUGFnZUV2ZW50cyB3cmFwcGVyIGZ1bmN0aW9uIC0gQWRkcyBldmVudCBoYW5kbGVycyB0byB0aGUgZW50aXJlIHBhZ2VcbiAgICBmdW5jdGlvbiBfYXNzaWduRnVsbFBhZ2VFdmVudHMoKSB7XG4gICAgICAgIF9hc3NpZ25TaWRlYmFyRXZlbnRzKCk7XG4gICAgICAgIF9hc3NpZ25NYWluRXZlbnRzKCk7XG4gICAgfVxuKi9cbiAgICBcbiAgICAvLyBpbml0IGZ1bmN0aW9uIC0gY3JlYXRlcyBwdWJTdWIgc3Vic2NyaXB0aW9uc1xuICAgIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgICAgIC8vIHB1YlN1Yi5zdWJzY3JpYmUoJ2Z1bGxQYWdlUmVuZGVyJywgX2Fzc2lnbkZ1bGxQYWdlRXZlbnRzKTtcbiAgICAgICAgLy8gT24gcHJvamVjdHNSZW5kZXIsIGFzc2lnbiBldmVudCBoYW5kbGVycyB0byB0aGUgcHJvamVjdHMgc2lkZWJhclxuICAgICAgICBwdWJTdWIuc3Vic2NyaWJlKCdwcm9qZWN0c1JlbmRlcicsIF9hc3NpZ25TaWRlYmFyRXZlbnRzKTtcblxuICAgICAgICAvLyBPbiBuZXdUb2RvQ29udGVudFJlbmRlciwgYXNzaWduIGFzc29jaWF0ZWQgZm9ybSBldmVudCBoYW5kbGVyc1xuICAgICAgICBwdWJTdWIuc3Vic2NyaWJlKCduZXdUb2RvQ29udGVudFJlbmRlcicsIF9hc3NpZ25OZXdUb2RvRXZlbnRzKTtcblxuICAgICAgICAvLyBPbiB0b2Rvc1JlbmRlciwgYXNzaWduIGFzc29jaWF0ZWQgcGFnZSBldmVudCBoYW5kbGVyc1xuICAgICAgICBwdWJTdWIuc3Vic2NyaWJlKCd0b2Rvc1JlbmRlcicsIF9hc3NpZ25Ub2RvTGlzdEV2ZW50cyk7XG5cbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIGluaXRcbiAgICB9O1xufSkoKTtcblxuZXhwb3J0IHsgZXZlbnRzIH07IiwiY29uc3QgcHViU3ViID0ge1xuICAgIGV2ZW50czoge30sXG4gICAgc3Vic2NyaWJlOiBmdW5jdGlvbihldmVudE5hbWUsIGZuKSB7XG4gICAgICAgIHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0gPSB0aGlzLmV2ZW50c1tldmVudE5hbWVdIHx8IFtdO1xuICAgICAgICB0aGlzLmV2ZW50c1tldmVudE5hbWVdLnB1c2goZm4pO1xuICAgIH0sXG4gICAgdW5zdWJzY3JpYmU6IGZ1bmN0aW9uKGV2ZW50TmFtZSwgZm4pIHtcbiAgICAgICAgaWYgKHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0pIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmV2ZW50c1tldmVudE5hbWVdLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5ldmVudHNbZXZlbnROYW1lXVtpXSA9PT0gZm4pIHtcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0uc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHB1Ymxpc2g6IGZ1bmN0aW9uKGV2ZW50TmFtZSwgZGF0YSkge1xuICAgICAgICBpZiAodGhpcy5ldmVudHNbZXZlbnROYW1lXSkge1xuICAgICAgICB0aGlzLmV2ZW50c1tldmVudE5hbWVdLmZvckVhY2goZnVuY3Rpb24oZm4pIHtcbiAgICAgICAgICAgIGZuKGRhdGEpO1xuICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbmV4cG9ydCB7IHB1YlN1YiB9OyIsImltcG9ydCB7IHB1YlN1YiB9IGZyb20gJy4vcHViU3ViLmpzJztcblxuLy8gU3RvcmFnZSBtb2R1bGUgLSBoYW5kbGVzIHN0b3JhZ2UvcmV0cmlldmFsIG9mIGJyb3dzZXIgbG9jYWxTdG9yYWdlIGRhdGFcbmNvbnN0IHN0b3JhZ2UgPSAoZnVuY3Rpb24oKSB7XG4gICAgLy8gaW5pdCBmdW5jdGlvbiAtIFNldHMgdXAgcHViU3ViIHN1YnNjcmlwdGlvbnNcbiAgICBmdW5jdGlvbiBpbml0KCkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgaW5pdFxuICAgIH07XG59KSgpO1xuXG5leHBvcnQgeyBzdG9yYWdlIH07IiwiaW1wb3J0IHsgY3JlYXRlU2lkZWJhckNvbnRlbnQgfSBmcm9tICcuLi92aWV3cy9zaWRlYmFyLmpzJztcbmltcG9ydCB7IGNyZWF0ZVByb2plY3RUaXRsZUNvbnRlbnQgfSBmcm9tICcuLi92aWV3cy90aXRsZS5qcyc7XG5pbXBvcnQgeyBjcmVhdGVOZXdUb2RvQ29udGVudCB9IGZyb20gJy4uL3ZpZXdzL25ld1RvZG9TZWN0aW9uLmpzJztcbmltcG9ydCB7IGNyZWF0ZVRvZG9JdGVtQ29udGVudCB9IGZyb20gJy4uL3ZpZXdzL3RvZG9JdGVtcy5qcyc7XG5pbXBvcnQgeyBwdWJTdWIgfSBmcm9tICcuL3B1YlN1Yi5qcyc7XG5cbi8vIHZpZXdDb250cm9sbGVyIG1vZHVsZSAtIGNvbnRyb2xzIERPTSBtYW5pcHVsYXRpb25cbmNvbnN0IHZpZXdDb250cm9sbGVyID0gKGZ1bmN0aW9uKCkge1xuICAgIC8vIF9zaG93TmV3VG9kb0Zvcm0gZnVuY3Rpb24gLSBNYWtlcyB0aGUgXCJBZGQgTmV3IFRvZG9cIiBmb3JtIHZpc2libGVcbiAgICBmdW5jdGlvbiBfc2hvd05ld1RvZG9Gb3JtKCkge1xuICAgICAgICBjb25zdCBmb3JtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmFkZC10b2RvJyk7XG4gICAgICAgIGNvbnN0IGZvcm1Ub2dnbGVCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYWRkLXRvZG8tYnRuJyk7XG4gICAgICAgIGZvcm0uc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgIGZvcm1Ub2dnbGVCdG4uc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICB9XG5cbiAgICAvLyBfaGlkZU5ld1RvZG9Gb3JtIGZ1bmN0aW9uIC0gSGlkZXMgdGhlIFwiQWRkIE5ldyBUb2RvXCIgZm9ybVxuICAgIGZ1bmN0aW9uIF9oaWRlTmV3VG9kb0Zvcm0oKSB7XG4gICAgICAgIGNvbnN0IGZvcm0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYWRkLXRvZG8nKTtcbiAgICAgICAgY29uc3QgZm9ybVRvZ2dsZUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNhZGQtdG9kby1idG4nKTtcbiAgICAgICAgZm9ybS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICBmb3JtVG9nZ2xlQnRuLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgIH1cbiAgICBcbiAgICAvLyBfcmVuZGVyUHJvamVjdHMgZnVuY3Rpb24gLSByZW5kZXJzIHNpZGViYXIgY29udGVudFxuICAgIGZ1bmN0aW9uIF9yZW5kZXJQcm9qZWN0cyhkYXRhKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuXG4gICAgICAgIC8vIENsZWFyIHRoZSBwcm9qZWN0LWxpc3Qgc2lkZWJhclxuICAgICAgICBjb25zdCBwcm9qZWN0TGlzdERpdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNwcm9qZWN0LWxpc3QnKVxuICAgICAgICBwcm9qZWN0TGlzdERpdi50ZXh0Q29udGVudCA9ICcnO1xuXG4gICAgICAgIC8vIEV4dHJhY3QgcmVsZXZhbnQgZGF0YVxuICAgICAgICBjb25zdCBwcm9qZWN0TmFtZUxpc3QgPSBkYXRhLnByb2plY3RzLm1hcChwcm9qZWN0ID0+IHtcbiAgICAgICAgICAgIHJldHVybiBwcm9qZWN0Lm5hbWU7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IGFjdGl2ZVByb2plY3ROYW1lID0gZGF0YS5hY3RpdmVQcm9qZWN0Lm5hbWU7XG4gICAgICAgIGNvbnNvbGUubG9nKGFjdGl2ZVByb2plY3ROYW1lKTtcblxuICAgICAgICAvLyBHZW5lcmF0ZSBwcm9qZWN0LWxpc3Qgc2lkZWJhciBodG1sXG4gICAgICAgIGNvbnN0IHNpZGViYXJDb250ZW50ID0gY3JlYXRlU2lkZWJhckNvbnRlbnQocHJvamVjdE5hbWVMaXN0LCBhY3RpdmVQcm9qZWN0TmFtZSk7XG4gICAgICAgIHByb2plY3RMaXN0RGl2LmFwcGVuZENoaWxkKHNpZGViYXJDb250ZW50KTtcbiAgICAgICAgXG4gICAgICAgIHB1YlN1Yi5wdWJsaXNoKCdwcm9qZWN0c1JlbmRlcicpO1xuICAgIH1cblxuICAgIC8vIF9yZW5kZXJQcm9qZWN0VGl0bGUgZnVuY3Rpb24gLSByZW5kZXJzIHRoZSBwcm9qZWN0IHRpdGxlIG9uIHRoZSBwYWdlXG4gICAgZnVuY3Rpb24gX3JlbmRlclByb2plY3RUaXRsZShkYXRhKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuXG4gICAgICAgIC8vIENsZWFyIHByb2plY3QtdGl0bGUtY29udGVudFxuICAgICAgICBjb25zdCBwcm9qZWN0VGl0bGVEaXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcHJvamVjdC10aXRsZS1jb250ZW50Jyk7XG4gICAgICAgIHByb2plY3RUaXRsZURpdi50ZXh0Q29udGVudCA9ICcnO1xuXG4gICAgICAgIC8vIEV4dHJhY3QgcmVsZXZhbnQgZGF0YVxuICAgICAgICBjb25zdCBhY3RpdmVQcm9qZWN0TmFtZSA9IGRhdGEuYWN0aXZlUHJvamVjdC5uYW1lO1xuICAgICAgICBjb25zb2xlLmxvZyhhY3RpdmVQcm9qZWN0TmFtZSk7XG5cbiAgICAgICAgLy8gR2VuZXJhdGUgcHJvamVjdC10aXRsZSBodG1sXG4gICAgICAgIGNvbnN0IHByb2plY3RUaXRsZUNvbnRlbnQgPSBjcmVhdGVQcm9qZWN0VGl0bGVDb250ZW50KGFjdGl2ZVByb2plY3ROYW1lKTtcbiAgICAgICAgcHJvamVjdFRpdGxlRGl2LmFwcGVuZENoaWxkKHByb2plY3RUaXRsZUNvbnRlbnQpO1xuICAgICAgICBcbiAgICAgICAgcHViU3ViLnB1Ymxpc2goJ3Byb2plY3RUaXRsZVJlbmRlcicpO1xuICAgIH1cblxuICAgIC8vIF9yZW5kZXJOZXdUb2RvQ29udGVudCBmdW5jdGlvbiAtIHJlbmRlcnMgcGFnZSBjb250ZW50IHJlbGF0ZWQgdG8gYWRkaW5nIG5ldyB0b2RvXG4gICAgZnVuY3Rpb24gX3JlbmRlck5ld1RvZG9Db250ZW50KGRhdGEpIHtcbiAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XG5cbiAgICAgICAgLy8gQ2xlYXIgbmV3LXRvZG8tY29udGVudCBkaXZcbiAgICAgICAgY29uc3QgbmV3VG9kb0NvbnRlbnREaXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbmV3LXRvZG8tY29udGVudCcpO1xuICAgICAgICBuZXdUb2RvQ29udGVudERpdi50ZXh0Q29udGVudCA9ICcnO1xuXG4gICAgICAgIC8vIEV4dHJhY3QgcmVsZXZhbnQgZGF0YVxuXG4gICAgICAgIC8vIEdlbmVyYXRlIG5ldy10b2RvLWNvbnRlbnQgaHRtbFxuICAgICAgICBjb25zdCBuZXdUb2RvQ29udGVudCA9IGNyZWF0ZU5ld1RvZG9Db250ZW50KCk7XG4gICAgICAgIC8vbmV3VG9kb0NvbnRlbnREaXYuYXBwZW5kQ2hpbGQobmV3VG9kb0NvbnRlbnQpO1xuXG4gICAgICAgIFxuICAgICAgICBwdWJTdWIucHVibGlzaCgnbmV3VG9kb0NvbnRlbnRSZW5kZXInKTtcbiAgICB9XG5cbiAgICAvLyBfcmVuZGVyVG9kb3MgZnVuY3Rpb24gLSByZW5kZXJzIHRvZG8gY29udGVudFxuICAgIGZ1bmN0aW9uIF9yZW5kZXJUb2RvcyhkYXRhKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuXG4gICAgICAgIC8vIENsZWFyIHRvZG8tbGlzdC1pdGVtcyBkaXZcbiAgICAgICAgY29uc3QgdG9kb0xpc3RJdGVtc0RpdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN0b2RvLWxpc3QtaXRlbXMnKTtcbiAgICAgICAgdG9kb0xpc3RJdGVtc0Rpdi50ZXh0Q29udGVudCA9ICcnO1xuICAgICAgICBjb25zb2xlLmxvZygneWVzJyk7XG5cbiAgICAgICAgLy8gRXh0cmFjdCByZWxldmFudCBkYXRhXG5cbiAgICAgICAgLy8gR2VuZXJhdGUgdG9kby1saXN0LWl0ZW1zIGNvbnRlbnRcbiAgICAgICAgY29uc3QgdG9kb0xpc3RJdGVtc0NvbnRlbnQgPSBjcmVhdGVUb2RvSXRlbUNvbnRlbnQoKTtcbiAgICAgICAgLy90b2RvTGlzdEl0ZW1zRGl2LmFwcGVuZENoaWxkKHRvZG9MaXN0SXRlbXNDb250ZW50KTtcbiAgICAgICAgXG4gICAgICAgIHB1YlN1Yi5wdWJsaXNoKCd0b2Rvc1JlbmRlcicpO1xuICAgIH1cbiAgICBcbiAgICAvLyBfcmVuZGVyRnVsbFBhZ2UgZnVuY3Rpb24gLSByZW5kZXJzIHRoZSBlbnRpcmUgcGFnZSdzIGNvbnRlbnRcbiAgICBmdW5jdGlvbiBfcmVuZGVyRnVsbFBhZ2UoZGF0YSkge1xuICAgICAgICBfcmVuZGVyUHJvamVjdHMoZGF0YSk7XG4gICAgICAgIF9yZW5kZXJQcm9qZWN0VGl0bGUoZGF0YSk7XG4gICAgICAgIF9yZW5kZXJOZXdUb2RvQ29udGVudChkYXRhKTtcbiAgICAgICAgX3JlbmRlclRvZG9zKGRhdGEpO1xuICAgIH1cbiAgICBcbiAgICAvLyBpbml0IGZ1bmN0aW9uIC0gU3Vic2NyaWJlcyB0byBwdWJTdWIgZXZlbnRzXG4gICAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICAgICAgcHViU3ViLnN1YnNjcmliZSgnYXBwSW5pdCcsIF9yZW5kZXJGdWxsUGFnZSk7XG4gICAgICAgIHB1YlN1Yi5zdWJzY3JpYmUoJ2FjdGl2YXRlTmV3VG9kb0Zvcm0nLCBfc2hvd05ld1RvZG9Gb3JtKTtcbiAgICAgICAgcHViU3ViLnN1YnNjcmliZSgnZGlzYWJsZU5ld1RvZG9Gb3JtJywgX2hpZGVOZXdUb2RvRm9ybSk7XG4gICAgICAgIHB1YlN1Yi5zdWJzY3JpYmUoJ3Byb2plY3RzQ2hhbmdlJywgX3JlbmRlclByb2plY3RzKTtcbiAgICAgICAgcHViU3ViLnN1YnNjcmliZSgndG9kb3NDaGFuZ2UnLCBfcmVuZGVyVG9kb3MpO1xuICAgICAgICBwdWJTdWIuc3Vic2NyaWJlKCdhY3RpdmVQcm9qZWN0Q2hhbmdlJywgX3JlbmRlckZ1bGxQYWdlKTtcbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIHsgaW5pdCB9O1xufSkoKTtcblxuZXhwb3J0IHsgdmlld0NvbnRyb2xsZXIgfTsiLCJpbXBvcnQgeyBkb21VdGlsIH0gZnJvbSAnLi91dGlsLmpzJztcblxuZnVuY3Rpb24gY3JlYXRlTmV3VG9kb0NvbnRlbnQoKSB7XG4gICAgcmV0dXJuO1xufVxuXG5leHBvcnQgeyBjcmVhdGVOZXdUb2RvQ29udGVudCB9OyIsImltcG9ydCB7IGRvbVV0aWwgfSBmcm9tICcuL3V0aWwuanMnO1xuXG5mdW5jdGlvbiBjcmVhdGVQcm9qZWN0RGl2KHByb2plY3ROYW1lLCBpc0FjdGl2ZVByb2plY3QpIHtcbiAgICAvLyBQYXJlbnRcbiAgICBjb25zdCBwcm9qZWN0RGl2Q2xhc3NMaXN0ID0gaXNBY3RpdmVQcm9qZWN0ID8gWyAncHJvamVjdCcsICdhY3RpdmUtcHJvamVjdCcgXSA6ICBbICdwcm9qZWN0JyBdO1xuICAgIGNvbnN0IHByb2plY3REaXYgPSBkb21VdGlsLmNyZWF0ZSgnZGl2JywgJycsIHtcbiAgICAgICAgY2xhc3M6IHByb2plY3REaXZDbGFzc0xpc3QsXG4gICAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgICAgICdkYXRhLW5hbWUnOiBwcm9qZWN0TmFtZVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBDaGlsZHJlblxuICAgIGNvbnN0IG5hbWVQID0gZG9tVXRpbC5jcmVhdGUoJ3AnLCBwcm9qZWN0TmFtZSwgeyBjbGFzczogJ3Byb2plY3QtbmFtZScgfSk7XG4gICAgY29uc3QgZGVsQnV0dG9uID0gZG9tVXRpbC5jcmVhdGUoJ2J1dHRvbicsICctJywgeyBjbGFzczogJ2RlbC1wcm9qZWN0JyB9KTtcbiAgICBjb25zdCBjaGlsZHJlbiA9IFsgbmFtZVAsIGRlbEJ1dHRvbiBdO1xuXG4gICAgLy8gQXBwZW5kIGNoaWxkcmVuIHRvIHBhcmVudFxuICAgIGRvbVV0aWwuYXBwZW5kQ2hpbGRyZW4ocHJvamVjdERpdiwgY2hpbGRyZW4pO1xuXG4gICAgcmV0dXJuIHByb2plY3REaXY7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVNpZGViYXJDb250ZW50KHByb2plY3ROYW1lTGlzdCwgYWN0aXZlUHJvamVjdE5hbWUpIHtcbiAgICAvLyBwYXJlbnRcbiAgICBjb25zdCBjb250YWluZXIgPSBkb21VdGlsLmNyZWF0ZSgnZGl2JywgJycpO1xuICAgIFxuICAgIC8vIGNoaWxkcmVuXG4gICAgcHJvamVjdE5hbWVMaXN0LmZvckVhY2gocHJvamVjdE5hbWUgPT4ge1xuICAgICAgICAvLyBBcHBlbmQgY2hpbGRyZW4gdG8gcGFyZW50XG4gICAgICAgIGNvbnN0IGlzQWN0aXZlUHJvamVjdCA9IHByb2plY3ROYW1lID09PSBhY3RpdmVQcm9qZWN0TmFtZTtcbiAgICAgICAgY29uc3QgcHJvamVjdERpdiA9IGNyZWF0ZVByb2plY3REaXYocHJvamVjdE5hbWUsIGlzQWN0aXZlUHJvamVjdCk7XG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmQocHJvamVjdERpdik7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gY29udGFpbmVyO1xufVxuXG5leHBvcnQgeyBjcmVhdGVTaWRlYmFyQ29udGVudCB9OyIsImltcG9ydCB7IGRvbVV0aWwgfSBmcm9tICcuL3V0aWwuanMnO1xuXG5mdW5jdGlvbiBjcmVhdGVQcm9qZWN0VGl0bGVDb250ZW50KGFjdGl2ZVByb2plY3ROYW1lKSB7XG4gICAgY29uc3QgaDIgPSBkb21VdGlsLmNyZWF0ZSgnaDInLCBhY3RpdmVQcm9qZWN0TmFtZSk7XG4gICAgcmV0dXJuIGgyO1xufVxuXG5leHBvcnQgeyBjcmVhdGVQcm9qZWN0VGl0bGVDb250ZW50IH07IiwiaW1wb3J0IHsgZG9tVXRpbCB9IGZyb20gJy4vdXRpbC5qcyc7XG5cbmZ1bmN0aW9uIGNyZWF0ZVRvZG9JdGVtQ29udGVudCgpIHtcbiAgICByZXR1cm47XG59XG5cbmV4cG9ydCB7IGNyZWF0ZVRvZG9JdGVtQ29udGVudCB9OyIsIi8vIGRvbVV0aWwgbW9kdWxlIC0gY29udGFpbnMgZnVuY3Rpb25zIHRvIHNpbXBsaWZ5IERPTSBub2RlIG1hbmlwdWxhdGlvbiBhbmQgY3JlYXRpb25cbmNvbnN0IGRvbVV0aWwgPSAoZnVuY3Rpb24oKSB7XG4gICAgLy8gX2FkZElkIGZ1bmN0aW9uIC0gYWRkcyBpZCB0byBhIHNwZWNpZmllZCBlbGVtZW50XG4gICAgZnVuY3Rpb24gX2FkZElkKGVsZW0sIGlkKSB7XG4gICAgICAgIGVsZW0uaWQgPSBpZDtcbiAgICAgICAgcmV0dXJuIGVsZW07XG4gICAgfVxuICAgIFxuICAgIC8vIF9hZGRDbGFzcyAtIGFkZHMgc3BlY2lmaWVkIGNsYXNzZXMgdG8gYW4gZWxlbWVudFxuICAgIGZ1bmN0aW9uIF9hZGRDbGFzcyhlbGVtLCBjbGFzc2VzKSB7XG4gICAgICAgIGlmICh0eXBlb2YgY2xhc3NlcyA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGVsZW0uY2xhc3NMaXN0LmFkZChjbGFzc2VzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNsYXNzZXMuZm9yRWFjaChjbGFzc05hbWUgPT4ge1xuICAgICAgICAgICAgICAgIGVsZW0uY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGVsZW07XG4gICAgfVxuXG4gICAgLy8gX2FkZEF0dHJpYnV0ZSAtIGFkZHMgc3BlY2lmaWVkIGF0dHJpYnV0ZXMgdG8gYW4gZWxlbWVudFxuICAgIGZ1bmN0aW9uIF9hZGRBdHRyaWJ1dGUoZWxlbSwgYXR0cmlidXRlcykge1xuICAgICAgICBmb3IgKGxldCBrZXkgaW4gYXR0cmlidXRlcykge1xuICAgICAgICAgICAgZWxlbS5zZXRBdHRyaWJ1dGUoa2V5LCBhdHRyaWJ1dGVzW2tleV0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBlbGVtO1xuICAgIH1cbiAgICBcbiAgICAvKiBjcmVhdGUgbWV0aG9kIC0gY3JlYXRlcyBhbiBlbGVtZW50IHdpdGggc3BlY2lmaWVkIHRhZywgZ2l2ZW4gdGV4dCwgYW5kIHN1cHBsaWVkIG9wdGlvbnNcbiAgICBvcHRpb25zIHBhcmVtdGVyIGlzIG9mIHRoZSBmb3JtOiBcbiAgICB7XG4gICAgICAgIGlkOiBTdHJpbmcsXG4gICAgICAgIGNsYXNzOiBTdHJpbmcgfCBbU3RyaW5nXVxuICAgICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgICBhdHRyaWJ1dGUxOiBTdHJpbmcsXG4gICAgICAgICAgICBhdHRyaWJ1dGUyOiBTdHJpbmdcbiAgICAgICAgfVxuICAgIH1cbiAgICAqL1xuICAgIGZ1bmN0aW9uIGNyZWF0ZSh0YWcsIHRleHQsIG9wdGlvbnMpIHtcbiAgICAgICAgY29uc3QgZWxlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnKTtcbiAgICAgICAgZWxlbS50ZXh0Q29udGVudCA9IHRleHQ7XG5cbiAgICAgICAgLy8gcmV0dXJuIHRoZSBlbGVtZW50IGlmIG5vIG9wdGlvbnMgd2VyZSBzcGVjaWZpZWRcbiAgICAgICAgaWYgKG9wdGlvbnMgPT09IHVuZGVmaW5lZCB8fCBPYmplY3Qua2V5cyhvcHRpb25zKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiBlbGVtO1xuICAgICAgICB9IFxuICAgICAgICBcbiAgICAgICAgLy8gQWRkIHNwZWNpZmllZCBpZFxuICAgICAgICBpZiAob3B0aW9ucy5pZCkge1xuICAgICAgICAgICAgX2FkZElkKGVsZW0sIG9wdGlvbnMuaWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQWRkIHNwZWNpZmllZCBjbGFzc1xuICAgICAgICBpZiAob3B0aW9ucy5jbGFzcykge1xuICAgICAgICAgICAgX2FkZENsYXNzKGVsZW0sIG9wdGlvbnMuY2xhc3MpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQWRkIHNwZWNpZmllZCBhdHRyaWJ1dGVzXG4gICAgICAgIGlmIChvcHRpb25zLmF0dHJpYnV0ZXMgIT09IHVuZGVmaW5lZCAmJiBPYmplY3Qua2V5cyhvcHRpb25zLmF0dHJpYnV0ZXMpLmxlbmd0aCAhPT0gMCkge1xuICAgICAgICAgICAgX2FkZEF0dHJpYnV0ZShlbGVtLCBvcHRpb25zLmF0dHJpYnV0ZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGVsZW07XG4gICAgfVxuXG4gICAgLy8gYXBwZW5kQ2hpbGRyZW4gbWV0aG9kIC0gYXBwZW5kcyBhbiBhcnJheSBvZiBjaGlsZHJlbiB0byB0aGUgcGFyZW50IG5vZGUgaW4gdGhlIHByb3ZpZGVkIG9yZGVyXG4gICAgZnVuY3Rpb24gYXBwZW5kQ2hpbGRyZW4ocGFyZW50LCBjaGlsZHJlbikge1xuICAgICAgICBjaGlsZHJlbi5mb3JFYWNoKGNoaWxkID0+IHtcbiAgICAgICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZChjaGlsZCk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcGFyZW50O1xuICAgIH1cblxuICAgIC8vIENsZWFyIFxuICAgIHJldHVybiB7XG4gICAgICAgIGNyZWF0ZSxcbiAgICAgICAgYXBwZW5kQ2hpbGRyZW4sXG4gICAgfTtcbn0pKCk7XG5cbmV4cG9ydCB7IGRvbVV0aWwgfTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IHZpZXdDb250cm9sbGVyIH0gZnJvbSAnLi9tb2R1bGVzL3ZpZXdDb250cm9sbGVyLmpzJztcbmltcG9ydCB7IGV2ZW50cyB9IGZyb20gJy4vbW9kdWxlcy9ldmVudHMuanMnO1xuaW1wb3J0IHsgc3RvcmFnZSB9IGZyb20gJy4vbW9kdWxlcy9zdG9yYWdlLmpzJztcbmltcG9ydCB7IGFwcCB9IGZyb20gJy4vbW9kdWxlcy9hcHAuanMnO1xuXG4vLyBURU1QT1JBUlkgcHJvamVjdHMgYXJyYXkgdGhhdCB3aWxsIHN0YW5kIGluIGZvciBsb2NhbFN0b3JhZ2UgdG8gcmVoeWRyYXRlIGludG8gYXBwcm9wcmlhdGUgb2JqZWN0cyB3aXRoIHByb3RvdHlwZXNcbmNvbnN0IHByb2plY3RzID0gW1xuICAgIHtcbiAgICAgICAgbmFtZTogJ0Zvb2QgUHJvamVjdCcsXG4gICAgICAgIHRvZG9zOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGl0bGU6ICdFYXQgc29tZSBwaXp6YScsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdFYXQgc29tZSBwaXp6YSB3aXRoIGdhcmxpYyBzYXVjZScsXG4gICAgICAgICAgICAgICAgZHVlRGF0ZTogJzEwLzIyLzEyJyxcbiAgICAgICAgICAgICAgICBwcmlvcml0eTogJ2hpZ2gnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRpdGxlOiAnRWF0IHNvbWUgY2hpY2tlbiB3aW5ncycsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246ICdFYXQgc29tZSBwaXp6YSB3aXRoIGdhcmxpYyBzYXVjZScsXG4gICAgICAgICAgICAgICAgZHVlRGF0ZTogJzAzLzE0LzE4JyxcbiAgICAgICAgICAgICAgICBwcmlvcml0eTogJ21pZCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnR3VpdGFyIFByb2plY3QnLFxuICAgICAgICB0b2RvczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRpdGxlOiAnUHJhY3RpY2UgU3RhaXJ3YXkgdG8gSGVhdmVuJyxcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ1ByYWN0aWNlIHRoZSBjaG9ydXMgb2YgU3RhaXJ3YXkgdG8gSGVhdmVuJyxcbiAgICAgICAgICAgICAgICBkdWVEYXRlOiAnMDUvMTgvMjEnLFxuICAgICAgICAgICAgICAgIHByaW9yaXR5OiAnbG93J1xuICAgICAgICAgICAgfVxuICAgICAgICBdXG4gICAgfVxuXTtcblxuLy8gSW5pdGlhbGl6ZSB2aWV3Q29udHJvbGxlciwgZXZlbnRzLCBhbmQgc3RvcmFnZSBtb2R1bGVzXG52aWV3Q29udHJvbGxlci5pbml0KCk7XG5ldmVudHMuaW5pdCgpO1xuc3RvcmFnZS5pbml0KCk7XG5cbi8vIEluaXRpYWxpemUgYXBwbGljYXRpb25cbmFwcC5pbml0KHByb2plY3RzKTsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=