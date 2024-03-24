const data = {
  limits: {
    gi: [55, 69],
    gl: [10, 19],
  },
  products: [
    {
      name_en: 'Almond',
      name_nl: 'Amandel',
      name_ru: 'Миндаль',
      gi: 15,
      gl: 1.9,
      rowNode: null,
    },
    {
      name_en: 'Apricot',
      name_nl: 'Abrikoos',
      name_ru: 'Абрикос',
      gi: 34,
      gl: 3.8,
      rowNode: null,
    },
    {
      name_en: 'Avocado',
      name_nl: 'Avocado',
      name_ru: 'Авокадо',
      gi: 10,
      gl: 0.9,
      rowNode: null,
    },
    {
      name_en: 'Banana',
      name_nl: 'Banaan',
      name_ru: 'Банан',
      gi: 48,
      gl: 10.1,
      rowNode: null,
    },
    {
      name_en: 'Sugar (brown)',
      name_nl: 'Suiker (bruin)',
      name_ru: 'Сахар (коричневый)',
      gi: 80,
      gl: 6.8,
      rowNode: null,
    },
  ],
};

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

function filterByQuery(query, products) {
  products.forEach((product) => {
    if (!product.rowNode) {
      return;
    }

    if (!query) {
      product.rowNode.classList.remove('--hidden');
      return;
    }

    const match = product.name_en.includes(query) || product.name_nl.includes(query) || product.name_ru.includes(query);
    product.rowNode.classList.toggle('--hidden', !match);
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

  const searchInput = document.querySelector('#search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (event) => {
      filterByQuery(searchInput.value ?? '', data.products);
    });
  }
});
