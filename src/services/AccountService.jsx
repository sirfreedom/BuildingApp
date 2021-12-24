import { BaseService } from "./BaseService";

export class AccountService extends BaseService {
    static login(data, okFunc, errorFunc) {
        this.handleResponse("api/account/Login", "post", data, okFunc, errorFunc);
    }

    static logout(data, okFunc, errorFunc) {
        this.handleResponse("api/account/Logout", "post", data, okFunc, errorFunc);
    }

    static edit(data, okFunc, errorFunc) {
        this.handleResponse("api/account/Edit", "post", data, okFunc, errorFunc);
    }

    static index(id, okFunc, errorFunc) {
        this.handleResponse("api/account/Index?usuarioId=" + id, "post", null, okFunc, errorFunc);
    }

    static cambiarContrasenia(data, okFunc, errorFunc) {
        this.handleResponse("api/account/cambiarContrasenia", "post", data, okFunc, errorFunc);
    }
}