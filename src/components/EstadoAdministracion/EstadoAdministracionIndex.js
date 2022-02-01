import React from 'react';

import {
    Column,
    RequiredRule
} from 'devextreme-react/data-grid';

import { EstadoAdministracionService } from '../../services/EstadoAdministracionService';

import ADAGrid from '../Grid/ADAGrid';
import { Notifier } from '../Grid/Notifier';

export class EstadoAdministracionIndex extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: []            
        };

        //lleno la grilla
        this.refrescar();

        this.onRowInserted = this.onRowInserted.bind(this);
        this.onRowUpdated = this.onRowUpdated.bind(this);
        this.onRowRemoved = this.onRowRemoved.bind(this);
    }

    refrescar() {
        EstadoAdministracionService.listar(data => this.setState({ items: data }));
    }

    onRowInserted(e) {
        const id = e.data.estadoAdministracionId;
        e.data.estadoAdministracionId = 0;
        EstadoAdministracionService.agregar(e.data,
            (resp) => {
                Notifier.mostrarNotificacion("operación exitosa", "success", 3000);
                this.refrescar();
            },
            (resp) => {
                Notifier.mostrarNotificacion(resp.message, "error", 3000);
                this.refrescar();
            }
        );
        e.data.estadoAdministracionId = id;
    }

    onRowUpdated(e) {
        EstadoAdministracionService.modificar(e.data,
            (resp) => Notifier.mostrarNotificacion("operación exitosa", "success", 3000),
            (resp) => {
                Notifier.mostrarNotificacion(resp.message, "error", 3000);
                this.refrescar();
            })
    }

    onRowRemoved(e) {
        EstadoAdministracionService.borrar(e.data,
            (resp) => Notifier.mostrarNotificacion("operación exitosa", "success", 3000),
            (resp) => {
                Notifier.mostrarNotificacion(resp.message, "error", 3000);
                this.refrescar();
            })
    }

    render() {
        return (
            <div>
                <ADAGrid
                    items={this.state.items}
                    keyExpr={'estadoAdministracionId'} 
                    onRowInserted={this.onRowInserted}
                    onRowUpdated={this.onRowUpdated}
                    onRowRemoved={this.onRowRemoved} 
                >
                   
                    <Column dataField="estadoAdministracionId" caption="EstadoAdministracionId" allowEditing={false} dataType={"number"}>
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