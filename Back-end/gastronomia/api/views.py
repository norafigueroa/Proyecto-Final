from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView, ListAPIView, CreateAPIView, DestroyAPIView, UpdateAPIView, RetrieveAPIView
from .models import *
from .serializers import *
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

# --- USUARIOS ---
class PerfilUsuarioListCreateView(ListCreateAPIView):
    queryset = PerfilUsuario.objects.all()
    serializer_class = PerfilUsuarioSerializer

class PerfilUsuarioDetailView(RetrieveUpdateDestroyAPIView):
    queryset = PerfilUsuario.objects.all()
    serializer_class = PerfilUsuarioSerializer

# --- GRUPOS ---
class GroupListCreateView(ListCreateAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

class GroupDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

# --- CATEGORÍAS ---
class CategoriaListCreateView(ListCreateAPIView):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer

class CategoriaDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer

# --- RESTAURANTES ---
class RestauranteListCreateView(ListCreateAPIView):
    queryset = Restaurante.objects.all()
    serializer_class = RestauranteSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class RestauranteDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Restaurante.objects.all()
    serializer_class = RestauranteSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

# --- CATEGORIA-RESTAURANTE ---
class CategoriaRestauranteListCreateView(ListCreateAPIView):
    queryset = CategoriaRestaurante.objects.all()
    serializer_class = CategoriaRestauranteSerializer

class CategoriaRestauranteDetailView(RetrieveUpdateDestroyAPIView):
    queryset = CategoriaRestaurante.objects.all()
    serializer_class = CategoriaRestauranteSerializer

# --- FOTOS RESTAURANTE ---
class FotoRestauranteListCreateView(ListCreateAPIView):
    queryset = FotoRestaurante.objects.all()
    serializer_class = FotoRestauranteSerializer

class FotoRestauranteDetailView(RetrieveUpdateDestroyAPIView):
    queryset = FotoRestaurante.objects.all()
    serializer_class = FotoRestauranteSerializer

# --- CATEGORIA MENÚ ---
class CategoriaMenuListCreateView(ListCreateAPIView):
    queryset = CategoriaMenu.objects.all()
    serializer_class = CategoriaMenuSerializer

class CategoriaMenuDetailView(RetrieveUpdateDestroyAPIView):
    queryset = CategoriaMenu.objects.all()
    serializer_class = CategoriaMenuSerializer

# --- PLATILLOS ---
class PlatilloListCreateView(ListCreateAPIView):
    queryset = Platillo.objects.all()
    serializer_class = PlatilloSerializer

class PlatilloDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Platillo.objects.all()
    serializer_class = PlatilloSerializer

# --- PEDIDOS ---
class PedidoListCreateView(ListCreateAPIView):
    queryset = Pedido.objects.all()
    serializer_class = PedidoSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class PedidoDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Pedido.objects.all()
    serializer_class = PedidoSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

# --- DETALLE PEDIDO ---
class DetallePedidoListCreateView(ListCreateAPIView):
    queryset = DetallePedido.objects.all()
    serializer_class = DetallePedidoSerializer

class DetallePedidoDetailView(RetrieveUpdateDestroyAPIView):
    queryset = DetallePedido.objects.all()
    serializer_class = DetallePedidoSerializer

# --- RESEÑAS ---
class ResenaListCreateView(ListCreateAPIView):
    queryset = Resena.objects.all()
    serializer_class = ResenaSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class ResenaDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Resena.objects.all()
    serializer_class = ResenaSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

# --- FOTOS RESEÑA ---
class FotosResenaListCreateView(ListCreateAPIView):
    queryset = FotosResena.objects.all()
    serializer_class = FotosResenaSerializer

class FotosResenaDetailView(RetrieveUpdateDestroyAPIView):
    queryset = FotosResena.objects.all()
    serializer_class = FotosResenaSerializer

# --- CATEGORIA BLOG ---
class CategoriaBlogListCreateView(ListCreateAPIView):
    queryset = CategoriaBlog.objects.all()
    serializer_class = CategoriaBlogSerializer

class CategoriaBlogDetailView(RetrieveUpdateDestroyAPIView):
    queryset = CategoriaBlog.objects.all()
    serializer_class = CategoriaBlogSerializer

# --- ARTICULO BLOG ---
class ArticuloBlogListCreateView(ListCreateAPIView):
    queryset = ArticuloBlog.objects.all()
    serializer_class = ArticuloBlogSerializer

class ArticuloBlogDetailView(RetrieveUpdateDestroyAPIView):
    queryset = ArticuloBlog.objects.all()
    serializer_class = ArticuloBlogSerializer

# --- ETIQUETA ARTICULO ---
class EtiquetaArticuloListCreateView(ListCreateAPIView):
    queryset = EtiquetaArticulo.objects.all()
    serializer_class = EtiquetaArticuloSerializer

class EtiquetaArticuloDetailView(RetrieveUpdateDestroyAPIView):
    queryset = EtiquetaArticulo.objects.all()
    serializer_class = EtiquetaArticuloSerializer

# --- ARTICULO ETIQUETA ---
class ArticuloEtiquetaListCreateView(ListCreateAPIView):
    queryset = ArticuloEtiqueta.objects.all()
    serializer_class = ArticuloEtiquetaSerializer

class ArticuloEtiquetaDetailView(RetrieveUpdateDestroyAPIView):
    queryset = ArticuloEtiqueta.objects.all()
    serializer_class = ArticuloEtiquetaSerializer

# --- GALERÍA COMUNITARIA ---
class GaleriaComunitariaListCreateView(ListCreateAPIView):
    queryset = GaleriaComunitaria.objects.all()
    serializer_class = GaleriaComunitariaSerializer

class GaleriaComunitariaDetailView(RetrieveUpdateDestroyAPIView):
    queryset = GaleriaComunitaria.objects.all()
    serializer_class = GaleriaComunitariaSerializer

# --- COMENTARIOS GALERÍA ---
class ComentariosGaleriaListCreateView(ListCreateAPIView):
    queryset = ComentariosGaleria.objects.all()
    serializer_class = ComentariosGaleriaSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class ComentariosGaleriaDetailView(RetrieveUpdateDestroyAPIView):
    queryset = ComentariosGaleria.objects.all()
    serializer_class = ComentariosGaleriaSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

# --- LUGARES TURÍSTICOS ---
class LugaresTuristicosListCreateView(ListCreateAPIView):
    queryset = LugaresTuristicos.objects.all()
    serializer_class = LugaresTuristicosSerializer

class LugaresTuristicosDetailView(RetrieveUpdateDestroyAPIView):
    queryset = LugaresTuristicos.objects.all()
    serializer_class = LugaresTuristicosSerializer

# --- FOTOS LUGARES ---
class FotosLugaresListCreateView(ListCreateAPIView):
    queryset = FotosLugares.objects.all()
    serializer_class = FotosLugaresSerializer

class FotosLugaresDetailView(RetrieveUpdateDestroyAPIView):
    queryset = FotosLugares.objects.all()
    serializer_class = FotosLugaresSerializer

# --- MENSAJES CONTACTO ---
class MensajesContactoListCreateView(ListCreateAPIView):
    queryset = MensajesContacto.objects.all()
    serializer_class = MensajesContactoSerializer
    permission_classes = [AllowAny] 

class MensajesContactoDetailView(RetrieveUpdateDestroyAPIView):
    queryset = MensajesContacto.objects.all()
    serializer_class = MensajesContactoSerializer
    permission_classes = [IsAuthenticatedOrReadOnly] 

# --- REDES SOCIALES ---
class RedSocialListCreateView(ListCreateAPIView):
    queryset = RedSocial.objects.all()
    serializer_class = RedSocialSerializer
   
class RedSocialDetailView(RetrieveUpdateDestroyAPIView):
    queryset = RedSocial.objects.all()
    serializer_class = RedSocialSerializer

# --- RESTAURANTE-RED SOCIAL (Intermedia) ---
class RestauranteRedSocialListCreateView(ListCreateAPIView):
    queryset = RestauranteRedSocial.objects.all()
    serializer_class = RestauranteRedSocialSerializer

class RestauranteRedSocialDetailView(RetrieveUpdateDestroyAPIView):
    queryset = RestauranteRedSocial.objects.all()
    serializer_class = RestauranteRedSocialSerializer

# --- REGISTRO COMBINADO RESTAURANTE ---
class RestauranteRegistrationView(CreateAPIView):
    """
    Vista para el registro combinado de un PerfilUsuario (Admin Restaurante) 
    y su Restaurante asociado.
    """
    serializer_class = RestauranteRegistrationSerializer
    permission_classes = [AllowAny] 
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # La función create del serializer devuelve un diccionario con 'user' y 'restaurante'
        data = serializer.save()
        user = data['user']
        restaurante = data['restaurante']
        
        # Preparamos una respuesta informativa para el frontend
        respuesta = {
            'mensaje': 'Registro de restaurante y propietario exitoso.',
            'restaurante': {
                'id': restaurante.id,
                'nombre': restaurante.nombre_restaurante,
                'direccion': restaurante.direccion,
            },
            'propietario': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'role': 'Admin Restaurante'
            }
        }
        return Response(respuesta, status=status.HTTP_201_CREATED)