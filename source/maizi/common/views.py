#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Created on 2015/11/3
@author: yopoing
Common模块View业务处理。
"""

from django.shortcuts import render, HttpResponse, get_object_or_404
from .models import CareerCourse, Course, UserProfile, RecommendKeywords, RecommendedReading, Links, Ad
from django.core.serializers import serialize

from random import randint

border_left_color_list = ['#00A388', '#FF6038', '#999d9c', '#78BD8B', '#1d953f', '#f3715c',
                          '#74787c', '#decb00', '#b4532a', '#f47920', '#f36c21', '#ffd400',]

background_color_list = ['#A9BE32', '#E68E38', '#429FDA', '#D3A21F', '#EE5C5C']

course_small_icons = ['course/2015/12/android.png', 'course/2015/12/cocos.png', 'course/2015/12/drupal.png',
                      'course/2015/12/ios.png', 'course/2015/12/windows8.png']

# 首页
def index(request):

    # 随机显示3个推荐搜索关键词
    recommend_words = list()
    words = RecommendKeywords.objects.all()
    word_count = words.count()

    if word_count <= 3:
        recommend_words = words
    else:
        count_set = set()
        while True:
            if len(count_set) == 3: break
            count_set.add(randint(0, word_count-1))
        for dex in count_set:
            recommend_words.append(words[dex])

    # 广告banner
    ad_list = Ad.objects.all()

    # 最新课程：按照添加时间由近及远进行排列
    latest_courses = Course.objects.order_by('-date_publish')

    # 最多播放：按照课程下章节播放次数之和由多及少进行排列
    most_play_courses = Course.objects.order_by('-click_count')

    # 最具人气：按照课程下收藏次数之和由多及少进行排列
    most_hot_courses = Course.objects.order_by('-favorite_count')

    # 教师
    users = UserProfile.objects.all()
    teacher_list = [user for user in users if user.is_teacher()]

    teacher_count = len(teacher_list)
    color_count = len(border_left_color_list)
    index_list = list()
    index = 0

    """
        采用动态地方式为每个Teacher对象添加border_left_color的属性
    """
    if teacher_count <= color_count:
        # 当teacher数量不大于颜色数量时，为每个teacher对象设置唯一的颜色属性
        for teacher in teacher_list:
            while True:
                index = randint(0, color_count-1)
                if not index in index_list:
                    index_list.append(index)
                    break

            teacher.border_left_color = border_left_color_list[index]
    else:
        # 当teacher数量大于颜色数量时，为每个teacher对象随机设置颜色属性
        for teacher in teacher_list:
            teacher.border_left_color = border_left_color_list[randint(0, color_count-1)]

    # 推荐阅读的文章
    activity_articles = RecommendedReading.objects.filter(reading_type='AV')
    activity_articles.type = u'官方活动'

    new_articles = RecommendedReading.objects.filter(reading_type='NW')
    new_articles.type = u'开发者资讯'

    discuss_articles = RecommendedReading.objects.filter(reading_type='DC')
    discuss_articles.type = u'技术交流'

    # 友情链接
    links = Links.objects.all()

    return render(request, 'common/index.html', locals())


# 搜索
def search(request):
    courses = list()
    try:
        if request.method == 'GET':
            if request.GET.has_key('value'):
                input_word = request.GET['value'].lower()
                career_course_list = CareerCourse.objects.all()
                course_list = Course.objects.all()

                # 键盘非输入键传过来的值
                if len(input_word) == 0:
                    courses = serialize('json', courses)
                    return HttpResponse(courses, content_type='application/json')

                # 当前端输入的是一个空格时，随机显示至多5门职业课程，小课程将全部显示。
                elif input_word == ' ':
                    career_course_count = career_course_list.count()
                    if career_course_count <= 5:
                        courses = serialize('json', list(career_course_list) + list(course_list))
                        return HttpResponse(courses, content_type='application/json')
                    else:
                        # 随机选取5门课程显示，使用set过滤掉重复的索引值，以防止选出重复的课程
                        count_set = set()
                        while True:
                            if len(count_set) == 5: break
                            count_set.add(randint(0, career_course_count-1))
                        for index in count_set:
                            courses.append(career_course_list[index])

                        courses = serialize('json', courses + list(course_list))
                        return HttpResponse(courses, content_type='application/json')

                else:
                    # 根据搜索词，获取到相关的匹配的职业课程及小课程
                    for career_course in career_course_list:
                        if career_course.name.lower().find(input_word) != -1:
                            courses.append(career_course)

                    for course in course_list:
                        if course.name.lower().find(input_word) != -1:
                            courses.append(course)

                    courses = serialize('json', courses)
                    return HttpResponse(courses, content_type='application/json')

            else:
                courses = serialize('json', courses)
                return HttpResponse(courses, content_type='application/json')

        else:
            courses = serialize('json', courses)
            return HttpResponse(courses, content_type='application/json')

    except Exception as e:
        print(e)
        courses = serialize('json', courses)
        return HttpResponse(courses, content_type='application/json')


# 老师课程页面
def teacher_course(request, teacher_id):

    # 随机显示3个推荐搜索关键词
    recommend_words = list()
    words = RecommendKeywords.objects.all()
    word_count = words.count()

    if word_count <= 3:
        recommend_words = words
    else:
        count_set = set()
        while True:
            if len(count_set) == 3: break
            count_set.add(randint(0, word_count-1))
        for dex in count_set:
            recommend_words.append(words[dex])

    color_count = len(background_color_list)
    icon_count = len(course_small_icons)

    teacher = get_object_or_404(UserProfile, pk=teacher_id)
    teacher_courses = teacher.course_set.all()

    """
        采用动态地方式为每个课程添加background_color, small_icon属性
    """
    for course in teacher_courses:
        course.background_color = background_color_list[randint(0, color_count-1)]
        course.small_icon = course_small_icons[randint(0, icon_count-1)]

    return render(request, 'common/personal_center_his_course_teacher.html', locals())