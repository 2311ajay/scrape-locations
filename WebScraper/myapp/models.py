from django.db import models

# Create your models here.

from django.db import models

# class Task(models.Model):
#     title = models.CharField(max_length=100)
#     description = models.TextField()
#     completed = models.BooleanField(default=False)
#     created_at = models.DateTimeField(auto_now_add=True)

class store_data(models.Model):
    store_name = models.CharField(max_length=100)
    store_location = models.CharField(max_length=200)
    store_geolocation = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)