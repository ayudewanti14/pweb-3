document.addEventListener("DOMContentLoaded", () => {
  const storedTasks = JSON.parse(localStorage.getItem("tasks"));

  if (storedTasks) {
      tasks = storedTasks;
      updateTasksList();
      updateStats();
  }
});

let tasks = [];
let editingIndex = null; // Untuk menyimpan indeks tugas yang sedang diedit

const saveTask = () => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

// Fungsi untuk menampilkan notifikasi
const showNotification = (message) => {
  const notification = document.getElementById("notification");
  notification.textContent = message;
  notification.style.display = "block";
  
  setTimeout(() => {
      notification.style.display = "none";
  }, 2000);
};

const addTask = () => {
  const taskInput = document.getElementById("taskInput");
  const text = taskInput.value.trim();

  if (text) {
      tasks.push({ text: text, completed: false });
      taskInput.value = "";
      updateTasksList();
      updateStats();
      saveTask();
      showNotification("Tugas ditambahkan!");
  }
};

const toggleTaskComplete = (index) => {
  tasks[index].completed = !tasks[index].completed;
  updateTasksList();
  updateStats();
  saveTask();

  if (tasks[index].completed) {
      showNotification("Tugas selesai!");
  }
};


const deleteTask = (index) => {
  if (confirm("Apakah Anda yakin ingin menghapus tugas ini?")) {
      tasks.splice(index, 1);
      updateTasksList();
      updateStats();
      saveTask();
      showNotification("Tugas dihapus!");
  }
};

const openEditModal = (index) => {
  editingIndex = index;
  document.getElementById("editTaskInput").value = tasks[index].text;
  document.getElementById("editModal").style.display = "block";
};

const saveEditedTask = () => {
  if (editingIndex !== null) {
      tasks[editingIndex].text = document.getElementById("editTaskInput").value;
      updateTasksList();
      updateStats();
      saveTask();
      showNotification("Tugas diperbarui!");
      document.getElementById("editModal").style.display = "none";
      editingIndex = null;
  }
};

document.getElementById("saveTaskBtn").addEventListener("click", saveEditedTask);
document.getElementById("closeModal").addEventListener("click", () => {
  document.getElementById("editModal").style.display = "none";
});

const updateStats = () => {
  const completeTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? (completeTasks / totalTasks) * 100 : 0;
  const progressBar = document.getElementById("progress");

  progressBar.style.width = `${progress}%`;

  const numbersElement = document.getElementById("numbers");
  if (numbersElement) {
      numbersElement.innerText = `${completeTasks} / ${totalTasks}`;
  }

  if (tasks.length && completeTasks === totalTasks) {
      blastConfetti();
  }
};

const updateTasksList = () => {
  const taskList = document.getElementById("task-list");
  taskList.innerHTML = '';

  tasks.forEach((task, index) => {
      const listItem = document.createElement("li");

      listItem.innerHTML = `
      <div class="taskItem">
          <div class="task ${task.completed ? "completed" : ""}">
              <input type="checkbox" class="checkbox" ${
                  task.completed ? "checked" : ""
              } onchange="toggleTaskComplete(${index})"/>
              <p>${task.text}</p>
          </div>
          <div class="icons">
              <img src="edit.png" onclick="openEditModal(${index})" />
              <img src="delete.png" onclick="deleteTask(${index})" />
          </div>
      </div>    
      `;

      taskList.append(listItem);
  });
};

document.getElementById("newTask").addEventListener("click", function (e) { 
  e.preventDefault();
  addTask();
});

const blastConfetti = () => {
  const count = 200,
  defaults = { origin: { y: 0.7 } };

  function fire(particleRatio, opts) {
      confetti(
          Object.assign({}, defaults, opts, {
              particleCount: Math.floor(count * particleRatio),
          })
      );
  }

  fire(0.25, { spread: 26, startVelocity: 55 });
  fire(0.2, { spread: 60 });
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
  fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
  fire(0.1, { spread: 120, startVelocity: 45 });
};


