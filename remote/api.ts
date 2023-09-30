import { loginResponse } from "./responses";

let prod_server: string = "https://malibusarhours.org/calloutapi";
let server: string = prod_server;
let tokenEndpoint: string = server + "/api-token-auth/";

export const apiGetToken = async (username: string, password: string): Promise<loginResponse> => {

    return fetch(tokenEndpoint, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
    .then(response => response.json())
    .then(data => {
        return data;
    })
    .catch(error => {
        console.log(error);
        return {
            non_field_errors: [
                "Server Error"
            ]
        };
    })
}