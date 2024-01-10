import { useState } from "react";
import { useParams } from "react-router-dom";
import { BiPlus, BiTrash } from "react-icons/bi";
import { TiFlash } from "react-icons/ti";
import { ToastContainer, toast } from "react-toastify";
import PollHeader from "../../Components/Poll Header/PollHeader";

import "./CreatePoll.css";
import PollCreated from "../../Components/Poll Created/PollCreated";
import { Modal } from "@material-ui/core";
import axios from "axios";

const pollServerUrl = process.env.REACT_APP_URL;
const CreatePoll = ({ adminId }) => {
  const [ansHolder, setAnsHolder] = useState(["", ""]);
  const [pollCreated, setPollCreated] = useState(false);
  const [question, setQuestion] = useState();
  const [loading, setLoading] = useState(false);

  const params = useParams();

  const handelAddOption = () => {
    setAnsHolder([...ansHolder, ""]);
  };
  const removeOption = (index) => {
    const temp = ansHolder.filter((ans, idx) => {
      return idx !== index;
    });
    setAnsHolder(temp);
  };

  const handleAnsValue = (index) => (event) => {
    if (index === "question") {
      return setQuestion(event.target.value);
    }
    const value = event.target.value;
    const temp = [...ansHolder];
    temp[index] = value;
    setAnsHolder(temp);
  };

  const pollValidation = () => {
    if (question === "") {
      toast.warn("Enter question", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
      });
      return false;
    }

    // Checking validation for ans fields
    const alert = ansHolder.filter((ans) => ans !== "");
    if (alert.length !== ansHolder.length) {
      toast.warn("Enter all the fields", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
      });
      return false;
    }

    return true;
  };

  const resetPoll = () => {
    setQuestion("");
    setAnsHolder(["", ""]);
  };

  const submitPoll = () => {
    const validPoll = pollValidation();
    if (validPoll) {
      const pollId = params.id;

      const temp = [];

      ansHolder.forEach((ans) => {
        temp.push({ value: ans, count: 0 });
      });
      const poll = {
        pollId,
        ansArray: temp,
        question,
      };

      setLoading(true);

      axios
        .post(`${pollServerUrl}/createPoll`, poll)
        .then((res) => {
          setPollCreated(true);
          setLoading(false);
        })
        .catch((err) => {
          toast.error(err.response.data.error, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
          });
          setLoading(false);
        });
    }
  };

  return (
    <div className="pollContainer">
      <PollHeader />
      <div
        className="createPollContainer"
        style={{
          overflow: pollCreated && "hidden",
        }}
      >
        <div className="createSubContainer">
          <span className="createTitle">Create Poll</span>
          <div className="infoReset">
            <span className="pollGuideText">
              Complete below fields to create poll
            </span>
            <span className="pollReset" onClick={resetPoll}>
              Reset Poll
            </span>
          </div>
          <div className="pollQues">
            <span className="pollQuesText">Poll Question</span>
            <textarea
              type="text"
              className="quesText"
              placeholder="What's your favorite TV Show?"
              onChange={handleAnsValue("question")}
              value={question}
            />
            <div className="ansHolder">
              {ansHolder.map((ans, idx) => (
                <div className="pollans" key={idx}>
                  <span className="pollQuesText">Option {idx + 1}</span>
                  <div className="ansInputHolder">
                    <input
                      type="text"
                      className="ansText"
                      placeholder={`Option ${idx + 1}`}
                      onChange={handleAnsValue(idx)}
                      value={ans}
                    />
                    {ansHolder.length > 2 && (
                      <BiTrash
                        className="optionTrashIcon"
                        onClick={() => removeOption(idx)}
                      />
                    )}
                  </div>
                </div>
              ))}
              <div className="resCreateDiv">
                {" "}
                <div
                  className="createPageButton addOption"
                  onClick={handelAddOption}
                >
                  <span>Add another option</span>
                  <BiPlus className="addOptionIcon" />
                </div>
              </div>
            </div>
            <hr className="createPollDivder" />
            <div className="resCreateDiv">
              <button
                className={`createPageButton createPollButton ${
                  loading && "createPollButtonDisabled"
                }`}
                onClick={submitPoll}
                disabled={loading}
              >
                {loading ? (
                  "Creating Poll..."
                ) : (
                  <>
                    <span>Create Poll</span>
                    <TiFlash className="addOptionIcon" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
      <Modal
        open={pollCreated}
        onClose={() => setPollCreated(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        className="modalBody"
      >
        <PollCreated pollId={params.id} adminId={adminId} />
      </Modal>
    </div>
  );
};

export default CreatePoll;
