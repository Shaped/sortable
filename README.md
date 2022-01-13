# sortable.js

Easy sortable tables. Updated now to be ~100x faster.

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

You can also pass your own custom function with the options on instantiation and it will be always used.

eg:

    <script>
      let mySortable = new Sortable();
      let tableElement = document.querySelectorAll('table#myTable')[0];
      let index = 1;
      
      mySortable.sortTable(tableElement, index, (a, b) => {
					return (a < b);
      });
    </script>

Configuration object example:

    let mySortable = new Sortable({
        defaultSortDirection: 0,  // default to asc or desc
	sortNumeric: true,        // whether to call parseInt() on the cell's value
	sortByValue: false,       // if set to true, we will look at the value property of the first element instead of the innerHTML of the cell itself
	tableClass: "sortable",   // specify the class on which to automatically sort and listen to events on table header for changing sort index and asc/desc
	comparisonFunction = null // override the default comparison function for all tables
    });

Using React? Oh shit ... I'm sorry!

Added the 'startSorting' method for this reason (and other potential uses) so that instead of Sortable automatically searching the DOM for any tables containing the appropriate class (and thus, if using React, potentially overwriting elements managed by React).

If your table is within a React component, you can simply pass a ``ref`` to ``Sortable.startSorting()`` like below. Note that you probably don't want to call ``Sortable.initialize()`` anymore unless you have other tables not managed by React that you want to automatically have Sortable decorate.

```
const mySortable = new Sortable();

class MyComponent extends React.Component {
    constructor(props) {
        super(props);
        this.sortableRef = React.createRef();
    }

    componentDidMount() {
        mySortable.startSorting(this.sortableRef.current);
    }

    render() {
        return (<table ref={this.sortableRef}>
                // .. your table here ..
                </table>);
    }
}
```

😎
