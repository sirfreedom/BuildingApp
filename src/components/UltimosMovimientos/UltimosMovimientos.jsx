import React from 'react';

import {
    Column,
    Summary,
    GroupItem,
    ValueFormat,
} from 'devextreme-react/data-grid';

import { ReportingAda4Service } from '../../services/ReportingAda4Service';
import { EdificioService } from '../../services/EdificioService';
import ADAGrid from '../Grid/ADAGrid';

export class UltimosMovimientosIndex extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            edificios: [],
            items: [],
            edificioSeleccionadoId: null,
            opened: true,
        };

        //lleno los edificios
        EdificioService.listarAutocomplete(data => this.setState({ edificios: data }));

        this.onToolbarPreparing = this.onToolbarPreparing.bind(this);
        this.refrescar = this.refrescar.bind(this);
    }

    refrescar(edificioId) {
        ReportingAda4Service.getGetUltimosMovimientos(data => this.setState({ items: data, edificioSeleccionadoId: edificioId, opened: false }), edificioId, "");
    }

    renderImporte(elem, val) {
        return elem.innerText = val.value ? val.value.toLocaleString("es-AR", { style: 'currency', currency: 'ARS' }) : "";
    }

    onEdificioValueChanged(e) {
        this.refrescar(e.value);
    }

    onToolbarPreparing(e) {
        let ordenadosPorFechaAlta = this.state.items.sort((a, b) => a.fechaAlta > b.fechaAlta ? -1 : 1);
        let fechaModificacion = this.state.items.length > 0 ? new Date(ordenadosPorFechaAlta[0].fechaAlta).toLocaleString() : "-";

        //seteo el group by por "unidad"
        e.component.columnOption("unidad", "groupIndex", 0);
        e.component.expandAll();

        e.toolbarOptions.items.unshift(
            {
                location: 'after',
                widget: 'dxSelectBox',
                options: {
                    width: 400,
                    items: this.state.edificios,
                    displayExpr: 'descripcion',
                    valueExpr: 'id',
                    value: this.state.edificioSeleccionadoId,
                    placeholder: "Seleccione un edificio",
                    searchEnabled: true,
                    searchMode: "contains",
                    opened: this.state.opened,
                    onValueChanged: this.onEdificioValueChanged.bind(this)
                }
            },
            {
            location: 'after',
            html: `<span style='font-size: 14px;' title='Indica la fecha de los registros visualizados'>Última modificación: ${fechaModificacion}</span>`,
        });
    }

    render() {
        return (
            <div>
                <ADAGrid
                    items={this.state.items}
                    keyExpr={['edificioId', 'pagoId']}
                    allowAdding={false}
                    allowUpdating={false}
                    allowDeleting={false}
                    enablefilterRow={true}
                    onToolbarPreparing={this.onToolbarPreparing}
                >
                    <Column dataField="unidad" caption="Unidad" minWidth={80} dataType={"number"} allowEditing={false} />
                    <Column dataField="codDepartamento" caption="CodDepartamento" minWidth={80} allowEditing={false} />
                    <Column dataField="piso" caption="Piso" minWidth={80} allowEditing={false} />
                    <Column dataField="propietarioNombre" caption="Propietario" minWidth={200} allowEditing={false} />
                    <Column dataField="mesyAnio" caption="Mes y Año" minWidth={80} allowEditing={false} />
                    <Column dataField="fechaCobranza" caption="Fecha Cobranza" dataType={"date"} minWidth={80} allowEditing={false} />
                    <Column dataField="importe" caption="Importe" dataType={"number"} minWidth={80} allowEditing={false} cellTemplate={this.renderImporte} />
                    <Column dataField="tipoPago" caption="TipoPago" minWidth={80} allowEditing={false} />
                    <Column dataField="userName" caption="Usuario" minWidth={80} allowEditing={false} />
                    <Column dataField="nroLote" caption="NroLote" dataType={"number"} minWidth={80} allowEditing={false} />

                    <Summary recalculateWhileEditing={false}>
                        <GroupItem showInGroupFooter={false} column={"saldo"} summaryType={"max"} showInColumn={"unidad"} displayFormat={"Saldo: $ {0}"} alignByColumn={false} >
                            <ValueFormat type={"fixedPoint"} precision={2} />
                        </GroupItem>
                    </Summary> 
                </ADAGrid>
            </div>
        );
    }
}