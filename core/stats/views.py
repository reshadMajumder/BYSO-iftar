from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from django.db.models import Count, Sum, Q
from django.utils import timezone
from datetime import datetime, timedelta
from accounts.models import User
from payments.models import Payment
from tickets.models import Ticket

class RegistrationStatsView(APIView):
    """
    Returns:
    - total registration count
    - position wise registration count
    - male/female/other count
    Only considers users with approved registration payment.
    """
    permission_classes = [permissions.AllowAny]  # restrict to admin if needed

    def get(self, request):
        # Get users with approved registration payment
        registered_user_ids = Payment.objects.filter(
            payment_type='registration',
            payment_approved=True
        ).values_list('user_id', flat=True).distinct()

        users = User.objects.filter(id__in=registered_user_ids)

        total_count = users.count()

        # Group by position
        position_counts = (
            users.exclude(position__isnull=True).exclude(position__exact='')
            .values('position')
            .annotate(count=Count('id'))
            .order_by('position')
        )

        gender_counts = users.values('gender').annotate(count=Count('id'))

        data = {
            "total_registered": total_count,
            "batch_wise_count": {str(p['position']).strip(): p['count'] for p in position_counts},
            "gender_count": {g['gender'] or "unknown": g['count'] for g in gender_counts},
        }

        return Response(data)




class DonationStatsView(APIView):
    """
    Returns a list of all approved donations with:
    - username
    - position
    - donation amount
    - total donation sum
    """
    permission_classes = [permissions.AllowAny]  # change to IsAdminUser if needed

    def get(self, request):
        # Filter approved donations
        donations = Payment.objects.filter(
            payment_type='donation',
            payment_approved=True
        ).select_related('user')

        # Prepare donation list
        donation_list = []
        total_donation = 0

        for d in donations:
            total_donation += float(d.amount)
            donation_list.append({
                "name": d.user.name,
                "position": d.user.position,
                "image": None,
                "amount": float(d.amount),
                "transaction_id": d.transaction_id,
                "method": d.method,
            })

        return Response({
            "total_donation_amount": total_donation,
            "donations": donation_list
        })
