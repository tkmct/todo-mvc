import TodoController from './controllers/TodoController.js'

const main = () => TodoController.render()

window.addEventListener('load', main, false)
