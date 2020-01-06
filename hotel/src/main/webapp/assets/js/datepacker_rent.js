
var obj = { date: new Date(), year: -1, month: -1, priceArr: [] };
var htmlObj = { right: "" };
var pickerEvent = {
    Init: function (elemid) {
        if (obj.year == -1) {
            dateUtil.getCurrent();
        }
        for (var item in pickerHtml) {
            pickerHtml[item]();
        }
        var html = htmlObj.right;
        $('#'+elemid).append(html);
        var lis = document.getElementById("calendar").getElementsByTagName("li");
        for (var i = 0; i < lis.length; i++) {
            if (lis[i].getAttribute("date") != null && lis[i].getAttribute("date") != "") {
                lis[i].onclick = function () {
                    commonUtil.chooseClick(this);
                };
            }

        }

    },
    setPriceArr: function (arr) {
        obj.priceArr = arr;
    },

};
var pickerHtml = {
    getRight: function () {
        var str='';
        for(var bd=1;bd<=6;bd++){
            var days = dateUtil.getLastDay();//这月总天数
            var week = dateUtil.getWeek();//1号是周几
            var nextdayweek=dateUtil.getNextMonthDayWeek();
            var n=days+week+7-nextdayweek;
            var html = '<div class="month">'+obj.year+'年'+obj.month+'月'+'</div>';
            html += '<div class="weekNumDiv"><li>日</li><li>一</li><li>二</li><li>三</li><li>四</li><li>五</li><li>六</li></div>';
            html += '<ul curym='+obj.year+'年'+obj.month+'月'+'>';
            for (var i = 1; i <= n; i++) {
                var c = week > 0 ? week : 0;
                if ((i - 1) >= week && (i - c) <= days) {
                    var price = commonUtil.getPrice((i - c));
                    var priceStr = "";
                    var classStyle = "";
                    if (price != -1) {
                        priceStr = "<dfn>¥</dfn>" + price;
                        classStyle = "class='on'";
                    }
                    else{
                        priceStr="无";
                    }
                    if (price != -1&&obj.year==new Date().getFullYear()&&obj.month==new Date().getMonth()+1&&i-c==new Date().getDate()) {
                        classStyle = "class='on today'";
                    }
                    //每天数据
                    var Tmonth=obj.month;
                    if(Tmonth<10)Tmonth='0'+Tmonth;
                    var Tday=i-c;
                    if(Tday<10)Tday='0'+Tday;
                    html += '<li  ' + classStyle + ' date="' + obj.year + "-" + Tmonth + "-" + Tday + '" price="' + price + '"><a><b>' + Tday + '</b><em>' + priceStr + '</em><span></span></a></li>';
                }
                else {
                    html += "<li class='disabled'><a></a></li>";
                }
            }
            html += "</ul>";
            str=str+html;
            dateUtil.getNexDate();//下一月
        }
        str+='<ul style="height:50px"></ul>';
        htmlObj.right = str;
    }
};
var dateUtil = {
    //根据日期得到星期
    getWeek: function () {
        var d = new Date(obj.year, obj.month - 1, 1);
        return d.getDay();
    },
    //得到一个月的天数
    getLastDay: function () {
        var new_year = obj.year;//取当前的年份        
        var new_month = obj.month;//取下一个月的第一天，方便计算（最后一不固定）        
        var new_date = new Date(new_year, new_month, 1);                //取当年当月中的第一天        
        return (new Date(new_date.getTime() - 1000 * 60 * 60 * 24)).getDate();//获取当月最后一天日期        
    },
    //获取下月第一天星期几
    getNextMonthDayWeek:function () {
        var new_year = obj.year;//取当前的年份
        var new_month = obj.month;//取下一个月的第一天，方便计算（最后一不固定）
        var new_date = new Date(new_year, new_month, 1);                //取当年当月中的第一天
        return new_date.getDay();
    },
    getCurrent: function () {
        var dt = obj.date;
        obj.year = dt.getFullYear();
        obj.month = dt.getMonth() + 1;
		obj.day = dt.getDate();
    },
    getNexDate: function () {
        if (obj.year == -1) {
            var dt = new Date(obj.date);
            obj.year = dt.getFullYear();
            obj.month = dt.getMonth() + 1;
        }
        else {
            var newMonth = obj.month + 1;
            if (newMonth > 12) {
                obj.year += 1;
                obj.month = 1;
            }
            else {
                obj.month += 1;
            }
        }
    }
}
var commonUtil = {
    getPrice: function (day) {
        var dt = obj.year + "-";
        if (obj.month < 10)dt += "0"+obj.month;
        else dt+=obj.month;
        if (day < 10)dt += "-0" + day;
        else dt += "-" + day;
        
        for (var i = 0; i < obj.priceArr.length; i++) {
            if (obj.priceArr[i].Date == dt) {
                return obj.priceArr[i].Price;
            }
        }
        return -1;
    },
    chooseClick: function (sender) {
        var date = $(sender).attr("date");
        var price = $(sender).attr("price");
        var selectIndex=[null,null];
        var senderIndex=null;
        var num='';
        var beginDate=null;
        var endDate=null;
        //清除selected函数
        function clearSelected() {
            $('#calendar li').removeClass('selected').removeClass('range');
            $('#calendar li a em').show();
            $('#calendar li a span').text('').hide();
            selectIndex=[null,null];
            $('#status').html('');
        }
        function GetDateDiff(startDate,endDate)
        {
            var startTime = new Date(Date.parse(startDate)).getTime();
            var endTime = new Date(Date.parse(endDate)).getTime();
            var dates = Math.abs((startTime - endTime))/(1000*60*60*24);
            return  dates;
        }
        //点击前已选selected元素
        $('#calendar li').each(function (index) {
            if($(this).hasClass('selected')){
                if(selectIndex[0]!=null)selectIndex[1]=index;
                else selectIndex[0]=index;
            }
            if($(this).attr('date')==date)senderIndex=index;
        });
        //离店已选或者入住在已选入住日期之前清除所有selected
        if(selectIndex[1]!=null||senderIndex<=selectIndex[0])clearSelected();

        //添加selected
        if( (selectIndex[0]==null&&price!=-1) || selectIndex[0]!=null){

            $(sender).addClass('selected');
            $(sender).children('a').children('em').hide();
            if(selectIndex[0]==null){
                $(sender).children('a').children('span').text('入住').show();
                $('#calendar li').each(function (index) {
                    if($(this).attr('date')==$(sender).attr('date'))selectIndex[0]=index;
                })
            }
            else{
                $(sender).children('a').children('span').text('退房').show();
                $('#calendar li').each(function (index) {
                    if($(this).attr('date')==$(sender).attr('date'))selectIndex[1]=index;
                })
                var noprice_flag=0;//0有房，1无房
                $('#calendar li').each(function (index) {
                    if(index>selectIndex[0]&&index<selectIndex[1]&&$(this).attr('date')!= null){
                        if($(this).attr('price')== -1){
                            noprice_flag=1;
                        }
                    }
                })
                if(noprice_flag==1){
                    alert('亲，您选的日期没有房源，请重新选择');
                    clearSelected();
                    return false;
                }
                $('#calendar li').each(function (index) {
                    if(index>selectIndex[0]&&index<selectIndex[1]&&$(this).attr('date')!= null)$(this).addClass('range');
                })
            }

            beginDate=$('#calendar li').eq(selectIndex[0]).attr('date');
            if(selectIndex[1]!=null){
                endDate=$('#calendar li').eq(selectIndex[1]).attr('date');
                num=GetDateDiff(beginDate,endDate);
            }
            var startDayArr=beginDate.split('-');
            var startDayStr=startDayArr[1]+'月'+startDayArr[2]+'日入住，共 <b>'+num+'</b> 晚';
            $('#status').html(startDayStr);

        }


    }
};
