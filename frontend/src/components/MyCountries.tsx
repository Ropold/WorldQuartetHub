import type {CountryModel} from "./model/CountryModel.ts";
import {useState} from "react";
import axios from "axios";

type MyQuestionsProps = {
    user: string;
    favorites: string[];
    toggleFavorite: (questionId: string) => void;
    isEditing: boolean;
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
    handleUpdateCountry: (updatedCountry: CountryModel) => void;
    handleDeleteCountry: (countryId: string) => void;
}

export default function MyCountries(props: Readonly<MyQuestionsProps>) {
    const [userCountries, setUserCountries] = useState<CountryModel[]>([]);
    const [editData, setEditData] = useState<CountryModel | null>(null);
    const [image, setImage] = useState<File | null>(null);
    const [countryToDelete, setCountryToDelete] = useState<string | null>(null);
    const [showPopup, setShowPopup] = useState(false);
    const [imageChanged, setImageChanged] = useState(false);
    const [imageDeleted, setImageDeleted] = useState(false);

    function getUserCountries() {
        axios.get(`/api/users/me/my-countries/${props.user}`)
            .then((response) => {
                setUserCountries(response.data as CountryModel[]);
            })
            .catch((error) => {
                console.error("Error fetching countries:", error);
            });
    }
    useState(() => {
        getUserCountries();
    });

    function handleEditCountry(countryId: string) {
        const countryToEdit = userCountries.find(country => country.id === countryId);
        if (countryToEdit) {
            setEditData(countryToEdit);
            props.setIsEditing(true);

            if (countryToEdit.imageUrl) {
                fetch(countryToEdit.imageUrl)
                    .then((response) => response.blob())
                    .then((blob) => {
                        const file = new File([blob], "current-image.jpg", { type: blob.type });
                        setImage(file);
                    })
                    .catch((error) => console.error("Error loading current image:", error));
            }
        }
    }

    function handleSaveEdit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!editData) return;

        let updatedImageUrl = editData.imageUrl;
        if (imageChanged) {
            if (image) {
                updatedImageUrl = "temp-image";
            } else if (imageDeleted) {
                updatedImageUrl = ""; // oder ggf. null, je nach Backend-API
            }
        }

        const updatedCountryData = {
            ...editData,
            imageUrl: updatedImageUrl,
        };

        const data = new FormData();
        if (imageChanged && image) {
            data.append("image", image);
        }
        data.append(
            "countryModel",
            new Blob([JSON.stringify(updatedCountryData)], { type: "application/json" })
        );

        axios
            .put(`/api/world-quartet-hub/${editData.id}`, data, {
                headers: { "Content-Type": "multipart/form-data" },
            })
            .then((response) => {
                props.handleUpdateCountry(response.data);
                setUserCountries((prev) =>
                    prev.map((c) => (c.id === response.data.id ? response.data : c))
                );
                props.setIsEditing(false);
                setImageDeleted(false);
            })
            .catch((error) => {
                console.error("Error saving country edits:", error);
                alert("An unexpected error occurred. Please try again.");
            });
    }

    function onFileChange (e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files) {
            setImage(e.target.files[0]);
            setImageChanged(true);
        }
    }

    function handleDeleteClick(id: string) {
        setCountryToDelete(id);
        setShowPopup(true);
    }

    function handleCancel(){
        setCountryToDelete(null);
        setShowPopup(false);
    }

    function handleConfirmDelete() {
        if (countryToDelete) {
            axios
                .delete(`/api/world-quartet-hub/${countryToDelete}`)
                .then(() => {
                    props.handleDeleteCountry(countryToDelete);
                    setUserCountries((prev) =>
                        prev.filter((c) => c.id !== countryToDelete)
                    );
                    setCountryToDelete(null);
                    setShowPopup(false);
                })
                .catch((error) => {
                    console.error("Error deleting question:", error);
                    alert("An unexpected error occurred. Please try again.");
                });
        }
        setCountryToDelete(null);
        setShowPopup(false);
    }

    return (
        <h2>My Countries</h2>
    )
}