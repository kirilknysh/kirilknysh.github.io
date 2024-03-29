function getLimitClass(value, limits) {
  if (!Array.isArray(limits) || limits.length === 0) {
    return '';
  }

  if (value > limits[limits.length - 1]) {
    return '--high';
  }
  if (value <= limits[0]) {
    return '--low';
  }
  return '--moderate';
}

function createProductRow(product, limits) {
  const tr = document.createElement('tr');

  const tdName = document.createElement('td');
  tdName.classList.add('name-value');
  const tdNameDiv = document.createElement('div');
  tdNameDiv.textContent = product.name_en;
  tdName.appendChild(tdNameDiv);
  const tdSubNameDiv = document.createElement('div');
  tdSubNameDiv.classList.add('sub-name-value');
  tdSubNameDiv.textContent = [product.name_nl, product.name_ru].join(', ');
  tdName.appendChild(tdSubNameDiv);
  tr.appendChild(tdName);

  const tdGindex = document.createElement('td');
  tdGindex.classList.add('gi-value');
  tdGindex.classList.add(getLimitClass(product.gi, limits.gi));
  tdGindex.textContent = product.gi;
  tr.appendChild(tdGindex);

  const tdGload = document.createElement('td');
  tdGload.classList.add('gl-value');
  tdGload.classList.add(getLimitClass(product.gl, limits.gl));
  tdGload.textContent = product.gl;
  tr.appendChild(tdGload);

  return tr;
}

function filterByQuery(query, products, fuse) {
  let fuseResults = [];
  let showAll = true;
  if (query) {
    fuseResults = fuse.search(query);
    showAll = false;
  }
  const matchedIndexes = new Set(fuseResults.map((fuseResult) => fuseResult.refIndex))

  products.forEach((product, index) => {
    if (!product.rowNode) {
      return;
    }

    product.rowNode.classList.toggle('--hidden', !(showAll || matchedIndexes.has(index)));
  });
}

window.addEventListener('load', () => {
  const productsListContainer = document.querySelector('#products-list-container');
  if (!productsListContainer) {
    return console.error('cannot find products list container');
  }
  data.products.forEach((product) => {
    product.rowNode = createProductRow(product, data.limits);
    productsListContainer.appendChild(product.rowNode);
  });

  const fuse = new Fuse(data.products, {
    keys: ['name_en', 'name_nl', 'name_ru'],
    findAllMatches: true,
    shouldSort: false,
    threshold: 0.3,
  });
  function doFilter() {
    const query = new URL(window.location).searchParams.get('query') ?? '';
    filterByQuery(query, data.products, fuse);
  }
  const searchInput = document.querySelector('#search-input');
  if (searchInput) {
    searchInput.value = new URL(window.location).searchParams.get('query') ?? '';
    searchInput.addEventListener('input', (event) => {
      const url = new URL(window.location);
      url.searchParams.set('query', searchInput.value ?? '');
      window.history.pushState(null, '', url.toString());
      window.dispatchEvent(new CustomEvent('pushstate'));
    });
    window.addEventListener('popstate', () => {
      doFilter();
    });
    window.addEventListener('pushstate', () => {
      doFilter();
    });
  }

  doFilter();

  window.visualViewport.addEventListener('resize', () => {
    window.document.documentElement.style.height = `${window.visualViewport.height}px`;
    window.scrollTo(0, 0);
  });
});

