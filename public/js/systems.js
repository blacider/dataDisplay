(function(window, undefined) {
    jQuery(document).ready(function($) {
        (function bendEvent() {
            var getTable = function(event, url, p, callback) {
                event.preventDefault();
                showLoading();
                $.ajax({
                    url: url,
                    type: 'GET',
                    dataType: 'html',
                    data: {p:p},
                })
                .done(function(result) {
                    $("#main-table").replaceWith(result);
                    callback();
                    hideLoading();
                });
            };
            $("#systems-nav").delegate('a', 'click', function(event) {
                var url = $(event.target).data("url");
                $("#systems-nav .active").removeClass('active');
                $(event.target).closest('li').addClass('active');
                $("#table-title").text($(event.target).text());
                var p = 1;
                getTable(event, url, p, function(){});
            });
            $(".panel").delegate('#pagination a', 'click', function(event) {
                if ($(event.target).closest('li').hasClass('disabled')) return;
                var url = $(event.target).closest('ul').data("url");
                var p = $(event.target).data('url');
                getTable(event, url, p, function(){});
            });
            $(".panel").delegate('#btn-toolbar a', 'click', function(event) {
                var url = $(event.target).data("url");
                var index = $(event.target).closest('li').index();
                $("#table-title").text("监管");
                var p = 1;
                getTable(event, url, p, function(){
                    $("#btn-toolbar .active").removeClass('active');
                    $("#btn-toolbar li").eq(index).addClass('active');
                });
            });
        })();
        $("#systems-nav .active a").click();
    });
})(window);