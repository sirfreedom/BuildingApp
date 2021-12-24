import React from 'react';

import { ReportingAda4Service } from '../../services/ReportingAda4Service';

export class VerLiquidacion extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            liquidaciones: [],
            liquidacionesCargadas: false
        };

        //chequeo si ya los tengo cargados
        const asciiCodigoSasa = this.props.edificio.asciiCodigoSasa;
        const liquidacionesCache = this.props.liquidacionesCache[asciiCodigoSasa];

        if (liquidacionesCache !== undefined) {
            this.state = {
                liquidaciones: liquidacionesCache,
                liquidacionesCargadas: true
            };
        }
        else {
            this.refrescar();
        }

        this.refrescar = this.refrescar.bind(this);
    }

    refrescar() {
        //chequeo si ya los tengo cargados
        const edificioId = this.props.edificio.edificioId;

        //Hago el request y lo guardo en el cache
        ReportingAda4Service.obtenerLiquidaciones(data => {
            this.props.liquidacionesCache[edificioId] = data;
            this.setState({ liquidacionesCargadas: true, liquidaciones: data });
        }, 3, edificioId);
    }

    tituloSubGrilla(edificio) {
        return edificio.codigoReemplazo + " - " + edificio.direccion.direccionFormateada;
    }

    render() {
        return (
            <div>
                <strong>Liquidaciones de Edificio: </strong><span>{this.tituloSubGrilla(this.props.edificio)}</span>

                {this.state.liquidacionesCargadas === false
                    ? <div><strong>Cargando...</strong></div>
                    : (this.state.liquidaciones.length === 0
                            ? <div><strong>No existen liquidaciones para el edificio seleccionado</strong></div>
                            : this.state.liquidaciones.map((x, index) => {
                                return <div key={index}><a target="_blank" href={ReportingAda4Service.visualizarLiquidacion(x.url)}>{x.periodoFormateado}</a></div>
                            })
                    )
                }
            </div>
        );
    }
}