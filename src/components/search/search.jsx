

export default function Search({ search, setSearch, handleSearch }){

    function handleKeyDown(e){
        
        if (e.key === 'Enter' || e.code === 'Enter'){
            handleSearch();
        };
    };

    return (
        <div className="search-engine">

            <input
            type="text"
            placeholder="Enter city name"
            name="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            />
            <button onClick={handleSearch}>Search</button>
        </div>
    );
}