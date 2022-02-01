import React from 'react';

import {Column} from 'devextreme-react/data-grid';

import { TipoFormaDePagoService } from '../../services/TipoFormaDePagoService';
import ADAMultipleDropDownFilter from './ADAMultipleDropDownFilter';
import './adaDropDownBoxes.css';

export default class FormasDePagoBuscador extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            idComponente: Math.random().toString().replace(".", ""),
            gridSelectedRowKeys: [],
            items: null,
            selectedItems: [],
        };

        this.refrescar = this.refrescar.bind(this); 
        this.onSelectedItems = this.props.onSelectedItems.bind(this);
        this.onAccepted = this.onAccepted.bind(this);
        this.dataGridOnSelectionChanged = this.dataGridOnSelectionChanged.bind(this);
        this.descripcionVisual = this.descripcionVisual.bind(this);

        this.refrescar();
    }

    refrescar() {
        TipoFormaDePagoService.listarFormasDePagoGastos(data => {
            if (this.props.SelectedIds && Array.isArray(this.props.SelectedIds)){
                let selectedItems = data.filter(x => this.props.SelectedIds.includes(x.tipoFormaDePagoGastoId));
                this.setState({ selectedItems: selectedItems });
                this.setState({ gridSelectedRowKeys: selectedItems.map(x => x.tipoFormaDePagoGastoId) });
            }
            this.setState({ items: data });
        });
    }

    dataGridOnSelectionChanged(e) {
        this.setState({
            gridSelectedRowKeys: e.selectedRowKeys?.map(x => x.tipoFormaDePagoGastoId) || []
        }, this.onAccepted);
    }

    onAccepted(){
        this.onSelectedItems(this.state.gridSelectedRowKeys.sort((a,b) => a - b));
    }

    descripcionVisual(item) {
        return item.descripcion;
    }

    render() {
        return (
            <div className="row">
                {this.state.items &&  <ADAMultipleDropDownFilter
                    keyExpr={'tipoFormaDePagoGastoId'}
                    items={this.state.items}
                    deferRendering={false}
                    showClearButton={true}
                    placeholder={'Seleccione una o varias formas de pago...'}
                    dataGridOnSelectionChanged={this.dataGridOnSelectionChanged}
                    descripcionVisual={this.descripcionVisual}
                    ModoSingleSelection={this.props.ModoSingleSelection}
                    selectedItems={this.state.selectedItems}
                    >

                    <Column dataField="tipoFormaDePagoGastoId" caption="tipoFormaDePagoGastoId" allowEditing={false} visible={false} ></Column>
                    <Column dataField="descripcion" caption="Descripción" allowEditing={false} ></Column>

                </ADAMultipleDropDownFilter>}
            </div>
        );
    }
}