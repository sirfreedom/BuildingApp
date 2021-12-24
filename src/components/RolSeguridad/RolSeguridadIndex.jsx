import React from 'react';

import {
    Column,
    RequiredRule
} from 'devextreme-react/data-grid';

import { RolSeguridadService } from '../../services/RolSeguridadService';

import ADAGrid from '../Grid/ADAGrid';
import { Notifier } from '../Grid/Notifier';

export class RolSeguridadIndex extends React.Component {
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
        RolSeguridadService.listar(data => this.setState({ items: data }));
    }

    onRowInserted(e) {
        const id = e.data.rolSeguridadId;
        e.data.rolSeguridadId = 0;
        RolSeguridadService.agregar(e.data,
            (resp) => {
                Notifier.mostrarNotificacion("operación exitosa", "success", 3000);
                this.refrescar();
            },
            (resp) => {
                Notifier.mostrarNotificacion(resp.Message, "error", 3000);
                this.refrescar();
            }
        );
        e.data.rolSeguridadId = id;
    }

    onRowUpdated(e) {
        RolSeguridadService.modificar(e.data,
            (resp) => Notifier.mostrarNotificacion("operación exitosa", "success", 3000),
            (resp) => {
                Notifier.mostrarNotificacion(resp.Message, "error", 3000);
                this.refrescar();
            })
    }

    onRowRemoved(e) {
        RolSeguridadService.borrar(e.data,
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
                    keyExpr={'rolSeguridadId'} 
                    onRowInserted={this.onRowInserted}
                    onRowUpdated={this.onRowUpdated}
                    onRowRemoved={this.onRowRemoved} 
                >

                    <Column dataField="rolSeguridadId" caption="RolSeguridadId" allowEditing={false} dataType={"number"}>
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