$(document).ready(function () {
    var { layer } = layui;
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image');
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options);
    //点击上传按钮模拟文件上传功能
    $("#btn").on('click', function () {
        $("#file").click();
    });
    //
    $("#file").on('change', function () {
        console.log(this.files);
        if (this.files.length <= 0) return layer.msg('请选择文件');
        // 1. 拿到用户选择的文件
        var file = this.files[0]
        // 2. 将文件，转化为路径
        var imgURL = URL.createObjectURL(file)
        // 3. 重新初始化裁剪区域
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', imgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    });
    //给确定按钮添加事件上传头像到服务器
    $("#addbtn").on('click', function () {
        var dataURL = $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png');
        //ajax发起请求
        $.ajax({
            method: 'post',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('更换头像失败！');
                }
                layer.msg('更换头像成功！');
                window.parent.getUserInfo();
            }
        });
    });
});