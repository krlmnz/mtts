


'use strict';

const config = {
  style: 'mapbox://styles/kmunoz/clwxctr2206fn01nxc126h602',
  accessToken: 'pk.eyJ1Ijoia211bm96IiwiYSI6ImNsY3A3NDloaDA2bnozcGxiN2U1Y2I2bWIifQ.WY4_mVStBm5c9CjvWsVy3w',
  CSV: 'https://docs.google.com/spreadsheets/d/1V-PIOfUiebIaWvQ68D39xtIEm16QKyXka5PE_WQXL2o/gviz/tq?tqx=out:csv&sheet=Sheet1',
  center: [-111.638019, 41.259263],
  zoom: 5.0,
  title: 'Mini Takes The States 2022 - Locations',
  description: 'Replace with information about your application. Ex. You can search by address to sort the list below by distance. You can also filter the list by language support options, which days a location is open, and whether they have devices to use to complete the survey by phone or online.',
  sideBarInfo: ['line_01', 'line_02', 'line_03'],
  popupInfo: ['line_01', 'line_02', 'line_03'],
  filters: [
    {
      type: 'dropdown',
      title: 'Languages supported: ',
      columnHeader: 'Languages',
      listItems: [
        'Amharic', 'ASL', 'Cambodian', 'Chinese', 'Danish', 'English', 'French',
        'German', 'Greek', 'Hindi', 'Italian', 'Japanese', 'Korean',
        'Language Line Services', 'Norwegian', 'Oriya', 'Portuguese', 'Punjabi',
        'Russian', 'Somali', 'Spanish', 'Swedish', 'Tagalog', 'Thai', 'Tigrinya',
        'Tongan', 'Vietnamese', 'Ukranian',
      ],
    },
    {
      type: 'checkbox',
      title: 'Devices available: ',
      columnHeader: 'Devices_available',
      listItems: ['Computer', 'Wi-Fi', 'Adaptive Laptops'],
    },
    {
      type: 'dropdown',
      title: 'Clients: ',
      columnHeader: 'Clients',
      listItems: [
        'Adults', 'Disabled', 'Homeless', 'Immigrants/Refugees', 'Low Income',
        'Seniors', 'Youth: Pre-teen', 'Youth: Teen',
      ],
    },
  ],
};




mapboxgl.accessToken = config.accessToken;
const columnHeaders = config.sideBarInfo;
let geojsonData = {};
const filteredGeojson = {
  type: 'FeatureCollection',
  features: [],
};




const map = new mapboxgl.Map({
  container: 'map',
  style: config.style,
  center: config.center,
  zoom: config.zoom,
  transformRequest: transformRequest,
});

function transformRequest(url) {
  const isMapboxRequest =
    url.slice(8, 22) === 'api.mapbox.com' ||
    url.slice(10, 26) === 'tiles.mapbox.com';
  return {
    url: isMapboxRequest ? url.replace('?', '?pluginName=finder&') : url,
  };
}

function flyToLocation(currentFeature) {
  map.flyTo({
    center: currentFeature,
    zoom: 11,
  });
}

function createPopup(currentFeature) {
  const popups = document.getElementsByClassName('mapboxgl-popup');
  if (popups[0]) popups[0].remove();

  new mapboxgl.Popup({ closeOnClick: true })
    .setLngLat(currentFeature.geometry.coordinates)
    .setHTML('<h4>' + currentFeature.properties[config.popupInfo[0]] + '</h4>'
             + '<p>' + currentFeature.properties[config.popupInfo[1]] + '</p>'
             + '<p>' + currentFeature.properties[config.popupInfo[2]] + '</p>')
    .addTo(map);
}

