

// DOM Elements
const taskForm = document.getElementById('task-form');
const taskList = document.getElementById('task-list');
const filters = document.querySelectorAll('.filter-btn');
const searchInput = document.getElementById('search-input');
const editModal = document.getElementById('edit-modal');
const closeModalBtn = document.querySelector('.close-btn');
const editTaskForm = document.getElementById('edit-task-form');

// State
let tasks = [];
let editTaskId = "";
let currentFilter = 'all';

// Load tasks from localStorage on page load
document.addEventListener('DOMContentLoaded', () => {
    tasks = getTasksFromLocalStorage();
    renderTasks(tasks);
});

// Add Task Event
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newTask = {
        id: Date.now(),
        title: document.getElementById('task-title').value.trim(),
        description: document.getElementById('task-description').value.trim(),
        dueDate: document.getElementById('task-date').value,
        completed: false,
    };
    tasks.push(newTask);
    saveTasksToLocalStorage(tasks);
    renderTasks(tasks);
    taskForm.reset();
});

// Task Actions (Edit, Complete, Delete)
taskList.addEventListener('click', (e) => {
    const target = e.target;
    const taskId = parseInt(target.closest('.task-item').dataset.id);

    if (target.classList.contains('edit-btn')) {
        openEditModal(taskId);
    } else if (target.classList.contains('complete-btn')) {
        toggleTaskCompletion(taskId);
    } else if (target.classList.contains('delete-btn')) {
        deleteTask(taskId);
    }
});
// Edit Task Event
editTaskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const updatedTask = {
        id: editTaskId,
        title: document.getElementById('edit-task-title').value.trim(),
        description: document.getElementById('edit-task-description').value.trim(),
        dueDate: document.getElementById('edit-task-date').value,
        completed: tasks.find(task => task.id === editTaskId).completed,
    };
    tasks = tasks.map(task => task.id === editTaskId ? updatedTask : task);
    saveTasksToLocalStorage(tasks);
    renderTasks(tasks);
    closeModal();
});


// Open Edit Modal
function openEditModal(taskId) {
    editTaskId = taskId;
    const task = tasks.find(task => task.id === taskId);
    document.getElementById('edit-task-title').value = task.title;
    document.getElementById('edit-task-description').value = task.description;
    document.getElementById('edit-task-date').value = task.dueDate;
    editModal.style.display = 'block';
}

// Close Edit Modal
function closeModal() {
    editModal.style.display = 'none';
    editTaskForm.reset();
}

// Search Tasks
searchInput.addEventListener('input', () => {
    renderTasks(tasks);
});


// Close Modal on Close Button Click
closeModalBtn.addEventListener('click', closeModal);

// Close Modal on Outside Click
window.addEventListener('click', (e) => {
    if (e.target == editModal) {
        closeModal();
    }
});

// Toggle Task Completion
function toggleTaskCompletion(taskId) {
    tasks = tasks.map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    saveTasksToLocalStorage(tasks);
    renderTasks(tasks);
}

// Delete Task
function deleteTask(taskId) {
    if (confirm('Are you sure you want to delete this task?')) {
        tasks = tasks.filter(task => task.id !== taskId);
        saveTasksToLocalStorage(tasks);
        renderTasks(tasks);
    }
}

// Render Tasks
function renderTasks(tasksToRender) {
    let filteredTasks = tasksToRender;
    // Filter Tasks
    filters.forEach(filterBtn => {
        filterBtn.addEventListener('click', () => {
            document.querySelector('.filter-btn.active').classList.remove('active');
            filterBtn.classList.add('active');
            currentFilter = filterBtn.dataset.filter;
            renderTasks(tasks);
        });
    });
    
    
    // Apply Filter
    if (currentFilter === 'completed') {
        filteredTasks = filteredTasks.filter(task => task.completed);
    } else if (currentFilter === 'incomplete') {
        filteredTasks = filteredTasks.filter(task => !task.completed);
    }
    // Apply Search
    const searchText = searchInput.value.toLowerCase();
    if (searchText) {
        filteredTasks = filteredTasks.filter(task => 
            task.title.toLowerCase().includes(searchText) || 
            task.description.toLowerCase().includes(searchText)
        );
    }

    // Sort by Due Date
    filteredTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

    // Clear Existing Tasks
    taskList.innerHTML = '';

    // Render Task Items
    if (filteredTasks.length > 0) {
        filteredTasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.classList.add('task-item');
            taskItem.dataset.id = task.id;
            if (task.completed) taskItem.classList.add('completed');

            taskItem.innerHTML = `
                <div class="task-details">
                    <p class="task-title">${task.title}</p>
                    <p class="task-description">${task.description}</p>
                    <p class="task-date">Due: ${task.dueDate}</p>
                </div>
                <div class="task-actions">
                    <button class="complete-btn">${task.completed ? 'Undo' : 'Complete'}</button>
                    <button class="edit-btn">Edit</button>
                    <button class="delete-btn">Delete</button>
                </div>
            `;
            taskList.appendChild(taskItem);
            console.log(taskItem);
        });
    } else {
        taskList.innerHTML = '<p class="no-tasks">No tasks found.</p>';
    }
}

// Get Tasks from localStorage
function getTasksFromLocalStorage() {
    const tasksFromStorage = localStorage.getItem('tasks');
    return tasksFromStorage ? JSON.parse(tasksFromStorage) : [];
}

// Save Tasks to localStorage
function saveTasksToLocalStorage(tasksToSave) {
    localStorage.setItem('tasks', JSON.stringify(tasksToSave));
}
