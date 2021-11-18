class Sortable {
    constructor() {
    	this.tables=[];
    }

    initialize() {
    	Array.from(document.querySelectorAll("table")).forEach((tableElement,tableId)=>{
    		if (tableElement.classList.contains('sortable')) {
				this.tables[tableId] = {
					element: tableElement,
					headers: [],
					columns: []
				};

				this.sortTable(tableElement, 0);

	    		Array.from(tableElement.querySelectorAll('tr')).forEach((tableRowElement,rowId)=>{
					Array.from(tableRowElement.querySelectorAll('td')).forEach((tableCellElement,columnId)=>{
						if (rowId == 0) {
							this.tables[tableId].headers.push(tableCellElement.innerHTML);
							tableCellElement.addEventListener('click', this.sortListener.bind(this));
						} else {
							if (rowId == 1) this.tables[tableId].columns[columnId] = [];
							this.tables[tableId].columns[columnId].push(tableCellElement.innerHTML);
						}
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

		this.sortTable(table, ev.target.cellIndex, (x,y) => {
			if (table.sortDirection)
				return (x.value > y.value)
			else
				return (x.value < y.value)
		});
	}

	sortTable(table, comparisonIndex, comparisonFunction = function(x, y) {
		return x.value > y.value;
	}) {
		console.log("sorting table")
		console.log(table)
		var rows,i,x,y;
		var switching = true;
		var shouldSwitch = false;

		while (switching) {
			switching = false;
			rows = table.rows;

			for (i=1; i < rows.length - 1; i++) {
				shouldSwitch = false;

				x = rows[i].getElementsByTagName("td")[comparisonIndex];
				y = rows[i+1].getElementsByTagName("td")[comparisonIndex];

				if (x.firstElementChild != null
				&&	x.firstElementChild.tagName == 'input') {
					x.value = x.firstElementChild.value;
				} else {
					x.value = x.innerHTML;
				}

				if (y.firstElementChild != null
				&&	y.firstElementChild.tagName == 'input') {
					y.value = y.firstElementChild.value;
				} else {
					y.value = y.innerHTML;
				}

				if (comparisonFunction(x, y)) {
					shouldSwitch = true;
					break;
				}
			}
			if (shouldSwitch) {
				rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
				switching = true;
			}
		}
	}
}
