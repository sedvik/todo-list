import { domUtil } from './util.js';

// todoForm module - generates form fields utilized by the new todo and active todo sections
const todoForm = (function() {

    function createTitleSection(id, initialValue='') {
        // Parent
        const container = domUtil.create('div', '');
    
        // Children
        const titleLabel = domUtil.create('label', 'Title', {
            attributes: {
                for: id
            }
        });
        const titleInput = domUtil.create('input', '', {
            id: id,
            attributes: {
                name: id,
                type: 'text',
                value: initialValue
            }
        });
        const children = [ titleLabel, titleInput ];
    
        // Append children to parent
        domUtil.appendChildren(container, children);
    
        return container;
    }
    
    function createDescriptionSection(id, initialValue='') {
        // Parent
        const container = domUtil.create('div', '');
    
        // Children
        const descriptionLabel = domUtil.create('label', 'Description', {
            attributes: {
                for: id
            }
        });
        const descriptionInput = domUtil.create('textarea', '', {
            id: id,
            attributes: {
                name: id,
                value: initialValue,
                rows: '5',
                cols: '30'
            }
        });
        const children = [ descriptionLabel, descriptionInput ];
    
        // Append children to parent
        domUtil.appendChildren(container, children);
        
        return container;
    }
    
    function createDateSection(id, initialValue='') {
        // Parent
        const container = domUtil.create('div', '');
    
        // Children
        const dateLabel = domUtil.create('label', 'Due Date', {
            attributes: {
                for: id
            }
        });
        const dateInput = domUtil.create('input', '', {
            id: id,
            attributes: {
                name: id,
                type: 'date',
                value: initialValue
            }
        });
        const children = [ dateLabel, dateInput ];
    
        // Append children to parent
        domUtil.appendChildren(container, children);
        
        return container;
    }
    
    // Creates radio button input section of form
    function createPrioritySection(idList, valueList, labelTextList, nameAttr, initialCheckedValue) {
        // Parent
        const container = domUtil.create('div', '');
    
        // Children
        const children = [];
        const p = domUtil.create('p', 'Priority');
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
            
            const input = domUtil.create('input', '', {
                id: idList[i],
                attributes: inputAttributes
            });

            const label = domUtil.create('label', labelTextList[i], {
                class: 'radio-label',
                attributes: {
                    for: idList[i]
                }
            });

            children.push(input, label);
        }
    
        // Append children to parent
        domUtil.appendChildren(container, children);
        
        return container;
    }

    return {
        createTitleSection,
        createDescriptionSection,
        createDateSection,
        createPrioritySection
    };
})();

export { todoForm };