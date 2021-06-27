import { Fragment, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import Modal from "react-modal";

import { Button } from "../components/Button";
import { RoomCode } from "./../components/RoomCode";
import { Question } from "../components/Question";

// import { useAuth } from "../hooks/useAuth";
import { useRoom } from "../hooks/useRoom";
import { useTheme } from "../hooks/useTheme";

import { database } from "../services/firebase";

import logoImg from "../assets/images/logo.svg";
import deleteImg from "../assets/images/delete.svg";
import checkImg from "../assets/images/check.svg";
import answerImg from "../assets/images/answer.svg";

import "../styles/room.scss";
import "../styles/modal.scss";

type RoomParams = {
  id: string;
};

export function AdminRoom() {
  const customStyles = {
    content: {
      top: "35%",
      left: "45%",
      right: "auto",
      bottom: "auto",
      width: "400px",
      height: "150px",
      transform: "translate(-40%, -10%)",
      display: "flex",
      background: "#835afd",
      padding: "30px",
      borderRadius: '8px'
    },
  };
  // const { user } = useAuth();
  const history = useHistory();
  const params = useParams<RoomParams>();
  const roomId = params.id;
  const { theme, toggleTheme } = useTheme()

  const [isQuestionIdModalOpen, setIsQuestionIdModalOpen] = useState<string | undefined>();

  const [isEndRoom, setIsEndRoom] = useState<string | undefined>();

  const { title, questions } = useRoom(roomId);

  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    });

    history.push("/");
  }

  async function handleCheckQuestionAsAnswered(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true,
    });
  }

  async function handleHighLightQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: true,
    });
  }

  async function handleDeleteQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
  }

  return (
    <div id="page-room" className={theme}>
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <div>
            <RoomCode code={roomId} />
            <button onClick={toggleTheme}></button>
            <Button isOutlined onClick={() => setIsEndRoom(roomId)}>
              Encerrar sala
            </Button>
            <Modal
              isOpen={isEndRoom === roomId}
              onRequestClose={() => setIsEndRoom(undefined)}
              style={customStyles}
            >
              <p>Tem certeza que quer encerrar esta sala?</p>
              <span onClick={() => setIsEndRoom(undefined)}>x</span>
              <button onClick={() => handleEndRoom()}>Encerrar</button>
            </Modal>
          </div>
        </div>
      </header>

      <main className="content">
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>

        <div className="question-list">
          {questions.map((question) => {
            return (
              <Fragment key={question.id}>
                <Question
                  key={question.id}
                  content={question.content}
                  author={question.author}
                  isAnswered={question.isAnswered}
                  isHighlighted={question.isHighlighted}
                >
                  {!question.isAnswered && (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          handleCheckQuestionAsAnswered(question.id)
                        }
                      >
                        <img
                          src={checkImg}
                          alt="Marcar pergunta como respondida"
                        />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleHighLightQuestion(question.id)}
                      >
                        <img src={answerImg} alt="Dar destaque à pergunta" />
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsQuestionIdModalOpen(question.id)}
                  >
                    <img src={deleteImg} alt="Remover pergunta" />
                  </button>
                </Question>
                <Modal
                  style={customStyles}
                  isOpen={isQuestionIdModalOpen === question.id}
                  onRequestClose={() => setIsQuestionIdModalOpen(undefined)}
                >
                  <p>Tem certeza que deseja excluir esta pergunta?</p>
                  <span onClick={() => setIsQuestionIdModalOpen(undefined)}>
                    x
                  </span>
                  <button onClick={() => handleDeleteQuestion(question.id)}>
                    Deletar
                  </button>
                </Modal>
              </Fragment>
            );
          })}
        </div>
      </main>
    </div>
  );
}
