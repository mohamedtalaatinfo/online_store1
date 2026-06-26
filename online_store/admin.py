from django.contrib import admin
from .models import *
from django.core.exceptions import ValidationError
from django import forms
# Register your models here.

class CategoryModelAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("name",)}
    list_display = ["name", "slug"]

admin.site.register(CategoryModel, CategoryModelAdmin)



class ItemsModelAdminForm(forms.ModelForm):
    class Meta:
        model = ItemsModel
        fields = '__all__'

    def clean(self):
        cleaned_data = super().clean()
        is_featured = cleaned_data.get('is_featured')

        # Run validation check only if the user is checking/keeping 'is_featured' as True
        if is_featured:
            # Count existing featured records, excluding the current object if it is an update
            queryset = ItemsModel.objects.filter(is_featured=True)
            if self.instance and self.instance.pk:
                queryset = queryset.exclude(pk=self.instance.pk)

            # Define your cap limit here (e.g., maximum of 5 featured items)
            MAX_FEATURED = 4
            
            if queryset.count() >= MAX_FEATURED:
                # Attach the error banner specifically to the 'is_featured' field box
                raise ValidationError({
                    'is_featured': f"You can only feature up to {MAX_FEATURED} items. Please unfeature an older item first."
                })
                
        return cleaned_data

class ItemsModelAdmin(admin.ModelAdmin):
    form = ItemsModelAdminForm
    list_display = ["item_name", "category", "price", "updated_at", "is_featured", "is_available"]
    prepopulated_fields = {"slug": ("item_name", )}
    list_filter = ["category", "is_featured", "created_at", "is_available", "price"]
    search_fields = ["item_name", "category__name" ]
    search_help_text = "Search by item name and category"





admin.site.register(ItemsModel, ItemsModelAdmin)
