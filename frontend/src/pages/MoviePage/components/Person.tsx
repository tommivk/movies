import { Link } from "react-router-dom";
import { Cast } from "../../../../types";
import { getProfileImageUrl } from "../../../../utils";

const Person = ({ person }: { person: Cast }) => {
  const placeholder = (
    <div className="person__image">
      <div className="person__placeholder">👤</div>
    </div>
  );
  return (
    <Link className="link" to={`/actors/${person.id}`}>
      <div className="person">
        {person.profilePath ? (
          <img
            className="person__image"
            src={getProfileImageUrl(person.profilePath, "xs")}
          />
        ) : (
          placeholder
        )}
        <div className="person__details">
          <h3 className="person__name">{person.name}</h3>
          <p className="person__character">
            {person.character ? person.character : person.job}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default Person;
