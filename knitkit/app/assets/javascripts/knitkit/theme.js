// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.
//
//= require_self

$(function () {
    $(window).scroll(function() {
        if ($(".navbar").offset().top>30) {
            $(".navbar-fixed-top").addClass("sticky");
        }
        else {
            $(".navbar-fixed-top").removeClass("sticky");
        }
    });

    // Flex
    if ($(".flexslider").length) {
        $('.flexslider').flexslider();
    }

    servicesCircle.initialize();

    staticHeader.initialize();

    portfolioItem.initialize();


    // segun esto corrige el pedo del dropdown en tablets and such
    // hay que testearlo!
    $('.dropdown-toggle').click(function(e) {
        e.preventDefault();
        setTimeout($.proxy(function() {
            if ('ontouchstart' in document.documentElement) {
                $(this).siblings('.dropdown-backdrop').off().remove();
            }
        }, this), 0);
    });
});

var portfolioItem = {
    initialize: function () {
        var $container = $("#portfolio_tem .left_box");
        var $bigPics = $container.find(".big img");
        var $thumbs = $container.find(".thumbs .thumb");

        $bigPics.hide().eq(0).show();

        $thumbs.click(function (e) {
            e.preventDefault();
            var index = $thumbs.index(this);
            $bigPics.fadeOut();
            $bigPics.eq(index).fadeIn();
        });
    }
}

var staticHeader = {
    initialize: function () {
        if ($(".navbar-static-top").length) {
            $("body").css("padding-top", 0);
        }
    }
}

var servicesCircle = {
    initialize: function () {
        var $container = $(".services_circles");
        var $texts = $container.find(".description .text");
        var $circles = $container.find(".areas .circle");

        $circles.click(function () {
            var index = $circles.index(this);
            $texts.fadeOut();
            $texts.eq(index).fadeIn();
            $circles.removeClass("active");
            $(this).addClass("active");
        });
    }
}


