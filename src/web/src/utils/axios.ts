import axios from "axios";

export const axiosSetup = () => {
    // Add a request interceptor
    const myInterceptor = axios.interceptors.request.use(function (config) {
        // Do something before request is sent
        const access_token = 'abc';
        config.headers = { 
            'Authorization': `Bearer ${access_token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        }
        return config;
    }, function (error) {
        // Do something with request error
        return Promise.reject(error);
    });
    //axios.interceptors.request.eject(myInterceptor);



    // Add a response interceptor
    axios.interceptors.response.use(function (response) {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        return response;
    },  async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 403 && !originalRequest._retry) {
            originalRequest._retry = true;
            // const access_token = await refreshAccessToken();            
            // axios.defaults.headers.common['Authorization'] = 'Bearer ' + access_token;
            // /return axios(originalRequest);
        }
        return Promise.reject(error);
    });
    
}