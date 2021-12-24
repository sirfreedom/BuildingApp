import React from 'react';

import {
    Column,
    RangeRule,
    StringLengthRule,
    Lookup,
    RequiredRule
} from 'devextreme-react/data-grid';

import { ExpensaService } from '../../services/ExpensaService';
import { PorcentualService } from '../../services/PorcentualService';
import { LiquidacionService } from '../../services/LiquidacionService';
import { DepartamentoService } from '../../services/DepartamentoService';

import ADAGrid from '../Grid/ADAGrid';
import { Notifier } from '../Grid/Notifier';

export class ExpensaIndex extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            departamentos: [],
            porcentuales: [],
            liquidaciones: [], 
        };

        //lleno la grilla
        this.refrescar();

        //lleno los departamentos
        DepartamentoService.listarAutocomplete((data) => this.setState({ departamentos: data }));

        //lleno los porcentuales
        PorcentualService.listarAutocomplete((data) => this.setState({ porcentuales: data }));

        //lleno las liquidaciones
        LiquidacionService.listarAutocomplete((data) => this.setState({ liquidaciones: data }));

        this.onRowInserted = this.onRowInserted.bind(this);
        this.onRowUpdated = this.onRowUpdated.bind(this);
        this.onRowRemoved = this.onRowRemoved.bind(this);
    }

    refrescar() {
        ExpensaService.listar(data => this.setState({ items: data }));
    }

    onRowInserted(e) {
        
        e.data.edificioId = 0;
        ExpensaService.agregar(e.data,
            (resp) => {
                Notifier.mostrarNotificacion("operación exitosa", "success", 3000);
                this.refrescar();
            },
            (resp) => {
                Notifier.mostrarNotificacion(resp.Message, "error", 3000);
                this.refrescar();
            }
        );
        
    }

    onRowUpdated(e) {
        ExpensaService.modificar(e.data,
            (resp) => Notifier.mostrarNotificacion("operación exitosa", "success", 3000),
            (resp) => {
                Notifier.mostrarNotificacion(resp.Message, "error", 3000); this.refrescar();
            })
    }

    onRowRemoved(e) {
        ExpensaService.borrar(e.data,
            (resp) => Notifier.mostrarNotificacion("operación exitosa", "success", 3000),
            (resp) => {
                Notifier.mostrarNotificacion(resp.Message, "error", 3000); this.refrescar();
            })
    }

    render() {
        return (
            <div>
                <ADAGrid
                    items={this.state.items}
                    keyExpr={'departamentoId'} 
                    onRowInserted={this.onRowInserted}
                    onRowUpdated={this.onRowUpdated}
                    onRowRemoved={this.onRowRemoved} 
                >
 
                    <Column dataField="departamentoId" caption="Departamento" dataType={"number"} >
                        <Lookup dataSource={() => this.state.departamentos} valueExpr={'id'} displayExpr={'descripcion'} />
                        <RequiredRule />
                    </Column>

                    <Column dataField="liquidacionId" caption="Liquidación" dataType={"number"}>
                        <Lookup dataSource={() => this.state.liquidaciones} valueExpr={'id'} displayExpr={'descripcion'} />
                        <RequiredRule />
                    </Column>

                    <Column dataField="porcentualId" caption="Porcentual" dataType={"number"}>
                        <Lookup dataSource={() => this.state.porcentuales} valueExpr={'id'} displayExpr={'descripcion'} />
                        <RequiredRule />
                    </Column>

                    <Column dataField="importe" caption="Importe" dataType={"number"} >
                        <RangeRule min="0" />
                    </Column>

                    <Column dataField="observaciones" caption="Observaciones" >
                        <StringLengthRule max="200" />
                    </Column>

                </ADAGrid>

            </div>
        );
    }
}