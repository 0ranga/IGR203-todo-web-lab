let todoElements = [];

async function getJson(url){
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

function importTasks() {
    getJson("media/todo.json").then(data => {
        populateTodo(data);
        data.forEach(element => {
            createTodo(element.label, element.finished);
        });
        populateTodo();
    });
}

function createTodo(label, finished=false){
    if (todoElements.some(el => el.firstElementChild.firstElementChild.id == label) || label=="") {
        return;
    }

    localStorage.setItem(label, finished);

    let oneTodo = document.createElement('div');
    oneTodo.className = "todo";
    oneTodo.innerHTML = `
    <p><input type="checkbox" id="${label}" ${finished ? "checked" : ""} onclick="saveTodo('${label}', this.checked)"/> <label for="${label}">${label}</label></p>
    <!-- <img src="trash.svg" alt="trash icon" onclick="removeTodo(this)" /> --!>
    <svg alt="trash icon" onclick="removeTodo(this)">
        <use xlink:href="/trash.svg#trash"></use>
    </svg>
    `;
    todoElements.unshift(oneTodo);
    return oneTodo;
}

function removeTodo(el){
    let toRemove = el.parentElement;
    localStorage.removeItem(el.parentElement.firstElementChild.firstElementChild.id);
    todoElements = todoElements.filter(item => {
        return item !== toRemove;
    });
    document.querySelector("div.added").removeChild(toRemove);
}

function removeCompleted(){
    let elementsToRemove = todoElements.filter(item => {
        return item.firstElementChild.firstElementChild.checked;
    });
    elementsToRemove.forEach(el => removeTodo(el.firstElementChild));
}

function saveTodo(label, finished){
    localStorage.setItem(label, finished);
}

function populateTodo(){ 
    todoElements.forEach(el => document.querySelector("div.added").appendChild(el));
}

function addTodo(event) {
    if (event.key !== "Enter") return;
    const input = document.getElementById("addTodo");
    createTodo(input.value);
    populateTodo();
    input.value = "";
}

document.getElementById("addTodo").onkeyup = addTodo;

Object.keys(localStorage).forEach((key) => {
    createTodo(key, JSON.parse(localStorage.getItem(key)));
});
populateTodo();