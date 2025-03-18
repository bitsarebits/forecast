import React, { useState } from "react";
import "./HomePage.css";
import { useNavigate } from "react-router";
import axios from "axios";
import addressFromOpenMeteoAPI from "../../types/address";

const __DEV__ = process.env.NODE_ENV === "development"; // npm install  --save-dev  @types/node

function HomePage() {
    // Hooks
    const navigate = useNavigate();

    // State
    const [address, setAddress] = useState(__DEV__ ? "Verona" : "");
    const [enableRainData, setEnableRainData] = useState(false);

    // Methods

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // non serve await, perchè l'esecuzione del codice può proseguire senza attendere la risoluzione della promessa
        axios // npm install axios
            .get<addressFromOpenMeteoAPI>(
                // su browser -> Network con filtro: Fetch/XHR
                `https://geocoding-api.open-meteo.com/v1/search?name=${address}&count=10&language=en&format=json`,
            )
            .then((res) => {
                // then ==> promessa risolta
                console.log("Latitude", res.data.results[0].latitude);
                console.log("Longitude", res.data.results[0].longitude);
                navigate(
                    `/forecast?latitude=${res.data.results[0].latitude}&longitude=${res.data.results[0].longitude}&address=${address}&enableRainData=${enableRainData}`); //query params
            })
            .catch(() => {
                console.error("Error while loading data");
            });


    };

    // Render
    return (
        <div className="container">
            <form onSubmit={onSubmit} className="form">
                <h2>Forecast app</h2>
                <input
                    type="text"
                    value={address}
                    onChange={(e) => {
                        setAddress(e.target.value);
                    }}
                    required // require = true  ==> campo obbligatorio, avviso se vuoto
                    placeholder="Address"
                />
                <label>
                    <input
                        type="checkbox"
                        checked={enableRainData}
                        onChange={(e) => {
                            setEnableRainData(e.target.checked);
                        }}
                    />
                    Enable Rain Data
                </label>
                <button className="form-button">Search</button>
            </form>
        </div>
    );
}

export default HomePage;
