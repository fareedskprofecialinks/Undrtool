import axios from 'axios';

let APICallingService = {

    sendRequestForPostWithAuth: (url, payload, CB) => {
        let options = {};
        var params = payload;
 
        var formData = new FormData();
        for (var k in params) {
            formData.append(k, params[k]);
        }

        if (payload != null && payload != '') {
            options = {
                method: 'POST',
                url: url,
                timeout: 10000 * 3,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: formData
            };
        }
        else {
            options = {
                method: 'POST',
                url: url,
                timeout: 10000 * 3,
            };
        }
        try {
            return axios(options).then(response => {
                let responseOK = response && response.status == 200;
                if (responseOK) {
                    return response.data;
                }
                return {
                    status: 'Failed',
                    error: response.data
                }
            })
        } catch (e) {
            return {
                status: 'Failed',
                error: e
            }
        }
    },

    sendRequestForGet: (url, obj, CB) => {
        let options = {};
        if (url.includes('translations')) {
            options = {
                mode: 'no-cors',
                method: 'GET',
                url: url,
                timeout: 10000 * 3,
                headers: {
                    'Authorization': 'VgJBwgCxMSE8H35fCehwiM6bKUiWK8xdCdQyfaES',
                    'Access-Control-Allow-Origin': '*'
                },
            };
        } else {
            options = {
                method: 'GET',
                url: url,
                timeout: 10000 * 3,
            };
        }

        try {
            return axios(options).then(response => {
                let responseOK = response && response.status == 200;
                if (responseOK) {
                    return response.data;
                }
                return {
                    status: 'Failed',
                    error: response.data
                }
            })
        } catch (e) {
            return {
                status: 'Failed',
                error: e
            }
        }
    },

};

export default APICallingService;