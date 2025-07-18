import type {CountryModel} from "./model/CountryModel.ts";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {translatedModelInfo} from "./utils/TranslatedModelInfo.ts";

type AddCountryCardProps = {
    user: string;
    handleNewCountrySubmit: (newCountry: CountryModel) => void;
    language: string;
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
            {type: "application/json"}
        ));

        axios
            .post("/api/world-quartet-hub", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((response) => {
                props.handleNewCountrySubmit(response.data);
                navigate(`/country/${response.data.countryName}`);
            })
            .catch((error) => {
                alert("An unexpected error occurred. Please try again.");
                console.error(error);
            });
    }

    function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files) {
            const file = e.target.files[0];
            setImage(file);
        }
    }

    return (
        <>
            <h2>Add Country</h2>
            <form onSubmit={handleSubmit}>
                <div className="edit-form">
                <label>
                    {translatedModelInfo.countryName[props.language]}:
                    <input
                        className="input-small"
                        type="text"
                        value={countryName}
                        onChange={(e) => setCountryName(e.target.value)}
                    />
                </label>
                <label>
                    {translatedModelInfo.capitalCity[props.language]}:
                    <input
                        className="input-small"
                        type="text"
                        value={capitalCity}
                        onChange={(e) => setCapitalCity(e.target.value)}
                    />
                </label>
                <label>
                    {translatedModelInfo.populationInMillions[props.language]}:
                    <input
                        className="input-small"
                        type="text"
                        value={populationInMillions}
                        onChange={(e) => setPopulationInMillions(Number(e.target.value))}
                    />
                </label>
                <label>
                    {translatedModelInfo.populationDensityPerKm2[props.language]}:
                    <input
                        className="input-small"
                        type="text"
                        value={populationDensityPerKm2}
                        onChange={(e) => setPopulationDensityPerKm2(Number(e.target.value))}
                    />
                </label>
                <label>
                    {translatedModelInfo.capitalCityPopulation[props.language]}:
                    <input
                        className="input-small"
                        type="text"
                        value={capitalCityPopulation}
                        onChange={(e) => setCapitalCityPopulation(Number(e.target.value))}
                    />
                </label>
                <label>
                    {translatedModelInfo.gdpPerCapitaInUSD[props.language]}:
                    <input
                        className="input-small"
                        type="text"
                        value={gdpPerCapitaInUSD}
                        onChange={(e) => setGdpPerCapitaInUSD(Number(e.target.value))}
                    />
                </label>
                <label>
                    {translatedModelInfo.forestAreaPercentage[props.language]}:
                    <input
                        className="input-small"
                        type="text"
                        value={forestAreaPercentage}
                        onChange={(e) => setForestAreaPercentage(Number(e.target.value))}
                    />
                </label>
                <label>
                    {translatedModelInfo.totalAreaInKm2[props.language]}:
                    <input
                        className="input-small"
                        type="text"
                        value={totalAreaInKm2}
                        onChange={(e) => setTotalAreaInKm2(Number(e.target.value))}
                    />
                </label>
                <label>
                    {translatedModelInfo.roadNetworkLengthInKm[props.language]}:
                    <input
                        className="input-small"
                        type="text"
                        value={roadNetworkLengthInKm}
                        onChange={(e) => setRoadNetworkLengthInKm(Number(e.target.value))}
                    />
                </label>
                <label>
                    {translatedModelInfo.averageAnnualTemperatureInC[props.language]}:
                    <input
                        className="input-small"
                        type="text"
                        value={averageAnnualTemperatureInC}
                        onChange={(e) => setAverageAnnualTemperatureInC(Number(e.target.value))}
                    />
                </label>
                <label>
                    {translatedModelInfo.annualPrecipitationInMm[props.language]}:
                    <input
                        className="input-small"
                        type="text"
                        value={annualPrecipitationInMm}
                        onChange={(e) => setAnnualPrecipitationInMm(Number(e.target.value))}
                    />
                </label>
                </div>

                <div className="margin-top-20">
                <label>
                    Image:
                    <input type="file" onChange={onFileChange} />
                    {image && (
                        <img
                            src={URL.createObjectURL(image)}
                            alt={"image-preview"}
                            className="image-preview"
                        />
                    )}
                </label>
                </div>

                <button className="button-group-button margin-top-50" type="submit">Save Country</button>

            </form>
        </>
    );
}