function buildLocationList(locationData) {
  const listings = document.getElementById('listings');
  listings.innerHTML = '';
  locationData.features.forEach((location, i) => {
    const prop = location.properties;

    const listing = listings.appendChild(document.createElement('div'));
    listing.id = 'listing-' + prop.id;
    listing.className = 'item';

    const link = listing.appendChild(document.createElement('button'));
    link.className = 'title';
    link.id = 'link-' + prop.id;
    link.innerHTML = '<p style="">' + prop[columnHeaders[0]] + '</p>';

    const details = listing.appendChild(document.createElement('div'));
    details.className = 'content';

    for (let i = 1; i < columnHeaders.length; i++) {
      const div = document.createElement('div');
      div.innerText += prop[columnHeaders[i]];
      div.className;
      details.appendChild(div);
    }

    link.addEventListener('click', function () {
      const clickedListing = location.geometry.coordinates;
      flyToLocation(clickedListing);
      createPopup(location);

      const activeItem = document.getElementsByClassName('active');
      if (activeItem[0]) {
        activeItem[0].classList.remove('active');
      }
      this.parentNode.classList.add('active');

      const divList = document.querySelectorAll('.content');
      const divCount = divList.length;
      for (let i = 0; i < divCount; i++) {
        divList[i].style.maxHeight = null;
      }

      for (let i = 0; i < geojsonData.features.length; i++) {
        this.parentNode.classList.remove('active');
        this.classList.toggle('active');
        const content = this.nextElementSibling;
        if (content.style.maxHeight) {
          content.style.maxHeight = null;
        } else {
          content.style.maxHeight = content.scrollHeight + 'px';
        }
      }
    });
  });
}

function buildDropDownList(title, listItems) {
  const filtersDiv = document.getElementById('filters');
  const mainDiv = document.createElement('div');
  const filterTitle = document.createElement('h4');
  filterTitle.innerText = title;
  filterTitle.classList.add('py12', 'txt-bold');
  mainDiv.appendChild(filterTitle);

  const selectContainer = document.createElement('div');
  selectContainer.classList.add('select-container', 'center');

  const dropDown = document.createElement('select');
  dropDown.classList.add('select', 'filter-option');

  const selectArrow = document.createElement('div');
  selectArrow.classList.add('select-arrow');

  const firstOption = document.createElement('option');

  dropDown.appendChild(firstOption);
  selectContainer.appendChild(dropDown);
  selectContainer.appendChild(selectArrow);
  mainDiv.appendChild(selectContainer);

  listItems.forEach((opt) => {
    const el1 = document.createElement('option');
    el1.textContent = opt;
    el1.value = opt;
    dropDown.appendChild(el1);
  });
  filtersDiv.appendChild(mainDiv);
}

function buildCheckbox(title, listItems) {
  const filtersDiv = document.getElementById('filters');
  const mainDiv = document.createElement('div');
  const filterTitle = document.createElement('div');
  const formatcontainer = document.createElement('div');
  filterTitle.classList.add('center', 'flex-parent', 'py12', 'txt-bold');
  formatcontainer.classList.add('center', 'flex-parent', 'flex-parent--column', 'px3', 'flex-parent--space-between-main');
  const secondLine = document.createElement('div');
  secondLine.classList.add('center', 'flex-parent', 'py12', 'px3', 'flex-parent--space-between-main');
  filterTitle.innerText = title;
  mainDiv.appendChild(filterTitle);
  mainDiv.appendChild(formatcontainer);

  listItems.forEach((item) => {
    const container = document.createElement('label');
    container.classList.add('checkbox-container');

    const input = document.createElement('input');
    input.classList.add('px12', 'filter-option');
    input.setAttribute('type', 'checkbox');
    input.setAttribute('id', item);
    input.setAttribute('value', item);

    const checkboxDiv = document.createElement('div');
    const inputValue = document.createElement('p');
    inputValue.innerText = item;
    checkboxDiv.classList.add('checkbox', 'mr6');
    checkboxDiv.appendChild(Assembly.createIcon('check'));

    container.appendChild(input);
    container.appendChild(checkboxDiv);
    container.appendChild(inputValue);

    formatcontainer.appendChild(container);
  });
  filtersDiv.appendChild(mainDiv);
}

const selectFilters = [];
const checkboxFilters = [];

function createFilterObject(filterSettings) {
  filterSettings.forEach((filter) => {
    if (filter.type === 'checkbox') {
      const keyValues = {};
      Object.assign(keyValues, {
        header: filter.columnHeader,
        value: filter.listItems,
      });
      checkboxFilters.push(keyValues);
    }
    if (filter.type === 'dropdown') {
      const keyValues = {};
      Object.assign(keyValues, {
        header: filter.columnHeader,
        value: filter.listItems,
      });
      selectFilters.push(keyValues);
    }
  });
}

