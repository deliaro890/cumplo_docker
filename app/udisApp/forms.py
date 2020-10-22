from django import forms

class banxicoForm(forms.Form):
  
    fecha_inicial = forms.DateField(required=True)
    fecha_final = forms.DateField(required=True)