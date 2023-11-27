document.getElementById('task-input').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        addTask();
    }
});

function generateUniqueId() {
    return 'task-' + Math.random().toString(36).substr(2, 9);
}

function makeTaskDraggable(task) {
    task.setAttribute('draggable', true);
    task.ondragstart = function(event) {
        event.dataTransfer.setData("text/plain", event.target.id);
        task.classList.add('dragging');
    };
    task.ondragend = function() {
        task.classList.remove('dragging');
    };
}

function updateTaskAppearance(task, columnId) {
    console.log("Updating appearance for task in column:", columnId);

    var taskText = task.querySelector(".task-text-container span");
    var statusSpan = task.querySelector('.status');

    if (!taskText || !statusSpan) {
        console.error("Required elements not found in task:", task);
        return; // Exit the function if elements are not found
    }
    // Update column taks counts
    updateColumnTaskCounts();
    //Apply styles and update status text based on the column
    switch (columnId) {
        case 'working-on-list':
            applyStyles(taskText, statusSpan, 'italic', 'green', ' (in progress...)');
            break;
        case 'complete-list':
            applyStyles(taskText, statusSpan, 'italic', 'lightgrey', ' (complete)');
            break;
        default:
            // For the "To Do" column or any other column, reset to default styles
            applyStyles(taskText, statusSpan, 'normal', '#333333', '');
            break;
    }
}

function applyStyles(taskText, statusSpan, fontStyle, color, statusText) {
    if (taskText && statusSpan) {
        taskText.style.fontStyle = fontStyle;
        statusSpan.style.fontStyle = fontStyle;
        taskText.style.color = color;
        statusSpan.style.color = color;
        statusSpan.textContent = statusText;
    } else {
        console.error("Required elements not found:", taskText, statusSpan);
    }
}

// Function to update task counts in each column
function updateColumnTaskCounts() {
    var todoCount = document.getElementById('tasks-list').children.length;
    var workingOnCount = document.getElementById('working-on-list').children.length;
    var completeCount = document.getElementById('complete-list').children.length;

    document.getElementById('todo-title').textContent = `To Do (${todoCount})`;
    document.getElementById('working-on-title').textContent = `Working On (${workingOnCount})`;
    document.getElementById('complete-title').textContent = `Complete (${completeCount})`;
}


function createTaskElement(taskContent, priority) {
    // Basic setup for task div
    var taskDiv = document.createElement("div");
    taskDiv.className = 'task';
    taskDiv.id = generateUniqueId();
    taskDiv.classList.add(`priority-${priority}`);

        // Important: Make the task draggable here or call makeTaskDraggable(taskDiv) if defined
    taskDiv.setAttribute('draggable', true);
    taskDiv.addEventListener('dragstart', handleDragStart);
    taskDiv.addEventListener('dragend', handleDragEnd);
    makeTaskDraggable(taskDiv);

    // Task text container
    var textContainer = document.createElement("span");
    textContainer.className = 'task-text-container';
    taskDiv.appendChild(textContainer);

    // Task text and status
    var taskText = document.createElement("span");
    taskText.textContent = taskContent;
    textContainer.appendChild(taskText);
    var statusSpan = document.createElement("span");
    statusSpan.className = 'status';
    textContainer.appendChild(statusSpan);

    // Editable title input
    var editTitleInput = document.createElement("input");
    editTitleInput.type = "text";
    editTitleInput.value = taskContent;
    editTitleInput.className = "edit-title";
    editTitleInput.style.display = "none";
    taskDiv.appendChild(editTitleInput);

    // Priority section setup
    var prioritySection = document.createElement("div");
    prioritySection.className = "priority-section";
    prioritySection.style.display = 'none';
    var priorityLabel = document.createElement("label");
    priorityLabel.textContent = "Priority:";
    priorityLabel.htmlFor = `priority-${taskDiv.id}`;
    priorityLabel.className = "priority-label";
    prioritySection.appendChild(priorityLabel);
    var priorityDropdown = document.createElement("select");
    priorityDropdown.className = "task-priority-dropdown";
    priorityDropdown.innerHTML = `
        <option value="" disabled selected>Set Priority</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>`;
    prioritySection.appendChild(priorityDropdown);
    taskDiv.appendChild(prioritySection);

    // Sub-tasks container (initially hidden)
    var subTasksContainer = document.createElement("div");
    subTasksContainer.className = "sub-tasks-container";
    subTasksContainer.style.width = "100%";
    subTasksContainer.style.backgroundColor = "white";
    subTasksContainer.style.border = "1px solid lightgrey";
    subTasksContainer.style.padding = "10px";
    subTasksContainer.style.boxSizing = "border-box";
    subTasksContainer.style.display = "none";
    taskDiv.appendChild(subTasksContainer);

    // Editable comment textarea
    var editCommentTextarea = document.createElement("textarea");
    editCommentTextarea.className = "edit-comment";
    editCommentTextarea.placeholder = "Insert comment here";
    editCommentTextarea.style.display = "none";
    taskDiv.appendChild(editCommentTextarea);

    // Save edit button
    var saveEditBtn = document.createElement("button");
    saveEditBtn.textContent = "Save";
    saveEditBtn.className = "save-edit-btn";
    saveEditBtn.style.display = "none";
    saveEditBtn.onclick = function() { saveEdit(taskDiv); };
    taskDiv.appendChild(saveEditBtn);

    // Task buttons container
    var buttonsContainer = document.createElement("div");
    buttonsContainer.className = 'task-buttons-container';
    taskDiv.appendChild(buttonsContainer);

    // Edit and delete buttons
    var editBtn = document.createElement("button");
    editBtn.innerHTML = "&#9998;";
    editBtn.className = "edit-btn";
    editBtn.onclick = function() { editTask(taskDiv); };
    buttonsContainer.appendChild(editBtn);

    var deleteBtn = document.createElement("button");
    deleteBtn.textContent = "X";
    deleteBtn.className = "delete-btn";
    deleteBtn.onclick = function() {
        taskDiv.remove(); // Remove the task
        // Update task counts after deleting the task
        updateColumnTaskCounts();
    };
    buttonsContainer.appendChild(deleteBtn);

    return taskDiv;
}






