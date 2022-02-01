import React from 'react';

import {
    Column,
    RequiredRule,
} from 'devextreme-react/data-grid';

import { TipoDeDepartamentoService } from '../../services/TipoDeDepartamentoService';

import ADAGrid from '../Grid/ADAGrid';
import { Notifier } from '../Grid/Notifier';

export class TipoDeDepartamentoIndex extends React.Component {
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
        TipoDeDepartamentoService.listar(data => this.setState({ items: data }));
    }

    onRowInserted(e) {
        const id = e.data.tipoDeDepartamentoId;
        e.data.tipoDeDepartamentoId = 0;
        TipoDeDepartamentoService.agregar(e.data,
            (resp) => {
                Notifier.mostrarNotificacion("operación exitosa", "success", 3000);
                this.refrescar();
            },
            (resp) => {
                Notifier.mostrarNotificacion(resp.message, "error", 3000);
                this.refrescar();
            }
        );
        e.data.tipoDeDepartamentoId = id;
    }

    onRowUpdated(e) {
        TipoDeDepartamentoService.modificar(e.data,
            (resp) => Notifier.mostrarNotificacion("operación exitosa", "success", 3000),
            (resp) => {
                Notifier.mostrarNotificacion(resp.message, "error", 3000);
                this.refrescar();
            })
    }

    onRowRemoved(e) {
        TipoDeDepartamentoService.borrar(e.data,
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
                    keyExpr={'tipoDeDepartamentoId'} 
                    onRowInserted={this.onRowInserted}
                    onRowUpdated={this.onRowUpdated}
                    onRowRemoved={this.onRowRemoved} 
                >
                 
                    <Column dataField="tipoDeDepartamentoId" defaultSortOrder="desc" caption="TipoDeDepartamentoId" allowEditing={false} dataType={"number"} >
                    </Column>
                    <Column dataField="descriptor" caption="Descripción" >
                        <RequiredRule />
                    </Column>
                </ADAGrid>

            </div>
        );
    }
}