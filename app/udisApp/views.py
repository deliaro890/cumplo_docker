from django.shortcuts import render,render

# Create your views here.

#rest_framework
from rest_framework import status, viewsets,mixins
from rest_framework.response import Response
from rest_framework.generics import get_object_or_404

#serializers
from udisApp.serializers import udisAppSerializer

import requests

from udisApp.forms import banxicoForm


class udisAppViewSet( mixins.CreateModelMixin,
                     viewsets.GenericViewSet):
    serializer_class = udisAppSerializer

    def create(self, request, *args, **kwargs):
        serializer = udisAppSerializer(data=request.data)
        
        if serializer.is_valid():
            fecha_inicial = serializer.data['fecha_inicial']
            fecha_final = serializer.data['fecha_final']
            
            api_id_dolar = 'SF43718' #dolar
            api_id_udis = 'SP68257' #udis

            udis = get_api_bmx(api_id_udis,fecha_inicial,fecha_final)
            dolares = get_api_bmx(api_id_dolar,fecha_inicial,fecha_final)

            response = super(udisAppViewSet,self).create(serializer)
            data={'status':'success','udis':udis,'dolares':dolares,'data-in':response.data}
            response.data = data
            return response
        
        else:

            data = {
                'status': 'datos de entrada erroneos',
                'error': serializer.errors,
                'status_code':status.HTTP_400_BAD_REQUEST
                
            }
            return Response(data,status=status.HTTP_400_BAD_REQUEST)

def get_api_bmx(api_id,fecha_inicial,fecha_final):

    api = requests.get('https://www.banxico.org.mx/SieAPIRest/service/v1/series/'+api_id+'/datos/'+fecha_inicial+'/'+fecha_final,headers={'Bmx-Token':'5b04aa761bd8a9b7bee2dcb5aa2765ab06fddaa7c458e4333fe06e10304f9510'})
    bmx = api.json().get('bmx').get('series')[0].get('datos')

    return bmx


def vista_2(request):

    if request.method == 'POST':  ##request.FILES: los archivos no vienen del post
        form = banxicoForm(request.POST) # creamos una instancia de la clase ProfileForm y sus parametros seran la info que nos envíen por post; guardamos los datos del form
        if form.is_valid():
            data = form.cleaned_data
            fecha_inicial = data ['fecha_inicial']
            fecha_final = data ['fecha_final']

            context = {
                'fecha_inicial':fecha_inicial,
                'fecha_final':fecha_final
            }
            return render (request,'udisApp.html',context)
    else:
        form = banxicoForm()
    return render(
        request = request,
        template_name = 'udisApp.html',
        context = {
            'form':form
        }
    )
    
def vista(request):
    return render(
        request = request,
        template_name = 'udisApp.html'
    )






    
   
