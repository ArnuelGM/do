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
    
    class Item {
    
        content
        completed
        nodeElement
        validator

        renderOptions = {
            'itemClass'             : 'item',
            'completedItemClass'    : 'item--completed',
            'deletedItemClass'      : 'item--deleted',
            'checkItemClass'        : 'item__check',
            'contentItemClass'      : 'item__content',
            'deleteItemButtonClass' : 'item__delete',
            'deleteItemButtonText'  : 'Delete',
            'deleteDelay'           : 0
        }
    
        constructor(content, completed = false, renderOptions = {}, itemValidator = null) {
            this.content = content
            this.completed = completed
            this.validator = itemValidator
            this.setRenderOptions(renderOptions)
        }

        setRenderOptions(options = {}) {
            this.renderOptions = {...this.renderOptions, ...options}
        }
    
        isValid() {
            if( typeof this.validator === 'function' ) {
                return !!this.validator(this)
            }

            return !!this.content.length
        }
    
        toggleComplete() {
            if (this.completed) {
                this.nodeElement.classList.add(this.renderOptions.completedItemClass)
            }
            else {
                this.nodeElement.classList.remove(this.renderOptions.completedItemClass)
            }
        }
    
        remove() {
            this.nodeElement.classList.add(this.renderOptions.deletedItemClass)
            setTimeout(() => this.nodeElement.remove(), this.renderOptions.deleteDelay)
        }
    
        getRender() {
            const item = createEl('div', {
                'class': this.renderOptions.itemClass + ( this.completed ? ' ' + this.renderOptions.completedItemClass : '' )
            })
    
            const check = createEl('input', {
                'type': 'checkbox',
                'class': this.renderOptions.checkItemClass
            }, {
                'checked': this.completed
            }, {
                'change': () => {
                    this.completed = check.checked
                    this.toggleComplete()
                }
            })
    
            const content = createEl('label', {
                'class': this.renderOptions.contentItemClass
            }, {
                'textContent': this.content
            })
            
            const deleteBtn = createEl('a', {
                'class': this.renderOptions.deleteItemButtonClass
            }, {
                'textContent': this.renderOptions.deleteItemButtonText
            }, {
                'click': () => this.remove()
            })
    
            item.appendChild(check)
            item.appendChild(content)
            item.appendChild(deleteBtn)
    
            this.nodeElement = item
    
            return this.nodeElement
        }
    
    }
    
    class ItemManager {
    
        container
        direction
    
        constructor(itemsContainerId, direction = 'start') {
            this.container = document.getElementById(itemsContainerId)
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
    
        add(item) {
            if( item.isValid() ) {
                if( this.direction === 'end' )
                    this.container.appendChild( item.getRender() )
                else
                    this.container.prepend( item.getRender() )
            } 
        }
    
    }
    
    class ItemForm {
    
        input
        button
        manager
        itemRenderOptions = {}
        itemValidator
    
        constructor(itemFormId, itemManager, itemRenderOptions = {}, itemValidator = null) {
            const formElement = document.getElementById(itemFormId)
            this.input = formElement.querySelector('input')
            this.button = formElement.querySelector('button')
            this.manager = itemManager
            this.itemRenderOptions = {...this.itemRenderOptions, ...itemRenderOptions}
            this.itemValidator = itemValidator
        }
    
        init() {
            this.button.addEventListener('click', () => this.createNewItem())
        }

        getContent() {
            return this.input.value
        }

        setContent(content) {
            this.input.value = content
        }

        createNewItem() {
            const content = this.getContent()
            const item = new Item(content, null, this.itemRenderOptions, this.itemValidator)
            this.manager.add(item)
            this.setContent('')
            return item
        }
    
    }

    class Do {  
    
        form
        manager
        config = {}
    
        constructor(itemsContainerId, itemFormId, config = {}) {
            this.config = {...this.config, ...config}
            this.manager = new ItemManager(itemsContainerId, this.config.direction)
            this.form = new ItemForm(itemFormId, this.manager, this.config)
        }
    
        init() {
            this.form.init()
        }
    }

    window.Do = Do
})(window, document);
