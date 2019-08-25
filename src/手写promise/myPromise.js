let myPromise = function(fn){
    let self = this;//存储this指向
    self._resolve = [];
    self._status = "PENDING";
    this.then = function(cb){//调用then方法，将回调保存到队列
        return new myPromise(function(resolve){
        	function handle(value){
        		var ret = typeof cb === "function" && cb(value) || value;
        		if(ret && typeof ret["then"] == "function"){
        			ret.then(function(value){
        				resolve(value);
        			});
        		}else{
        			resolve(ret);
        		}
        	}

        	if(self._status == "PENDING"){
        		self._resolve.push(handle);
        	}else if(self._status == "FULFILLED"){
        		handle(value);
        	}
        });
    }
    
    function resolve(value){
        setTimeout(function(){//如果传入的是一个不包含异步操作的函数
        //resolve就会先于then执行，也就是 self._resolve 数组对象是一个空的数组
        //之所以加setTimeout 就是改变执行优先级
        // console.log(self._resolve.length)
            self._resolve.forEach(function(callback){
            	self._status = "FULFILLED";
                callback(value);
            });
        },0);
    }
    fn(resolve);
}

let boilwater = function(){
    return new myPromise(function(resolve, reject){//resolve成功, reject失败
        setTimeout(function(){
            resolve("boilwater");
        },5000)
    });
}

let Tea = function(){
    return new myPromise(function(resolve, reject){//resolve成功, reject失败
        setTimeout(function(){
        	console.log("1")
            resolve("Tea");
            console.log("2")
        },1000)
    });
}

let washGlassa = function(){//resolve成功, reject失败
    return new myPromise(function(resolve, reject){
        setTimeout(function(){
            resolve("washGlassa");
        },2000)
    });
}

boilwater().then(function(data){
    console.log(data);
    return Tea();
}).then(function(data){
    console.log(data);
    return washGlassa();
}).then(function(data){
    console.log(data);
});