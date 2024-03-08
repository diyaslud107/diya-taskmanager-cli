const readlineSync = require('readline-sync');
const chalk = require('chalk');
const fs = require('fs');
const tasksFile = 'tasks.json';

// Load existing tasks
let tasks = [];
if (fs.existsSync(tasksFile)) {
    tasks = JSON.parse(fs.readFileSync(tasksFile));
}

function saveTasks() {
    fs.writeFileSync(tasksFile, JSON.stringify(tasks, null, 2));
}

function addTask() {
    const task = readlineSync.question('Enter your task: ');
    tasks.push({ task, completed: false });
    saveTasks();
    console.log(chalk.green('Task added successfully.'));
}

function listTasks() {
    if (tasks.length === 0) {
        console.log(chalk.yellow('No tasks found.'));
        return;
    }

    tasks.forEach((task, index) => {
        console.log(`${index + 1}. ${task.completed ? chalk.strikethrough(task.task) : task.task}`);
    });
}

function toggleTaskCompletion() {
    listTasks();
    const taskNumber = readlineSync.questionInt('Enter task number to toggle completion (or 0 to cancel): ');
    if (taskNumber > 0 && taskNumber <= tasks.length) {
        tasks[taskNumber - 1].completed = !tasks[taskNumber - 1].completed;
        saveTasks();
        console.log(chalk.blue('Task status updated.'));
    }
}

function deleteTask() {
    listTasks();
    const taskNumber = readlineSync.questionInt('Enter task number to delete (or 0 to cancel): ');
    if (taskNumber > 0 && taskNumber <= tasks.length) {
        tasks.splice(taskNumber - 1, 1);
        saveTasks();
        console.log(chalk.red('Task deleted.'));
    }
}

function mainMenu() {
    console.log(chalk.cyan('\nTask Manager'));
    const choices = ['Add task', 'List tasks', 'Toggle task completion', 'Delete task', 'Exit'];
    const index = readlineSync.keyInSelect(choices, 'Choose an option:');
    switch (index) {
        case 0:
            addTask();
            break;
        case 1:
            listTasks();
            break;
        case 2:
            toggleTaskCompletion();
            break;
        case 3:
            deleteTask();
            break;
        case 4:
            console.log(chalk.magenta('Goodbye!'));
            process.exit();
    }
}

while (true) {
    mainMenu();
}
