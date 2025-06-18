import type {CountryModel} from "./model/CountryModel.ts";

type SearchBarProps = {
    searchQuery: string;
    setSearchQuery: (value: string) => void;
    allCountries: CountryModel[];
}

export default function SearchBar(props: Readonly<SearchBarProps>) {
    return(
        <p>Searchbar</p>
    )
}