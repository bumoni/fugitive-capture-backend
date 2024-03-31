// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

// Dummy data for cities and vehicles
let cities = [
  { name: 'Yapkashnagar', distance: 60 },
  { name: 'Lihaspur', distance: 50 },
  { name: 'Narmis City', distance: 40 },
  { name: 'Shekharvati', distance: 30 },
  { name: 'Nuravgram', distance: 20 }
];

let vehicles = [
  { kind: 'EV Bike', range: 60, count: 2 , used:0},
  { kind: 'EV Car', range: 100, count: 1 , used:0 },
  { kind: 'EV SUV', range: 120, count: 1 , used:0}
];

// Simulate fugitive's location
const fugitiveLocation = cities[Math.floor(Math.random() * cities.length)];

app.use(bodyParser.json());
app.use(cors());
// Endpoint to get cities data
app.get('/api/cities', (req, res) => {
  res.json(cities);
});

// Endpoint to get vehicles data
app.get('/api/vehicles', (req, res) => {
  res.json(vehicles);
});

// Endpoint to handle cop choices and determine capture result
app.post('/api/capture', (req, res) => {
  let data=req.body;
  let response=[];
  Object.entries(data).forEach(([key, entry]) => {
    const city = cities.find(c => c.name == entry.selectedCity);
    const vehicle = vehicles.find(v => v.kind == entry.selectedVehicle);
    if(city?.distance<=vehicle?.range && vehicle?.count>vehicle?.used){
        response.push({status:true,capturingCop: +key+1, selectedCity :entry.selectedCity ,selectedVehicle:entry.selectedVehicle ,distance:city?.distance ,range:vehicle?.range, reason: "All condition satisfy."})
        for (let i = 0; i < vehicles.length; i++) {
            if (vehicles[i].kind == vehicle?.kind) {
              vehicles[i].used++;
              break; 
            }
        }
    }
    else{
        response.push({status:false,capturingCop: +key+1, selectedCity :entry.selectedCity ,selectedVehicle:entry.selectedVehicle ,distance:city?.distance ,range:vehicle?.range, reason: "May rang is higher or Selected vehicles are used by other cops"})
    }
  });
  for (let i = 0; i < vehicles.length; i++) {
    vehicles[i].used=0;
   }
  res.json(response);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
