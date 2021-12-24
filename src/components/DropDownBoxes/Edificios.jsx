import React from 'react';

import {Column} from 'devextreme-react/data-grid';

import { EdificioService } from '../../services/EdificioService';
import ADADropDownFilter from './ADADropDownFilter';

export default class Edificios extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            idComponente: Math.random().toString().replace(".", ""),
            gridBoxValue: '',
            gridSelectedRowKeys: [],
            items: [],
            selectedItemId: this.props.edificioId
        };

        this.refrescar = this.refrescar.bind(this);
        this.onSelectedItem = this.onSelectedItem.bind(this);
        this.onCleanSelection = this.onCleanSelection.bind(this);        

        this.refrescar();
    }

    refrescar() {
        EdificioService.listar(data => {
            this.setState({ items: data });

            if (this.props.edificioId) {
                this.props.onSelectedItem(this.props.edificioId);
            }
        });
    }

    descripcionVisual(edificio) {

        var descripcion = '';

        if (edificio && edificio.codigoSasa) {    
            descripcion = `${edificio.codigoSasa} ${edificio.direccion !== null ? " - " + edificio.direccion.direccionFormateada : ""}`;
        }

        return descripcion;
    }

    onSelectedItem(edificioId) {
        this.setState({ selectedItemId: null});
        this.props.onSelectedItem(edificioId);
    }

    onCleanSelection() {
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