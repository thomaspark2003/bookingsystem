# Create your models here.
import uuid

from django.db import models
from django.contrib.postgres.fields import DateTimeRangeField
from django.contrib.postgres.constraints import ExclusionConstraint
from django.contrib.postgres.fields import RangeOperators
from django.db.models import Q


class Resource(models.Model):
    """
    A bookable thing: a hotel room, a study room, an appointment slot,
    an event, a meetup -- 'type' + 'metadata' let one table cover all of them.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    type = models.CharField(max_length=50)          # e.g. 'hotel_room', 'appointment', 'event'
    name = models.CharField(max_length=200)
    capacity = models.IntegerField(default=1)        # 1 = exclusive booking, N = shared/event
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.type})"


class Booking(models.Model):
    """
    A single reservation against a Resource for a time range.
    The ExclusionConstraint below is enforced BY POSTGRES ITSELF --
    two confirmed bookings for the same resource can never have
    overlapping 'during' ranges, no matter how many requests race
    to insert at the same time.
    """
    STATUS_CHOICES = [
        ("confirmed", "Confirmed"),
        ("held", "Held"),
        ("cancelled", "Cancelled"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    resource = models.ForeignKey(Resource, on_delete=models.CASCADE, related_name="bookings")
    user_id = models.UUIDField()
    during = DateTimeRangeField()
    party_size = models.IntegerField(default=1)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="confirmed")
    expires_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            ExclusionConstraint(
                name="exclude_overlapping_bookings",
                expressions=[
                    ("resource", RangeOperators.EQUAL),
                    ("during", RangeOperators.OVERLAPS),
                ],
                condition=Q(status="confirmed"),
            )
        ]

    def __str__(self):
        return f"{self.resource.name} booked by {self.user_id} during {self.during}"