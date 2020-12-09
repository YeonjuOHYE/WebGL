from django.db import models

# Create your models here.
class webgl_project(models.Model):
    project_name = models.CharField(max_length=30, null=True)
    author = models.CharField(max_length=30, null=True)
    project_url = models.CharField(max_length=30, unique=True, null=True)
    thumbnail = models.ImageField(upload_to="thumbnail", default='thumbnail_default.jpg',null=True)
    
    def __str__(self):
        return f'프로젝트명:{self.project_name} 제작자:{self.author} URL:{self.project_url} 썸네일:{self.thumbnail}'