function addTask() {
    var input = document.getElementById('task-input');
    var priority = document.getElementById('task-priority').value;
    var newTask = input.value.trim();

    // Check if task input is empty
    if (!newTask) {
        var taskElement = createTaskElement(newTask, priority);
        alert("Please enter a task.");
        return; // Exit the function early
    }

    // Check if priority is not set
    if (!priority) {
        alert("Please set a priority for the task.");
        return; // Exit the function early
    }

    // If both checks pass, proceed with task addition
    document.getElementById("tasks-list").appendChild(createTaskElement(newTask, priority));
    input.value = '';
    document.getElementById('task-priority').value = ''; // Reset priority

        // Update column taks counts
        updateColumnTaskCounts();
}



function editTask(taskDiv) {
    // Enter edit mode
    taskDiv.classList.add("edit-mode");

    // Make editable fields and sub-tasks container visible
    taskDiv.querySelector(".edit-title").style.display = "block";
    taskDiv.querySelector(".edit-comment").style.display = "block";
    taskDiv.querySelector(".save-edit-btn").style.display = "block";

    // Show the priority section
    var prioritySection = taskDiv.querySelector(".priority-section");
    prioritySection.style.display = "flex";

    // Set the value of the priority dropdown
    var priorityDropdown = taskDiv.querySelector('.task-priority-dropdown');
    var currentPriority = Array.from(taskDiv.classList).find(cls => cls.startsWith('priority-'))?.split('-')[1];
    priorityDropdown.value = currentPriority || "";

    // Sub-tasks container
    var subTasksContainer = taskDiv.querySelector(".sub-tasks-container");
    subTasksContainer.style.display = "block";

    // Check if the "+ sub-task" link already exists, if not, create it
    var addSubTaskLink = subTasksContainer.querySelector(".add-sub-task-link");
    if (!addSubTaskLink) {
        addSubTaskLink = document.createElement("span");
        addSubTaskLink.textContent = "+ sub-task";
        addSubTaskLink.className = "add-sub-task-link";
    }

    // Ensure the sub-task input container exists
    var subTaskInputContainer = subTasksContainer.querySelector(".sub-task-input-container");
    if (!subTaskInputContainer) {
        subTaskInputContainer = createSubTaskInputContainer(subTasksContainer);
    }

    // Append or re-append the "+ sub-task" link
    subTasksContainer.appendChild(addSubTaskLink);
    addSubTaskLink.style.display = "block"; // Ensure it's visible

    // Event listener for the "+ sub-task" link
    addSubTaskLink.onclick = function() {
        this.style.display = "none";
        subTaskInputContainer.style.display = "block";
        subTaskInputContainer.querySelector(".sub-task-input").focus();
    };

    // Hide non-editable elements
    taskDiv.querySelector(".task-text-container").style.display = "none";
    taskDiv.querySelector(".task-buttons-container").style.display = "none";
}

