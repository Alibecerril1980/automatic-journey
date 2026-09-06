# Revisión del código base

## Alcance

El repositorio solo contiene este informe y un `README.md` con el nombre del
proyecto. No hay código fuente, manifiesto de dependencias, documentación de
comportamiento ni pruebas. Por ello, la revisión no puede atribuir defectos a
una implementación inexistente; las tareas siguientes distinguen los problemas
observables de los controles que quedarán pendientes hasta incorporar código.

## Tareas propuestas

### 1. Corregir un error tipográfico en el título

**Problema observable:** el encabezado visible usa `automatic-journey`, que es
el identificador técnico del repositorio, en vez de un nombre presentado como
título.

**Tarea:** cambiar el encabezado a `Automatic Journey` y mantener
`automatic-journey` solamente donde se necesite el identificador literal.
Agregar una comprobación ortográfica de Markdown para evitar regresiones.

**Criterio de aceptación:** el título se muestra con capitalización y espacios
propios de un nombre legible, y el corrector ortográfico no informa errores.

### 2. Corregir la falla de ausencia de una aplicación ejecutable

**Problema observable:** no existe un punto de entrada ni un manifiesto, de
modo que el repositorio no ofrece ningún comportamiento que se pueda ejecutar.

**Tarea:** acordar primero el lenguaje y el comportamiento mínimo esperado;
después, agregar el manifiesto, el punto de entrada y un comando documentado
que inicie la aplicación. El proceso debe terminar con un código distinto de
cero y un mensaje accionable cuando la configuración requerida sea inválida.

**Criterio de aceptación:** desde un clon limpio, el comando documentado instala
las dependencias y arranca la aplicación; una configuración inválida produce el
error especificado.

### 3. Corregir la discrepancia entre la documentación y el estado del proyecto

**Problema observable:** el `README.md` presenta un proyecto por nombre, pero
no aclara que todavía no existe una implementación ni describe requisitos,
instalación, uso o comportamiento esperado. Esto puede hacer que una persona
interprete un repositorio inicial como un proyecto utilizable.

**Tarea:** documentar explícitamente el estado del proyecto y, cuando se agregue
la implementación, sustituir esa advertencia por secciones de requisitos,
instalación, ejecución y ejemplos cuyos comandos se validen en integración
continua.

**Criterio de aceptación:** el `README.md` describe fielmente qué funciona hoy;
todos los comandos publicados se ejecutan con éxito desde un clon limpio.

### 4. Mejorar la cobertura con una prueba de humo

**Problema observable:** no hay suite de pruebas, por lo que ninguna futura
implementación tendrá protección automática frente a regresiones.

**Tarea:** junto con el primer punto de entrada, agregar una prueba de humo que
ejecute la aplicación como lo haría una persona usuaria y compruebe el código de
salida y la salida observable. Ejecutarla en integración continua y agregar un
caso de configuración inválida.

**Criterio de aceptación:** la prueba falla si el proceso no inicia, devuelve un
código incorrecto o cambia su contrato de salida, y se ejecuta automáticamente
en cada cambio propuesto.
