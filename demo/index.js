// Custom item validator
const itemValidator = async (item) => {

    let valid = false
    if( !item.content.trim().length )
        alert('Please write someting')
    else
        valid = true

    return valid
}

// On item added
const onItemAdded = (item) => {
    console.log(`Item added: ${item.content}`);
}

// After item delete
const afterItemDelete = (item) => {
    return confirm(`Really do you wanna delete: ${item.content}?`)
}

// onItemDeleted
const onItemDeleted = (item) => {
    alert(`item deleted.`)
}

// Item changed
const onItemChanged = (item) => {
    console.log(`${item.content} has changed to ${item.completed}`)
}

const tasksApp = new Do('task_container', 'form_task', 
        {
            'itemClass'             : 'item--enter flex items-center border-2 rounded-bl-lg rounded-tr-lg border-indigo-700 px-4 py-3 mb-3 shadow-lg',
            'checkItemClass'        : 'item__check mr-4 cursor-pointer appearance-none border w-6 h-6 rounded-full flex items-center justify-center outline-none',
            'contentItemClass'      : 'flex-grow text-indigo-700 item__content',
            'deleteItemButtonClass' : 'ml-4 text-sm text-gray-500 cursor-pointer',
            'deleteDelay'           : 300
        },
        itemValidator,
        onItemAdded,
        onItemChanged,
        afterItemDelete,
        onItemDeleted
    )

// Create item on press enter key
tasksApp.form.input.addEventListener('keyup', (ev) => {
    if(ev.keyCode === 13) {
        tasksApp.form.createNewItem()
    }
})

/**
tasksApp.manager.itemValidator = itemValidator
tasksApp.manager.onItemAdded = onItemAdded
tasksApp.manager.onItemChanged = onItemChanged
tasksApp.manager.afterItemDelete = afterItemDelete
tasksApp.manager.onItemDeleted = onItemDeleted
*/

tasksApp.init()