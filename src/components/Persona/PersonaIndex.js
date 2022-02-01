import React from 'react';

import {
    Column,
    StringLengthRule,
    Lookup
} from 'devextreme-react/data-grid';

import { PersonaService } from '../../services/PersonaService';
import { TipoIdentificadorService } from '../../services/TipoIdentificadorService';

import ADAGrid from '../Grid/ADAGrid';
import { Notifier } from '../Grid/Notifier';

export class PersonaIndex extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            edificios: [],
            tiposIdentificadores: [], 
        };

        //lleno la grilla
        this.refrescar();

        //lleno los tipos de identificadores
        TipoIdentificadorService.listarAutocomplete((data) => this.setState({ tiposIdentificadores: data }));

        this.onRowInserted = this.onRowInserted.bind(this);
        this.onRowUpdated = this.onRowUpdated.bind(this);
        this.onRowRemoved = this.onRowRemoved.bind(this);
    }

    refrescar() {
        PersonaService.listar(data => this.setState({ items: data }));
    }

    onRowInserted(e) {
        const id = e.data.personaId;
        
        e.data.personaId = 0;
        
        PersonaService.agregar(e.data,
            (resp) => {
                Notifier.mostrarNotificacion("operación exitosa", "success", 3000);
                this.refrescar();
            },
            (resp) => {
                Notifier.mostrarNotificacion(resp.message, "error", 3000);
                this.refrescar();
            }
        );

        e.data.personaId = id;
    }

    onRowUpdated(e) {

        PersonaService.modificar(e.data,
            (resp) => Notifier.mostrarNotificacion("operación exitosa", "success", 3000),
            (resp) => {
                Notifier.mostrarNotificacion(resp.message, "error", 3000); this.refrescar();
            })
    }

    onRowRemoved(e) {

        PersonaService.borrar(e.data,
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
                    keyExpr={'personaId'} 
                    onRowInserted={this.onRowInserted}
                    onRowUpdated={this.onRowUpdated}
                    onRowRemoved={this.onRowRemoved} 
                >
                    
                    <Column dataField="personaId" caption="personaId" allowEditing={false} dataType={"number"}>
                    </Column>

                    <Column dataField="tipoIdentificadorId" caption="Tipo Identificador" dataType={"number"} >
                        <Lookup dataSource={() => this.state.tiposIdentificadores.concat([{ id: "", descripcion: "Ninguno" }])}  valueExpr={'id'} displayExpr={'descripcion'} />
                    </Column>

                    <Column dataField="identificador" caption="Identificador" >
                        <StringLengthRule min="1" />
                    </Column>

                    <Column dataField="nombre" caption="Nombre" >
                        <StringLengthRule min="1" />

                    </Column>

                    <Column dataField="apellido" caption="Apellido" >
                        <StringLengthRule min="1" />
                    </Column>

                    <Column dataField="extranjero" caption="Extranjero" dataType={"boolean"} >
                    </Column>

                </ADAGrid>

            </div>
        );
    }
}