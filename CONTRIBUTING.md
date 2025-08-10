# 🤝 Contribuir al Proyecto

¡Gracias por tu interés en contribuir a la API de Clínica de Psicopedagogía! 

## 📋 Cómo Contribuir

### 1. Fork del Proyecto
- Haz fork del repositorio
- Clona tu fork localmente
- Configura el upstream remote

### 2. Crear una Rama
```bash
git checkout -b feature/nueva-funcionalidad
# o
git checkout -b fix/correccion-bug
```

### 3. Realizar Cambios
- Mantén el código limpio y bien documentado
- Sigue las convenciones de nomenclatura existentes
- Agrega comentarios donde sea necesario

### 4. Probar los Cambios
```bash
# Ejecutar la aplicación
npm run dev

# Probar endpoints
node check-users.js
.\test-api.ps1
```

### 5. Commit y Push
```bash
git add .
git commit -m "feat: descripción clara del cambio"
git push origin feature/nueva-funcionalidad
```

### 6. Crear Pull Request
- Describe claramente los cambios realizados
- Incluye capturas de pantalla si es relevante
- Referencia issues relacionados

## 📝 Convenciones

### Commits
Usa el formato [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` nueva funcionalidad
- `fix:` corrección de bug
- `docs:` cambios en documentación
- `style:` cambios de formato
- `refactor:` refactorización de código
- `test:` agregar o modificar tests

### Código
- Usa nombres descriptivos para variables y funciones
- Mantén funciones pequeñas y enfocadas
- Agrega comentarios para lógica compleja
- Sigue la estructura MVC existente

## 🐛 Reportar Bugs

1. Verifica que el bug no haya sido reportado
2. Crea un issue con:
   - Descripción clara del problema
   - Pasos para reproducir
   - Comportamiento esperado vs actual
   - Información del entorno (OS, Node.js, MySQL)

## 💡 Sugerir Funcionalidades

1. Crea un issue describiendo:
   - La funcionalidad propuesta
   - Casos de uso
   - Beneficios para el proyecto

## ❓ Preguntas

Si tienes preguntas, puedes:
- Crear un issue con la etiqueta "question"
- Revisar la documentación existente
- Consultar ejemplos en `/examples`

¡Gracias por contribuir! 🎉