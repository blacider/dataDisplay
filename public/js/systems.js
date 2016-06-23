(function(window, undefined) {
    jQuery(document).ready(function($) {
        (function bendEvent() {
            var getTable = function(event, url, p) {
                event.preventDefault();
                $("#systems-nav .active").removeClass('active');
                $(event.target).closest('li').addClass('active');
                showLoading();
                $.ajax({
                    url: url,
                    type: 'GET',
                    dataType: 'html',
                    data: {p:p},
                })
                .done(function(result) {
                    $("#main-table").replaceWith(result);
                    $("#table-title").text($(event.target).text());
                    hideLoading();
                });
            };
            $("#systems-nav").delegate('a', 'click', function(event) {
                var url = $(event.target).data("url");
                var p = 1;
                getTable(event, url, p);
            });
            $(".panel").delegate('a', 'click', function(event) {
                if ($(event.target).closest('li').hasClass('disabled')) return;
                var url = $(event.target).closest('ul').data("url");
                var p = $(event.target).data('url');
                getTable(event, url, p);
            });
        })();
        $("#systems-nav .active a").click();
    });
})(window);