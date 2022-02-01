import React from 'react';

import {
    Column,    
    RangeRule
} from 'devextreme-react/data-grid';

import { PreCargaGastoService } from '../../services/PreCargaGastoService';

import ADAGrid from '../Grid/ADAGrid';

export class PreCargaGastoImporte extends React.PureComponent {
    constructor(props) {
        super(props);
        
        this.state = {
            items: [],
        };

        this.refrescar();
        this.onRowUpdated = this.onRowUpdated.bind(this);
        this.refrescar = this.refrescar.bind(this);
        this.tituloSubGrilla = props.tituloSubGrilla;
    }

    refrescar() {
        const preCargaGastoId = this.props.parentGrid.data.preCargaGastoId;
        PreCargaGastoService.obtenerGastosImportes(data => this.setState({ items: data }), preCargaGastoId);
    }

    onRowUpdated(e) {
        //modifico la lista de items de la grilla padre
        var items = e.component.getDataSource()._items;
        this.props.parentGrid.data.importes = items;
        const parentGridComponent = this.props.parentGrid.component;
        const rowId = parentGridComponent.getRowIndexByKey(this.props.parentGrid.key);

        var totalImporte = 0;

        for (var x = 0; x < items.length; x++) {
            totalImporte += items[x].importe;
        }

        //actualizo el importeTotal con el sum de los importes de todos los porcentuales
        parentGridComponent.cellValue(rowId, "importeTotal", totalImporte);
        //colapso la fila 
        parentGridComponent.collapseRow(e.data.preCargaGastoId);
    }

    render() {
        return (
            <div>
                <strong>Edificio: </strong><span>{this.tituloSubGrilla(this.props.parentGrid.data.edificioId)}</span>
                <ADAGrid
                    items={this.state.items}
                    keyExpr={['preCargaGastoImporteId' , 'porcentualId']}
                    onRowUpdated={this.onRowUpdated}
                    onEditorPreparing={this.onEditorPreparing}
                    width={"400px"}
                    height={"auto"}
                    allowAdding={false}
                    allowDeleting={false}
                    exportEnabled={false}
                    searchEnabled={false}
                    columnChooser={false}
                    noDataText={""}
                    groupPanel={false}
                    headerFilter={{
                        allowSearch: false,
                        visible: false}}
                >
                    <Column dataField="porcentualDescripcion" caption="Porcentual" allowEditing={false} >
                    </Column>

                    <Column dataField="importe" caption="Importe" dataType={"number"} allowEditing={this.props.parentGrid.data.listoParaImportarAda4 === false} >
                        <RangeRule min="0" />
                    </Column>
                </ADAGrid>
            </div>
            );
    }
}