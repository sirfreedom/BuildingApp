import React from 'react';

import {
    Column,
    RequiredRule
} from 'devextreme-react/data-grid';

import { EstadoGastoService } from '../../services/EstadoGastoService';

import ADAGrid from '../Grid/ADAGrid';
import { Notifier } from '../Grid/Notifier';

export class EstadoGastoIndex extends React.Component {
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
        EstadoGastoService.listar(data => this.setState({ items: data }));
    }

    onRowInserted(e) {
        const id = e.data.estadoGastoId;
        e.data.estadoGastoId = 0;

        EstadoGastoService.agregar(e.data,
            (resp) => {
                Notifier.mostrarNotificacion("operación exitosa", "success", 3000);
                this.refrescar();
            },
            (resp) => {
                Notifier.mostrarNotificacion(resp.Message, "error", 3000);
                this.refrescar();
            }
        );
        e.data.estadoGastoId = id;
    }

    onRowUpdated(e) {
        EstadoGastoService.modificar(e.data,
            (resp) => Notifier.mostrarNotificacion("operación exitosa", "success", 3000),
            (resp) => {
                Notifier.mostrarNotificacion(resp.Message, "error", 3000);
                this.refrescar();
            })
    }

    onRowRemoved(e) {
        EstadoGastoService.borrar(e.data,
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
                    keyExpr={'estadoGastoId'} 
                    onRowInserted={this.onRowInserted}
                    onRowUpdated={this.onRowUpdated}
                    onRowRemoved={this.onRowRemoved} 
                >
                    
                    <Column dataField="estadoGastoId" caption="EstadoGastoId" allowEditing={false} dataType={"number"}>

                    </Column>

                    <Column dataField="descripcion" caption="Descripción" >
                        <RequiredRule />
                    </Column>
                </ADAGrid>

            </div>
        );
    }
}