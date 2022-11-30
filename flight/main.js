var player = [];
var map;
var WzpLocation = "/public/online/whazzup.txt";
function initMap() {
    timer = setInterval(function () {
        refreshMapAjax();
    }, 3E4);
    map = L.map('map').setView([35, 108], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; SKYline天际模飞俱乐部'
    }).addTo(map);
    ajaxInit(WzpLocation);
}
function refreshMap() {
    clearTable();
    clearMap();
    player=[]
    var a = map.getCenter(),
        b = map.getZoom();
    void 0 != map && (map.off(), map.remove());
    map = L.map("map").setView(a, b);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        noWrap: !0,
        attribution: '&copy; SKYline天际模飞俱乐部',
        maxZoom: 9
    }).addTo(map);
    ajaxInit("", initPlayer, !0);
}
function refreshMapAjax() {
    clearTable();
    clearMap();
    player=[]
    ajaxInit(WzpLocation, initPlayer, !0);
}
function clearTable() {
    $("#atc-body").html("")
    $("#pilot-body").html("")
}
function clearMap() {
    for(var i=0;i<player.length;i++){
        map.removeLayer(player[i].marker)
    }
}
function addMarker(player, message) {
    if (player.type == "PILOT") {
        var icon = L.icon({
            iconUrl: "public/img/aircraft_autonavi.png",
            iconAnchor: [10, 10]
        });
        player.marker = L.marker([player.lat, player.lng], {
                icon: icon,
                rotationAngle: player.heading,
            })
            .bindPopup(message, {
                "minWidth": "450px"
            })
            .addTo(map)
    } else if (player.type == "ATC") {
        var icon = L.icon({
            iconUrl: "public/img/marker_atc.png",
            iconAnchor: [10, 32]
        });
        player.marker = L.marker([player.lat, player.lng], {
                icon: icon
            })
            .bindPopup(message, {
                "minWidth": "420px"
            })
            .addTo(map)
    }
}
function addPlayer2List(player) {
    if (player.type == "PILOT") $("#pilot-body").html($("#pilot-body").html() + `<tr><td>${player.callsign}</td><td>${player.departure}</td><td>${player.destination}</td></tr>`);
    else if (player.type == "ATC") $("#atc-body").html($("#atc-body").html() + `<tr><td>${player.callsign}</td><td>${player.realname}</td><td>${getATCLevel(player.rating)}</td></tr>`);
}
function addRader(lat, lng, range) {
//画个圆
// var circle = new Circle({
//    center: new (ctl['lng'], ctl['lat']),// 圆心位置
//        radius: ctl['visual_range']*1.852*1000, //半径
//    strokeColor: "#0000ff", //线颜色
//    strokeOpacity: 0.5, //线透明度
//    strokeWeight: 1, //线粗细度
 //    fillColor: "#0000ee", //填充颜色
//    fillOpacity: 0.1//填充透明度
//});
}
var title = document.getElementById('title');
function getPlayerMessage(p) {
    callsign = p.callsign;
    realname = p.realname;
    alt = p.alt;
    gs = p.ground_speed;
    dep = p.departure;
    arr = p.destination;
    transponder = p.transponder;
    server_ident = p.server_ident;
    aircraft = p.aircraft;
    // route = p.round;
    route = p.route;
    visual_range = p.visual_range;
    if (p.type == "PILOT") {
        
        return '<table border="0" cellpadding="0" cellspacing="0" style="width:450px"><tr><td colspan="4" class="mdui-text-center"><h4>机组详细信息</h4></td></tr><tr><td width="80">呼号</td><td width="140">' + callsign + '</td><td width="80">昵称</td><td width="140">' + realname + "</td></tr><tr><td>高度</td><td>" + alt + "</td><td>地速</td><td>" + gs + "</td></tr>  \t<td>起飞机场</td><td>" + dep + "</td><td>降落机场</td><td>" + arr + "</td></tr><tr><td>应答机</td><td>" + transponder + "</td><td>机型</td><td>" + aircraft + '</td></tr><tr> \t<td height="90">航路</td><td colspan="3" class="mdui-text-center" style="padding: 2px; word-wrap:break-word; word-break:keep-all;">' + ("" == route || void 0 == route ? "该用户未提交计划航路" : route) + "</td></tr></table>";
        
    } else if (p.type == "ATC") {
        return '<table cellpadding="0" cellspacing="0" style="width:420px">\t<tr class="tra">\t\t<td colspan="4" class="mdui-text-center"><h4>管制员详细信息</h4></td>   </tr>   <tr>       <td width="80">席位</td><td width="120">' + callsign + '</td>       <td width="80">昵称</td><td width="140">' + realname + "</td>   </tr>   <tr>       <td>频率</td><td>" +
            p.freq + "</td>       <td>等级</td><td>" + getATCLevel(p.rating) + '</td>   </tr>   <tr rowspan="2">       <td>雷达范围</td><td>' + visual_range + "</td>   </tr></table>";
    }






}
function initPlayer() {
    for (var i = 0; i < Object.keys(player).length; i++) {
        console.log(player[i].type)
        console.log(player[i].heading)
        addMarker(player[i], getPlayerMessage(player[i]))
        addPlayer2List(player[i])
    }
}
function getATCLevel(num) {
    return {
        1: "Observer",
        2: "Student1",
        3: "Student2",
        4: "Student3",
        5: "Controller1",
        6: "Controller2",
        7: "Controller3",
        8: "Instructor1",
        9: "Instructor2",
        10: "Instructor3",
        11: "Supervisor",
        12: "Administrator"
    } [num];
}
function formatWhazzup(whazzup) {
    for (var i = 0; i < whazzup.length; i++) {
        var key = whazzup[i].split(":");
        for (var j = 0; j < key.length; j++) key[j] = key[j].trim();
        if (!(5 > key.length || "" == key[5] || "" == key[3])) {
            var d = {};
            d.callsign = key[0];
            d.realname = key[2];
            d.type = key[3];
            d.freq = parseFloat(key[4]);
            d.lat = parseFloat(key[5]);
            d.lng = parseFloat(key[6]);
            d.alt = parseFloat(key[7]);
            d.ground_speed = parseFloat(key[8]);
            d.aircraft = key[9];
            d.cruising_alt = key[10];
            d.departure = key[11];
            d.cruising_level = key[12];
            d.destination = key[13];
            d.server_ident = key[14];
            d.rating = key[16];
            d.transponder = key[17];
            d.visual_range = parseInt(key[19]);
            d.plan_type = key[21];
            d.departure_time = key[22];
            d.alternative = key[28];
            d.route = key[30];
            d.marker = null;
            d.circle = null;
            d.pitch_bank_heading = key[key.length - 1];
            d.heading = Math.round(((parseInt(d.pitch_bank_heading) & 4092) >> 2) / 1024 * 360);
            d.radius = 1E3 * d.visual_range / 2;
            player.push(d)
        }
    }
}
function getPlayerList(a) {
    if (null != a) {
        var b = a.indexOf("!CLIENTS"),
            c = a.indexOf("!SERVERS");
        return a.substring(b + 9, c - 1).split("\n");
    }
    return null;
}
function ajaxInit(url) {
    $.ajax({
        url: url + "?" + Math.random(),
        success: function (result) {
            formatWhazzup(getPlayerList(result));
            initPlayer()
        }
    });
}
