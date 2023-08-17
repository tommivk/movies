import "./searchInput.scss";

type Props = React.InputHTMLAttributes<HTMLInputElement>;
const SearchInput = ({ ...props }: Props) => {
  return <input {...props} className="searchInput"></input>;
};

export default SearchInput;
