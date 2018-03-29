/**
 * Created by Administrator on 2016/10/13 0013.
 */
define('detail',['common/app','common/util','common/activity'], function(require, exports,module) {
	var util = require('common/util'),Activity=require('common/activity');
	var Homedetail = Activity.extend({
		id:'detail',
		el:'#detail',
		events:{

		}
	});
	module.exports = new Homedetail;
});