from django.shortcuts import render
from django.views import View
# Create your views here.


class CartView(View):
    def get(self, request):
        context = {}
        return render(request, "cart/cart.html", context)
