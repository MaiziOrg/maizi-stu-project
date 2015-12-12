$(document).ready(function(){
    var career_course = $("#career_course");
    var course = $("#course");

    var obj = $("#search");
    obj.keyup(function(){
        var input_value = obj.val();
        prompt(career_course, course);
        $.ajax({
                type : "get",
                //url路径添加后缀"&"，可以精确地获取到input_value的值（一个空格还是多个空格）
                url : "/search/?value="+input_value+"&",
                dataType: "json",
                async: true,
                success:function(data)
                {
                    processData(data);
                }
        });
    });

    var $obj = $("#search-ul a");
    $obj.click(function(){
        var keyword =$(this).text();
        prompt(career_course, course);
        $.ajax({
                type : "get",
                url : "/search/?value="+keyword,
                dataType: "json",
                async: true,
                success:function(data)
                {
                    processData(data);
                }
        });
    });

    // ajax过程中显示的状态
    function prompt(var1, var2)
    {
        var1.empty();
        var1.append("搜索中...");
        var2.empty();
        var2.append("搜索中...");
    }

    // 处理ajax后台返回的数据
    function processData(data)
    {
        //将清除的两行代码放在success函数中，有效地解决了重复添加的问题
        career_course.empty();
        course.empty();

        $.each(data, function(index, content){
            var get_value = content.fields.name;

            if(content.model == "common.careercourse")
            {
                career_course.append('<a href="" style="background-color:' + content.fields.course_color + ';">' + get_value + '</a>');
            }
            else
            {
                course.append('<a href="" style="background-color:red;">' + get_value + '</a>');
            }
        });

        if(career_course.is(":empty"))
        {
            career_course.append("无");
        }

        if(course.is(":empty"))
        {
            course.append("无");
        }
    }
});