import PollHeader from "../../Components/Poll Header/PollHeader";
import { ReactComponent as Check } from "../../Asset/Check.svg";
import "./SubmitPoll.css";
import { IoChevronForward } from "react-icons/io5";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
const pollServerUrl = process.env.REACT_APP_URL;
const SubmitPoll = () => {
  const { id } = useParams();
  const [poll, setPoll] = useState({ question: "", ans: [] });
  const [ansSelectedArray, setAnsSelectedArray] = useState([]);
  const [selectedAnsIndex, setSelectedAnsIndex] = useState("");
  const { question, ans } = poll;
  const [pollVoted, setPollVoted] = useState(false);

  useEffect(() => {
    axios.get(`${pollServerUrl}/getPollData/${id}`).then((res) => {
      console.log(res.data);
      setPoll({ question: res?.data?.qustion, ans: res?.data?.ansArray });
      setAnsSelectedArray(new Array(res?.data?.ansArray.length).fill(""));
      pollValidatior(res?.data?.ansArray.length);
    });
  }, []);

  const history = useHistory();

  const pollValidatior = (length) => {
    const pollSubmitted = localStorage.getItem(id);
    if (pollSubmitted !== null) {
      const temp = new Array(length).fill("");
      temp[pollSubmitted] = "selected";
      setPollVoted(true);
      return setAnsSelectedArray(temp);
    }
  };

  const optionSelectedHandler = (index) => {
    if (!pollVoted) {
      const temp = new Array(ansSelectedArray.length).fill("");
      temp[index] = "selected";
      setSelectedAnsIndex(index);
      setAnsSelectedArray(temp);
    }
  };

  const handleSubmit = () => {
    selectedAnsIndex !== "" && !pollVoted
      ? axios
          .post(`${pollServerUrl}/updatePoll/${id}/${selectedAnsIndex}`)
          .then((res) => {
            localStorage.setItem(id, selectedAnsIndex);
            setPollVoted(true);
            toast.success(res.data.message, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: false,
              progress: undefined,
            });
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
          })
      : toast.error(
          `${pollVoted ? "Already submited" : "Select the option to submit"}`,
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
          }
        );
  };

  return (
    <div className="submitPollcontainer">
      <PollHeader />
      <div className="submitPoll">
        <div className="quesOptionsReturn">
          <div className="submitQuestion">
            <span>{question}</span>
          </div>
          <div className="submitOptionsConatiner">
            {ans.map((answer, idx) => (
              <div
                className={`submitOption ${
                  ansSelectedArray[idx] === "selected" && "submitOptionSelected"
                }`}
                onClick={() => optionSelectedHandler(idx)}
              >
                {ansSelectedArray[idx] === "selected" ? (
                  <Check className="submitCheckBox" />
                ) : (
                  <div className="submitCheckBoxFalse" />
                )}

                <span className="optionValue ansSelectedArray[idx]">
                  {answer.value}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="submitResult">
          <div
            className={`submitPollButton ${
              pollVoted ? "submitedResponse" : "submitResponse"
            }`}
            onClick={handleSubmit}
          >
            <span>Submit Your Vote</span>
          </div>
          <div
            className="result"
            onClick={() => history.push(`/poll/result/${id}`)}
          >
            <span className="goResult">Jump to result</span>
            <IoChevronForward />
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SubmitPoll;
