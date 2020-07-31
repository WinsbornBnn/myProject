$(document).ready(function () {
    initUserInof();
    var { form } = layui;
    form.verify({
        nickname: function (value) {
            if (value.length > 12) {
                return '昵称长度在1 ~ 12个字符之间!';
            }
        }
    });
    //初始化用户的基本信息
    function initUserInof() {
        $.ajax({
            method: 'get',
            url: '/my/userinfo',
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg("获取用户信息失败！");
                }
                form.val("formUserInfo", res.data);
            }
        });
    }
    //重置表单重置行为
    $("#btnReset").on('click', function (e) {
        e.preventDefault();
        //调用函数重新发起ajax请求
        initUserInof();
    });
    $("#myform").on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'post',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('修改用户信息失败');
                }
                layer.msg('修改用户信息成功');
                window.parent.getUserInfo();
            }
        });
    });
});