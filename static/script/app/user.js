/**
 * Created by Administrator on 2016/10/13 0013.
 */
define('user',['common/app','common/util','common/activity'], function(require, exports,module) {
	var util = require('common/util'),Activity=require('common/activity');
	var HomeUser = Activity.extend({
		id:'user',
		el:'#user',
		_Animation:false,
		events:{

		}
	});
	module.exports = new HomeUser;
});