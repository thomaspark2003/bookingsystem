# bookings/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path("resources/", views.ResourceListCreateView.as_view(), name="resource-list-create"),
    path("resources/<uuid:pk>/", views.ResourceDetailView.as_view(), name="resource-detail"),
    path("bookings/", views.BookingListCreateView.as_view(), name="booking-list-create"),
    path("bookings/<uuid:pk>/", views.BookingDetailView.as_view(), name="booking-detail"),
]