import { useState } from "react";
import { useDebounce } from "use-debounce";
import SearchInput from "../../components/SearchInput/SearchInput";
import GroupList from "./components/GroupList";

import "./index.scss";

const GroupSearch = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);

  return (
    <div className="groupSearch">
      <h1 className="text-center">Discover Groups</h1>
      <SearchInput
        type="text"
        placeholder="Search groups..."
        onChange={({ target: { value } }) => setSearch(value)}
      />
      <GroupList search={debouncedSearch} />
    </div>
  );
};

export default GroupSearch;
