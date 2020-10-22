from django.urls import include,path

from udisApp.views import udisAppViewSet
from udisApp.views import vista
 
from rest_framework.routers import DefaultRouter
 
router = DefaultRouter()
router.register(r'banxico',udisAppViewSet,basename='udisApp')

urlpatterns = [

    path(
        route = 'vista/',
        view = vista,
        name = 'vista'
    ),

    path('',include(router.urls))

]