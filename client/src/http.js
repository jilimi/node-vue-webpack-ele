import axios from 'axios';
import {
    Loading,
    Message
} from 'element-ui';
import router from "./router"

let loading;

function startLoading() {
    loading = Loading.service({
        lock: true,
        text: "拼命加载中...",
        background: 'reba(0,0,0,0,7)'
    });
}

function endLoading() {
    loading.close()
}

//请求拦截
axios.interceptors.request.use(config => {
    startLoading();

    if (localStorage.eleToken) {
        config.headers.Authorization = localStorage.eleToken;
    }

    return config;
}, err => {
    return Promise.reject(err);
});

//响应拦截
axios.interceptors.response.use(config => {
    endLoading();
    return config;
}, err => {
    endLoading();
    Message.error(err.response.data);

    const status = error.error;
    if(status == 401){
        Message.error('token失效,请重新登陆!');
        localStorage.removeItem('eleToken');
        router.push('/login');
    }

    return Promise.reject(err);
});


export default axios;