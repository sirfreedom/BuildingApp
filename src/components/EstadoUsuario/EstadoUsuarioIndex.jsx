import React from 'react';

import {
    Column,
    RequiredRule
} from 'devextreme-react/data-grid';

import { EstadoUsuarioService } from '../../services/EstadoUsuarioService';

import ADAGrid from '../Grid/ADAGrid';
import { Notifier } from '../Grid/Notifier';

export class EstadoUsuarioIndex extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],   
        };

        //lleno la grilla
        this.refrescar();
        this.onRowInserted = this.onRowInserted.bind(this);
        this.onRowUpdated = this.onRowUpdated.bind(this);
        this.onRowRemoved = this.onRowRemoved.bind(this);
    }

    refrescar() {
        EstadoUsuarioService.listar(data => this.setState({ items: data }));
    }

    onRowInserted(e) {
        const id = e.data.estadoUsuarioId;
        e.data.estadoUsuarioId = 0;
        EstadoUsuarioService.agregar(e.data,
            (resp) => {
                Notifier.mostrarNotificacion("operación exitosa", "success", 3000);
                this.refrescar();
            },
            (resp) => {
                Notifier.mostrarNotificacion(resp.Message, "error", 3000);
                this.refrescar();
            }
        );
        e.data.estadoUsuarioId = id;
    }

    onRowUpdated(e) {
        EstadoUsuarioService.modificar(e.data,
            (resp) => Notifier.mostrarNotificacion("operación exitosa", "success", 3000),
            (resp) => {
                Notifier.mostrarNotificacion(resp.Message, "error", 3000);
                this.refrescar();
            })
    }

    onRowRemoved(e) {
        EstadoUsuarioService.borrar(e.data,
            (resp) => Notifier.mostrarNotificacion("operación exitosa", "success", 3000),
            (resp) => {
                Notifier.mostrarNotificacion(resp.Message, "error", 3000);
                this.refrescar();
            })
    }

    render() {
        return (
            <div>
                <ADAGrid
                    items={this.state.items}
                    keyExpr={'estadoUsuarioId'} 
                    onRowInserted={this.onRowInserted}
                    onRowUpdated={this.onRowUpdated}
                    onRowRemoved={this.onRowRemoved} 
                >

                    <Column dataField="estadoUsuarioId" caption="EstadoUsuarioId" allowEditing={false} dataType={"number"}>
                        <RequiredRule />
                    </Column>

                    <Column dataField="descripcion" caption="Descripción" >
                        <RequiredRule />
                    </Column>
                </ADAGrid>

            </div>
        );
    }
}