function createEl(tag, attributes = null, props = null, events = null) {
    const el = document.createElement(tag)
    if (attributes) {
        for (const attr in attributes) {
            el.setAttribute(attr, attributes[attr])
        }
    }
    if (props) {
        for (const prop in props) {
            el[prop] = props[prop]
        }
    }
    if (events) {
        for (const ev in events) {
            el.addEventListener(ev, events[ev])
        }
    }
    return el
}

class Task {

    name
    completed
    nodeElement

    constructor(name) {
        this.name = name
        this.completed = false
    }

    isValid() {
        return !!this.name.length
    }

    toggleComplete() {
        if (this.completed) {
            this.nodeElement.classList.add('tarea--completed')
        }
        else {
            this.nodeElement.classList.remove('tarea--completed')
        }
    }

    remove() {
        this.nodeElement.classList.add('tarea--deleted')
        setTimeout(() => this.nodeElement.remove(), 300)
        
    }

    getRender() {
        const task = createEl('div', {
            'class': 'tarea' + ( this.completed ? ' tarea--completed' : '' )
        })

        const check = createEl('input', {
            'type': 'checkbox',
            'class': 'tarea__check'
        }, {
            checked: this.completed
        }, {
            'change': () => {
                this.completed = check.checked
                this.toggleComplete()
            }
        })

        const content = createEl('label', {
            'class': 'tarea__content'
        })
        content.appendChild(document.createTextNode(this.name))
        
        const deleteBtn = createEl('button', {
            'class': 'tarea__delete'
        }, null, {
            'click': () => this.remove()
        })

        task.appendChild(check)
        task.appendChild(content)
        task.appendChild(deleteBtn)

        this.nodeElement = task

        return this.nodeElement
    }

}

class TaskManager {

    container

    constructor(taskContainerId) {
        this.container = document.getElementById(taskContainerId)
    }

    add(task) {
        if( task.isValid() )
            this.container.prepend( task.getRender() )
    }

}

class TaskForm {

    input
    button
    manager

    constructor(taskFormId, taskManager) {
        const formElement = document.getElementById(taskFormId)
        this.input = formElement.querySelector('input')
        this.button = formElement.querySelector('button')
        this.manager = taskManager
    }

    init() {
        this.button.addEventListener('click', () => this.createNewTask())
    }

    getContent() {
        return this.input.value
    }

    setContent(content) {
        this.input.value = content
    }

    createNewTask() {
        const content = this.getContent()
        this.manager.add(new Task(content))
        this.setContent('')
    }

}

class TaskApp {

    form
    manager

    constructor(taskContainerId, taskFormId) {
        this.manager = new TaskManager(taskContainerId)
        this.form = new TaskForm(taskFormId, this.manager)
    }

    init() {
        this.form.init()
    }
}

const tasksApp = new TaskApp('task_container', 'form_task')
tasksApp.init()