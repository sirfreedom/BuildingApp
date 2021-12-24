import React, { Fragment } from 'react';

import {
    Column,
    Lookup,
    RequiredRule,
} from 'devextreme-react/data-grid';

import ADAGrid from '../Grid/ADAGrid';
import { Notifier } from '../Grid/Notifier';
import { ConmutadorReciboService } from '../../services/ConmutadorReciboService';

import { menuCopiarATodos } from '../../utils/ProcesosGrid';

export class ConmutadorRecibo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            tiposImpresionReciboMesActual: [],
            tiposImpresionReciboMesAnterior: [],
        };

        //lleno la grilla
        this.refrescar();

        ConmutadorReciboService.listarTiposImpresionReciboMesActual((data) => this.setState({ tiposImpresionReciboMesActual: data }));

        ConmutadorReciboService.listarTiposImpresionReciboMesAnterior((data) => this.setState({ tiposImpresionReciboMesAnterior: data }));

        this.onEditingStart = this.onEditingStart.bind(this);
        this.onRowUpdated = this.onRowUpdated.bind(this);

        //opciones del menu contextual
        this.onContextMenuItems = this.onContextMenuItems.bind(this);
        this.modificarBatch = this.modificarBatch.bind(this);
    }

    refrescar() {
        ConmutadorReciboService.listar(data => this.setState({ items: data }));
    }

    onRowUpdated(e) {
        ConmutadorReciboService.modificar(e.data,
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

        ConmutadorReciboService.modificarBatch(data,
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
                    <Column dataField="codigoReemplazo" caption="Código Reemplazo" width={80} fixed={true} fixedPosition="left" allowEditing={false}>
                    </Column>

                    <Column dataField="direccionFormateada" caption="Dirección" fixed={true} fixedPosition="left" allowEditing={false} />

                    <Column dataField="numeradosAPartir" caption="Numerados desde" allowEditing={true} >
                    </Column>

                    <Column dataField="tipoImpresionReciboMesActualId" caption="Impresion recibo mes actual" dataType={"number"} allowEditing={true}>
                        <Lookup dataSource={() => this.state.tiposImpresionReciboMesActual} valueExpr={'id'} displayExpr={'descripcion'} />
                        <RequiredRule />
                    </Column>

                    <Column dataField="tipoImpresionReciboMesAnteriorId" caption="Impresion recibo mes anterior" dataType={"number"} allowEditing={true}>
                        <Lookup dataSource={() => this.state.tiposImpresionReciboMesAnterior} valueExpr={'id'} displayExpr={'descripcion'} />
                        <RequiredRule />
                    </Column>
                </ADAGrid>

            </Fragment>
        );
    }
}