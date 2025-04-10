ymaps.ready(init);
      let myMap;
      let placemark;
      function init(){
          var myMap = new ymaps.Map("map", {
              center: [54.193122, 37.617348],
              zoom: 12
          });
          myMap.events.add('click', function (e) {
              const coords = e.get('coords');
              if (placemark) {
                  placemark.geometry.setCoordinates(coords);
              } else { 
                  placemark = new ymaps.Placemark(coords);
                  myMap.geoObjects.add(placemark);
              }
              placemark.properties.set('balloonContent', `Координаты: ${coords[0].toFixed(6)}, ${coords[1].toFixed(6)}`);
              myMap.balloon.open(coords, {
                  content: `Координаты: ${coords[0].toFixed(6)}, ${coords[1].toFixed(6)}`
              });
          });
      }