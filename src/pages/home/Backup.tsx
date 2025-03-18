import React, { useState } from "react";
import "./HomePage.css";
import { useNavigate } from "react-router";

const __DEV__ = process.env.NODE_ENV === "development"; // npm install  --save-dev  @types/node

function HomePage() {
    // Hooks
    const navigate = useNavigate();

    // State
    const [address, setAddress] = useState("");
    const [latitude, setLatitude] = useState(__DEV__ ? "45.4383842" : ""); // se sono in dev uso coordinate predefinite
    const [longitude, setLongitude] = useState(__DEV__ ? "10.9916215" : "");
    const [enableRainData, setEnableRainData] = useState(false);

    // Methods
    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        navigate(`/forecast?latitude=${latitude}&longitude=${longitude}`); //query params
    };

    // Render
    return (
        <div className="container">
            <form onSubmit={onSubmit} className="form">
                <h2>Forecast app</h2>
                <input
                    type="number"
                    value={latitude}
                    onChange={(e) => {
                        setLatitude(e.target.value);
                    }}
                    required // require = true  ==> campo obbligatorio, avviso se vuoto
                    placeholder="Latitude"
                />
                <input
                    type="number"
                    value={longitude}
                    onChange={(e) => {
                        setLongitude(e.target.value);
                    }}
                    required
                    placeholder="Longitude"
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
