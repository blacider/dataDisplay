(function(window, undefined) {
    jQuery(document).ready(function($) {
        (function bendEvent() {
            $(window).click(function(event) {
                if (event.target.id != "user-button") {
                    $("#dropdown-menu").addClass('hidden');
                }
            });
        })();
    });
})(window);