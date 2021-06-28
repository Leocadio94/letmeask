import { useHistory, useParams } from 'react-router-dom';

import { Toaster } from 'react-hot-toast';

import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';
import emptyQuestionsImg from '../assets/images/empty-questions.svg';

import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { Question } from '../components/Question';

import { useRoom } from '../hooks/useRoom';

import '../styles/room.scss';
import { database } from '../services/firebase';

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
        if (window.confirm('Tem certeza que você deseja encerrar esta sala?')) {
            await database.ref(`rooms/${roomId}`).update({
                closedAt: new Date(),
            });

            history.push('/');
        }
    }

    async function handleDeleteQuestion(questionId: string) {
        if (
            window.confirm('Tem certeza que você deseja excluir esta pergunta?')
        ) {
            await database
                .ref(`rooms/${roomId}/questions/${questionId}`)
                .remove();
        }
    }

    async function handleCheckQuestionAsAnswered(questionId: string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isAnswered: true,
        });
    }

    async function handleHighlightQuestion(questionId: string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isHighlighted: true,
        });
    }

    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <a href="/">
                        <img src={logoImg} alt="Letmeask" />
                    </a>

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
                    {questions.length > 0 ? (
                        questions.map((question) => (
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
                                                handleCheckQuestionAsAnswered(
                                                    question.id
                                                )
                                            }
                                        >
                                            <img
                                                src={checkImg}
                                                alt="Marca pergunta como respondida"
                                            />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleHighlightQuestion(
                                                    question.id
                                                )
                                            }
                                        >
                                            <img
                                                src={answerImg}
                                                alt="Dar destaque à pergunta"
                                            />
                                        </button>
                                    </>
                                )}

                                <button
                                    type="button"
                                    onClick={() =>
                                        handleDeleteQuestion(question.id)
                                    }
                                >
                                    <img
                                        src={deleteImg}
                                        alt="Remover pergunta"
                                    />
                                </button>
                            </Question>
                        ))
                    ) : (
                        <div className="empty-question-list">
                            <img
                                src={emptyQuestionsImg}
                                alt="Lista de questões vazia"
                            />

                            <h2>Nenhuma pergunta por aqui...</h2>

                            <p>
                                Envie o código desta sala para seus amigos e
                                comece a responder perguntas!
                            </p>
                        </div>
                    )}
                </div>
            </main>

            <Toaster position="bottom-left" />
        </div>
    );
}
