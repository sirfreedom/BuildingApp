import React, { Fragment } from 'react';

import {
    Column,
    Lookup,
    RequiredRule,
    ValidationRule
} from 'devextreme-react/data-grid';

import ADAGrid from '../Grid/ADAGrid';
import { Notifier } from '../Grid/Notifier';
import { ConmutadorLiqExpensaService } from '../../services/ConmutadorLiqExpensaService';

import { menuCopiarATodos } from '../../utils/ProcesosGrid';

export class ConmutadorLiqExpensa extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            tiposTitulosRendicionGastos: [],
            tiposDelayMail: [],
        };

        //lleno la grilla
        this.refrescar();

        ConmutadorLiqExpensaService.listarTiposTitulosRendicionGasto((data) => this.setState({ tiposTitulosRendicionGastos: data }));

        ConmutadorLiqExpensaService.listarTiposDelayMail((data) => this.setState({ tiposDelayMail: data }));

        this.onEditingStart = this.onEditingStart.bind(this);
        this.onRowUpdated = this.onRowUpdated.bind(this);

        //opciones del menu contextual
        this.onContextMenuItems = this.onContextMenuItems.bind(this);
        this.modificarBatch = this.modificarBatch.bind(this);
    }

    refrescar() {
        ConmutadorLiqExpensaService.listar(data => this.setState({ items: data }));
    }

    onRowUpdated(e) {
        ConmutadorLiqExpensaService.modificar(e.data,
            (resp) => Notifier.mostrarNotificacion("operación exitosa", "success", 3000),
            (resp) => {
                Notifier.mostrarNotificacion(resp.Message, "error", 3000);
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

        ConmutadorLiqExpensaService.modificarBatch(data,
            (resp) => {
                Notifier.mostrarNotificacion("operación exitosa", "success", 3000);
                //apago el spinner de loading
                grid.endCustomLoading();
                this.refrescar();
            },
            (resp) => {
                Notifier.mostrarNotificacion(resp.Message, "error", 3000);
                //apago el spinner de loading
                grid.endCustomLoading();
                this.refrescar();
            }
        );
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
                    width={"100%"}
                    editingMode={"cell"}
                >
                    <Column dataField="codigoReemplazo" caption="Código Reemplazo" fixed={true} fixedPosition="left" allowEditing={false}>
                    </Column>

                    <Column dataField="direccionFormateada" caption="Dirección" fixed={true} fixedPosition="left" allowEditing={false} />

                    <Column dataField="fechaLiquidacion" caption="Fecha Liquidacion" dataType={"date"} fixed={true} fixedPosition="left">
                    </Column>

                    <Column dataField="frecuencia" caption="Frecuencia" allowEditing={true} fixed={true} fixedPosition="left">
                        <ValidationRule type="range" max="255" min="1" message="Valores entre 1 y 255" />
                    </Column>

                    <Column dataField="personalizarLiquidacion" caption="Personalizar Liquidacion" dataType={"boolean"} allowEditing={true} />

                    <Column dataField="pinConsorciosEnRedEnRecibos" caption="Pin CER en recibos" dataType={"boolean"} allowEditing={true} />

                    <Column dataField="tituloColumnaGastosParticulares" caption="Titulo Gastos Particulares" />

                    <Column dataField="tipoTituloRendicionGastoId" caption="Titulo rendicion" dataType={"number"} allowEditing={true}>
                        <Lookup dataSource={() => this.state.tiposTitulosRendicionGastos} valueExpr={'id'} displayExpr={'descripcion'} />
                        <RequiredRule />
                    </Column>

                    <Column dataField="textoLibreEnTituloRendicionGasto" caption="Texto Rendicion" allowEditing={true} >
                    </Column>

                    <Column dataField="membreteAdministracion" caption="Membrete Administracion" allowEditing={true} >
                    </Column>

                    <Column dataField="imprimirListadoDeCobranzas" caption="Imprimir cobranzas" dataType={"boolean"} allowEditing={true} />

                    <Column dataField="tipoDelayMailId" caption="Tipo delay mail" dataType={"number"} allowEditing={true}>
                        <Lookup dataSource={() => this.state.tiposDelayMail} valueExpr={'id'} displayExpr={'descripcion'} />
                        <RequiredRule />
                    </Column>

                </ADAGrid>

            </Fragment>
        );
    }
}