let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentDateFilter = 'all';

const taskInput = document.getElementById('taskInput');
const dateInput = document.getElementById('taskDate');
const timeInput = document.getElementById('taskTime');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');

addTaskBtn.addEventListener('click', function() {
    const text = taskInput.value.trim();
    const date = dateInput.value;
    const time = timeInput.value;

    if (!text) {
        alert('Please enter a task description');
        return;
    }
    if (!date) {
        alert('Please select a date');
        return;
    }
    if (!time) {
        alert('Please select a time');
        return;
    }

    const newTask = {
        id: Date.now(),
        text: text,
        date: date,
        time: time,
        completed: false
    };

    tasks.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(tasks));

    taskInput.value = '';
    dateInput.value = '';
    timeInput.value = '';

    renderTasks();
    updateDateList();
});

function renderTasks() {
    taskList.innerHTML = '';
    
    let filteredTasks = tasks;
    if (currentDateFilter !== 'all') {
        filteredTasks = tasks.filter(task => task.date === currentDateFilter);
    }

    const sortedTasks = [...filteredTasks].sort((a, b) => {
        if (a.completed === b.completed) {
            return new Date(`${a.date} ${a.time}`) - new Date(`${b.date} ${b.time}`);
        }
        return a.completed ? 1 : -1;
    });

    if (sortedTasks.length === 0) {
        taskList.innerHTML = '<li class="no-tasks">No tasks found</li>';
        return;
    }

    sortedTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = task.completed ? 'task-item completed' : 'task-item';
        
        li.innerHTML = `
            <div class="task-content">
                <input type="checkbox" 
                    class="task-checkbox" 
                    ${task.completed ? 'checked' : ''}
                    onchange="toggleComplete(${task.id})">
                <span class="task-text">${task.text}</span>
                <span class="task-datetime">${formatDateTime(task.date, task.time)}</span>
            </div>
            <div class="task-actions">
                <button onclick="editTask(${task.id})" class="edit-btn">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteTask(${task.id})" class="delete-btn">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        taskList.appendChild(li);
    });
}

function toggleComplete(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    }
}

function deleteTask(id) {
    if (confirm('Are you sure you want to delete this task?')) {
        tasks = tasks.filter(task => task.id !== id);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
        updateDateList();
    }
}

function editTask(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const newText = prompt('Edit task:', task.text);
    const newDate = prompt('Edit date (YYYY-MM-DD):', task.date);
    const newTime = prompt('Edit time (HH:MM):', task.time);

    if (newText !== null && newText.trim() !== '') {
        task.text = newText.trim();
        if (newDate && isValidDate(newDate)) task.date = newDate;
        if (newTime && isValidTime(newTime)) task.time = newTime;
        
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
        updateDateList();
    }
}

function formatDateTime(date, time) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date(date).toLocaleDateString(undefined, options);
    return `${formattedDate} at ${time}`;
}

function updateDateList() {
    const dateList = document.getElementById('dateList');
    const dates = [...new Set(tasks.map(task => task.date))].sort();
    
    let html = `
        <div class="date-item ${currentDateFilter === 'all' ? 'active' : ''}" 
             onclick="filterByDate('all')">
            All Tasks
        </div>
    `;
    
    dates.forEach(date => {
        html += `
            <div class="date-item ${currentDateFilter === date ? 'active' : ''}"
                 onclick="filterByDate('${date}')">
                ${new Date(date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
            </div>
        `;
    });
    
    dateList.innerHTML = html;
}

function filterByDate(date) {
    currentDateFilter = date;
    renderTasks();
    updateDateList();
}

function isValidDate(dateString) {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
}

function isValidTime(timeString) {
    return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(timeString);
}

document.addEventListener('DOMContentLoaded', () => {
    renderTasks();
    updateDateList();
});

document.getElementById('themeToggle').addEventListener('click', () => {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});
