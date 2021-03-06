# sortable.js (b2242)

Easy sortable tables. Updated now to be ~100x faster.

Simply include sortable.js in your page, instantiate the class and add 'sortable' class to your table.

The sort function's input will be either the raw innerHTML of the table cell, or, if the first child of that cell is an input element, then it will use the value of that input element.

### Including the script:

For full automatic operation, simply include the source, instantiate the sortable class and it will automatically sort any tables with the 'sortable' class.

```
<script src="sortable.js" type="text/javascript"></script>
<script>
	new Sortable();
</script>
```

Example of table for automatic operation:

```
<table class="sortable">
	<thead>
		<tr>
			<td>First Index</td>
			<td>Second Index</td>
		</tr>
	</thead>
	<tbody>
		  ..
		  <your data table rows>
		  ..
	</tbody>
</table>
```

The classes 'sortable_active' and either 'sortable_asc' or 'sortable_desc' will be added to the header that is currently being sorted. This can be used with some CSS to show arrows for ascending and descending sorting as well as showing which field is currently being sorted.

```
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
```

Custom sort functions are possible and you can activate a sort on any table whenever needed. **tableElement** is the documentElement of the table, **index** is the column index to sort by and **sortFunction** is a sort lambda/callback allowing you to implement your own sorting function.

You can also pass your own custom function with the options on instantiation or to `sortTable` and it will be always used.

eg:

```
<script>
	let myCompare = (a, b) => {
				return (a < b);
	};

	let mySortable = new Sortable({
			tableClass: 'myCompareTables',
			comparisonFunction: myCompare
		});
</script>
```

You can also sort a table manually, also with (or without) your own custom function if desired:

```
<script>
	let mySortable = new Sortable({
			autoSort : false
		});

	let tableElement = document.querySelectorAll('table#myTable')[0];
	let index = 1;

	mySortable.sortTable(tableElement, index, myCompare);
</script>
```

Configuration object example:

	let mySortable = new Sortable({
		autoSort: true, 		  // whether to automatically attach to tables having tableClass
		defaultSortDirection: 0,  // default to asc or desc
		sortNumeric: true,        // whether to call parseInt() on the cell's value
		sortByValue: false,       // if set to true, we will look at the value property of the first element instead of the innerHTML of the cell itself
		tableClass: "sortable",   // specify the class on which to automatically sort and listen to events on table header for changing sort index and asc/desc
		comparisonFunction = null // override the default comparison function for all tables
	});

Methods:

```
	startAutoSorting([tableClass])	-	will start automatically sorting tables with the provided class, the tableClass passed to the instantation options or the default
	stopSorting([element])			-	will stop automatically sorting the provided element, all elements with the tableClass passed to the instantion options or the default
	sortTable(tableElement, comparisonIndex, [comparisonFunction])
									-	will immediately sort the data in the provided table using comparisonIndex as the column to sort by and using comparisonFunction if provided or the one passed to the instantion options or the default
```

????