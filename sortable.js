/*
	sortable b2246 - easy sortable tables [compwnents]
	(C) 2022 Shaped Technica (Jai B) || GPLv3 | Commercial License Available
*/

class Sortable {
	constructor({
		autoSort = true,
		defaultSortDirection = 0,
		sortNumeric = true,
		sortByValue = false,
		tableClass = "sortable",
		comparisonFunction = null    	
	} = {}) {
		this.options = {
			autoSort,
			defaultSortDirection,
			sortNumeric,
			sortByValue,
			tableClass,
			comparisonFunction
		};

		this.sortEvent = new CustomEvent(`${this.options.tableClass}_sortEvent`, {
			detail: { table : null }
		});

		if (autoSort) this.startAutoSorting();
	}

	startAutoSorting(tableClass = null) {
		if (tableClass == null) tableClass = this.options.tableClass;

		Array.from(document.querySelectorAll("table")).forEach((tableElement,tableId) => 
			(tableElement.classList.contains(tableClass)) ? (
				this.startSorting(tableElement)
			):null);
	}

	stopAutoSorting(tableClass = null) {
		if (tableClass == null) tableClass = this.options.tableClass;

		Array.from(document.querySelectorAll("table")).forEach((tableElement,tableId) => 
			(tableElement.classList.contains(tableClass)) ? (
				this.stopSorting(tableElement)
			):null);
	}

	startSorting(tableElement, index = 0) {
		if (typeof tableElement.sortDirection === 'undefined') 
			tableElement.sortDirection = this.options.defaultSortDirection;

		tableElement.observer = new MutationObserver(this._update.bind(this, tableElement));

		if (!tableElement.classList.contains(this.options.tableClass)) tableElement.classList.add(this.options.tableClass);

		this.sortTable(tableElement, index);

		tableElement.rows[0].cells[index].classList.add(`${this.options.tableClass}_active`);

		(this.options.defaultSortDirection) ?
			tableElement.rows[0].cells[index].classList.add(`${this.options.tableClass}_asc`) :
			tableElement.rows[0].cells[index].classList.add(`${this.options.tableClass}_desc`);

		Array.from(tableElement.querySelectorAll('tr')).forEach((tableRowElement,rowId) => {
			Array.from(tableRowElement.querySelectorAll('td, th')).forEach((tableCellElement,columnId) => {
					(rowId == 0) ? tableCellElement.addEventListener('click', this.sortListener) : null;
				}
			)
		});
	}

	stopSorting(tableElement = null) {
		if (tableElement == null) {
			Array.from(document.querySelectorAll("table"))
				.forEach((tableElement,tableId) => {
					if (tableElement.classList.contains(this.options.tableClass)) {
							(typeof tableElement.observer !== 'undefined') ? tableElement.observer.disconnect():null;

							tableElement.classList.remove(this.options.tableClass);

							Array.from(tableElement.querySelectorAll('tr')).forEach((tableRowElement,rowId) => 
								(rowId == 0) 
								?	Array.from(tableRowElement.querySelectorAll('td, th')).forEach((tableCellElement,columnId) => {
										tableCellElement.classList.remove(`${this.options.tableClass}_asc`);
										tableCellElement.classList.remove(`${this.options.tableClass}_desc`);
										tableCellElement.classList.remove(`${this.options.tableClass}_active`);

										tableCellElement.removeEventListener('click', this.sortListener);
									})
								:null);
					}
				});
		} else {
			(typeof tableElement.observer !== 'undefined') ? tableElement.observer.disconnect() :null;

			tableElement.classList.remove(this.options.tableClass);

			Array.from(tableElement.querySelectorAll('tr')).forEach((tableRowElement,rowId) =>
				(rowId == 0)
				?	Array.from(tableRowElement.querySelectorAll('td, th')).forEach((tableCellElement,columnId) => {
						tableCellElement.classList.remove(`${this.options.tableClass}_asc`);
						tableCellElement.classList.remove(`${this.options.tableClass}_desc`);
						tableCellElement.classList.remove(`${this.options.tableClass}_active`);

						tableCellElement.removeEventListener('click', this.sortListener);
					})
				:null);
		}
	}

	_update(element, mutations, observer) {
		element.observer.disconnect();
		this.sortTable(element, element?.lastSort);
	}

	get sortListener() {
		const listener = (ev) => {
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
			
			this.sortTable(table, ev.target.cellIndex);
		};

		Object.defineProperty(this, 'sortListener',{ value : listener });

	  return listener;
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

			Array.from(table.querySelectorAll(`.${this.options.tableClass}_active`)).forEach((el, i) =>
				el.classList.remove(`${this.options.tableClass}_active`,
									`${this.options.tableClass}_asc`,
									`${this.options.tableClass}_desc`));

			table.rows[0].cells[comparisonIndex].classList.add(`${this.options.tableClass}_active`);

			(table.sortDirection) ?
				table.rows[0].cells[comparisonIndex].classList.add(`${this.options.tableClass}_asc`) :
				table.rows[0].cells[comparisonIndex].classList.add(`${this.options.tableClass}_desc`);

		var sortArray = [], sortedRows = [];

		Array.from(table.rows).forEach((el,i) =>  (i > 0) ? sortArray[i] = el.cells[comparisonIndex] : null);

		(this.options.comparisonFunction != null) ? comparisonFunction = this.options.comparisonFunction : null;

		sortArray = sortArray.sort(comparisonFunction);

		let parent=null;
		if (typeof table.rows[1] !== 'undefined') {
			parent = table.rows[1].parentElement;
		} else {
			parent = table;
		}

		sortArray.forEach((el,i) => {
			// sortedRows[i] = el.parentElement.parentElement.removeChild(el.parentElement); ?
			sortedRows[i] = parent.removeChild(el.parentElement);
		});

		sortedRows.forEach((row) => {
			parent.appendChild(row);
		});

		table.observer.observe(table.tBodies[0], {
			childList: true,
			subtree : true
		});

		this.sortEvent.detail.table = table;
		document.dispatchEvent(this.sortEvent);
	}
}


