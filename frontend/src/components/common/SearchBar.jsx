import "./SearchBar.css";

const SearchBar = ({ value, onChange, placeholder }) => {
  return (
    <input
      className="search-bar"
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
};

export default SearchBar;