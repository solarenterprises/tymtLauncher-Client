import { Button } from "@mui/material";

interface props {
  onClick: () => void;
}

const Back = ({ onClick }: props) => {
  const handlebackEnter = (event: any) => {
    event.currentTarget.querySelector("path").setAttribute("fill", "white");
  };
  const handlebackLeave = (event: any) => {
    event.currentTarget.querySelector("path").setAttribute("fill", "#AFAFAF");
  };
  return (
    <Button className={"back-button-home"} onClick={onClick}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="25"
        height="25"
        viewBox="0 0 25 24"
        fill="none"
        onMouseEnter={handlebackEnter}
        onMouseLeave={handlebackLeave}
      >
        <path d="M7.78038 12.5L13.5724 18.292L12.8594 19L5.85938 12L12.8594 5L13.5724 5.708L7.78038 11.5H19.8594V12.5H7.78038Z" fill="#AFAFAF" />
      </svg>
    </Button>
  );
};

export default Back;
