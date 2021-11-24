import { domUtil } from './util.js';
import { todoForm } from './todoForm';

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
    const container = domUtil.create('div', '', {
        class: classList,
        attributes: {
            'data-title': todo.title,
            'data-id': todo.id
        }
    });

    // Children
    const h4 = domUtil.create('h4', todo.title);
    const p = domUtil.create('p', `Due: ${todo.dueDate}`);
    const children = [ h4, p ];

    // Append children to parent
    domUtil.appendChildren(container, children);

    return container;
}

function createActiveTodoDiv(todo) {
    const classList = generateTodoDivClassList(todo, true);

    // Parent
    const container = domUtil.create('div', '', {
        class: classList,
        attributes: {
            'data-title': todo.title,
            'data-id': todo.id
        }
    });

    // Children
    const toggleCompleteBtn = domUtil.create('button', '', { id: 'toggle-complete' });
    toggleCompleteBtn.innerHTML = '&check;';
    const delActiveTodoBtn = domUtil.create('button', 'X', { id: 'del-active-todo' });
    const titleSection = todoForm.createTitleSection('update-title', todo.title)
    const descriptionSection = todoForm.createDescriptionSection('update-description', todo.description);
    const dateSection = todoForm.createDateSection('update-date', todo.dueDate);
    const prioritySection = todoForm.createPrioritySection([ 'update-low', 'update-mid', 'update-high' ],
        [ 'low', 'mid', 'high' ],
        [ 'Low', 'Mid', 'High' ],
        'update-priority',
        todo.priority    
    );
    const saveBtn = domUtil.create('button', 'Save', {
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
    domUtil.appendChildren(container, children);

    return container;
}

function createTodoListItems(todos, activeTodo) {
    // Parent
    const container = domUtil.create('div', '', { id: 'todo-list-items' });

    // Children
    todos.forEach(todo => {
        let todoDiv;
        if (activeTodo === null || todo.id !== activeTodo.id) {
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
    const container = domUtil.create('div', '');

    // Children
    const h3 = domUtil.create('h3', 'Todo Items');
    const todoListItems = createTodoListItems(todos, activeTodo);
    const children = [ h3, todoListItems ];

    // Append children to parent
    domUtil.appendChildren(container, children);

    return container;
}

export { createTodoListContent };