from django.core.management.base import BaseCommand
from bookings.models import Booking


class Command(BaseCommand):
    help = "Deletes all bookings. Use --confirm to actually run it."

    def add_arguments(self, parser):
        parser.add_argument(
            "--confirm",
            action="store_true",
            help="Required flag to actually delete bookings (safety check).",
        )

    def handle(self, *args, **options):
        count = Booking.objects.count()

        if not options["confirm"]:
            self.stdout.write(
                self.style.WARNING(
                    f"This would delete {count} booking(s). Re-run with --confirm to actually do it."
                )
            )
            return

        Booking.objects.all().delete()
        self.stdout.write(self.style.SUCCESS(f"Deleted {count} booking(s)."))