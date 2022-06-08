const userModalBtn = document.querySelector(".user"),
   userModalBtnClose = document.querySelector(".account-user__close"),
   selectModalBtn = document.querySelector(".select__button"),
   selectList = document.querySelector(".select__list"),
   selectItems = document.querySelectorAll(".select__item"),
   checkBox = document.querySelectorAll(".item__box"),
   userModal = document.querySelector(".account-user"),
   taskList = document.querySelector(".todo-list__items"),
   addBtn = document.querySelector(".todo-list__input-btn"),
   inputValue = document.querySelector("#input");

let tasks;
let tasksFromApi;

let mode = "all";

let toDoItems = [];

!localStorage.tasks
   ? (tasks = [])
   : (tasks = JSON.parse(localStorage.getItem("tasks")));

function filterApi() {
   let taskWithOutApi = [];
   tasks.forEach((_, index) => {
      if (!tasks[index].save) {
         taskWithOutApi.push(tasks[index]);
      }
   });
   tasks = taskWithOutApi;
}

filterApi();

const fetchDataList = async () => {
   try {
      const result = await fetch(`https://jsonplaceholder.typicode.com/todos`);
      const data = await result.json();
      const newData = data.slice(0, 5);
      newData.forEach((_, index) => {
         tasks.push(new Task(data[index].title, true));
      });
   } catch (err) {
      throw new Error(err);
   }
   pushToLocalStore();
   addTasks();
};

fetchDataList();

function Task(description, save) {
   this.description = description;
   this.check = false;
   this.save = save;
}

const newTask = (task, index) => {
   return `
   <div class="todo__list-item item  ${task.check ? "done" : ""}">
      <button class="item__checkbox">
         <input onclick="check(${index})" class="checkbox" type="checkbox" ${
      task.check ? "checked" : ""
   }>
         <label></label>
      </button>
      <p>${task.description}</p>
      <button onclick="deleteItem(${index})"  class="item__close">
         <img src="./img/icons/close.svg">
      </button>
   </div>
   `;
};


function filter() {
   if (mode === "all") {
      toDoItems.forEach((_, index) => {
         toDoItems[index].classList.remove("hidden");
      });
   } else if (mode === "unactive") {
      toDoItems.forEach((_, index) => {
         toDoItems[index].classList.remove("hidden");
      });
      tasks.forEach((_, index) => {
         if (!tasks[index].check) {
            toDoItems[index].classList.add("hidden");
         }
      });
   } else if (mode === "active") {
      toDoItems.forEach((_, index) => {
         toDoItems[index].classList.remove("hidden");
      });
      tasks.forEach((_, index) => {
         if (tasks[index].check) {
            toDoItems[index].classList.add("hidden");
         }
      });
   }
}

function switchList(e) {
   selectItems.forEach((_, index) => {
      selectItems[index].classList.remove("active");
   });
   e.classList.add("active");
}

function onlyActive() {
   switchList(event.currentTarget);
   document.getElementById("select").innerHTML = "В работе";
   mode = "active";
   addTasks();
   modalSelect();
}

function allItems() {
   switchList(event.currentTarget);
   document.getElementById("select").innerHTML = "Все";
   mode = "all";
   addTasks();
   modalSelect();
}

function onlyUnActive() {
   switchList(event.currentTarget);
   document.getElementById("select").innerHTML = "Выполненные";
   mode = "unactive";
   addTasks();
   modalSelect();
}

function addTasks() {
   taskList.innerHTML = "";
   if (tasks.length > 0) {
      tasks.forEach((item, index) => {
         taskList.innerHTML += newTask(item, index);
      });
   }
   toDoItems = document.querySelectorAll(".item");
   filter();
}

const pushToLocalStore = () => {
   localStorage.setItem("tasks", JSON.stringify(tasks));
};

function check(index) {
   tasks[index].check = !tasks[index].check;
   if (tasks[index].check) {
      toDoItems[index].classList.add("done");
   } else {
      toDoItems[index].classList.remove("done");
   }
   pushToLocalStore();
   addTasks();
}

function deleteItem(index) {
   toDoItems[index].classList.add("delete");
   setTimeout(() => {
      tasks.splice(index, 1);
      pushToLocalStore();
      addTasks();
   }, 300);
}

function modalSelect() {
   selectList.classList.toggle("active");
   selectModalBtn.classList.toggle("active");
}

selectModalBtn.addEventListener("click", () => {
   modalSelect();
});


addBtn.addEventListener("click", () => {
   if (inputValue.value.trim().length) {
      tasks.unshift(new Task(inputValue.value, false));
      inputValue.value = "";
      pushToLocalStore();
      addTasks();
   }
});
document.addEventListener("keydown", (e) => {
   if (e.keyCode === 13 && inputValue.value.trim().length) {
      tasks.unshift(new Task(inputValue.value, false));
      inputValue.value = "";
      pushToLocalStore();
      addTasks();
   }
});



addTasks();

window.deleteItem = deleteItem;
window.check = check;
window.allItems = allItems;
window.onlyUnActive  = onlyUnActive ;
window.onlyActive  = onlyActive ;
