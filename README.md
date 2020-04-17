# Do.js

A little library to make TO-DO apps.


## How to use

```HTML
<div id="formId">
    <input type="text">
    <button>Save</button>
</div>

<div id="listId"></div>

<script src="do.js"></script>
<script src="main.js"></script>
```

And then in the `main.js`

```JavaScript
const tasksApp = new Do('listId', 'formId');
tasksApp.init();
```


## Constructor parameters

```JavaScript
const doInstance = new Do(
    // First parameter is the ID of the element list parent
    `listId`,

    // ID of parent element where input and button are
    `formId`,

    // Object config (OPTIONAL)
    {
        // Css class to set in the html element that represents an item (main element). This a `<div>` element.
        // can pass an Array<string>
        'itemClass': 'item', // default

        // Css class to set in main element when is completed.
        // can pass an Array<string>
        'completedItemClass': 'item-completed', // default

        // Css class to set in main element before delete.
        // can pass an Array<string>
        'deletedItemClass': 'item-deleted', // default

        // Time in miliseconds to wait before delete the item.
        'deleteDelay': 0, // default

        // Css class to set to main element checkbox. This is a `<input type=checkbox>` element.
        // can pass an Array<string>
        'checkItemClass': 'item__check', // default

        // Css class to set to main element content. This is a `<p>` element.
        // can pass an Array<string>
        'contentItemClass': 'item__content', // default

        // Css class to set to main element delete button, This is a `<a>` element.
        // can pass an Array<string>
        'deleteItemButtonClass': 'item__delete', // default

        // Text to set to main element delete button.
        'deleteItemButtonText': 'Delete', // default

        // Html content to set to main element delete button. This will replace 'deleteItemButtonText'
        'deleteItemButtonHtml': '', // default

        // It should to add new items to 'start' or 'end' of list.
        'direction': 'start', // default
    },

    // itemValidator (OPTIONAL):
    // It is a function to validate if the new item should to be added to the list.
    // Return a boolean or Promise<boolean>
    (item) => item.content.length > 0, // default

    // onItemAdded (OPTIONAL):
    // Called when an item was added to list, after of call itemValidator function 
    (item) => {}, // default

    // onItemChanged (OPTIONAL):
    // Called every time the status of an item changes
    (item) => {}, // default

    // beforeItemDelete (OPTIONAL):
    // Called when an item requests be delete
    // Return: boolean | Promise<boolean>
    (item) => true, // default

    // onItemDeleted (OPTIONAL):
    // Called when an item was deleted
    (item) => {} // default
)
```


## The instance

`const instance = new Do(...)`

It is object with two properties and a method that allows initialize the proccess of creation, validation and insertion of new items to the list.


#### instance.manager

Represents the `<div>` list and it's resposable for validate, add and assigning events over new created items.

```JavaScript
instance.manager: {
    
    // Where new items are inserted
    container: HTMLElement,

    // If new items are added at the 'start' | 'end'
    direction: string,

    // Validate if new items are added or not
    // receive the new item to be added
    // return a boolean | Promise<boolean>, new items are added if return true
    itemValidator: function,

    // Callback to call when new item was added
    // receive the new Item created
    onItemAdded: function,

    // Callback to call when an item requests to be delete
    // receive the item to be deleted
    // can return boolean | Promise<boolean>
    // the item not be deleted if return false
    // By default returns true
    beforeItemDelete: function,

    // Callback to call after an item was deleted
    // receive the deleted item
    onItemDeleted: function,

    // Callback to call when an item's checkbox changed
    // receive the changed item
    onItemChanged: function,

    // To change instance.manager.direction value
    // can pass 'start' | 'end' values
    setDirection: function,

    // function that validate, and insert new items to instance.manager.container
    // it also assign event callback to item after validating them
    // WE RECOMMEND DO NOT MODIFY THIS FUNCTION
    add: function
}
```

This object can be used to change the element and the method of adding new items (`container` and `direction`). In addition to also being responsible for calling the `itemValidator` and `onItemAdded` methods, it is also responsible for assigning `onItemChanged`, `beforeItemDelete` and `onItemDeleted` events to new item after they have been created, but before they are inserted.

If new the new item do not pass `itemValidator` function then do not will be added to the list.


#### instance.form

Represents the input and button where user trigger the creation of new items. Has the follow inportant properties:

```JavaScript
instance.form: {

    // Input where users type 
    input: HTMLInputElement,

    // Where user submit and confirm creation of new items
    // This call to instance.form.createNewItem()
    button: HTMLButtonElement,

    // Equals to instance.manager
    manager: {...},

    // Retrieve the instance.form.input value
    // WE RECOMMEND DO NOT MODIFY THIS FUNCTION
    getContent: function,

    // Set the instance.form.input value
    // WE RECOMMEND DO NOT MODIFY THIS FUNCTION
    setContent: function,

    // Initialize the creation of new items
    // WE RECOMMEND DO NOT MODIFY THIS FUNCTION
    createNewItem: function
}
```

`instance.form.button` - has a click listener to `instance.form.createNewItem()` method.

`instance.form.getContent()` and `instance.form.setContent(content)` - gets and sets content to the `instance.form.input`


## Item

This class represents a new item and contains a property that represents the node element in the DOM

```JavaScript
item: {

    // The content of the item
    // Default: ''
    // required
    content: string,

    // If the item is checked/completed
    // Default: false
    completed: boolean,

    // The node element on the DOM
    /*
    <div>
      <input type="checbox">
      <label>content</label>
      <a>Delete</a>
    </div>
    */
    nodeElement: HTMLDivElement,

    // Called before item will delete
    // this function is assiged by instance.manager after validate the new item
    // receive the this class like argument
    beforeItemDelete: function,

    // Called after item was deleted
    // this function is assiged by instance.manager after validate the new item
    onItemDeleted: function,

    // Called when <input type="checkbox"> change
    // this function is assiged by instance.manager after validate the new item
    onItemChanged: function,

    // This object contains the initial class properties values of this.nodeElement and his children elements
    // is populated by the third argument of the constructor new Do( .., .., Options <- this )
    renderOptions: {...}
}
```
