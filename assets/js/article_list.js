$(document).ready(function () {
    var { layer } = layui;
    var { form } = layui;
    var { laypage } = layui;
    //定义时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date);
        var year = dt.getFullYear();
        var month = padZero(dt.getMonth() + 1);
        var day = padZero(dt.getDate());

        var hour = padZero(dt.getHours());
        var minute = padZero(dt.getMinutes());
        var second = padZero(dt.getSeconds());
        var str = `${year}年${month}月${day}日${hour}时${minute}分${second}秒`;
        return str;
    }
    function padZero(n) {
        return n > 9 ? n : '0' + n;
    }


    // 定义一个查询的参数对象，将来请求数据的时候，
    // 需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    }
    initTable();
    // 封装函数获取列表内容
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！');
                }
                layer.msg('获取文章列表成功！');
                // 使用模板引擎渲染页面的数据
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
                //调用分页函数
                renderPage(res.total);
            }
        })
    }
    initCate()
    //初始化文章列表的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败');
                }
                layer.msg('获取分类数据成功');
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                form.render('select');//layui重新渲染
            }
        });
    }
    //筛选功能
    $("#form-search").on('submit', function (e) {
        e.preventDefault();
        q.cate_id = $('[name=cate_id]').val();
        q.state = $('[name=state]').val();
        initTable();
    });
    //分页功能
    function renderPage(total) {
        //调用laypage.render渲染页码结构
        laypage.render({
            elem: 'pageBox',//分页容器
            count: total,//总数据条
            limit: q.pagesize,//每页显示几条数据
            curr: q.pagenum,//设置默认选中页码
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 4, 6, 8, 10],//每页显示多少条
            // 1. 点击页码的时候，会触发 jump 回调
            // 2. 只要调用了 laypage.render() 方法，就会触发 jump 回调
            jump: function (obj, first) {
                // console.log(obj);
                //最新页码赋值
                q.pagenum = obj.curr;
                // 最新页码条目数
                q.pagesize = obj.limit;
                // 可以通过 first 的值，来判断是通过哪种方式，触发的 jump 回调
                // 如果 first 的值为 true，证明是方式2触发的
                // 否则就是方式1触发的
                if (!first) {
                    initTable();
                }
            }
        });
    }
    //删除功能
    $('tbody').on('click', '.btn-delete', function () {
        // 获取到文章的 id
        var id = $(this).attr('data-id');
        var length = $('.btn-delete').length
        console.log(length);
        // 询问用户是否要删除数据
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！');
                    }
                    layer.msg('删除文章成功！');
                    //如果当前页面全部删除，就显示上一页，页码最小值为1
                    //判断页码个数
                    if (length == 1) {
                        q.pagenum = q.pagenum == 1 ? 1 : q.pagenum - 1;
                    }
                    initTable();
                }
            });
            layer.close(index);
        });
    });
});