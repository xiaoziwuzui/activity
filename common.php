<?php
/**
 * Created by PhpStorm.
 * User: jiangtaiping
 * Date: 2016/11/16
 * Time: 13:53
 * 生成模板文件
 */
require 'compile.php';
define('ROOT',str_replace('\\','/',dirname(__FILE__)).'/');
$tpl_list = glob(ROOT.'static/tpl/*.html');
$content = array();
$file_content = '';
$file_name = '';
foreach ($tpl_list as $v){
    $file_content = CompileFile::html($v);
    $file_name = str_replace(array(ROOT.'static/tpl/','.html'),array('',''),$v);
    $content[] = 'define(\'tpl/'.$file_name.'\',[],function (require, exports,module) {'.chr(10).'  module.exports = \''.$file_content.'\';'.chr(10).'});';
}
file_put_contents(ROOT.'static/script/app/common/tpl.js',implode(chr(10),$content));

