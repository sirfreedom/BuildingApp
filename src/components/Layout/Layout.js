import React, { Component } from 'react';
import { Container } from 'reactstrap';
import  MenuAppBar from '../MenuAppBar';
import { Home } from '../../components/Home';
import { Logout } from '../../components/Account/Logout';
import { Account } from '../../components/Account/Account';
import { DepartamentoIndex } from '../../components/Departamento/DepartamentoIndex';
import { ClienteSasaIndex } from '../../components/ClienteSasa/ClienteSasaIndex';
import { AdministracionIndex } from '../../components/Administracion/AdministracionIndex';
import { EstadoAdministracionIndex } from '../../components/EstadoAdministracion/EstadoAdministracionIndex';
import { EstadoUsuarioIndex } from '../../components/EstadoUsuario/EstadoUsuarioIndex';
import { RolSeguridadIndex } from '../../components/RolSeguridad/RolSeguridadIndex';
import { UsuarioIndex } from '../../components/Usuario/UsuarioIndex';
import { TipoIdentificadorIndex } from '../../components/TipoIdentificador/TipoIdentificadorIndex';
import { EstadoJudicialIndex } from '../../components/EstadoJudicial/EstadoJudicialIndex';
import { ComplejoUrbanisticoIndex } from '../../components/ComplejoUrbanistico/ComplejoUrbanisticoIndex';
import { EstadoTransferenciaIndex } from '../../components/EstadoTransferencia/EstadoTransferenciaIndex';
import { EstadoEdificioIndex } from '../../components/EstadoEdificio/EstadoEdificioIndex';
import { TipoDeDepartamentoIndex } from '../../components/TipoDeDepartamento/TipoDeDepartamentoIndex';
import { EstadoDepartamentoIndex } from '../../components/EstadoDepartamento/EstadoDepartamentoIndex';
import { EstadoCuentaIndex } from '../../components/EstadoCuenta/EstadoCuentaIndex';
import { EstadoGastoIndex } from '../../components/EstadoGasto/EstadoGastoIndex';
import { EstadoPlantillaGastoIndex } from '../../components/EstadoPlantillaGasto/EstadoPlantillaGastoIndex';
import { AgrupamientoIndex } from '../../components/Agrupamiento/AgrupamientoIndex';
import { EstadoPolizaDeSeguroIndex } from '../../components/EstadoPolizaDeSeguro/EstadoPolizaDeSeguroIndex';
import { ProveedorIndex } from '../../components/Proveedor/ProveedorIndex';
import { EstadoRiesgoPolizaDeSeguroIndex } from '../../components/EstadoRiesgoPolizaDeSeguro/EstadoRiesgoPolizaDeSeguroIndex';
import { PorcentualPorLiquidacionIndex } from '../../components/PorcentualPorLiquidacion/PorcentualPorLiquidacionIndex';
import { PorcentualAutomaticoIndex } from '../../components/PorcentualAutomatico/PorcentualAutomaticoIndex';
import { LiquidacionIndex } from '../../components/Liquidacion/LiquidacionIndex';
import { ExpensaIndex } from '../../components/Expensa/ExpensaIndex';
import { UsuarioEdificioIndex } from '../../components/UsuarioEdificio/UsuarioEdificioIndex';
import { PersonaIndex } from '../../components/Persona/PersonaIndex';
import { BancoIndex } from '../../components/Banco/BancoIndex';
import { CobranzaIndexPaso2 } from '../../components/Cobranza/CobranzaIndexPaso2';
import { CobranzaIndex } from '../../components/Cobranza/CobranzaIndex';

import { ValorCobranza } from '../../components/ValorCobranza/ValorCobranza';
import { PreCargaGastoIndex } from '../../components/PreCargaGasto/PreCargaGasto';
import { DeudorIndex } from '../../components/Deudor/Deudor';
import { SituacionGeneralIndex } from '../../components/SituacionGeneral/SituacionGeneral';
import { VisualizarLiquidacionesIndex } from '../../components/VisualizarLiquidaciones/VisualizarLiquidacionesIndex';
import { UltimosMovimientosIndex } from '../../components/UltimosMovimientos/UltimosMovimientos';
import { ConmutadorIndex } from '../../components/Conmutador/ConmutadorIndex';



import AppliedRoute from '../../components/AppliedRoute';


export class Layout extends Component {
    static displayName = Layout.name;

