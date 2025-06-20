import "./styles/Searchbar.css"

type SearchBarProps = {
    searchQuery: string;
    setSearchQuery: (value: string) => void;
}

export default function SearchBar(props: Readonly<SearchBarProps>) {

    function handleReset() {
        props.setSearchQuery("");
    }
    return (
        <div className="search-bar">
            <input
                type="text"
                placeholder="Search by Country Name or other fields..."
                value={props.searchQuery}
                onChange={(e) => props.setSearchQuery(e.target.value)}
                className="search-input"
            />

            <button
                onClick={handleReset}
                className={`${props.searchQuery ? "button-group-button" : "button-grey"}`}
            >
                Reset Filters
            </button>
        </div>
    );
}