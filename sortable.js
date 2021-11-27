/*
	sortable - easy sortable tables [compwnents]
	(C) 2021 Shaped Technica (Jai B) || GPLv3 | Commercial License Available
*/

class Sortable {
    constructor({
    	defaultSortDirection = 0,
    	sortNumeric = true,
    	sortByValue = false,
    	tableClass = "sortable",
    	comparisonFunction = null    	
    } = {}) {
    	this.options = {
    		defaultSortDirection:defaultSortDirection,
    		sortNumeric:sortNumeric,
    		sortByValue:sortByValue,
    		tableClass:tableClass,
    		comparisonFunction:comparisonFunction
    	};

    	this.initialize();
    }

    initialize() {
    	Array.from(document.querySelectorAll("table")).forEach((tableElement,tableId) => 
    		(tableElement.classList.contains('sortable')) ? (
				this.sortTable(tableElement, 0),

				tableElement.rows[0].cells[0].classList.add(`${this.options.tableClass}_active`),

				(this.options.defaultSortDirection) ?
					tableElement.rows[0].cells[0].classList.add(`${this.options.tableClass}_desc`) :
					tableElement.rows[0].cells[0].classList.add(`${this.options.tableClass}_asc`),

	    		Array.from(tableElement.querySelectorAll('tr')).forEach((tableRowElement,rowId) =>
					Array.from(tableRowElement.querySelectorAll('td')).forEach((tableCellElement,columnId) =>
						(rowId == 0) ? tableCellElement.addEventListener('click', this.sortListener.bind(this)) : null
					)
				)
    		):null);
	}

	sortListener(ev) {
		let table = null;
		(ev.target.parentElement.parentElement.tagName == "thead") ?
			table = ev.target.parentElement.parentElement.parentElement :
			table = ev.target.parentElement.parentElement;

		(typeof table.sortDirection === 'undefined') ? table.sortDirection = this.options.defaultSortDirection : null;

		(table.lastSort == ev.target.cellIndex) ? (() => {
				switch (table.sortDirection) {
					case 0: table.sortDirection = 1; break;
					case 1: table.sortDirection = 0; break;
					case null:
					default:
					  table.sortDirection = this.options.defaultSortDirection;
				}
			})() :
		 	(table.lastSort == null) ? table.sortDirection = this.options.defaultSortDirection : null;
		
		Array.from(table.querySelectorAll('.sortable_active')).forEach((el, i) =>
			el.classList.remove(`${this.options.tableClass}_active`,
								`${this.options.tableClass}_asc`,
								`${this.options.tableClass}_desc`));

		table.rows[0].cells[ev.target.cellIndex].classList.add(`${this.options.tableClass}_active`);

		(table.sortDirection) ?
			table.rows[0].cells[ev.target.cellIndex].classList.add(`${this.options.tableClass}_desc`) :
			table.rows[0].cells[ev.target.cellIndex].classList.add(`${this.options.tableClass}_asc`);

		this.sortTable(table, ev.target.cellIndex);
	}

	sortTable(table, comparisonIndex, comparisonFunction = function(x, y) {
			if (table.sortDirection) {
				if (this.options.sortNumeric && this.options.sortByValue
				&& typeof x.firstElementChild !== 'undefined'
				&& typeof y.firstElementChild !== 'undefined')
					return parseInt(x.firstElementChild.value) > parseInt(y.firstElementChild.value)
				else if (this.options.sortNumeric) 
					return (isNaN(parseInt(x.innerHTML)) ||  isNaN(parseInt(y.innerHTML))) ?
						(x.innerHTML > y.innerHTML) :
						parseInt(x.innerHTML) > parseInt(y.innerHTML);
				else return (x.innerHTML > y.innerHTML)
			} else {
				if (this.options.sortNumeric && this.options.sortByValue
				&& typeof x.firstElementChild !== 'undefined'
				&& typeof y.firstElementChild !== 'undefined')
					return parseInt(x.firstElementChild.value) < parseInt(y.firstElementChild.value)
				else if (this.options.sortNumeric)
					return (isNaN(parseInt(x.innerHTML)) ||  isNaN(parseInt(y.innerHTML))) ?
						(x.innerHTML < y.innerHTML) :
						parseInt(x.innerHTML) < parseInt(y.innerHTML);
				else return (x.innerHTML < y.innerHTML)
			}
	}.bind(this)) {
		table.lastSort = comparisonIndex;

		var sortArray = [], sortedRows = [];

		Array.from(table.rows).forEach((el,i) =>  (i > 0) ? sortArray[i] = el.cells[comparisonIndex] : null);

		(this.options.comparisonFunction != null) ? comparisonFunction = this.options.comparisonFunction : null;

		sortArray.sort(comparisonFunction);
		sortArray.forEach((el,i) => sortedRows[i] = el.parentElement.cloneNode(true));

		Array.from(table.rows).forEach((el,i) => (i > 0) ? el.replaceWith(sortedRows[i-1]) : null );		
	}
}