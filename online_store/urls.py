from django.urls import path
from . import views


urlpatterns = [
    path('', views.IndexView.as_view(), name='home'),
    path('category/<slug>/', views.CategoryView.as_view(), name='category'),
    path('allproducts/', views.AllProductsView.as_view(), name='allproducts'),

]
