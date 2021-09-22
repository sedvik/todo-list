import { viewController } from './modules/viewController.js';
import { app } from './modules/app.js';

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
viewController.initialize();
events.initialize();
storage.initialize();

app.initialize(projects);