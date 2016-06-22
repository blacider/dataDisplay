module.exports = {
    log : function(msg) {
        var results = "";
        results += new Date() + ":";
        results += msg;
        console.log(results);
        return;
    }
};