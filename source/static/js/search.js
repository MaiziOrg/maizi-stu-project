$(document).ready(function(){
    var obj = $("#search");
    obj.keyup(function(){
        var input_value = obj.val();
        var career_course = $("#career_course");
        var course = $("#course");

        $.ajax({
                type : "get",
                //url�������һ��"&"���������˿��Ի�ȡ����ͬ�����Ŀո�ֵ
                url : "/search/?value="+input_value+"&",
                dataType: "json",
                async: true,
                success:function(data)
                {
                    // ����յĴ������success�Ļص������У���Ч�ؽ���˿������뵼���ظ����ֵĽ����
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
