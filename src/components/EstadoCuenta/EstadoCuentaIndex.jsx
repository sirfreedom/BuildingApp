import React from 'react';

import {
    Column,
    RequiredRule
} from 'devextreme-react/data-grid';

import { EstadoCuentaService } from '../../services/EstadoCuentaService';

import ADAGrid from '../Grid/ADAGrid';
import { Notifier } from '../Grid/Notifier';

export class EstadoCuentaIndex extends React.Component {
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
        EstadoCuentaService.listar(data => this.setState({ items: data }));
    }

    onRowInserted(e) {
        const id = e.data.estadoCuentaId;
        e.data.estadoCuentaId = 0;

        EstadoCuentaService.agregar(e.data,
            (resp) => {
                Notifier.mostrarNotificacion("operación exitosa", "success", 3000);
                this.refrescar();
            },
            (resp) => {
                Notifier.mostrarNotificacion(resp.Message, "error", 3000);
                this.refrescar();
            }
        );
        e.data.estadoCuentaId = id;
    }

    onRowUpdated(e) {
        EstadoCuentaService.modificar(e.data,
            (resp) => Notifier.mostrarNotificacion("operación exitosa", "success", 3000),
            (resp) => {
                Notifier.mostrarNotificacion(resp.Message, "error", 3000);
                this.refrescar();
            })
    }

    onRowRemoved(e) {
        EstadoCuentaService.borrar(e.data,
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
                    keyExpr={'estadoCuentaId'} 
                    onRowInserted={this.onRowInserted}
                    onRowUpdated={this.onRowUpdated}
                    onRowRemoved={this.onRowRemoved} 
                >
                  
                    <Column dataField="estadoCuentaId" caption="EstadoCuentaId" allowEditing={false} dataType={"number"}>

                    </Column>

                    <Column dataField="descripcion" caption="Descripción" >
                        <RequiredRule />
                    </Column>
                </ADAGrid>

            </div>
        );
    }
}