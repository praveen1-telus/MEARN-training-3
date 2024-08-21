document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-button');
    const taskList = document.getElementById('task-list');

    const addTaskToDOM = (task) => {
        const li = document.createElement('li');
        const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.addEventListener('change', () => {
                    if (checkbox.checked) {
                        li.classList.add('completed');
                    } else {
                        li.classList.remove('completed');
                    }
                });

                const span = document.createElement('span');
                span.textContent = task;



        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => {
            li.remove();
        });

        li.addEventListener('click', () => {
            li.classList.toggle('completed');
        });
        li.appendChild(span);
        li.appendChild(checkbox);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    };

    addTaskBtn.addEventListener('click', () => {
        const task = taskInput.value;
        if (task === '') {
            alert('Please enter a task');
            return;
        }
        addTaskToDOM(task);
        taskInput.value = '';
    });
});