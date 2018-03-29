/**
 * Created by Administrator on 2016/10/13 0013.
 */
define('order',['common/app','common/util','common/activity'], function(require, exports,module) {
	var util = require('common/util'),Activity=require('common/activity');
	var HomeOrder = Activity.extend({
		id:'order',
		el:'#order',
		_Animation:false,
		events:{

		}
	});
	module.exports = new HomeOrder;
});