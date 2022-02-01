import React, { Fragment } from 'react';

import {
    Column
} from 'devextreme-react/data-grid';

import ADAGrid from '../Grid/ADAGrid';
import { Notifier } from '../Grid/Notifier';
import { ConmutadorMisExpensasService } from '../../services/ConmutadorMisExpensasService';

import { menuCopiarATodos } from '../../utils/ProcesosGrid';

export class ConmutadorMisExpensas extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: []
        };

        //lleno la grilla
        this.refrescar();

        this.onEditingStart = this.onEditingStart.bind(this);
        this.onRowUpdated = this.onRowUpdated.bind(this);

        //opciones del menu contextual
        this.onContextMenuItems = this.onContextMenuItems.bind(this);
        this.modificarBatch = this.modificarBatch.bind(this);
    }

    refrescar() {
        ConmutadorMisExpensasService.listar(data => this.setState({ items: data }));
    }

    onRowUpdated(e) {
        ConmutadorMisExpensasService.modificar(e.data,
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

        ConmutadorMisExpensasService.modificarBatch(data,
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

                    <Column dataField="formatoMisExpensas" caption="Formato Mis expensas" dataType={"boolean"} allowEditing={true} />
                </ADAGrid>

            </Fragment>
        );
    }
}