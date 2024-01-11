from django.db import models
# Create your models here.

# class Category(models.Model):
#     name = models.CharField(max_length=100)

#     def __str__(self) -> str:
#         return self.name

class Location(models.Model):

    class PostObjects(models.Manager):
        def get_queryset(self):
            return super().get_queryset()

    # options = (
    #     ('draft', 'Draft'),
    #     ('published', 'Published')
    # )
     
    # category = models.ForeignKey(Category, on_delete=models.PROTECT, default= 1)
    name = models.CharField(max_length=100)
    address = models.CharField(max_length=200)
    geoLocation = models.CharField(max_length=200)
    objects = models.Manager()
    postobjects = PostObjects()

    # class Meta:
    #     ordering = ('-published',)

    def __str__(self) -> str:
        return self.name