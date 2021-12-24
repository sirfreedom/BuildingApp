import React, { Fragment } from 'react';

import {
    Column,
    Lookup,
    RequiredRule
} from 'devextreme-react/data-grid';

import ADAGrid from '../Grid/ADAGrid';
import { Notifier } from '../Grid/Notifier';
import { ConmutadorGastoService } from '../../services/ConmutadorGastoService';
import { menuCopiarATodos } from '../../utils/ProcesosGrid';

export class ConmutadorGasto extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            tiposMetodoPagoGasto: [],
            tiposNumeracionGasto: [],
        };

        //lleno la grilla
        this.refrescar();

        ConmutadorGastoService.listarTiposMetodoPagoGasto((data) => this.setState({ tiposMetodoPagoGasto: data }));

        ConmutadorGastoService.listarTiposNumeracionGasto((data) => this.setState({ tiposNumeracionGasto: data }));

        this.onEditingStart = this.onEditingStart.bind(this);
        this.onRowUpdated = this.onRowUpdated.bind(this);

        //opciones del menu contextual
        this.onContextMenuItems = this.onContextMenuItems.bind(this);
        this.modificarBatch = this.modificarBatch.bind(this);
    }

    refrescar() {
        ConmutadorGastoService.listar(data => this.setState({ items: data }));
    }

    onRowUpdated(e) {
        ConmutadorGastoService.modificar(e.data,
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
            e.items= [{ text: "Copiar a todos", onItemClick: () => this.copiarATodos(e) }]
        }
    }

    copiarATodos(e) {
        menuCopiarATodos( e , () => true, this.modificarBatch )
    }

    modificarBatch(data, grid) {
        grid.beginCustomLoading();

        ConmutadorGastoService.modificarBatch(data,
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

                    <Column dataField="direccionFormateada" caption="Dirección"  fixed={true} fixedPosition="left" allowEditing={false} />

                    <Column dataField="tipoMetodoPagosGastosId" caption="Titulo metodo pago gasto" dataType={"number"} allowEditing={true}>
                        <Lookup dataSource={() => this.state.tiposMetodoPagoGasto} valueExpr={'id'} displayExpr={'descripcion'} />
                        <RequiredRule />
                    </Column>
                    
                    <Column dataField="tipoNumeracionGastosId" caption="Tipo numeracion gasto" dataType={"number"} allowEditing={true}>
                        <Lookup dataSource={() => this.state.tiposNumeracionGasto} valueExpr={'id'} displayExpr={'descripcion'} />
                        <RequiredRule />
                    </Column>

                    <Column dataField="aPartirDe" caption="Partiendo de" allowEditing={true}>
                    </Column>

                </ADAGrid>

            </Fragment>
        );
    }
}