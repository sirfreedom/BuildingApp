import React from 'react';

import {
    Column,
    Lookup,
    RequiredRule,
} from 'devextreme-react/data-grid';

import { ReportingAda4Service } from '../../services/ReportingAda4Service';
import { EdificioService } from '../../services/EdificioService';
import ADAGrid from '../Grid/ADAGrid';

export class SituacionGeneralIndex extends React.Component {
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
        ReportingAda4Service.getSituacionGeneralADA4D(data => this.setState({ items: data }), edificioId);
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

                    <Column dataField="dia" caption="Fecha" minWidth={200} dataType={"date"} allowEditing={false} />
                    <Column dataField="cajaLiq1" caption="Caja 1" dataType={"number"} minWidth={80} allowEditing={false} cellTemplate={this.renderImporte} />
                    <Column dataField="cajaLiq2" caption="Caja 2" dataType={"number"} minWidth={80} allowEditing={false} cellTemplate={this.renderImporte} />
                    <Column dataField="cajaLiq3" caption="Caja 3" dataType={"number"} minWidth={80} allowEditing={false} cellTemplate={this.renderImporte} />
                    <Column dataField="gastosCCAdm" caption="Gastos CCAdm" dataType={"number"} minWidth={80} allowEditing={false} cellTemplate={this.renderImporte} />
                    <Column dataField="vales" caption="Vales" dataType={"number"} minWidth={80} allowEditing={false} cellTemplate={this.renderImporte} />
                    <Column dataField="gastosPagadosALiq" caption="Gastos Pagados A Liq." dataType={"number"} minWidth={80} allowEditing={false} cellTemplate={this.renderImporte} />
                    <Column dataField="cajaConf" caption="CajaConf" dataType={"number"} minWidth={80} allowEditing={false} cellTemplate={this.renderImporte} />
                    <Column dataField="efectivo" caption="Efectivo" dataType={"number"} minWidth={80} allowEditing={false} cellTemplate={this.renderImporte} />
                    <Column dataField="chequesEnCartera" caption="Cheques En Cartera" dataType={"number"} minWidth={80} allowEditing={false} cellTemplate={this.renderImporte} />
                    <Column dataField="banco1" caption="Banco 1" dataType={"number"} minWidth={80} allowEditing={false} cellTemplate={this.renderImporte} />
                    <Column dataField="banco2" caption="Banco 2" dataType={"number"} minWidth={80} allowEditing={false} cellTemplate={this.renderImporte} />
                    <Column dataField="banco3" caption="Banco 3" dataType={"number"} minWidth={80} allowEditing={false} cellTemplate={this.renderImporte} />
                    <Column dataField="banco4" caption="Banco 4" dataType={"number"} minWidth={80} allowEditing={false} cellTemplate={this.renderImporte} />
                    <Column dataField="banco5" caption="Banco 5" dataType={"number"} minWidth={80} allowEditing={false} cellTemplate={this.renderImporte} />
                    <Column dataField="banco6" caption="Banco 6" dataType={"number"} minWidth={80} allowEditing={false} cellTemplate={this.renderImporte} />
                    <Column dataField="banco7" caption="Banco 7" dataType={"number"} minWidth={80} allowEditing={false} cellTemplate={this.renderImporte} />
                    <Column dataField="banco8" caption="Banco 8" dataType={"number"} minWidth={80} allowEditing={false} cellTemplate={this.renderImporte} />
                    <Column dataField="banco9" caption="Banco 9" dataType={"number"} minWidth={80} allowEditing={false} cellTemplate={this.renderImporte} />
                    <Column dataField="banco10" caption="Banco 10" dataType={"number"} minWidth={80} allowEditing={false} cellTemplate={this.renderImporte} />
                    <Column dataField="total" caption="Total" dataType={"number"} minWidth={50} allowEditing={false} cellTemplate={this.renderImporte} />
                </ADAGrid>
            </div>
        );
    }
}