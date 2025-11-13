export const recipes = [
  {
    title: 'Espagueti al pomodoro',
    slug: 'espagueti-al-pomodoro',
    description: 'Receta clasica italiana con salsa de tomate fresca, albahaca y un toque de queso parmesano rallado.',
    cuisine: 'Italiana',
    course: 'Principal',
    difficulty: 'easy',
    servings: 4,
    prepTimeMinutes: 15,
    cookTimeMinutes: 20,
    tags: ['pasta', 'vegetariano', 'rapido'],
    ingredients: [
      { name: 'Pasta espagueti', quantity: 400, unit: 'g' },
      { name: 'Tomate', quantity: 6, unit: 'unidad', notes: 'maduro' },
      { name: 'Ajo', quantity: 3, unit: 'diente' },
      { name: 'Aceite de oliva virgen extra', quantity: 3, unit: 'cda' },
      { name: 'Albahaca fresca', quantity: 12, unit: 'hoja' },
      { name: 'Sal marina', quantity: 1, unit: 'cdita' },
      { name: 'Pimienta negra molida', quantity: 0.5, unit: 'cdita' },
      { name: 'Queso parmesano', quantity: 40, unit: 'g', notes: 'rallado' }
    ],
    instructions: [
      'Cocer la pasta en agua con sal hasta que quede al dente.',
      'Sofreir el ajo laminado en aceite de oliva sin que se dore en exceso.',
      'Agregar el tomate picado, salpimentar y cocinar 10 minutos hasta obtener salsa.',
      'Mezclar la pasta escurrida con la salsa y hojas de albahaca troceadas.',
      'Servir con queso parmesano rallado y un hilo de aceite crudo.'
    ],
    tips: [
      'Reserva un cazo del agua de coccion para ajustar la textura de la salsa.',
      'Agrega la albahaca al final para mantener el aroma fresco.'
    ],
    nutrition: {
      calories: 520,
      protein: 18,
      carbs: 72,
      fat: 18,
      fiber: 6,
      sugar: 9
    },
    imageUrl: 'https://images.cookingmama.dev/recipes/espagueti-pomodoro.jpg',
    source: 'Recetario de la Nonna'
  },
  {
    title: 'Pollo al limon y ajo con hierbas',
    slug: 'pollo-al-limon-y-ajo',
    description: 'Pechugas de pollo marinadas en limon, ajo y albahaca, horneadas hasta quedar jugosas.',
    cuisine: 'Mediterranea',
    course: 'Principal',
    difficulty: 'easy',
    servings: 4,
    prepTimeMinutes: 20,
    cookTimeMinutes: 25,
    tags: ['pollo', 'horneado', 'sin-gluten'],
    ingredients: [
      { name: 'Pechuga de pollo', quantity: 4, unit: 'unidad' },
      { name: 'Limon', quantity: 2, unit: 'unidad', notes: 'zumo y ralladura' },
      { name: 'Ajo', quantity: 4, unit: 'diente', notes: 'picado fino' },
      { name: 'Aceite de oliva virgen extra', quantity: 2, unit: 'cda' },
      { name: 'Mantequilla', quantity: 30, unit: 'g', optional: true },
      { name: 'Albahaca fresca', quantity: 10, unit: 'hoja', notes: 'picada' },
      { name: 'Sal marina', quantity: 1, unit: 'cdita' },
      { name: 'Pimienta negra molida', quantity: 0.5, unit: 'cdita' }
    ],
    instructions: [
      'Precalentar el horno a 200 °C.',
      'Mezclar el zumo de limon, la ralladura, el ajo, el aceite y la albahaca.',
      'Marinar las pechugas con la mezcla al menos 15 minutos.',
      'Colocar en bandeja, salar, añadir mantequilla en trocitos y hornear 20-25 minutos.',
      'Servir con el jugo de coccion por encima.'
    ],
    tips: [
      'Pincha la pechuga y si los jugos salen claros esta lista.',
      'Acompaña con verduras asadas o arroz blanco.'
    ],
    nutrition: {
      calories: 280,
      protein: 32,
      carbs: 3,
      fat: 14,
      fiber: 1,
      sugar: 1
    },
    imageUrl: 'https://images.cookingmama.dev/recipes/pollo-limon-ajo.jpg',
    source: 'Cuaderno familiar'
  },
  {
    title: 'Sopa rustica de verduras y garbanzos',
    slug: 'sopa-verduras-garbanzos',
    description: 'Sopa espesa con garbanzos, tomate y verduras de temporada, perfecta para dias frios.',
    cuisine: 'Mediterranea',
    course: 'Sopa',
    difficulty: 'easy',
    servings: 6,
    prepTimeMinutes: 15,
    cookTimeMinutes: 35,
    tags: ['sopa', 'legumbres', 'comfort-food'],
    ingredients: [
      { name: 'Aceite de oliva virgen extra', quantity: 2, unit: 'cda' },
      { name: 'Cebolla', quantity: 1, unit: 'unidad', notes: 'picada' },
      { name: 'Ajo', quantity: 3, unit: 'diente', notes: 'picado' },
      { name: 'Zanahoria', quantity: 2, unit: 'unidad', notes: 'en cubos' },
      { name: 'Apio', quantity: 2, unit: 'tallo', notes: 'en cubos' },
      { name: 'Pimiento rojo', quantity: 1, unit: 'unidad', notes: 'en tiras' },
      { name: 'Tomate', quantity: 4, unit: 'unidad', notes: 'pelados y picados' },
      { name: 'Garbanzos cocidos', quantity: 400, unit: 'g' },
      { name: 'Caldo de pollo', quantity: 1.5, unit: 'l' },
      { name: 'Sal marina', quantity: 1, unit: 'cdita' },
      { name: 'Pimienta negra molida', quantity: 0.5, unit: 'cdita' }
    ],
    instructions: [
      'Sofreir cebolla, ajo, zanahoria, apio y pimiento durante 8 minutos.',
      'Agregar el tomate y cocinar 5 minutos mas para que se deshaga.',
      'Incorporar garbanzos y caldo, llevar a ebullicion y bajar el fuego.',
      'Cocinar 20 minutos, salpimentar y servir caliente.'
    ],
    tips: [
      'Anade un chorrito de aceite crudo al servir para potenciar el sabor.',
      'Puedes triturar parte de la sopa para darle mas cuerpo.'
    ],
    nutrition: {
      calories: 210,
      protein: 9,
      carbs: 28,
      fat: 8,
      fiber: 7,
      sugar: 9
    },
    imageUrl: 'https://images.cookingmama.dev/recipes/sopa-verduras-garbanzos.jpg',
    source: 'Blog Cocina de Mercado'
  },
  {
    title: 'Paella mediterranea de mar y tierra',
    slug: 'paella-mediterranea',
    description: 'Paella sencilla con gambas, chorizo y verduras, lista en menos de una hora.',
    cuisine: 'Espanola',
    course: 'Principal',
    difficulty: 'medium',
    servings: 5,
    prepTimeMinutes: 20,
    cookTimeMinutes: 35,
    tags: ['arroz', 'mariscos', 'mediterranea'],
    ingredients: [
      { name: 'Aceite de oliva virgen extra', quantity: 3, unit: 'cda' },
      { name: 'Ajo', quantity: 3, unit: 'diente', notes: 'picado' },
      { name: 'Pimiento rojo', quantity: 1, unit: 'unidad', notes: 'en tiras' },
      { name: 'Tomate', quantity: 2, unit: 'unidad', notes: 'rallado' },
      { name: 'Chorizo curado', quantity: 120, unit: 'g', notes: 'en rodajas' },
      { name: 'Arroz bomba', quantity: 350, unit: 'g' },
      { name: 'Caldo de pollo', quantity: 900, unit: 'ml' },
      { name: 'Gambas', quantity: 200, unit: 'g', notes: 'peladas' },
      { name: 'Guisantes', quantity: 120, unit: 'g' },
      { name: 'Sal marina', quantity: 1, unit: 'cdita' },
      { name: 'Pimienta negra molida', quantity: 0.5, unit: 'cdita' }
    ],
    instructions: [
      'Calentar el aceite en paellera y sofreir ajo, pimiento y tomate 5 minutos.',
      'Agregar el chorizo, saltear 2 minutos y anadir el arroz mezclando bien.',
      'Verter caldo caliente, rectificar de sal y cocinar 10 minutos a fuego medio.',
      'Agregar gambas y guisantes, cocinar 8 minutos mas sin remover.',
      'Reposar 5 minutos tapado con un pano antes de servir.'
    ],
    tips: [
      'No remuevas el arroz en los ultimos minutos para lograr socarrat.',
      'Utiliza caldo caliente para no cortar la coccion.'
    ],
    nutrition: {
      calories: 560,
      protein: 28,
      carbs: 70,
      fat: 18,
      fiber: 5,
      sugar: 6
    },
    imageUrl: 'https://images.cookingmama.dev/recipes/paella-mediterranea.jpg',
    source: 'Recetario de la familia Costa'
  },
  {
    title: 'Salteado oriental de pollo y verduras',
    slug: 'salteado-oriental-pollo',
    description: 'Salteado rapido con pollo, verduras crujientes, salsa de soja y jengibre fresco.',
    cuisine: 'Asiatica',
    course: 'Principal',
    difficulty: 'medium',
    servings: 3,
    prepTimeMinutes: 15,
    cookTimeMinutes: 12,
    tags: ['wok', 'rapido', 'alto-proteina'],
    ingredients: [
      { name: 'Pechuga de pollo', quantity: 2, unit: 'unidad', notes: 'en tiras finas' },
      { name: 'Aceite de oliva virgen extra', quantity: 2, unit: 'cda' },
      { name: 'Ajo', quantity: 2, unit: 'diente', notes: 'picado' },
      { name: 'Jengibre', quantity: 20, unit: 'g', notes: 'rallado' },
      { name: 'Pimiento rojo', quantity: 1, unit: 'unidad', notes: 'en bastones' },
      { name: 'Zanahoria', quantity: 1, unit: 'unidad', notes: 'en bastones' },
      { name: 'Guisantes', quantity: 80, unit: 'g' },
      { name: 'Salsa de soja', quantity: 3, unit: 'cda' },
      { name: 'Cilantro fresco', quantity: 6, unit: 'ramita', notes: 'picado' },
      { name: 'Sal marina', quantity: 0.5, unit: 'cdita', optional: true },
      { name: 'Pimienta negra molida', quantity: 0.5, unit: 'cdita' }
    ],
    instructions: [
      'Calentar el aceite en wok y dorar el pollo salpimentado 3 minutos, retirar.',
      'En el mismo wok sofreir ajo y jengibre 30 segundos.',
      'Agregar pimiento, zanahoria y guisantes, saltear 4 minutos a fuego alto.',
      'Devolver el pollo, sumar la salsa de soja y cocinar 2 minutos.',
      'Servir con cilantro fresco picado.'
    ],
    tips: [
      'No sobrecargues el wok para mantener la temperatura alta.',
      'Sirve con arroz blanco o fideos salteados.'
    ],
    nutrition: {
      calories: 340,
      protein: 34,
      carbs: 18,
      fat: 14,
      fiber: 4,
      sugar: 7
    },
    imageUrl: 'https://images.cookingmama.dev/recipes/salteado-oriental-pollo.jpg',
    source: 'Street Food Notes'
  },
  {
    title: 'Ensalada tibia de quinua y espinacas',
    slug: 'ensalada-quinua-espinacas',
    description: 'Ensalada templada con quinua, espinaca fresca, tomate y vinagreta de limon.',
    cuisine: 'Fusion',
    course: 'Principal',
    difficulty: 'easy',
    servings: 4,
    prepTimeMinutes: 15,
    cookTimeMinutes: 20,
    tags: ['ensalada', 'superfoods', 'vegano'],
    ingredients: [
      { name: 'Quinua', quantity: 250, unit: 'g' },
      { name: 'Caldo de pollo', quantity: 600, unit: 'ml', notes: 'o caldo vegetal' },
      { name: 'Espinaca fresca', quantity: 150, unit: 'g' },
      { name: 'Tomate', quantity: 2, unit: 'unidad', notes: 'en cubos' },
      { name: 'Cebolla', quantity: 0.5, unit: 'unidad', notes: 'morada, picada finamente' },
      { name: 'Cilantro fresco', quantity: 4, unit: 'ramita', notes: 'picado' },
      { name: 'Limon', quantity: 1, unit: 'unidad', notes: 'zumo' },
      { name: 'Aceite de oliva virgen extra', quantity: 3, unit: 'cda' },
      { name: 'Sal marina', quantity: 0.75, unit: 'cdita' },
      { name: 'Pimienta negra molida', quantity: 0.5, unit: 'cdita' }
    ],
    instructions: [
      'Enjuagar la quinua y cocerla en caldo durante 15 minutos, dejar reposar.',
      'Saltear brevemente la espinaca en una sartén con media cucharada de aceite.',
      'Mezclar la quinua tibia con tomate, cebolla, espinaca y cilantro.',
      'Preparar vinagreta con limon, aceite restante, sal y pimienta y aliñar.'
    ],
    tips: [
      'Tuesta la quinua en seco antes de cocerla para potenciar el sabor.',
      'Sirve templada o fria al dia siguiente.'
    ],
    nutrition: {
      calories: 310,
      protein: 11,
      carbs: 40,
      fat: 12,
      fiber: 6,
      sugar: 5
    },
    imageUrl: 'https://images.cookingmama.dev/recipes/ensalada-quinua-espinacas.jpg',
    source: 'Revista Comer Sano'
  },
  {
    title: 'Curry suave de garbanzos y tomate',
    slug: 'curry-garbanzos-tomate',
    description: 'Garbanzos estofados en salsa de tomate aromatizada con jengibre, ajo y comino.',
    cuisine: 'Fusion',
    course: 'Principal',
    difficulty: 'easy',
    servings: 4,
    prepTimeMinutes: 10,
    cookTimeMinutes: 25,
    tags: ['vegano', 'picante-suave', 'legumbres'],
    ingredients: [
      { name: 'Aceite de oliva virgen extra', quantity: 2, unit: 'cda' },
      { name: 'Cebolla', quantity: 1, unit: 'unidad', notes: 'picada' },
      { name: 'Ajo', quantity: 3, unit: 'diente', notes: 'picado' },
      { name: 'Jengibre', quantity: 15, unit: 'g', notes: 'rallado' },
      { name: 'Comino molido', quantity: 1, unit: 'cdita' },
      { name: 'Tomate', quantity: 4, unit: 'unidad', notes: 'en cubos' },
      { name: 'Garbanzos cocidos', quantity: 400, unit: 'g' },
      { name: 'Caldo de pollo', quantity: 250, unit: 'ml', notes: 'o agua' },
      { name: 'Sal marina', quantity: 0.75, unit: 'cdita' },
      { name: 'Pimienta negra molida', quantity: 0.25, unit: 'cdita' },
      { name: 'Cilantro fresco', quantity: 6, unit: 'ramita', notes: 'hojas para decorar' },
      { name: 'Limon', quantity: 0.5, unit: 'unidad', notes: 'para servir' }
    ],
    instructions: [
      'Rehogar cebolla, ajo y jengibre en aceite 5 minutos.',
      'Anadir comino y tostar 30 segundos.',
      'Agregar tomate, cocinar 8 minutos y sumar garbanzos y caldo.',
      'Cocinar 10 minutos a fuego medio hasta espesar, salpimentar.',
      'Servir con cilantro fresco y gotas de limon.'
    ],
    tips: [
      'Si prefieres mas cremosidad, tritura una parte de los garbanzos.',
      'Acompana con arroz blanco o pan plano.'
    ],
    nutrition: {
      calories: 290,
      protein: 11,
      carbs: 35,
      fat: 12,
      fiber: 9,
      sugar: 9
    },
    imageUrl: 'https://images.cookingmama.dev/recipes/curry-garbanzos.jpg',
    source: 'Recetas sin prisa'
  },
  {
    title: 'Crema de champinones y cebolla caramelizada',
    slug: 'crema-champinones-cebolla',
    description: 'Sopa cremosa con champinones salteados, base de cebolla y toque de mantequilla.',
    cuisine: 'Internacional',
    course: 'Sopa',
    difficulty: 'medium',
    servings: 4,
    prepTimeMinutes: 15,
    cookTimeMinutes: 30,
    tags: ['sopa', 'vegetariano', 'cremoso'],
    ingredients: [
      { name: 'Mantequilla', quantity: 40, unit: 'g' },
      { name: 'Aceite de oliva virgen extra', quantity: 1, unit: 'cda' },
      { name: 'Cebolla', quantity: 1, unit: 'unidad', notes: 'en juliana' },
      { name: 'Ajo', quantity: 2, unit: 'diente', notes: 'picado' },
      { name: 'Champinones', quantity: 400, unit: 'g', notes: 'en laminas' },
      { name: 'Harina de trigo', quantity: 1.5, unit: 'cda' },
      { name: 'Caldo de pollo', quantity: 800, unit: 'ml' },
      { name: 'Leche entera', quantity: 200, unit: 'ml' },
      { name: 'Sal marina', quantity: 1, unit: 'cdita' },
      { name: 'Pimienta negra molida', quantity: 0.5, unit: 'cdita' }
    ],
    instructions: [
      'Derretir mantequilla con aceite y caramelizar la cebolla 10 minutos.',
      'Agregar ajo y champinones, saltear hasta que doren y reduzcan.',
      'Anadir harina, remover 1 minuto y verter caldo poco a poco.',
      'Cocinar 15 minutos, sumar leche y ajustar de sal y pimienta.',
      'Triturar parcialmente si se desea textura mas fina.'
    ],
    tips: [
      'Reserva algunos champinones dorados para decorar.',
      'Sustituye la leche por nata para una crema mas rica.'
    ],
    nutrition: {
      calories: 260,
      protein: 9,
      carbs: 18,
      fat: 17,
      fiber: 3,
      sugar: 8
    },
    imageUrl: 'https://images.cookingmama.dev/recipes/crema-champinones.jpg',
    source: 'Gastronomia Urbana'
  },
  {
    title: 'Tortitas de banana y miel',
    slug: 'tortitas-banana-miel',
    description: 'Pancakes esponjosos endulzados naturalmente con banana y miel.',
    cuisine: 'Desayuno',
    course: 'Desayuno',
    difficulty: 'easy',
    servings: 3,
    prepTimeMinutes: 10,
    cookTimeMinutes: 15,
    tags: ['desayuno', 'dulce', 'sin-refinados'],
    ingredients: [
      { name: 'Banana', quantity: 2, unit: 'unidad', notes: 'maduras' },
      { name: 'Huevo', quantity: 2, unit: 'unidad' },
      { name: 'Harina de trigo', quantity: 120, unit: 'g' },
      { name: 'Leche entera', quantity: 180, unit: 'ml' },
      { name: 'Miel', quantity: 2, unit: 'cda' },
      { name: 'Mantequilla', quantity: 30, unit: 'g', notes: 'derretida' },
      { name: 'Sal marina', quantity: 0.25, unit: 'cdita' },
      { name: 'Aceite de oliva virgen extra', quantity: 1, unit: 'cda', notes: 'para la plancha', optional: true }
    ],
    instructions: [
      'Triturar las bananas con los huevos hasta obtener mezcla homogenea.',
      'Incorporar harina, sal y leche poco a poco, mezclar sin grumos.',
      'Agregar miel y mantequilla derretida, reposar 5 minutos.',
      'Cocinar porciones pequeñas en plancha engrasada 2 minutos por lado.',
      'Servir con miel extra y rodajas de banana.'
    ],
    tips: [
      'No mezcles en exceso para evitar tortitas densas.',
      'Puedes anadir canela molida al gusto.'
    ],
    nutrition: {
      calories: 310,
      protein: 9,
      carbs: 48,
      fat: 10,
      fiber: 3,
      sugar: 18
    },
    imageUrl: 'https://images.cookingmama.dev/recipes/tortitas-banana-miel.jpg',
    source: 'Brunch Lovers'
  },
  {
    title: 'Galletas crujientes de chocolate negro',
    slug: 'galletas-chocolate-negro',
    description: 'Galletas con bordes crujientes y centro suave, cargadas de chocolate 70%.',
    cuisine: 'Postre',
    course: 'Postre',
    difficulty: 'easy',
    servings: 24,
    prepTimeMinutes: 15,
    cookTimeMinutes: 12,
    tags: ['postre', 'chocolate', 'horneado'],
    ingredients: [
      { name: 'Harina de trigo', quantity: 220, unit: 'g' },
      { name: 'Mantequilla', quantity: 120, unit: 'g', notes: 'a temperatura ambiente' },
      { name: 'Azucar blanca', quantity: 150, unit: 'g' },
      { name: 'Huevo', quantity: 1, unit: 'unidad' },
      { name: 'Chocolate negro 70%', quantity: 150, unit: 'g', notes: 'picado' },
      { name: 'Sal marina', quantity: 0.5, unit: 'cdita' }
    ],
    instructions: [
      'Batir mantequilla con azucar hasta blanquear.',
      'Agregar huevo y mezclar, incorporar harina y sal tamizadas.',
      'Sumar el chocolate picado y mezclar justo hasta integrar.',
      'Formar bolas y colocarlas en bandeja, refrigerar 20 minutos.',
      'Hornear a 180 °C durante 12 minutos y enfriar en rejilla.'
    ],
    tips: [
      'Refrigera la masa para que las galletas mantengan la forma.',
      'Espolvorea sal en escamas al salir del horno para realzar el dulce.'
    ],
    nutrition: {
      calories: 140,
      protein: 2,
      carbs: 18,
      fat: 7,
      fiber: 1,
      sugar: 12
    },
    imageUrl: 'https://images.cookingmama.dev/recipes/galletas-chocolate.jpg',
    source: 'Sweet Tooth Magazine'
  },
  {
    title: 'Ensalada verde estilo caprese',
    slug: 'ensalada-verde-caprese',
    description: 'Version fresca de la caprese con espinaca, tomate, albahaca y lascas de parmesano.',
    cuisine: 'Italiana',
    course: 'Entrante',
    difficulty: 'easy',
    servings: 4,
    prepTimeMinutes: 10,
    cookTimeMinutes: 0,
    tags: ['ensalada', 'vegetariano', 'sin-coccion'],
    ingredients: [
      { name: 'Espinaca fresca', quantity: 120, unit: 'g' },
      { name: 'Tomate', quantity: 3, unit: 'unidad', notes: 'en rodajas' },
      { name: 'Albahaca fresca', quantity: 16, unit: 'hoja' },
      { name: 'Queso parmesano', quantity: 50, unit: 'g', notes: 'en lascas' },
      { name: 'Aceite de oliva virgen extra', quantity: 3, unit: 'cda' },
      { name: 'Limon', quantity: 0.5, unit: 'unidad', notes: 'zumo' },
      { name: 'Sal marina', quantity: 0.5, unit: 'cdita' },
      { name: 'Pimienta negra molida', quantity: 0.25, unit: 'cdita' }
    ],
    instructions: [
      'Disponer la espinaca como base en una fuente.',
      'Alternar rodajas de tomate y hojas de albahaca encima.',
      'Regar con aceite de oliva y zumo de limon.',
      'Agregar lascas de parmesano y sazonar con sal y pimienta.'
    ],
    tips: [
      'Utiliza tomates maduros pero firmes para un mejor corte.',
      'Agrega frutos secos tostados para mas textura.'
    ],
    nutrition: {
      calories: 210,
      protein: 9,
      carbs: 9,
      fat: 16,
      fiber: 3,
      sugar: 5
    },
    imageUrl: 'https://images.cookingmama.dev/recipes/ensalada-verde-caprese.jpg',
    source: 'Cocina Ligera'
  },
  {
    title: 'Caldo reconfortante de pollo y verduras',
    slug: 'caldo-pollo-verduras',
    description: 'Sopa ligera con caldo casero, pollo desmenuzado y pasta fina.',
    cuisine: 'Internacional',
    course: 'Sopa',
    difficulty: 'easy',
    servings: 6,
    prepTimeMinutes: 15,
    cookTimeMinutes: 35,
    tags: ['sopa', 'pollo', 'comfort-food'],
    ingredients: [
      { name: 'Caldo de pollo', quantity: 1.5, unit: 'l' },
      { name: 'Pechuga de pollo', quantity: 2, unit: 'unidad' },
      { name: 'Zanahoria', quantity: 2, unit: 'unidad', notes: 'en rodajas' },
      { name: 'Apio', quantity: 2, unit: 'tallo', notes: 'en rodajas' },
      { name: 'Cebolla', quantity: 1, unit: 'unidad', notes: 'picada' },
      { name: 'Ajo', quantity: 2, unit: 'diente', notes: 'picado' },
      { name: 'Pasta espagueti', quantity: 120, unit: 'g', notes: 'partida en piezas cortas' },
      { name: 'Aceite de oliva virgen extra', quantity: 1, unit: 'cda' },
      { name: 'Sal marina', quantity: 1, unit: 'cdita' },
      { name: 'Pimienta negra molida', quantity: 0.5, unit: 'cdita' },
      { name: 'Cilantro fresco', quantity: 4, unit: 'ramita', optional: true, notes: 'picado para servir' }
    ],
    instructions: [
      'Sofreir cebolla, ajo, zanahoria y apio con aceite 5 minutos.',
      'Agregar caldo y pechugas, llevar a ebullicion y cocinar 20 minutos.',
      'Retirar el pollo, desmenuzarlo y devolverlo a la olla.',
      'Anadir la pasta y cocinar 6 minutos, salpimentar y servir.',
      'Decorar con cilantro fresco si se desea.'
    ],
    tips: [
      'Espuma el caldo durante la coccion para un resultado mas limpio.',
      'Sustituye la pasta por arroz si prefieres.'
    ],
    nutrition: {
      calories: 260,
      protein: 22,
      carbs: 28,
      fat: 7,
      fiber: 3,
      sugar: 6
    },
    imageUrl: 'https://images.cookingmama.dev/recipes/caldo-pollo-verduras.jpg',
    source: 'Recetas de la abuela'
  }
];

