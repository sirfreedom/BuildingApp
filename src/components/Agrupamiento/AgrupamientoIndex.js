import React from 'react';

import { AgrupamientoService } from '../../services/AgrupamientoService';
import { EdificioService } from '../../services/EdificioService';

import ADAGrid from '../Grid/ADAGrid';
import { Notifier } from '../Grid/Notifier';

import Edificios from '../DropDownBoxes/Edificios';
import {
    Column,
    Editing,
    Lookup,
    RowDragging,
    Sorting
} from 'devextreme-react/data-grid';

export class AgrupamientoIndex extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            dataTable: [],
            edificios: [],
            edificioSelected: null,
            expensas: [],
            liquidacionId: -1
        };

        AgrupamientoService.listarMisExpensas((data) => this.setState({ expensas: data }));
        EdificioService.listarAutocomplete((data) => this.setState({ edificios: data }));

        this.allowChanges = this.allowChanges.bind(this)
        this.handleRowRemoved = this.handleRowRemoved.bind(this)
        this.onEdificioSeleccionado = this.onEdificioSeleccionado.bind(this)
        this.onEditorPreparing = this.onEditorPreparing.bind(this)
        this.onInitNewRow = this.onInitNewRow.bind(this)
        this.onReorder = this.onReorder.bind(this)
        this.onSaving = this.onSaving.bind(this)
        this.saveGridInstance = this.saveGridInstance.bind(this)
    }

    allowChanges(e) {
        let allowChanges = this.state.expensas.findIndex(agrupamiento => {
            return agrupamiento.descripcion === e.row.data.descripcion
        })
        return allowChanges === -1
    }

    handleRowRemoved(ordenRemoved) {
        if (ordenRemoved >= this.ordenMax()) {
            return []
        } else {
            let promises = [];
            for (let index = ordenRemoved; index < this.state.dataTable.length; index++) {
                let updateObjeto = {
                    ...this.state.dataTable[index],
                    orden: this.state.dataTable[index].orden - 1
                }
                promises.push(AgrupamientoService.modificar(updateObjeto,
                    (resp) => {
                        Notifier.mostrarNotificacion("operación exitosa", "success", 3000);
                    },
                    (resp) => {
                        Notifier.mostrarNotificacion(resp.Message, "error", 3000);
                    }
                ))
            }
            return promises
        }
    }

    onEdificioSeleccionado(edificioId) {
        this.setState({ edificioSelected: edificioId })
        AgrupamientoService.listar(edificioId, data => this.setState({
            dataTable: data, liquidacionId: data.length ? data[0].liquidacionId : -1
        }))
    }

    onEditorPreparing(e) {
        if (e.dataField === "orden") {
            e.editorOptions.disabled = true;
        }
    }

    onInitNewRow(e) {
        let agrupamientoOtros = this.state.expensas.find(agrupamiento => {
            return agrupamiento.descripcion.toLowerCase() === "otros"
        })

        e.data.orden = this.ordenMax() + 1;
        e.data.agrupamientoId = agrupamientoOtros.id;
    }

    onReorder(e) {
        e.component.beginUpdate();
        let toItemOrden = e.component.cellValue(e.toIndex, 'orden');
        if (e.fromIndex < e.toIndex) {
            e.component.cellValue(e.fromIndex, 'orden', toItemOrden);
            for (let index = e.fromIndex + 1; index <= e.toIndex; index++) {
                e.component.cellValue(index, 'orden', e.component.cellValue(index, 'orden') - 1);
            }
        } else if (e.fromIndex > e.toIndex) {
            e.component.cellValue(e.fromIndex, 'orden', toItemOrden);
            for (let index = e.toIndex; index < e.fromIndex; index++) {
                e.component.cellValue(index, 'orden', e.component.cellValue(index, 'orden') + 1);
            }
        }
        e.component.saveEditData()
    }

    onSaving(e) {
        e.cancel = true
        let promises = []

        e.changes.forEach(change => {
            switch (change.type) {
                case 'insert':
                    let insertObjeto = {
                        agrupamientoPorLiquidacionId: 0,
                        liquidacionId: this.state.liquidacionId,
                        agrupamientoId: change.data.agrupamientoId || change.key.agrupamientoId,
                        descripcion: change.data.descripcion || change.key.descripcion,
                        orden: change.data.orden || change.key.orden
                    }
                    promises.push(AgrupamientoService.agregar(insertObjeto,
                        (resp) => {
                            Notifier.mostrarNotificacion("operación exitosa", "success", 3000);
                        },
                        (resp) => {
                            Notifier.mostrarNotificacion(resp.Message, "error", 3000);
                        }
                    ))
                    break;
                case 'update':
                    let updateObjeto = {
                        agrupamientoPorLiquidacionId: change.data.agrupamientoPorLiquidacionId || change.key.agrupamientoPorLiquidacionId,
                        liquidacionId: this.state.liquidacionId,
                        agrupamientoId: change.data.agrupamientoId || change.key.agrupamientoId,
                        descripcion: change.data.descripcion || change.key.descripcion,
                        orden: change.data.orden || change.key.orden
                    }
                    promises.push(AgrupamientoService.modificar(updateObjeto,
                        (resp) => {
                            Notifier.mostrarNotificacion("operación exitosa", "success", 3000);
                        },
                        (resp) => {
                            Notifier.mostrarNotificacion(resp.Message, "error", 3000);
                        }
                    ))
                    break;
                case 'remove':
                    let removeObjeto = {
                        agrupamientoPorLiquidacionId: change.key.agrupamientoPorLiquidacionId,
                        liquidacionId: this.state.liquidacionId
                    }

                    promises.push(AgrupamientoService.borrar(removeObjeto,
                        (resp) => {
                            Notifier.mostrarNotificacion("operación exitosa", "success", 3000);
                        },
                        (resp) => {
                            Notifier.mostrarNotificacion(resp.Message, "error", 3000);
                        }
                    ))
                    promises.push(this.handleRowRemoved(change.key.orden))
                    break;
                default:
                    break;
            }
        })
        Promise.all(promises).then(
            () => {
                AgrupamientoService.listar(this.state.edificioSelected, data => this.setState({
                    dataTable: data, liquidacionId: data.length ? data[0].liquidacionId : -1
                }))
                this.gridInstance.cancelEditData();
                this.gridInstance.endUpdate();
            })
    }

    ordenMax() {
        return this.state.dataTable.length
    }

    saveGridInstance(e) {
        this.gridInstance = e.component
    }

    render() {

        return (
            <div>
                <Edificios onSelectedItem={this.onEdificioSeleccionado} />

                {
                    this.state.dataTable.length <= 0 ?
                        '' :
                        (
                            <ADAGrid
                                items={this.state.dataTable}
                                key="agrupamientoPorLiquidacionId"
                                keyboardNavigation={{
                                    enabled: true,
                                    enterKeyDirection: "none"
                                }}
                                onEditorPreparing={this.onEditorPreparing}
                                onInitialized={this.saveGridInstance}
                                onInitNewRow={this.onInitNewRow}
                                onSaving={this.onSaving}
                                width="auto"
                            >
                                <Column
                                    allowEditing={true}
                                    allowSorting={true}
                                    caption="Orden"
                                    dataField="orden"
                                    fixed="true"
                                    fixedPosition="left"
                                    sortOrder="asc"
                                >
                                </Column>
                                <Column
                                    allowSorting={false}
                                    caption="Agrupamiento"
                                    dataField="descripcion"
                                />
                                <Column
                                    allowSorting={false}
                                    caption='Agrupamientos "Mis Expensas"'
                                    dataField="agrupamientoId"
                                    fixed="true"
                                    fixedPosition="right"
                                >
                                    <Lookup
                                        dataSource={this.state.expensas}
                                        displayExpr="descripcion"
                                        valueExpr="id"
                                    />
                                </Column>
                                <Editing
                                    allowAdding={true}
                                    allowDeleting={this.allowChanges}
                                    allowUpdating={this.allowChanges}
                                    mode="row"
                                />
                                <RowDragging
                                    allowReordering={true}
                                    onReorder={this.onReorder}
                                />
                                <Sorting mode="single" />
                            </ADAGrid>

                        )
                }

            </div>
        );
    }
}
