from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from cloudinary.models import CloudinaryField

class UserManager(BaseUserManager):
    def create_user(self, phone, password=None, **extra_fields):
        if not phone:
            raise ValueError("Phone number is required")
        user = self.model(phone=phone, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, phone, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(phone, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    # Choices
    GENDER_CHOICES = [('male','Male'),('female','Female'),('other','Other')]
    RELIGION_CHOICES = [('islam','Islam'),('hinduism','Hinduism'),('christianity','Christianity'),('buddhism','Buddhism'),('other','Other')]
    POSITION_CHOICES = [('founding_member', 'Founding Member'), ('committee_leader', 'Committee Leader'), ('general_member', 'General Member'), ('school_member', 'School Member')]

    BLOODGROUP_CHOICES = [
        ('A+', 'A+'),
        ('A-', 'A-'),
        ('B+', 'B+'),
        ('B-', 'B-'),
        ('AB+', 'AB+'),
        ('AB-', 'AB-'),
        ('O+', 'O+'),
        ('O-', 'O-'),
        ('other', 'Other'),
    ]

    UNIT_NAME_CHOICES = [
        ('cumilla_district', 'Cumilla District'),
        ('burichang_upazila', 'Burichang Upazila'),
        ('debidwer_upazila', 'Debidwer Upazila'),
        ('barura_upazila', 'Barura Upazila'),
        ('sadar_dakshin_upazila', 'Sadar Dakshin Upazila'),
        ('brahmanpara_upazila', 'Brahmanpara Upazila'),
        ('comilla_modern_high_school', 'Comilla Modern High School'),
        ('comilla_high_school', 'Comilla High School'),
    ]


    phone = models.CharField(max_length=15, unique=True)
    name = models.CharField(max_length=255,null=True,blank=True)
    position = models.CharField(max_length=255,choices=POSITION_CHOICES,null=True,blank=True)
    bloodgroup = models.CharField(max_length=5, choices=BLOODGROUP_CHOICES, null=True, blank=True)
    unit_name = models.CharField(max_length=50, choices=UNIT_NAME_CHOICES, null=True, blank=True)
    religion = models.CharField(max_length=20, choices=RELIGION_CHOICES, null=True, blank=True)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)


    groups = models.ManyToManyField(
        'auth.Group',
        related_name='custom_user_set',  # <--- custom related_name
        blank=True,
        help_text='The groups this user belongs to.'
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='custom_user_set',  # <--- custom related_name
        blank=True,
        help_text='Specific permissions for this user.'
    )

    USERNAME_FIELD = 'phone'
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return self.phone
