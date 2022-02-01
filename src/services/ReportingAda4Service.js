import { BaseService } from "./BaseService";

export class ReportingAda4Service extends BaseService {
    
    static getDeudores(callback, data) {
        this.handleResponse("api/ReportingAda4/GetDeudores?edificioId=" + data, "get", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

    static async getSituacionGeneralADA4D(callback, data) {
        return this.handleResponse("api/ReportingAda4/GetSituacionGeneralADA4D?edificioId=" + data, "get", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

    static async getGetUltimosMovimientos(callback, edificioId, unidad) {
        return this.handleResponse("api/ReportingAda4/GetUltimosMovimientos?edificioId=" + edificioId + "&unidad=" + unidad, "get", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

    static async obtenerLiquidaciones(callback, cantMeses, edificioId) {
        return this.handleResponse("api/ReportingAda4/ObtenerLiquidaciones?cantMeses=" + cantMeses + "&edificioId=" + edificioId, "get", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

    static visualizarLiquidacion(url) {
        return "api/ReportingAda4/VisualizarLiquidacion?url=" + url;
    }
}