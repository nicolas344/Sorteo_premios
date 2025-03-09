from django.db import models

class Persona(models.Model):
    nombre = models.CharField(max_length=200)
    ha_ganado = models.BooleanField(default=False)

    def __str__(self):
        return self.nombre