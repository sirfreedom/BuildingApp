import React from 'react';

import {
    Column,
} from 'devextreme-react/data-grid';

import { CobranzaService } from '../../services/CobranzaService';
import { EdificioService } from '../../services/EdificioService';
import { PersonaDepartamentoService } from '../../services/PersonaDepartamentoService';
import { EstadoJudicialService } from '../../services/EstadoJudicialService';
import { TipoDeDepartamentoService } from '../../services/TipoDeDepartamentoService';
import { EstadoDepartamentoService } from '../../services/EstadoDepartamentoService';

import ADAGridReport from '../Grid/ADAGridReport';

import Edificios from '../DropDownBoxes/Edificios';
import Propietarios from '../DropDownBoxes/Propietarios';

export class CobranzaIndex extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            items: [],
            filterItems: [],
            edificios: [],
            estadosJudiciales: [],
            tiposDeDepartamentos: [],
            estadosDepartamentos: [],
            propietarios: [],
            edificioSeleccionado: 0,
            propietarioSeleccionado: 0

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
        
        this.refrescarPropietarios = this.refrescarPropietarios.bind(this);
    }

    refrescar() {
        //DepartamentoService.listar(data => this.setState({ items: data, filterItems: data }));
        CobranzaService.listarCobranzasPendientes(this.state.edificioSeleccionado, data => {
            this.setState({ items: data, filterItems: data })
        });

        this.refrescarPropietarios();
    }

    refrescarPropietarios() {
        
        PersonaDepartamentoService.listarPropietarios(this.state.edificioSeleccionado, data => {
            
            this.setState({ propietarios: data })
        });
    }

    onEdificioSeleccionado(edificioId) {

        var listaFiltrada = this.state.items.filter((item) => item.edificioId === edificioId);
        
        this.setState({
            filterItems: listaFiltrada,
            edificioSeleccionado: edificioId
        });
        
        this.refrescarPropietarios();

        this.refrescar();
    }

    onPropietarioSeleccionado(propietarioId) {

        this.setState({
            propietarioSeleccionado: propietarioId
        });
    }

    onCleanSelection() {
        this.setState({
            filterItems: this.state.items,
            propietarios: []
        });
    }

    render() {
        return (
            <div>
                <div >
                    <div style={{ display: 'inline-flex', width: '50%' }}>
                        <Edificios edificioSeleccionado={this.state.edificioSeleccionado} onSelectedItem={this.onEdificioSeleccionado} onCleanSelection={this.onCleanSelection} columnIndexFocus={0} />
                    </div>
                    <div style={{ display: 'inline-flex', width: '50%', justifyContent: 'flex-end', paddingRight: '3px' }}>
                        <Propietarios propietarios={this.state.propietarios} onSelectedItem={this.onPropietarioSeleccionado} onCleanSelection={this.onCleanSelection} columnIndexFocus={0} />
                    </div>
                </div>

                <ADAGridReport
                    items={this.state.filterItems}
                    keyExpr={'departamentoId'}  
                >
                    
                    <Column dataField="unidadFuncional" caption="UF">
                    </Column>

                    <Column dataField="departamento" caption="Departamento">
                    </Column>

                    <Column dataField="piso" caption="Piso">
                    </Column>

                    <Column dataField="propietario" caption="Propietario">
                    </Column>

                    <Column dataField="tipoJudicial" caption="TipoJudicial">
                    </Column>

                    <Column dataField="deudaAnterior" caption="Deuda Anterior" >
                    </Column>

                    <Column dataField="movimientos" caption="Movimientos" >
                    </Column>

                    <Column dataField="deudaActual" caption="Deuda Actual">
                    </Column>

                </ADAGridReport>
                    
            </div>
        );
    }
}