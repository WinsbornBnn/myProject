$.ajaxPrefilter(function (options) {
    //一定放到地址的前面，后面加了‘/**’开头，就不用再加了
    if (options.url.startsWith('/my/')) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }
    options.url = 'http://ajax.frontend.itheima.net' + options.url;
    // options.url = 'http://192.168.50.200:3007' + options.url;
});