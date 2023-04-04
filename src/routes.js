import { randomUUID } from 'node:crypto'
import { Database } from './database.js'
import { buildRoutePath } from './utils/build-route-path.js'


const database = new Database()


export const routes = [
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { search } = req.query

            const tasks = database.select('tasks', search ? {
                title: search,
                description: search,
            } : null)
            return res.end(JSON.stringify(tasks))

        }
    },
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { title, description, } = req.body

            const task = {
                id: randomUUID(),
                title,
                description,
                completead_at: null,
                creted_at: new Date(),
                updated_at: null,
            }

            database.insert('tasks', task)

            return res.writeHead(201).end('Criação de Tarefa')
        }
    },
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params
            const { title, description } = req.body

            const tasksFinded = database.select('tasks', {
                id
            })[0]
            
            if (!tasksFinded){
                return res.writeHead(404).end()
            }

            Object.assign(tasksFinded, {title: title ? title : tasksFinded.title,
                 description: description ? description : tasksFinded.description,
                  updated_at: new Date()})

            database.update('tasks', id, tasksFinded)
            return res.writeHead(201).end('Update Completed!')
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params

            const tasksFinded = database.select('tasks', {
                id
            })[0]
            
            if (!tasksFinded){
                return res.writeHead(404).end()
            }

            database.delete('tasks', id)
            return res.writeHead(201).end('Delete')
        }
    },
    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id/complete'),
        handler: (req, res) => {
            const { id } = req.params
            

            const tasksFinded = database.select('tasks', {
                id
            })[0]
            
            if (!tasksFinded){
                return res.writeHead(404).end()
            }
        
        
            Object.assign(tasksFinded, {completead_at: tasksFinded.completead_at ? null : new Date()})

            database.update('tasks', id, tasksFinded)
            return res.writeHead(204).end()
        }
    },
]