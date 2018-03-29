/**
 * Created by @xiaoziwuzui on 2016/11/13
 */
define('common/router',['common/underscore','common/backbone'], function(require, exports,module) {
	var Backbone=require('common/backbone');
	/**
	 * 创建路由对象
	 * @type {any}
	 */
	var BackboneRouter = Backbone.Router.extend({
		sectionGroupClass: 'page-group',
		//当前page的class名
		curPageClass: 'page-current',
		// 用来辅助切换时表示 page 是 visible 的,
		// 之所以不用 curPageClass，是因为 page-current 已被赋予了「当前 page」这一含义而不仅仅是 display: block
		// 并且，别的地方已经使用了，所以不方便做变更，故新增一个
		visiblePageClass: 'page-visible',
		// 表示是 page 的 class，注意，仅是标志 class，而不是所有的 class
		pageClass: 'page',
		routes:{
			'':'main',
			':controller(/*condition)':'loadActivity'
		},
		main:function () {
			this.loadActivity('index');
		},
		loadActivity:function (Activity,arg) {
			var params = {},me=this;
			if(arg && arg.indexOf(':') > -1) {
				arg.replace(/(\w+)\s*:\s*([\w-]+)/g, function(a, b, c) {
					b && (params[b] = c);
				});
			} else {
				params = arg;
			}
			if(window.CurrentActivity && Activity === window.CurrentActivity.id){
				window.CurrentActivity.onRefresh();
				return true;
			}
			/**
			 * 开始创建/恢复控制器
			 */
			if(window.Activity[Activity]){
				me.doSwitchActivity(Activity);
			}else{
				/**
				 * 异步加载指定的控制器
				 */
				console.log('加载新控制器:'+Activity);
				require.async(Activity, function(ActivityObject) {
					if(ActivityObject){
						/**
						 * 加载成功时,为新控制器创建HTML结构,并使用动画载入
						 */
						window.Activity[Activity] = ActivityObject;
						ActivityObject.onCreate(params);
						me.doSwitchActivity(Activity);
					}else{
						/**
						 * 异常处理
						 */
						console.log('加载控制器失败!');
					}
				})
			}
		},
		/**
		 * 切换控制器
		 * @param Activity 控制器对象
		 * @private
		 */
		doSwitchActivity:function (Activity) {
			/**
			 * 如果与当前的控制器是同一个,触发刷新事件.
			 */
			if(window.CurrentActivity && Activity === window.CurrentActivity.id){
				window.CurrentActivity.onRefresh();
				return true;
			}
			/**
			 * 判断缓存,如果存在,就恢复控制器
			 */
			if(window.Activity[Activity]) {
				/**
				 * 如果是后退的操作,激活当前控制器的暂停方法,后退的话肯定已经有当前控制器了.
				 * @type {*}
				 */
				if (window.Direction == -1) {
					window.CurrentActivity.onPause();
				}
				/**
				 * 恢复旧的控制器到页面上
				 * 准备切换动画
				 */
				this.myswithcDocument(Activity);
			}else{
				/**
				 * 加载了新的控制器
				 * 加载成功时,为新控制器创建HTML结构,并使用动画载入
				 */
				this.myswithcDocument(Activity);
			}
		},
		/**
		 * 先写一个小的来练手吧.
		 * 切换控制器
		 * @param Activity
		 */
		myswithcDocument:function (Activity) {
			/**
			 * 判断是否使用动画.
			 * 如果没有当前控制器,就判断新加入的控制器是否配置了动画,
			 * 如果有当前控制器,判断切入方向,
			 * 前进时从右向左,后退时从左向右
			 * @type {boolean}
			 */
			var animation = false;
			var animPageClasses = [
				'page-from-center-to-left',
				'page-from-center-to-right',
				'page-from-right-to-center',
				'page-from-left-to-center'].join(' ');
			var Current = window.CurrentActivity,newActivity=window.Activity[Activity];

			if(_.isEmpty(Current)){
				animation = false;
				//animation = newActivity._Animation;
			}else{
				animation = (Current._Animation !== false && newActivity._Animation !== false);
				if(window.Direction === -1){
					//如果是后退,需要判断两个都不启用动画
					animation = (Current._Animation !== false || newActivity._Animation !== false);
				}else if(window.Direction == 1){
					//如果是前进,只需要判断新控制器是否启用动画
					animation = newActivity._Animation !== false;
				}
			}

			console.log('页面切换方向:'+window.Direction);
			console.log('动画配置:'+animation);

			if(animation === false){
				if(!_.isEmpty(Current)){
					//不使用动画时,元素直接显示隐藏
					Current.$el.hide();
					//隐藏了控制器时,调用停止方法
					Current.onStop();
				}
				//显示新的控制器元素
				newActivity.$el.show();
				//重新设置当前控制器
				window.CurrentActivity = newActivity;
				//如果是第一次加载,调用Start方法,否则调用恢复方法
				if(newActivity.index === 0){
					newActivity.onStart();
					newActivity.index ++;
				}else{
					newActivity.onResume();
				}
			}else{
				var classForFrom, classForTo;
				switch(window.Direction) {
					case 1:
						classForFrom = 'page-from-center-to-left';
						classForTo = 'page-from-right-to-center';
						break;
					case -1:
						classForFrom = 'page-from-center-to-right';
						classForTo = 'page-from-left-to-center';
						break;
					default:
						classForFrom = 'page-from-center-to-left';
						classForTo = 'page-from-right-to-center';
						break;
				}
				if(!_.isEmpty(Current)){
					Current.$el.removeClass(animPageClasses).addClass(classForFrom);
					//在当前控制器动画完成之后,将其隐藏,并触发相应方法
					Current.$el.animationEnd(function() {
						console.log('当前控制器被切出');
						$(this).removeClass(animPageClasses);
						Current.$el.hide();
						Current.onStop();
					});
				}
				newActivity.$el.removeClass(animPageClasses).addClass(classForTo);
				//在新控制器动画完成之后,设置显示元素,并触发相应方法
				//显示新的控制器元素
				newActivity.$el.show();
				window.Activity[Activity].$el.animationEnd(function() {
					$(this).removeClass(animPageClasses);
					//重新设置当前控制器
					window.CurrentActivity = newActivity;
					//如果是第一次加载,调用Start方法,否则调用恢复方法
					if(newActivity.index === 0){
						newActivity.onStart();
						newActivity.index ++;
					}else{
						newActivity.onResume();
					}
				});
			}
		}
	});
	/**
	 * 定义一个变量保存页面上已经加载的控制器
	 * @type {Array}
	 */
	window.Activity = [];
	/**
	 * 当前活动的控制器
	 * @type {{}}
	 */
	window.CurrentActivity = {};
	/**
	 * 页面切换方向
	 * 1为前进,-1为后退,0为刷新或者页面新加载.
	 * @type {number}
	 */
	window.Direction = 0;
	/**
	 * 最上级的元素
	 * @type {any}
	 */
	window.$view = $('.page-group');
	/**
	 * 当前最大的StateID
	 * @type {number}
	 */
	window.maxStateId = 1;
	/**
	 * 最后一个state
	 * @type {{}}
	 */
	window.LastState = {};
	
	var NewRouter = function () {
		this.router = {};
	};
	_.extend(NewRouter.prototype,{
		init: function() {
			var me = this;
			me.router = new BackboneRouter;
			Backbone.history.start({pushState:true,setHash:true,trigger:true});
			$(document).on('click', 'a', function(e) {
				var $target = $(e.currentTarget);
				e.preventDefault();
				if ($target.hasClass('back')) {
					Backbone.history.back();
				} else {
					var url = $target.attr('href'),direction=$target.data('direction');
					if (!url || url === '#') {
						return;
					}
					me.router.navigate(url,{trigger:true,direction:direction ? direction : 1});
				}
			});
		}
	});
	module.exports = new NewRouter();
});
define('common/app',['common/util','common/tpl','common/router'], function(require, exports,module) {
	var Router = require('common/router');
	module.exports = window.App = _.extend(Router,{
		token:window.Config.token,
		usertime:window.Config.usertime,
		userinfo:{},
		width:0,
		height:0,
		initialize: function() {
			App.width = $(window).width();
			App.height = $(window).height();
			this.init();
		}
	});
});