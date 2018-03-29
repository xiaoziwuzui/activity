/**
 * Created by @xiaoziwuzui on 2016/11/15.
 */
define("common/hashmap", [], function(require, exports, module) {
    HashMap = function(){
        var size = 0;
        var entry = {};
        this.put = function (key , value){
            if(!this.containsKey(key)){size ++ ;}
            entry[key] = value;
        };
        this.get = function (key){
            return this.containsKey(key) ? entry[key] : null;
        };
        this.remove = function(key){
            if( this.containsKey(key)&&(delete entry[key])){size --;}
        };
        this.containsKey = function(key){
            return (key in entry);
        };
        this.getData = function(){
            var data = [];
            for(var prop in entry){
                data.push(entry[prop]);
            }
            return data;
        };
        this.containsValue = function (value){
            for(var prop in entry){
                if(entry[prop] == value){return true;}
            }
            return false;
        };
        this.size = function (){
            return size;
        };
        this.clear = function (){
            size = 0;
            entry = {};
        };
    };
    module.exports = HashMap
});