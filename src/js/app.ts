//First thing we do is select our elements
const clear = document.getElementsByClassName("clear");
const dateElement = document.getElementById("date");
const list = document.getElementById("list");
const input = document.getElementById("input");

// //InsertAdjacentHTML

// /*
//     We need a method to add new items to our list, and keep the old ones
//     The solution is to make an insertAjacentHTML
// */

// const element = document.getElementById("element");

// //position: beforebegin, afterbegin, beforeend, afterend
// //text: something
// element?.insertAdjacentHTML()

const list = document.getElementById("list");

const CHECK = "fa-check-circle";
const UNCHECK = "fa-circle-thin";
const LINE_THROUGH = "lineThrough";


let LIST = [];
let id = 0;

// Now we need to save the todo list to local storage, localStorage.setItem("key", 'value')

let variable = localStorage.getItem('key');

localStorage.setItem("TODO", JSON.stringify(LIST));

// If this list already exists then we restore it otherwise we resume normally

let data = localStorage.getItem("TODO");

let loadToDo = function(array) {
    array.array.forEach(element => {
        addToDo(element.name, element.id, element.done, element.trash)
    });
}

if(data) {
    LIST = JSON.parse(data);
    loadToDo(LIST);
    id = LIST.length;
}
else {
    LIST = [];
    id = 0;
}

// Now we additionally want a clear function from our const clear so we make a new event listener

clear.addEventListener('click', function() {
    localStorage.clear();
    location.reload();
});

// Now we show todays date

let today = new Date();
let options = {weekday:'long', month:'short', day:'numeric'};

dateElement?.innerHTML = today.toLocaleDateString("en-US", options);

let addToDo = function(toDo, id, done, trash) {

    //For finished checked items they have an a different button class
    //Additionally for checked items they have a line through them, so we add a line class

    //Check if the item is trash, if it isn't trashed we don't need to run code
    if(trash) {
        return;
    }

    //Check if item is done and if done we use linethrough classname
    const DONE = done ? CHECK : UNCHECK;
    const LINE = done ? LINE_THROUGH : "";

    const text =
    `<li class="item">
    <i class="fa ${DONE}" job="complete" id=${id}></i>
    <p class="text ${LINE}">${toDo}</p>
    <i class="fa fa-trash-o delete" job="delete" id=${id}></i>
    </li>`;
    
    const position = "beforeend";
    
    list?.insertAdjacentHTML(position, text);

}



//Now when enter is pressed we want to add it, time to add an event listener
//When enter is pressed and it isn't empty we add it to the list and then empty the input
document.addEventListener("keyup", function(e) => {
    if(e.keyCode == 13) {
        const toDo = input?.textContent;

        if(toDo) {
            addToDo(toDo, id, false, false);

            //We need a list datastructure with name, id, done and trashed
            LIST.push(
                {
                    name: toDo,
                    id: id,
                    done: false,
                    trash: false
                }
            );

            input?.textContent = "";
            id++;
        }
    }
});

//Now if a user clicks on the fa-circle thin button we need to remove the circl-ethin class and add the checked one and add the underline
//Additioanlly we need a case to undo the todo as well fa-check needs to remove the class and add the fa-circle thin

//We need to select the element, and use classlist, if class exists we remove, otherwise if it doesn't exist we need to add it
//We need to use the .toggle(CLASS) method

let completeToDo = function(element) {
    //Updates button
    element.classList.toggle(CHECK);
    element.classList.toggle(UNCHECK);

    //Now we need to do the linethrough
    //Got to go to the parent element and find the text
    element.parentNode.querySelector(".text").classList.toggle(LINE_THROUGH);

    //Now we need to knwo the id of what element we're dealing with
    LIST[element.id].done = LIST[element.id].done ? false : true;
}

//Now time to remove a todo (deleting)

let removeToDo = function(element) {
    //We need to remove the entire element, so therefore the parent node element.parentNode.parentNode.removeCHild and remove everything there

    element.parentNode.parentNode.removeChild(element.parentNode);

    LIST[element.id].trash = true;
}

// Now we need to target an element created dynamically, the best case is to select the list element and add an event listener for each one

list?.addEventListener("click", function(event) {
    // event.target; //<i class="de fa fa-trash-o" job="delete" id="0">

    let element = event.target;
    const elementJob = event.target.attributes.job.value;

    if(elementJob == "complete") {
        completeToDo(element);
    }
    else if(elementJob == "delete") {
        removeToDo(element);
    }
});
