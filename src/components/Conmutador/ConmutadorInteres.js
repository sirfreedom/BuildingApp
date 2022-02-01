import React, { Fragment } from 'react';

import {
    Column,
    RequiredRule,
    CustomRule
} from 'devextreme-react/data-grid';

import ADAGrid from '../Grid/ADAGrid';
import { Notifier } from '../Grid/Notifier';
import { ConmutadorInteresService } from '../../services/ConmutadorInteresService';
import { menuCopiarATodos } from '../../utils/ProcesosGrid';

export class ConmutadorInteres extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: []
        };

        //lleno la grilla
        this.refrescar();

        this.onEditingStart = this.onEditingStart.bind(this);
        this.onRowUpdated = this.onRowUpdated.bind(this);

        this.onChangeFechaPrimerVencimiento = this.onChangeFechaPrimerVencimiento.bind(this);
        this.onChangeFechaSegundoVencimiento = this.onChangeFechaSegundoVencimiento.bind(this);
        this.onChangePorcentajeRecargo = this.onChangePorcentajeRecargo.bind(this);

        //opciones del menu contextual
        this.onContextMenuItems = this.onContextMenuItems.bind(this);
        this.modificarBatch = this.modificarBatch.bind(this);
    }

    refrescar() {
        ConmutadorInteresService.listar(data => this.setState({ items: data }));
    }

    onRowUpdated(e) {
        ConmutadorInteresService.modificar(e.data,
            (resp) => Notifier.mostrarNotificacion("operación exitosa", "success", 3000),
            (resp) => {
                Notifier.mostrarNotificacion(resp.message, "error", 3000);
                // this.refrescar();
            });
    }

    onEditingStart(e) {

    }

    onContextMenuItems(e) {
        if (e.row && e.row.rowType === "data" && e.column.allowEditing !== false) {
            e.items = [{ text: "Copiar a todos", onItemClick: () => this.copiarATodos(e) }]
        }
    }

    copiarATodos(e) {
        menuCopiarATodos(e, () => true, this.modificarBatch)
    }

    modificarBatch(data, grid) {
        grid.beginCustomLoading();

        ConmutadorInteresService.modificarBatch(data,
            (resp) => {
                Notifier.mostrarNotificacion("operación exitosa", "success", 3000);
                //apago el spinner de loading
                grid.endCustomLoading();
                this.refrescar();
            },
            (resp) => {
                Notifier.mostrarNotificacion(resp.message, "error", 3000);
                //apago el spinner de loading
                grid.endCustomLoading();
                this.refrescar();
            }
        );
    }


    onChangeFechaPrimerVencimiento(e) {
        if (e.rule.dataField !== "fechaPrimerVencimiento") return true;

        let fechaPrimerVencimiento = new Date(e.value)
        let fechaSegundoVencimiento = new Date(e.data.fechaSegundoVencimiento)

        if (!isNaN(fechaSegundoVencimiento.getTime) && (fechaPrimerVencimiento.getTime() > fechaSegundoVencimiento.getTime())) {
            return false;
        }

        return true;
    }

    onChangeFechaSegundoVencimiento(e) {
        if (e.rule.dataField !== "fechaSegundoVencimiento") return true;

        if (e.value === null) {
            return true
        }

        let fechaPrimerVencimiento = new Date(e.data.fechaPrimerVencimiento)
        let fechaSegundoVencimiento = new Date(e.value)

        if (fechaPrimerVencimiento.getTime() >= fechaSegundoVencimiento.getTime()) {
            return false;
        }

        return true;
    }

    onChangePorcentajeRecargo(e) {
        if (e.rule.dataField !== "porcentajeRecargo") return true;

        let fechaSegundoVencimiento = new Date(e.data.fechaSegundoVencimiento)

        if (isNaN(fechaSegundoVencimiento.getTime()) || fechaSegundoVencimiento.getTime() === 0) {
            return false;
        }

        return true;
    }

    render() {
        return (
            <Fragment>
                <ADAGrid
                    items={this.state.items}
                    keyExpr={['edificioId', 'liquidacionId']}
                    onRowUpdated={this.onRowUpdated}
                    onEditingStart={this.onEditingStart}
                    onContextMenuPreparing={this.onContextMenuItems}
                    allowAdding={false}
                    allowDeleting={false}
                    editingMode={"cell"}
                >
                    <Column dataField="codigoReemplazo" caption="Código Reemplazo" fixed={true} fixedPosition="left" allowEditing={false}>
                    </Column>

                    <Column dataField="direccionFormateada" caption="Dirección" fixed={true} fixedPosition="left" allowEditing={false} />

                    <Column dataField="fechaPrimerVencimiento" caption="Fecha 1º Vencimiento" dataType={"date"} fixed={true} fixedPosition="left">
                        <RequiredRule />
                        <CustomRule validationCallback={this.onChangeFechaPrimerVencimiento} dataField="fechaPrimerVencimiento" message="Debe ser menor a 2ºVencimiento" />
                    </Column>

                    <Column dataField="fechaSegundoVencimiento" caption="Fecha 2º Vencimiento" dataType={"date"} fixed={true} fixedPosition="left">
                        <CustomRule validationCallback={this.onChangeFechaSegundoVencimiento} dataField="fechaSegundoVencimiento" message="Debe ser mayor al 1ºVencimiento" />

                    </Column>

                    <Column dataField="porcentajeInteres" caption="% Interes" allowEditing={true} fixed={true} fixedPosition="left">
                        <RequiredRule />
                    </Column>

                    <Column dataField="porcentajeRecargo" caption="% Recargo" allowEditing={true} fixed={true} fixedPosition="left">
                        <RequiredRule />
                        <CustomRule validationCallback={this.onChangePorcentajeRecargo} dataField="porcentajeRecargo" message="Debe asignar fecha 2ºVencimiento" />
                    </Column>

                </ADAGrid>

            </Fragment>
        );
    }
}