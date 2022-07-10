var taskIdCounter = 0;

var formEl = document.querySelector("#task-form"); 
var tasksToDoEl = document.querySelector("#tasks-to-do");
var pageContentEl = document.querySelector("#page-content");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");

var tasks = []

var taskFormHandler = function(event) { 
  event.preventDefault();
  var taskNameInput = document.querySelector("input[name='task-name']").value;
  var taskTypeInput = document.querySelector("select[name='task-type']").value;

  // check if input values are empty strings
  if (!taskNameInput || !taskTypeInput) {
    alert("You need to fill out the task form!");
    return false;
  }

  formEl.reset();

  var isEdit = formEl.hasAttribute("data-task-id");

  // package up data as an object 
  var taskDataObj = {
    name: taskNameInput,
    type: taskTypeInput,
    status: "to do"
  };

  // has data attribute, so get task id and call function to complete edit process
  if (isEdit) {
    var taskId = formEl.getAttribute("data-task-id");
    completeEditTask(taskNameInput, taskTypeInput, taskId);
  }
  // no data attribute, so create object as normal and pass to createTaskEl function
  else {
    var taskDataObj = {
      name: taskNameInput,
      type: taskTypeInput
    };
  }

  createTaskEl(taskDataObj);
  }

  var completeEditTask = function(taskName, taskType, taskId) {
    // find all matching task list item 
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    //set new valus
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    // loop through the tasks array and task object with new content
    for (var i = 0; i < tasks.length; i++) {
      if (tasks[i].id === parseInt(taskId)) {
        tasks[i].name = taskName;
        tasks[i].type = taskType;
      }
    }

    saveTasks();

    alert("Task updated!");

    formEl.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Task";
  }

  var createTaskEl = function(taskDataObj) {
    // create list item
  var listItemEl = document.createElement("li"); 
  listItemEl.className = "task-item";

  // add task id as a customer atribute 
  listItemEl.setAttribute("data-task-id", taskIdCounter);
  
  // create div to hold task info and add to list item 
  var taskInfoEl = document.createElement("div");
  // give it a class name
  taskInfoEl.className = "task-info";
  // add html content to div
  taskInfoEl.innerHTML = "<h3 class ='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
  listItemEl.appendChild(taskInfoEl);
  
  var taskActionsEl = createTaskActions(taskIdCounter);
  listItemEl.appendChild(taskActionsEl);

  // add entire list item to list 
  tasksToDoEl.appendChild(listItemEl); 

  taskDataObj.id = taskIdCounter;

  tasks.push(taskDataObj);

  saveTasks();

  // increace task counter fot next unique id
  taskIdCounter++;
  }

  var createTaskActions = function(taskId) {
    var actionContainerEl = document.createElement("div");
    actionContainerEl.classname = "task-actions";

    // create edit button
    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(editButtonEl);

    // create a delete button 
    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(deleteButtonEl);

    var statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select.status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(statusSelectEl);

    // array for options in dropdown menue
    var statusChoices = ["To Do", "In Progress", "Completed"];

    for (var i = 0; i < statusChoices.length; i++) {
      // create option element
      var statusOptionEl = document.createElement("option");
      statusOptionEl.textContent = statusChoices[i];
      statusOptionEl.setAttribute("value", statusChoices[i]);

      // append to select
      statusSelectEl.appendChild(statusOptionEl);
    }

    return actionContainerEl;
  };

  var taskButtonHandler = function(event) {
    // get target element from event
    var targetEl = event.target;

    // edit button was clicked
    if (targetEl.matches(".edit-btn")) {
      // get elements task id
      var taskId = targetEl.getAttribute("data-task-id");
      editTask(taskId);
    }
    // delete button was clicked
    else if (targetEl.matches(".delete-btn")) {
      var taskId = targetEl.getAttribute("data-task-id");
      deleteTask(taskId);
    }
  }

  var taskStatusChangeHandler = function(event) {
    // get the task items 
    var taskId = event.target.getAttribute("data-task-id");

    // get currently selected options value and convert to lowercase
    var statusValue = event.target.value.toLowerCase();

    // find the parent task item element based on the id
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    if (statusValue === "to do") {
      tasksToDoEl.appendChild(taskSelected);
    }
    else if (statusValue === "in progress") {
      tasksInProgressEl.appendChild(taskSelected);
    }
    else if (statusValue === "completed") {
      tasksCompletedEl.appendChild(taskSelected);
    }

    // update task's in tasks array
    for (var i = 0; i < tasks.length; i++) {
      if (tasks[i].id === parseInt(taskId)) {
        task[i].status = statusValue;
      }
    }

    saveTasks();
  }

  var editTask = function(taskId) {
    console.log("editing task #" + taskId)

    // get task list item element
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    // get content form task name and type
    var taskName = taskSelected.querySelector("h3.task-name").textContent;

    var taskType = taskSelected.querySelector("span.task-type").textContent;

    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;
    document.querySelector("#save-task").textContent = "Save Task";

    formEl.setAttribute("data-task-id", taskId);
  }

  var deleteTask = function(taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.remove();

    // create new array to hold updated list of tasks
    var updatedTaskArr = [];

    // loop through current tasks
    for (var i = 0; i < tasks.length; i++) {
      // if tasks[i].id doesn't match the value of taskId, let's keep that task and push it into the new array
      if (tasks[i].id !== parseInt(taskId)) {
        updatedTaskArr.push(tasks[i]);
      }
    }

    // reassign tasks array to be the same as updatedTaskArr
    tasks = updatedTaskArr;

    saveTasks();
  }

  var saveTasks = function() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  var loadTasks = function() {
    // Gets task items from localStorage.
    tasks = localStorage.getItem("tasks");
    console.log(localStorage);

    if (tasks === null) {
      tasks = [];
      return false;
    }
    // Converts tasks from the string format back into an array of objects.
    tasks = JSON.parse(tasks);
    console.log(tasks);
    // Iterates through a tasks array and creates task elements on the page from it.
    for (var i = 0; i < tasks.length; i++) {
      tasks[i].id = taskIdCounter
      console.log(tasks[i]);

      var listItemEl = document.createElement("li"); 
      listItemEl.className = "task-item";
      listItemEl.setAttribute("data-task-id", tasks[i].id);

      var taskInfoEl = document.createElement("div");
      taskInfoEl.className = "task-info";
      taskInfoEl.innerHTML = "<h3 class='task-name'>" + tasks[i].name + "</h3><span class='task-type'>" + tasks[i].type + "</span>";
      listItemEl.appendChild(taskInfoEl);

      var taskActionsEl = createTaskActions(tasks[i].id);
      listItemEl.appendChild(taskActionsEl);

      if (tasks[i].status === "to do") {
        listItemEl.querySelector("selecct[name='status-change']").selectedIndex = 0;
        tasksToDoEl.appendChild(listItemEl);
      }
      else if (tasks[i].status === "in progress") {
        listItemEl.querySelector("selecct[name='status-change']").selectedIndex = 1;
        tasksInProgressEl.appendChild(listItemEl)
      }
      else if (tasks[i].status === "completed") {
        listItemEl.querySelector("selecct[name='status-change']").selectedIndex = 2;
        tasksCompletedEl.appendChild(listItemEl)
      }
      taskIdCounter++;
      console.log(listItemEl);
    }
  }

  formEl.addEventListener("submit", taskFormHandler);
  pageContentEl.addEventListener("click", taskButtonHandler);
  pageContentEl.addEventListener("change", taskStatusChangeHandler);

  loadTasks();