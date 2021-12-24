import React, { Fragment } from 'react';

import { conmutadorMenu } from './ConmutadorDataMenu';
import { ConmutadorAdministrador } from './ConmutadorAdministrador';
import { ConmutadorDatosEdificio } from './ConmutadorDatosEdificio';
import { ConmutadorLiqExpensa } from './ConmutadorLiqExpensa';
import { ConmutadorInteres } from './ConmutadorInteres';
import { ConmutadorProrrateo } from './ConmutadorProrrateo';
import TreeView from 'devextreme-react/tree-view';
import './conmutador.css';
import { ConmutadorMisExpensas } from './ConmutadorMisExpensas';
import { ConmutadorRecibo } from './ConmutadorRecibo';
import { ConmutadorOpcionesAdicionales } from './ConmutadorOpcionesAdicionales';
import { ConmutadorGasto } from './ConmutadorGasto';
import { ConmutadorIntimacionPago } from './ConmutadorIntimacionPago';
import { ConmutadorPorcentual } from './ConmutadorPorcentual';
import { ConmutadorProveedor } from './ConmutadorProveedor';


export class ConmutadorIndex extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedMenu: ""
        };

        this.onItemClick = this.onItemClick.bind(this);
        this.obtenerConmutador = this.obtenerConmutador.bind(this);        
    }

    onItemClick(e) {
        this.setState({
            selectedMenu: e.itemData.id
        });
    }

    obtenerConmutador() {
        let conmutador = "";

        //completar el case con cada conmutador
        switch (this.state.selectedMenu) {
            case "1_1":
                conmutador = <ConmutadorAdministrador />
                break;
            
            case "1_2":
                conmutador = <ConmutadorDatosEdificio />
                break;

            case "1_3_1":
                conmutador = <ConmutadorLiqExpensa />
                break;

            case "1_3_2":
                conmutador = <ConmutadorInteres />
                break;

            case "1_3_4":
                conmutador = <ConmutadorProrrateo />
                break;

            case "1_3_5":
                conmutador = <ConmutadorMisExpensas />
                break;

            case "1_4_1":
                conmutador = <ConmutadorRecibo />
                break;
                
            case "1_4_2":
                conmutador = <ConmutadorOpcionesAdicionales />
                break;

            case "1_6_1":
                conmutador = <ConmutadorGasto />
                break;

            case "1_6_2":
                conmutador = <ConmutadorIntimacionPago />
                break;

            case "1_6_3":
                conmutador = <ConmutadorPorcentual />
                break;

            case "1_6_4":
                conmutador = <ConmutadorProveedor />
                break;

            default:
                conmutador = "";
                break;

        };

        return conmutador;
    }

    render() {
        const conmutador = this.obtenerConmutador();

        return (
            <Fragment>
                <div className={"conmutadorMenuContainer"}>
                    <TreeView
                        id="conmutadorMenu"
                        items={conmutadorMenu}
                        searchMode={"contains"}
                        searchEnabled={true}
                        onItemClick={this.onItemClick}
                    />
                    <div className={"conmutadorContainer"}>
                        {conmutador}
                    </div>
                </div>
            </Fragment>
        );
    }
}