from django.shortcuts import render

# Create your views here.
from rest_framework import generics, permissions
from .models import store_data
from .serializers import StoreLocationSerializer

class TaskListCreateAPIView(generics.ListCreateAPIView):
    queryset = store_data.objects.all()
    serializer_class = StoreLocationSerializer    

class TaskRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = store_data.objects.all()
    serializer_class = StoreLocationSerializer