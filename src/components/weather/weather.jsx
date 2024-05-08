import { useEffect, useState } from "react"
import Search from "../search/search";
import lupa from "../../../public/lupa.svg";


export default function Weather(){

    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const [weatherData, setWeatherData] = useState(null);

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

    async function handleSearch(){

        const url = `https://api.openweathermap.org/data/2.5/weather?q=${search}&appid=${appID}`;
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

    function getCurrentDate(){
        return new Date().toLocaleDateString('en-us', {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric"
        });
    };

    useEffect(()=>{

        geolocationAPI();
    }, []);

    return <div className="weather-app-container">

        <div className='search-container'>
            <Search
            search={search}
            setSearch={setSearch}
            handleSearch={handleSearch}
            />
        </div>
        {
            loading && <div><img src={lupa} alt="loading spinner" /></div>
        }
        {
            errorMsg !== null && !loading && <div><h3 style={{color:'red'}}>{errorMsg}😵</h3></div>
        }
        {
            weatherData !== null && !loading && errorMsg == null && <div className="weather-info">
                <h3>{weatherData.city}, <span>{weatherData.country}</span></h3>
                <p>{getCurrentDate()}</p>
                <h1>{weatherData.temp}°C</h1>
                <h2>{weatherData.min}° / {weatherData.max}°</h2>
                <p>humidity: {weatherData.humidity}</p>
                <h2 style={{textTransform: 'capitalize'}}>{weatherData.description}</h2>
                <img src={`https://openweathermap.org/img/wn/${weatherData.icon}.png`} alt="icon" />
            </div>
        }
        {
            weatherData == null && !loading && errorMsg == null && <div className="weather-info">
                <h2>You haven't initialized a search yet</h2>
            </div>
        }
    </div>
}