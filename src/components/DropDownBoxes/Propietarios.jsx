import React from 'react';

import { Column } from 'devextreme-react/data-grid';

import ADADropDownFilter from './ADADropDownFilter';

export default class Propietarios extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            idComponente: Math.random().toString().replace(".", ""),
            gridBoxValue: '',
            gridSelectedRowKeys: []
        };

    }

    descripcionVisual(personaDepartamento) {

        var descripcion = '';

        if (personaDepartamento.personaId) {

            descripcion = `${personaDepartamento.nombre} ${personaDepartamento.apellido}`;
        }

        return descripcion;
    }

    render() {
        
        return (
            <div >
                <ADADropDownFilter
                    keyExpr={'personaId'}
                    items={this.props.propietarios}
                    placeholder={'Seleccione un propietario...'}
                    descripcionVisual={this.descripcionVisual}
                    onSelectedItem={this.props.onSelectedItem}
                    onCleanSelection={this.props.onCleanSelection}
                    columnIndexFocus={1}
                >

                    <Column dataField="personaId" caption="PersonaId" allowEditing={false} visible={false}></Column>
                    <Column dataField="departamentoId" caption="DepartamentoId" allowEditing={false} visible={false}></Column>
                    <Column dataField="nombre" caption="Nombre" allowEditing={false} ></Column>
                    <Column dataField="apellido" caption="Apellido" allowEditing={false} ></Column>

                </ADADropDownFilter>

            </div>
        );
    }
}