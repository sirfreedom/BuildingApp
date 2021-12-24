
function menuCopiarATodos (e, validacionesFunc, modificarBatchFunc) {
	console.log('menuCopiar');
	const grid = e.component;
	const propName = e.column.dataField;
	const value = e.row.data[propName];

	let items = grid.option("dataSource");

	// grid.beginCustomLoading();
	console.log('comenzo');

	if (validacionesFunc(items)) {
		for (let index = 0; index < items.length; index++) {
			items[index][propName] = value;
		}

		modificarBatchFunc(items, grid);
	}

	console.log('termino');
	// grid.endCustomLoading();
}

export { menuCopiarATodos }