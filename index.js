const moment = require('moment');
const remote = require('electron').remote;
const $ = require('./jquery.min');

var seen = {};

moment.updateLocale('en', {
    relativeTime : {
        future: "in %s",
        past:   "%s ago",
        s:  "%d seconds",
        m:  "a minute",
        mm: "%d minutes",
        h:  "an hour",
        hh: "%d hours",
        d:  "a day",
        dd: "%d days",
        M:  "a month",
        MM: "%d months",
        y:  "a year",
        yy: "%d years"
    }
});

function getActiveUsers(cb) {
    return remote.getGlobal('getActiveUsers')(function(ret){
        cb(ret);
    });
}

function refresh() {
    getActiveUsers(function(users) {
        $("#friends").html("");
        if (users.length === 0) {
            $("#friends").html("<span id='empty-state'>No friends are waiting.</span>");
        }
        for (var i = 0; i < users.length; i++ ){
            var user = users[i];
            if (!(user.name in seen)) {
                new Notification("Godotify", {body: user.name + " started waiting"});
                seen[user.name] = true;
            } 
                
            var el = $("<div class='friend'>");
            var friendAviEl = $("<img class=\"friend-avi\">");
            friendAviEl.attr('src', user.profilePicture);
            var friendNameEl = $("<span class=\"friend-name\">"+user.name+"</span>");
            var timeElapsed = moment(user.start).fromNow().split(" ").slice(0, -1).join(" ");
            var timeElapsedEl = $("<span class=\"friend-time\">"+timeElapsed+"</span>");
            el.append(friendAviEl);
            el.append(friendNameEl);
            el.append(timeElapsedEl);
            $("#friends").append(el);
        }
    });
}

$(function() {
    $("#login-form").on("submit", function() {
        $("#login-screen").fadeOut(function() {
            $("#loading-screen").fadeIn();
            var user = $("#email-input").val();
            var pass = $("#password-input").val();
            remote.getGlobal('loginUser')(user, pass, function(err){
                if (err) {
                    alert(err.error);
                    $("#loading-screen").hide();
                    $("#login-screen").show();
                } else {
                    $("#loading-screen").fadeOut(function() {
                        $("#main-screen").fadeIn();
                        setInterval(refresh, 100);
                    });
                }
            });
        });
        return false;
    });
});
