/*
	sortable - easy sortable tables [compwnents]
	(C) 2021 Shaped Technica (Jai B) || GPLv3 | Commercial License Available
*/

class Sortable {
    constructor() {
    	this.initialize();

    	this.sortNumeric = true;
    	this.sortValue = false;
    }

    initialize() {
    	Array.from(document.querySelectorAll("table")).forEach((tableElement,tableId)=>{
    		if (tableElement.classList.contains('sortable')) {
				this.sortTable(tableElement, 0);
		
				tableElement.rows[0].cells[0].classList.add('sortable_active');
				tableElement.rows[0].cells[0].classList.add('sortable_asc');

	    		Array.from(tableElement.querySelectorAll('tr')).forEach((tableRowElement,rowId)=>{
					Array.from(tableRowElement.querySelectorAll('td')).forEach((tableCellElement,columnId)=>{
						if (rowId == 0) tableCellElement.addEventListener('click', this.sortListener.bind(this));
		    		});
	    		});
    		}
    	});
	}

	sortListener(ev) {
		let table = null;
		if (ev.target.parentElement.parentElement.tagName == "thead") {
			table = ev.target.parentElement.parentElement.parentElement;
		} else {
			table = ev.target.parentElement.parentElement;
		}

		if (typeof table.sortDirection === 'undefined')
			table.sortDirection = 1;

		if (table.lastSort == ev.target.cellIndex) {
			switch (table.sortDirection) {
				case 0:
					table.sortDirection = 1;
				  break;
				case 1:
					table.sortDirection = 0;
				  break;
				case null:
				default:
					table.sortDirection = 0;
			}
		} else {
			if (table.lastSort == null) {
				table.sortDirection = 1;
			}
		}

		Array.from(table.querySelectorAll('.sortable_active')).forEach((el, i)=> {
			el.classList.remove('sortable_active');
			el.classList.remove('sortable_asc');
			el.classList.remove('sortable_desc');
		});

		table.rows[0].cells[ev.target.cellIndex].classList.add('sortable_active');

		if (table.sortDirection)
			table.rows[0].cells[ev.target.cellIndex].classList.add('sortable_asc');
		else
			table.rows[0].cells[ev.target.cellIndex].classList.add('sortable_desc');

		this.sortTable(table, ev.target.cellIndex);

	}

	sortTable(table, comparisonIndex, comparisonFunction = function(x, y) {
			if (table.sortDirection) {
				if (this.sortNumeric
				&& this.sortValue
				&& typeof x.firstElementChild !== 'undefined'
				&& typeof y.firstElementChild !== 'undefined') {
					return parseInt(x.firstElementChild.value) > parseInt(y.firstElementChild.value)
				} else

				if (this.sortNumeric) {
					if (isNaN(parseInt(x.innerHTML))
					||  isNaN(parseInt(y.innerHTML))) {
						return (x.innerHTML > y.innerHTML)						
					}
					return parseInt(x.innerHTML) > parseInt(y.innerHTML)
				} else {
					return (x.innerHTML > y.innerHTML)
				}
			} else {
				if (this.sortNumeric
				&& this.sortValue
				&& typeof x.firstElementChild !== 'undefined'
				&& typeof y.firstElementChild !== 'undefined') {
					return parseInt(x.firstElementChild.value) < parseInt(y.firstElementChild.value)
				} else

				if (this.sortNumeric) {
					if (isNaN(parseInt(x.innerHTML))
					||  isNaN(parseInt(y.innerHTML))) {
						return (x.innerHTML < y.innerHTML)						
					}
					return parseInt(x.innerHTML) < parseInt(y.innerHTML)
				} else {
					return (x.innerHTML < y.innerHTML)
				}
			}
	}.bind(this)) {
		table.lastSort = comparisonIndex;


		var sortArray = [];

		var sortedRows = [];

		Array.from(table.rows).forEach((el,i) => {
			if (i > 0) {
				sortArray[i] = el.cells[comparisonIndex];
			}
		});

		sortArray.sort(comparisonFunction);

		sortArray.forEach((el,i) => {
			sortedRows[i] = el.parentElement.cloneNode(true);
		});

		Array.from(table.rows).forEach((el,i) => {
			if (i > 0) {
				el.replaceWith(sortedRows[i-1]);
			}
		});		
	}
}