function applyFilters() {
  const filterForm = document.getElementById('filters');

  filterForm.addEventListener('change', function () {
    const filterOptionHTML = this.getElementsByClassName('filter-option');
    const filterOption = [].slice.call(filterOptionHTML);

    const geojSelectFilters = [];
    const geojCheckboxFilters = [];

    filteredGeojson.features = [];

    filterOption.forEach((filter) => {
      if (filter.type === 'checkbox' && filter.checked) {
        checkboxFilters.forEach((objs) => {
          Object.entries(objs).forEach(([, value]) => {
            if (value.includes(filter.value)) {
              const geojFilter = [objs.header, filter.value];
              geojCheckboxFilters.push(geojFilter);
            }
          });
        });
      }
      if (filter.type === 'select-one' && filter.value) {
        selectFilters.forEach((objs) => {
          Object.entries(objs).forEach(([, value]) => {
            if (value.includes(filter.value)) {
              const geojFilter = [objs.header, filter.value];
              geojSelectFilters.push(geojFilter);
            }
          });
        });
      }
    });

    if (geojCheckboxFilters.length === 0 && geojSelectFilters.length === 0) {
      geojsonData.features.forEach((feature) => {
        filteredGeojson.features.push(feature);
      });
    } else if (geojCheckboxFilters.length > 0) {
      geojCheckboxFilters.forEach((filter) => {
        geojsonData.features.forEach((feature) => {
          if (feature.properties[filter[0]].includes(filter[1])) {
            if (filteredGeojson.features.filter((f) => f.properties.id === feature.properties.id).length === 0) {
              filteredGeojson.features.push(feature);
            }
          }
        });
      });
      if (geojSelectFilters.length > 0) {
        const removeIds = [];
        filteredGeojson.features.forEach((feature) => {
          let selected = true;
          geojSelectFilters.forEach((filter) => {
            if (feature.properties[filter[0]].indexOf(filter[1]) < 0 && selected === true) {
              selected = false;
              removeIds.push(feature.properties.id);
            } else if (selected === false) {
              removeIds.push(feature.properties.id);
            }
          });
        });
        let uniqueRemoveIds = [...new Set(removeIds)];
        uniqueRemoveIds.forEach((id) => {
          const idx = filteredGeojson.features.findIndex((f) => f.properties.id === id);
          filteredGeojson.features.splice(idx, 1);
        });
      }
    } else {
      geojsonData.features.forEach((feature) => {
        let selected = true;
        geojSelectFilters.forEach((filter) => {
          if (!feature.properties[filter[0]].includes(filter[1]) && selected === true) {
            selected = false;
          }
        });
        if (selected === true && filteredGeojson.features.filter((f) => f.properties.id === feature.properties.id).length === 0) {
          filteredGeojson.features.push(feature);
        }
      });
    }

    map.getSource('locationData').setData(filteredGeojson);
    buildLocationList(filteredGeojson);
  });
}

function filters(filterSettings) {
  filterSettings.forEach((filter) => {
    if (filter.type === 'checkbox') {
      buildCheckbox(filter.title, filter.listItems);
    } else if (filter.type === 'dropdown') {
      buildDropDownList(filter.title, filter.listItems);
    }
  });
}

function removeFilters() {
  const input = document.getElementsByTagName('input');
  const select = document.getElementsByTagName('select');
  const selectOption = [].slice.call(select);
  const checkboxOption = [].slice.call(input);
  filteredGeojson.features = [];
  checkboxOption.forEach((checkbox) => {
    if (checkbox.type === 'checkbox' && checkbox.checked === true) {
      checkbox.checked = false;
    }
  });

  selectOption.forEach((option) => {
    option.selectedIndex = 0;
  });

  map.getSource('locationData').setData(geojsonData);
  buildLocationList(geojsonData);
}

function removeFiltersButton() {
  const removeFilter = document.getElementById('removeFilters');
  removeFilter.addEventListener('click', () => {
    removeFilters();
  });
}

createFilterObject(config.filters);
applyFilters();
filters(config.filters);
removeFiltersButton();

const geocoder = new MapboxGeocoder({
  accessToken: mapboxgl.accessToken,
  mapboxgl: mapboxgl,
  marker: true,
  zoom: 11,
});

