import { TiFlash } from "react-icons/ti";
import { useHistory } from "react-router-dom";
import "./PollHeader.css";
const PollHeader = () => {
  const history = useHistory();
  return (
    <div
      className="pollHeader"
      onClick={() => {
        history.push("/");
      }}
    >
      <div className="headerNameLogo">
        <TiFlash className="pollIcon" />
        <span className="headerName">Swift Poll</span>
      </div>
      <span className="headerInfo">
        Create instant, real-time polls for free
      </span>
    </div>
  );
};

export default PollHeader;
