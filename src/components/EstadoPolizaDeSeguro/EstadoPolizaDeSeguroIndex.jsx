import React from 'react';

import {
    Column,
    RequiredRule
} from 'devextreme-react/data-grid';

import { EstadoPolizaDeSeguroService } from '../../services/EstadoPolizaDeSeguroService';

import ADAGrid from '../Grid/ADAGrid';
import { Notifier } from '../Grid/Notifier';

export class EstadoPolizaDeSeguroIndex extends React.Component {
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
        EstadoPolizaDeSeguroService.listar(data => this.setState({ items: data }));
    }

    onRowInserted(e) {
        const id = e.data.estadoPolizaDeSeguroId;
        e.data.estadoPolizaDeSeguroId = 0;

        EstadoPolizaDeSeguroService.agregar(e.data,
            (resp) => {
                Notifier.mostrarNotificacion("operación exitosa", "success", 3000);
                this.refrescar();
            },
            (resp) => {
                Notifier.mostrarNotificacion(resp.Message, "error", 3000);
                this.refrescar();
            }
        );
        e.data.estadoPolizaDeSeguroId = id;
    }

    onRowUpdated(e) {
        EstadoPolizaDeSeguroService.modificar(e.data,
            (resp) => Notifier.mostrarNotificacion("operación exitosa", "success", 3000),
            (resp) => {
                Notifier.mostrarNotificacion(resp.Message, "error", 3000);
                this.refrescar();
            })
    }

    onRowRemoved(e) {
        EstadoPolizaDeSeguroService.borrar(e.data,
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
                    keyExpr={'estadoPolizaDeSeguroId'} 
                    onRowInserted={this.onRowInserted}
                    onRowUpdated={this.onRowUpdated}
                    onRowRemoved={this.onRowRemoved} 
                >

                    <Column dataField="estadoPolizaDeSeguroId" caption="EstadoPolizaDeSeguroId" allowEditing={false} dataType={"number"}>

                    </Column>

                    <Column dataField="descripcion" caption="Descripción" >
                        <RequiredRule />
                    </Column>
                </ADAGrid>

            </div>
        );
    }
}