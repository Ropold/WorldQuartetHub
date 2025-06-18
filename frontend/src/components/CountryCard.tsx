import type {CountryModel} from "./model/CountryModel.ts";

type CountryCardProps = {
    country: CountryModel;
    user: string;
    favorites: string[];
    toggleFavorite: (animalId: string) => void;
    showButtons?: boolean;
    handleEditToggle?: (id: string) => void;
    handleDeleteClick?: (id: string) => void;
}

export default function CountryCard(props: Readonly<CountryCardProps>){
    return (
        <p>CountryCard</p>
    )
}