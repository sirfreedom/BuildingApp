import React from 'react';

import {
    Column,
    MasterDetail
} from 'devextreme-react/data-grid';

import ADAGrid from '../Grid/ADAGrid';
import { EdificioService } from '../../services/EdificioService';
import { VerLiquidacion } from './VerLiquidacion';


export class VisualizarLiquidacionesIndex extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: []
        };

        //creo un json donde guardo de cache las liquidaciones
        this.liquidaciones = {};

        //lleno la grilla
        this.refrescar();

        this.renderSubGrilla = this.renderSubGrilla.bind(this);
    }

    refrescar() {
        EdificioService.listar(data => this.setState({ items: data }));
    }

    renderSubGrilla(e) {
        return <VerLiquidacion  edificio={e.data} liquidacionesCache={this.liquidaciones} />
    }

    render() {
        return (
            <div>
                <ADAGrid
                    items={this.state.items}
                    keyExpr={'edificioId'}
                    allowAdding={false}
                    allowUpdating={false}
                    allowDeleting={false}
                    enablefilterRow={true}
                >
                    <Column dataField="codigoReemplazo" caption="Código Reemplazo" />
                    <Column dataField="direccion.direccionFormateada" caption="Dirección" allowEditing={true} />
                    <Column dataField="codigoSasa" caption="Código Sasa" />
                    <Column dataField="identificador" caption="Identificador" />

                    <MasterDetail
                        enabled={true}
                        autoExpandAll={false}
                        render={this.renderSubGrilla}
                    />
                </ADAGrid>
            </div>
        );
    }
}