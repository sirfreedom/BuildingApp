import React from 'react';

import {
    Column,
    RequiredRule
} from 'devextreme-react/data-grid';

import { EstadoDepartamentoService } from '../../services/EstadoDepartamentoService';

import ADAGrid from '../Grid/ADAGrid';
import { Notifier } from '../Grid/Notifier';

export class EstadoDepartamentoIndex extends React.Component {
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
        EstadoDepartamentoService.listar(data => this.setState({ items: data }));
    }

    onRowInserted(e) {
        const id = e.data.estadoDepartamentoId;
        e.data.estadoDepartamentoId = 0;

        EstadoDepartamentoService.agregar(e.data,
            (resp) => {
                Notifier.mostrarNotificacion("operación exitosa", "success", 3000);
                this.refrescar();
            },
            (resp) => {
                Notifier.mostrarNotificacion(resp.Message, "error", 3000);
                this.refrescar();
            }
        );
        e.data.estadoDepartamentoId = id;
    }

    onRowUpdated(e) {
        EstadoDepartamentoService.modificar(e.data,
            (resp) => Notifier.mostrarNotificacion("operación exitosa", "success", 3000),
            (resp) => {
                Notifier.mostrarNotificacion(resp.Message, "error", 3000);
                this.refrescar();
            })
    }

    onRowRemoved(e) {
        EstadoDepartamentoService.borrar(e.data,
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
                    keyExpr={'estadoDepartamentoId'} 
                    onRowInserted={this.onRowInserted}
                    onRowUpdated={this.onRowUpdated}
                    onRowRemoved={this.onRowRemoved} 
                >
                    
                    <Column dataField="estadoDepartamentoId" caption="EstadoDepartamentoId" allowEditing={false} dataType={"number"}>

                    </Column>

                    <Column dataField="descripcion" caption="Descripción" >
                        <RequiredRule />
                    </Column>
                </ADAGrid>

            </div>
        );
    }
}