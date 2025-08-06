const express = require('express')
const app = express()
const PORT = 8000;

app.set("view engine","ejs")
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))

let todos = [];

// GET: Show todo list
app.get('/', (req, res) => {
  const filter = req.query.priority || "";
  res.render('index', {todos, filter} )
})

app.post("/", (req, res) => {
  const task = req.body.task?.trim();
  const priority = req.body.priority || "Medium";

  if (task) {
    todos.push({text: task,priority})
  }
  
  res.redirect("/")
})

app.post("/delete", (req, res) => {
  const index = req.body.index;
  if(index !== undefined) {
    todos.splice(index, 1)
  }
  res.redirect("/")
})

app.get("/edit", (req, res) => {
  const index = req.query.index;
  const todo = todos[index];

  res.render("edit", { todo, index })
})

app.post("/edit", (req, res) => {
  const index = req.body.index;
  const updatedTask = req.body.updatedTask.trim();
  const updatedPriority = req.body.updatedPriority || "Medium";

  if (updatedTask && todos[index]) {
    todos[index].text = updatedTask;
    todos[index].priority = updatedPriority;
  }

  res.redirect("/");
})

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})