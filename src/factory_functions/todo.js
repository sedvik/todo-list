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
    }
};

// todo factory function
function todo(title, description, dueDate, priority) {
    return Object.assign(Object.create(todoProto), {
        title,
        description,
        dueDate,
        priority
    });
}

export { todo };