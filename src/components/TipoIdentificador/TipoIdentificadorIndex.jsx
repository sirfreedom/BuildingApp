import React from 'react';

import {
    Column,
    RequiredRule,
} from 'devextreme-react/data-grid';

import { TipoIdentificadorService } from '../../services/TipoIdentificadorService';

import ADAGrid from '../Grid/ADAGrid';
import { Notifier } from '../Grid/Notifier';

export class TipoIdentificadorIndex extends React.Component {
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
        TipoIdentificadorService.listar(data => this.setState({ items: data }));
    }

    onRowInserted(e) {
        const id = e.data.tipoIdentificadorId;
        e.data.tipoIdentificadorId = 0;
        TipoIdentificadorService.agregar(e.data,
            (resp) => {
                Notifier.mostrarNotificacion("operación exitosa", "success", 3000);
                this.refrescar(); 
            },
            (resp) => {
                Notifier.mostrarNotificacion(resp.Message, "error", 3000);
                this.refrescar();
            }
        );
        e.data.tipoIdentificadorId = id;
    }

    onRowUpdated(e) {
        TipoIdentificadorService.modificar(e.data,
            (resp) => Notifier.mostrarNotificacion("operación exitosa", "success", 3000),
            (resp) => {
                Notifier.mostrarNotificacion(resp.Message, "error", 3000);
                this.refrescar();
            })
    }

    onRowRemoved(e) {
        TipoIdentificadorService.borrar(e.data,
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
                    keyExpr={'tipoIdentificadorId'} 
                    onRowInserted={this.onRowInserted}
                    onRowUpdated={this.onRowUpdated}
                    onRowRemoved={this.onRowRemoved} 
                >
                    
                    <Column dataField="tipoIdentificadorId" defaultSortOrder="desc" caption="TipoIdentificadorId" allowEditing={false} dataType={"number"} >
                    </Column>
                    <Column dataField="descripcion" caption="Descripción" >
                        <RequiredRule />
                    </Column>
                </ADAGrid>

            </div>
        );
    }
}