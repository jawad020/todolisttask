const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

// In-memory storage for tasks
let tasks = [];
let idCounter = 1;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as templating engine
app.set('view engine', 'ejs');

// Routes

// Render the main page with all tasks
app.get('/', (req, res) => {
    res.render('index', { tasks });
});

// Get all tasks
app.get('/api/tasks', (req, res) => {
    res.json(tasks);
});

// Add a new task
app.post('/api/tasks', (req, res) => {
    try {
        const { taskName } = req.body;
        if (!taskName) {
            return res.status(400).json({ message: 'Task name is required' });
        }

        const newTask = {
            _id: idCounter++,
            taskName,
            completed: false,
            createdAt: new Date()
        };

        tasks.push(newTask);
        res.status(201).json(newTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update a task
app.put('/api/tasks/:id', (req, res) => {
    try {
        const { id } = req.params;
        const { taskName, completed } = req.body;
        
        const taskIndex = tasks.findIndex(task => task._id === parseInt(id));
        if (taskIndex === -1) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (taskName !== undefined) {
            tasks[taskIndex].taskName = taskName;
        }
        if (completed !== undefined) {
            tasks[taskIndex].completed = completed;
        }

        res.json(tasks[taskIndex]);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a task
app.delete('/api/tasks/:id', (req, res) => {
    try {
        const { id } = req.params;
        const initialLength = tasks.length;
        tasks = tasks.filter(task => task._id !== parseInt(id));

        if (tasks.length === initialLength) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
