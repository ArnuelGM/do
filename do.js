(function (window, document) {


    if( window.Do ) {
        return
    }

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
        validator

        renderOptions = {
            'taskClass'             : 'tarea',
            'completedTaskClass'    : 'tarea--completed',
            'deletedTaskClass'      : 'tarea--deleted',
            'checkTaskClass'        : 'tarea__check',
            'contentTaskClass'      : 'tarea__content',
            'deleteButtonTaskClass' : 'tarea__delete',
            'deleteButtonTaskText'  : 'Delete',
            'deleteDelay'           : 0
        }
    
        constructor(name, completed = false, renderOptions = {}, taskValidator = null) {
            this.name = name
            this.completed = completed
            this.validator = taskValidator
            this.setRenderOptions(renderOptions)
        }

        setRenderOptions(options = {}) {
            this.renderOptions = {...this.renderOptions, ...options}
        }
    
        isValid() {
            if( typeof this.validator === 'function' ) {
                return !!this.validator(this)
            }

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
            this.nodeElement.classList.add(this.renderOptions.deletedTaskClass)
            setTimeout(() => this.nodeElement.remove(), this.renderOptions.deleteDelay)
        }
    
        getRender() {
            const task = createEl('div', {
                'class': this.renderOptions.taskClass + ( this.completed ? ' ' + this.renderOptions.completedTaskClass : '' )
            })
    
            const check = createEl('input', {
                'type': 'checkbox',
                'class': this.renderOptions.checkTaskClass
            }, {
                'checked': this.completed
            }, {
                'change': () => {
                    this.completed = check.checked
                    this.toggleComplete()
                }
            })
    
            const content = createEl('p', {
                'class': this.renderOptions.contentTaskClass
            }, {
                'textContent': this.name
            })
            
            const deleteBtn = createEl('a', {
                'class': this.renderOptions.deleteButtonTaskClass
            }, {
                'textContent': this.renderOptions.deleteButtonTaskText
            }, {
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
        direction
    
        constructor(taskContainerId, direction = 'start') {
            this.container = document.getElementById(taskContainerId)
            this.setDirection(direction)
        }

        setDirection(direction) {
            switch (direction) {
                case 'start':
                case 'end':
                    this.direction = direction
                    break
            
                default:
                    this.direction = 'start'
                    break
            }
        }
    
        add(task) {
            if( task.isValid() ) {
                if( this.direction === 'end' )
                    this.container.appendChild( task.getRender() )
                else
                    this.container.prepend( task.getRender() )
            } 
        }
    
    }
    
    class TaskForm {
    
        input
        button
        manager
        taskRenderOptions = {}
        taskValidator
    
        constructor(taskFormId, taskManager, taskRenderOptions = {}, taskValidator = null) {
            const formElement = document.getElementById(taskFormId)
            this.input = formElement.querySelector('input')
            this.button = formElement.querySelector('button')
            this.manager = taskManager
            this.taskRenderOptions = {...this.taskRenderOptions, ...taskRenderOptions}
            this.taskValidator = taskValidator
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
            const task = new Task(content, null, this.taskRenderOptions, this.taskValidator)
            this.manager.add(task)
            this.setContent('')
            return task
        }
    
    }
    
    class Do {
    
        form
        manager
        config = {}
    
        constructor(taskContainerId, taskFormId, config = {}) {
            this.config = {...this.config, ...config}
            this.manager = new TaskManager(taskContainerId, this.config.addDirection)
            this.form = new TaskForm(taskFormId, this.manager, this.config)
        }
    
        init() {
            this.form.init()
        }
    }

    window.Do = Do
})(window, document);
