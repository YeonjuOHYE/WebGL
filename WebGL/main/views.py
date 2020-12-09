from django.shortcuts import render, redirect
from django.http import HttpResponse
from .models import webgl_project

# Create your views here.
def index(request):
    return redirect('main:examples')

def examples(request):
    projects = webgl_project.objects.all()
    context = {
        'projects' : projects
    }
    return render(request, "main/examples.html", context)

def gl_project(request, project_url):
    print(project_url)
    
    projects = webgl_project.objects.all()
    context = {
        'projects' : projects
    }
    return render(request, "main/"+project_url+".html", context)