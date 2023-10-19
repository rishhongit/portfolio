function DefaultDate(){
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    return `${year}-${month}-${day}`
}

function markAsComplete(e) {
    const li = e.target.parentElement;
    li.classList.toggle("completed");
}

function tasksCheck() {
    // This function checks if ul contains children or not. According to that it add or removes hidden class
    const tasksHeading = document.getElementById("heading-tasks");
    const ulElement = document.getElementById("items");
    const children = ulElement.children;


    if (children.length === 0) tasksHeading.classList.toggle("hidden")
}

document.addEventListener("DOMContentLoaded", tasksCheck);

window.onload = () => {
    const dueDateInput = document.getElementById("dueDate");
    flatpickr(dueDateInput, {
        enableTime: false, // If you want to enable time selection as well
        dateFormat: "Y-m-d", // Adjust the date format as needed
    });
    const form1 = document.querySelector("#addForm");
    const items = document.getElementById("items");
    const submit = document.getElementById("submit");
    let editItem = null;

    form1.addEventListener("submit", addItem);
    items.addEventListener("click", handleItemClick);
    const modeToggleBtn = document.getElementById('modeToggle');
    modeToggleBtn.addEventListener('click', toggleMode);
    // Add event listener for checkboxes
    const checkboxes = document.querySelectorAll(".form-check-input");
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener("change", markAsComplete);
    });
};

function toggleMode() {
    const body = document.body;
    if (body.classList.contains('dark-mode')) {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
    } else {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
    }
}
let editItem = null;

function addItem(e) {
    e.preventDefault();

    if (submit.value !== "Submit") {
        editItem.target.parentElement.childNodes[1].textContent = document.getElementById("item").value;
        submit.value = "Submit";
        document.getElementById("item").value = "";

        displaySuccessMessage("Text edited successfully");
        editItem = null;
        return false;
    }
    tasksCheck()
    const newItem = document.getElementById("item").value;
    if (!document.getElementById("dueDate").value){
        document.getElementById("dueDate").value = DefaultDate();
    }
    const dueDate = document.getElementById("dueDate").value;
    if (newItem.trim() === "") return false;
    else document.getElementById("item").value = "";

    const li = document.createElement("li");
    li.className = "list-group-item";

    dispatchEvent.className = "form-check"
    const completeCheckbox = document.createElement("input");
    completeCheckbox.type = "checkbox";
    completeCheckbox.className = "form-check-input task-completed";
    completeCheckbox.addEventListener("change", markAsComplete);

    const deleteButton = document.createElement("button");
    deleteButton.className = "btn btn-danger btn-sm float-right delete";
    deleteButton.appendChild(document.createTextNode("Delete"));

    const editButton = document.createElement("button");
    editButton.className = "btn btn-success btn-sm float-right edit";
    editButton.appendChild(document.createTextNode("Edit"));
    editButton.style.marginRight = "8px";

    // Create a click event listener for the edit button
    editButton.addEventListener("click", function (e) {
        handleEditClick(e);
    });

    // Get the current date and time
    const creationDateTime = new Date().toLocaleString();

    // Create a paragraph element to display the creation date and time
    const dateTimeParagraph = document.createElement("p");
    dateTimeParagraph.className = "text-muted";
    dateTimeParagraph.style.fontSize = "15px"; // Set font size
    dateTimeParagraph.style.margin = "0 19px"; // Set margin
    dateTimeParagraph.appendChild(document.createTextNode("Created: " + creationDateTime));

    // Create a paragraph element for the due date
    const dueDateParagraph = document.createElement("p");
    dueDateParagraph.className = "text-muted";
    dueDateParagraph.style.fontSize = "15px";
    dueDateParagraph.style.margin = "0 19px";
    dueDateParagraph.appendChild(document.createTextNode("Due Date: "));

    const dueDateSpan = document.createElement("span");
    dueDateSpan.id = "dueDateSpan"; // You can add an ID to reference it later
    dueDateSpan.style.fontWeight = "bold"; // Customize the styling as needed
    dueDateParagraph.appendChild(document.createTextNode(dueDate));
    dueDateParagraph.appendChild(dueDateSpan);

    li.appendChild(completeCheckbox);
    li.appendChild(document.createTextNode(newItem));
    li.appendChild(deleteButton);
    li.appendChild(editButton);
    li.appendChild(dateTimeParagraph);
    li.appendChild(dueDateParagraph);

    items.appendChild(li);
    document.getElementById("dueDate").value = "";
}


