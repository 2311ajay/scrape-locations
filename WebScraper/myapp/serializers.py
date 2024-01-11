from rest_framework import serializers
from .models import store_data

class StoreLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = store_data
        fields = ['id', 'store_name', 'store_location', 'store_geolocation', 'created_at']