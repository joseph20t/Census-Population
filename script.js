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
    counties_with_most_male_female(population_data)

    let total_male_population_value = [];
    function getTotalMalePopulation(){
      let total_male_population = population_data.reduce((acc, cur) => {
        return acc + cur.male;     
      }, 0)

      const curreencyData = { style: 'currency', currency: 'USD' };
      const numberFormat = new Intl.NumberFormat(curreencyData);

      let population_digit = numberFormat.format(total_male_population);
      let total_male_population_amount = document.getElementById("amount_of_male_population"); 
      total_male_population_amount.innerHTML = population_digit;
      
      
      total_male_population_value.push(total_male_population);
      
    }
    getTotalMalePopulation();

    let total_female_population_value = [];
    function getTotalFemalePopulation(){
      let total_female_population = population_data.reduce(function (acc, cur) {
        return acc + cur.female;
      }, 0)
      const curreencyData_female = { style: 'currency', currency: 'USD' };
      const numberFormat_female = new Intl.NumberFormat(curreencyData_female);

      let population_digit_female = numberFormat_female.format(total_female_population);
      let total_female_population_amount = document.getElementById("amount_of_female_population"); 
      total_female_population_amount.innerHTML = population_digit_female;
      total_female_population_value.push(total_female_population);
    }
    getTotalFemalePopulation();
    

    function getTotalPopulation(){
      let total_population = population_data.reduce(function (acc, cur) {
        return acc + cur.male + cur.female;
      }, 0);
      const curreencyData_total_population = { style: 'currency', currency: 'USD' };
      const numberFormat_total_population = new Intl.NumberFormat(curreencyData_total_population);

      let total_population_digit = numberFormat_total_population.format(total_population);
      let total_population_amount = document.getElementById("amount_of_population"); 
      total_population_amount.innerHTML = total_population_digit;
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

function counties_with_most_male_female(population_data){
  let county_name = [];
  let a = [];
  let c = [];
  let t = [];
  population_data.forEach(ele => {
    if(!c.includes(ele.county)){
      console.log(ele.county, ele.male, ele.female)
      c.push(ele.county, ele.male);
      a.push(ele.female);
      t.push(ele.male);
      county_name.push(ele.county);
    }
  })
  a.sort()
  c.sort()
  t.sort()
  let first_county_name= document.getElementById('first_county_name')
  let first_county_female = document.getElementById('first_county_female');
  let first_county_male = document.getElementById('first_county_male')

  first_county_name.innerHTML = county_name[4];
  first_county_male.innerHTML = a[0];
  first_county_female.innerHTML = t[0];

  let name_of_county = document.getElementById('name_of_couty')
  let female_digit = document.getElementById('female_digit');
  let male_digit = document.getElementById('male_digit')

  name_of_county.innerHTML = county_name[10];
  male_digit.innerHTML = a[2];
  female_digit.innerHTML = t[1];

  let name_of_county3 = document.getElementById('name_of_couty3')
  let female_digit3 = document.getElementById('female_digit3');
  let male_digit3 = document.getElementById('male_digit3')

  name_of_county3.innerHTML = county_name[3];
  male_digit3.innerHTML = a[3];
  female_digit3.innerHTML = t[2];

  let name_of_county4 = document.getElementById('name_of_couty4')
  let female_digit4 = document.getElementById('female_digit4');
  let male_digit4 = document.getElementById('male_digit4')

  name_of_county4.innerHTML = county_name[8];
  male_digit4.innerHTML = a[5];
  female_digit4.innerHTML = t[5];

  let name_of_county5 = document.getElementById('name_of_couty5')
  let female_digit5 = document.getElementById('female_digit5');
  let male_digit5 = document.getElementById('male_digit5')

  name_of_county5.innerHTML = county_name[7];
  male_digit5.innerHTML = a[6];
  female_digit5.innerHTML = t[6];
}
