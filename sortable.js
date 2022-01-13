/*
	sortable - easy sortable tables [compwnents]
	(C) 2022 Shaped Technica (Jai B) || GPLv3 | Commercial License Available
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

		this.sortEvent = new CustomEvent(`${this.options.tableClass}_sortEvent`, {
			detail: { table : null }
		});

    	this.initialize();
    }

    initialize(table = null) {
		Array.from(document.querySelectorAll("table")).forEach((tableElement,tableId) => 
			(tableElement.classList.contains('sortable')) ? (
				this.startSorting(tableElement)
			):null);
	}

	startSorting(tableElement) {
		(typeof tableElement.sortDirection === 'undefined') 
			? tableElement.sortDirection = this.options.defaultSortDirection : null,

			this.sortTable(tableElement, 0),

			tableElement.rows[0].cells[0].classList.add(`${this.options.tableClass}_active`),

			(this.options.defaultSortDirection) ?
				tableElement.rows[0].cells[0].classList.add(`${this.options.tableClass}_asc`) :
				tableElement.rows[0].cells[0].classList.add(`${this.options.tableClass}_desc`),

			Array.from(tableElement.querySelectorAll('tr')).forEach((tableRowElement,rowId) =>
				Array.from(tableRowElement.querySelectorAll('td')).forEach((tableCellElement,columnId) =>
					(rowId == 0) ? tableCellElement.addEventListener('click', this.sortListener.bind(this)) : null
				)
			)		
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
			table.rows[0].cells[ev.target.cellIndex].classList.add(`${this.options.tableClass}_asc`) :
			table.rows[0].cells[ev.target.cellIndex].classList.add(`${this.options.tableClass}_desc`);

		this.sortTable(table, ev.target.cellIndex);
	}

	sortTable(table, comparisonIndex, comparisonFunction = function(x, y) {
			if (!table.sortDirection) {
				if (this.options.sortNumeric && this.options.sortByValue
				&& typeof x.firstElementChild !== 'undefined' && x.firstElementChild != null
				&& typeof y.firstElementChild !== 'undefined' && y.firstElementChild != null)
					return (parseInt(x.firstElementChild.value) > parseInt(y.firstElementChild.value)) ? 1 : -1;
				else if (this.options.sortNumeric) 
					return (isNaN(parseInt(x.innerHTML)) ||  isNaN(parseInt(y.innerHTML))) ?
						(x.innerHTML.toUpperCase() > y.innerHTML.toUpperCase()) ? 1 : -1
						: parseInt(x.innerHTML) > parseInt(y.innerHTML) ? 1 : -1;
				else return (x.innerHTML.toUpperCase() > y.innerHTML.toUpperCase()) ? 1 : -1;
			} else {
				if (this.options.sortNumeric && this.options.sortByValue
				&& typeof x.firstElementChild !== 'undefined' && x.firstElementChild != null
				&& typeof y.firstElementChild !== 'undefined' && y.firstElementChild != null)
					return (parseInt(x.firstElementChild.value) < parseInt(y.firstElementChild.value)) ? 1 : -1;
				else if (this.options.sortNumeric)
					return (isNaN(parseInt(x.innerHTML)) || isNaN(parseInt(y.innerHTML))) ?
						(x.innerHTML.toUpperCase() < y.innerHTML.toUpperCase()) ? 1 : -1
						: (parseInt(x.innerHTML) < parseInt(y.innerHTML)) ? 1 : -1;
				else return (x.innerHTML.toUpperCase() < y.innerHTML.toUpperCase()) ? 1 : -1;
			}
	}.bind(this)) {
		table.lastSort = comparisonIndex;

		var sortArray = [], sortedRows = [];

		Array.from(table.rows).forEach((el,i) =>  (i > 0) ? sortArray[i] = el.cells[comparisonIndex] : null);

		(this.options.comparisonFunction != null) ? comparisonFunction = this.options.comparisonFunction : null;

		sortArray = sortArray.sort(comparisonFunction);

		sortArray.forEach((el,i) => sortedRows[i] = el.parentElement.cloneNode(true));

		Array.from(table.rows).forEach((el,i) => (i > 0) ? el.replaceWith(sortedRows[i-1]) : null );
		
		this.sortEvent.detail.table = table;
		document.dispatchEvent(this.sortEvent);		
	}
}