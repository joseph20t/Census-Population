let JsChart = document.getElementById("district_chart");
let district_bar_chart = new Chart(JsChart, {
  type: 'bar',
  data: {
    labels: [],
    datasets:[
      {
        data: [],
        label: 'Total Population Per District',
        backgroundColor: "#B1D2C2",
        
      },
      {
        data: [],
        backgroundColor: "#B1D2C2",
      },
    ]
  },
  option:{
    scales: {
      x: {
        stacked: true
      },
      y: {
        beginAtZero: true
      }
  }
  }
 
});

let household = document.getElementById("household_population_total");
let households_Chart = new Chart(household, {
  type: 'bar',
  data: {
    labels: [],
    datasets:[
      { 
        label: 'Total Population Per County',
        backgroundColor: "#B1D2C2",
        data: [],
      },
      { 
        label: 'Total Population Per County',
        backgroundColor: "#B1D2C2",
        data: [],
      },
    ]
  },
  option:{
    scales: {
      x: {
        stacked: true
      },
      y: {
        // stacked: true,
        beginAtZero: true
      }
  }
  }
});
let storing_of_population_data = [];
let population_per_households_data = [];


fetch('census.json')
  .then(response => response.json())
  .then(data => {
    
    let households_data = data.households;
    population_per_households_data.push(households_data);

    let object_of_population_data = data.population;
    storing_of_population_data.push(object_of_population_data)

    let population_data = data.population;
    let households_data_per_county = data.households;
    josephTest(population_data)

    let total_male_population_value = [];
    function getTotalMalePopulation(){
      let total_male_population = population_data.reduce((acc, cur) => {
        return acc + cur.male;     
      }, 0)
      let total_male_population_amount = document.getElementById("amount_of_male_population"); 
      total_male_population_amount.innerHTML = total_male_population;
      
      total_male_population_value.push(total_male_population);
    }
    getTotalMalePopulation();

    let total_female_population_value = [];
    function getTotalFemalePopulation(){
      let total_female_population = population_data.reduce(function (acc, cur) {
        return acc + cur.female;
      }, 0)
      let total_female_population_amount = document.getElementById("amount_of_female_population"); 
      total_female_population_amount.innerHTML = total_female_population;
      total_female_population_value.push(total_female_population);
    }
    getTotalFemalePopulation();
    

    function getTotalPopulation(){
      let total_population = population_data.reduce(function (acc, cur) {
        return acc + cur.male + cur.female;
      }, 0);
      
      let total_population_amount = document.getElementById("amount_of_population"); 
      total_population_amount.innerHTML = total_population;
    }
    getTotalPopulation();

    //gettting the county and their male and female data in an object
    let population_per_county = {}
    function getCountyPopulationValue(){
      population_data.forEach(ele => {
        if(population_per_county.hasOwnProperty(ele.county)){
          population_per_county[ele.county] += ele.male + ele.female;
        }else {
          population_per_county[ele.county] = ele.male + ele.female;
        }
        })
    }
    getCountyPopulationValue()
    
    //displaying population data in the chart
    function populatiuonPerCountyChart(){
    let myChart = document.getElementById("myChart");
    let population_chart = new Chart(myChart, {
      type: 'bar',
      data: {
        datasets:[
          { 
            label: 'Total Population Per County',
            backgroundColor: "#519872",
            data: population_per_county,
            borderRadius: 10
          },
          
        ]
      },
      option:{
        scales: {
          x: {
            stacked: true
          },
          y: {
            stacked: true,
            beginAtZero: true
          }
      }
      }
    });
    }
    populatiuonPerCountyChart();

    //displaying the male and female data in the doughnut chart
    function doughnutChart(){
      let donut_pie_Chart = document.getElementById("donut_pie_Chart");
      let donut_chart = new Chart(donut_pie_Chart, {
        type: 'doughnut',
        data: {
          labels: ["female", "male",],
          datasets:[
            { 
              data:[
              total_female_population_value,
              total_male_population_value
              ],
              
              backgroundColor: [
                '#FFFFFF',
                '#B1D2C2',  
              ],
            },
          ],
        
        },
        option:{
          legend: {
            position: "bottom"
        },
          scales: {
            x: {
              stacked: true
            },
            y: {
              stacked: true,
              beginAtZero: true
            }
        },
        },
        
      })
    }
    doughnutChart();
    

    function removeDuplicateObjectFromArray(population_data, key) {
      var check = new Set();
      return population_data.filter(obj => !check.has(obj[key]) && check.add(obj[key]));
    }
    
    let selected_county = removeDuplicateObjectFromArray(population_data, 'county');
    selected_county.forEach((ele, index) => {
      let displaying_county_names = `<option value ='${ele.county}'>${ele.county}</optipn> `
      document.querySelector('select').insertAdjacentHTML('beforeend', displaying_county_names);
    })
    getCountyPerDistrict();

    //district population data
    let population_per_district = {}

    population_data.forEach(ele => {
      if(!ele.county[ele.district])
      {
        population_per_district[ele.district] += ele.male + ele.female
        
      }else {
        population_per_county[ele.county] = ele.male + ele.female;
      }
     })  
     
     //households data removing the duplicate county
     function removeDuplicateCounty(households_data_per_county, key) {
      var check = new Set();
      return households_data_per_county.filter(obj => !check.has(obj[key]) && check.add(obj[key]));
    }
    
    //inserting in the select tag the county with the district male and female data
    let select_county_per_household = removeDuplicateCounty(households_data_per_county, 'county');
      select_county_per_household.forEach((ele, index) => {
      let displaying_county_names_per_households = `<option value ='${ele.county}'>${ele.county}</optipn> `
      document.getElementById('choosing_county_household_div').insertAdjacentHTML('beforeend', displaying_county_names_per_households);
    })
    getCountyPerhousehold();
  })

