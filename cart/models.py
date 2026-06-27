from django.db import models
from online_store.models import ItemsModel
# Create your models here.


class CartModel(models.Model):
    cart_id = models.CharField(max_length=250, blank=True)
    date_added = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.cart_id



class CartItemsModel(models.Model):
    product = models.ForeignKey(ItemsModel, on_delete=models.CASCADE, related_name='cart_items')
    cart = models.ForeignKey(CartModel, on_delete=models.CASCADE, related_name='cart_items')
    quantity = models.IntegerField()
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.product
