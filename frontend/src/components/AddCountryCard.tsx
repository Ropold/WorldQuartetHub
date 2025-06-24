import type {CountryModel} from "./model/CountryModel.ts";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";

type AddCountryCardProps = {
    user: string;
    handleNewCountrySubmit: (newCountry: CountryModel) => void;
}

export default function AddCountryCard(props: Readonly<AddCountryCardProps>) {

    const [countryName, setCountryName] = useState<string>("");
    const [capitalCity, setCapitalCity] = useState<string>("");
    const [populationInMillions, setPopulationInMillions] = useState<number>(0);
    const [populationDensityPerKm2, setPopulationDensityPerKm2] = useState<number>(0);
    const [capitalCityPopulation, setCapitalCityPopulation] = useState<number>(0);
    const [gdpPerCapitaInUSD, setGdpPerCapitaInUSD] = useState<number>(0);
    const [forestAreaPercentage, setForestAreaPercentage] = useState<number>(0);
    const [totalAreaInKm2, setTotalAreaInKm2] = useState<number>(0);
    const [roadNetworkLengthInKm, setRoadNetworkLengthInKm] = useState<number>(0);
    const [averageAnnualTemperatureInC, setAverageAnnualTemperatureInC] = useState<number>(0);
    const [annualPrecipitationInMm, setAnnualPrecipitationInMm] = useState<number>(0);
    const [image, setImage] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string>("");

    const navigate = useNavigate();

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const countryData = {
            countryName,
            capitalCity,
            populationInMillions,
            populationDensityPerKm2,
            capitalCityPopulation,
            gdpPerCapitaInUSD,
            forestAreaPercentage,
            totalAreaInKm2,
            roadNetworkLengthInKm,
            averageAnnualTemperatureInC,
            annualPrecipitationInMm,
        };

        const data = new FormData();

        if (image) {
            data.append("image", image);
        }

        data.append("countryModel", new Blob(
            [JSON.stringify(countryData)],
            { type: "application/json" }
        ));

        axios
            .post("/api/world-quartet-hub", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((response) => {
                navigate(`/country/${response.data.countryName}`);
            })
            .catch((error) => {
                alert("An unexpected error occurred. Please try again.");
                console.error(error);
            });
    }

    function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        if(e.target.files){
            const file = e.target.files[0];
            setImage(file);
            setImageUrl("temp-image")
        }
    }

    return (
        <h2>Add Country</h2>
    )
}