import React from 'react';

import {
    Column,
} from 'devextreme-react/data-grid';

import { CobranzaService } from '../../services/CobranzaService';
import { EdificioService } from '../../services/EdificioService';
import { EstadoJudicialService } from '../../services/EstadoJudicialService';
import { TipoDeDepartamentoService } from '../../services/TipoDeDepartamentoService';
import { EstadoDepartamentoService } from '../../services/EstadoDepartamentoService';

import ADAGridReport from '../Grid/ADAGridReport';


export class CobranzaIndexPaso2 extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            items: this.props.location.state,

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
        this.onPropietarioSeleccionado = this.onPropietarioSeleccionado.bind(this);
        this.onCleanSelection = this.onCleanSelection.bind(this);
        this.onRowInserted = this.onRowInserted.bind(this);
        this.onRowUpdated = this.onRowUpdated.bind(this);
        this.onRowRemoved = this.onRowRemoved.bind(this);

        //this.refrescarPropietarios = this.refrescarPropietarios.bind(this);
    }

    refrescar() {
        //DepartamentoService.listar(data => this.setState({ items: data, filterItems: data }));
        CobranzaService.listarCobranzasPaso2(this.state.items, data => {
            this.setState({ items: data, filterItems: data })
        });

    }

    render() {
        return (
            <div>
                
                <ADAGridReport
                    items={this.state.filterItems}
                    keyExpr={'departamentoId'}  
                >
                    <Column dataField="edificio" caption="Edificio">
                    </Column>

                    <Column dataField="unidadFuncional" caption="UF">
                    </Column>

                    <Column dataField="departamento" caption="Departamento">
                    </Column>

                    <Column dataField="piso" caption="Piso">
                    </Column>

                    <Column dataField="propietario" caption="Propietario">
                    </Column>

                    <Column dataField="importe" caption="Importe" >
                    </Column>

                    <Column dataField="fecha" caption="Fecha" dataType={'date'}>
                    </Column>

                    <Column dataField="recargo" caption="Recargo" dataType={'boolean'}>
                    </Column>

                    <Column caption="BotonForma">
                    </Column>

                    {/*Iconos de las formas seleccionadas + tooltips */}

                    <Column dataField="observacion" caption="Observacion">
                    </Column>

                    <Column dataField="recibo" caption="Recibo" dataType={'boolean'}>
                    </Column>

                </ADAGridReport>

            </div>
        );
    }
}