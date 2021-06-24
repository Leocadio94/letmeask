import { useHistory, useParams } from "react-router-dom";

import { Toaster } from "react-hot-toast";

import logoImg from "../assets/images/logo.svg";
import deleteImg from "../assets/images/delete.svg";

import { Button } from "../components/Button";
import { RoomCode } from "../components/RoomCode";
import { Question } from "../components/Question";

import { useRoom } from "../hooks/useRoom";

import "../styles/room.scss";
import { database } from "../services/firebase";

type RoomParams = {
    id: string;
};

export function AdminRoom() {
    // const { user } = useAuth();
    const history = useHistory();
    const params = useParams<RoomParams>();
    const roomId = params.id;

    const { questions, roomTitle } = useRoom(roomId);

    async function handleEndRoom() {
        if (window.confirm("Tem certeza que você deseja encerrar esta sala?")) {
            await database.ref(`rooms/${roomId}`).update({
                closedAt: new Date(),
            });

            history.push("/");
        }
    }

    async function handleDeleteQuestion(questionId: string) {
        if (
            window.confirm("Tem certeza que você deseja excluir esta pergunta?")
        ) {
            await database
                .ref(`rooms/${roomId}/questions/${questionId}`)
                .remove();
        }
    }

    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask" />
                    <div>
                        <RoomCode code={roomId} />
                        <Button isOutlined onClick={handleEndRoom}>
                            Encerrar sala
                        </Button>
                    </div>
                </div>
            </header>

            <main>
                <div className="room-title">
                    <h1>Sala {roomTitle}</h1>
                    {questions.length > 0 && (
                        <span>{questions.length} pergunta(s)</span>
                    )}
                </div>

                <div className="question-list">
                    {questions.map((question) => (
                        <Question
                            key={question.id}
                            content={question.content}
                            author={question.author}
                        >
                            <button
                                type="button"
                                onClick={() =>
                                    handleDeleteQuestion(question.id)
                                }
                            >
                                <img src={deleteImg} alt="Remover pergunta" />
                            </button>
                        </Question>
                    ))}
                </div>
            </main>

            <Toaster position="bottom-left" />
        </div>
    );
}
