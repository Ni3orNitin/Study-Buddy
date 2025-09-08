// Get HTML elements
const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');

// Load tasks from localStorage on page load
document.addEventListener('DOMContentLoaded', loadTasks);

addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Add a new task
function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText !== "") {
        const li = document.createElement('li');
        li.textContent = taskText;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'X';
        deleteBtn.className = 'delete-btn';
        li.appendChild(deleteBtn);

        taskList.appendChild(li);
        taskInput.value = '';

        saveTasks();
    }
}

// Handle task clicks (complete or delete)
taskList.addEventListener('click', (e) => {
    if (e.target.tagName === 'LI') {
        e.target.classList.toggle('completed');
        saveTasks();
    } else if (e.target.classList.contains('delete-btn')) {
        e.target.parentElement.remove();
        saveTasks();
    }
});

// Save tasks to localStorage
function saveTasks() {
    const tasks = [];
    for (const li of taskList.children) {
        tasks.push({
            text: li.textContent.replace('X', '').trim(),
            completed: li.classList.contains('completed')
        });
    }
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasks() {
    const savedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (savedTasks) {
        savedTasks.forEach(task => {
            const li = document.createElement('li');
            li.textContent = task.text;
            if (task.completed) {
                li.classList.add('completed');
            }

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'X';
            deleteBtn.className = 'delete-btn';
            li.appendChild(deleteBtn);

            taskList.appendChild(li);
        });
    }
}