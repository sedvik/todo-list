import { todo } from './todo.js';

// project prototype
const projectProto = {
    addTodo: function(title, description, dueDate, priority) {
        const newTodo = todo(title, description, dueDate, priority);
        this.todos.push(newTodo);
    },
    deleteTodo: function(todoTitle) {
        const index = this.todos.findIndex(todo => {
            return todo.title === todoTitle;
        });
        this.todos.splice(index, 1);
    },
};

// project factory function
function project(name) {
    const todos = [];
    return Object.assign(Object.create(projectProto), {
        name,
        todos
    });
}

export { project };