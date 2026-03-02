import csv
from django.http import HttpResponse
from django.contrib import admin
from django.contrib import messages
from .models import User


class HasPaymentFilter(admin.SimpleListFilter):
    title = 'Has Payment'
    parameter_name = 'has_payment'

    def lookups(self, request, model_admin):
        return (
            ('yes', 'Has Payment'),
            ('no', 'No Payment'),
        )

    def queryset(self, request, queryset):
        if self.value() == 'yes':
            return queryset.filter(payments__isnull=False).distinct()
        if self.value() == 'no':
            return queryset.filter(payments__isnull=True).distinct()
        return queryset


class PaymentApprovedFilter(admin.SimpleListFilter):
    title = 'Payment Approved'
    parameter_name = 'payment_approved'

    def lookups(self, request, model_admin):
        return (
            ('yes', 'Has Approved Payment'),
            ('no', 'No Approved Payment'),
            ('pending', 'Has Pending Payment'),
        )

    def queryset(self, request, queryset):
        if self.value() == 'yes':
            return queryset.filter(payments__payment_approved=True).distinct()
        if self.value() == 'no':
            return queryset.filter(payments__payment_approved=False).distinct()
        if self.value() == 'pending':
            return queryset.filter(payments__payment_approved=False, payments__isnull=False).distinct()
        return queryset


def export_users_csv(modeladmin, request, queryset):
    """
    Export selected users as CSV.
    """
    try:
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="users.csv"'

        writer = csv.writer(response)
        # Header row
        writer.writerow([
            'Phone',
            'Name',
            'Position',
            'Blood Group',
            'Unit Name',
            'Gender',
            'Religion',
            'Staff',
            'Active',
            'Date Joined',
            'Payment Phone',
            'Payment Transaction ID',
            'Payment Type',
            'Payment Amount',
            'Payment Method',
            'Payment Approved',
            'Payment Created At',
        ])

        for user in queryset:
            try:
                payments = list(user.payments.all().order_by('-created_at'))

                if payments:
                    for payment in payments:
                        writer.writerow([
                            user.phone or '',
                            user.name or '',
                            user.get_position_display() if user.position else '',
                            user.get_bloodgroup_display() if user.bloodgroup else '',
                            user.get_unit_name_display() if user.unit_name else '',
                            user.get_gender_display() if user.gender else '',
                            user.get_religion_display() if user.religion else '',
                            user.is_staff,
                            user.is_active,
                            user.date_joined.isoformat() if user.date_joined else '',
                            payment.phone or '',
                            payment.transaction_id or '',
                            payment.get_payment_type_display() if payment.payment_type else '',
                            str(payment.amount) if payment.amount else '',
                            payment.get_method_display() if payment.method else '',
                            payment.payment_approved,
                            payment.created_at.isoformat() if payment.created_at else '',
                        ])
                else:
                    # User with no payments
                    writer.writerow([
                        user.phone or '',
                        user.name or '',
                        user.get_position_display() if user.position else '',
                        user.get_bloodgroup_display() if user.bloodgroup else '',
                        user.get_unit_name_display() if user.unit_name else '',
                        user.get_gender_display() if user.gender else '',
                        user.get_religion_display() if user.religion else '',
                        user.is_staff,
                        user.is_active,
                        user.date_joined.isoformat() if user.date_joined else '',
                        '',
                        '',
                        '',
                        '',
                        '',
                        '',
                        '',
                    ])
            except Exception as e:
                # Handle individual user errors
                messages.error(request, f"Error processing user {user.phone}: {str(e)}")
                continue

        return response

    except Exception as e:
        messages.error(request, f"Error generating CSV: {str(e)}")
        return None



export_users_csv.short_description = "Export Selected Users to CSV"


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = (
        'phone', 'name', 'position', 'bloodgroup', 'unit_name', 'gender', 'is_staff', 'is_active', 'date_joined'
    )
    search_fields = ('phone', 'name')
    list_filter = ('position', 'bloodgroup', 'unit_name', 'gender', 'is_staff', 'is_active', HasPaymentFilter, PaymentApprovedFilter)
    ordering = ('-date_joined',)
    actions = [export_users_csv]

    def get_queryset(self, request):
        return super().get_queryset(request).prefetch_related('payments')