function sortByDistance(selectedPoint) {
  const options = { units: 'miles' };
  let data;
  if (filteredGeojson.features.length > 0) {
    data = filteredGeojson;
  } else {
    data = geojsonData;
  }
  data.features.forEach((data) => {
    Object.defineProperty(data.properties, 'distance', {
      value: turf.distance(selectedPoint, data.geometry, options),
      writable: true,
      enumerable: true,
      configurable: true,
    });
  });

  data.features.sort((a, b) => {
    if (a.properties.distance > b.properties.distance) {
      return 1;
    }
    if (a.properties.distance < b.properties.distance) {
      return -1;
    }
    return 0;
  });
  const listings = document.getElementById('listings');
  while (listings.firstChild) {
    listings.removeChild(listings.firstChild);
  }
  buildLocationList(data);
}

geocoder.on('result', (ev) => {
  const searchResult = ev.result.geometry;
  sortByDistance(searchResult);
});

map.on('load', () => {
  map.addControl(geocoder, 'top-right');
  $(document).ready(() => {
    $.ajax({
      type: 'GET',
      url: config.CSV,
      dataType: 'text',
      success: function (csvData) {
        makeGeoJSON(csvData);
      },
      error: function (request, status, error) {
        console.log(request);
        console.log(status);
        console.log(error);
      },
    });
  });

  function makeGeoJSON(csvData) {
    csv2geojson.csv2geojson(csvData, {
      latfield: 'Latitude',
      lonfield: 'Longitude',
      delimiter: ',',
    }, (err, data) => {
      data.features.forEach((data, i) => {
        data.properties.id = i;
      });

      geojsonData = data;
      map.addLayer({
        id: 'locationData',
        type: 'circle',
        source: {
          type: 'geojson',
          data: geojsonData,
        },
        paint: {
          'circle-radius': 8,
          'circle-color': '#004d24',
          'circle-stroke-color': '#f7f8f1',
          'circle-stroke-width': 2,
          'circle-opacity': 1,
        },
      });
    });

    map.on('click', 'locationData', (e) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: ['locationData', 'Latitude'],
      });
      const clickedPoint = features[1].geometry.coordinates;
      flyToLocation(clickedPoint);
      sortByDistance(clickedPoint);
      createPopup(features[1]);
    });

    map.on('mouseenter', 'locationData', () => {
      map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', 'locationData', () => {
      map.getCanvas().style.cursor = '';
    });
    buildLocationList(geojsonData);
  }
});

const filterResults = document.getElementById('filterResults');
const exitButton = document.getElementById('exitButton');
const modal = document.getElementById('modal');

filterResults.addEventListener('click', () => {
  modal.classList.remove('hide-visually');
  modal.classList.add('z5');
});

exitButton.addEventListener('click', () => {
  modal.classList.add('hide-visually');
});

const title = document.getElementById('title');
title.innerText = config.title;
const description = document.getElementById('description');
description.innerText = config.description;


const routes = [
  './data/Day_1_ALBUQUERQUE_NM_DURANGO_CO.geojson',
  './data/Day_2_Durango_CO_Grand_Junction_CO.geojson',
  './data/Day_3_Grand_Junction_CO_Salt_Lake_City_UT.geojson',
  './data/Day_5_Salt_Lake_City_Bozeman_MT.geojson',
  './data/Day_6_Bozeman_MT_Missoula_MT.geojson',
  './data/Day_7_Missoula_MT_Spokane_WA.geojson',
  './data/Day_8_SPOKANE_WA_YAKIMA_WA.geojson'
];

map.on('load', () => {
  routes.forEach((route, index) => {
    fetch(route)
      .then(response => response.json())
      .then(data => {
        const routeId = `route-${index}`;
        const routeBlackId = `route-black-${index}`;
        const routeHighlightId = `route-highlight-${index}`;

        // Add the source
        map.addSource(routeId, {
          type: 'geojson',
          data: data
        });

        // Add the second layer (black line) first
        map.addLayer({
          id: routeBlackId,
          type: 'line',
          source: routeId,
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#00000011',
            'line-width': 6,
            'line-translate': [0, 2]
          }
        });

        // Add the first layer (colored line) on top of the black line
        map.addLayer({
          id: routeId,
          type: 'line',
          source: routeId,
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#974819',
            'line-width': 6
          }
        });


        // Add the second layer (black line) first
        map.addLayer({
          id: routeHighlightId,
          type: 'line',
          source: routeId,
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#f7decf',
            'line-width': 1,
            'line-translate': [-1.5, 1]
          }
        });

      })
      .catch(error => console.error(`Error loading route ${index}:`, error));
  });
});
