//SKYline天际模飞论坛连飞地图
//前端UI主要来自开源地图FlightSimMap，核心JavaScript由SKYline管理组人员编写
//加密的不是很牢固，想解密也能解开，看你自己了（反正这地图功能不强大解开也没用是不是...）

function initMap() {
    time_is_widget.init({ UTC_za00: {} });
    map = L.map('leaflet-container').setView([34.93, 106.3], 5);
    var gaode = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 17,
        minZoom: 3,
        attribution: '&copy; SKYline天际模飞俱乐部',
        pane: 'overlayPane'
    });
    map.addLayer(gaode);
    var atccontrol = L.tileLayer('https://tiles.flightradar24.com/atc_boundaries/{z}/{x}/{y}/tile.png', {
        maxZoom: 17,
        minZoom: 3,
        pane: 'overlayPane'
    });
    map.addLayer(atccontrol);
    //全球导航数据
    var navdata = L.tileLayer('https://tiles.flightradar24.com/navdata_ha/{z}/{x}/{y}/tile.png', {
        maxZoom: 17,
        minZoom: 3,
        pane: 'overlayPane'
    });
    map.addLayer(navdata);

    updateData();
    setInterval(updateData, 3000);
}
function overEvent(e) {
    if (e.target.options.data[0] == 'ATC') {
        e.target.bindTooltip(e.target.options.data[2]);
    } else if (e.target.options.data[0] == 'PILOT') {
        e.target.bindTooltip(e.target.options.data[2]);
    }
    e.target.openTooltip();
}
function clickEvent(e) {
    if (e.target.options.data[0] == 'ATC') {
        //----------管制员信息--------
        // data[0] 类型ATC
        // data[1] CID
        // data[2] callsign
        // data[3] frequency
        // data[4] latitude
        // data[5] longitude
        // data[12] radius 
        // data[16] realname
        // data[17] rating
        // data[18] range(nm)
        var openatcinfo = document.getElementById('atclist');
        atclist.style.display = 'block';
        //根据席位呼号分析ATC-type
        var atc1 = e.target.options.data[2] + "";//数据转换成string类型
        var arpt_atc = atc1.substring(0, 4);
        var type_main = atc1.substring(atc1.length - 3, atc1.length);
        if (type_main == 'OBS') {
            var atc_type_1 = 'Observer';
        }
        else if (type_main == 'TWR') {
            atc_type_1 = 'Tower';
        }
        else if (type_main == 'APP') {
            atc_type_1 = 'Approach';
        }
        else if (type_main == 'CTR') {
            atc_type_1 = 'Enroute';
        }
        else if (type_main == 'FSS') {
            atc_type_1 = 'FSS';
        }
        else if (type_main == 'SUP') {
            atc_type_1 = 'Supervisor';
        }
        else if (type_main == 'ADM') {
            atc_type_1 = 'Technician';
        }
        else {
            atc_type_1 = '$type';
        }
        //管制员等级对照表
        var rating_num = e.target.options.data[17] + "";
        if (rating_num == '0') {
            var rating = '封禁';
        }
        else if (rating_num == '1') {
            var rating = 'Observer';
        }
        else if (rating_num == '2') {
            var rating = 'Student1';
        }
        else if (rating_num == '3') {
            var rating = 'Student2';
        }
        else if (rating_num == '4') {
            var rating = 'Student3';
        }
        else if (rating_num == '5') {
            var rating = 'Controller1';
        }
        else if (rating_num == '6') {
            var rating = 'Controller2';
        }
        else if (rating_num == '7') {
            var rating = 'Controller3';
        }
        else if (rating_num == '8') {
            var rating = 'Instructor1';
        }
        else if (rating_num == '9') {
            var rating = 'Instructor2';
        }
        else if (rating_num == '10') {
            var rating = 'Instructor3';
        }
        else if (rating_num == '11') {
            var rating = 'Supervisor';
        }
        else if (rating_num == '12') {
            var rating = 'Administrator';
        }
        //把ATC信息输出到ATC信息框
        var notam_main = e.target.options.data[2] + '<br>CPDLC @ ' + arpt_atc + '<br>' +
            'Welcome here!' +
            ' SKYline ATC guide your way. <br>' +
            " I'm " + e.target.options.data[2] + ', please contact me on frequency ' + e.target.options.data[3] + ' when entering my airspace<br>' +
            'Any feedback or want more information? Please visit skylineflyleague.cn!'
        document.getElementById('callsign-atc1').innerHTML = '&nbsp;&nbsp;' + e.target.options.data[2];
        document.getElementById('atc-type').innerHTML = atc_type_1;
        document.getElementById('frequency').innerHTML = e.target.options.data[3];
        document.getElementById('range').innerHTML = e.target.options.data[18] + 'nm';
        document.getElementById('notam').innerHTML = notam_main;
        document.getElementById('detail-rating').innerHTML = '&nbsp;&nbsp;&nbsp;' + rating;
        document.getElementById('detail-cid').innerHTML = '&nbsp;&nbsp;&nbsp;' + e.target.options.data[1];
        document.getElementById('detail-1').innerHTML = '&nbsp;&nbsp;ATC' + e.target.options.data[1];
        document.getElementById('detail-callsign').innerHTML = '&nbsp;&nbsp;' + e.target.options.data[2];
        document.getElementById('detail-type').innerHTML = '&nbsp;&nbsp;' + atc_type_1;
        document.getElementById('data-1').innerHTML = e.target.options.data[16] + '&nbsp;|&nbsp;<span class="further-info"onclick="show_atc_info()">ATC' + e.target.options.data[1] + '</span>&nbsp;|&nbsp;SKYline'

    } else if (e.target.options.data[0] == 'PILOT') {
        
        //获取标牌亿些数据
        var str1 = e.target.options.data[2] + "";//数据转换成string类型
        var airline_sub = str1.substring(0, 3)//把ICAO代码分隔开，用于判断
        var callsign_main = str1.substring(3, str1.length);
        {
            if (airline_sub == 'CCA') {
                var airline_main_both = '中国国际航空公司 | Air China';//双语
                var airline_main_only = '中国国际航空公司';//汉语
                var IATA = 'CA';
                var ICAO = 'CCA';//航空公司logo展示变量
            }
            else if (airline_sub == 'CSN') {
                var airline_main_both = '中国南方航空公司 | China Southern Airlines';//双语
                var airline_main_only = '中国南方航空公司';//汉语
                var IATA = 'CZ';
                var ICAO = 'CSN';//航空公司logo展示变量
            }
            else if (airline_sub == 'CES') {
                var airline_main_both = '中国东方航空公司 | China Eastern Airlines';//双语
                var airline_main_only = '中国东方航空公司';//汉语
                var IATA = 'MU';
                var ICAO = 'CES';//航空公司logo展示变量
            }
            else if (airline_sub == 'CHH') {
                var airline_main_both = '海南航空公司 | Hainan Airlines';//双语
                var airline_main_only = '海南航空公司';//汉语
                var IATA = 'HU';
                var ICAO = 'CHH';//航空公司logo展示变量
            }
            else if (airline_sub == 'CXA') {
                var airline_main_both = '厦门航空公司 | Xiamen Airlines';//双语
                var airline_main_only = '厦门航空公司';//汉语
                var IATA = 'MF';
                var ICAO = 'CXA';//航空公司logo展示变量
            }
            else if (airline_sub == 'CUA') {
                var airline_main_both = '中国联合航空公司 | China United';//双语
                var airline_main_only = '中国联合航空公司';//汉语
                var IATA = 'KN';
                var ICAO = 'CUA';//航空公司logo展示变量
            }
            else if (airline_sub == 'CCD') {
                var airline_main_both = '大连航空公司 | Dalian Airlines';//双语
                var airline_main_only = '大连航空公司';//汉语
                var IATA = 'CA';
                var ICAO = 'CCD';//航空公司logo展示变量
            }
            else if (airline_sub == 'CSH') {
                var airline_main_both = '上海航空公司 | Shanghai Air';//双语
                var airline_main_only = '上海航空公司';//汉语
                var IATA = 'FM';
                var ICAO = 'CSH';//航空公司logo展示变量
            }
            else if (airline_sub == 'BJN') {
                var airline_main_both = '北京航空公司 | Air Jinghua';//双语
                var airline_main_only = '北京航空公司';//汉语
                var IATA = 'JD';
                var ICAO = 'BJN';//航空公司logo展示变量
            }
            else if (airline_sub == 'CSC') {
                var airline_main_both = '四川航空公司 | Sichuan Airlines';//双语
                var airline_main_only = '四川航空公司';//汉语
                var IATA = '3U';
                var ICAO = 'CSC';//航空公司logo展示变量
            }
            else if (airline_sub == 'CDG') {
                var airline_main_both = '山东航空公司 | Shandong Airlines';//双语
                var airline_main_only = '山东航空公司';//汉语
                var IATA = 'SC';
                var ICAO = 'CDG';//航空公司logo展示变量
            }
            else if (airline_sub == 'CSZ') {
                var airline_main_both = '深圳航空公司 | Shenzhen Airlines';//双语
                var airline_main_only = '深圳航空公司';//汉语
                var IATA = 'ZH';
                var ICAO = 'CSZ';//航空公司logo展示变量
            }
            else if (airline_sub == 'CQH') {
                var airline_main_both = '春秋航空公司 | Spring Airlines';//双语
                var airline_main_only = '春秋航空公司';//汉语
                var IATA = '9C';
                var ICAO = 'CQH';//航空公司logo展示变量
            }
            else if (airline_sub == 'DKH') {
                var airline_main_both = '吉祥航空公司 | Air Juneyao';//双语
                var airline_main_only = '吉祥航空公司';//汉语
                var IATA = 'HO';
                var ICAO = 'DKH';//航空公司logo展示变量
            }
            else if (airline_sub == 'CQN') {
                var airline_main_both = '重庆航空公司 | Chongqing Airlines';//双语
                var airline_main_only = '重庆航空公司';//汉语
                var IATA = 'OQ';
                var ICAO = 'CQN';//航空公司logo展示变量
            }
            else if (airline_sub == 'HBH') {
                var airline_main_both = '河北航空公司 | Hebei Airlines';//双语
                var airline_main_only = '河北航空公司';//汉语
                var IATA = 'NS';
                var ICAO = 'HBH';//航空公司logo展示变量
            }
            else if (airline_sub == 'CYZ') {
                var airline_main_both = '中国邮政航空公司 | China Post';//双语
                var airline_main_only = '中国邮政航空公司';//汉语
                var IATA = 'CF';
                var ICAO = 'CYZ';//航空公司logo展示变量
            }
            else if (airline_sub == 'CSS') {
                var airline_main_both = '顺丰航空公司 | Shunfeng Airlines';//双语
                var airline_main_only = '顺丰航空公司';//汉语
                var IATA = 'O3';
                var ICAO = 'CSS';//航空公司logo展示变量
            }
            else if (airline_sub == 'FTU') {
                var airline_main_both = '中国民航飞行学院 | Flight University';//双语
                var airline_main_only = '中国民航飞行学院';//汉语
                var IATA = 'FTU';
                var ICAO = 'FTU';//航空公司logo展示变量
            }
            else if (airline_sub == 'ANA') {
                var airline_main_both = 'ALL NIPPON';//双语
                var airline_main_only = 'ALL NIPPON';//汉语
                var IATA = 'NH';
                var ICAO = 'ANA';//航空公司logo展示变量
            }
            else {
                airline_main_both = '天际模飞论坛 | SKYline Flyleague';
                airline_main_only = 'SKYline天际模飞论坛';
                IATA = airline_sub;
                ICAO = 'SKY';
            };
        }
        //起飞落地信息
        //起飞信息
        {
            var dep_sub_2 = e.target.options.data[9];//防止类型转换后后面无法使用
            var dep_sub = dep_sub_2 + "";//转为字符串
            if (dep_sub == 'ZBAA') {
                var dep_arpt = '北京/首都';
            }
            else if (dep_sub == 'ZBAD') {
                var dep_arpt = '北京/首都';
            }
            else if (dep_sub == 'ZBDS') {
                var dep_arpt = '北京/大兴';
            }
            else if (dep_sub == 'ZBHH') {
                var dep_arpt = '鄂尔多斯/伊金霍洛';
            }
            else if (dep_sub == 'ZBLA') {
                var dep_arpt = '呼和浩特/白塔';
            }
            else if (dep_sub == 'ZBMZ') {
                var dep_arpt = '呼伦贝尔/海拉尔';
            }
            else if (dep_sub == 'ZBSJ') {
                var dep_arpt = '石家庄/正定';
            }
            else if (dep_sub == 'ZBTJ') {
                var dep_arpt = '天津/滨海';
            }
            else if (dep_sub == 'ZBYN') {
                var dep_arpt = '太原/武宿';
            }
            else if (dep_sub == 'ZGDY') {
                var dep_arpt = '张家界/荷花';
            }
            else if (dep_sub == 'ZGGG') {
                var dep_arpt = '广州/白云';
            }
            else if (dep_sub == 'ZGHA') {
                var dep_arpt = '长沙/黄花';
            }
            else if (dep_sub == 'ZGKL') {
                var dep_arpt = '桂林/两江';
            }
            else if (dep_sub == 'ZGNN') {
                var dep_arpt = '南宁/吴圩';
            }
            else if (dep_sub == 'ZGOW') {
                var dep_arpt = '揭阳/潮汕';
            }
            else if (dep_sub == 'ZGSZ') {
                var dep_arpt = '深圳/宝安';
            }
            else if (dep_sub == 'ZHCC') {
                var dep_arpt = '郑州/新郑';
            }
            else if (dep_sub == 'ZHHH') {
                var dep_arpt = '武汉/天河';
            }
            else if (dep_sub == 'ZJHK') {
                var dep_arpt = '海口/美兰';
            }
            else if (dep_sub == 'ZJQH') {
                var dep_arpt = '琼海/博鳌';
            }
            else if (dep_sub == 'ZSY') {
                var dep_arpt = '三亚/凤凰';
            }
            else if (dep_sub == 'ZSAM') {
                var dep_arpt = '厦门/高崎';
            }
            else if (dep_sub == 'ZSCG') {
                var dep_arpt = '常州/奔牛';
            }
            else if (dep_sub == 'ZSCN') {
                var dep_arpt = '南昌/昌北';
            }
            else if (dep_sub == 'ZSFZ') {
                var dep_arpt = '福州/长乐';
            }
            else if (dep_sub == 'ZSHC') {
                var dep_arpt = '杭州/萧山';
            }
            else if (dep_sub == 'ZSJN') {
                var dep_arpt = '济南/遥墙';
            }
            else if (dep_sub == 'ZSNB') {
                var dep_arpt = '宁波/栎社';
            }
            else if (dep_sub == 'ZSNJ') {
                var dep_arpt = '南京/禄口';
            }
            else if (dep_sub == 'ZSNT') {
                var dep_arpt = '南通/兴东';
            }
            else if (dep_sub == 'ZSOF') {
                var dep_arpt = '合肥/新桥';
            }
            else if (dep_sub == 'ZSPD') {
                var dep_arpt = '上海/浦东';
            }
            else if (dep_sub == 'ZSQD') {
                var dep_arpt = '青岛/胶东';
            }
            else if (dep_sub == 'ZSQZ') {
                var dep_arpt = '泉州/晋江';
            }
            else if (dep_sub == 'ZSSH') {
                var dep_arpt = '淮安/涟水';
            }
            else if (dep_sub == 'ZSSS') {
                var dep_arpt = '上海/虹桥';
            }
            else if (dep_sub == 'ZSTX') {
                var dep_arpt = '黄山/屯溪';
            }
            else if (dep_sub == 'ZSWH') {
                var dep_arpt = '威海/大水泊';
            }
            else if (dep_sub == 'ZSWX') {
                var dep_arpt = '无锡/硕放';
            }
            else if (dep_sub == 'ZSWZ') {
                var dep_arpt = '温州/龙湾';
            }
            else if (dep_sub == 'ZSYA') {
                var dep_arpt = '扬州/泰州';
            }
            else if (dep_sub == 'ZSYN') {
                var dep_arpt = '盐城/南洋';
            }
            else if (dep_sub == 'ZSYT') {
                var dep_arpt = '烟台/蓬莱';
            }
            else if (dep_sub == 'ZSYW') {
                var dep_arpt = '义乌';
            }
            else if (dep_sub == 'ZSZS') {
                var dep_arpt = '舟山/普陀山';
            }
            else if (dep_sub == 'ZSXZ') {
                var dep_arpt = '徐州/观音';
            }
            else if (dep_sub == 'ZYCC') {
                var dep_arpt = '长春/龙嘉';
            }
            else if (dep_sub == 'ZYHB') {
                var dep_arpt = '哈尔滨/太平';
            }
            else if (dep_sub == 'ZYJM') {
                var dep_arpt = '佳木斯';
            }
            else if (dep_sub == 'ZYMD') {
                var dep_arpt = '牡丹江/海浪';
            }
            else if (dep_sub == 'ZYQQ') {
                var dep_arpt = '齐齐哈尔/三家子';
            }
            else if (dep_sub == 'ZYTL') {
                var dep_arpt = '大连/周水子';
            }
            else if (dep_sub == 'ZYTX') {
                var dep_arpt = '沈阳/桃仙';
            }
            else if (dep_sub == 'ZYYJ') {
                var dep_arpt = '延吉/朝阳川';
            }
            else if (dep_sub == 'ZLDH') {
                var dep_arpt = '敦煌/莫高';
            }
            else if (dep_sub == 'ZLIC') {
                var dep_arpt = '银川/河东';
            }
            else if (dep_sub == 'ZLLL') {
                var dep_arpt = '兰州/中川';
            }
            else if (dep_sub == 'ZLXN') {
                var dep_arpt = '西宁/曹家堡';
            }
            else if (dep_sub == 'ZLXY') {
                var dep_arpt = '西安/咸阳';
            }
            else if (dep_sub == 'ZPJH') {
                var dep_arpt = '西双版纳/嘎洒';
            }
            else if (dep_sub == 'ZPLJ') {
                var dep_arpt = '丽江/三义';
            }
            else if (dep_sub == 'ZPMS') {
                var dep_arpt = '德宏/芒市';
            }
            else if (dep_sub == 'ZPPP') {
                var dep_arpt = '昆明/长水';
            }
            else if (dep_sub == 'ZUCK') {
                var dep_arpt = '重庆/江北';
            }
            else if (dep_sub == 'ZUGY') {
                var dep_arpt = '贵阳/龙洞堡';
            }
            else if (dep_sub == 'ZULS') {
                var dep_arpt = '拉萨/贡嘎';
            }
            else if (dep_sub == 'ZUUU') {
                var dep_arpt = '成都/双流';
            }
            else if (dep_sub == 'ZUTF') {
                var dep_arpt = '成都/天府';
            }
            else if (dep_sub == 'ZUXC') {
                var dep_arpt = '西昌/青山';
            }
            else if (dep_sub == 'ZWSH') {
                var dep_arpt = '喀什';
            }
            else if (dep_sub == 'ZWTN') {
                var dep_arpt = '和田';
            }
            else if (dep_sub == 'ZWWW') {
                var dep_arpt = '乌鲁木齐/地窝堡';
            }
            else if (dep_sub == 'EGLL') {
                var dep_arpt = '伦敦希斯罗';
            }
            else if (dep_sub == 'EDDF') {
                var dep_arpt = '法克兰福';
            }
            else if (dep_sub == 'LTFM') {
                var dep_arpt = '伊斯坦布尔';
            }
            else if (dep_sub == 'WIII') {
                var dep_arpt = '苏加诺－哈达';
            }
            else if (dep_sub == 'UUEE') {
                var dep_arpt = '莫斯科谢列梅捷沃';
            }
            else if (dep_sub == 'VQPR') {
                var dep_arpt = '帕罗';
            }
            else if (dep_sub == 'KJFK') {
                var dep_arpt = '纽约肯尼迪';
            }
            else if (dep_sub == 'KDEN') {
                var dep_arpt = '科罗拉多州丹佛';
            }
            else if (dep_sub == 'KSFO') {
                var dep_arpt = '圣弗朗西斯科';
            }
            else if (dep_sub == 'KLAX') {
                var dep_arpt = '洛杉矶';
            }
            else if (dep_sub == 'TNCM') {
                var dep_arpt = '朱莉安娜公主';
            }
            else if (dep_sub == 'YSSY') {
                var dep_arpt = '悉尼';
            }
            else {
                dep_arpt = ' ';
            };
            //落地信息
            var arr_sub_2 = e.target.options.data[10];//防止类型转换后后面无法使用
            var arr_sub = arr_sub_2 + "";//转为字符串
            if (arr_sub == 'ZBAA') {
                var arr_arpt = '北京/首都';
            }
            else if (arr_sub == 'ZBAD') {
                var arr_arpt = '北京/首都';
            }
            else if (arr_sub == 'ZBDS') {
                var arr_arpt = '北京/大兴';
            }
            else if (arr_sub == 'ZBHH') {
                var arr_arpt = '鄂尔多斯/伊金霍洛';
            }
            else if (arr_sub == 'ZBLA') {
                var arr_arpt = '呼和浩特/白塔';
            }
            else if (arr_sub == 'ZBMZ') {
                var arr_arpt = '呼伦贝尔/海拉尔';
            }
            else if (arr_sub == 'ZBSJ') {
                var arr_arpt = '石家庄/正定';
            }
            else if (arr_sub == 'ZBTJ') {
                var arr_arpt = '天津/滨海';
            }
            else if (arr_sub == 'ZBYN') {
                var arr_arpt = '太原/武宿';
            }
            else if (arr_sub == 'ZGDY') {
                var arr_arpt = '张家界/荷花';
            }
            else if (arr_sub == 'ZGGG') {
                var arr_arpt = '广州/白云';
            }
            else if (arr_sub == 'ZGHA') {
                var arr_arpt = '长沙/黄花';
            }
            else if (arr_sub == 'ZGKL') {
                var arr_arpt = '桂林/两江';
            }
            else if (arr_sub == 'ZGNN') {
                var arr_arpt = '南宁/吴圩';
            }
            else if (arr_sub == 'ZGOW') {
                var arr_arpt = '揭阳/潮汕';
            }
            else if (arr_sub == 'ZGSZ') {
                var arr_arpt = '深圳/宝安';
            }
            else if (arr_sub == 'ZHCC') {
                var arr_arpt = '郑州/新郑';
            }
            else if (arr_sub == 'ZHHH') {
                var arr_arpt = '武汉/天河';
            }
            else if (arr_sub == 'ZJHK') {
                var arr_arpt = '海口/美兰';
            }
            else if (arr_sub == 'ZJQH') {
                var arr_arpt = '琼海/博鳌';
            }
            else if (arr_sub == 'ZSY') {
                var arr_arpt = '三亚/凤凰';
            }
            else if (arr_sub == 'ZSAM') {
                var arr_arpt = '厦门/高崎';
            }
            else if (arr_sub == 'ZSCG') {
                var arr_arpt = '常州/奔牛';
            }
            else if (arr_sub == 'ZSCN') {
                var arr_arpt = '南昌/昌北';
            }
            else if (arr_sub == 'ZSFZ') {
                var arr_arpt = '福州/长乐';
            }
            else if (arr_sub == 'ZSHC') {
                var arr_arpt = '杭州/萧山';
            }
            else if (arr_sub == 'ZSJN') {
                var arr_arpt = '济南/遥墙';
            }
            else if (arr_sub == 'ZSNB') {
                var arr_arpt = '宁波/栎社';
            }
            else if (arr_sub == 'ZSNJ') {
                var arr_arpt = '南京/禄口';
            }
            else if (arr_sub == 'ZSNT') {
                var arr_arpt = '南通/兴东';
            }
            else if (arr_sub == 'ZSOF') {
                var arr_arpt = '合肥/新桥';
            }
            else if (arr_sub == 'ZSPD') {
                var arr_arpt = '上海/浦东';
            }
            else if (arr_sub == 'ZSQD') {
                var arr_arpt = '青岛/胶东';
            }
            else if (arr_sub == 'ZSQZ') {
                var arr_arpt = '泉州/晋江';
            }
            else if (arr_sub == 'ZSSH') {
                var arr_arpt = '淮安/涟水';
            }
            else if (arr_sub == 'ZSSS') {
                var arr_arpt = '上海/虹桥';
            }
            else if (arr_sub == 'ZSTX') {
                var arr_arpt = '黄山/屯溪';
            }
            else if (arr_sub == 'ZSWH') {
                var arr_arpt = '威海/大水泊';
            }
            else if (arr_sub == 'ZSWX') {
                var arr_arpt = '无锡/硕放';
            }
            else if (arr_sub == 'ZSWZ') {
                var arr_arpt = '温州/龙湾';
            }
            else if (arr_sub == 'ZSYA') {
                var arr_arpt = '扬州/泰州';
            }
            else if (arr_sub == 'ZSYN') {
                var arr_arpt = '盐城/南洋';
            }
            else if (arr_sub == 'ZSYT') {
                var arr_arpt = '烟台/蓬莱';
            }
            else if (arr_sub == 'ZSYW') {
                var arr_arpt = '义乌';
            }
            else if (arr_sub == 'ZSZS') {
                var arr_arpt = '舟山/普陀山';
            }
            else if (arr_sub == 'ZSXZ') {
                var arr_arpt = '徐州/观音';
            }
            else if (arr_sub == 'ZYCC') {
                var arr_arpt = '长春/龙嘉';
            }
            else if (arr_sub == 'ZYHB') {
                var arr_arpt = '哈尔滨/太平';
            }
            else if (arr_sub == 'ZYJM') {
                var arr_arpt = '佳木斯';
            }
            else if (arr_sub == 'ZYMD') {
                var arr_arpt = '牡丹江/海浪';
            }
            else if (arr_sub == 'ZYQQ') {
                var arr_arpt = '齐齐哈尔/三家子';
            }
            else if (arr_sub == 'ZYTL') {
                var arr_arpt = '大连/周水子';
            }
            else if (arr_sub == 'ZYTX') {
                var arr_arpt = '沈阳/桃仙';
            }
            else if (arr_sub == 'ZYYJ') {
                var arr_arpt = '延吉/朝阳川';
            }
            else if (arr_sub == 'ZLDH') {
                var arr_arpt = '敦煌/莫高';
            }
            else if (arr_sub == 'ZLIC') {
                var arr_arpt = '银川/河东';
            }
            else if (arr_sub == 'ZLLL') {
                var arr_arpt = '兰州/中川';
            }
            else if (arr_sub == 'ZLXN') {
                var arr_arpt = '西宁/曹家堡';
            }
            else if (arr_sub == 'ZLXY') {
                var arr_arpt = '西安/咸阳';
            }
            else if (arr_sub == 'ZPJH') {
                var arr_arpt = '西双版纳/嘎洒';
            }
            else if (arr_sub == 'ZPLJ') {
                var arr_arpt = '丽江/三义';
            }
            else if (arr_sub == 'ZPMS') {
                var arr_arpt = '德宏/芒市';
            }
            else if (arr_sub == 'ZPPP') {
                var arr_arpt = '昆明/长水';
            }
            else if (arr_sub == 'ZUCK') {
                var arr_arpt = '重庆/江北';
            }
            else if (arr_sub == 'ZUGY') {
                var arr_arpt = '贵阳/龙洞堡';
            }
            else if (arr_sub == 'ZULS') {
                var arr_arpt = '拉萨/贡嘎';
            }
            else if (arr_sub == 'ZUUU') {
                var arr_arpt = '成都/双流';
            }
            else if (arr_sub == 'ZUTF') {
                var arr_arpt = '成都/天府';
            }
            else if (arr_sub == 'ZUXC') {
                var arr_arpt = '西昌/青山';
            }
            else if (arr_sub == 'ZWSH') {
                var arr_arpt = '喀什';
            }
            else if (arr_sub == 'ZWTN') {
                var arr_arpt = '和田';
            }
            else if (arr_sub == 'ZWWW') {
                var arr_arpt = '乌鲁木齐/地窝堡';
            }
            else if (arr_sub == 'ZBCF') {
                var arr_arpt = '赤峰/玉龙';
            }
            else if (arr_sub == 'ZBCZ') {
                var arr_arpt = '长治/王村';
            }
            else if (arr_sub == 'ZBDH') {
                var arr_arpt = '秦皇岛/北戴河';
            }
            else if (arr_sub == 'ZBLL') {
                var arr_arpt = '吕梁/大武';
            }
            else if (arr_sub == 'ZBTL') {
                var arr_arpt = '通辽';
            }
            else if (arr_sub == 'ZBXZ') {
                var arr_arpt = '忻州/五台山';
            }
            else if (arr_sub == 'ZBYC') {
                var arr_arpt = '运城/张孝';
            }
            else if (arr_sub == 'ZBZL') {
                var arr_arpt = '扎兰屯/成吉思汗';
            }
            else if (arr_sub == 'ZBZJ') {
                var arr_arpt = '张家口/宁远';
            }
            else if (arr_sub == 'ZGHC') {
                var arr_arpt = '河池/金城江';
            }
            else if (arr_sub == 'ZGHC') {
                var arr_arpt = '惠州/平潭';
            }
            else if (arr_sub == 'ZGMX') {
                var arr_arpt = '梅州/梅县';
            }
            else if (arr_sub == 'ZGSD') {
                var arr_arpt = '珠海/金湾';
            }
            else if (arr_sub == 'ZBSY') {
                var arr_arpt = '邵阳/武冈';
            }
            else if (arr_sub == 'ZGUH') {
                var arr_arpt = '珠海/九州';
            }
            else if (arr_sub == 'ZGYL') {
                var arr_arpt = '玉林/福绵';
            }
            else if (arr_sub == 'ZGZH') {
                var arr_arpt = '柳州/白莲';
            }
            else if (arr_sub == 'ZHES') {
                var arr_arpt = '恩施/徐家坪';
            }
            else if (arr_sub == 'ZHJZ') {
                var arr_arpt = '荆州/沙市';
            }
            else if (arr_sub == 'ZHSN') {
                var arr_arpt = '神农架/红坪';
            }
            else if (arr_sub == 'ZHSY') {
                var arr_arpt = '十堰/武当山';
            }
            else if (arr_sub == 'ZHYC') {
                var arr_arpt = '宜昌/三峡';
            }
            else if (arr_sub == 'ZJYX') {
                var arr_arpt = '三沙/永兴';
            }
            else if (arr_sub == 'ZLAK') {
                var arr_arpt = '安康/富强';
            }
            else if (arr_sub == 'ZLDL') {
                var arr_arpt = '海西/德令哈';
            }
            else if (arr_sub == 'ZLGM') {
                var arr_arpt = '格尔木';
            }
            else if (arr_sub == 'ZLGY') {
                var arr_arpt = '固原/六盘山';
            }
            else if (arr_sub == 'ZLHZ') {
                var arr_arpt = '汉中/城固';
            }
            else if (arr_sub == 'ZLJQ') {
                var arr_arpt = '嘉峪关';
            }
            else if (arr_sub == 'ZLJC') {
                var arr_arpt = '金昌/金川';
            }
            else if (arr_sub == 'ZLTS') {
                var arr_arpt = '天水/麦积山';
            }
            else if (arr_sub == 'ZLYA') {
                var arr_arpt = '延安/南泥湾';
            }
            else if (arr_sub == 'ZBYL') {
                var arr_arpt = '榆林/榆阳';
            }
            else if (arr_sub == 'ZLYS') {
                var arr_arpt = '玉树/巴塘';
            }
            else if (arr_sub == 'ZLZW') {
                var arr_arpt = '中卫/沙坡头';
            }
            else if (arr_sub == 'ZPBS') {
                var arr_arpt = '保山/云瑞';
            }
            else if (arr_sub == 'ZPDL') {
                var arr_arpt = '大理/荒草坝';
            }
            else if (arr_sub == 'ZPML') {
                var arr_arpt = '宁蒗/泸沽湖';
            }
            else if (arr_sub == 'ZPSM') {
                var arr_arpt = '普洱/思茅';
            }
            else if (arr_sub == 'ZPWS') {
                var arr_arpt = '文山/砚山';
            }
            else if (arr_sub == 'ZSAQ') {
                var arr_arpt = '安庆';
            }
            else if (arr_sub == 'ZSGS') {
                var arr_arpt = '井冈山';
            }
            else if (arr_sub == 'ZSHZ') {
                var arr_arpt = '菏泽/牡丹';
            }
            else if (arr_sub == 'ZSJD') {
                var arr_arpt = '景德镇/罗家';
            }
            else if (arr_sub == 'ZSJG') {
                var arr_arpt = '济宁/曲阜';
            }
            else if (arr_sub == 'ZSJH') {
                var arr_arpt = '池州/九华山';
            }
            else if (arr_sub == 'ZSWA') {
                var arr_arpt = '芜湖/宣州';
            }
            else if (arr_sub == 'ZSWF') {
                var arr_arpt = '潍坊';
            }
            else if (arr_sub == 'ZSWY') {
                var arr_arpt = '武夷山';
            }
            else if (arr_sub == 'ZUAL') {
                var arr_arpt = '阿里/昆莎';
            }
            else if (arr_sub == 'ZUAS') {
                var arr_arpt = '安顺/黄果树';
            }
            else if (arr_sub == 'ZUDC') {
                var arr_arpt = '稻城/亚丁';
            }
            else if (arr_sub == 'ZBGH') {
                var arr_arpt = '广汉';
            }
            else if (arr_sub == 'ZUGU') {
                var arr_arpt = '广元/盘龙';
            }
            else if (arr_sub == 'ZBGZ') {
                var arr_arpt = '甘孜/格萨尔';
            }
            else if (arr_sub == 'ZUHY') {
                var arr_arpt = '阿坝/红原';
            }
            else if (arr_sub == 'ZULZ') {
                var arr_arpt = '泸州/云龙';
            }
            else if (arr_sub == 'ZUMT') {
                var arr_arpt = '遵义/茅台';
            }
            else if (arr_sub == 'ZURK') {
                var arr_arpt = '日喀则/和平';
            }
            else if (arr_sub == 'ZUYB') {
                var arr_arpt = '宜宾/五粮液';
            }
            else if (arr_sub == 'ZUZY') {
                var arr_arpt = '遵义/新舟';
            }
            else if (arr_sub == 'ZUNZ') {
                var arr_arpt = '林芝/米林';
            }
            else if (arr_sub == 'ZYCH') {
                var arr_arpt = '长海';
            }
            else if (arr_sub == 'ZYJD') {
                var arr_arpt = '大兴安岭/鄂伦春';
            }
            else if (arr_sub == 'ZYLD') {
                var arr_arpt = '伊春/林都';
            }
            else if (arr_sub == 'ZYMH') {
                var arr_arpt = '漠河/古莲';
            }
            else if (arr_sub == 'ZYBS') {
                var arr_arpt = '白山/长白山';
            }
            else if (arr_sub == 'ZYJS') {
                var arr_arpt = '建三江/湿地';
            }
            else if (arr_sub == 'ZYFY') {
                var arr_arpt = '抚远/东极';
            }
            else if (arr_sub == 'EGLL') {
                var arr_arpt = '伦敦希斯罗';
            }
            else if (arr_sub == 'EDDF') {
                var arr_arpt = '法克兰福';
            }
            else if (arr_sub == 'LTFM') {
                var arr_arpt = '伊斯坦布尔';
            }
            else if (arr_sub == 'WIII') {
                var arr_arpt = '苏加诺－哈达';
            }
            else if (arr_sub == 'UUEE') {
                var arr_arpt = '莫斯科谢列梅捷沃';
            }
            else if (arr_sub == 'VQPR') {
                var arr_arpt = '帕罗';
            }
            else if (arr_sub == 'KJFK') {
                var arr_arpt = '纽约肯尼迪';
            }
            else if (arr_sub == 'KDEN') {
                var arr_arpt = '科罗拉多州丹佛';
            }
            else if (arr_sub == 'KSFO') {
                var arr_arpt = '圣弗朗西斯科';
            }
            else if (arr_sub == 'KLAX') {
                var arr_arpt = '洛杉矶';
            }
            else if (arr_sub == 'TNCM') {
                var arr_arpt = '朱莉安娜公主';
            }
            else if (arr_sub == 'YSSY') {
                var arr_arpt = '悉尼';
            }
            else {
                arr_arpt = ' ';
            };
        }
        var url = "public/" + e.target.options.data[2] + ".js?" + new Date().getTime() + "";
        var script = document.createElement('script');
        script.setAttribute('type', 'text/javascript');
        script.setAttribute('src', url);
        document.getElementById('route').appendChild(script);
        var opensidebar = document.getElementById('sidebar');
        opensidebar.style.display = "block";
        // data[0] 类型 PILOT / ATC
        // data[1] CID
        // data[2] callsign
        // data[3] //frequency
        // data[4] latitude
        // data[5] longitude
        // data[6] altitude
        // data[7] ground speed
        // data[8] heading
        // data[9] departure
        // data[10] arrival
        // data[11] route
        // data[12] //
        // data[13] platform
        // data[14] squawk
        // data[15] type

        //向页面添加机组详情信息标牌内的元素
        {
            document.getElementById('callsign-top').innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + IATA + callsign_main + '&nbsp;/&nbsp;' + e.target.options.data[2];
            document.getElementById('callsign-2').innerHTML = '&nbsp;航班 ' + e.target.options.data[2] + ' 的更多信息 <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; More ' + e.target.options.data[2] + ' Information';
            document.getElementById('type').innerHTML = e.target.options.data[15];
            document.getElementById('airline-1').innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + airline_main_both;
            document.getElementById('image').innerHTML = '<img src="public/plane/' + ICAO + '.png" width="100%">';
            document.getElementById('airline-pic').innerHTML = '<img src="public/airline/' + ICAO + '.png" style="position: absolute;top:23px;left: 5px;width: 50px;">';
            document.getElementById('airline-2').innerHTML = airline_main_only;
            document.getElementById('depname').innerHTML = dep_arpt;
            document.getElementById('arrname').innerHTML = arr_arpt;
            document.getElementById('cid').innerHTML = e.target.options.data[1];
            document.getElementById('alt').innerHTML = e.target.options.data[6] + "FT";
            document.getElementById('track').innerHTML = e.target.options.data[8];
            document.getElementById('lat').innerHTML = e.target.options.data[5];
            document.getElementById('gs').innerHTML = e.target.options.data[7] + "KTS";
            document.getElementById('long').innerHTML = e.target.options.data[4];
            document.getElementById('squawk').innerHTML = e.target.options.data[14];
            document.getElementById('route').innerHTML = e.target.options.data[11] + '<br><br>';
            document.getElementById('dep-arr').innerHTML = e.target.options.data[9] + '&nbsp;&nbsp;<img  width="50px" src="flight/direct.svg">&nbsp;&nbsp;' + e.target.options.data[10];
        }
        
    }

}
//故障机组？弹框提示管制员亿下下
function showEmgData7700(f) {
    f.target.bindPopup('<div class="temp"><b>' + f.target.options.data[2] + '</b><br>机组宣布紧急情况：航空器故障</div>');
    f.target.openPopup();
}
function showEmgData7600(f) {
    f.target.bindPopup('<div class="temp"><b>' + f.target.options.data[2] + '</b><br>机组宣布紧急情况：通讯失效</div>');
    f.target.openPopup();
}
function showEmgData7500(f) {
    f.target.bindPopup('<div class="temp"><b>' + f.target.options.data[2] + '</b><br>机组宣布紧急情况：劫机</div>');
    f.target.openPopup();
}
function showEmgDataNoPlan(f) {
    f.target.bindPopup('<div class="temp2"><b style="color:red;">' + f.target.options.data[2] + '</b><br><span style="color:red"><b>上线不交计划??? </b></span><br><img width="100%" src="public/img/noplan.png"/><br>航线千万条，规则第一条，上线无计划，只剩两行泪.<br>Flying routes a lot, Rules must go first, <br>If no plan submit, Only tears left.</div>');
    f.target.openPopup();
}

