/*
	sortable - easy sortable tables [compwnents]
	(C) 2021 Shaped Technica (Jai B) || GPLv3 | Commercial License Available
*/

class Sortable {
    constructor() {
    	this.initialize();
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
		table.lastSort = comparisonIndex;
		var rw,i,x,y;
		var sw = true;
		var ss = false;

		if (typeof table.sortDirection === 'undefined')
			table.sortDirection = 1;

		while (sw) {
			sw = false;
			rw = table.rows;

			for (i=1; i < rw.length - 1; i++) {
				ss = false;

				x = rw[i].getElementsByTagName("td")[comparisonIndex];
				y = rw[i+1].getElementsByTagName("td")[comparisonIndex];

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
					ss = true;
					break;
				}
			}
			if (ss) {
				rw[i].parentNode.insertBefore(rw[i + 1], rw[i]);
				sw = true;
			}
		}
	}
}