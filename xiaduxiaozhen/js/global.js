
$(function () {
    if($(".rippler").length>0){
        $(".rippler").rippler({
            effectClass      :  'rippler-effect'
            ,effectSize      :  10      // Default size (width & height)
            ,addElement      :  'div'   // e.g. 'svg'(feature)
            ,duration        :  400
        });
    }

    $('.swiper-slide img').on('touchstart',function(){
        $(this).addClass('active')
    })
    $('.swiper-slide img').on('touchend',function(){
        $(this).removeClass('active')
    })
});