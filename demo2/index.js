const tasks = new Do('items_list', 'items_form', {
    itemClass: ['animated','faster','fadeInLeft','px-4','py-2','mb-2','flex','items-center','border','border-gray-800'],
    checkItemClass: ['mr-4','appearance-none','w-10','h-8','-ml-4','outline-none'],
    contentItemClass: ['flex-1','text-gray-400'],
    deleteItemButtonClass: ['text-4xl','text-gray-600','cursor-pointer','leading-none'],
    deleteItemButtonHtml: '&times;',
    direction: 'end',
    deleteDelay: 500,
    deletedItemClass: ['fadeOutRight'],
});

tasks.manager.itemValidator = (item) => {
    const valid = item.content.trim().length > 0;
    if( !valid ){
        swal({
            title: "Error",
            text: "Content invalid!",
            icon: "error"
        });
    }
    return valid;
}

tasks.manager.beforeItemDelete = async (item) => {

    item.nodeElement.classList.remove('fadeInLeft');

    const willDelete = await swal({
        title: "Are you sure want to delete this item?",
        text: item.content,
        icon: "warning",
        buttons: true,
        dangerMode: true,
    });

    return willDelete;
}

tasks.form.input.addEventListener('keyup', (ev) => {
    if (ev.keyCode === 13) {
        tasks.form.createNewItem();
    }
})

tasks.init();