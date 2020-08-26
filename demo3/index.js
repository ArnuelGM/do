
const container = document.querySelector('#task_container');
const form      = document.querySelector('#form_task');

new Do(container, form, {
    'itemClass'             : 'item--enter flex items-center border-2 rounded-bl-lg rounded-tr-lg border-indigo-700 px-4 py-3 mb-3 shadow-lg',
    'checkItemClass'        : 'item__check mr-4 cursor-pointer appearance-none border w-6 h-6 rounded-full flex items-center justify-center outline-none',
    'contentItemClass'      : 'flex-grow text-indigo-700 item__content',
    'deleteItemButtonClass' : 'ml-4 text-sm text-gray-500 cursor-pointer',
    'deleteDelay'           : 300
}).init()