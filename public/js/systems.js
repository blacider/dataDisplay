(function(window, undefined) {
    jQuery(document).ready(function($) {
        (function bendEvent() {
            var current = 0, n = $(".main").data("name"), isGetData = false;
            var getData = function () {
                isGetData = true;
                $.ajax({
                    url: n,
                    type: 'GET',
                    dataType: 'json',
                    data: {p:current += 1},
                })
                .done(function(res) {
                    var data = "";
                    console.log(res.table);
                    for (var i = 0; i < res.table.length; i++) {
                        data += '<tr><td style="width:50px">' + String((current-1)*10+i+1) +'</td>';
                        for (item in res.table[i]) {
                            data += '<td>' + res.table[i][item] + '</td>'
                        }
                        data += '</tr>';
                    }
                    $('.tbody').append(data);
                    $("#total").empty().append('总数:'+res.total);
                    isGetData = false;
                });
            }
            getData();
            $("div.table-container").scroll(function(event) {
                if (!isGetData && this.scrollTop == this.scrollHeight-292) {
                    getData();
                }
            });
        })();
    });
})(window);