.catch(err => {
  console.log(err);
});


function getCountyPerDistrict(){ 
  let countyValue = document.getElementById('choosing_county_div');
  let county_value = countyValue.value;
  let district_population_per_county_male = [];
  let district_population_per_county_female = [];
  let district_name = [];
  storing_of_population_data.forEach(element => {
      element.forEach(ele => {
      if(ele.county === county_value) {
        district_name.push(ele.district)
        district_population_per_county_male.push(ele.male);
        district_population_per_county_female.push(ele.female)
        
      }

    })
  })
  displayingCountyDistrictData(district_population_per_county_male, district_population_per_county_female, district_name);
}
function displayingCountyDistrictData(district_population_per_county_male,district_population_per_county_female, district_name){
  district_bar_chart.data.labels = district_name;

  district_bar_chart.data.datasets = [];
  district_bar_chart.data.datasets.push({
    data: district_population_per_county_female,
    label: 'Total Female',
    // backgroundColor: "lightgray",
    borderRadius: 20
  },
  {
    data: district_population_per_county_male,
    label: 'Total Male',
    backgroundColor: "#519872",
    borderRadius: 20
  });
  
  district_bar_chart.update()
}

function getCountyPerhousehold(){
  let households_male_population = [];
  let households_female_population = [];
  let households_population_number = [];
  let settlement = [];

  let household_value = document.getElementById('choosing_county_household_div').value;
  population_per_households_data.forEach(element => {
    element.forEach(ele => {
      if(ele.county === household_value) {
        settlement.push(ele.settlement)
        households_male_population.push(ele.male);
        households_female_population.push(ele.female);
        households_population_number.push(ele.household_number)
      } 
    })

  })
 
  displayingHouseholds(households_male_population, households_female_population, settlement, households_population_number)
}

function displayingHouseholds(households_male_population, households_female_population, settlement, households_population_number){
  households_Chart.data.labels = settlement;

  households_Chart.data.datasets = [];
  households_Chart.data.datasets.push({
    data: households_male_population,
    label: 'Total Households For Male',
    backgroundColor: "lightgray",
    borderRadius: 25
  },
  {
    data: households_female_population,
    label: 'Total Households For Female',
    backgroundColor: "#519872",
    borderRadius: 25
  },
  {
    data: households_population_number,
    label: 'Huseholds Population Number',
    // backgroundColor: "l",
    borderRadius: 25
  }
  ),
  households_Chart.update();
}

function josephTest(population_data){
  // let a = [];
  // let c = [];
  population_data.forEach(ele => {
    // console.log(c)
    // console.log(c.includes(ele.county))
    // if(c.includes(ele.county)){
    //   console.log(ele.county)
    // }
    // if(ele.county === "Montserrado "){
    //   a.push(ele.male)
     
    //   let b = a.reduce((acc, cur) => {
    //     return acc + cur;     
    //   }, 0)
      // console.log(c[0])
      // let t = document.getElementById("hey")
      // c[0].innerHTML = t
    // }
    
    // console.log(a)
    // let nest = ele.male
    // a.push([ele.county] = ele.male)
  })
}
