$(document).ready(function () {
    //调用函数获取用户信息
    getUserInfo();
    var { layer } = layui;
    $("#btnLogout").on('click', function () {
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
            //1.清空本地存储token
            localStorage.removeItem('token');
            //2.跳转到登录界面
            location.href = '/login.html';
            //关闭询问框
            layer.close(index);
        });
    });
});
//封装函数获取用户基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        //请求头配置对象
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            if (res.status != 0) return layui.layer.msg('获取用户信息失败');
            //调用函数渲染用户头像
            renderAvatar(res.data);
        },
        //无论成功与否都要调用templete函数
        complete: function (res) {
            //在complete函数中，可以使用res.response.JSON 拿到服务器响应回来的数据
            if (res.responseJSON.status === 1 && res.responseJSON.message == '身份认证失败！') {
                //强制清空token
                localStorage.removeItem('token');
                //强制跳转到登录页面
                location.href = '/login.html';
            }
        }
    });
}
//渲染头像
function renderAvatar(user) {
    //1.获取用户名
    var name = user.nickname || user.username;
    //2.设置欢迎文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
    //3.按需渲染用户头像
    if (user.user_pic !== null) {
        //3.1渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        //3.2渲染文本头像
        $('.layui-nav-img').hide();
        var first = name[0].toUpperCase();
        $('.text-avatar').html(first).show();
    }
}