import React from 'react';

import {
    Column,
    Lookup,
    RequiredRule,
    RangeRule
} from 'devextreme-react/data-grid';

import { EdificioService } from '../../services/EdificioService';
import { DepartamentoService } from '../../services/DepartamentoService';
import { EstadoJudicialService } from '../../services/EstadoJudicialService';
import { TipoDeDepartamentoService } from '../../services/TipoDeDepartamentoService';
import { EstadoDepartamentoService } from '../../services/EstadoDepartamentoService';

import ADAGrid from '../Grid/ADAGrid';
import { Notifier } from '../Grid/Notifier';

import Edificios from '../DropDownBoxes/Edificios';


export class DepartamentoIndex extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            filterItems: [],
            edificios: [],
            estadosJudiciales: [],
            tiposDeDepartamentos: [],
            estadosDepartamentos: []
        };

        //lleno la grilla
        this.refrescar();

        //lleno los edificios
        EdificioService.listarAutocomplete((data) => this.setState({ edificios: data }));

        //lleno los tipos de estadosJudiciales
        EstadoJudicialService.listarAutocomplete((data) => this.setState({ estadosJudiciales: data }));

        //lleno los tipos de tiposDeDepartamentos
        TipoDeDepartamentoService.listarAutocomplete((data) => this.setState({ tiposDeDepartamentos: data }));

        //lleno los tipos de estadosDepartamentos
        EstadoDepartamentoService.listarAutocomplete((data) => this.setState({ estadosDepartamentos: data }));

        
        this.onEdificioSeleccionado = this.onEdificioSeleccionado.bind(this);
        this.onCleanSelection = this.onCleanSelection.bind(this);
        this.onRowInserted = this.onRowInserted.bind(this);
        this.onRowUpdated = this.onRowUpdated.bind(this);
        this.onRowRemoved = this.onRowRemoved.bind(this);    
    }

    refrescar() {
        DepartamentoService.listar(data => this.setState({ items: data, filterItems: data }));
    }

    onRowInserted(e) {
        const id = e.data.departamentoId;
        e.data.departamentoId = 0;
        DepartamentoService.agregar(e.data,
            (resp) => {
                Notifier.mostrarNotificacion("operación exitosa", "success", 3000);
                this.refrescar();
            },
            (resp) => {
                Notifier.mostrarNotificacion(resp.Message, "error", 3000);
                this.refrescar();
            }
        );
        e.data.departamentoId = id;
    }

    onRowUpdated(e) {
        
        DepartamentoService.modificar(e.data,
            (resp) => Notifier.mostrarNotificacion("operación exitosa", "success", 3000),
            (resp) => {
                Notifier.mostrarNotificacion(resp.Message, "error", 3000); this.refrescar();
            })
    }

    onRowRemoved(e) {
        DepartamentoService.borrar(e.data,
            (resp) => Notifier.mostrarNotificacion("operación exitosa", "success", 3000),
            (resp) => {
                Notifier.mostrarNotificacion(resp.Message, "error", 3000); this.refrescar();
            })
    }

    onEdificioSeleccionado(edificioId) {
       
        var listaFiltrada = this.state.items.filter((item) => item.edificioId === edificioId);

        this.setState({
            filterItems: listaFiltrada
        });
    }

    onCleanSelection() {
        this.setState({
            filterItems: this.state.items
        });
    }

    render() {
        return (
            <div>
                <Edificios edificioId={this.props.location.state ? this.props.location.state.edificioId : null} onSelectedItem={this.onEdificioSeleccionado} onCleanSelection={this.onCleanSelection} columnIndexFocus={0} />
                
                <ADAGrid
                    items={this.state.filterItems}
                    keyExpr={'departamentoId'} 
                    onRowInserted={this.onRowInserted}
                    onRowUpdated={this.onRowUpdated}
                    onRowRemoved={this.onRowRemoved}
                    >
                        <Column dataField="departamentoId" caption="departamentoId" allowEditing={false} dataType={"number"}>
                        </Column>

                        <Column dataField="tipoDeDepartamentoId" caption="Tipo De Departamento" dataType={"number"}>
                            <Lookup dataSource={() => this.state.tiposDeDepartamentos} valueExpr={'id'} displayExpr={'descripcion'} />
                            <RequiredRule />
                        </Column>

                        <Column dataField="edificioId" caption="Edificio" dataType={"number"}>
                            <Lookup dataSource={() => this.state.edificios} valueExpr={'id'} displayExpr={'descripcion'} />
                            <RequiredRule />
                        </Column>

                        <Column dataField="unidad" caption="Unidad" dataType={"number"} >
                            <RequiredRule />
                        </Column>

                        <Column dataField="codDepartamento" caption="Código Departamento" >
                        </Column>

                        <Column dataField="piso" caption="Piso" >
                        </Column>

                        <Column dataField="backupUnidad" caption="Backup Unidad" dataType={"number"}>
                        </Column>

                        <Column dataField="backupDepartamento" caption="Backup Departamento" >
                        </Column>

                        <Column dataField="observaciones" caption="Observaciones" >
                        </Column>

                        <Column dataField="supTotal" caption="Sup. Total" dataType={"number"}>
                            <RangeRule min="0" />
                        </Column>

                        <Column dataField="SupCubierta" caption="Sup. Cubierta" dataType={"number"}>
                            <RangeRule min="0" />
                        </Column>

                        <Column dataField="imprimirLiquidacion" caption="Imprimir Liquidación" dataType={"boolean"}>
                        </Column>

                        <Column dataField="estadoJudicialId" caption="Estado Judicial" dataType={"number"}>
                            <Lookup dataSource={() => this.state.estadosJudiciales} valueExpr={'id'} displayExpr={'descripcion'} />
                            {<RequiredRule />}
                        </Column>

                        <Column dataField="estadoDepartamentoId" caption="Estado Departamento" dataType={"number"}>
                            <Lookup dataSource={() => this.state.estadosDepartamentos} valueExpr={'id'} displayExpr={'descripcion'} />
                            {<RequiredRule />}
                        </Column>

                        <Column dataField="identificadorCobranzaExternaId" caption="Identificador Cobranza Externa" dataType={"number"}>
                        </Column>

                        <Column dataField="ordenEnLiquidacion" caption="Orden En Liquidación" dataType={"number"}>
                        </Column>
                </ADAGrid>
            </div>
        );
    }
}