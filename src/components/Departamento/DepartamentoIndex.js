import React from "react";

import {
    Column,
    Lookup,
    RequiredRule,
    RangeRule,
    CustomRule
} from "devextreme-react/data-grid";
import { EdificioService } from "../../services/EdificioService";
import { DepartamentoService } from "../../services/DepartamentoService";
import { EstadoJudicialService } from "../../services/EstadoJudicialService";
import { TipoDeDepartamentoService } from "../../services/TipoDeDepartamentoService";
import { EstadoDepartamentoService } from "../../services/EstadoDepartamentoService";
import { PersonaDepartamentoService } from "../../services/PersonaDepartamentoService";

import ADAGrid from "../Grid/ADAGrid";
import { Notifier } from "../Grid/Notifier";

import Edificios from "../DropDownBoxes/Edificios";
import { ABMPersonasIndex } from "../ABMPersonas/ABMPersonas";

export class DepartamentoIndex extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            edificioId: null,
            items: [],
            filterItems: [],
            edificios: [],
            estadosJudiciales: [],
            tiposDeDepartamentos: [],
            estadosDepartamentos: [],
            propietarios: new Map(),

            dataABMId: 0,
            nuevo: true,
            abrirABMPersonas: false,
        };

        //lleno la grilla
        this.refrescar();

        //lleno los edificios
        EdificioService.listarAutocomplete((data) =>
            this.setState({ edificios: data })
        );

        //lleno los tipos de estadosJudiciales
        EstadoJudicialService.listarAutocomplete((data) =>
            this.setState({ estadosJudiciales: data })
        );

        //lleno los tipos de tiposDeDepartamentos
        TipoDeDepartamentoService.listarAutocomplete((data) =>
            this.setState({ tiposDeDepartamentos: data })
        );

        //lleno los tipos de estadosDepartamentos
        EstadoDepartamentoService.listarAutocomplete((data) =>
            this.setState({ estadosDepartamentos: data })
        );

        this.onEdificioSeleccionado = this.onEdificioSeleccionado.bind(this);
        this.onCleanSelection = this.onCleanSelection.bind(this);
        this.onRowUpdated = this.onRowUpdated.bind(this);
        this.onEditingStart = this.onEditingStart.bind(this);
        this.onValidarRepetidos = this.onValidarRepetidos.bind(this);
        this.calcularTitulo = this.calcularTitulo.bind(this);
        

        //opciones del menu contextual
        this.onContextMenuItems = this.onContextMenuItems.bind(this);
        this.modificarPropietario = this.modificarPropietario.bind(this);
        this.nuevoPropietario = this.nuevoPropietario.bind(this);
        this.closePopupAbmPersonas = this.closePopupAbmPersonas.bind(this);

    }

    refrescar() {
        DepartamentoService.listar((data) => {
            this.setState(
                {
                    items: data,
                    filterItems:
                        this.state.edificioId !== null
                            ? data.filter((item) => item.edificioId === this.state.edificioId)
                            : data,
                }
            );
        });
    }

    closePopupAbmPersonas() {
        this.setState(
            {
                abrirABMPersonas: false,
            },
            () => this.refrescar()
        );
    }

    modificarPropietario(e) {
        let dataABMId = this.state.filterItems.findIndex((item) => {
            return item.departamentoId === e.key;
        });
        this.setState({
            dataABMId: dataABMId,
            abrirABMPersonas: true,
            nuevo: false,
        });
    }

    nuevoPropietario(e) {
        let dataABMId = this.state.filterItems.findIndex((item) => {
            return item.departamentoId === e.key;
        });
        this.setState({
            dataABMId: dataABMId,
            abrirABMPersonas: true,
            nuevo: true,
        });
    }

    onValidarRepetidos(e) {
        //busco si hay repetidos para: unidad piso y departamento
        const count = this.state.filterItems.filter(x => x.unidad === e.data.unidad
            && x.piso === e.data.piso
            && x.codDepartamento === e.data.codDepartamento
            && x.edificioId === e.data.edificioId
            && x.departamentoId !== e.data.departamentoId).length;

        return count === 0 ? true : false;
    }

    onContextMenuItems(e) {
        if (e.row && e.row.rowType === "data") {
            e.items = [
                {
                    text: "Modificar propietario",
                    onItemClick: () => this.modificarPropietario(e.row),
                },
                {
                    text: "Nuevo propietario",
                    onItemClick: () => this.nuevoPropietario(e.row),
                },
            ];
        }
    }

    onRowUpdated(e) {
        DepartamentoService.modificar(
            e.data,
            (resp) => {
                Notifier.mostrarNotificacion("operación exitosa", "success", 3000);
                this.refrescar();
            },
            (resp) => {
                Notifier.mostrarNotificacion(resp.message, "error", 3000);
                this.refrescar();
            }
        );
    }

    onEdificioSeleccionado(edificioId) {
        let listaFiltrada = this.state.items.filter(
            (item) => item.edificioId === edificioId
        );

        this.setState({
            filterItems: listaFiltrada,
            edificioId: edificioId,
        });
    }

    onCleanSelection() {
        this.setState({
            filterItems: this.state.items,
            edificioId: null,
        });
    }

    onEditingStart(e) {
        if (e.column.dataField === "propietarioId") {
            //cacheo los propietarios por edificio
            if (this.state.propietarios.get(e.data.edificioId) === undefined) {
                PersonaDepartamentoService.listarPropietarios(e.data.edificioId, data => {
                    this.setState({ propietarios: this.state.propietarios.set(e.data.edificioId, data) });
                });
            }
        }
    }

    calcularTitulo(dataAbm) {
        const titulo = this.state.edificios.find(x => x.id === dataAbm.edificioId);
        return titulo ? titulo.descripcion : "";
    }

    render() {
        //busco el item a modificar
        const dataAbm = this.state.filterItems && this.state.filterItems[this.state.dataABMId];

        return (
            <div>
                <Edificios
                    edificioId={
                        this.props.location.state
                            ? this.props.location.state.edificioId
                            : null
                    }
                    onSelectedItem={this.onEdificioSeleccionado}
                    onCleanSelection={this.onCleanSelection}
                    columnIndexFocus={0}
                />
                {this.state.items.length > 0 ?
                <ADAGrid
                    items={this.state.filterItems}
                    keyExpr={"departamentoId"}
                    onRowUpdated={this.onRowUpdated}
                    height={"calc(100vh - 110px)"}
                    onEditingStart={this.onEditingStart}
                    onContextMenuPreparing={this.onContextMenuItems}
                    allowAdding={false}
                    allowDeleting={false}
                    editingMode={"cell"}
                >

                    {this.state.edificioId === null ?
                        <Column dataField={"edificioId"} caption={"Edificio"} dataType={"number"} allowEditing={false} width={200} >
                        <Lookup
                            dataSource={this.state.edificios}
                            valueExpr={"id"}
                            displayExpr={"descripcion"}
                        />
                        <RequiredRule />
                        </Column> : null}

                    <Column dataField={"unidad"} caption={"Unidad"} dataType={"number"}>
                        <RequiredRule />
                        <CustomRule validationCallback={this.onValidarRepetidos} message={"Ya existe una unidad piso y departamento con los datos ingresados"} />
                    </Column>

                    <Column dataField={"piso"} caption={"Piso"}>
                        <CustomRule validationCallback={this.onValidarRepetidos} message={"Ya existe una unidad piso y departamento con los datos ingresados"} />
                    </Column>

                    <Column
                        dataField={"codDepartamento"}
                        caption={"Depto"}
                    >
                        <CustomRule validationCallback={this.onValidarRepetidos} message={"Ya existe una unidad piso y departamento con los datos ingresados"} />
                    </Column>

                    <Column
                        dataField={"tipoDeDepartamentoId"}
                        caption={"Tipo"}
                        dataType={"number"}
                    >
                        <Lookup
                            dataSource={this.state.tiposDeDepartamentos}
                            valueExpr={"id"}
                            displayExpr={"descripcion"}
                        />
                        <RequiredRule />
                    </Column>

                    <Column dataField={"propietarioId"} caption={"Propietario"} dataType={"number"} calculateDisplayValue={x => x.propietario}>
                        <Lookup
                            dataSource={x => x.data && this.state.propietarios.get(x.data.edificioId) }
                            valueExpr={"personaId"}
                            displayExpr={x => x ? `${x.nombre} ${x.apellido} (${x.personaId})`.trim() : ""}
                        />
                        <RequiredRule />
                    </Column>

                    <Column dataField={"telefonos"} caption={"Teléfonos"} allowEditing={false}></Column>
                    <Column dataField={"mails"} caption={"Emails"} allowEditing={false}></Column>

                    <Column dataField={"observaciones"} caption={"Obs"}></Column>

                    <Column dataField={"personasAsociadas"} caption={"Personas Asociadas"} allowEditing={false}></Column>

                    <Column
                        dataField={"backupUnidad"}
                        caption={"Backup Unidad"}
                        dataType={"number"}
                        visible={false}
                    ></Column>

                    <Column
                        dataField={"backupDepartamento"}
                        caption={"Backup Departamento"}
                        visible={false}
                    ></Column>

                    <Column
                        dataField={"estadoJudicialId"}
                        caption={"Estado En Liq"}
                        dataType={"number"}
                    >
                        <Lookup
                            dataSource={this.state.estadosJudiciales}
                            valueExpr={"id"}
                            displayExpr={"descripcion"}
                        />
                        <RequiredRule />
                    </Column>

                    <Column
                        dataField={"estadoDepartamentoId"}
                        caption={"Estado"}
                        dataType={"number"}
                    >
                        <Lookup
                            dataSource={this.state.estadosDepartamentos}
                            valueExpr={"id"}
                            displayExpr={"descripcion"}
                        />
                        <RequiredRule />
                    </Column>

                    <Column dataField={"supTotal"} caption={"Sup. Total"} dataType={"number"}>
                        <RangeRule min="0" />
                    </Column>

                    <Column
                        dataField={"SupCubierta"}
                        caption={"Sup. Cubierta"}
                        dataType={"number"}
                    >
                        <RangeRule min="0" />
                    </Column>

                    <Column
                        dataField={"ordenEnLiquidacion"}
                        caption={"Orden En Liq"}
                        dataType={"number"}
                    ></Column>

                    <Column
                        dataField={"imprimirLiquidacion"}
                        caption={"Imprimir Liquidación"}
                        dataType={"boolean"}
                    ></Column>

                    <Column
                        dataField={"identificadorCobranzaExternaId"}
                        caption={"Identificador Cobranza Externa"}
                        dataType={"number"}
                        visible={false}
                    ></Column>

                    </ADAGrid> : null }

                {this.state.abrirABMPersonas ? (
                    this.state.nuevo ? (
                        <ABMPersonasIndex
                            closePopupAbmPersonas={this.closePopupAbmPersonas}
                            departamentoId={
                                dataAbm.departamentoId
                            }
                            edificioId={
                                dataAbm.edificioId
                            }
                            unidad={dataAbm.unidad}
                            codDepartamento={dataAbm.codDepartamento}
                            piso={dataAbm.piso}
                            titulo={this.calcularTitulo(dataAbm)}
                            subTitulo={`Unidad: ${dataAbm.unidad} Cod. Departamento: ${dataAbm.codDepartamento} Piso: ${dataAbm.piso}`}
                            nuevo={this.state.nuevo}
                        />
                    ) : (
                            <ABMPersonasIndex
                                closePopupAbmPersonas={this.closePopupAbmPersonas}
                                departamentoId={
                                    dataAbm.departamentoId
                                }
                                titulo={this.calcularTitulo(dataAbm)}
                                edificioId={
                                    dataAbm.edificioId
                                }
                                subTitulo={`Unidad: ${dataAbm.unidad} Cod. Departamento: ${dataAbm.codDepartamento} Piso: ${dataAbm.piso}`}
                                nuevo={this.state.nuevo}
                            />
                        )
                ) : null}
            </div>
        );
    }
}
