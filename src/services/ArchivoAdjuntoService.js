import { BaseService } from "./BaseService";

export class ArchivoAdjuntoService extends BaseService {
    static obtener(callback, adjuntoId) {
        return this.handleResponse(this.obtenerUrl(adjuntoId), "get", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

    static obtenerJson(callback, adjuntoId) {
        return this.handleResponse(this.obtenerUrl(adjuntoId, "obtenerJson"), "get", null,
            response => response.json()
                .then(data => callback(data))
        );
    }

    static obtenerUrl(adjuntoId, action) {
        return `api/archivoadjunto/${action || "Obtener"}?archivoAdjuntoId=${adjuntoId}`;
    }
}