function createSubTaskInputContainer(subTasksContainer) {
    // Create and return the sub-task input container and its elements
    var subTaskInputContainer = document.createElement("div");
    subTaskInputContainer.className = "sub-task-input-container";
    subTaskInputContainer.style.display = "none";

    var subTaskInput = document.createElement("input");
    subTaskInput.type = "text";
    subTaskInput.className = "sub-task-input";
    subTaskInput.style.width = "100%"; // Set the input's width to 100%
    subTaskInputContainer.appendChild(subTaskInput);

    var addSubTaskBtn = document.createElement("button");
    addSubTaskBtn.innerHTML = "+";
    addSubTaskBtn.className = "add-sub-task-btn";
    subTaskInputContainer.appendChild(addSubTaskBtn);

    // Style the container to position the button inside the input
    subTaskInputContainer.style.position = "relative";
    subTaskInput.style.paddingRight = "30px"; // Make space for the button
    addSubTaskBtn.style.position = "absolute";
    addSubTaskBtn.style.right = "5px";
    addSubTaskBtn.style.top = "50%";
    addSubTaskBtn.style.transform = "translateY(-50%)";

    subTasksContainer.appendChild(subTaskInputContainer);

    // "+ sub-task" hyperlink
    var addSubTaskLink = document.createElement("span");
    addSubTaskLink.textContent = "+ sub-task";
    addSubTaskLink.className = "add-sub-task-link";
    subTasksContainer.appendChild(addSubTaskLink);

    // Function to add sub-task
    function addSubTask() {
        var subTaskInputContainer = subTasksContainer.querySelector(".sub-task-input-container");
        var subTaskInput = subTaskInputContainer.querySelector(".sub-task-input");
    
        if (subTaskInput.value.trim()) {
            var subTaskDiv = document.createElement("div");
            subTaskDiv.className = "sub-task";
            subTaskDiv.style.display = "flex";
            subTaskDiv.style.justifyContent = "space-between";
            subTaskDiv.style.width = "100%";
    
            var subTaskText = document.createElement("span");
            subTaskText.textContent = subTaskInput.value.trim();
            subTaskText.style.flexGrow = 1;
            subTaskDiv.appendChild(subTaskText);
    
            var editSubTaskBtn = document.createElement("button");
            editSubTaskBtn.innerHTML = "&#9998;";
            editSubTaskBtn.className = "edit-btn";
            subTaskDiv.appendChild(editSubTaskBtn);
    
            var deleteSubTaskBtn = document.createElement("button");
            deleteSubTaskBtn.textContent = "X";
            deleteSubTaskBtn.className = "delete-btn";
            subTaskDiv.appendChild(deleteSubTaskBtn);
    
            subTasksContainer.insertBefore(subTaskDiv, subTaskInputContainer);
            subTaskInput.value = "";
    
            addSubTaskLink.style.display = "block";
            subTaskInputContainer.style.display = 'none';
    
            editSubTaskBtn.addEventListener("click", function() {
                editSubTask(subTaskDiv);
            });
    
            deleteSubTaskBtn.addEventListener("click", function() {
                subTaskDiv.remove();
            });
        }
    }
    
    function editSubTask(subTaskDiv) {
        var subTaskText = subTaskDiv.querySelector("span").textContent;
        var subTaskInput = document.createElement("input");
        subTaskInput.type = "text";
        subTaskInput.value = subTaskText;
        subTaskInput.className = "sub-task-edit-input";
    
        // Replace the text span with the input
        subTaskDiv.replaceChild(subTaskInput, subTaskDiv.querySelector("span"));

        // Create a container for the save button to maintain layout
        var buttonContainer = document.createElement("div");
        buttonContainer.className = "sub-task-button-container";
    
        // Temporary save button for the edited sub-task
        var saveEditBtn = document.createElement("button");
        saveEditBtn.textContent = "Save";
        saveEditBtn.className = "save-edit-sub-task-btn";
        buttonContainer.appendChild(saveEditBtn);
        subTaskDiv.appendChild(buttonContainer);
    
        // Hide edit and delete buttons during editing
        var editBtn = subTaskDiv.querySelector(".edit-btn");
        var deleteBtn = subTaskDiv.querySelector(".delete-btn");
        if (editBtn) editBtn.style.display = "none";
        if (deleteBtn) deleteBtn.style.display = "none";
    
        // Event listener for the save button
        saveEditBtn.addEventListener("click", function() {
        var updatedText = subTaskInput.value.trim();
        if (updatedText) {
            var newTextSpan = document.createElement("span");
            newTextSpan.textContent = updatedText;
            newTextSpan.style.flexGrow = 1; // Ensure text span takes available space
            subTaskDiv.replaceChild(newTextSpan, subTaskInput);

            // Restore edit and delete buttons
            if (editBtn) editBtn.style.display = "inline-block";
            if (deleteBtn) deleteBtn.style.display = "inline-block";
            subTaskDiv.removeChild(buttonContainer); // Remove the temporary save button container
        } else {
            // Handle empty input, possibly revert changes
        }
    });

        // Enable saving the edited sub-task by pressing Enter
        subTaskInput.addEventListener("keypress", function(e) {
            if (e.key === 'Enter') {
                saveEditBtn.click();
            }
        });
    
        }
    
        // Make sure to add the logic for calling editSubTask in the edit button event listener for each sub-task.
    

        // Event listener for the "+" button and Enter key to add sub-tasks
        addSubTaskBtn.addEventListener("click", addSubTask);
        subTaskInput.addEventListener("keypress", function(e) {
        if (e.key === 'Enter') addSubTask();
        });

        // Event listener for the "+ sub-task" link
        addSubTaskLink.addEventListener("click", function() {
        addSubTaskLink.style.display = "none";
        subTaskInputContainer.style.display = "block";
        subTaskInput.focus();
        });

        // Hide non-editable elements
        taskDiv.querySelector(".task-text-container").style.display = "none";
        taskDiv.querySelector(".task-buttons-container").style.display = "none";
}









