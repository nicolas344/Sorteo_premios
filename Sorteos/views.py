from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Persona
from .serializer import PersonaSerializer

class PersonaView(viewsets.ModelViewSet):
    queryset = Persona.objects.all()
    serializer_class = PersonaSerializer

    @action(detail=True, methods=['post'])
    def toggle_ganador(self, request, pk=None):
        persona = self.get_object()
        persona.ha_ganado = not persona.ha_ganado
        persona.save()
        return Response({'status': 'estado actualizado'})

    @action(detail=False, methods=['post'])
    def bulk_create(self, request):
        if not isinstance(request.data, list):
            return Response({"error": "Se esperaba una lista de personas"}, 
                           status=status.HTTP_400_BAD_REQUEST)
        
        serializer = self.get_serializer(data=request.data, many=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

