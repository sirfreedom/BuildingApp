import React from 'react';

import {
    Column,
    RequiredRule,
    StringLengthRule,
    Lookup,
    RangeRule
} from 'devextreme-react/data-grid';

import { PorcentualPorLiquidacionService } from '../../services/PorcentualPorLiquidacionService';
import { EdificioService } from '../../services/EdificioService';

import ADAGrid from '../Grid/ADAGrid';
import { Notifier } from '../Grid/Notifier';

import Edificios from '../DropDownBoxes/Edificios';

export class PorcentualPorLiquidacionIndex extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            edificios: [], 
            filterItems: [],
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
    }

    refrescar() {
        PorcentualPorLiquidacionService.listar(data => this.setState({ items: data, filterItems: data }));
    }

    onRowInserted(e) {
        const id = e.data.porcentualId;
        e.data.porcentualId = 0;
        PorcentualPorLiquidacionService.agregar(e.data,
            (resp) => {
                Notifier.mostrarNotificacion("operación exitosa", "success", 3000);
                this.refrescar();
            },
            (resp) => {
                Notifier.mostrarNotificacion(resp.Message, "error", 3000);
                this.refrescar();
            }
        );
        e.data.porcentualId = id;
    }

    onRowUpdated(e) {
        PorcentualPorLiquidacionService.modificar(e.data,
            (resp) => Notifier.mostrarNotificacion("operación exitosa", "success", 3000),
            (resp) => {
                Notifier.mostrarNotificacion(resp.Message, "error", 3000); this.refrescar();
            })
    }

    onRowRemoved(e) {
        PorcentualPorLiquidacionService.borrar(e.data,
            (resp) => Notifier.mostrarNotificacion("operación exitosa", "success", 3000),
            (resp) => {
                Notifier.mostrarNotificacion(resp.Message, "error", 3000); this.refrescar();
            })
    }

    onEdificioSeleccionado(edificioId) {
       console.log('items:', this.state.items);
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
                    items={this.state.items}
                    keyExpr={'porcentualPorLiquidacionId'} 
                    onRowInserted={this.onRowInserted}
                    onRowUpdated={this.onRowUpdated}
                    onRowRemoved={this.onRowRemoved} 
                >

                    <Column dataField="porcentualPorLiquidacionId" caption="porcentualPorLiquidacionId" allowEditing={false} dataType={"number"}>
                    </Column>

                    <Column dataField="edificioId" caption="Edificio" dataType={"number"} >
                        <Lookup dataSource={() => this.state.edificios} valueExpr={'id'} displayExpr={'descripcion'} />
                        <RequiredRule />
                    </Column>

                    <Column dataField="numero" caption="Número" dataType={"number"} >
                        <RangeRule min="0" max="32767" />
                    </Column>

                    <Column dataField="descriptor" caption="Descripción" >
                        <StringLengthRule max="30" />
                    </Column>
                </ADAGrid>

            </div>
        );
    }
}