var t = (function(){
	var i = 0;
	return {
       get:function(){return i}, 
       set: function(j){i = j}}//匿名函数是闭包的一部分，而且是一个全局变量，会通过set方法来改变父函数原有的私有变量i的值
})()


