const items = []

function updateItemsCounter() {
    let counter = 0

    items.forEach((i) => {
        if(!i.completed) counter++
    })

    document.querySelector('.counter').innerHTML = `${counter} item${ counter === 1 ? '' : 's' } left`
}

// On item added
const onItemAdded = (item) => {
    items.push(item);
    updateItemsCounter();
}

// Before item delete
const beforeItemDelete = (item) => {
    item.completed = true
    return true
}

// onItemDeleted
const onItemDeleted = (item) => updateItemsCounter()

// Item changed
const onItemChanged = (item) => {
    console.log(`${item.content} has changed to ${item.completed}`)
    updateItemsCounter()
}

const tasksApp = new Do('task_container', 'form_task', 
        {
            'itemClass'             : 'item--enter flex items-center px-4 py-2 shadow-md bg-white border-t',
            'checkItemClass'        : 'mr-4 -ml-4 appearance-none w-10 h-12 outline-none',
            'contentItemClass'      : 'flex-1 text-gray-700 text-2xl item__content leading-8',
            'deleteItemButtonClass' : 'item__delete hidden text-3xl text-gray-500 cursor-pointer px-2 leading-none',
            'deleteItemButtonText'  : '', // It will be change with css pseudo element
            'direction'             : 'end',
        }
    )

// Create item on press enter key
tasksApp.form.input.addEventListener('keyup', (ev) => {
    if(ev.keyCode === 13) {
        tasksApp.form.createNewItem()
    }
})

tasksApp.manager.onItemAdded = onItemAdded
tasksApp.manager.onItemChanged = onItemChanged
tasksApp.manager.beforeItemDelete = beforeItemDelete
tasksApp.manager.onItemDeleted = onItemDeleted

tasksApp.init()