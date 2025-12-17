from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView, ListAPIView, CreateAPIView, DestroyAPIView, UpdateAPIView, RetrieveAPIView, RetrieveUpdateAPIView
from .models import *
from .serializers import *
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import Group
from rest_framework.decorators import action
from rest_framework.views import APIView
from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework_simplejwt.authentication import JWTAuthentication
from .auth import CookieJWTAuthentication

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
    #permission_classes = [IsAuthenticatedOrReadOnly]

class RestauranteDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Restaurante.objects.all()
    serializer_class = RestauranteSerializer
    #permission_classes = [IsAuthenticatedOrReadOnly]

# --- HORARIOS ---

class HorarioListCreateView(ListCreateAPIView):
    queryset = HorarioRestaurante.objects.all()
    serializer_class = HorarioRestauranteSerializer


class HorarioDetailView(RetrieveUpdateDestroyAPIView):
    serializer_class = HorarioRestauranteSerializer
    lookup_field = 'restaurante_id'
    lookup_url_kwarg = 'restaurante_id'

    def get_queryset(self):
        restaurante_id = self.kwargs.get('restaurante_id')
        return HorarioRestaurante.objects.filter(restaurante_id=restaurante_id)   


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

    def get_queryset(self):
        queryset = super().get_queryset()
        restaurante_id = self.request.query_params.get("restaurante")

        if restaurante_id:
            queryset = queryset.filter(restaurante_id=restaurante_id)

        return queryset

class PlatilloDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Platillo.objects.all()
    serializer_class = PlatilloSerializer

class ActualizarPromocionPlatillo(UpdateAPIView):
    queryset = Platillo.objects.all()
    serializer_class = PlatilloSerializer    

# --- PEDIDOS ---
class PedidoListAdminView(ListAPIView):
    """
    Vista para que el admin de un restaurante vea solo sus pedidos.
    """
    serializer_class = PedidoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Obtiene el restaurante del usuario logueado
        restaurante_id = self.request.user.restaurante.id
        return Pedido.objects.filter(restaurante_id=restaurante_id).order_by('-fecha_pedido')

class PedidoListCreateView(ListCreateAPIView):
    queryset = Pedido.objects.all().order_by('-fecha_pedido')
    serializer_class = CrearPedidoSerializer
    #authentication_classes = [CookieJWTAuthentication]
    #permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Pedido.objects.filter(usuario=self.request.user).order_by('-fecha_pedido')

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)

class PedidoDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Pedido.objects.all()
    serializer_class = PedidoSerializer
    #permission_classes = [IsAuthenticatedOrReadOnly]

""" # --- DETALLE PEDIDO ---
class DetallePedidoListCreateView(ListCreateAPIView):
    queryset = DetallePedido.objects.all()
    serializer_class = DetallePedidoSerializer

class DetallePedidoDetailView(RetrieveUpdateDestroyAPIView):
    queryset = DetallePedido.objects.all()
    serializer_class = DetallePedidoSerializer """

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

class TestimonioListCreateView(ListCreateAPIView):
    queryset =Testimonio.objects.all()
    serializer_class = TestimonioSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        restaurante_id = self.request.query_params.get("restaurante")

        if restaurante_id:
            queryset = queryset.filter(restaurante_id=restaurante_id)

        return queryset

class TestimonioDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Testimonio.objects.all()
    serializer_class = TestimonioSerializer    

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
# 🔴 Lista de palabras ofensivas
PALABRAS_OFENSIVAS = [
    "idiota",
    "estupido",
    "estúpido",
    "tonto",
    "mierda",
    "puta",
    "pendejo",
    "imbecil",
    "imbécil",
]

class ComentariosGaleriaListCreateView(ListCreateAPIView):
    queryset = ComentariosGaleria.objects.all().order_by("-fecha_comentario")
    serializer_class = ComentariosGaleriaSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        texto = self.request.data.get("comentario", "").lower()

        # 🔎 Validación de lenguaje ofensivo
        for palabra in PALABRAS_OFENSIVAS:
            if palabra in texto:
                raise ValidationError({
                    "comentario": "Tu comentario contiene lenguaje ofensivo y no puede publicarse"
                })

        # ✅ Guardar comentario si pasa la validación
        serializer.save(usuario=self.request.user)

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
    queryset = MensajesContacto.objects.filter(archivado=False)
    serializer_class = MensajesContactoSerializer
    permission_classes = [AllowAny] 

