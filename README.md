# sortable.js

Easy sortable tables.

Simply include sortable.js in your page, instantiate the class and add 'sortable' class to your table.

The sort function's input will be either the raw innerHTML of the table cell, or, if the first child of that cell is an input element, then it will use the value of that input element.

Including the script:

    <script src="sortable.js" type="text/javascript"></script>
    <script>
    new Sortable();
    </script>

Auto-Table Example:

    <table class="sortable">
	      ..
	      your data table
	      ..
    </table>

The classes 'sortable_active' and either 'sortable_asc' or 'sortable_desc' will be added to the header that is currently being sorted. This can be used with some CSS to show arrows for ascending and descending sorting as well as showing which field is currently being sorted.

	table.sortable thead tr:first-child {
	        user-select: none;
	        cursor: pointer;
	}

	// requires material icons to be loaded
	table td.sortable_asc::before {
	        font-family: "Material Icons";
	        content: "\e5c5"; // up arrow
	}
	table td.sortable_desc::before {
	        font-family: "Material Icons";
	        content: "\e5c7"; // down arrow
	}

	table td.sortable_active {
	        font-weight: bold;
	}

Custom sort functions are possible and you can activate a sort on any table whenever needed. **tableElement** is the documentElement of the table, **index** is the column index to sort by and **sortFunction** is a sort lambda/callback allowing you to implement your own sorting function.

eg:

    <script>
      let mySortable = new Sortable();
      let tableElement = document.querySelectorAll('table#myTable')[0];
      let index = 1;
      
      mySortable.sortTable(tableElement, index, (a, b) => {
					return (a < b);
      });
    </script>

Currently there is no way to set a custom sort function for the automatically assigned event handlers, until this is added, if you need to use a custom sorting function then you can not set class 'sortable' on your table and handle the events yourself.

### TODO:
- add ability to pass custom sort function on instantiation.
