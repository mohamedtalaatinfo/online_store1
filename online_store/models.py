from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator
# Create your models here.

class CategoryModel(models.Model):
    name = models.CharField(max_length=100, unique=True, blank=False)
    slug = models.SlugField(unique=True, blank=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    description = models.TextField(max_length=500, blank=True)
    image = models.ImageField(upload_to='uploads/categories/')


    def __str__(self):
        return self.name

    
    class Meta:
        verbose_name = "category"
        verbose_name_plural = "categories"



class ItemsModel(models.Model):
    category = models.ForeignKey(CategoryModel, on_delete=models.CASCADE)
    item_name = models.CharField(max_length=100, unique=True)
    description = models.TextField(max_length=1000)
    image = models.ImageField(upload_to="uploads/items/")
    is_available = models.BooleanField(default=False)
    price = models.IntegerField(
        validators = [
            MinValueValidator(1),
        ]
    )
    stock = models.IntegerField(default=1)
    slug = models.SlugField(unique=True, blank=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    def __str__(self):
        return self.item_name

    class Meta:
        verbose_name = "Item"
        verbose_name_plural = "Items"

