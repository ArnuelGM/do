const tasksApp = new Do('task_container', 'form_task', {
    'itemClass': 'flex items-center border-2 rounded-bl-lg rounded-tr-lg border-indigo-700 px-4 py-3 mb-3 hover:shadow-lg',
    'checkItemClass': 'item__check mr-4 cursor-pointer appearance-none border w-6 h-6 rounded-full flex items-center justify-center outline-none',
    'contentItemClass': 'flex-grow text-indigo-700 item__content',
    'deleteItemButtonClass': 'ml-4 text-sm text-gray-500 cursor-pointer',
    'completedItemClass': 'item__completed',
})

// Create item on press enter key
tasksApp.form.input.addEventListener('keyup', (ev) => {
    if(ev.keyCode === 13) {
        tasksApp.form.createNewItem()
    }
})

// Custom item validator
tasksApp.form.itemValidator = (item) => {
    if( item.name.trim().length == 0 ) {
        alert('Jajaja que dijiste, CORONÉ??')
        return false
    }
    return true
}

tasksApp.init()