import React from 'react';

import {
    Column,
    Lookup,
    RequiredRule,
    StringLengthRule,
    RangeRule,
} from 'devextreme-react/data-grid';

import Button from '@material-ui/core/Button';
import { TipoFormaDePagoService } from '../../services/TipoFormaDePagoService';
import { BancoService } from '../../services/BancoService';

import ADAGrid from '../Grid/ADAGrid';

const formaDePago = {
    EFECTIVO: 1,
    CHEQUE: 2,
    DEBITOAUTOMATICO: 3,
    DEBITODIRECTO: 4,
    DEPOSITOBANCARIO: 5,
    TRANSFERENCIABANCARIA: 6
}

export class ValorCobranza extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            tiposFormasDePago: [],
            bancos: []
        };

        //this.onRowInserted = this.onRowInserted.bind(this);
        //this.onRowUpdated = this.onRowUpdated.bind(this);
        //this.onRowRemoved = this.onRowRemoved.bind(this);

        this.formaDePago_Efectivo = this.formaDePago_Efectivo.bind(this);
        this.onEditorPreparing = this.onEditorPreparing.bind(this);       
        this.guardar = this.guardar.bind(this);       

        //lleno los tiposFormasDePago
        TipoFormaDePagoService.listarAutocomplete((data) => this.setState({ tiposFormasDePago: data }));

        //lleno los Bancos
        BancoService.listarAutocomplete((data) => this.setState({ bancos: data }));
    }

    onRowInserted(e) {
        debugger;
        //const id = e.data.edificioId;

        //inserto un nuevo elemento
        //this.setState({ items: this.state.items.push(e.data)});
    }

    onRowUpdated(e) {
        debugger;
        //busco el elemento a actualizar
    /*    const index = this.state.items.findIndex(x => x.valorCobranzaId === e.data.valorCobranzaId);
        const items = [...this.state.items];

        //actualizo el elemento
        items[index] = e.data;
        this.setState({ items: items});*/
    }

    onRowRemoved(e) {
        debugger;
        //busco el elemento a borrar
       /* const index = this.state.items.findIndex(x => x.valorCobranzaId === e.data.valorCobranzaId);
        const items = [...this.state.items];

        //borro el elemento


        items[index] = e.data;
        this.setState({ items: items });*/
    }

    guardar() {
        debugger;
        //TODO: recupero la lista de items de la grilla y la propago al callback de this.props.callback
    }

    formaDePago_Efectivo(dataGrid, row) {

        //limpio los campos que no van
        this.limpiarValores(dataGrid, row, "bancoId");
        this.limpiarValores(dataGrid, row, "fechaCobro");
        this.limpiarValores(dataGrid, row, "numeroCheque");
        this.limpiarValores(dataGrid, row, "referencia");

        //saco los campos requeridos
        dataGrid.getVisibleColumns()[2].validationRules = [];

    }

    limpiarValores(dataGrid, row, dataField) {
        if (dataGrid.cellValue(row.rowIndex, dataField))
            dataGrid.cellValue(row.rowIndex, dataField, "");

        const cell = row.cells.filter(cell => cell.column.dataField === dataField)[0];

        //seteo la columna como readonly
        cell.column.allowEditing = false;
        cell.cellElement.classList.remove("dx-cell-modified");
    }

    onEditorPreparing(e) {
        //escucho el onchange del combo tipoFormaDePago
        if (e.parentType === 'dataRow' && e.dataField === "tipoFormaDePagoId") {
            const defaultOnValueChanged = e.editorOptions.onValueChanged;
            const dataGrid = e.component;
            const row = e.row;
            const component = this;

            e.editorOptions.onValueChanged = (e) => {
                
                defaultOnValueChanged(e);

                switch (e.value) {
                    case formaDePago.EFECTIVO:
                        //para la prueba borro el importe.
                        debugger;
                        component.formaDePago_Efectivo(dataGrid, row);


                        break;

                    default:

                }
            }
        }
    }

    render() {
        return (
            <div>
                <ADAGrid
                    items={this.state.items}
                    keyExpr={'valorCobranzaId'}
                    onRowInserted={this.onRowInserted}
                    onRowUpdated={this.onRowUpdated}
                    onRowRemoved={this.onRowRemoved}
                    onCellPrepared={this.onCellPrepared}
                    onEditorPrepared={this.onEditorPrepared}
                    onEditorPreparing={this.onEditorPreparing}
                >
                    <Column dataField="valorCobranzaId" caption="ValorCobranzaId" allowEditing={false} dataType={"number"} visible={false}>
                    </Column>

                    <Column dataField="tipoFormaDePagoId" caption="Forma de Pago" dataType={"number"} >
                        <Lookup dataSource={() => this.state.tiposFormasDePago} valueExpr={'id'} displayExpr={'descripcion'} />
                        <RequiredRule />
                    </Column>

                    <Column dataField="importe" caption="Importe" dataType={"number"} >
                        <RangeRule min="0" />
                        <RequiredRule />
                    </Column>

                    <Column dataField="bancoId" caption="Banco" dataType={"number"}>
                        <Lookup dataSource={() => this.state.bancos} valueExpr={'id'} displayExpr={'descripcion'} />
                    </Column>

                    <Column dataField="referencia" caption="Referencia" >
                        <StringLengthRule max="100" />
                    </Column>

                    <Column dataField="numeroCheque" caption="Número de Cheque" >
                        <StringLengthRule max="100" />
                    </Column>

                    <Column dataField="fechaCobro" caption="Fecha Cobro" dataType={"date"} />
                </ADAGrid>
                <Button type="button" variant={"contained"} color={"primary"} onClick={this.guardar}>Guardar</Button>
            </div>
        );
    }
}