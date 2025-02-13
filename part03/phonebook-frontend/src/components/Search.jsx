const Search = ({ searchTerm, handleSearchChange }) => (
    <div>
        filter shown with 
        <input 
            value={searchTerm}
            onChange={handleSearchChange}
        />
    </div>
);

export default Search;
