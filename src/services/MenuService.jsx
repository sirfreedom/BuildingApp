import { BaseService } from "./BaseService";

export class MenuService extends BaseService {
    static listar(usuarioId, callback) {
        this.handleResponse("api/menu/Listar?usuarioId=" + usuarioId, "post", null,
            response => response.json()
                .then(data => callback(data))
        );
    }
}