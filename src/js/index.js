'use strict'

/*
{
    id: случайное число (в https контексте может быть uuid из webcrypto api),
    username: имя пользователя
    description: описание
    timestamp: время создания
    // можно добавить время обновления
    status: состояние объекта 
}
*/
let todoList = [];
let activeTodoId = -1;
const TODOStatus = { INITIATED: 0, INPROGRESS: 1, DONE: 2 };

const randomInt = (min, max) => Math.floor(Math.random() * (max - min)) + min;

// здесь можно сохранять состояния todo списка
const updateStorage = () => {

}

const updateVisuals = () => {
    const todoEntries = todoList.filter(entry => entry.status == TODOStatus.INITIATED);
    const inprogressEntries = todoList.filter(entry => entry.status == TODOStatus.INPROGRESS);
    const doneEntries = todoList.filter(entry => entry.status == TODOStatus.DONE);

    document.getElementById("todo-count").innerText = todoEntries.length;
    document.getElementById("inprogress-count").innerText = inprogressEntries.length;
    document.getElementById("done-count").innerText = doneEntries.length;

   
    document.getElementById("todo-nothing").style.display = todoEntries.length == 0 ? "flex" : "none";
    document.getElementById("inprogress-nothing").style.display = inprogressEntries.length == 0 ? "flex" : "none";
    document.getElementById("done-nothing").style.display = doneEntries.length == 0 ? "flex" : "none";

    // простой способ обновления, можно улучишить, но кода будет значительно больше
    // 1
    const todoContent = document.getElementById("todo-content");
    todoContent.innerHTML = ""; // чистим все элементы
    todoContent.style.display = todoEntries.length == 0 ? "none" : "block";
    todoEntries.forEach(entry => {
        const template = document.getElementById("todo-template");
        const nelement = template.cloneNode(true);

        nelement.id = entry.id;

        const usernameEl = nelement.getElementsByTagName("h3");
        const descriptionEl = nelement.getElementsByTagName("div");
        const timestampEl = nelement.getElementsByTagName("time");

        const date = new Date(entry.timestamp);

        usernameEl[0].innerHTML = entry.username;
        descriptionEl[0].innerHTML = entry.description;
        timestampEl[0].innerHTML = date.toLocaleDateString() + " " + date.toLocaleTimeString();

        todoContent.appendChild(nelement);
    });

    // 2
    const inprogressContent = document.getElementById("inprogress-content");
    inprogressContent.innerHTML = ""; // чистим все элементы
    inprogressContent.style.display = inprogressEntries.length == 0 ? "none" : "block";
    inprogressEntries.forEach(entry => {
        const template = document.getElementById("inprogress-template");
        const nelement = template.cloneNode(true);

        nelement.id = entry.id;

        const usernameEl = nelement.getElementsByTagName("h3");
        const descriptionEl = nelement.getElementsByTagName("div");
        const timestampEl = nelement.getElementsByTagName("time");

        const date = new Date(entry.timestamp);

        usernameEl[0].innerHTML = entry.username;
        descriptionEl[0].innerHTML = entry.description;
        timestampEl[0].innerHTML = date.toLocaleDateString() + " " + date.toLocaleTimeString();

        inprogressContent.appendChild(nelement);
    });

    // 3
    const doneContent = document.getElementById("done-content");
    doneContent.innerHTML = ""; // чистим все элементы
    doneContent.style.display = doneEntries.length == 0 ? "none" : "block";
    doneEntries.forEach(entry => {
        const template = document.getElementById("done-template");
        const nelement = template.cloneNode(true);

        nelement.id = entry.id;

        const usernameEl = nelement.getElementsByTagName("h3");
        const descriptionEl = nelement.getElementsByTagName("div");
        const timestampEl = nelement.getElementsByTagName("time");

        const date = new Date(entry.timestamp);

        usernameEl[0].innerHTML = entry.username;
        descriptionEl[0].innerHTML = entry.description;
        timestampEl[0].innerHTML = date.toLocaleDateString() + " " + date.toLocaleTimeString();

        doneContent.appendChild(nelement);
    });
}

// create todo
// string, string
const createTODO = (username, description) => {
    todoList.push({
        id: randomInt(1000000000, 9999999999),
        username: username,
        description: description,
        timestamp: Date.now(),
        status: TODOStatus.INITIATED
    });

    updateStorage();
    updateVisuals();
}

// update TODO, если username или description == null игнорирует обновление этих параметров
// number, TODOStatus, string | null, string | null
const updateTODO = (todoId, todoStatus, username, description) => {
    const todos = todoList.filter(entry => entry.id == todoId);
    if (todos.length != 1) return;

    const todo = todos[0];

    todo.status = todoStatus;
    if (username != null)
        todo.username = username;
    if (description != null)
        todo.description = description;

    updateStorage();
    updateVisuals();
}

// remove todo
// number
const removeTODO = (todoId) => {
    todoList = todoList.filter(entry => entry.id != todoId);

    updateStorage();
    updateVisuals();
}

const deleteAll = () => {
    todoList = [];

    updateStorage();
    updateVisuals();
}

/* ui */

// number
const editTODO = (todoId) => {
    activeTodoId = todoId;

    const currentTodo = todoList.filter(entry => entry.id == activeTodoId);

    if (currentTodo.length == 0) return;
    const todo = currentTodo[0];

    document.getElementById("edit-modal-username").value = todo.username;
    document.getElementById("edit-modal-description").value = todo.description;

    show(['modal-wrapper', 'edit-todo-modal'])
}

// unset value from input field
// string or string[]
const cleanupFields = (fields) => {
    if (typeof fields === "string") {
        const domEl = document.getElementById(fields);
        domEl.value = "";
    } else
        fields.forEach(entry => cleanupFields(entry));
}

// get value of input
// string
const getValue = (id) => document.getElementById(id).value;

// hide element from dom
// string or string[]
const hide = (id) => {
    if (typeof id === "string") {
        const domEl = document.getElementById(id);
        domEl.style.zIndex = -1;
        domEl.style.opacity = 0;
    } else
        id.forEach(entry => hide(entry));
}

// show dom element
// string or string[]
const show = (id) => {
    if (typeof id === "string") {
        const domEl = document.getElementById(id);
        domEl.style.zIndex = 10000;
        domEl.style.opacity = 1;
    } else
        id.forEach(entry => show(entry));
}