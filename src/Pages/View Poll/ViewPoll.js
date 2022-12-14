import PollHeader from "../../Components/Poll Header/PollHeader";
import {
  AiOutlineLink,
  AiOutlineQrcode,
  AiOutlineTwitter,
} from "react-icons/ai";
import "./ViewPoll.css";
import { Redirect, useHistory, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import QRCode from "qrcode.react";
import { Modal } from "@material-ui/core";
import { toast, ToastContainer } from "react-toastify";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { percentageCounter, totalVotesHelper } from "../../HelperFunctions";
import axios from "axios";
import io from "socket.io-client";
import SkeletonLoader from "../../Components/SkeletonLoader";

const pollServerUrl = process.env.REACT_APP_URL;

const socket = io.connect("https://swift-poll.onrender.com");

const ViewPoll = () => {
  const history = useHistory();
  const [showQr, setShowQr] = useState(false);
  const { id } = useParams();
  const [pollQuestions, setPollQuestions] = useState("");
  const [pollAnswers, setPollAnswers] = useState([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [pollSubmitted, setPollSubmitted] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [pollLoad, setPollLoad] = useState(false);
  const pollUrl = `${process.env.REACT_APP_CLIENT_URL}poll/result/${id}`;

  useEffect(() => {
    const pollValidatior = () => {
      const pollSubmitted = localStorage.getItem(id);
      if (pollSubmitted !== null) {
        setPollSubmitted(true);
      }
    };
    axios
      .get(`${pollServerUrl}/getPollData/${id}`)
      .then((res) => {
        setPollQuestions(res.data.question);
        setPollAnswers(res.data.ansArray);
        setTotalVotes(totalVotesHelper(res.data.ansArray));
        setPollLoad(true);
        pollValidatior();
      })
      .catch((err) => setRedirect(true));
    socket.emit("connectPoll", { id });
    socket.on("updatedPoll", (payload) => {
      console.log(payload);
      setPollAnswers(payload);
      setTotalVotes(totalVotesHelper(payload));
    });
  }, [id]);

  const urlCopiedhandler = () => {
    toast.success("Copied", {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
    });
  };
  return (
    <div className="viewPollContainer">
      {redirect && <Redirect to="/" />}
      <div>
        <PollHeader />
      </div>
      <div className="maxWidthContainer">
        <div className="viewPoll">
          <div className="quesHolder">
            <div className="viewPollQuestion">
              <span className="submitQuestion">{pollQuestions}</span>
            </div>
          </div>
          <div className="optionsSharing">
            <div className="optionsContainer">
              {!pollLoad ? (
                <SkeletonLoader />
              ) : (
                <>
                  {pollAnswers?.length > 1 &&
                    pollAnswers.map(
                      (ans) =>
                        ans.value && (
                          <div className="option">
                            <div className="valPer">
                              <span className="submitValue">{ans.value}</span>
                              <span className="submitPercentage">
                                {" "}
                                {percentageCounter(totalVotes, ans.count)}%
                              </span>
                            </div>
                            <div className="progressBar">
                              <div
                                className="progressStatus"
                                style={{
                                  width: `${percentageCounter(
                                    totalVotes,
                                    ans.count
                                  )}%`,
                                }}
                              ></div>
                            </div>
                            <div className="viewPollCount">
                              <span className="vote">{ans.count} Votes</span>
                            </div>
                          </div>
                        )
                    )}
                </>
              )}
            </div>
            <div className="sharingSubmitContainer">
              <div
                className={`submitPollButton ${
                  pollSubmitted && "submitPollButtonDisabled"
                }`}
                onClick={() =>
                  !pollSubmitted && history.push(`/poll/submit/${id}`)
                }
              >
                <span>{pollSubmitted ? "Submited" : "Submit Poll"}</span>
              </div>
              <div className="votesShare">
                <div className="totalVoteHolder">
                  <span className="tvText">Total votes</span>
                  <span className="tvVotes">{totalVotes}</span>
                </div>
                <div className="sharePoll">
                  <span className="shareText">Share</span>
                  <div
                    className="shareButton"
                    style={{
                      color: "#5A20CB",
                    }}
                    onClick={() => setShowQr(true)}
                  >
                    <AiOutlineQrcode className="sharebuttonIcon" />
                    <span className="shareButtonText">Share QR Code</span>
                  </div>
                  <a
                    href={`https://twitter.com/intent/tweet?url=${pollUrl}`}
                    className="shareButton"
                    style={{
                      color: "#1DA1F2",
                    }}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <AiOutlineTwitter className="sharebuttonIcon" />
                    <span className="shareButtonText">Share on Twitter</span>
                  </a>
                  <CopyToClipboard text={pollUrl} onCopy={urlCopiedhandler}>
                    <div
                      className="shareButton"
                      style={{
                        color: "#E07C24",
                      }}
                    >
                      <AiOutlineLink className="sharebuttonIcon" />
                      <span className="shareButtonText">Copy Url</span>
                    </div>
                  </CopyToClipboard>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
      <Modal
        open={showQr}
        onClose={() => setShowQr(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        className="modalBody"
      >
        <div className="qrHolder">
          {/* NOTE the value of the qr will be the url of the poll. */}
          <span className="qrText">Scan me</span>
          <QRCode value={pollUrl} size={200} />
        </div>
      </Modal>
    </div>
  );
};

export default ViewPoll;
