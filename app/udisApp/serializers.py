""" udisApp serializers! """
from rest_framework import serializers


from django.contrib.auth import authenticate

from rest_framework.validators import UniqueValidator


class udisAppSerializer(serializers.Serializer):
    
    fecha_inicial = serializers.DateField(required=True)
    fecha_final = serializers.DateField(required=True)

    def create(self,data):
        return data

    
 


          
