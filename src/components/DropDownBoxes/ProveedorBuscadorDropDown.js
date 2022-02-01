import React from 'react';

import {Column} from 'devextreme-react/data-grid';

import { ProveedorService } from '../../services/ProveedorService';
import ADAMultipleDropDownFilter from './ADAMultipleDropDownFilter';
import './adaDropDownBoxes.css';

export default class ProveedoresBuscador extends React.Component {
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
        ProveedorService.listarBuscadorDropDown(data => {
            if (this.props.SelectedIds && Array.isArray(this.props.SelectedIds)){
                let selectedItems = data.filter(x => this.props.SelectedIds.includes(x.proveedorId));
                this.setState({ selectedItems: selectedItems });
                this.setState({ gridSelectedRowKeys: selectedItems.map(x => x.proveedorId) });
            }
            this.setState({ items: data });
        });
    }

    dataGridOnSelectionChanged(e) {
        this.setState({
            gridSelectedRowKeys: e.selectedRowKeys?.map(x => x.proveedorId) || []
        }, this.onAccepted);
    }

    onAccepted(){
        this.onSelectedItems(this.state.gridSelectedRowKeys.sort((a,b) => a - b));
    }

    descripcionVisual(item) {
        return item.nombre;
    }

    render() {
        return (
            <div className="row">
                {this.state.items && <ADAMultipleDropDownFilter
                    keyExpr={'proveedorId'}
                    displayExpr={'nombre'}
                    items={this.state.items}
                    deferRendering={false}
                    showClearButton={true}
                    placeholder={'Seleccione uno o varios proveedores...'}
                    dataGridOnSelectionChanged={this.dataGridOnSelectionChanged}
                    descripcionVisual={this.descripcionVisual}
                    ModoSingleSelection={this.props.ModoSingleSelection}
                    selectedItems={this.state.selectedItems}
                    >

                    <Column dataField="proveedorId" caption="proveedorId" allowEditing={false} visible={false} ></Column>
                    <Column dataField="cuit" caption="Cuit" allowEditing={false} ></Column>
                    <Column dataField="nombre" caption="Nombre" allowEditing={false} ></Column>
                    <Column dataField="codigo" caption="Código" allowEditing={false} ></Column>

                </ADAMultipleDropDownFilter>}
            </div>
        );
    }
}