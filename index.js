const express = require('express')
const app = express()
const PORT = 3233

app.set("view engine", "ejs")
app.use(express.urlencoded({extended: true}))
app.use(express.static("public"))

let tasks = []
let editIndex = -1;
let error = "";

// Get Todo List
app.get('/', (req, res) => {
  res.render("list", {tasks, editIndex, error})
  error = ''
})

app.post('/', (req, res) => {
  const task = req.body.task?.trim();
  const priority = req.body.priority;

  const duplicate = tasks.some(t => t.text === task && t.priority === priority)
  if (duplicate ) {
    error="This task already exists!"
    return res.redirect("/")
  }

  if (task && priority) {
    tasks.push({text: task, priority})
  }
  res.redirect("/")
  editIndex = -1
})

app.post('/delete', (req, res) => {
  const deleteIndex = req.body.deleteIndex;
  if (deleteIndex !== undefined) {
    tasks.splice(deleteIndex, 1)
  }
  editIndex = -1
  res.redirect('/')
})

app.post("/start-edit", (req, res) => {
  editIndex = Number(req.body.editIndex);
  res.redirect('/')
})

app.post('/edit', (req, res) => {
  const updatedTask = req.body.updatedIndex?.trim();
  const updatedPriority = req.body.updatedPriority;
  if (updatedTask && updatedPriority && editIndex !== -1) {
    tasks[editIndex] = {
      text: updatedTask,
      priority: updatedPriority
    }
  }
  editIndex = -1
  res.redirect('/')
})

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})