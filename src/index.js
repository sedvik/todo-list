import { viewController } from './modules/viewController.js';
import { events } from './modules/events.js';
import { storage } from './modules/storage.js';
import { app } from './modules/app.js';

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
viewController.init();
events.init();
storage.init();

// Initialize application
app.init(projects);