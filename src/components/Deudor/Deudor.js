import React from 'react';

import {
    Column,
    Lookup,
    RequiredRule,
} from 'devextreme-react/data-grid';

import { ReportingAda4Service } from '../../services/ReportingAda4Service';
import { EdificioService } from '../../services/EdificioService';
import ADAGrid from '../Grid/ADAGrid';

export class DeudorIndex extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            edificios: [],
            items: []
        };

        //lleno la grilla
        this.refrescar();

        //lleno los edificios
        EdificioService.listarAutocomplete(data => this.setState({ edificios: data }));

        this.onToolbarPreparing = this.onToolbarPreparing.bind(this);
    }

    refrescar() {
        const edificioId = 0;
        ReportingAda4Service.getDeudores(data => this.setState({ items: data }), edificioId);
    }

    renderImporte(elem, val) {
        return elem.innerText = val.value.toLocaleString("es-AR", { style: 'currency', currency: 'ARS' });
    }

    onToolbarPreparing(e) {
        let ordenadosPorFechaAlta = this.state.items.sort((a, b) => a.fechaAlta > b.fechaAlta ? -1 : 1);
        let fechaModificacion = this.state.items.length > 0 ? new Date(ordenadosPorFechaAlta[0].fechaAlta).toLocaleString() : "-";

        e.toolbarOptions.items.unshift({
            location: 'after',
            html: `<span style='font-size: 14px;' title='Indica la fecha de los registros visualizados'>Última modificación: ${fechaModificacion}</span>`,
        });
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
                    onToolbarPreparing={this.onToolbarPreparing}
                >
                    <Column dataField="edificioId" caption="Edificio" dataType={"number"} minWidth={200} allowEditing={false}>
                        <Lookup dataSource={() => this.state.edificios} valueExpr={'id'} displayExpr={'descripcion'} />
                        <RequiredRule />
                    </Column>

                    <Column dataField="nombre" caption="Nombre" minWidth={200} allowEditing={false} />
                    <Column dataField="unidad" caption="Unidad" minWidth={50} allowEditing={false} />
                    <Column dataField="codDepartamento" caption="Departamento" minWidth={100} allowEditing={false} />
                    <Column dataField="piso" caption="Piso" minWidth={50} allowEditing={false} />
                    <Column dataField="deudaTotal" caption="Deuda Total" dataType={"number"} minWidth={80} allowEditing={false} cellTemplate={this.renderImporte} />
                    <Column dataField="cantidadLiquidaciones" caption="Cantidad Liquidaciones" dataType={"number"} minWidth={50} allowEditing={false}  />
                </ADAGrid>
            </div>
        );
    }
}