function updateData() {
    //改为自己的info.php
    var whazzup = $.ajax({ url: 'info.php', async: false }).responseText.split('\n');
    var layers = [];
    var airtable = '';
    var atctable = '';
    for (var i = 0; i < whazzup.length; i++) {
        var data = whazzup[i].split(':');
        var airplaneIcon = L.icon({ iconUrl: '/public/img/marker_pilot.png', iconSize: [40, 40], iconAnchor: [20, 20], });
        var emgairplaneIcon = L.icon({ iconUrl: '/public/img/marker_pilot_emg.png', iconSize: [40, 40], iconAnchor: [20, 20], });
        var atcIcon = L.icon({ iconUrl: '/public/img/marker_atc.png', iconSize: [30, 30], iconAnchor: [15, 15], });
        if (data[0] == 'PILOT') {
            //获得应答机编码
            var squawk_or = data[14] + "";
            if (squawk_or == '7700') {
                try {

                    layers.push(L.marker([data[4], data[5]], { icon: emgairplaneIcon, rotationAngle: data[8], data: data }).on('click', clickEvent).on('mouseover', showEmgData7700));
                    airtable += "<tr><td style='color:red'>" + data[2] + "</td><td>" + data[9] + "</td></td><td>" + data[10] + "</td></tr>";
                    //特情？弹框提醒管制员一下吧！

                } catch (error) { console.log(error) };

            }
            else if (squawk_or == '7600') {
                try {

                    layers.push(L.marker([data[4], data[5]], { icon: emgairplaneIcon, rotationAngle: data[8], data: data }).on('click', clickEvent).on('mouseover', showEmgData7600));
                    airtable += "<tr><td style='color:red'>" + data[2] + "</td><td>" + data[9] + "</td></td><td>" + data[10] + "</td></tr>";
                    //特情？弹框提醒管制员一下吧！

                } catch (error) { console.log(error) };

            }
            else if (squawk_or == '7500') {
                try {

                    layers.push(L.marker([data[4], data[5]], { icon: emgairplaneIcon, rotationAngle: data[8], data: data }).on('click', clickEvent).on('mouseover', showEmgData7500));
                    airtable += "<tr><td style='color:red'>" + data[2] + "</td><td>" + data[9] + "</td></td><td>" + data[10] + "</td></tr>";
                    //特情？弹框提醒管制员一下吧！

                } catch (error) { console.log(error) };

            }
            else {
                //康康你交没交计划呗？没交计划？给点小惊喜咋样啊/doge
                var flight_plan_or = data[11] + "";
                var plan_len = flight_plan_or.length;
                if (plan_len <= 1) {
                    try {
                        //看看你以后还敢不敢不交计划
                        layers.push(L.marker([data[4], data[5]], { icon: emgairplaneIcon, rotationAngle: data[8], data: data }).on('click', clickEvent).on('mouseover', showEmgDataNoPlan));
                        airtable += "<tr><td style='color:red'>" + data[2] + "</td><td>" + data[9] + "</td></td><td>" + data[10] + "</td></tr>";
                    } catch (error) { console.log(error) };

                }
                else {
                    try {
                        layers.push(L.marker([data[4], data[5]], { icon: airplaneIcon, rotationAngle: data[8], data: data }).on('click', clickEvent).on('mouseover', overEvent));
                        airtable += "<tr><td>" + data[2] + "</td><td>" + data[9] + "</td></td><td>" + data[10] + "</td></tr>";
                    } catch (error) { console.log(error) }
                }
            }
        } else if (data[0] == 'ATC') {
            //获取ATC的呼号
            var atc_callsign_ori = data[2] + "";
            var callsign_sub = atc_callsign_ori.substring(0, 4);//取呼号的前4位，判断是否为CTR
            var isobs = atc_callsign_ori.substring(atc_callsign_ori.length - 3, atc_callsign_ori.length);//取呼号后3位，判断是否为OBS
            var isprc = atc_callsign_ori.substring(0, 3);//判断是否为PRC_FSS
            //如果为区调样式，就画区调对应的标识
            {
                if (isobs == 'OBS') {
                    try {
                        //OBS只显示marker，不显示管制半径
                        layers.push(L.marker([data[4], data[5]], { icon: atcIcon, data: data }).on('click', clickEvent).on('mouseover', overEvent));
                        atctable += "<tr><td>" + data[2] + "</td><td>" + data[3] + "</td><td>" + data[1] + "</td></tr>";
                    } catch (error) { console.log(error) }
                }
                //否则，正常展示管制员边界
                //因为区调已经过滤掉，所以这里不会重复展示区调的边界
                else {
                    try {
                        layers.push(L.marker([data[4], data[5]], { icon: atcIcon, data: data }).on('click', clickEvent));
                        layers.push(L.circle([data[4], data[5]], { radius: (data[12] / 1000) * 1852, data: data }).on('click', clickEvent).on('mouseover', overEvent));
                        atctable += "<tr><td>" + data[2] + "</td><td>" + data[3] + "</td><td>" + data[1] + "</td></tr>";
                    } catch (error) { console.log(error) }
                }
            }
        }
    }
    $('#AirlineTable').empty();
    $('#AirlineTable').append(airtable);
    $('#ATCTable').empty();
    $('#ATCTable').append(atctable);
    try { map.removeLayer(layergroup) } catch (error) { };
    layergroup = L.layerGroup(layers);
    map.addLayer(layergroup);

}
