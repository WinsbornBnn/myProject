$(document).ready(function () {
    layui.form.verify({
        pwd: [/^\S{6,18}$/, '密码必须是6~18位字符且不能包含空格'],
        samePwd: function (value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新旧密码不能相同！'
            }
        },
        repwd: function (value) {
            if (value !== $('[name=newPwd]').val()) return '两次密码不一致!';
        }
    });

    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('更新密码失败！')
                }
                layui.layer.msg('更新密码成功！');
                // 重置表单
                $('.layui-form')[0].reset();
                localStorage.removeItem('token');
                window.parent.location.href = '/login.html'
            }
        });
    });
});