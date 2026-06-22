from django.db import models
# Create your models here.

class CategoryModel(models.Model):
    name = models.CharField(max_length=100, unique=True, blank=False)
    slug = models.SlugField(unique=True, blank=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    description = models.TextField(max_length=500, blank=True)
    image = models.ImageField(upload_to='uploads/')


    def __str__(self):
        return self.name

    
    class Meta:
        verbose_name = "category"
        verbose_name_plural = "categories"
