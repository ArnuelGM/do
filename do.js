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

        beforeItemDelete
        onItemDeleted
        onItemChanged

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
    
        constructor(content, completed = false, renderOptions = {}) {
            this.content = content
            this.completed = completed
            this.setRenderOptions(renderOptions)
        }

        setRenderOptions(options = {}) {
            this.renderOptions = {...this.renderOptions, ...options}
        }
    
        toggleComplete() {
            if (this.completed) {
                this.nodeElement.classList.add(this.renderOptions.completedItemClass)
            }
            else {
                this.nodeElement.classList.remove(this.renderOptions.completedItemClass)
            }

            if( typeof this.onItemChanged === 'function' ) {
                this.onItemChanged(this)
            }
        }
    
        async remove() {
            
            let deleteItem = true;

            if( typeof this.beforeItemDelete === 'function' ) {
                deleteItem = await this.beforeItemDelete(this)
            }

            if( deleteItem ) {

                this.nodeElement.classList.add(this.renderOptions.deletedItemClass)
    
                setTimeout(() => {
                    this.nodeElement.remove();
                    if( typeof this.onItemDeleted === 'function' ) {
                        this.onItemDeleted(this)
                    }
                }, this.renderOptions.deleteDelay)
            }
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

        itemValidator

        onItemAdded
        beforeItemDelete
        onItemDeleted
        onItemChanged
    
        constructor(itemsContainerId, direction = 'start', itemValidator, onItemAdded, onItemChanged, beforeItemDelete, onItemDeleted) {
            this.container = document.getElementById(itemsContainerId)
            
            this.setDirection(direction)

            this.onItemAdded = onItemAdded
            this.beforeItemDelete = beforeItemDelete
            this.onItemDeleted = onItemDeleted
            this.onItemChanged = onItemChanged

            this.setItemValidator(itemValidator)
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

        setItemValidator(validator) {
            if( typeof validator === 'function' ) {
                this.itemValidator = validator
            }
            else {
                this.itemValidator = this._getDefaultItemValidator()
            }
        }

        _getDefaultItemValidator() {
            const validator = (item) => {
                return item.content.length > 0
            }
            return validator
        }

        async add(item) {

            let isValid = await this.itemValidator(item)

            if( isValid ) {

                item.onItemChanged = this.onItemChanged
                item.beforeItemDelete = this.beforeItemDelete
                item.onItemDeleted = this.onItemDeleted

                if( this.direction === 'end' ) {
                    this.container.appendChild( item.getRender() )
                }
                else {
                    this.container.prepend( item.getRender() )
                }

                if( typeof this.onItemAdded === 'function' ) {
                    this.onItemAdded(item)
                }
            }
        }
    
    }
    
    class ItemForm {

        input
        button
        manager
        config = {}
    
        constructor(itemFormId, itemManager, config = {}) {
            const formElement = document.getElementById(itemFormId)
            this.input = formElement.querySelector('input')
            this.button = formElement.querySelector('button')
            this.manager = itemManager
            this.config = {...this.config, ...config}
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

        setConfig(config) {
            this.config = {...this.config, ...config}
        }

        createNewItem() {
            const content = this.getContent()
            const item = new Item(content, null, this.config)
            this.manager.add(item)
            this.setContent('')
            return item
        }
    
    }

    class Do {
    
        form
        manager
    
        constructor(
            itemsContainerId, 
            itemFormId,
            config = {},
            itemValidator,
            onItemAdded,
            onItemChanged,
            beforeItemDelete,
            onItemDeleted
        ) {
            const options = {...this.config, ...config}
            this.manager = new ItemManager(itemsContainerId, options.direction, itemValidator, onItemAdded, onItemChanged, beforeItemDelete, onItemDeleted)
            this.form = new ItemForm(itemFormId, this.manager, options)
        }
    
        init() {
            this.form.init()
        }
    }

    window.Do = Do
})(window, document);
