import { useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { Redirect } from "react-router-dom";
import { toast } from "react-toastify";
import { ReactComponent as Check } from "../../Asset/Check.svg";
import "./PollCreated.css";

const pollClientUrl = process.env.REACT_APP_CLIENT_URL;

const PollCreated = ({ pollId, adminId }) => {
  const [redirect, setRedirect] = useState(false);

  const makeRedirect = () => {
    if (redirect) {
      return <Redirect to={`/poll/result/${pollId}`} />;
    }
  };

  const urlCopiedhandler = () => {
    toast.success("Copied", {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
    });
  };
  return (
    <div className="pollCreatedContainer">
      {makeRedirect()}

      <div className="createdIcon">
        <Check style={{ height: "100%", width: "100%" }} />
      </div>
      <div className="successMessage">
        <span>Yay! Your poll has been creates successfully</span>
      </div>
      <div className="pollUrl">
        <span className="urlInfo">Below is the url for your poll</span>
        <div className="urlHolder">
          <span className="successUrl">
            {pollClientUrl}poll/result/{pollId}
          </span>
          <CopyToClipboard
            text={`${pollClientUrl}poll/result/${pollId}`}
            onCopy={urlCopiedhandler}
          >
            <div className="successCopyButton">
              <span>Copy</span>
            </div>
          </CopyToClipboard>
        </div>
      </div>
      <div className="visitButtons">
        <div
          className="createPageButton continueButton"
          onClick={() => setRedirect(true)}
        >
          <span>Visit Poll</span>
        </div>
      </div>
    </div>
  );
};

export default PollCreated;
