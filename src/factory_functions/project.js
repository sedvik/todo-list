import uniqid from 'uniqid';

// project prototype
const projectProto = {
    findIndexById: function(todoId) {
        const index = this.todos.findIndex(todo => {
            return todo.id === todoId
        });
        return index;
    },
    findIndexByTitle: function(todoTitle) {
        const index = this.todos.findIndex(todo => {
            return todo.title === todoTitle;
        });
        return index;
    },
    addTodo: function(newTodo) {
        this.todos.push(newTodo);
    },
    deleteTodo: function(todoId) {
        const index = this.findIndexById(todoId);
        if (index !== -1) {
            this.todos.splice(index, 1);
        }
    },
    deleteActiveTodo: function() {
        const index = this.findIndexById(this.activeTodo.id);
        if (index !== -1) {
            this.activeTodo = null;
            this.todos.splice(index, 1);
        }
    },
    setActiveTodo: function(todoId) {
        // If setActiveTodo is called with no arguments, set activeTodo to null
        if (todoId === undefined) {
            this.activeTodo = null;
        }

        const index = this.findIndexById(todoId);
        if (index !== -1) {
            this.activeTodo = this.todos[index];
        }
    }
};

// project factory function
function project(name, id) {
    const todos = [];
    let activeTodo = null;
    return Object.assign(Object.create(projectProto), {
        name,
        activeTodo,
        todos,
        id: id ? id : uniqid()
    });
}

export { project };