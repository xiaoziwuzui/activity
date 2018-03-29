/**
 * Created by @xiaoziwuzui on 2016/11/15.
 * 页面控制器基类
 */
define('common/activity',['common/backbone'], function(require, exports,module) {
    var Backbone=require('common/backbone');
    module.exports = Backbone.View.extend({
		index:0,
        id:'activity',
        _Animation:'right-to-left',
        _closeDropLoad:function () {
		    this.$('.content>.dropload-down').hide();
        },
        /**
         * 向主界面中创建当前控制的页面结构
		 * 其实require.async在此处等同于同步方法,没有走网络请求
         */
        onCreate:function () {
            var me = this;
            require.async('tpl/'+me.id, function(view) {
                var $dom = $($('<div></div>').append(view).find('.'+App.router.sectionGroupClass).html());
                $dom.find('.content').append('<div class="dropload-down"><div class="dropload-load"><span class="loading"></span>加载中...</div></div>');
                window.$view.prepend($dom);
                me.$el = window.$view.find(me.el = '#'+me.id);
            });
        },
		/**
		 * 由路由启动,初始化整个控制器
         * 主动关闭加载框
		 */
        onStart:function (argument) {
            this._closeDropLoad();
        },
		/**
		 * 当页面前进或后退到当前控制器时,恢复控制器
		 */
        onResume:function (argument) {},
		/**
		 * 页面刷新,或者地址一样时,触发刷新方法
		 */
        onRefresh:function (argument) {},
		/**
		 * 页面开始切出时,暂停控制器中的方法
		 */
        onPause:function (argument) {},
		/**
		 * 页面被切出时,停止控制器
		 */
        onStop:function () {},
		/**
		 * 当DOM从组中被删除时,销毁控制器
		 */
        onDestroy:function () {
            this.remove();
        }
    });
});