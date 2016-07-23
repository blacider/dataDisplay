(function(window, undefined) {
    jQuery(document).ready(function($) {
        (function bendEvent() {
            var current = 1, n = $(".main").data("name"), isGetData = false;
            $("div.table-container").scroll(function(event) {
                if (!isGetData && this.scrollTop == this.scrollHeight-292) {
                    isGetData = true;
                    $.ajax({
                        url: '/getData',
                        type: 'GET',
                        dataType: 'json',
                        data: {n:n, p:current += 1},
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
                        isGetData = false;
                    });
                }
            });
        })();
    });
})(window);