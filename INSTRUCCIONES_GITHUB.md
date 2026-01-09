# Guía de Actualización en GitHub

Esta guía explica cómo subir cambios a GitHub cuando actualices cualquiera de los dos proyectos.

## Pasos para actualizar cambios

Cuando hagas un cambio en una carpeta (por ejemplo, en `Tripe piramide final v2`), sigue estos pasos en tu terminal:

### 1. Preparar los archivos
Para indicarle a Git qué archivos quieres subir:
```bash
# Para subir TODO lo que hayas cambiado
git add .
```

### 2. Crear un mensaje de lo que hiciste (Commit)
Es importante poner un mensaje breve que explique el cambio:
```bash
git commit -m "Actualización de logos en Pirámide"
```

### 3. Subir a GitHub (Push)
Finalmente, envía los cambios a la nube:
```bash
git push origin main
```

---

## Preguntas Frecuentes

### ¿Puedo actualizar solo una carpeta?
¡Sí! Aunque el comando `git add .` añade todo lo nuevo, Git es inteligente y solo subirá las partes de la carpeta que realmente cambiaron. 

Si quieres ser **muy específico** y solo preparar una carpeta:
```bash
git add "Tripe piramide final v2/"
git commit -m "Se actualizó solo pirámide"
git push origin main
```

### ¿Cómo sé si tengo cambios pendientes?
Usa el comando:
```bash
git status
```
Este comando te mostrará en color rojo los archivos que has modificado y aún no has subido.

### ¿Qué pasa si cambio el index.html principal?
Sigue los mismos 3 pasos (`add`, `commit`, `push`). Git se encarga de sincronizarlo todo en tu repositorio de GitHub.
