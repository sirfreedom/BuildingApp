import React from 'react';

import {
    Column,
    RequiredRule
} from 'devextreme-react/data-grid';

import { ComplejoUrbanisticoService } from '../../services/ComplejoUrbanisticoService';

import ADAGrid from '../Grid/ADAGrid';
import { Notifier } from '../Grid/Notifier';

export class ComplejoUrbanisticoIndex extends React.Component {
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
        ComplejoUrbanisticoService.listar(data => this.setState({ items: data }));
    }

    onRowInserted(e) {
        const id = e.data.complejoUrbanisticoId;
        e.data.complejoUrbanisticoId = 0;

        ComplejoUrbanisticoService.agregar(e.data,
            (resp) => {
                Notifier.mostrarNotificacion("operación exitosa", "success", 3000);
                this.refrescar();
            },
            (resp) => {
                Notifier.mostrarNotificacion(resp.message, "error", 3000);
                this.refrescar();
            }
        );
        e.data.complejoUrbanisticoId = id;
    }

    onRowUpdated(e) {
        ComplejoUrbanisticoService.modificar(e.data,
            (resp) => Notifier.mostrarNotificacion("operación exitosa", "success", 3000),
            (resp) => {
                Notifier.mostrarNotificacion(resp.message, "error", 3000);
                this.refrescar();
            })
    }

    onRowRemoved(e) {
        ComplejoUrbanisticoService.borrar(e.data,
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
                    keyExpr={'complejoUrbanisticoId'} 
                    onRowInserted={this.onRowInserted}
                    onRowUpdated={this.onRowUpdated}
                    onRowRemoved={this.onRowRemoved} 
                >
                   
                    <Column dataField="complejoUrbanisticoId" caption="ComplejoUrbanisticoId" allowEditing={false} dataType={"number"}>

                    </Column>

                    <Column dataField="descripcion" caption="Descripción" >
                        <RequiredRule />
                    </Column>
                </ADAGrid>

            </div>
        );
    }
}