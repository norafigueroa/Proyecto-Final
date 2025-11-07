from django.db import models
from django.contrib.auth.models import AbstractUser

# USUARIOS
class PerfilUsuario(AbstractUser):
    telefono = models.CharField(max_length=15, blank=True, null=True)
    foto_perfil = models.URLField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"Perfil de {self.username}"

# CATEGORIAS
class Categoria(models.Model):
    nombre_categoria = models.CharField(max_length=100, unique=True)
    descripcion = models.CharField(max_length=255, blank=True, null=True)
    icono = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return self.nombre_categoria


# RESTAURANTES
class Restaurante(models.Model):
    ESTADO_CHOICES = [
        ('activo', 'Activo'),
        ('pendiente', 'Pendiente'),
        ('inactivo', 'Inactivo'),
    ]

    usuario_propietario = models.ForeignKey(User, on_delete=models.CASCADE)
    categoria = models.ForeignKey(Categoria, on_delete=models.SET_NULL, null=True, blank=True)
    nombre_restaurante = models.CharField(max_length=120, unique=True)
    descripcion = models.CharField(max_length=255, blank=True, null=True)
    historia_negocio = models.CharField(max_length=255, blank=True, null=True)
    direccion = models.CharField(max_length=255)
    longitud = models.DecimalField(max_digits=10, decimal_places=6, null=True, blank=True)
    latitud = models.DecimalField(max_digits=10, decimal_places=6, null=True, blank=True)
    telefono = models.CharField(max_length=15, blank=True, null=True)
    email = models.EmailField(unique=True, blank=True, null=True)
    redes_sociales = models.CharField(max_length=255, blank=True, null=True)
    sitio_web = models.URLField(max_length=150, blank=True, null=True)
    horario_apertura = models.TimeField(blank=True, null=True)
    horario_cierre = models.TimeField(blank=True, null=True)
    dias_operacion = models.CharField(max_length=100, blank=True, null=True)
    logo = models.URLField(max_length=255, blank=True, null=True)
    foto_portada = models.URLField(max_length=255, blank=True, null=True)
    calificacion_promedio = models.DecimalField(max_digits=3, decimal_places=2, default=0.00)
    total_resenas = models.IntegerField(default=0)
    estado = models.CharField(max_length=10, choices=ESTADO_CHOICES, default='pendiente')
    verificado = models.BooleanField(default=False)
    fecha_registro = models.DateTimeField(auto_now_add=True)
    fecha_ultima_actualizacion = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.nombre_restaurante


# CATEGORIAS_RESTAURANTE
class CategoriaRestaurante(models.Model):
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE, related_name='categoria_restaurante')
    restaurante = models.ForeignKey(Restaurante, on_delete=models.CASCADE, related_name='categoria_restaurante')

    class Meta:
        unique_together = ('categoria', 'restaurante')

    def __str__(self):
        return f"{self.categoria.nombre_categoria} - {self.restaurante.nombre_restaurante}"


# FOTOS_RESTAURANTE
class FotoRestaurante(models.Model):
    restaurante = models.ForeignKey(Restaurante, on_delete=models.CASCADE, related_name='fotos')
    url_foto = models.CharField(max_length=255)
    descripcion = models.CharField(max_length=255, blank=True, null=True)
    fecha_subida = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Foto de {self.restaurante.nombre_restaurante}"


# CATEGORIAS_MENU
class CategoriaMenu(models.Model):
    nombre_categoria = models.CharField(max_length=100, unique=True)
    descripcion = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.nombre_categoria


# PLATILLOS
class Platillo(models.Model):
    restaurante = models.ForeignKey(Restaurante, on_delete=models.CASCADE, related_name='platillos')
    categoria_menu = models.ForeignKey(CategoriaMenu, on_delete=models.CASCADE, related_name='platillos')
    nombre_platillo = models.CharField(max_length=120, unique=True)
    descripcion = models.CharField(max_length=255, blank=True, null=True)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    tiempo_preparacion = models.IntegerField(blank=True, null=True)
    disponible = models.BooleanField(default=True)
    es_especial_dia = models.BooleanField(default=False)
    foto = models.CharField(max_length=255, blank=True, null=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    numero_orden = models.IntegerField(blank=True, null=True)
    promocion = models.BooleanField(default=False)
    porcentaje = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)

    def __str__(self):
        return self.nombre_platillo


# PEDIDOS
class Pedido(models.Model):
    ESTADO_CHOICES = [
        ('pendiente', 'Pendiente'),
        ('en_proceso', 'En proceso'),
        ('entregado', 'Entregado'),
        ('cancelado', 'Cancelado'),
    ]

    METODO_PAGO_CHOICES = [
        ('efectivo', 'Efectivo'),
        ('tarjeta', 'Tarjeta'),
        ('sinpe', 'SINPE Móvil'),
        ('transferencia', 'Transferencia'),
    ]

    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='pedidos')
    restaurante = models.ForeignKey(Restaurante, on_delete=models.CASCADE, related_name='pedidos')
    fecha_pedido = models.DateTimeField(auto_now_add=True)
    estado_pedido = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='pendiente')
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    notas_especiales = models.CharField(max_length=255, blank=True, null=True)
    metodo_pago = models.CharField(max_length=20, choices=METODO_PAGO_CHOICES)

    def __str__(self):
        return f"Pedido #{self.id} - {self.usuario.username}"


