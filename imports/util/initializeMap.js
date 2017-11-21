export function initializeMap() {
	// console.log("initialize Map start")
	var bounds = new google.maps.LatLngBounds();
	// console.log("bounds -->>",bounds,document.getElementById('google-map'))
  if(document.getElementById('google-map'))
  {
    document.getElementById('google-map').innerHTML = ""
    skill_class = SkillClass.find({}).fetch()
    var gmarkers = [];
    var mapOptions = {
      zoom: 8,
      scrollwheel: true,
      minZoom:1
    };
    // console.log("skill_class -->>",skill_class)
    var map = new google.maps.Map(document.getElementById('google-map'),mapOptions);
    for(var i = 0; i < skill_class.length; i++){
      class_location = SLocation.findOne({_id:skill_class[i].locationId})
      if(class_location && class_location.geoLat && class_location.geoLong){
        cost = 0
        // console.log(skill_class[i].classTypeId);
        class_price = ClassPricing.findOne({classTypeId: { '$regex': ''+skill_class[i].classTypeId+'', '$options' : 'i' }})
        // console.log(class_price);
        if(class_price){
          cost = class_price.cost;
        }
        school = School.findOne({_id:skill_class[i].schoolId})
        if (school && school.slug){
          content = "<b><a href='/schools/"+school.slug+"'>"+skill_class[i].className+"</a></b>"+"</br> $"+cost+" Cost";
          /*console.log(content);*/
          var myLatlng = new google.maps.LatLng(eval(class_location.geoLat),eval(class_location.geoLong));
          var marker = new google.maps.Marker({
            position: myLatlng,
            title: skill_class[i].className,
            map: map,
            contentString:content,
            classId:skill_class[i]._id
          });
          bounds.extend(myLatlng);
          gmarkers.push(marker)
          var infowindow = new google.maps.InfoWindow();
          google.maps.event.addListener(marker, 'click', function() {
            infowindow.setContent(this.contentString);
            infowindow.open(map,this);
            $('#MainPanel').scrollTop($('#'+this.classId).offset().top);
            $('#'+this.classId).animateCss("wobble");
          });
        }
      }
    }
    map.fitBounds(bounds);
    map.panToBounds(bounds);
    var mcOptions = {gridSize: 10,   minZoom:1};
    mc = new MarkerClusterer(map, gmarkers, mcOptions);
    skill = Session.get("Hskill")
    classPrice = Session.get("HclassPrice")
    monthPrice = Session.get("HmonthPrice")
    coords = Session.get("coords")
    //&& !!skill && !!classPrice && !!monthPrice && !!coords
    if(!!navigator.geolocation)
    {
      navigator.geolocation.getCurrentPosition(function(position)
      {
               var geolocate = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
               if(!skill && !classPrice && !monthPrice && !coords){
                 map.setCenter(geolocate);
               }
               /*var infowindow = new google.maps.InfoWindow({map: map,position: geolocate,content:'Your Location!'});*/
               var infowindow = new google.maps.InfoWindow();
               // map.setZoom(8);

               bounds.extend(geolocate);
               map.fitBounds(bounds);
                map.panToBounds(bounds);


               var marker = new google.maps.Marker({
                position: geolocate,
                icon: '/images/bluecircle.png',
                map: map
              });
              google.maps.event.addListener(marker, 'click', function() {
                infowindow.setContent('Your Location!');
                infowindow.open(map,this);
              });
       });
    } else {
        // No support
    }
    $('#google-map').show();
     /*map.setOptions({ minZoom:1,maxZoom: 13 });*/
  }
}