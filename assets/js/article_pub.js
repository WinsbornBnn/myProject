$(document).ready(function () {
    var { layer } = layui;
    var { form } = layui;
    initCate();
    initEditor();
    //获取文章类别
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败');
                }
                var htmlStr = template('tpl_option', res);
                $('[name=cate_id]').html(htmlStr);
                form.render('select');//重新渲染
            }
        });
    }
    // 1. 初始化图片裁剪器
    var $image = $('#image');
    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    };
    // 3. 初始化裁剪区域
    $image.cropper(options);
    //给选择封面的按钮，绑定事件
    $("#btnChooseImage").on('click', function () {
        //模拟上传按钮点击事件
        $("#coverFile").click();
    });
    //给coverFile绑定change事件，获取用户文件列表
    $("#coverFile").on('change', function (e) {
        // 获取文件列表数组
        var files = e.target.files;
        // 判断是否选择文件
        if (files.length == 0) return layer.msg('请选择文件');
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
    // 定义文章发布状态
    var art_state = '已发布';
    // 草稿按钮绑定事件处理函数
    $("#btnSave2").on('click', function () {
        art_state = '草稿';
    });
    // 给表单绑定事件
    $("#form-pub").on('submit', function (e) {
        e.preventDefault();
        // 创建FormData 对象
        var fd = new FormData($(this)[0]);
        //将文章发布状态，存到fd
        fd.append('state', art_state);
        //将裁剪过后的封面输出为一个对象
        $image.cropper('getCroppedCanvas', {
            width: 400,
            height: 280
        }).toBlob(function (blob) {
            // 将 Canvas 画布上的内容，转化为文件对象
            // 得到文件对象后，进行后续的操作
            // 5. 将文件对象，存储到 fd 中
            fd.append('cover_img', blob)
            // 6. 发起 ajax 数据请求
            publishArticle(fd);
        });
    });
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意：如果向服务器提交的是 FormData 格式的数据，
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败');
                }
                layer.msg('发布文章成功');
                // 发布文章成功后，跳转到文章列表页面
                location.href = '/article/article_list.html';
            }
        });
    }
});