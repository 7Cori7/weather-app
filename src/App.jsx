import { useEffect, useState } from "react"
import './App.css'
import Footer from './components/footer/footer';
import Weather from './components/weather/weather';
import useLocalStorage from './components/useLocalStorage/useLocalStorage';

const weathers = [
  'clear sky',
  'few clouds',
  'scattered clouds',
  'broken clouds',
  'shower rain',
  'rain',
  'thunderstorm',
  'snow',
  'mist'
];

function App() {

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [weatherData, setWeatherData] = useState(null);

  const [theme, setTheme] = useLocalStorage('theme', 'default');

  function handleToggleTheme(){
    if(weatherData !== null){

      if(weatherData.description === 'clear sky' || weatherData.description === 'few clouds' || weatherData.description === 'scattered clouds'){
        setTheme('sunny');
      }else if(weatherData.description === 'shower rain' || weatherData.description === 'light rain' || weatherData.description === 'rain' || weatherData.description === 'thunderstorm' || weatherData.description === 'snow' || weatherData.description === 'mist'){
        setTheme('rainy');
      }else{
        setTheme('default');
      }

    }
  }

  const appID = import.meta.env.VITE_REACT_APP_API_ID;

  function geolocationAPI(){
    navigator.geolocation.getCurrentPosition(position => {
        const {latitude, longitude} = position.coords;
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${appID}`
        getWeather(url)
    });
  };

  async function getWeather(url){
    try {
        
        setLoading(true);
        const response = await fetch(url);
        const result = await response.json();

        if(result){
            setTimeout(()=>{
                if(result.cod === '404'){

                    setLoading(false);
                    setErrorMsg(`Error, ${result.message}`); 
                }else{
                    setLoading(false);
                    setErrorMsg(null);
                    setData(result);
                }
            },1000);
        }

    } catch (error) {
        console.log(error);
        setErrorMsg(`An error has occurred, ${error}`);
    }
  };

  function setData(result){
      setWeatherData({
          city: result.name,
          country: result.sys.country,
          temp: convert(result.main.temp),
          max: convert(result.main.temp_max),
          min: convert(result.main.temp_min),
          humidity: result.main.humidity,
          description: result.weather[0] ? result.weather[0].description : '',
          icon: result.weather[0] ? result.weather[0].icon : ''
      });
  };

  function convert(kelvin){

      const celcius = Number(kelvin - 273.15);
      return celcius.toFixed();
  };

  useEffect(()=>{

    geolocationAPI();
  }, []);

  useEffect(()=>{

    handleToggleTheme();
  }, [weatherData])

  console.log(theme)

  return (
    <div className="App" data-theme={theme}>
      <Weather
      loading = {loading}
      setLoading = {setLoading}
      errorMsg = {errorMsg}
      setErrorMsg = {setErrorMsg}
      weatherData = {weatherData}
      setData = {setData}
      />
      <Footer />
    </div>
  );
}

export default App
