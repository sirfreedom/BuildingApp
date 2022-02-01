import React from 'react';

import {	
    Column,
    RequiredRule,
    Lookup
} from 'devextreme-react/data-grid';

import { UsuarioService } from '../../services/UsuarioService';
import { RolSeguridadService } from '../../services/RolSeguridadService';
import { EstadoUsuarioService } from '../../services/EstadoUsuarioService';
import { ClienteSasaService } from '../../services/ClienteSasaService';

import ADAGrid from '../Grid/ADAGrid';
import { Notifier } from '../Grid/Notifier';

export class UsuarioIndex extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            roles: [],
            estados: [],
            clientes: [], 
        };

        //lleno la grilla
        this.refrescar();

        RolSeguridadService.listarAutocomplete(data => this.setState({ roles: data }));
        EstadoUsuarioService.listarAutocomplete(data => this.setState({ estados: data }));
        ClienteSasaService.listarAutocomplete(data => this.setState({ clientes: data }));

        this.onRowInserted = this.onRowInserted.bind(this);
        this.onRowUpdated = this.onRowUpdated.bind(this);
        this.onRowRemoved = this.onRowRemoved.bind(this);
    }

    renderPassword(elem, model) {
        let txtPassword = `<input type="password" class="dx-texteditor-input" value="${model.displayValue || ""}" />`;
        return elem.innerHTML = txtPassword;
    }

    refrescar() {
        UsuarioService.listar(data => this.setState({ items: data }));
    }

    onRowInserted(e) {
        const id = e.data.usuarioId;
        e.data.usuarioId = 0;
        UsuarioService.agregar(e.data,
            (resp) => {
                Notifier.mostrarNotificacion("operación exitosa", "success", 3000);
                this.refrescar(); 
            },
            (resp) => {
                Notifier.mostrarNotificacion(resp.message, "error", 3000);
                this.refrescar();
            }
        );
        e.data.usuarioId = id;
    }

    onRowUpdated(e) {
        UsuarioService.modificar(e.data,
            (resp) => Notifier.mostrarNotificacion("operación exitosa", "success", 3000),
            (resp) => {
                Notifier.mostrarNotificacion(resp.message, "error", 3000);
                this.refrescar();
            })
    }

    onRowRemoved(e) {
        UsuarioService.borrar(e.data,
            (resp) => Notifier.mostrarNotificacion("operación exitosa", "success", 3000),
            (resp) => {
                Notifier.mostrarNotificacion(resp.message, "error", 3000);
                this.refrescar();
            })
    }

    render() {
        return (
            <div>
                <ADAGrid
                    items={this.state.items}
                    keyExpr={'usuarioId'} 
                    onRowInserted={this.onRowInserted}
                    onRowUpdated={this.onRowUpdated}
                    onRowRemoved={this.onRowRemoved} 
                >

                    <Column dataField="usuarioId" defaultSortOrder="desc" caption="UsuarioId" allowEditing={false} dataType={"number"} >
                    </Column>
                    <Column dataField="userName" caption="Usuario" >
                        <RequiredRule />
                    </Column>
                    <Column dataField="password" caption="Contraseña" cellTemplate={this.renderPassword}  >
                        <RequiredRule />
                    </Column>
                    <Column dataField="rolId" caption="Rol" dataType={"number"}>
                        <Lookup dataSource={() => this.state.roles} valueExpr={'id'} displayExpr={'descripcion'} />
                        <RequiredRule />
                    </Column>
                    <Column dataField="estadoUsuarioId" caption="Estado" dataType={"number"} >
                        <Lookup dataSource={() => this.state.estados} valueExpr={'id'} displayExpr={'descripcion'} />
                        <RequiredRule />
                    </Column>
                    <Column dataField="clienteSasaId" caption="Cliente Sasa" dataType={"number"} >
                        <Lookup dataSource={() => this.state.clientes} valueExpr={'id'} displayExpr={'descripcion'} />
                        <RequiredRule />
                    </Column>
                </ADAGrid>

            </div>
        );
    }
}