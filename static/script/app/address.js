/**
 * Created by Administrator on 2016/10/13 0013.
 */
define('address',['common/app','common/util','common/activity'], function(require, exports,module) {
	var util = require('common/util'),Activity=require('common/activity');
	var HomeAddress = Activity.extend({
		id:'address',
		el:'#address',
		events:{

		}
	});
	module.exports = new HomeAddress;
});