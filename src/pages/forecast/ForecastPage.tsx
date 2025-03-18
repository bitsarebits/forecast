import { useEffect, useRef, useState } from "react";
import "./ForecastPage.css";
import axios from "axios";
import { openMeteoForecastResponse } from "../../types/responses";
import weatherData from "../../types/entities";
import { useSearchParams } from "react-router";


function ForecastPage() {
    // Hooks
    const [searchParams] = useSearchParams();       // recupero query params

    // State
    const [isLoading, setIsLoading] = useState(false);
    const [weatherData, setWeatherData] = useState<weatherData[]>([]); // tipo generico
    const enableRainData = searchParams.get("enableRainData");      // query param
    
    // References
    const isInizializedRef = useRef(false);     // evita richiami multipli API
    
    // Methods
    
    const fromOpenMeteoForecastResponseToWeatherData = (
        openMeteoForecastResponse: openMeteoForecastResponse,
    ) => {
        const nextWeatherData: weatherData[] = [];

        let index = 0;
        // iterate over items
        for (const time of openMeteoForecastResponse.hourly.time) {
            // loop su parametro qualunque, mi interessa l'indice
            
            nextWeatherData.push({
                time,
                humidity:
                openMeteoForecastResponse.hourly.temperature_2m[index],
                windSpeed:
                openMeteoForecastResponse.hourly.wind_speed_10m[index],
                temperature:
                openMeteoForecastResponse.hourly.temperature_2m[index],
                rain: openMeteoForecastResponse.hourly.rain[index],
            });
            index++;
        }
        
        setWeatherData(nextWeatherData);
    };
    
    //  dichiaro la funzione async (asincrona)
    const fetchData = async () => {
        setIsLoading(true);
        
        // recupero query params
        const latitude = searchParams.get("latitude");
        const longitude = searchParams.get("longitude");
        
        // gestione errore dati mancanti
        if (!latitude || !longitude) {
            console.error("Latitude or Longitude is missing");
            setIsLoading(false);
            return;
        }
        
        // res è una promise => await aspetta la risposta (promessa risolta)
        // !!!  const res =   non usato  !!!
        await axios // npm install axios
        .get<openMeteoForecastResponse>(
            // su browser -> Network con filtro: Fetch/XHR
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m,rain`,
        )
        .then((res) => {
            // then ==> promessa risolta
            fromOpenMeteoForecastResponseToWeatherData(res.data);
        })
        .catch(() => {
            console.error("Error while loading data");
        })
        .finally(() => {
            setIsLoading(false);
        });
    };
    
    // hook useEffects
    useEffect(() => {
        // funzione eseguita ogni volta che cambia lo stato e rieseguito al mutare delle dependencies tra []
        // mettiamo qui le chiamate API, anche se in realtà si usano altre librerie
        if (isInizializedRef.current) return;
        // terminato il caricamento verifico in console i parametri ricevuti dalla HomePage
        console.log("Latitude", searchParams.get("latitude"));
        console.log("Longitude", searchParams.get("longitude"));
        console.log("enableRainData", searchParams.get("enableRainData"));
        isInizializedRef.current = true;        // richiamo API una sola volta
        fetchData();
    }, [searchParams]);
    
    // Render
    return (
        <div className="forecast-container">
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <div className="weather-cards-container">
                    <h3>Weather Forecast for {searchParams.get("address")}</h3>
                    {weatherData.map((data) => (
                        <div key={data.time} className="weather-data">
                            <p>Time: {new Date(data.time).toLocaleString()}</p>
                            <p>Temperature: {data.temperature} °C</p>
                            <p>Humidity: {data.humidity} %</p>
                            <p>Wind Speed: {data.windSpeed} km/h</p>
                            {enableRainData && <p>Rain: {data.rain} mm</p>}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ForecastPage;
