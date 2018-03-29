/**
 * Created by @xiaoziwuzui on 2016/11/15.
 */
define('common/util',['common/hashmap'], function(require, exports,module) {
    var Hashmap = require('common/hashmap');
    //定义全局变量App
    var util = {
        api:function(param){
            var me = this;
            if(!param.type) param.type = 'POST';
            if(!param.data) param.data = {};
            if(!param.handle) param.handle = false;
            if(!param.closewait) param.closewait = true;
            if(typeof(param.token) == "undefined") param.token = true;
            if(param.token && !param.data.token){
                //param.data.token = plus.storage.getItem('token');
            }
            param.data.client = Yuexiang.client;
            param.data.version = Yuexiang.version;
            $.ajax({
                url:param.url,
                data:param.data,
                type:param.type,
                dataType:'json',
                error:function(result,status){
                    if(param.log){
                        util.log(param.url);
                        util.log(result);
                    }
                    if(param.handle){
                        param.callback && param.callback.call(this,result);
                    }else{
                        util.closeWaiting();
                        me.error(result.msg);
                    }
                },
                success:function(result,status){
                    if(param.log){
                        util.log(param.url);
                        util.log(result);
                    }
                    if(result.code === 1){
                        if(param.handle){
                            param.callback && param.callback.call(this,result);
                        }else{
                            param.callback && param.callback.call(this,result.result);
                            if(param.closewait === true){
                                util.closeWaiting();
                            }
                        }
                    }else{
                        if(param.closewait === true){
                            util.closeWaiting();
                        }
                        if(result.code === 2){
                            //TODO 完成登录处理
                            $.router.load('login');
                        }else{
                            if(param.handle){
                                param.callback && param.callback.call(this,result);
                            }else{
                                me.error(result.msg);
                            }
                        }
                    }
                }
            });
        },
        error:function(message){
            $.alert(message);
        },
        /**
         * 创建AJAX请求地址,主要拼装前缀
         */
        ajaxurl:function(action){
            return Yuexiang.api_path + 'Wechat/' + action;
        },
        /**
         * 渲染模板内容
         */
        parseTemplate:function (template,$data,$appendTo,type,callback) {
            if(typeof(template) !== "string"){
                this.log('传入的模板不是字符');
                return false;
            }
            if(_.isUndefined(type)){
                type = 1;
            }
            var parseHtml = _.template(template,$data);
            $(parseHtml).appendTo(type == 1 ? $appendTo.empty() : $appendTo);
            callback && callback.call(this);
        },
        /**
         * 为指定的视图对象设置表单值
         * @param $el 视图
         * @param data 数据对象
         */
        parseField:function ($el,data) {
            var field = '';
            $('.data-input',$el).each(function () {
                field = $(this).data('field');
                if(!_.isUndefined(field) && !_.isUndefined(data[field])){
                    $(this).val(data[field]);
                }
            });
        },
        /**
         * 从视图中提取已经填好的表单值
         * @param $el 视图对象
         */
        getTemplateField:function ($el) {
            var field = '',data={};
            $('.data-input',$el).each(function () {
                field = $(this).data('field');
                if(!_.isUndefined(field)){
                    data[field] = $(this).val();
                }
            });
            return data;
        },
        /**
         * 返回一个完整的资源文件地址
         * @param assets
         */
        parseAssets:function (assets) {
            return !_.isEmpty(assets) ? Yuexiang.cdn_path + assets.slice(1) : Yuexiang.static_path + 'images/default/blank.png';
        },
        /**
         * 返回一张默认的图片
         * @param type
         */
        getDefaultImg:function (type) {
            return Yuexiang.static_path + 'images/default/'+type+'.jpg';
        },
        /**
         * 吐司提示
         * @param msg
         * @param duration
         */
        toast:function (msg,duration) {
            $.toast(msg,duration);
        },
        /**
         * 显示一个加载等待框
         * @param title
         */
        showWaiting:function (title) {
            if(_.isUndefined(title)){
                $.showIndicator();
            }else{
                $.showPreloader(title);
            }
        },
        /**
         * 关闭所有的加载框
         */
        closeWaiting:function () {
            $.hidePreloader();
            $.hideIndicator();
        },
        /**
         * 打印LOG
         * @param a string 被打印的对象.
         * @returns {boolean}
         */
        log: function (a) {
            if(!Yuexiang.debug){
                return false;
            }
            if(window.console){
                console.log(a);
            }
        },
        /**
         * 反回当前时间戳
         * @returns {number}
         */
        time: function () {
            return Date.parse(new Date()) / 1000;
        },
        /**
         * JS浮点计算加法解决
         */
        add:function(a, b){
            var c, d, e;
            try {
                c = a.toString().split(".")[1].length;
            } catch (f) {
                c = 0;
            }
            try {
                d = b.toString().split(".")[1].length;
            } catch (f) {
                d = 0;
            }
            e = Math.pow(10, Math.max(c, d));
            return (mul(a, e) + mul(b, e)) / e;
        },
        /**
         * JS浮点计算BUG减法解决
         * @param a
         * @param b
         * @returns {number}
         */
        sub:function (a, b) {
            var c, d, e;
            try {
                c = a.toString().split(".")[1].length;
            } catch (f) {
                c = 0;
            }
            try {
                d = b.toString().split(".")[1].length;
            } catch (f) {
                d = 0;
            }
            e = Math.pow(10, Math.max(c, d));
            return (mul(a, e) - mul(b, e)) / e;
        },
        /**
         * JS浮点计算乘法解决
         * @param a
         * @param b
         * @returns {number}
         */
        mul:function(a, b) {
            var c = 0,
                d = a.toString(),
                e = b.toString();
            try {
                c += d.split(".")[1].length;
            } catch (f) {}
            try {
                c += e.split(".")[1].length;
            } catch (f) {}
            return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
        },
        /**
         * JS浮点计算BUG除法解决
         * @param a
         * @param b
         */
        div:function (a, b) {
            var c, d, e = 0,
                f = 0;
            try {
                e = a.toString().split(".")[1].length;
            } catch (g) {}
            try {
                f = b.toString().split(".")[1].length;
            } catch (g) {}
            c = Number(a.toString().replace(".", ""));
            d = Number(b.toString().replace(".", ""));
            return mul(c / d, Math.pow(10, f - e));
        }
    };
    module.exports = util;
});