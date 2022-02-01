import React from 'react';

import {Column} from 'devextreme-react/data-grid';

import { EdificioService } from '../../services/EdificioService';
import ADADropDownFilter from './ADADropDownFilter';
import './adaDropDownBoxes.css';

export default class Edificios extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            idComponente: Math.random().toString().replace(".", ""),
            gridBoxValue: '',
            gridSelectedRowKeys: [],
            items: [],
            selectedItemId: this.props.edificioId || parseInt(localStorage.getItem("Edificios_selectedItemId"))
        };

        this.refrescar = this.refrescar.bind(this);
        this.onSelectedItem = this.onSelectedItem.bind(this);
        this.onCleanSelection = this.onCleanSelection.bind(this);       
        this.descripcionVisual = this.descripcionVisual.bind(this);

        this.refrescar();
    }

    refrescar() {
        EdificioService.listar(data => {
            this.setState({ items: data });

            if (this.state.selectedItemId) {
                this.props.onSelectedItem(this.state.selectedItemId);
            }
        });
    }

    descripcionVisual(edificio) {
        if (edificio === undefined) {
            edificio = this.state.items.find(x => x.edificioId.toString() === this.state.selectedItemId);
        }

        var descripcion = '';

        if (edificio && edificio.codigoSasa) {    
            descripcion = `${edificio.codigoSasa} ${edificio.direccion !== null ? " - " + edificio.direccion.direccionFormateada : ""}`;
        }

        return descripcion;
    }

    onSelectedItem(edificioId) {
        localStorage.setItem("Edificios_selectedItemId", edificioId);
        this.setState({ selectedItemId: edificioId });
        this.props.onSelectedItem(edificioId);
    }

    onCleanSelection() {
        localStorage.setItem("Edificios_selectedItemId", null);
        this.setState({ selectedItemId: null });
        this.props.onCleanSelection();
    }

    render() {
        return (
            <div>
                <ADADropDownFilter
                    keyExpr={'edificioId'}
                    items={this.state.items}
                    placeholder={'Seleccione un edificio...'}
                    descripcionVisual={this.descripcionVisual}
                    onSelectedItem={this.onSelectedItem}
                    onCleanSelection={this.onCleanSelection} 
                    selectedItemId={this.state.selectedItemId}
                    columnIndexFocus={0}
                    >

                    <Column dataField="edificioId" caption="EdificioId" allowEditing={false} visible={false} ></Column>
                    <Column dataField="codigoSasa" caption="CodigoSASA" allowEditing={false} ></Column>
                    <Column dataField="direccion.direccionFormateada" caption="Direccion" allowEditing={false} ></Column>
                    <Column dataField="identificador" caption="CUIT" allowEditing={false} ></Column>

                </ADADropDownFilter>

            </div>
        );
    }
}