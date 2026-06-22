from django.contrib import admin
from .models import Account
# Register your models here.

class AccountAdmin(admin.ModelAdmin):
    list_display = ["email", "username", "first_name", "last_name", "last_login", "date_joined", "is_active"]
    list_display_links = ("email", "username", "first_name", "last_name")
    readonly_fields = ("last_login", "date_joined", "password")
    ordering = ("-date_joined", )


admin.site.register(Account, AccountAdmin)
