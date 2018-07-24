    ;(function(){
    var defaltOps = {
        duration:4000,//滚动时间间隔
        imgs:[],
        height:167, //banner的高度，需要根据图片尺寸计算出高度;
        focusScale:0.86,//中间banner缩放值,
        sideScale:0.66,//左右banner缩放
        sidePadding:6, //banner之间的空隙间距
        callback:undefined,//翻页回调，带页码参数
    }

    var currentFocus = -1 ;
    var banners = [] ;
    var sliderInterval ;
    var bodyWidth ;
    var sideTranslate ;
    var touching = false ; //是否在滑动
    var touchDownX ;
    var maxSliderPercent = 0.94 ;
    var touchMakePageChange = false ;
    function slider() {
        if(touching)
            return ;
        if(touchMakePageChange){ //滑动切换banner，忽略一次自动翻页
            touchMakePageChange = false ;
            return ;
        }
        currentFocus++;
        if(currentFocus>=banners.length)
            currentFocus = 0 ;
        var next = currentFocus + 1 ;
        if(next>= banners.length)
            next = 0 ;
        var pre = currentFocus - 1 ;
        if(pre< 0)
            pre = banners.length - 1 ;
        banners.forEach(function (t , i) {
            if(i == currentFocus){//去中
                t.style.transform = 'translate(0,0) scale(' + defaltOps.focusScale +')'
                t.style.transitionDuration = '500ms';
                t.style.zIndex = 3 ;
            }else if(i == next){//去右
                t.style.transform = 'translate('+sideTranslate+'px,0) scale(' + defaltOps.sideScale +')'
                t.style.transitionDuration = '100ms';
                t.style.zIndex = 0 ;
            }
            else{//去左
                t.style.transform = 'translate('+ (0 - sideTranslate)+'px,0) scale(' + defaltOps.sideScale +')'
                t.style.transitionDuration = '500ms';
                if(i == pre){
                    t.style.zIndex = 2 ;
                }else
                    t.style.zIndex = 1 ;
            }
            // else{
            //     t.style.left = bodyWidth +'px'
            //     t.style.transitionDuration = '0ms';
            //     t.style.zIndex = 1 ;
            // }
        })

        defaltOps.callback&&defaltOps.callback(currentFocus)
    }

    var banner = function(banner , options ){

        defaltOps = Object.assign(defaltOps ,options)
        if(typeof banner === 'string') banner = document.getElementById(banner);
        setTouchMoveEvent(banner)
        banner.style.overflow ='hidden'
        banner.style.display = 'flex'
        var width = document.body.clientWidth;
        bodyWidth = width ;
        sideTranslate = width - width * (2 - defaltOps.focusScale -defaltOps.sideScale) /2 + defaltOps.sidePadding;
        var container = document.createElement("div");
        banner.appendChild(container)
        container.style.width = width +'px';
        container.style.position = 'relative'
        container.style.overflow ='hidden'
        container.style.height = defaltOps.height + 10 +'px'

        options.imgs.forEach(function (t , i) {
            var imgView = document.createElement("img");
            imgView.src = t ;
            imgView.style.position = 'absolute'
            imgView.style.width = (width) + "px"
            imgView.style.left = "0px";
            imgView.style.borderRadius = '7px'
            imgView.style.border = '0px solid rgba(0,0,0,0.1)';
            imgView.style.boxShadow = '5px 5px 9px 9px rgba(0,0,0,0.1)';//边框阴影
            banners.push(imgView);
            container.appendChild(imgView);
        });
        slider();
        document.addEventListener('onunload',function () {
            clearInterval(sliderInterval)
        })
        sliderInterval = setInterval(slider,defaltOps.duration)
        return currentFocus;
    }


    //设置滑动事件监听
    function setTouchMoveEvent(banner) {
        banner.addEventListener('touchstart', touchSatrtFunc, false);
        banner.addEventListener('touchmove', touchMoveFunc, false);
        // banner.addEventListener('touchend', touchEndFunc, false);
        document.addEventListener('touchend', function (event) {
            touching = false ;
            var offset = event.changedTouches[0].clientX - touchDownX ;
            var percent = offset/bodyWidth ;

            if(Math.abs(percent)>0.4){
                if(percent>0.4){ //上一页
                    touchSlider(-1,percent)
                }else if(percent<-0.4)//下一页
                {
                    touchSlider(1,percent)
                }
                touchMakePageChange = true ;
            }else{
                if(percent>0){
                    touchSlider(0,percent)
                }else if(percent<0)
                {
                    touchSlider(0,percent)
                }
            }

        }, false);

    }
    function touchSlider( nextBanner ,percent ) {
        if(percent>maxSliderPercent)
            percent = maxSliderPercent ;
        if(percent<-maxSliderPercent)
            percent =-maxSliderPercent
        var duration = 500 * Math.abs(percent);
        currentFocus = currentFocus + nextBanner;
        if(currentFocus>=banners.length)
            currentFocus = 0 ;
        else if(currentFocus < 0){
            currentFocus = banners.length-1
        }
        var next = currentFocus + 1 ;
        if(next>= banners.length)
            next = 0 ;
        var pre = currentFocus - 1 ;
        if(pre< 0)
            pre = banners.length - 1 ;
        banners.forEach(function (t , i) {
            if(i == currentFocus){//去中
                t.style.transform = 'translate(0,0) scale(' + defaltOps.focusScale +')'
                t.style.transitionDuration = duration+'ms';
                t.style.zIndex = 3 ;
            }else if(i == next){//去右
                if(nextBanner<0){
                    t.style.transform = 'translate('+sideTranslate+'px,0) scale(' + defaltOps.sideScale +')'
                    t.style.transitionDuration = duration+'ms';
                    t.style.zIndex = 0 ;
                }else{
                    t.style.transform = 'translate('+sideTranslate+'px,0) scale(' + defaltOps.sideScale +')'
                    t.style.transitionDuration = '20ms';
                    t.style.zIndex = 0 ;
                }

            }
            else{//去左
                if(nextBanner<0){
                    t.style.transform = 'translate('+ (0 - sideTranslate)+'px,0) scale(' + defaltOps.sideScale +')'
                    t.style.transitionDuration = '20ms';
                }else{
                    t.style.transform = 'translate('+ (0 - sideTranslate)+'px,0) scale(' + defaltOps.sideScale +')'
                    t.style.transitionDuration = duration+'ms';
                }
                if(i == pre){
                    t.style.zIndex = 2 ;
                }else
                    t.style.zIndex = 1 ;
            }
        })
        defaltOps.callback&&defaltOps.callback(currentFocus)
    }
    function touchSatrtFunc(event) {
        touching = true ;
        touchDownX = event.touches[0].clientX ;
    }
    function touchMoveFunc(event) {
        // console.log("touch move " ,event )
        var next = currentFocus + 1 ;
        if(next>= banners.length)
            next = 0 ;
        var pre = currentFocus - 1 ;
        if(pre< 0)
            pre = banners.length - 1 ;
        var offset = event.touches[0].clientX - touchDownX ;
        var percent = offset/bodyWidth ;
        if(percent>maxSliderPercent)
            percent = maxSliderPercent ;
        if(percent<-maxSliderPercent)
            percent =-maxSliderPercent
        var scaleChange = Math.abs(percent) * (defaltOps.focusScale - defaltOps.sideScale) ;//缩放滑动变化因子
        banners.forEach(function (t , i) {

            if(i == currentFocus){//去中
                t.style.transform = 'translate('+(sideTranslate * percent )+'px,0) scale('
                    + (defaltOps.focusScale - scaleChange) +')'
                t.style.zIndex = 3 ;
            }else if(i == next){//去右
                var scale = percent > 0 ? defaltOps.sideScale : (defaltOps.sideScale + scaleChange)
                t.style.transform = 'translate('+sideTranslate * (1 + percent )+'px,0) scale(' + scale+')'
                t.style.zIndex = 0 ;
            }
            else if(i == pre){
                var scale = percent < 0 ? defaltOps.sideScale : (defaltOps.sideScale + scaleChange)
                t.style.transform = 'translate('+sideTranslate * ( percent -1 )+'px,0) scale(' + scale +')'
                t.style.zIndex = 3 ;
            }
            else{//去左
                t.style.transform = 'translate('+ (0 - sideTranslate)+'px,0) scale(' + defaltOps.sideScale +')'
                if(i == pre){
                    t.style.zIndex = 2 ;
                }else
                    t.style.zIndex = 1 ;
            }
            t.style.transitionDuration = '0ms';

        })
        event.stopPropagation()
    }
    function touchEndFunc(event) {
        console.log("touch end " ,event )

    }
    if(typeof exports == "object") {
        module.exports = banner
    } else if(typeof define == "function" && define.amd) {
        define([], function() {
            return banner
        })
    } else if(window) {
        window.banner = banner
    }
})()