function handleItemClick(e) {
    if (e.target.classList.contains("delete")) {
        const li = e.target.parentElement;
        li.parentElement.removeChild(li);
        tasksCheck()
        displaySuccessMessage("Text deleted successfully");
    }
    if (e.target.classList.contains("edit")) {
        e.preventDefault();
        document.getElementById("item").value = e.target.parentElement.childNodes[1].textContent.trim();
        document.getElementById("dueDateSpan").textContent = document.getElementById("dueDate").value;
        submit.value = "EDIT";
        editItem = e;
    }
}


function toggleButton(ref, btnID) {
    document.getElementById(btnID).disabled = false;
}

function displaySuccessMessage(message) {
    document.getElementById("lblsuccess").innerHTML = message;
    document.getElementById("lblsuccess").style.display = "block";
    setTimeout(function () {
        document.getElementById("lblsuccess").style.display = "none";
    }, 3000);
}




function toggleMode() {
    const body = document.body;
    const svgIcon = document.getElementById('toggleIcon'); // Select the SVG element

    if (body.classList.contains('light-mode')) {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        svgIcon.querySelectorAll('path').forEach(path => {
            path.style.fill = '#fff'; // Change the fill color to white for dark mode
        });
    } else {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        svgIcon.querySelectorAll('path').forEach(path => {
            path.style.fill = '#000'; // Change the fill color to black for light mode
        });
    }
}
//added local storage functionallity

// Function to save tasks to local storage
function saveTasksToLocalStorage() {
    const tasks = document.querySelectorAll(".list-group-item");
    const tasksArray = [];

    tasks.forEach((task) => {
        const taskText = task.childNodes[1].textContent;
        const isCompleted = task.classList.contains("completed");
        const taskObj = { text: taskText, completed: isCompleted };
        tasksArray.push(taskObj);
    });

    localStorage.setItem("tasks", JSON.stringify(tasksArray));
}

// Function to retrieve tasks from local storage and display them
function loadTasksFromLocalStorage() {
    const tasks = JSON.parse(localStorage.getItem("tasks"));

    if (tasks) {
        tasks.forEach((task) => {
            const li = document.createElement("li");
            li.className = "list-group-item";
            
            const completeCheckbox = document.createElement("input");
            completeCheckbox.type = "checkbox";
            completeCheckbox.className = "form-check-input";
            completeCheckbox.checked = task.completed;
            completeCheckbox.addEventListener("change", markAsComplete);

            const deleteButton = document.createElement("button");
            deleteButton.className = "btn btn-danger btn-sm float-right delete";
            deleteButton.appendChild(document.createTextNode("Delete"));

            const editButton = document.createElement("button");
            editButton.className = "btn btn-success btn-sm float-right edit";
            editButton.appendChild(document.createTextNode("Edit"));
            editButton.style.marginRight = "8px";

            // Create a click event listener for the edit button
            editButton.addEventListener("click", function (e) {
                handleEditClick(e);
            });

            const dateTimeParagraph = document.createElement("p");
            dateTimeParagraph.className = "text-muted";
            dateTimeParagraph.style.fontSize = "15px";
            dateTimeParagraph.style.margin = "0 19px";
            dateTimeParagraph.appendChild(document.createTextNode("Created: " + new Date().toLocaleString()));

            li.appendChild(completeCheckbox);
            li.appendChild(document.createTextNode(task.text));
            li.appendChild(deleteButton);
            li.appendChild(editButton);
            li.appendChild(dateTimeParagraph);

            items.appendChild(li);
        });
    }
}

// Event listener for saving tasks to local storage on form submit
form1.addEventListener("submit", (e) => {
    addItem(e);
    saveTasksToLocalStorage();
});

// Event listener for loading tasks from local storage on DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
    tasksCheck();
    loadTasksFromLocalStorage();
});

// Event listener for deleting tasks and saving to local storage
items.addEventListener("click", (e) => {
    handleItemClick(e);
    saveTasksToLocalStorage();
});




function toggleMode() {
    const body = document.body;
    const svgIcon = document.getElementById('toggleIcon'); // Select the SVG element

    if (body.classList.contains('light-mode')) {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        svgIcon.querySelectorAll('path').forEach(path => {
            path.style.fill = '#fff'; // Change the fill color to white for dark mode
        });
    } else {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        svgIcon.querySelectorAll('path').forEach(path => {
            path.style.fill = '#000'; // Change the fill color to black for light mode
        });
    }
}