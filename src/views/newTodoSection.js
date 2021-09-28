import { domUtil } from './util.js';
import { todoForm } from './todoForm';

function createTitleSection() {
    // Parent
    const container = domUtil.create('div', '');

    // Children
    const titleLabel = domUtil.create('label', 'Title', {
        attributes: {
            for: 'new-title'
        }
    });
    const titleInput = domUtil.create('input', '', {
        id: 'new-title',
        attributes: {
            name: 'new-title',
            type: 'text'
        }
    });
    const children = [ titleLabel, titleInput ];

    // Append children to parent
    domUtil.appendChildren(container, children);

    return container;
}

function createDescriptionSection() {
    // Parent
    const container = domUtil.create('div', '');

    // Children
    const descriptionLabel = domUtil.create('label', 'Description', {
        attributes: {
            for: 'new-description'
        }
    });
    const descriptionInput = domUtil.create('textarea', '', {
        id: 'new-description',
        attributes: {
            name: 'new-description',
            rows: '5',
            cols: '30'
        }
    });
    const children = [ descriptionLabel, descriptionInput ];

    // Append children to parent
    domUtil.appendChildren(container, children);
    
    return container;
}

function createDateSection() {
    // Parent
    const container = domUtil.create('div', '');

    // Children
    const dateLabel = domUtil.create('label', 'Due Date', {
        attributes: {
            for: 'new-date'
        }
    });
    const dateInput = domUtil.create('input', '', {
        id: 'new-date',
        attributes: {
            name: 'new-date',
            type: 'date'
        }
    });
    const children = [ dateLabel, dateInput ];

    // Append children to parent
    domUtil.appendChildren(container, children);
    
    return container;
}

function createPrioritySection() {
    // Parent
    const container = domUtil.create('div', '');

    // Children
    const p = domUtil.create('p', 'Priority');
    const lowInput = domUtil.create('input', '', {
        id: 'new-low',
        attributes: {
            type: 'radio',
            name: 'new-priority',
            value: 'low'
        }
    });
    const lowLabel = domUtil.create('label', 'Low', {
        class: 'radio-label',
        attributes: {
            for: 'new-low'
        }
    });
    const midInput = domUtil.create('input', '', {
        id: 'new-mid',
        attributes: {
            type: 'radio',
            name: 'new-priority',
            value: 'mid'
        }
    });
    const midLabel = domUtil.create('label', 'Mid', {
        class: 'radio-label',
        attributes: {
            for: 'new-mid'
        }
    });
    const highInput = domUtil.create('input', '', {
        id: 'new-high',
        attributes: {
            type: 'radio',
            name: 'new-priority',
            value: 'high'
        }
    });
    const highLabel = domUtil.create('label', 'High', {
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
    domUtil.appendChildren(container, children);
    
    return container;
}


function createAddTodoFormDiv() {
    // Parent
    const addTodoFormDiv = domUtil.create('div', '', { class: 'add-todo' });

    // Children
    const closeTodoFormBtn = domUtil.create('button', 'X', { id: 'close-new-todo-form' });
    const h3 = domUtil.create('h3', 'Add New Todo');
    const titleSection = todoForm.createTitleSection('new-title')
    const descriptionSection = todoForm.createDescriptionSection('new-description');
    const dateSection = todoForm.createDateSection('new-date');
    const prioritySection = todoForm.createPrioritySection([ 'new-low', 'new-mid', 'new-high' ],
        [ 'low', 'mid', 'high' ],
        [ 'Low', 'Mid', 'High' ],
        'new-priority'    
    );
    const submitTodoBtn = domUtil.create('button', 'Add', { id: 'submit-todo-btn' });
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
    domUtil.appendChildren(addTodoFormDiv, children);

    return addTodoFormDiv;
}

function createNewTodoContent() {
    // Parent
    const container = domUtil.create('div', '');

    // Children
    const addTodoBtn = domUtil.create('button', 'Add Todo', { id: 'add-todo-btn' });
    const addTodoFormDiv = createAddTodoFormDiv();
    const children = [ addTodoBtn, addTodoFormDiv ];

    // Append children to parent
    domUtil.appendChildren(container, children);

    return container;
}

export { createNewTodoContent };