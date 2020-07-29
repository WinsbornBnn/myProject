$(function () {
    $("#reg_link").on('click', function () {
        $('.reg-box').show().siblings('.login-box').hide();
    });
    $("#login_link").on('click', function () {
        $('.reg-box').hide().siblings('.login-box').show();
    });
    //自定义密码校验
    layui.form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须是6至12位且不能有空格'],
        repwd: function (value) {
            var pwd = $(".reg-box [name=password]").val();
            if (pwd != value) {
                return '两次密码不一致！';
            }
        }
    });
    var { layer } = layui;
    //监听注册表单的提交事件
    $("#form_reg").on("submit", function (e) {
        e.preventDefault();
        var username = $("#form_reg [name=username]").val();
        var password = $("#form_reg [name=password]").val();
        $.ajax({
            method: 'POST',
            url: '/api/reguser',
            data: {
                username: username,
                password: password
            },
            success: function (res) {
                console.log(res);
                if (res.status != 0) return layer.msg(res.message);
                layer.msg(res.message);
                //模拟点击事件 跳转登录页面
                $("#login_link").click();
            }
        });
    });
    //监听登录表单的提交事件
    $("#form_login").on("submit", function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/api/login',
            data: $(this).serialize(),//快速收集表单数据
            success: function (res) {
                console.log(res);
                if (res.status != 0) return layer.msg('登录失败');
                layer.msg('登录成功');
                //toktn存储到本地
                localStorage.setItem('token', res.token);
                location.href = '/index.html';
            }
        });
    });
});