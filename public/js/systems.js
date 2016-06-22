(function(window, undefined) {
    jQuery(document).ready(function($) {
        (function bendEvent() {
            $("#systems-nav").delegate('a', 'click', function(event) {
                event.preventDefault();
                var url = $(event.target).data("url");
                $("#systems-nav .active").removeClass('active');
                $(event.target).closest('li').addClass('active');
                $.ajax({
                    url: url,
                    type: 'GET',
                    dataType: 'html',
                    data: {},
                })
                .done(function(result) {
                    $("#main-table").replaceWith(result);
                    $("#table-title").text($(event.target).text());
                });
            });
        })();
    });
})(window);