import { customAlphabet } from "nanoid";
import { useHistory } from "react-router-dom";
import { Typewriter } from "react-simple-typewriter";
import { ReactComponent as PollScreen } from "../../Asset/PollScreen.svg";
import { RiMenu4Fill, RiStackshareLine } from "react-icons/ri";
import { FiLock } from "react-icons/fi";

import "./Home.css";
const nanoidString =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";

const Home = () => {
  const history = useHistory();
  // setting nanoId custom series of alphabets with custom lenght.
  const nanoid = customAlphabet(nanoidString, 15);
  return (
    <div className="home">
      <div className="homeContainer">
        <div className="containerLeft">
          <span className="displayTextHome">
            Create instant, real-time <br />
            <span style={{ color: "#4ad97f" }}>polls</span> for{" "}
            <span>
              <Typewriter
                words={["fun", "work", "free", "feedback", "engagement"]}
                loop={false}
                // cursor Uncomment this if not want to use the cursor
                // cursorStyle="|"
                typeSpeed={70}
                deleteSpeed={50}
                delaySpeed={1000}
              />
            </span>
          </span>
          <div
            className="homeCreateButton"
            onClick={() => history.push(`/poll/${nanoid()}`)}
          >
            <span>Create Poll</span>
          </div>
          <div className="pollTagLine">
            <span>
              No registration required, it’s 100% free and takes less than a
              minute
            </span>
          </div>
        </div>
        <div className="containerRight">
          <PollScreen className="pollImage" />
        </div>
      </div>
      <div className="pollInfoContainer">
        <div className="pollInfo">
          <RiMenu4Fill className="pollInfoIcon" style={{ color: "#e21717" }} />
          <span className="info">
            With swift poll you can create a stunning looking poll instantly
          </span>
        </div>
        <div className="pollInfo">
          <FiLock className="pollInfoIcon" style={{ color: "#00D84A" }} />
          <span className="info">
            Get clear and accurate poll results with cookie or IP security
            checking
          </span>
        </div>
        <div className="pollInfo">
          <RiStackshareLine
            className="pollInfoIcon"
            style={{ color: "#F4BE2C" }}
          />
          <span className="info">
            Share polls privately or with the world. With QR code or url.
          </span>
        </div>
      </div>
    </div>
  );
};

export default Home;
