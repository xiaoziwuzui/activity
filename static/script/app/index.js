/**
 * Created by Administrator on 2016/10/13 0013.
 */
define('index',['common/app','common/util','common/activity'], function(require, exports,module) {
	var util = require('common/util'),Activity=require('common/activity');
	var HomeIndex = Activity.extend({
		id:'index',
		el:'#index',
		_Animation:false,
		events:{

		},
		onStart:function () {
			this._closeDropLoad();
			this.$el.find('.menu-tab').show();
		}
	});
	module.exports = new HomeIndex;
});