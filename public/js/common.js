(function(window, undefined) {
    jQuery(document).ready(function($) {
        (function bendEvent() {
            var showModal = function(selecter) {
                $(selecter).css('display', 'block');
                $(".modal-fog").css({
                    visibility:"visible",
                    opacity:0.3
                });
            }
            $("header .login-signup").delegate('a', 'click', function(event) {
                var target = $(event.target).data("modal");
                showModal("#" + target);
            });
            $(".close").click(function(event) {
                $(".modal").css('display', 'none');
                $(".modal-fog").css({
                    visibility:"hidden",
                    opacity:0
                });
            });
            $("#user-button").click(function(event) {
                $("#dropdown-menu").removeClass('hidden');
            });
            $(window).click(function(event) {
                if (event.target.id != "user-button") {
                    $("#dropdown-menu").addClass('hidden');
                }
            });
            $("#login-form").submit(function(event) {
                this.history.value = "/app" + document.location.href.split("/app")[1];
                return true;
            });
        })();
    });
})(window);