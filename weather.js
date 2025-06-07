// API KEY
const API_KEY = "168771779c71f3d64106d8a88376808a";

const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer=document.querySelector(".weather-container");
const searchForm = document.querySelector("[data-searchForm]");
const userInfoContainer = document.querySelector(".user-info-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const loadingScreen = document.querySelector('.loading-container');

const notFound = document.querySelector('.error-container');
const errorBtn = document.querySelector('[data-errorbutton]');
const errorText = document.querySelector('[data-errortext]');
const errorImage = document.querySelector('[data-errorimg]');

// initially needed variables
let oldTab = userTab;
oldTab.classList.add("current-tab");
getFromSessionStorage();

// function of switchTab
function switchTab(newTab) {
    notFound.classList.remove("active");
    // check if newTab is already selected or not 
    if (newTab != oldTab) {
        oldTab.classList.remove("current-tab");
        oldTab = newTab;
        oldTab.classList.add("current-tab");  
        // Check which TAb is Selected - search / your

        // If Search Form not contains active class then add  [Search Weather]
        if (!searchForm.classList.contains("active")) {// means ye invisible hai makes visible
            searchForm.classList.add("active");
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
        }
        // Your Weather wala tab h
        else {
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            // this fxn  gives your weather updates
            getFromSessionStorage();
        }
    }
}
userTab.addEventListener("click",()=>{
    // passed clicked tab as input parameter
   switchTab(userTab);
});

searchTab.addEventListener("click",()=>{
switchTab(searchTab);
});
function renderWeatherInfo(data){
     notFound.classList.remove("active"); 
    // now fetch the data 
    const cityName = document.querySelector('[data-cityName]');
    const countryFlag = document.querySelector('[data-countryIcon]');
    const description = document.querySelector('[data-weatherDesc]');
    const weatherIcon = document.querySelector('[data-weatherIcon]');
    const temp = document.querySelector('[data-temp]');
    const windspeed = document.querySelector('[data-windspeed]');
    const humidity = document.querySelector('[data-humidity]');
    const clouds = document.querySelector('[data-clouds]');

    // fetch values from weather info object and put it on UI element
    // iske liye api call karo fir usko json format mai change karo data aaiga wha sai access
      cityName.innerText=data?.name; 
      countryFlag.src=`https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
      description.innerText=data?.weather?.[0]?.description;
      weatherIcon.src = `https://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`; 
      temp.innerText=`${data?.main?.temp} °C`;
      windspeed.innerText = `${data?.wind?.speed.toFixed(2)} m/s`;
    humidity.innerText = `${data?.main?.humidity.toFixed(2)} %`;
    clouds.innerText = `${data?.clouds?.all.toFixed(2)} %`;
    // let newPara=document.createElement('p');
    // newPara.textContent=`${data?.main?.temp.toFixed(2)} °C `;
    // document.body.appendChild(newPara);
} 
async function fetchWeatherDetails(coordinates)
{
    const{lat,lon}=coordinates;
    // make grantcontainer invisible
    grantAccessContainer.classList.remove("active");
    // make loader visible
loadingScreen.classList.add('active');

    // API CALL
    try{
    const res= await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
   const data=await res.json();
   loadingScreen.classList.remove("active");
   userInfoContainer.classList.add("active");
   //console.log("Weather data:->" ,data);

//    let newPara=document.createElement('p');
//    newPara.textContent=`${data?.main?.temp.toFixed(2)} °C `
//    document.body.appendChild(newPara);   
// show the data on UI
renderWeatherInfo(data);
    }
    catch(err){
// handle the error here
loadingScreen.classList.remove("active");
  console.log('found error:',err);
    }

}
// Check if coordinates are already present in session storage
function getFromSessionStorage() {
    //it tells session storage kai andar koi user coordinates h ki nhi
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    // console.log(localCoordinates);

    // Local Coordinates Not present - Grant Access Container
    if (!localCoordinates) {
        grantAccessContainer.classList.add('active');
    }
    else {
        const coordinates = JSON.parse(localCoordinates);
        fetchWeatherDetails(coordinates);
    }
}
function getLocation(){
    // means ye API active hai yaa nhi agar active h too showPosition fxn. call 
    if(navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert("Geolocation is not supported by your browser.");
    grantAccessContainer.classList.add('active');
    }
}
// use W3 Schools 
function showPosition(position){ 
  const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude
    };
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchWeatherDetails(userCoordinates); 
}
const grantAccessButton=document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click",getLocation);
 

// Search for weather
const searchInput = document.querySelector('[data-searchInput]');

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (searchInput.value === "") {
        return;
    }
    // console.log(searchInput.value);
    fetchSearchWeatherInfo(searchInput.value);
    searchInput.value = "";
});


async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    notFound.classList.remove("active");
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);

        const data = await response.json();
        if (!data.sys) {
            throw data;
        }
        loadingScreen.classList.remove('active');
        userInfoContainer.classList.add('active');
        renderWeatherInfo(data);
    }
    catch (err) {
        loadingScreen.classList.remove('active');
        userInfoContainer.classList.remove('active');
        notFound.classList.add('active');
        errorText.innerText = `${err?.message}`;
        errorBtn.style.display = "none";
    }
}
errorBtn.addEventListener("click", () => {
    searchForm.classList.add("active");
    notFound.classList.remove("active");
});

