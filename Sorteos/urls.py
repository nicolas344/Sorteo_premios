from django.urls import path, include
from rest_framework import routers
from Sorteos import views

router = routers.DefaultRouter()
router.register(r'personas', views.PersonaView, 'persona')

urlpatterns = [
    path("api/v1/", include(router.urls)),
] 