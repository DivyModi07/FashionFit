# from rest_framework.decorators import api_view
# from rest_framework.response import Response
# from rest_framework import status
# from .serializers import RegisterSerializer

# @api_view(['POST'])
# def signup(request):
#     serializer = RegisterSerializer(data=request.data)
#     if serializer.is_valid():
#         serializer.save()
#         return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate
from django.utils import timezone
from .models import CustomUser

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    ...
    class Meta:
        model = User
        fields = [
            'email', 'first_name', 'last_name', 'phone', 'password',
            'dob', 'gender', 'address', 'city', 'state', 'zipcode'
        ]


    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user
    
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user  # The authenticated user is set by the parent class
        user.last_login = timezone.now()
        user.save(update_fields=["last_login"])
        return data

# class UserProfileSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = CustomUser
#         # I've included all the fields your checkout page will need
#         fields = [
#             'id', 'email', 'first_name', 'last_name', 'phone',
#             'address', 'city', 'state', 'zipcode'
#         ]


# In users/serializers.py

class UserProfileSerializer(serializers.ModelSerializer):
    # Add a password field that is write-only and not required
    password = serializers.CharField(write_only=True, required=False, style={'input_type': 'password'})

    class Meta:
        model = CustomUser
        fields = [
            'id', 'email', 'first_name', 'last_name', 'phone',
            'address', 'city', 'state', 'zipcode', 'password'
        ]
        # Make email read-only so it can't be changed from this form
        read_only_fields = ['email', 'id']

    def update(self, instance, validated_data):
        # Handle the optional password update
        password = validated_data.pop('password', None)
        
        # Update all other fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        if password:
            instance.set_password(password)
            
        instance.save()
        return instance