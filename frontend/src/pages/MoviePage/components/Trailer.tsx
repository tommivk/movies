import { Movie } from "../../../../types";

const Trailer = ({ movie }: { movie: Movie }) => {
  const trailer = movie.trailer;
  if (!trailer?.key) return null;

  return (
    <div className="trailer" data-cy="trailer">
      <h1>Trailer</h1>
      <div className="trailer__wrapper">
        <iframe
          className="trailer__video"
          src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(
            trailer.key,
          )}`}
          title={trailer.name || `${movie.title} trailer`}
          loading="lazy"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    </div>
  );
};

export default Trailer;
