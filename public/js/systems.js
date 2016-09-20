(function(window, undefined) {
    jQuery(document).ready(function($) {
        (function bendEvent() {
            var current = 0, n = $(".main").data("name"), isGetData = false, searchText = '';
            var showPagination = function(total) {
                $("#pagination").pagination({
                    pageCount:total,
                    jump:true,
                    current:current,
                    coping:true,
                    prevContent:' < ',
                    nextContent:' > ',
                    callback:function(pag) {
                        showLoading();
                        getData(pag.getCurrent());
                    }
                });
            };
            if (n == "gs") {
                $("body").delegate('.tbody tr', 'click', function(event) {
                    showLoading();
                    $.ajax({
                      url: '/xx',
                      type: 'GET',
                      dataType: 'html',
                      data: {
                        zch: $(event.target).closest('tr').children().eq(1).text(),
                        n:'jb',
                        name:$(event.target).closest('tr').children().eq(2).text()
                      }
                    })
                    .done(function(data) {
                      $(".close").next().empty().append(data).closest('.modal').show();
                      $(".modal").height($(".close").next().height());
                      hideLoading();
                    });
                });
            }
            $(".modal").delegate('li', 'click', function(event) {
              $(".modal table").removeClass('active');
              $(".modal li").removeClass('active');
              $(event.target).addClass('active');
              $(".modal #table_"+$(event.target).data('id')).addClass('active');
              $(".modal").height($(".close").next().height());
            });
            $('.close').click(function(event) {
              /* Act on the event */
              $('.modal').hide();
            });
            $("#search button").click(function(event) {
                if (searchText != $(this).closest('#search').find('input').val()) {
                    showLoading();
                    searchText = $(this).closest('#search').find('input').val();
                    getData(1);
                }
            });
            function getData(page) {
                current = page;
                isGetData = true;
                $.ajax({
                    url: n,
                    type: 'GET',
                    dataType: 'json',
                    data: {p:page, search:searchText},
                })
                .done(function(res) {
                    var data = "";
                    console.log(res.table);
                    for (var i = 0; i < res.table.length; i++) {
                        data += '<tr><td>' + String((current-1)*10+i+1) +'</td>';
                        for (var item in res.table[i]) {
                            console.log(item);
                            data += '<td>' + res.table[i][item] + '</td>'
                        }
                        data += '</tr>';
                    }
                    $('.tbody').empty().append(data).parent().find('img').remove();
                    $("#total").empty().append('更新日期:'+(new Date().getFullYear() + '年' + (new Date().getMonth()+1) + '月' + new Date().getDate() + '日')+ ' 总数:'+res.total);
                    showPagination(Math.ceil(res.total/10));
                    isGetData = false;
                    hideLoading();
                });
            }
            getData(1);
        })();
    });
})(window);