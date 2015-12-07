$(document).ready(function(){
    var obj = $("#search");
    obj.keyup(function(){
        var input_value = obj.val();
        var career_course = $("#career_course");
        var course = $("#course");

        $.ajax({
                type : "get",
                //url后面添加一个"&"，服务器端可以获取到不同数量的空格值
                url : "/search/?value="+input_value+"&",
                dataType: "json",
                async: true,
                success:function(data)
                {
                    // 将清空的代码放入success的回调函数中，有效地解决了快速输入导致重复出现的结果。
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
                        career_course.append("No career course...");
                    }

                    if(course.is(":empty"))
                    {
                        course.append("No course...");
                    }
                }
        });
    });
});
