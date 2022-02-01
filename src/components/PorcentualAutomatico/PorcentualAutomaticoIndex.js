import React from 'react';

import Button from "devextreme-react/button";
import {
    Column,
    Editing,
    Export,
    RequiredRule,
    Summary
} from 'devextreme-react/data-grid';
import applyChanges from "devextreme/data/apply_changes"
import { confirm } from 'devextreme/ui/dialog';

import { PorcentualPorLiquidacionService } from '../../services/PorcentualPorLiquidacionService';
import { EdificioService } from '../../services/EdificioService';

import ADAGrid from '../Grid/ADAGrid';
import { Notifier } from '../Grid/Notifier';

import Edificios from '../DropDownBoxes/Edificios';
import { PorcentualAutomaticoService } from '../../services/PorcentualAutomaticoService';

export class PorcentualAutomaticoIndex extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            columnas: [],
            colValues: [],
            dataTable: [],
            departamentos: [],
            edificios: [],
            edificioSelected: {}
        };

        //lleno los edificios
        EdificioService.listarAutocomplete((data) => this.setState({ edificios: data }));

        this.getListarPorEdificio = this.getListarPorEdificio.bind(this);
        this.headerRender = this.headerRender.bind(this);
        this.onEdificioSeleccionado = this.onEdificioSeleccionado.bind(this);
        this.onSaving = this.onSaving.bind(this);
        this.saveGridInstance = this.saveGridInstance.bind(this);
        this.onCleanSelection = this.onCleanSelection.bind(this);        
    }

    getListarPorEdificio(edificioId) {

        let edificio = this.state.edificios.find(edificio => edificio.id = edificioId)
        this.setState({ edificioSelected: edificio })

        PorcentualPorLiquidacionService.listarPorEdificio(
            edificioId, data => this.setState({ columnas: data }, () => {
                PorcentualAutomaticoService.listarPorEdificio(
                    edificioId, data => this.setState({ departamentos: data }, () => {
                        //Agregar k columnas para cada departamento
                        let dataFinal = [];
                        let i = 0;
                        let j = 0;

                        while (j < this.state.departamentos.length) {
                            dataFinal[i] = {}
                            dataFinal[i].departamentoId = this.state.departamentos[j].departamentoId
                            dataFinal[i].nombre = `Departamento ${this.state.departamentos[j].unidad}/${this.state.departamentos[j].codDepartamento}`
                            if (this.state.departamentos[j].piso !== '') dataFinal[i].nombre += ` Piso ${this.state.departamentos[j].piso}`
                            if (this.state.departamentos[j].apellido !== '') dataFinal[i].nombre += ` ${this.state.departamentos[j].apellido}`
                            if (this.state.departamentos[j].nombre !== '') dataFinal[i].nombre += `,  ${this.state.departamentos[j].nombre}`
                            for (let k = 0; k < this.state.columnas.length; k++) {
                                dataFinal[i][this.state.columnas[k].porcentualPorLiquidacionId] = this.state.departamentos[j].porcentaje
                                j++;
                            }
                            i++;
                        }
                        this.setState({ dataTable: dataFinal })
                    })
                );
            })
        );
    }

    headerRender(props) {
        let copy = this.state.colValues.length === 0

        const click = (e) => {
            e.event.stopPropagation();

            if (copy) {
                let rows = props.component.getVisibleRows();
                let vals = [];
                rows.forEach((x) => {
                    if (x.rowType === "data") {
                        vals.push(x.data[props.column.dataField]);
                    }
                });
                this.setState({ colValues: vals });
            } else {
                props.component.beginUpdate();
                this.state.colValues.forEach((x, i) => {
                    props.component.cellValue(i, props.column.dataField, x);
                });
                props.component.endUpdate();
                this.setState({ colValues: [] });
            }

        }

        return (<div>
            <Button icon={copy ? "copy" : "paste"} onClick={click} stylingMode="text" elementAttr={{ class: 'large' }} type={copy ? "normal" : "default"} />
            <span>{props.column.caption}</span>
        </div>);
    }

    modificarDatos(changes) {
        let objetos = []
        changes.forEach(change => {
            for (const key in change.data) {
                let objeto = {
                    departamentoId: change.key,
                    porcentualPorLiquidacionId: Number(key),
                    porcentaje: change.data[key].toFixed(4)
                }
                objetos.push(objeto)
            }
        });

        return Promise.all(objetos.map(objeto => {
            return PorcentualAutomaticoService.modificar(objeto,
                (resp) => {
                    Notifier.mostrarNotificacion("operación exitosa", "success", 3000);
                },
                (resp) => {
                    Notifier.mostrarNotificacion(resp.message, "error", 3000);
                }
            );
        }))
    }

    onEdificioSeleccionado(edificioId) {

        if (this.gridInstance.hasEditData()) {
            let result = confirm("<p>Se han realizado cambios en la grilla, ¿desea continuar?</p>", "Cambio Edificio");
            result.then((dialogResult) => {
                if (dialogResult) {
                    this.gridInstance.cancelEditData()
                    this.getListarPorEdificio(edificioId)
                }
            });
        } else {
            this.getListarPorEdificio(edificioId)
        }
    }

    onSaving(e) {
        e.cancel = true

        let columnasMax = []

        this.state.columnas.forEach((columna, i) => {
            let total = this.gridInstance.getTotalSummaryValue(columna.porcentualPorLiquidacionId.toString())
            if (total > 100) {
                columnasMax.push(i)
            }
        })

        if (columnasMax.length > 0) {
            let stringMax = ''
            columnasMax.forEach(i => {
                stringMax += `<p>La suma del porcentual ${this.state.columnas[i].numero} - ${this.state.columnas[i].descriptor} supera el 100%</p>`
            })
            let result = confirm(`${stringMax} <p>¿Desea cargar de todos modos?</p>`, "Confirmar Carga");
            result.then((dialogResult) => {
                if (dialogResult) {
                    this.modificarDatos(e.changes).then(() => {
                        this.setState({ dataTable: applyChanges(this.state.dataTable, e.changes, { keyExpr: "departamentoId" }) }, () => this.gridInstance.cancelEditData())
                    })
                }
            });
        } else {
            this.modificarDatos(e.changes).then(() => {
                this.setState({ dataTable: applyChanges(this.state.dataTable, e.changes, { keyExpr: "departamentoId" }) }, () => this.gridInstance.cancelEditData())
            })
        }
    }

    saveGridInstance(e) {
        this.gridInstance = e.component
    }

    onCleanSelection() {
        //limpio la grilla
        this.setState({ dataTable: [] });
    }

    render() {

        let totalItems = this.state.columnas.map(columna => {
            return {
                column: columna.porcentualPorLiquidacionId.toString(),
                summaryType: 'sum',
                valueFormat: '##0.0000'
            }
        })

        return (
            <div>
                <Edificios edificioId={this.props.location.state ? this.props.location.state.edificioId : null} onSelectedItem={this.onEdificioSeleccionado} onCleanSelection={this.onCleanSelection} columnIndexFocus={0} />

                <ADAGrid
                    export
                    height="calc(100vh - 110px)"
                    items={this.state.dataTable}
                    keyboardNavigation={{
                        editOnKeyPress: true,
                        enabled: true,
                        enterKeyAction: "moveFocus",
                        enterKeyDirection: "column"
                    }}
                    keyExpr={'departamentoId'}
                    onInitialized={this.saveGridInstance}
                    onSaving={this.onSaving}
                >
                    <Export fileName={`PorcentualesAutomaticos_${this.state.edificioSelected.descripcion}`} enabled="true" />
                    <Editing
                        mode="batch"
                        allowAdding={false}
                        allowDeleting={false}
                        allowUpdating={true}
                    />

                    <Column dataField="nombre" caption="Unidad" allowEditing={false}>
                    </Column>

                    {
                        this.state.columnas.map(columna => {
                            return <Column key={columna.porcentualPorLiquidacionId} caption={`Porcentual ${columna.numero}`}>
                                <Column
                                    format="##0.0000" dataField={columna.porcentualPorLiquidacionId.toString()}
                                    caption={`${columna.descriptor}`} allowEditing={true} dataType="number"
                                    editorOptions={{ min: 0, max: 100 }} headerCellRender={this.headerRender}
                                >
                                    <RequiredRule />
                                </Column>
                            </Column>
                        })
                    }

                    <Summary totalItems={totalItems} recalculateWhileEditing={true} displayFormat="{##0.0000}"></Summary>
                </ADAGrid>

            </div>
        );
    }
}
