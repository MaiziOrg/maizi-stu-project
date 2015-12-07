#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Created on 2015/11/3
@author: yopoing
common模块的url配置。
"""

from django.conf.urls import patterns, url

urlpatterns = patterns('common.views',
    url(r'^$', 'index', name='index'),
    url(r'^search/$', 'search', name='search'),
    url(r'^teacher_course/(?P<teacher_id>[0-9]+)/$', 'teacher_course', name='teacher_course')
)