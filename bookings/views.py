# bookings/views.py
from django.db import IntegrityError, transaction
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Resource, Booking
from .serializers import ResourceSerializer, BookingSerializer


class ResourceListCreateView(APIView):
    """
    GET  /api/resources/   -> list all resources
    POST /api/resources/   -> create a new resource
    """

    def get(self, request):
        resources = Resource.objects.all()
        serializer = ResourceSerializer(resources, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ResourceSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ResourceDetailView(APIView):
    """
    GET    /api/resources/<id>/   -> retrieve one resource
    DELETE /api/resources/<id>/   -> delete one resource
    """

    def get(self, request, pk):
        resource = get_object_or_404(Resource, pk=pk)
        serializer = ResourceSerializer(resource)
        return Response(serializer.data)

    def delete(self, request, pk):
        resource = get_object_or_404(Resource, pk=pk)
        resource.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class BookingListCreateView(APIView):
    """
    GET  /api/bookings/   -> list all bookings (optionally filter by resource)
    POST /api/bookings/   -> create a booking; this is the interesting one --
                              Postgres itself rejects overlapping bookings via
                              the ExclusionConstraint on Booking.Meta, and we
                              translate that IntegrityError into a clean 409.
    """

    def get(self, request):
        bookings = Booking.objects.all()

        resource_id = request.query_params.get("resource")
        if resource_id:
            bookings = bookings.filter(resource_id=resource_id)

        serializer = BookingSerializer(bookings, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = BookingSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            with transaction.atomic():
                serializer.save()
                serializer.instance.refresh_from_db()   # <-- add this line
        except IntegrityError:
            return Response(
                {"detail": "This resource is already booked for the requested time range."},
                status=status.HTTP_409_CONFLICT,
        )

        return Response(serializer.data, status=status.HTTP_201_CREATED)



class BookingDetailView(APIView):
    """
    GET    /api/bookings/<id>/   -> retrieve one booking
    PATCH  /api/bookings/<id>/   -> update a booking (e.g. cancel it)
    DELETE /api/bookings/<id>/   -> delete a booking outright
    """

    def get(self, request, pk):
        booking = get_object_or_404(Booking, pk=pk)
        serializer = BookingSerializer(booking)
        return Response(serializer.data)

    def patch(self, request, pk):
        booking = get_object_or_404(Booking, pk=pk)
        serializer = BookingSerializer(booking, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        try:
            with transaction.atomic():
                serializer.save()
                serializer.instance.refresh_from_db()
        except IntegrityError:
            return Response(
                {"detail": "Updating this booking would overlap another booking for the same resource."},
                status=status.HTTP_409_CONFLICT,
            )

        return Response(serializer.data)

    def delete(self, request, pk):
        booking = get_object_or_404(Booking, pk=pk)
        booking.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)