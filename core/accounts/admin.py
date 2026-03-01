import csv
from django.http import HttpResponse
from django.contrib import admin
from .models import User


def export_users_csv(modeladmin, request, queryset):
    """
    Export selected users as CSV.
    """
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="users.csv"'

    writer = csv.writer(response)
    # Header row
    writer.writerow([
        'Phone',
        'Name',
        'Position',
        'Gender',
        'Religion',
        'Staff',
        'Active',
        'Date Joined',
        'Payment Transaction ID',
        'Payment Type',
        'Payment Amount',
        'Payment Method',
        'Payment Approved',
        'Payment Created At',
    ])

    for user in queryset:
        payments = list(user.payments.all().order_by('-created_at'))

        if payments:
            for payment in payments:
                writer.writerow([
                    user.phone,
                    user.name,
                    user.position,
                    user.gender,
                    user.religion,
                    user.is_staff,
                    user.is_active,
                    user.date_joined.isoformat() if user.date_joined else '',
                    payment.transaction_id,
                    payment.payment_type,
                    str(payment.amount),
                    payment.method,
                    payment.payment_approved,
                    payment.created_at.isoformat() if payment.created_at else '',
                ])
        else:
            writer.writerow([
                user.phone,
                user.name,
                user.position,
                user.gender,
                user.religion,
                user.is_staff,
                user.is_active,
                user.date_joined.isoformat() if user.date_joined else '',
                '',
                '',
                '',
                '',
                '',
                '',
            ])



export_users_csv.short_description = "Export Selected Users to CSV"


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = (
        'phone', 'name', 'position', 'gender', 'is_staff', 'is_active', 'date_joined'
    )
    search_fields = ('phone', 'name')
    list_filter = ('position', 'gender', 'is_staff', 'is_active')
    ordering = ('-date_joined',)
    actions = [export_users_csv]

