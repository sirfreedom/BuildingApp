import React from 'react';

import {Column} from 'devextreme-react/data-grid';

import { ChequeService } from '../../services/ChequeService';
import ADAMultipleDropDownFilter from './ADAMultipleDropDownFilter';
import './adaDropDownBoxes.css';

export default class ChequeBuscadorDropDown extends React.Component {
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
        ChequeService.listarCheques(data => {
            if (this.props.SelectedIds && Array.isArray(this.props.SelectedIds)){
                let selectedItems = data.filter(x => this.props.SelectedIds.includes(x.chequeId));
                this.setState({ selectedItems: selectedItems });
                this.setState({ gridSelectedRowKeys: selectedItems.map(x => x.chequeId) });
            }
            this.setState({ items: data });
        });
    }

    dataGridOnSelectionChanged(e) {
        this.setState({
            gridSelectedRowKeys: e.selectedRowKeys?.map(x => x.chequeId) || []
        }, this.onAccepted);
    }

    onAccepted(){
        this.onSelectedItems(this.state.gridSelectedRowKeys.sort((a,b) => a - b));
    }

    descripcionVisual(item) {
        return item.nroCheque;
    }

    render() {
        return (
            <div className="row">
                {this.state.items && <ADAMultipleDropDownFilter
                    keyExpr={'chequeId'}
                    items={this.state.items}
                    deferRendering={false}
                    showClearButton={true}
                    placeholder={'Seleccione uno o varios cheques...'}
                    dataGridOnSelectionChanged={this.dataGridOnSelectionChanged}
                    descripcionVisual={this.descripcionVisual}
                    ModoSingleSelection={this.props.ModoSingleSelection}
                    selectedItems={this.state.selectedItems}
                    >

                    <Column dataField="chequeId" caption="chequeId" allowEditing={false} visible={false} ></Column>
                    <Column dataField="bancoId" caption="bancoId" allowEditing={false} visible={false} width="auto" ></Column>
                    <Column dataField="bancoDescripcion" caption="Banco" allowEditing={false}  width="auto"></Column>
                    <Column dataField="nroCheque" caption="Número cheque" allowEditing={false} width="auto"></Column>
                    <Column dataField="fechaCobro" caption="Fecha cobro" allowEditing={false} dataType={"date"} width="auto" ></Column>
                    <Column dataField="importe" caption="Importe" allowEditing={false} dataType={"number"} width="auto"></Column>
                    <Column dataField="edificioId" caption="edificioId" allowEditing={false} visible={false} ></Column>
                    <Column dataField="edificioDescripcion" caption="Edificio" allowEditing={false}  width="auto"></Column>
                    <Column dataField="unidad" caption="Unidad" allowEditing={false} width="auto"></Column>

                </ADAMultipleDropDownFilter>}

            </div>
        );
    }
}