"use strict";
// Select the Elements
var clear = document.querySelector(".clear");
var dateElement = document.getElementById("date");
var list = document.getElementById("list");
var input = document.getElementById("input");
// Classes names
var CHECK = "fa-check-circle";
var UNCHECK = "fa-circle-thin";
var LINE_THROUGH = "lineThrough";
// Variables
var LIST, id;
// get item from localstorage
var data = localStorage.getItem("TODO");
// check if data is not empty
if (data) {
    LIST = JSON.parse(data);
    id = LIST.length;
    loadList(LIST);
}
else {
    // if data isn't empty
    LIST = [];
    id = 0;
}
// load items to the user's interface
var loadList = function (array) {
    array.array.forEach(function (item) {
        addToDo(item.name, item.id, item.done, item.trash);
    });
};
// clear the local storage
clear.addEventListener("click", function () {
    localStorage.clear();
    location.reload();
});
// Show todays date
var options = { weekday: "long", month: "short", day: "numeric" };
var today = new Date();
dateElement.innerHTML = today.toLocaleDateString("en-US", options);
// add to do function
function addToDo(toDo, id, done, trash) {
    if (trash) {
        return;
    }
    var DONE = done ? CHECK : UNCHECK;
    var LINE = done ? LINE_THROUGH : "";
    var item = "<li class=\"item\">\n                    <i class=\"fa " + DONE + " co\" job=\"complete\" id=\"" + id + "\"></i>\n                    <p class=\"text " + LINE + "\">" + toDo + "</p>\n                    <i class=\"fa fa-trash-o de\" job=\"delete\" id=\"" + id + "\"></i>\n                  </li>\n                ";
    var position = "beforeend";
    list.insertAdjacentHTML(position, item);
}
// add an item to the list user the enter key
document.addEventListener("keyup", function (even) {
    if (event.keyCode == 13) {
        var toDo = input.value;
        // if the input isn't empty
        if (toDo) {
            addToDo(toDo, id, false, false);
            LIST.push({
                name: toDo,
                id: id,
                done: false,
                trash: false
            });
            // add item to localstorage ( this code must be added where the LIST array is updated)
            localStorage.setItem("TODO", JSON.stringify(LIST));
            id++;
        }
        input.value = "";
    }
});
// complete to do
var completeToDo = function (element) {
    element.classList.toggle(CHECK);
    element.classList.toggle(UNCHECK);
    element.parentNode.querySelector(".text").classList.toggle(LINE_THROUGH);
    LIST[element.id].done = LIST[element.id].done ? false : true;
};
// remove to do
var removeToDo = function (element) {
    element.parentNode.parentNode.removeChild(element.parentNode);
    LIST[element.id].trash = true;
};
// target the items created dynamically
list.addEventListener("click", function (event) {
    var element = event.target; // return the clicked element inside list
    var elementJob = element.attributes.job.value; // complete or delete
    if (elementJob == "complete") {
        completeToDo(element);
    }
    else if (elementJob == "delete") {
        removeToDo(element);
    }
    // add item to localstorage ( this code must be added where the LIST array is updated)
    localStorage.setItem("TODO", JSON.stringify(LIST));
});
