$(document).ready(function () {
    initArtCateList();
    //封装函数获取文章的列表
    function initArtCateList() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function (res) {
                var html = template('tpl-table', res);
                $("tbody").html(html);
            }
        });
    }
    var { layer } = layui;
    var { form } = layui;
    var indexAdd = null;//添加的弹出层索引
    var indexEdit = null;//编辑的弹出层索引
    $("#btnAddCate").on('click', function () {
        indexAdd = layer.open({
            type: 1,//确认按钮会消失
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        });
    });
    //事件委托实现添加功能
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败！');
                }
                initArtCateList();
                layer.msg('新增分类成功');
                //根据索引关闭弹出层
                //1.模拟关闭按钮点击事件
                // $('.layui-layer-close').click();
                //2.layui 提供的方法
                layer.close(indexAdd);
            }
        });
    });
    //事件委派实现编辑功能
    $('tbody').on('click', '.btn-edit', function () {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        });
        // 给编辑按钮自定义ID值
        var id = $(this).attr('data-id');
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                form.val('form-edit', res.data);
            }
        });
    });
    //事件委托编辑表单绑定事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    layer.msg('修改数据失败！');
                }
                layer.msg('修改数据成功！');
                layer.close(indexEdit);
                initArtCateList();
            }
        });
    });
    //删除功能
    $('tbody').on('click', '.btn-delete', function () {
        // 给删除按钮自定义ID值
        var id = $(this).attr('data-id');
        layer.confirm('确定删除？', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    // console.log(res);
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败！');
                    }
                    layer.msg('删除分类成功！');
                    initArtCateList();
                }
            });
            layer.close(index);
        });
    });
});
