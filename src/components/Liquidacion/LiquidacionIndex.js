import React from 'react';

import {
    Column,
    RequiredRule,
    StringLengthRule,
    Lookup
} from 'devextreme-react/data-grid';

import { LiquidacionService } from '../../services/LiquidacionService';
import { EdificioService } from '../../services/EdificioService';

import ADAGrid from '../Grid/ADAGrid';
import { Notifier } from '../Grid/Notifier';

export class LiquidacionIndex extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            edificios: []
        };

        //lleno la grilla
        this.refrescar();

        //lleno las edificios
        EdificioService.listarAutocomplete((data) => this.setState({ edificios: data }));

        this.onRowInserted = this.onRowInserted.bind(this);
        this.onRowUpdated = this.onRowUpdated.bind(this);
        this.onRowRemoved = this.onRowRemoved.bind(this);
    }

    refrescar() {
        LiquidacionService.listar(data => this.setState({ items: data }));
    }

    onRowInserted(e) {
        const id = e.data.liquidacionId;
        e.data.liquidacionId = 0;
        LiquidacionService.agregar(e.data,
            (resp) => {
                Notifier.mostrarNotificacion("operación exitosa", "success", 3000);
                this.refrescar();
            },
            (resp) => {
                Notifier.mostrarNotificacion(resp.message, "error", 3000);
                this.refrescar();
            }
        );
        e.data.liquidacionId = id;
    }

    onRowUpdated(e) {
        LiquidacionService.modificar(e.data,
            (resp) => Notifier.mostrarNotificacion("operación exitosa", "success", 3000),
            (resp) => {
                Notifier.mostrarNotificacion(resp.message, "error", 3000); this.refrescar();
            })
    }

    onRowRemoved(e) {
        LiquidacionService.borrar(e.data,
            (resp) => Notifier.mostrarNotificacion("operación exitosa", "success", 3000),
            (resp) => {
                Notifier.mostrarNotificacion(resp.message, "error", 3000); this.refrescar();
            })
    }

    render() {
        return (
            <div>
                <ADAGrid
                    items={this.state.items}
                    keyExpr={'liquidacionId'} 
                    onRowInserted={this.onRowInserted}
                    onRowUpdated={this.onRowUpdated}
                    onRowRemoved={this.onRowRemoved} 
                >

                    <Column dataField="liquidacionId" caption="liquidacionId" allowEditing={false} dataType={"number"}>
                    </Column>

                    <Column dataField="edificioId" caption="Edificio" dataType={"number"}>
                        <Lookup dataSource={() => this.state.edificios} valueExpr={'id'} displayExpr={'descripcion'} />
                        <RequiredRule />
                    </Column>

                    <Column dataField="fechaInicio" caption="Fecha Inicio" dataType={"date"} >
                    </Column>

                    <Column dataField="fechaCierre" caption="Fecha Cierre" dataType={"date"} >
                    </Column>

                    <Column dataField="mesYanio" caption="Mes y Año" >
                        <StringLengthRule max="15" />
                    </Column>

                    <Column dataField="anioYmes" caption="Año y Mes" dataType={"number"} >
                    </Column>

                    <Column dataField="liqActual" caption="Liquidación Actual" dataType={"boolean"} />
                </ADAGrid>

            </div>
        );
    }
}