  render () {
    return (
        <div>
            <MenuAppBar childProps={this.props.childProps} >
                <Container fluid={true}>
                    <AppliedRoute exact path='/' component={Home} props={this.props.childProps} />
                    <AppliedRoute exact path='/account' component={Account} props={this.props.childProps} />
                    <AppliedRoute exact path='/departamento' component={DepartamentoIndex} props={this.props.childProps} />
                    <AppliedRoute exact path='/persona' component={PersonaIndex} props={this.props.childProps} />
                    <AppliedRoute exact path='/clienteSasa' component={ClienteSasaIndex} props={this.props.childProps} />
                    <AppliedRoute exact path='/administracion' component={AdministracionIndex} props={this.props.childProps} />
                    <AppliedRoute exact path='/estadoAdministracion' component={EstadoAdministracionIndex} props={this.props.childProps} />
                    <AppliedRoute exact path='/estadoUsuario' component={EstadoUsuarioIndex} props={this.props.childProps} />
                    <AppliedRoute exact path='/cobranza' component={CobranzaIndex} props={this.props.childProps} />
                    <AppliedRoute exact path='/cobranzaPaso2' component={CobranzaIndexPaso2} props={this.props.childProps} />
                    <AppliedRoute exact path='/rolSeguridad' component={RolSeguridadIndex} props={this.props.childProps} />
                    <AppliedRoute exact path='/usuario' component={UsuarioIndex} props={this.props.childProps} />
                    <AppliedRoute exact path='/tipoIdentificador' component={TipoIdentificadorIndex} props={this.props.childProps} />
                    <AppliedRoute exact path='/estadoJudicial' component={EstadoJudicialIndex} props={this.props.childProps} />
                    <AppliedRoute exact path='/complejoUrbanistico' component={ComplejoUrbanisticoIndex} propr={this.props.childProps} />
                    <AppliedRoute exact path='/estadoTransferencia' component={EstadoTransferenciaIndex} props={this.props.childProps} />
                    <AppliedRoute exact path='/estadoEdificio' component={EstadoEdificioIndex} props={this.props.childProps} />
                    <AppliedRoute exact path='/tipoDeDepartamento' component={TipoDeDepartamentoIndex} props={this.props.childProps} />
                    <AppliedRoute exact path='/estadoDepartamento' component={EstadoDepartamentoIndex} props={this.props.childProps} />
                    <AppliedRoute exact path='/estadoCuenta' component={EstadoCuentaIndex} props={this.props.childProps} />
                    <AppliedRoute exact path='/estadoGasto' component={EstadoGastoIndex} props={this.props.childProps} />
                    <AppliedRoute exact path='/agrupamiento' component={AgrupamientoIndex} props={this.props.childProps} />
                    <AppliedRoute exact path='/estadoPlantillaGasto' component={EstadoPlantillaGastoIndex} props={this.props.childProps} />
                    <AppliedRoute exact path='/estadoPolizaDeSeguro' component={EstadoPolizaDeSeguroIndex} props={this.props.childProps} />
                    <AppliedRoute exact path='/proveedor' component={ProveedorIndex} props={this.props.childProps} />
                    <AppliedRoute exact path='/estadoRiesgoPolizaDeSeguro' component={EstadoRiesgoPolizaDeSeguroIndex} props={this.props.childProps} />
                    <AppliedRoute exact path='/porcentualPorLiquidacion' component={PorcentualPorLiquidacionIndex} props={this.props.childProps} />
                    <AppliedRoute exact path='/porcentualAutomatico' component={PorcentualAutomaticoIndex} props={this.props.childProps} />
                    <AppliedRoute exact path='/liquidacion' component={LiquidacionIndex} props={this.props.childProps} />
					<AppliedRoute exact path='/expensa' component={ExpensaIndex} props={this.props.childProps} />
                    <AppliedRoute exact path='/usuarioEdificio' component={UsuarioEdificioIndex} props={this.props.childProps} />
                    <AppliedRoute exact path='/banco' component={BancoIndex} props={this.props.childProps} />                                                                               
                    <AppliedRoute exact path='/logout' component={Logout} props={this.props.childProps} />

                    <AppliedRoute exact path='/valorCobranza' component={ValorCobranza} props={this.props.childProps} />
                    <AppliedRoute exact path='/preCargaGasto' component={PreCargaGastoIndex} props={this.props.childProps} />
                    <AppliedRoute exact path='/deudor' component={DeudorIndex} props={this.props.childProps} />
                    <AppliedRoute exact path='/situaciongeneral' component={SituacionGeneralIndex} props={this.props.childProps} />
                    <AppliedRoute exact path='/visualizarLiquidaciones' component={VisualizarLiquidacionesIndex} props={this.props.childProps} />
                    <AppliedRoute exact path='/ultimosMovimientos' component={UltimosMovimientosIndex} props={this.props.childProps} />
                    <AppliedRoute exact path='/conmutador' component={ConmutadorIndex} props={this.props.childProps} />

                    
                </Container>
            </MenuAppBar>
        </div>
    );
  }
}