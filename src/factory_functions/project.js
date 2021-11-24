import uniqid from 'uniqid';

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
        todos,
        id: uniqid()
    });
}

export { project };