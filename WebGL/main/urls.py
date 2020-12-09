from django.urls import path

from . import views

app_name = 'main'

urlpatterns = [
    path('', views.index, name='index'),
    path('examples/', views.examples, name='examples'),
    path('examples/<str:project_url>', views.gl_project, name='gl_project'),
]