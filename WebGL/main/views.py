from django.shortcuts import render, redirect
from django.http import HttpResponse
from .models import webgl_project
import os
import base64


# Create your views here.
def index(request):
    return redirect("main:examples")


def examples(request):
    projects = webgl_project.objects.all()
    context = {"projects": projects}
    return render(request, "main/examples.html", context)


def gl_project(request, project_url):
    print(project_url)

    projects = webgl_project.objects.all()
    current_project = webgl_project.objects.get(project_url=project_url)
    print(current_project)
    context = {
        "projects": projects,
        "current_project": current_project,
    }
    return render(request, "main/" + project_url + ".html", context)


def update_thumbnail(request, project_url):
    print("update_thumbnail")
    print(request.POST)
    projects = webgl_project.objects.all()
    current_project = webgl_project.objects.get(project_url=project_url)

    path = os.path.join(os.getcwd(), "media")

    previous_url = str(current_project.thumbnail)
    if previous_url != "thumbnail_default.jpg":
        previous_path = os.path.join(path, previous_url)
        if os.path.isfile(previous_path):
            os.remove(previous_path)

    imgdata = base64.b64decode(request.POST["new_thumbnail_base64"].split(",")[1])
    new_filename = os.path.join("thumbnail", project_url) + ".png"
    new_path = os.path.join(path, new_filename)
    with open(new_path, "wb") as f:
        f.write(imgdata)

    current_project.thumbnail = new_filename
    current_project.save()

    context = {
        "projects": projects,
        "current_project": current_project,
    }
    return redirect("main:gl_project", project_url=project_url)
