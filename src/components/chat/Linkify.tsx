import { openLink } from "../../lib/api/Downloads";

const Linkify = ({ children }) => {
  const isUrl = (word) => {
    const urlPattern = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/gm;
    return word.match(urlPattern);
  };

  const handleClick = (path) => {
    openLink(path);
  };

  const words = children.split(" ");
  const formattedWords = words.map((word, index) => {
    if (isUrl(word)) {
      return (
        <a
          key={index}
          href="#"
          onClick={(e) => {
            e.preventDefault(); // Prevent default link behavior
            handleClick(word); // Call handleClick with the URL
          }}
          style={{ color: "#000000", textDecoration: "underline" }}
        >
          {word}
        </a>
      );
    }
    return <span key={index}>{word} </span>; // Add space after each word
  });

  return <div>{formattedWords}</div>;
};

export default Linkify;