const data = {
  limits: {
    gi: [55, 69],
    gl: [10, 19],
  },
  products: [ // a-z sorted by `name_en`
    {
      name_en: 'Almond',
      name_nl: 'Amandel',
      name_ru: 'Миндаль',
      gi: 0,
      gl: 0,
      rowNode: null
    },
    {
      name_en: 'Almond milk',
      name_nl: 'Amandelmelk',
      name_ru: 'Миндальное молоко',
      gi: 30,
      gl: 0,
      rowNode: null
    },
    {
      name_en: 'Apple green',
      name_nl: 'Appel groene',
      name_ru: 'Яблоко зеленое',
      gi: 38,
      gl: 5,
      rowNode: null
    },
    {
      name_en: 'Apple juice',
      name_nl: 'Appelsap',
      name_ru: 'Яблочный сок',
      gi: 41,
      gl: 11,
      rowNode: null
    },
    {
      name_en: 'Apple red',
      name_nl: 'Appel rode',
      name_ru: 'Яблоко красное',
      gi: 39,
      gl: 6,
      rowNode: null
    },
    {
      name_en: 'Apricot',
      name_nl: 'Abrikoos',
      name_ru: 'Абрикос',
      gi: 57,
      gl: 6,
      rowNode: null
    },
    {
      name_en: 'Artichoke',
      name_nl: 'Artisjok',
      name_ru: 'Артишок',
      gi: 15,
      gl: 1,
      rowNode: null
    },
    {
      name_en: 'Asparagus',
      name_nl: 'Asperge',
      name_ru: 'Спаржа',
      gi: 15,
      gl: 1,
      rowNode: null
    },
    {
      name_en: 'Avocado',
      name_nl: 'Avocado',
      name_ru: 'Авокадо',
      gi: 15,
      gl: 0,
      rowNode: null
    },
    {
      name_en: 'Baguette',
      name_nl: 'Stokbrood',
      name_ru: 'Багет',
      gi: 95,
      gl: 26,
      rowNode: null
    },
    {
      name_en: 'Baked potato',
      name_nl: 'Gebakken aardappel',
      name_ru: 'Картофель печеный',
      gi: 111,
      gl: 21,
      rowNode: null
    },
    {
      name_en: 'Banana',
      name_nl: 'Banaan',
      name_ru: 'Банан',
      gi: 48,
      gl: 11,
      rowNode: null
    },
    {
      name_en: 'Banana ripe',
      name_nl: 'Banaan rijpe',
      name_ru: 'Банан спелый',
      gi: 60,
      gl: 13.1,
      rowNode: null
    },
    {
      name_en: 'Basmati rice',
      name_nl: 'Basmatirijst',
      name_ru: 'Рис басмати',
      gi: 58,
      gl: 19,
      rowNode: null
    },
    {
      name_en: 'Beetroot',
      name_nl: 'Biet',
      name_ru: 'Свекла',
      gi: 61,
      gl: 5,
      rowNode: null
    },
    {
      name_en: 'Blueberry',
      name_nl: 'Blauwe bessen',
      name_ru: 'Черника / Голубика',
      gi: 25,
      gl: 2,
      rowNode: null
    },
    {
      name_en: 'Blackberry',
      name_nl: 'Bramen',
      name_ru: 'Ежевика',
      gi: 25,
      gl: 2,
      rowNode: null
    },
    {
      name_en: 'Blackcurrant',
      name_nl: 'Zwarte bes',
      name_ru: 'Черная смородина',
      gi: 35,
      gl: 7,
      rowNode: null
    },
    {
      name_en: 'Boiled broccoli',
      name_nl: 'Gekookte broccoli',
      name_ru: 'Брокколи отварная',
      gi: 10,
      gl: 0,
      rowNode: null
    },
    {
      name_en: 'Boiled corn',
      name_nl: 'Gekookte maïs',
      name_ru: 'Кукуруза вареная',
      gi: 46,
      gl: 12,
      rowNode: null
    },
    {
      name_en: 'Broccoli',
      name_nl: 'Broccoli',
      name_ru: 'Брокколи',
      gi: 10,
      gl: 0,
      rowNode: null
    },
    {
      name_en: 'Brown bread',
      name_nl: 'Bruinbrood',
      name_ru: 'Хлеб темный',
      gi: 55,
      gl: 15,
      rowNode: null
    },
    {
      name_en: 'Brown rice',
      name_nl: 'Bruine rijst',
      name_ru: 'Рис коричневый',
      gi: 50,
      gl: 16,
      rowNode: null
    },
    {
      name_en: 'Brussels sprouts',
      name_nl: 'Spruitjes',
      name_ru: 'Капуста брюссельская',
      gi: 15,
      gl: 1,
      rowNode: null
    },
    {
      name_en: 'Buckwheat',
      name_nl: 'Boekweit',
      name_ru: 'Гречка',
      gi: 49,
      gl: 11,
      rowNode: null
    },
    {
      name_en: 'Buckwheat bread',
      name_nl: 'Boekweitbrood',
      name_ru: 'Гречневый хлеб',
      gi: 45,
      gl: 12,
      rowNode: null
    },
    {
      name_en: 'Buckwheat flour',
      name_nl: 'Boekweitmeel',
      name_ru: 'Гречневая мука',
      gi: 50,
      gl: 45,
      rowNode: null
    },
    {
      name_en: 'Buckwheat pancake',
      name_nl: 'Boekweitpannenkoek',
      name_ru: 'Гречневый блин',
      gi: 50,
      gl: 30,
      rowNode: null
    },
    {
      name_en: 'Buckwheat pasta',
      name_nl: 'Boekweitpasta',
      name_ru: 'Гречневая паста',
      gi: 53,
      gl: 25,
      rowNode: null
    },
    {
      name_en: 'Buckwheat porridge',
      name_nl: 'Boekweitpap',
      name_ru: 'Гречневая каша',
      gi: 54,
      gl: 15,
      rowNode: null
    },
    {
      name_en: 'Bulgur',
      name_nl: 'Bulgur',
      name_ru: 'Булгур',
      gi: 48,
      gl: 14,
      rowNode: null
    },
    {
      name_en: 'Capers',
      name_nl: 'Kappertjes',
      name_ru: 'Каперсы',
      gi: 0,
      gl: 0,
      rowNode: null
    },
    {
      name_en: 'Carrot juice',
      name_nl: 'Wortelsap',
      name_ru: 'Морковный сок',
      gi: 43,
      gl: 11,
      rowNode: null
    },
    {
      name_en: 'Cashew',
      name_nl: 'Cashewnoot',
      name_ru: 'Кешью',
      gi: 22,
      gl: 6,
      rowNode: null
    },
    {
      name_en: 'Cauliflower',
      name_nl: 'Bloemkool',
      name_ru: 'Капуста цветная',
      gi: 15,
      gl: 2,
      rowNode: null
    },
    {
      name_en: 'Celery',
      name_nl: 'Selderij',
      name_ru: 'Сельдерей',
      gi: 15,
      gl: 1,
      rowNode: null
    },
    {
      name_en: 'Cherry',
      name_nl: 'Kers',
      name_ru: 'Вишня',
      gi: 22,
      gl: 5,
      rowNode: null
    },
    {
      name_en: 'Chia seeds',
      name_nl: 'Chiazaden',
      name_ru: 'Семена чиа',
      gi: 1,
      gl: 0,
      rowNode: null
    },
    {
      name_en: 'Chickpea',
      name_nl: 'Kikkererwt',
      name_ru: 'Нут',
      gi: 28,
      gl: 9,
      rowNode: null
    },
    {
      name_en: 'Cocoa powder',
      name_nl: 'Cacaopoeder',
      name_ru: 'Какао порошок',
      gi: 20,
      gl: 12,
      rowNode: null
    },
    {
      name_en: 'Coconut',
      name_nl: 'Kokosnoot',
      name_ru: 'Кокос',
      gi: 45,
      gl: 6,
      rowNode: null
    },
    {
      name_en: 'Coconut milk',
      name_nl: 'Kokosmelk',
      name_ru: 'Кокосовое молоко',
      gi: 20,
      gl: 2,
      rowNode: null
    },
    {
      name_en: 'Cottage cheese 10% fat',
      name_nl: 'Kwark 10% vet',
      name_ru: 'Творог 10% жирности',
      gi: 0,
      gl: 0,
      rowNode: null
    },
    {
      name_en: 'Cranberry',
      name_nl: 'Cranberry',
      name_ru: 'Клюква',
      gi: 45,
      gl: 8,
      rowNode: null
    },
    {
      name_en: 'Cucumber',
      name_nl: 'Komkommer',
      name_ru: 'Огурец',
      gi: 15,
      gl: 1,
      rowNode: null
    },
    {
      name_en: 'Dark chocolate',
      name_nl: 'Pure chocolade',
      name_ru: 'Шоколад темный',
      gi: 20,
      gl: 14,
      rowNode: null
    },
    {
      name_en: 'Date',
      name_nl: 'Dadel',
      name_ru: 'Финик',
      gi: 70,
      gl: 48.4,
      rowNode: null
    },
    {
      name_en: 'Dill',
      name_nl: 'Dille',
      name_ru: 'Укроп',
      gi: 15,
      gl: 1,
      rowNode: null
    },
    {
      name_en: 'Dried fig',
      name_nl: 'Gedroogde vijg',
      name_ru: 'Инжир сушеный',
      gi: 61,
      gl: 16,
      rowNode: null
    },
    {
      name_en: 'Eggplant',
      name_nl: 'Aubergine',
      name_ru: 'Баклажан',
      gi: 15,
      gl: 1,
      rowNode: null
    },
    {
      name_en: 'Endive',
      name_nl: 'Andijvie',
      name_ru: 'Эндивий',
      gi: 15,
      gl: 1,
      rowNode: null
    },
    {
      name_en: 'Feta cheese',
      name_nl: 'Feta kaas',
      name_ru: 'Сыр фета',
      gi: 14,
      gl: 1,
      rowNode: null
    },
    {
      name_en: 'French fries',
      name_nl: 'Friet',
      name_ru: 'Картофель фри',
      gi: 75,
      gl: 14,
      rowNode: null
    },
    {
      name_en: 'Fresh carrot',
      name_nl: 'Verse wortel',
      name_ru: 'Морковь свежая',
      gi: 16,
      gl: 2,
      rowNode: null
    },
    {
      name_en: 'Fresh corn',
      name_nl: 'Verse maïs',
      name_ru: 'Кукуруза свежая',
      gi: 52,
      gl: 18,
      rowNode: null
    },
    {
      name_en: 'Fresh fig',
      name_nl: 'Verse vijg',
      name_ru: 'Инжир свежий',
      gi: 35,
      gl: 9,
      rowNode: null
    },
    {
      name_en: 'Garlic',
      name_nl: 'Knoflook',
      name_ru: 'Чеснок',
      gi: 15,
      gl: 1,
      rowNode: null
    },
    {
      name_en: 'Grape green',
      name_nl: 'Druif groene',
      name_ru: 'Виноград зеленый',
      gi: 43,
      gl: 5,
      rowNode: null
    },
    {
      name_en: 'Grape red',
      name_nl: 'Druif rode',
      name_ru: 'Виноград красный',
      gi: 43,
      gl: 10,
      rowNode: null
    },
    {
      name_en: 'Grapefruit',
      name_nl: 'Grapefruit',
      name_ru: 'Грейпфрут',
      gi: 25,
      gl: 3,
      rowNode: null
    },
    {
      name_en: 'Green pea',
      name_nl: 'Groene erwt',
      name_ru: 'Горошек зеленый',
      gi: 54,
      gl: 4,
      rowNode: null
    },
    {
      name_en: 'Hazel',
      name_nl: 'Hazelnoot',
      name_ru: 'Лесной орех',
      gi: 0,
      gl: 0,
      rowNode: null
    },
    {
      name_en: 'Hummus',
      name_nl: 'Hummus',
      name_ru: 'Хуммус',
      gi: 6,
      gl: 0,
      rowNode: null
    },
    {
      name_en: 'Kiwi',
      name_nl: 'Kiwi',
      name_ru: 'Киви',
      gi: 53,
      gl: 11,
      rowNode: null
    },
    {
      name_en: 'Lemon',
      name_nl: 'Citroen',
      name_ru: 'Лемон',
      gi: 20,
      gl: 2,
      rowNode: null
    },
    {
      name_en: 'Lentil',
      name_nl: 'Linze',
      name_ru: 'Чечевица',
      gi: 32,
      gl: 5,
      rowNode: null
    },
    {
      name_en: 'Lychee',
      name_nl: 'Lychee',
      name_ru: 'Личи',
      gi: 57,
      gl: 14,
      rowNode: null
    },
    {
      name_en: 'Mandarin',
      name_nl: 'Mandarijn',
      name_ru: 'Мандарин',
      gi: 45,
      gl: 6,
      rowNode: null
    },
    {
      name_en: 'Maple syrup',
      name_nl: 'Ahornsiroop',
      name_ru: 'Кленовый сироп',
      gi: 54,
      gl: 11,
      rowNode: null
    },
    {
      name_en: 'Milk',
      name_nl: 'Melk',
      name_ru: 'Молоко',
      gi: 32,
      gl: 4,
      rowNode: null
    },
    {
      name_en: 'Milk chocolate',
      name_nl: 'Melkchocolade',
      name_ru: 'Шоколад молочный',
      gi: 45,
      gl: 23,
      rowNode: null
    },
    {
      name_en: 'Mushroom',
      name_nl: 'Paddenstoel',
      name_ru: 'Грибы',
      gi: 10,
      gl: 1,
      rowNode: null
    },
    {
      name_en: 'Mustard',
      name_nl: 'Mosterd',
      name_ru: 'Горчица',
      gi: 15,
      gl: 1,
      rowNode: null
    },
    {
      name_en: 'Nectarine',
      name_nl: 'Nectarine',
      name_ru: 'Нектарин',
      gi: 40,
      gl: 5,
      rowNode: null
    },
    {
      name_en: 'Oat',
      name_nl: 'Haver',
      name_ru: 'Овес',
      gi: 55,
      gl: 13,
      rowNode: null
    },
    {
      name_en: 'Oatmeal',
      name_nl: 'Havermout',
      name_ru: 'Овсяная каша',
      gi: 55,
      gl: 13,
      rowNode: null
    },
    {
      name_en: 'Olive',
      name_nl: 'Olijf',
      name_ru: 'Оливки',
      gi: 15,
      gl: 2,
      rowNode: null
    },
    {
      name_en: 'Olives',
      name_nl: 'Olijven',
      name_ru: 'Маслины',
      gi: 0,
      gl: 0,
      rowNode: null
    },
    {
      name_en: 'Onion',
      name_nl: 'Ui',
      name_ru: 'Лук',
      gi: 15,
      gl: 1,
      rowNode: null
    },
    {
      name_en: 'Orange',
      name_nl: 'Sinaasappel',
      name_ru: 'Апельсин',
      gi: 40,
      gl: 5,
      rowNode: null
    },
    {
      name_en: 'Orange juice',
      name_nl: 'Sinaasappelsap',
      name_ru: 'Апельсиновый сок',
      gi: 50,
      gl: 12,
      rowNode: null
    },
    {
      name_en: 'Parsley',
      name_nl: 'Peterselie',
      name_ru: 'Петрушка',
      gi: 5,
      gl: 1,
      rowNode: null
    },
    {
      name_en: 'Passion fruit',
      name_nl: 'Passievrucht',
      name_ru: 'Маракуйя',
      gi: 30,
      gl: 7,
      rowNode: null
    },
    {
      name_en: 'Pasta',
      name_nl: 'Pasta',
      name_ru: 'Макароны',
      gi: 45,
      gl: 22,
      rowNode: null
    },
    {
      name_en: 'Pineapple',
      name_nl: 'Ananas',
      name_ru: 'Ананас',
      gi: 66,
      gl: 6,
      rowNode: null
    },
    {
      name_en: 'Plum',
      name_nl: 'Pruim',
      name_ru: 'Слива',
      gi: 24,
      gl: 3,
      rowNode: null
    },
    {
      name_en: 'Potato',
      name_nl: 'Aardappel',
      name_ru: 'Картофель',
      gi: 111,
      gl: 26,
      rowNode: null
    },
    {
      name_en: 'Potato chips',
      name_nl: 'Aardappelchips',
      name_ru: 'Картофельные чипсы',
      gi: 90,
      gl: 21,
      rowNode: null
    },
    {
      name_en: 'Quinoa cooked',
      name_nl: 'Quinoa gekookte',
      name_ru: 'Киноа вареная',
      gi: 35,
      gl: 7.3,
      rowNode: null
    },
    {
      name_en: 'Quinoa',
      name_nl: 'Quinoa',
      name_ru: 'Киноа',
      gi: 40,
      gl: 22.8,
      rowNode: null
    },
    {
      name_en: 'Radish',
      name_nl: 'Radijs',
      name_ru: 'Редис',
      gi: 15,
      gl: 1,
      rowNode: null
    },
    {
      name_en: 'Raisin',
      name_nl: 'Rozijn',
      name_ru: 'Изюм',
      gi: 64,
      gl: 28,
      rowNode: null
    },
    {
      name_en: 'Rice',
      name_nl: 'Rijst',
      name_ru: 'Рис',
      gi: 73,
      gl: 22,
      rowNode: null
    },
    {
      name_en: 'Skimmed cottage cheese',
      name_nl: 'Magere kwark',
      name_ru: 'Творог обезжиренный',
      gi: 0,
      gl: 0,
      rowNode: null
    },
    {
      name_en: 'Skimmed yogurt',
      name_nl: 'Magere yoghurt',
      name_ru: 'Йогурт обезжиренный',
      gi: 35,
      gl: 4,
      rowNode: null
    },
    {
      name_en: 'Sweet cherry',
      name_nl: 'Zoete kers',
      name_ru: 'Черешня',
      gi: 22,
      gl: 5,
      rowNode: null
    },
    {
      name_en: 'Sweet potato',
      name_nl: 'Zoete aardappel',
      name_ru: 'Картофель сладкий',
      gi: 63,
      gl: 17,
      rowNode: null
    },
    {
      name_en: 'Udon noodles',
      name_nl: 'Udonnoedels',
      name_ru: 'Паста удон',
      gi: 55,
      gl: 22,
      rowNode: null
    },
    {
      name_en: 'Vegetable soup',
      name_nl: 'Groentesoep',
      name_ru: 'Овощной суп',
      gi: 56,
      gl: 15,
      rowNode: null
    },
    {
      name_en: 'White bread',
      name_nl: 'Witbrood',
      name_ru: 'Хлеб белый',
      gi: 75,
      gl: 20,
      rowNode: null
    },
    {
      name_en: 'White chocolate',
      name_nl: 'Witte chocolade',
      name_ru: 'Шоколад белый',
      gi: 22,
      gl: 16,
      rowNode: null
    },
    {
      name_en: 'Whole grain pasta',
      name_nl: 'Volkorenpasta',
      name_ru: 'Макароны из цельнозерновой муки',
      gi: 45,
      gl: 22,
      rowNode: null
    },
  ],
};
