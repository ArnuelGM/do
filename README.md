# Do.js

A little library to make TODO apps

## How to use

  

```html
<div  id="formId">
	<input  type="text">
	<button>Save</button>
</div>

<div  id="listId"></div>

<script  src="do.js"></script>
<script  src="main.js"></script>
```

And then in the `main.js`

```JavaScript
const  options = null;			// Optional
const  itemValidator = null;	// Optional

const  tasksApp = new  Do('list', 'formId', options, itemValidator);
tasksApp.init();
```

  

## Options (optional)

  

Key | Default Value | Description
:-- | :--- | :---
'itemClass' | `'item'` | Css class to set in the html element that represents an item (main element). This a `<div>` element.
'completedItemClass' | `'item--completed'` | Css class to set in main element when is completed.
'deletedItemClass' | `'item--deleted'` | Css class to set in main element before delete.
'deleteDelay' | `0` | Time in miliseconds to wait before delete the item.
'checkItemClass' | `'item__check'` | Css class to set to main element checkbox. This is a `<input type=checkbox>` element.
'contentItemClass' | `'item__content'` | Css class to set to main element content. This is a `<p>` element.
'deleteItemButtonClass' | `'item__delete'` | Css class to set to main element delete button, This is a `<a>` element.
'deleteItemButtonText' | `'Delete'` | Text to set to main element delete button.
'direction' | `'start'` | It should to add new items to `'start'` or `'end'` of list.


## itemValidator (optional)

It is a function to validate if the new item should to be added to the list. Receive a `Item` class and should returns a `boolean` value.

By default function definition is:
```JavaScript
itemValidator = (item) => {
	if(item.content.length == 0) {
		return false
	}
	return true
}
```