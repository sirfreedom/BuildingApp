import React from 'react';

import {
    Column,
    RequiredRule,
    Lookup
} from 'devextreme-react/data-grid';

import { UsuarioEdificioService } from '../../services/UsuarioEdificioService';
import { UsuarioService } from '../../services/UsuarioService';
import { EdificioService } from '../../services/EdificioService';

import ADAGrid from '../Grid/ADAGrid';
import { Notifier } from '../Grid/Notifier';

export class UsuarioEdificioIndex extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            usuarios: [],
            edificios: [], 
        };

        //lleno la grilla
        this.refrescar();

        //lleno las usuarios
        UsuarioService.listarAutocomplete((data) => this.setState({ usuarios: data }));

        //lleno las edificios
        EdificioService.listarAutocomplete((data) => this.setState({ edificios: data }));

        this.onRowInserted = this.onRowInserted.bind(this);
        this.onRowUpdated = this.onRowUpdated.bind(this);
        this.onRowRemoved = this.onRowRemoved.bind(this);
    }

    refrescar() {
        UsuarioEdificioService.listar(data => this.setState({ items: data }));
    }

    onRowInserted(e) {
        
        UsuarioEdificioService.agregar(e.data,
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

    onRowUpdated(e) {
        UsuarioEdificioService.modificar(e.data,
            (resp) => Notifier.mostrarNotificacion("operación exitosa", "success", 3000),
            (resp) => {
                Notifier.mostrarNotificacion(resp.message, "error", 3000); this.refrescar();
            })
    }

    onRowRemoved(e) {
        UsuarioEdificioService.borrar(e.data,
            (resp) => Notifier.mostrarNotificacion("operación exitosa", "success", 3000),
            (resp) => {
                Notifier.mostrarNotificacion(resp.message, "error", 3000); this.refrescar();
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
                   
                    <Column dataField="usuarioId" caption="Usuario" dataType={"number"}>
                        <Lookup dataSource={() => this.state.usuarios} valueExpr={'id'} displayExpr={'descripcion'} />
                        <RequiredRule />
                    </Column>

                    <Column dataField="edificioId" caption="Edificio" dataType={"number"}>
                        <Lookup dataSource={() => this.state.edificios} valueExpr={'id'} displayExpr={'descripcion'} />
                        <RequiredRule />
                    </Column>

                    <Column dataField="estado" caption="Estado" dataType={"boolean"} />
                </ADAGrid>

            </div>
        );
    }
}