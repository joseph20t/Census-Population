
fetch('census.json')
  .then(response => response.json())
  .then(data => {
    let population_data = data.population;

    let total_male_population = population_data.reduce(function (acc, cur) {
      return acc + cur.male;     
    }, 0)
    let total_male_population_amount = document.getElementById("amount_of_male_population"); 
    total_male_population_amount.innerHTML = total_male_population;

    let total_female_population = population_data.reduce(function (acc, cur) {
      return acc + cur.female;
    }, 0)
    let total_female_population_amount = document.getElementById("amount_of_female_population"); 
    total_female_population_amount.innerHTML = total_female_population;

    let total_population = population_data.reduce(function (acc, cur) {
      return acc + cur.male + cur.female;
    }, 0);
    
    let total_population_amount = document.getElementById("amount_of_population"); 
    total_population_amount.innerHTML = total_population;

    let population_per_county = {}

    population_data.forEach(ele => {
    if(population_per_county.hasOwnProperty(ele.county)){
      population_per_county[ele.county] += ele.male + ele.female;
    }else {
      population_per_county[ele.county] = ele.male + ele.female;
    }
    })


    let myChart = document.getElementById("myChart").getContext('2d');
    let bar_chart = new Chart(myChart, {
      type: 'bar',
      data: {
        datasets:[
          { 
            label: 'Total Population Per County',
            backgroundColor: "#B1D2C2",
            data: population_per_county,
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

    let donut_pie_Chart = document.getElementById("donut_pie_Chart").getContext('2d');
    let donut_chart = new Chart(donut_pie_Chart, {
      type: 'doughnut',
      data: {
        datasets:[
          { 
            data:[
            total_female_population,
            total_male_population 
            ],
            backgroundColor: [
              '#FFFFFF',
              '#519872',  
            ],
          },
        ],
        labels: ["female", "male",]
      },
      option:{}
  })

  
    //  let population_per_district = population_data.reduce((acc, cur) =>  {
    //       if (!acc[cur.district]) acc[cur.district] = 0;
    //       acc[cur.district] += cur.male + cur.female;
    //       return acc
    //   }, {})
    // console.log(population_per_district)
    let population_per_district = {}

    population_data.forEach(ele => {
      if(!ele.county[ele.district])
      {
        console.log(population_per_district[ele.district] += ele.male + ele.female)
        
      }else {
        population_per_county[ele.county] = ele.male + ele.female;
      }
    })

    let JsChart = document.getElementById("district_chart").getContext('2d');
    let bar_chart3 = new Chart(JsChart, {
      type: 'bar',
      data: {
        datasets:[
          { 
            label: 'Total Population Per County',
            backgroundColor: "#B1D2C2",
            data: population_per_district,
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


    // let population_per_district = {}

    // population_data.forEach(ele => {
    //   if(!ele.county[ele.district])
    //   {
    //     console.log(population_per_district[ele.district] += ele.male + ele.female)
        
    //   }else {
    //     population_per_county[ele.county] = ele.male + ele.female;
    //   }
    // })

    let household = document.getElementById("household_population_total").getContext('2d');
    let bar_chart4 = new Chart(household, {
      type: 'bar',
      data: {
        datasets:[
          { 
            label: 'Total Population Per County',
            backgroundColor: "#B1D2C2",
            data: population_per_county,
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

    })

  .catch(err => {
    console.log(err);
  });