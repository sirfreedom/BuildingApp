import React from 'react';

import {
    Column,
    StringLengthRule,
    RangeRule,
    Lookup,
    RequiredRule
} from 'devextreme-react/data-grid';

import { PorcentualPorLiquidacionService } from '../../services/PorcentualPorLiquidacionService';
import { EdificioService } from '../../services/EdificioService';

import ADAGrid from '../Grid/ADAGrid';
import { Notifier } from '../Grid/Notifier';

import Edificios from '../DropDownBoxes/Edificios';
import { Fragment } from 'react';

export class PorcentualPorLiquidacionIndex extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            edificioId: 0,
            items: [],
            edificios: [],
            modosDistribucion: [],
            modosDistribucionFiltrado: [],
            porcentualPorLiquidacion: [],
        };

        //lleno la grilla
        this.refrescar();

        //lleno las edificios
        EdificioService.listarAutocomplete((data) => this.setState({ edificios: data }));

        this.onEdificioSeleccionado = this.onEdificioSeleccionado.bind(this);
        this.onCleanSelection = this.onCleanSelection.bind(this);
        this.onRowInserted = this.onRowInserted.bind(this);
        this.onRowUpdated = this.onRowUpdated.bind(this);
        this.onRowRemoved = this.onRowRemoved.bind(this);
        this.onInitNewRow = this.onInitNewRow.bind(this);
        this.onEditingStart = this.onEditingStart.bind(this);
        this.onEditorPrepared = this.onEditorPrepared.bind(this);
    }

    refrescar() {
        if (this.state.edificioId === 0) return;

        PorcentualPorLiquidacionService.listarPorEdificio(this.state.edificioId, data => {
            let modosDistribucion = [{ id: -1, descripcion: 'En Partes Iguales' }];

            data.forEach(porcentualPorLiquidacion => {

                modosDistribucion.push({
                    id: porcentualPorLiquidacion.porcentualPorLiquidacionId,
                    descripcion: "Igualar a: " + porcentualPorLiquidacion.descriptor
                })
            });

            this.setState({ items: data, modosDistribucion: modosDistribucion, modosDistribucionFiltrado: modosDistribucion, onNewRow: false });
        });
    }

    onRowInserted(e) {
        const id = e.data.porcentualId;
        e.data.porcentualId = 0;
        e.data.porcentualPorLiquidacionId = 0;
        e.data.edificioId = this.state.edificioId;

        PorcentualPorLiquidacionService.agregar(e.data,
            (resp) => {
                Notifier.mostrarNotificacion("operación exitosa", "success", 3000);
                this.refrescar();
            },
            (resp) => {
                Notifier.mostrarNotificacion(resp.message, "error", 3000);
                this.refrescar();
            }
        );
        e.data.porcentualId = id;
    }

    onRowUpdated(e) {
        PorcentualPorLiquidacionService.modificar(e.data,
            (resp) => Notifier.mostrarNotificacion("operación exitosa", "success", 3000),
            (resp) => {
                Notifier.mostrarNotificacion(resp.message, "error", 3000); this.refrescar();
            })
    }

    onRowRemoved(e) {
        PorcentualPorLiquidacionService.borrar(e.data,
            (resp) => Notifier.mostrarNotificacion("operación exitosa", "success", 3000),
            (resp) => {
                Notifier.mostrarNotificacion(resp.message, "error", 3000); this.refrescar();
            })
    }

    onInitNewRow(e) {
        e.data.ordenParaCobranzas = Math.max.apply(null, this.state.items.map(x => x.ordenParaCobranzas)) + 1;
        e.data.numero = Math.max.apply(null, this.state.items.map(x => x.numero)) + 1;

        e.data.porcentualPorLiquidacionId = 0;
        e.data.gastoParticular = false;
        e.data.imprimirPorcentual = false;
        e.data.sirveParaGastos = false;
        e.data.descriptor = '';
        e.data.modoDistribucionId = -1;

        this.setState({ onNewRow: true });
    }

    onEditingStart(e) {
        this.setState({ onNewRow: false });
    }

    onEditorPrepared(e) {
        if (this.state.onNewRow) {
            if (e.parentType === "dataRow" && e.dataField === "modoDistribucionId") {
                this.setState({ onNewRow: false });
            }
        }
    }

    onEdificioSeleccionado(edificioId) {
        this.setState({
            edificioId: edificioId
        });

        this.refrescar();
    }

    onCleanSelection() {
        this.setState({
            edificioId: 0
        });
    }

    grilla() {
        return (
            <ADAGrid
                items={this.state.items}
                keyExpr={'porcentualPorLiquidacionId'}
                onRowInserted={this.onRowInserted}
                onRowUpdated={this.onRowUpdated}
                onRowRemoved={this.onRowRemoved}
                onInitNewRow={this.onInitNewRow}
                onEditingStart={this.onEditingStart}
                onEditorPrepared={this.onEditorPrepared}
                height={"calc(100vh - 110px)"}
                editingMode={"popup"}
            >

                <Column dataField="numero" caption="Número" dataType={"number"} >
                    <RangeRule min="0" max="32767" />
                </Column>

                <Column dataField="ordenParaCobranzas" caption="Orden para cobranza" dataType={"number"} >
                    <RangeRule min="0" max="32767" />
                </Column>

                <Column dataField="gastoParticular" caption="Gasto particular" allowEditing={true} dataType={"boolean"} />

                <Column dataField="imprimirPorcentual" caption="Imprimir porcentual" allowEditing={true} dataType={"boolean"} />

                <Column dataField="sirveParaGastos" caption="Sirve para Gastos" allowEditing={true} dataType={"boolean"} />

                <Column dataField="descriptor" caption="Descripción" >
                    <StringLengthRule max="100" />
                    <RequiredRule/>
                </Column>

                {this.state.onNewRow ? this.modosDistribucion() : null}

            </ADAGrid>
        )
    }

    modosDistribucion() {
        return (
            <Column dataField="modoDistribucionId" caption="Modo distribución" dataType={"number"} width={0}>
                <RequiredRule />
                <Lookup
                    key={'id'}
                    dataSource={() => this.state.modosDistribucionFiltrado}
                    valueExpr={'id'}
                    displayExpr={'descripcion'}
                />
            </Column>
        )
    }

    render() {
        return (
            <Fragment>
                <Edificios edificioId={this.props.location.state ? this.props.location.state.edificioId : null} onSelectedItem={this.onEdificioSeleccionado} onCleanSelection={this.onCleanSelection} columnIndexFocus={0} />
                {this.state.edificioId > 0 ? this.grilla() : null}
            </Fragment>
        );
    }
}