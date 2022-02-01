import React from 'react';

import {Column} from 'devextreme-react/data-grid';

import { EdificioService } from '../../services/EdificioService';
import ADAMultipleDropDownFilter from './ADAMultipleDropDownFilter';
import './adaDropDownBoxes.css';

export default class EdificiosBuscador extends React.Component {
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
        EdificioService.listarBuscadorDropDown(data => {
            if (this.props.SelectedIds && Array.isArray(this.props.SelectedIds)){
                let selectedItems = data.filter(x => this.props.SelectedIds.includes(x.edificioId));
                this.setState({ selectedItems: selectedItems });
                this.setState({ gridSelectedRowKeys: selectedItems.map(x => x.edificioId) });
            }
            this.setState({ items: data });
        });
    }

    dataGridOnSelectionChanged(e) {
        this.setState({
            gridSelectedRowKeys: e.selectedRowKeys?.map(x => x.edificioId) || []
        }, this.onAccepted);
    }

    onAccepted(){
        this.onSelectedItems(this.state.gridSelectedRowKeys.sort((a,b) => a - b));
    }

    descripcionVisual(item) {
        return item.codigoSasa + " (" + item.direccionFormateada + ")"
    }

    render() {
        return (
            <div className="row">
                {this.state.items && <ADAMultipleDropDownFilter
                    keyExpr={'edificioId'}
                    items={this.state.items}
                    deferRendering={false}
                    showClearButton={true}
                    placeholder={'Seleccione uno o varios edificios...'}
                    dataGridOnSelectionChanged={this.dataGridOnSelectionChanged}
                    descripcionVisual={this.descripcionVisual}
                    ModoSingleSelection={this.props.ModoSingleSelection}
                    selectedItems={this.state.selectedItems}
                    >

                    <Column dataField="edificioId" caption="EdificioId" allowEditing={false} visible={false} ></Column>
                    <Column dataField="codigoReemplazo" caption="Código Reemplazo" allowEditing={false} width="auto" ></Column>
                    <Column dataField="codigoSasa" caption="CodigoSASA" allowEditing={false} width="auto"></Column>
                    <Column dataField="direccionFormateada" caption="Dirección" allowEditing={false} ></Column>

                </ADAMultipleDropDownFilter>}
            </div>
        );
    }
}