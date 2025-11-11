from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from .models import *
from .serializers import *

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

class RestauranteDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Restaurante.objects.all()
    serializer_class = RestauranteSerializer

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

class PedidoDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Pedido.objects.all()
    serializer_class = PedidoSerializer

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

class ResenaDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Resena.objects.all()
    serializer_class = ResenaSerializer

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

class ComentariosGaleriaDetailView(RetrieveUpdateDestroyAPIView):
    queryset = ComentariosGaleria.objects.all()
    serializer_class = ComentariosGaleriaSerializer

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

class MensajesContactoDetailView(RetrieveUpdateDestroyAPIView):
    queryset = MensajesContacto.objects.all()
    serializer_class = MensajesContactoSerializer

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
