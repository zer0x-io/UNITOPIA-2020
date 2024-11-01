!(function ($) {
    "use strict";
    $(window).on("load", function () {
        if ($("#preloader").length) {
            $("#preloader")
                .delay(100)
                .fadeOut("slow", function () {
                    $(this).remove();
                });
        }
        setTimeout(getLeaderboard, 1000);
        setTimeout(checkAccount, 500);
    });
    $(document).on("click", ".nav-menu a, .mobile-nav a, .scrollto", function (e) {
        if (location.pathname.replace(/^\//, "") == this.pathname.replace(/^\//, "") && location.hostname == this.hostname) {
            e.preventDefault();
            var target = $(this.hash);
            if (target.length) {
                var scrollto = target.offset().top;
                var scrolled = 20;
                if ($("#header").length) {
                    scrollto -= $("#header").outerHeight();
                    if (!$("#header").hasClass("header-scrolled")) {
                        scrollto += scrolled;
                    }
                }
                if ($(this).attr("href") == "#header") {
                    scrollto = 0;
                }
                $("html, body").animate({ scrollTop: scrollto }, 1500, "easeInOutExpo");
                if ($(this).parents(".nav-menu, .mobile-nav").length) {
                    $(".nav-menu .active, .mobile-nav .active").removeClass("active");
                    $(this).closest("li").addClass("active");
                }
                if ($("body").hasClass("mobile-nav-active")) {
                    $("body").removeClass("mobile-nav-active");
                    $(".mobile-nav-toggle i").toggleClass("icofont-navigation-menu icofont-close");
                    $(".mobile-nav-overly").fadeOut();
                }
                return false;
            }
        }
    });
    if ($(".nav-menu").length) {
        var $mobile_nav = $(".nav-menu").clone().prop({ class: "mobile-nav d-lg-none" });
        $("body").append($mobile_nav);
        $("body").prepend('<button type="button" class="mobile-nav-toggle d-lg-none"><i class="icofont-navigation-menu"></i></button>');
        $("body").append('<div class="mobile-nav-overly"></div>');
        $(document).on("click", ".mobile-nav-toggle", function (e) {
            $("body").toggleClass("mobile-nav-active");
            $(".mobile-nav-toggle i").toggleClass("icofont-navigation-menu icofont-close");
            $(".mobile-nav-overly").toggle();
        });
        $(document).on("click", ".mobile-nav .drop-down > a", function (e) {
            e.preventDefault();
            $(this).next().slideToggle(300);
            $(this).parent().toggleClass("active");
        });
        $(document).click(function (e) {
            var container = $(".mobile-nav, .mobile-nav-toggle");
            if (!container.is(e.target) && container.has(e.target).length === 0) {
                if ($("body").hasClass("mobile-nav-active")) {
                    $("body").removeClass("mobile-nav-active");
                    $(".mobile-nav-toggle i").toggleClass("icofont-navigation-menu icofont-close");
                    $(".mobile-nav-overly").fadeOut();
                }
            }
        });
    } else if ($(".mobile-nav, .mobile-nav-toggle").length) {
        $(".mobile-nav, .mobile-nav-toggle").hide();
    }
    var nav_sections = $("section");
    var main_nav = $(".nav-menu, .mobile-nav");
    $(window).on("scroll", function () {
        var cur_pos = $(this).scrollTop() + 80;
        nav_sections.each(function () {
            var top = $(this).offset().top,
                bottom = top + $(this).outerHeight();
            if (cur_pos >= top && cur_pos <= bottom) {
                if (cur_pos <= bottom) {
                    main_nav.find("li").removeClass("active");
                }
                main_nav
                    .find('a[href="#' + $(this).attr("id") + '"]')
                    .parent("li")
                    .addClass("active");
            }
            if (cur_pos < 300) {
                $(".nav-menu ul:first li:first, .mobile-menu ul:first li:first").addClass("active");
            }
        });
    });
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $("#header").addClass("header-scrolled");
        } else {
            $("#header").removeClass("header-scrolled");
        }
    });
    if ($(window).scrollTop() > 100) {
        $("#header").addClass("header-scrolled");
    }
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $(".back-to-top").fadeIn("slow");
        } else {
            $(".back-to-top").fadeOut("slow");
        }
    });
    $(".back-to-top").click(function () {
        $("html, body").animate({ scrollTop: 0 }, 1500, "easeInOutExpo");
        return false;
    });
    $(window).on("load", function () {
        $(".venobox").venobox();
    });
    $('[data-toggle="counter-up"]').counterUp({ delay: 10, time: 1000 });
    $(document).ready(function () {
        $(".venobox").venobox();
    });
    $(".testimonials-carousel").owlCarousel({ autoplay: true, dots: true, loop: true, items: 1 });
    AOS.init({ duration: 1000, easing: "ease-in-out", once: true, mirror: false });
})(jQuery);
var account;
function getLeaderboard() {
    $.getJSON("/leaderboard", function (data) {
        $("#leaderboard tbody").empty();
        var toFetch = data.length;
        if (toFetch > 20) {
            toFetch = 20;
        }
        for (var i = 0; i < toFetch; i += 2) {
            const row = i / 2 + 1;
            const player = data[i].slice(0, 14) + "...";
            const volume = Math.round((new Number(data[i + 1]) + Number.EPSILON) * 100) / 100;
            var prize = "50";
            if (i == 0) {
                prize = "500";
            } else if (i == 2) {
                prize = "250";
            } else if (i == 4) {
                prize = "175";
            } else if (i == 6) {
                prize = "100";
            } else if (i == 8) {
                prize = "100";
            }
            $("#leaderboard").append(
                "<tr><th scope='row'>" +
                    row +
                    "</th><td><a href='https://etherscan.com/address/" +
                    data[i] +
                    "' target='_blank' style='color: #fff'>" +
                    player +
                    "</a></td><td><img src='assets/img/logo.png' height='24px'><span style='vertical-align: middle'> " +
                    volume +
                    "</span></td><td><img src='assets/img/logo.png' height='24px'><span style='vertical-align: middle'> " +
                    prize +
                    "</span></td></tr>"
            );
        }
        if (account != null) {
            var position = "-";
            var volume = "0";
            var prize = "0";
            var found = false;
            for (var i = 0; i < toFetch; i += 2) {
                if (data[i].toLowerCase() == account.toLowerCase()) {
                    position = i / 2 + 1;
                    volume = Math.round((new Number(data[i + 1]) + Number.EPSILON) * 100) / 100;
                    if (i == 0) {
                        prize = "500";
                    } else if (i == 2) {
                        prize = "250";
                    } else if (i == 4) {
                        prize = "175";
                    } else if (i == 6) {
                        prize = "100";
                    } else if (i == 8) {
                        prize = "100";
                    } else if (i <= 18) {
                        prize = "50";
                    }
                    found = true;
                    break;
                }
            }
            if (!found) {
                position = data.length / 2 + 1;
            }
            $("#leaderboard").append(
                "<tr><th scope='row'>" +
                    position +
                    "</th><td><a href='https://etherscan.com/address/" +
                    account +
                    "' target='_blank' style='color: #fff'><b>YOU</b></a></td><td><img src='assets/img/logo.png' height='24px'><span style='vertical-align: middle'> " +
                    volume +
                    "</span></td><td><img src='assets/img/logo.png' height='24px'><span style='vertical-align: middle'> " +
                    prize +
                    "</span></td></tr>"
            );
        }
        setTimeout(getLeaderboard, 15000);
    });
}
function checkAccount() {
    if (window.web3) {
        window.web3.eth.getAccounts((err, accounts) => {
            if (accounts == null || accounts.length == 0) {
                console.log("NO ACCOUNT CONNECTED");
                $("#connect").show();
            } else {
                $("#connect").hide();
                if (account != accounts[0]) {
                    account = accounts[0];
                    getLeaderboard();
                }
            }
        });
    }
    setTimeout(checkAccount, 500);
}
function connectAccount() {
    if (window.ethereum) {
        window.ethereum.enable();
    }
}
