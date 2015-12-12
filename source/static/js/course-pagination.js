$(document).ready(function(){
    $(".fr a").live("click", function(){
        var $a = $(this);
        var ul_row_fr_id = $a.parent().parent().attr("id");

        // 获取到course_show模板中，class为"row fr"的ul对象
        var $row_fr = $("#" + ul_row_fr_id);

        // 获取到course_show模板中，class为"row course-list-index"的ul对象
        var arr = ul_row_fr_id.split("-");
        var $row_course_list_index = $("#"+arr[0]+"-"+arr[1]);

        var page = 1;
        var text = $a.text();

        if(text == "")
        {
            // 点击prev，next标识
            var array = $a.attr("id").split("+");
            var current_page_num = parseInt(array[0]);
            var forward_to = parseInt(array[1]);
            page = (current_page_num + forward_to).toString();
        }
        else
        {
            // 点击数字标识
            page = text;
        }

        if(ul_row_fr_id == "new-new-new")
        {
            ajax(page, ul_row_fr_id, $row_fr, $row_course_list_index);
        }
        else if(ul_row_fr_id == "most-most-most")
        {
            ajax(page, ul_row_fr_id, $row_fr, $row_course_list_index);
        }
        else if(ul_row_fr_id == "hot-hot-hot")
        {
            ajax(page, ul_row_fr_id, $row_fr, $row_course_list_index);
        }
        else
        {
            return false;
        }
    });

    // 定义使用ajax发送请求的函数
    function ajax(page, course_type, var1, var2)
    {
        $.ajax({
            type : "get",
            url : "/pagination/?page="+page+"&course_type="+course_type,
            dataType: "json",
            async: true,
            success:function(data)
            {
                var1.empty();
                var2.empty();
                var num_pages = 0;

                $.each(data, function(index, content){
                    var course_obj = content.fields;
                    if(num_pages == 0)
                    {
                        num_pages = course_obj.index;
                    }
                    var2.append('<li class="col-xs-12 col-sm-6 col-md-6 col-lg-3">' +
                        '<a href="javascript:void(0)"><dl><dt><div><img src="uploads/' + course_obj.image + '"></div>' +
                        '</dt><dd><span>' + course_obj.name + '</span> <p>' + course_obj.student_count +
                        '人正在学习</p></dd></dl></a></li>');
                });

                // 若当前的页面不是第一页，需要加上prev标识
                if(page > 1)
                {
                    var1.append('<li><a id="'+page+"+-1"+'"href="javascript:void(0)" class="v5-icon v5-icon-prev"></a></li>');
                }

                for(var i = 1; i <= num_pages; i++)
                {
                    if(i == page)
                    {
                        var1.append('<li><a href="javascript:void(0)" class="page-num active">' + i + '</a></li>');
                    }
                    else
                    {
                        var1.append('<li><a href="javascript:void(0)" class="page-num">' + i + '</a></li>');
                    }
                }

                // 若当前页面不是最后一页，需要加next标识
                if(page < num_pages)
                {
                    var1.append('<li><a id="'+page+"+1"+'"href="javascript:void(0)" class="v5-icon v5-icon-next"></a></li>');
                }
            }
        });
    }
});