class MensajesContactoDetailView(RetrieveUpdateDestroyAPIView):
    queryset = MensajesContacto.objects.all()
    serializer_class = MensajesContactoSerializer
    permission_classes = [AllowAny]
    
    def retrieve(self, request, *args, **kwargs):
        # Marcar como leído cuando se visualiza
        instance = self.get_object()
        instance.leido = True
        instance.save()
        return super().retrieve(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        # En lugar de eliminar, archivamos
        instance = self.get_object()
        instance.archivado = True
        instance.save()
        return Response({'mensaje': 'Mensaje archivado'}, status=status.HTTP_200_OK)
    
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
    
# --- CONFIGURACION ---   
class VistaConfiguracionPlataforma(RetrieveUpdateAPIView):
    """
    Vista para obtener y actualizar la configuración de la plataforma.
    Solo Admin General puede actualizar.
    GET: Cualquiera puede ver
    PUT/PATCH: Solo Admin General
    """
    serializer_class = SerializadorConfiguracionPlataforma
    
    def get_object(self):
        return ConfiguracionPlataforma.obtener_instancia()
    
    def get_permissions(self):
        # GET (retrieve) es público
        if self.request.method == 'GET':
            return []
        # PUT/PATCH solo para Admin General
        else:
            return [AllowAny()]
    
    def verificar_admin_general(self):
        """Verifica si el usuario es Admin General"""
        try:
            grupo_admin = Group.objects.get(name='Admin General')
            if grupo_admin not in self.request.user.groups.all():
                return False
            return True
        except Group.DoesNotExist:
            return False
    
    def update(self, request, *args, **kwargs):
        #if not self.verificar_admin_general():
        #    return Response(
        #        {'error': 'Solo Admin General puede actualizar la configuración'},
        #        status=status.HTTP_403_FORBIDDEN
        #    )
        return super().update(request, *args, **kwargs)
    
    def partial_update(self, request, *args, **kwargs):
        #if not self.verificar_admin_general():
        #    return Response(
        #        {'error': 'Solo Admin General puede actualizar la configuración'},
        #        status=status.HTTP_403_FORBIDDEN
        #    )
        return super().partial_update(request, *args, **kwargs)      

class CrearPedidoView(APIView):
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request):
        data = request.data
        items = data.get("items", [])

        if not items:
            return Response({"error": "El pedido no tiene platillos"}, status=400)

        restaurante_id = data.get("restaurante")
        subtotal = data.get("subtotal")
        total = data.get("total")
        metodo_pago = data.get("metodo_pago", "simulado")

        if not restaurante_id or subtotal is None or total is None:
            return Response({"error": "Faltan campos obligatorios"}, status=400)

        restaurante = get_object_or_404(Restaurante, id=restaurante_id)

        pedido = Pedido.objects.create(
            usuario=request.user,
            restaurante=restaurante,
            subtotal=subtotal,
            total=total,
            metodo_pago=metodo_pago,
            estado_pedido="pendiente"
        )

        for item in items:
            platillo_id = item.get("platillo")
            cantidad = item.get("cantidad")
            precio_unitario = item.get("precio_unitario")

            if not platillo_id or cantidad is None or precio_unitario is None:
                transaction.set_rollback(True)
                return Response({"error": "Item incompleto"}, status=400)

            platillo = get_object_or_404(Platillo, id=platillo_id)
            DetallePedido.objects.create(
                pedido=pedido,
                platillo=platillo,
                cantidad=cantidad,
                precio_unitario=precio_unitario,
                subtotal=cantidad * precio_unitario
            )

        return Response(
            {"pedido_id": pedido.id, "mensaje": "Pedido simulado correctamente"},
            status=201
        )

class PedidoListCreateView(ListCreateAPIView):
    queryset = Pedido.objects.all().order_by('-fecha_pedido')
    serializer_class = CrearPedidoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Solo devuelve los pedidos del usuario logueado
        return Pedido.objects.filter(usuario=self.request.user).order_by('-fecha_pedido')

    @transaction.atomic
    def perform_create(self, serializer):
        # Guardar pedido y detalles en una transacción
        serializer.save()
    