$(function () {
    function MapPlugin() {
        this.active = '';
        this.key = [];
        this.keys = {};
        this.ids = {};
        this.initMap();
        this.init();
    }

    MapPlugin.prototype = {
        initMap: function () {
            var self = this;
            var mp = new BMap.Map("map");
            var point = new BMap.Point(116.404, 39.915);
            mp.centerAndZoom(point, 14);
            mp.enableScrollWheelZoom();
            mp.enableInertialDragging();
            mp.enableContinuousZoom();

            var size = new BMap.Size(10, 20);
            mp.addControl(new BMap.CityListControl({
                anchor: BMAP_ANCHOR_TOP_LEFT,
                offset: size,
                onChangeAfter: function () {
                    self.select()
                }
            }));
            this.mapLocal = new BMap.LocalSearch(mp, {
                renderOptions: {map: mp, panel: "r-result"},
                pageCapacity: 80
            });
            this.mapLocal.setSearchCompleteCallback(function (pois) {
                $.each(pois, function (a, b) {
                    $.each(b.yr, function (c, d) {
                        self.ids[d.uid] = self.keys[b.keyword]
                    });
                });
            });
            this.mapLocal.setMarkersSetCallback(function (pois) {
                $.each(pois, function (a, b) {
                    $(b.marker.Ac).find('img').attr({
                        style: '',
                        src: 'img/' + self.ids[b.uid] + '.png'
                    })
                });
            });
            this.map = mp;
        },
        init: function () {
            var self = this;
            $('.plugIn-box').each(function () {
                var w = ($(this).outerWidth() - $(this).closest('li').outerWidth()) / 2;
                $(this).offset({left: -w})
            });
            $('.container').click(this.hide);
            $('.plugIn-list > li').click(function (e) {
                e.stopPropagation();
                self.active = $(this).data('v');
                var box = $(this).find('.plugIn-box');
                var v = $(this).find('span').html();
                if ($(this).hasClass('active')) {
                    $(this).removeClass('active');
                    if (box.length <= 0) {
                        if ($.inArray(v, self.key) >= 0) {
                            self.removeKey(v);
                            self.select();
                        }
                    } else {
                        self.hide()
                    }
                } else {
                    self.hide();
                    $(this).addClass('active');
                    if (box.length <= 0) {
                        if ($.inArray(v, self.key) < 0) {
                            self.saveKey(v);
                            self.select();
                        }
                    } else {
                        self.show(box)
                    }
                }

            });
            $('.plugIn-box > li').click(function (e) {
                e.stopPropagation();
                if (self.key.length === 10 && !$(this).hasClass('active')) {
                    alert('最多同时支持搜索10个选项!')
                } else {
                    if ($(this).hasClass('active')) {
                        self.removeKey($(this).html());
                        $(this).removeClass('active');
                    } else {
                        $(this).addClass('active');
                        self.saveKey($(this).html());
                    }
                    self.select();
                }
            })
        },
        saveKey: function (value) {
            value = $.trim(value);
            this.keys[value] = this.active;
            this.key.push(value);
        },
        removeKey: function (value) {
            value = $.trim(value);
            var index = $.inArray(value, this.key);
            this.key.splice(index, 1);
        },
        show: function (box) {
            $(box).show();
        },
        hide: function () {
            $('.plugIn-box').hide();
            $('.plugIn-list > li:not(.noList)').removeClass('active');
        },
        select: function () {
            this.mapLocal.search(this.key);
        }
    };
    window.mapPlugin = new MapPlugin();

});