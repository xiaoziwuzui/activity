/**
 * Created by @xiaoziwuzui on 2016/10/13
 */
window.Config = {
	domain_path:'./',
	static_path:'./static/',
	api_path:'./proxy.php',
	app_path:'./static/script/app/',
	debug:true,
	client:'wap',
	token:'',
	version:'0.1',
	pagesize:10,
	sea_rand:{
		debug:true,
		param:'_',
		hash: function(){
			var d = new Date();
			return d.getFullYear() + '_' + d.getMinutes() + '_' + d.getSeconds();
		}
	},
	router:{
		'index':'',
		'product':'index',
		'productdetail':'product',
		'address':'user',
		'login':'user',
		'user':'index'
	}
};
$(document).ready(function () {
	'use strict';
	seajs.config({
		base: window.Config.app_path,
		debug: window.Config.debug,
		alias: {}
	});
	seajs.use('common/app',function(app){
		app.initialize();
	});
});