# DETALLE_PEDIDO
class DetallePedido(models.Model):
    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE, related_name='detalles')
    platillo = models.ForeignKey(Platillo, on_delete=models.CASCADE, related_name='detalles')
    cantidad = models.IntegerField(default=1)
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.cantidad}x {self.platillo.nombre_platillo} - Pedido #{self.pedido.id}"


# RESEÑAS
class Resena(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    restaurante = models.ForeignKey(Restaurante, on_delete=models.CASCADE)
    calificacion = models.IntegerField()
    comentario = models.CharField(max_length=255, blank=True, null=True)
    fecha_resena = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Reseña de {self.usuario.username} para {self.restaurante.nombre_restaurante}"


# FOTOS_RESEÑAS
class FotosResena(models.Model):
    resena = models.ForeignKey(Resena, on_delete=models.CASCADE)
    url_foto = models.CharField(max_length=255)
    fecha_subida = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Foto reseña {self.resena.id}"


# BLOG: CATEGORÍAS
class CategoriaBlog(models.Model):
    nombre_categoria = models.CharField(max_length=100, unique=True)
    descripcion = models.CharField(max_length=255, blank=True, null=True)
    icono = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return self.nombre_categoria


# ARTÍCULOS BLOG
class ArticuloBlog(models.Model):
    ESTADOS = [
        ('borrador', 'Borrador'),
        ('publicado', 'Publicado'),
        ('inactivo', 'Inactivo'),
    ]

    autor = models.ForeignKey(User, on_delete=models.CASCADE)
    categoria_blog = models.ForeignKey(CategoriaBlog, on_delete=models.CASCADE)
    titulo = models.CharField(max_length=150, unique=True)
    contenido = models.TextField()
    resumen = models.CharField(max_length=255, blank=True, null=True)
    imagen_portada = models.CharField(max_length=255, blank=True, null=True)
    fecha_publicacion = models.DateTimeField(auto_now_add=True)
    vistas = models.IntegerField(default=0)
    estado = models.CharField(max_length=15, choices=ESTADOS, default='borrador')
    destacado = models.BooleanField(default=False)

    def __str__(self):
        return self.titulo


# ETIQUETAS BLOG
class EtiquetaArticulo(models.Model):
    nombre_etiqueta = models.CharField(max_length=80, unique=True)

    def __str__(self):
        return self.nombre_etiqueta


# ARTÍCULO_ETIQUETA
class ArticuloEtiqueta(models.Model):
    articulo = models.ForeignKey(ArticuloBlog, on_delete=models.CASCADE)
    etiqueta = models.ForeignKey(EtiquetaArticulo, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('articulo', 'etiqueta')

    def __str__(self):
        return f"{self.articulo} - {self.etiqueta}"


# GALERÍA COMUNITARIA
class GaleriaComunitaria(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    titulo = models.CharField(max_length=100)
    descripcion = models.CharField(max_length=255, blank=True, null=True)
    url_foto = models.CharField(max_length=255)
    fecha_subida = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.titulo


# COMENTARIOS GALERÍA
class ComentariosGaleria(models.Model):
    foto_galeria = models.ForeignKey(GaleriaComunitaria, on_delete=models.CASCADE)
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    comentario = models.CharField(max_length=255)
    fecha_comentario = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comentario de {self.usuario.username} en {self.foto_galeria}"


# LUGARES TURÍSTICOS
class LugaresTuristicos(models.Model):
    nombre_lugar = models.CharField(max_length=120, unique=True)
    descripcion = models.CharField(max_length=255, blank=True, null=True)
    longitud = models.DecimalField(max_digits=10, decimal_places=6, blank=True, null=True)
    latitud = models.DecimalField(max_digits=10, decimal_places=6, blank=True, null=True)
    imagen_principal = models.CharField(max_length=255, blank=True, null=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nombre_lugar


# FOTOS_LUGARES
class FotosLugares(models.Model):
    lugar = models.ForeignKey(LugaresTuristicos, on_delete=models.CASCADE)
    url_foto = models.CharField(max_length=255)
    descripcion = models.CharField(max_length=255, blank=True, null=True)
    fecha_subida = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Foto de {self.lugar}"


# MENSAJES_CONTACTO
class MensajesContacto(models.Model):
    nombre = models.CharField(max_length=100)
    correo = models.EmailField(max_length=120)
    telefono = models.CharField(max_length=15, blank=True, null=True)
    asunto = models.CharField(max_length=120)
    mensaje = models.TextField()
    fecha_envio = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Mensaje de {self.nombre} - {self.asunto}"
