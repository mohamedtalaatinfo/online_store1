from django.contrib import admin
from .models import *

# Register your models here.

class CategoryModelAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("name",)}
    list_display = ["name", "slug"]

admin.site.register(CategoryModel, CategoryModelAdmin)


class ItemsModelAdmin(admin.ModelAdmin):
    list_display = ["item_name", "category", "price", "updated_at", "is_available"]
    prepopulated_fields = {"slug": ("item_name", )}
    list_filter = ["category", "created_at", "is_available", "price"]
    search_fields = ["item_name", "category__name" ]
    search_help_text = "Search by item name and category"


admin.site.register(ItemsModel, ItemsModelAdmin)
