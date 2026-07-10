# LiquidAR — Ideas de Diseño

## Enfoques Considerados

### Opción 1: Institucional Gubernamental
Inspirado en los portales oficiales del Estado argentino. Azul celeste y blanco, tipografía formal, tablas densas. Probabilidad: 0.04

### Opción 2: SaaS Profesional Moderno
Dashboard limpio con sidebar, colores neutros con acento verde esmeralda, tablas interactivas, cards con sombras suaves. Probabilidad: 0.07

### Opción 3: Herramienta Técnico-Contable Elegante ← ELEGIDA
Interfaz de alta precisión con estética de software financiero premium. Colores oscuros con acentos dorado/ámbar, tipografía técnica, sensación de "instrumento de precisión". Probabilidad: 0.03

---

## Diseño Elegido: Herramienta Técnico-Contable Elegante

### Design Movement
**Financial Precision Tool** — Inspirado en terminales Bloomberg, software de contabilidad premium y dashboards financieros de alto rendimiento. Combina la seriedad de una herramienta profesional con la elegancia de un producto SaaS moderno.

### Core Principles
1. **Precisión ante todo**: Cada número, cada campo, cada etiqueta debe ser perfectamente legible y sin ambigüedad.
2. **Jerarquía de información clara**: El usuario sabe en todo momento qué está viendo y qué sigue.
3. **Densidad funcional**: Mucha información en pantalla sin sentirse abrumado, gracias al espaciado estratégico.
4. **Confianza institucional**: El diseño transmite seriedad y exactitud, esencial para una herramienta de liquidación de sueldos.

### Color Philosophy
- **Fondo principal**: Blanco puro con secciones en gris muy claro (#F8F9FA) para separar áreas
- **Color primario**: Azul marino profundo `oklch(0.28 0.08 250)` — transmite confianza y profesionalismo
- **Acento dorado**: `oklch(0.72 0.15 85)` — para destacar totales, resultados clave y CTAs
- **Verde de confirmación**: `oklch(0.55 0.15 145)` — para valores positivos y éxito
- **Rojo de alerta**: `oklch(0.55 0.2 25)` — para deducciones y alertas
- **Texto principal**: Casi negro `oklch(0.15 0.01 250)` para máxima legibilidad

### Layout Paradigm
- **Sidebar izquierda fija** con navegación entre secciones del liquidador
- **Panel principal** dividido en dos columnas: formulario de entrada (izquierda) + resultados en tiempo real (derecha)
- **Recibo de sueldo** como panel expandible/modal con diseño de documento oficial
- Layout asimétrico 40/60 para el formulario/resultados

### Signature Elements
1. **Línea dorada de acento** en el header y separadores de sección
2. **Cards con borde izquierdo de color** para categorizar tipos de conceptos (remunerativos, no remunerativos, deducciones)
3. **Tipografía monoespaciada** para todos los valores numéricos (JetBrains Mono)

### Interaction Philosophy
- Cálculo en tiempo real mientras el usuario escribe (sin botón de calcular)
- Animaciones suaves al actualizar valores numéricos
- Tooltips informativos en cada concepto explicando qué es y cómo se calcula
- Transiciones fluidas entre secciones

### Animation
- Números que se actualizan con una transición de 150ms fade
- Cards que aparecen con stagger de 50ms
- Sidebar items con hover de 120ms ease-out
- Recibo de sueldo que se despliega con 300ms ease-out

### Typography System
- **Display/Headers**: `Sora` — geométrica, moderna, autoritaria
- **Body/Labels**: `DM Sans` — legible, profesional, no genérica
- **Números/Montos**: `JetBrains Mono` — precisión técnica, alineación perfecta
- Jerarquía: 32px título, 20px subtítulo, 16px body, 14px labels, 12px notas

### Brand Essence
**LiquidAR** — La herramienta de liquidación de sueldos más completa de Argentina, para contadores y RRHH que no toleran errores.
Personalidad: **Preciso. Confiable. Eficiente.**

### Brand Voice
- Directo y técnico, sin rodeos
- Ejemplo headline: "Liquidá cualquier CCT en segundos. Sin errores."
- Ejemplo CTA: "Calcular liquidación"
- Prohibido: "Bienvenido a nuestra plataforma", "Comenzar ahora"

### Wordmark & Logo
Símbolo: Signo de pesos estilizado con una línea diagonal de precisión, en dorado sobre fondo azul marino.

### Signature Brand Color
**Azul marino profundo** `oklch(0.28 0.08 250)` — inconfundiblemente LiquidAR.

---

## Style Decisions
- Usar JetBrains Mono para TODOS los valores monetarios sin excepción
- El recibo de sueldo imprimible debe verse como un documento oficial argentino
- Los tooltips de ayuda son obligatorios en todos los conceptos de liquidación
- El cálculo debe ser reactivo (onChange), nunca requerir click de "calcular"
- Las deducciones siempre en rojo, los haberes en verde oscuro
- Todos los badges/índices de CCT usan la paleta semántica: navy/gold para identidad, verde para haberes, rojo para deducciones. Sin paleta arcoíris decorativa.
- Las secciones de marketing deben parecer software financiero: tablas, registros indexados, fichas técnicas — no cards SaaS genéricas.
- Cualquier valor numérico, legal, CCT, porcentaje, salario o contribución debe aparecer en JetBrains Mono y tratarse como dato de precisión.
- Secciones de contenido con barra vertical gold izquierda como separador de sección.
