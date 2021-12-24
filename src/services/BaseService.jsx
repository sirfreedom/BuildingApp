export class BaseService {
	
    static async handleResponse(url, method, data, okFunc, errorFunc) {
        const ok = okFunc || function() {};
        const error = errorFunc || function () { };
        var requestData = null;
		const baseURL = "https://ada5webtest.azurewebsites.net/";
		
		
        if (method.toUpperCase() === "GET") {
            requestData = {
                method: method,
                credentials: 'include'
            }
        }
        else {
            requestData = {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(data)
            }
        }

        await fetch(baseURL + url, requestData)
            .then(response => {
                if (response.ok)
                    ok(response);
                else {
                    if (response.status === 401)
                        document.location.href = "/logout";
                    else
                        response.json().then(json => error(json));
                }
            });
    }
}