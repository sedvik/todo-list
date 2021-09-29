# todo-list
The Odin Project - Todo List project implementation

This todo list application has the following features:

1. Projects - Multiple todos can be housed within a project. Projects may be created, selected, or deleted from the sidebar.
2. Todos - Individual todo items that are represented with a title, description, due date, and a priority of either low, mid, or high.
3. Created todo cards within a project are highlighted with green, yellow, or red corresponding to the priority levels of low, mid, and high.
4. Todos may be clicked on so that edits can be made. To save todo edits, the save button must be clicked.
5. Once a todo is expanded, the checkbox in the upper-left corner can be clicked to toggle todo completion.
6. Project and todo data persist across site visits through the use of browser local storage.

This application was created to practice the following:

1. Single-responsibility OOP principle. For example, individual module files in the /src/modules folder each have a distinct job and are not tightly coupled together as in previous projects.
2. Using factory functions for projects and todos, which included placing methods within their respective prototypes.
2. In order to loosely-couple different modules, a simple publish-subscribe module was introduced.  