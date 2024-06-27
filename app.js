const express = require('express')
const path = require('path')
const sqlite3 = require('sqlite3')
const {open} = require('sqlite')
const {format} = require('date-fns')
var isValid = require('date-fns/isValid')
const app = express()
app.use(express.json())

let db
const dbPath = path.join(__dirname, 'todoApplication.db')

// initializing server and db
const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server is Running...')
    })
  } catch (e) {
    console.log(`DB Error: ${e.message}`)
    process.exit(1)
  }
}
initializeDbAndServer()

const isPriorityValid = priority => {
  const prioritiesCategories = ['HIGH', 'MEDIUM', 'LOW']
  return prioritiesCategories.includes(priority)
}

const isStatusValid = status => {
  const statusCategories = ['TO DO', 'IN PROGRESS', 'DONE']
  return statusCategories.includes(status)
}

const isCategoryValid = category => {
  const categoryCategories = ['WORK', 'HOME', 'LEARNING']
  return categoryCategories.includes(category)
}

//API 1

app.get('/todos/', async (request, response) => {
  const {
    search_q = '',
    priority = '',
    status = '',
    category = '',
  } = request.query
  const getFilteredTodosQuery = `
    SELECT id, todo, priority, status, category, due_date as dueDate
    FROM
        todo
    WHERE
        todo LIKE "%${search_q}%" AND
        priority like "%${priority}%" and
        status like "%${status}%" and
        category like "%${category}%" ;`
  const filteredTodos = await db.all(getFilteredTodosQuery)
  if (priority !== '' && isPriorityValid(priority) === false) {
    response.status(400)
    response.send('Invalid Todo Priority')
  } else if (status !== '' && isStatusValid(status) === false) {
    response.status(400)
    response.send('Invalid Todo Status')
  } else if (category !== '' && isCategoryValid(category) === false) {
    response.status(400)
    response.send('Invalid Todo Category')
  } else {
    response.send(filteredTodos)
  }
})

//API 2
app.get('/todos/:todoId', async (request, response) => {
  const {todoId} = request.params
  const getSpecificTodo = `
  select 
      id, todo, priority, status, category, due_date as dueDate
  from 
    todo
  where
    id = ${todoId}; `
  const specificTodo = await db.get(getSpecificTodo)
  response.send(specificTodo)
})

//API 3
app.get('/agenda/', async (request, response) => {
  const {date} = request.query
  const result = isValid(new Date(date))
  if (result) {
    const formatedDate = format(new Date(date), 'yyyy-MM-dd')
    const getAgendaQuery = `
      select
        id, todo, priority, status, category, due_date as dueDate
      from
        todo
      where
        due_date  = '${formatedDate}';`
    const agendaTodos = await db.all(getAgendaQuery)
    response.send(agendaTodos)
  } else {
    response.status(400)
    response.send('Invalid Due Date')
  }
})

//API 4
app.post('/todos/', async (request, response) => {
  const {id, todo, priority, status, category, dueDate} = request.body
  const dateValidity = isValid(new Date(dueDate))
  if (priority !== '' && isPriorityValid(priority) === false) {
    response.status(400)
    response.send('Invalid Todo Priority')
  } else if (status !== '' && isStatusValid(status) === false) {
    response.status(400)
    response.send('Invalid Todo Status')
  } else if (category !== '' && isCategoryValid(category) === false) {
    response.status(400)
    response.send('Invalid Todo Category')
  } else if (dateValidity === false) {
    response.status(400)
    response.send('Invalid Due Date')
  } else {
    console.log('all entries are valid!')
    const formatedDate = format(new Date(dueDate), 'yyyy-MM-dd')
    const createTodoQuery = `
    insert into todo(id, todo, priority, status, category, due_date)
    values (${id}, '${todo}', '${priority}', '${status}', '${category}', '${formatedDate}'); `
    await db.run(createTodoQuery)
    response.send('Todo Successfully Added')
  }
})

//API 5
app.put('/todos/:todoId/', async (request, response) => {
  const {todoId} = request.params
  const {todo, priority, status, category, dueDate} = request.body
  const updateStatus = `
  update todo set status = '${status}' where id = ${todoId}; `
  const updatePriority = `
  update todo set priority = '${priority}' where id = ${todoId}; `
  const updateTodo = `
  update todo set todo = '${todo}' where id = ${todoId}; `
  const updateCategory = `
  update todo set category = '${category}' where id = ${todoId}; `

  console.log(request.body)
  if (priority !== undefined && isPriorityValid(priority) === false) {
    response.status(400)
    response.send('Invalid Todo Priority')
  }
  if (priority !== undefined && isPriorityValid(priority) === true) {
    await db.run(updatePriority)
    response.send('Priority Updated')
  }
  if (todo !== undefined ) {
    await db.run(updateTodo)
    response.send('Todo Updated')
  }
  if (status !== undefined && isStatusValid(status) === false) {
    response.status(400)
    response.send('Invalid Todo Status')
  }
  if (status !== undefined && isStatusValid(status) === true) {
    await db.run(updateStatus)
    response.send('Status Updated')
  }
  if (category !== undefined && isCategoryValid(category) === false) {
    response.status(400)
    response.send('Invalid Todo Category')
  }
  if (category !== undefined && isCategoryValid(category) === true) {
    await db.run(updateCategory)
    response.send('Category Updated')
  }
  if (dueDate !== undefined) {
    const dateValidity = isValid(new Date(dueDate))
    if (dateValidity === false) {
      response.status(400)
      response.send('Invalid Due Date')
    }
  }
  if (dueDate !== undefined) {
    const dateValidity = isValid(new Date(dueDate))
    if (dateValidity === true) {
      const formatedDate = format(new Date(dueDate), 'yyyy-MM-dd')
      const updateDueDate = `
      update todo set due_date = '${formatedDate}' where id = ${todoId}; `
      await db.run(updateDueDate)
      response.send('Due Date Updated')
    }
  }
})

//API 6
app.delete('/todos/:todoId/', async (request, response) => {
  const {todoId} = request.params
  const deleteTodoQuery = `
  delete from todo where id = ${todoId}; `
  await db.run(deleteTodoQuery)
  response.send('Todo Deleted')
})

module.exports = app
