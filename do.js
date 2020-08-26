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
    function getClasses(classes) {
        return String(classes).trim().split(',')
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
            'deleteItemButtonHtml'  : '',
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
            const classes = getClasses(this.renderOptions.completedItemClass)
            if (this.completed) {
                this.nodeElement.classList.add(...classes)
            }
            else {
                this.nodeElement.classList.remove(...classes)
            }

            if( typeof this.onItemChanged === 'function' ) {
                this.onItemChanged(this)
            }
        }
    
        async remove() {
            
            let deleteItem = true

            if( typeof this.beforeItemDelete === 'function' ) {
                deleteItem = await this.beforeItemDelete(this)
            }

            if( deleteItem ) {

                const classes = getClasses(this.renderOptions.deletedItemClass)
                this.nodeElement.classList.add(...classes)

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
                'class': getClasses(this.renderOptions.itemClass).join(' ').trim() + ( this.completed ? ' ' + getClasses(this.renderOptions.completedItemClass).join(' ').trim() : '' )
            })
            
            const check = createEl('input', {
                'type': 'checkbox',
                'class': getClasses(this.renderOptions.checkItemClass).join(' ').trim()
            }, {
                'checked': this.completed
            }, {
                'change': () => {
                    this.completed = check.checked
                    this.toggleComplete()
                }
            })
    
            const content = createEl('label', {
                'class': getClasses(this.renderOptions.contentItemClass).join(' ').trim()
            }, {
                'textContent': this.content
            })
            
            const deleteBtn = createEl('a', {
                'class': getClasses(this.renderOptions.deleteItemButtonClass).join(' ').trim()
            }, {
                'textContent': this.renderOptions.deleteItemButtonText
            }, {
                'click': () => this.remove()
            })
            if(this.renderOptions.deleteItemButtonHtml.trim().length){
                deleteBtn.innerHTML = this.renderOptions.deleteItemButtonHtml
            }
    
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
    
        constructor(itemsContainer, direction = 'start', itemValidator, onItemAdded, onItemChanged, beforeItemDelete, onItemDeleted) {
            
            if( typeof itemsContainer === 'string' ) {
                this.container = document.getElementById(itemsContainer)
            }
            else if( itemsContainer instanceof HTMLElement ) {
                this.container = itemsContainer
            }
            else {
                throw new Error('El contenedor de items no es válido.');
            }
            
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
    
        constructor(itemForm, itemManager, config = {}) {

            let formElement;
            if( typeof itemForm === 'string' ) {
                formElement = document.getElementById(itemForm)
            }
            else if( itemForm instanceof HTMLElement ) {
                formElement = itemForm
            }
            else {
                throw new Error('El contenedor de formulario no es válido.')
            }


            this.input = formElement.querySelector('input')
            this.button = formElement.querySelector('button')

            if( !this.input || !this.button ) {
                throw new Error('No se encontraron los elementos necesarios dentro del formulario. [input, button]')
            }

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
            itemsContainer, 
            itemForm,
            config = {},
            itemValidator,
            onItemAdded,
            onItemChanged,
            beforeItemDelete,
            onItemDeleted
        ) {
            const options = {...this.config, ...config}
            this.manager = new ItemManager(itemsContainer, options.direction, itemValidator, onItemAdded, onItemChanged, beforeItemDelete, onItemDeleted)
            this.form = new ItemForm(itemForm, this.manager, options)
        }
    
        init() {
            this.form.init()
        }
    }

    window.Do = Do
})(window, document);