function saveEdit(taskDiv) {
    // Exit edit mode
    taskDiv.classList.remove("edit-mode");
    var editedTitle = taskDiv.querySelector(".edit-title").value;
    var priorityDropdown = taskDiv.querySelector('.task-priority-dropdown');
    const newPriority = priorityDropdown.value;

    // Update the task text and priority
    taskDiv.querySelector(".task-text-container span").textContent = editedTitle;
    taskDiv.className = `task priority-${newPriority}`;

    // Reset visibility of elements
    taskDiv.querySelector(".edit-title").style.display = "none";
    taskDiv.querySelector(".edit-comment").style.display = "none";
    taskDiv.querySelector(".save-edit-btn").style.display = "none";
    taskDiv.querySelector(".task-text-container").style.display = "flex";
    taskDiv.querySelector(".task-buttons-container").style.display = "flex";

    // Hide the priority section
    var prioritySection = taskDiv.querySelector(".priority-section");
    if (prioritySection) {
        prioritySection.style.display = 'none';
    }

    // Hide sub-tasks container
    var subTasksContainer = taskDiv.querySelector(".sub-tasks-container");
    if (subTasksContainer) {
        subTasksContainer.style.display = 'none';
    }

    // Hide sub-task input container and reset its content
    var subTaskInputContainer = taskDiv.querySelector(".sub-task-input-container");
    if (subTaskInputContainer) {
        subTaskInputContainer.style.display = 'none';
        var subTaskInput = subTaskInputContainer.querySelector(".sub-task-input");
        if (subTaskInput) {
            subTaskInput.value = "";
        }
    }

    // Show "+ sub-task" link if it was hidden
    var addSubTaskLink = taskDiv.querySelector(".add-sub-task-link");
    if (addSubTaskLink) {
        addSubTaskLink.style.display = "block";
    }
}


// Attach event listeners to task containers for dragover and drop
Array.from(document.getElementsByClassName("task-container")).forEach(container => {
    container.addEventListener('dragover', handleDragOver);
    container.addEventListener('drop', handleDrop);
    container.addEventListener('dragenter', () => container.classList.add('column-highlight'));
    container.addEventListener('dragleave', () => container.classList.remove('column-highlight'));
});

// Call this function on page load and after adding new tasks
attachDragListenersToTasks();

// Attach drag listeners to tasks
function attachDragListenersToTasks() {
    Array.from(document.getElementsByClassName("task")).forEach(task => {
        task.setAttribute('draggable', true);
        task.addEventListener('dragstart', handleDragStart);
        task.addEventListener('dragend', handleDragEnd);
    });
}

let placeholder = null;

function handleDragStart(e) {
    e.target.classList.add('dragging');
    placeholder = document.createElement('div');
    placeholder.className = 'drag-placeholder';
    e.target.parentNode.insertBefore(placeholder, e.target.nextSibling);
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
    if (placeholder) {
        placeholder.remove();
        placeholder = null;
    }
}

function handleDragOver(e) {
    e.preventDefault();
    const container = e.currentTarget;
    const afterElement = getDragAfterElement(container, e.clientY);
    if (afterElement) {
        container.insertBefore(placeholder, afterElement);
    } else {
        // Append placeholder at the end if no afterElement is found
        container.appendChild(placeholder);
    }
}

function handleDrop(e) {
    e.preventDefault();
    const data = e.dataTransfer.getData("text/plain");
    const task = document.getElementById(data);
    if (task && placeholder.parentNode === e.currentTarget) {
        placeholder.parentNode.insertBefore(task, placeholder);
    }
    e.currentTarget.classList.remove('column-highlight');
    if (placeholder) {
        placeholder.remove();
        placeholder = null;
    }
    // Update task counts after moving the task
    updateColumnTaskCounts();
}



function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.task:not(.dragging)')];
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// CSS for .drag-placeholder and .dragging should be defined as per your design requirements

// Initialize drag and drop
attachDragListenersToTasks();





