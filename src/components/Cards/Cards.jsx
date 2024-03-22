import { shuffle } from "lodash";
import { generateDeck } from "../../utils/cards";
import { EndGameModal } from "../../components/EndGameModal/EndGameModal";
import { Button } from "../../components/Button/Button";
import { Card } from "../../components/Card/Card";
import { useContext, useEffect, useState } from "react";
import { ModeContext } from "../../context/ModeContext";
import { useAchievements } from "../../context/AchievementContext";
import styles from "./Cards.module.css";

const STATUS_LOST = "STATUS_LOST";
const STATUS_WON = "STATUS_WON";
const STATUS_IN_PROGRESS = "STATUS_IN_PROGRESS";
const STATUS_PREVIEW = "STATUS_PREVIEW";

function getTimerValue(startDate, endDate) {
  if (!startDate && !endDate) {
    return {
      minutes: 0,
      seconds: 0,
    };
  }

  if (endDate === null) {
    endDate = new Date();
  }

  const diffInSeconds = Math.floor((endDate.getTime() - startDate.getTime()) / 1000);
  const minutes = Math.floor(diffInSeconds / 60);
  const seconds = diffInSeconds % 60;
  return {
    minutes,
    seconds,
  };
}

export function Cards({ pairsCount = 3, previewSeconds = 5 }) {
  const { isEnabled } = useContext(ModeContext);
  const { addAchievement, resetAchievements } = useAchievements();
  const [cards, setCards] = useState([]);
  const [status, setStatus] = useState(STATUS_PREVIEW);
  const [gameStartDate, setGameStartDate] = useState(null);
  const [gameEndDate, setGameEndDate] = useState(null);
  const [timer, setTimer] = useState({
    seconds: 0,
    minutes: 0,
  });
  const maxAttempts = isEnabled ? 3 : 1;
  const [attempts, setAttempts] = useState(maxAttempts);
  const [guessedPairsCount, setGuessedPairsCount] = useState(0);

  // defies the guessed pairs amount
  useEffect(() => {
    if (cards && status === STATUS_IN_PROGRESS) {
      const pairs = cards.filter(e => e.guessed).length;
      if (pairs % 2 === 0) {
        setGuessedPairsCount(pairs / 2);
      }
    }
  }, [cards, status]);

  // "superpower" logics start
  const [isXRay, setIsXRay] = useState(false);
  const [isXRayActive, setIsXRayActive] = useState(false);
  const [isTimerStop, setIsTimerStop] = useState(false);
  const [isAlohomora, setIsAlohomora] = useState(false);

  // X-Ray: makes cards visible for 5 secs
  const xRay = () => {
    setIsTimerStop(true);
    if (isXRay) {
      return;
    }
    // disables alohomora function while xray is active
    setIsXRayActive(true);
    setCards(prevCards => {
      return prevCards.map(card => {
        return {
          ...card,
          open: true,
        };
      });
    });
    setTimeout(() => {
      setCards(prevCards => {
        return prevCards.map(card => {
          if (card.guessed) {
            return {
              ...card,
              open: true,
            };
          }
          return {
            ...card,
            open: false,
          };
        });
      });
      setIsXRayActive(false);
      setIsXRay(true);
      setIsTimerStop(false);
      let newDate = new Date(gameStartDate);
      newDate.setSeconds(newDate.getSeconds() + 5);
      setGameStartDate(newDate);
    }, 5000);
  };

  // Alohomora: opens one correct pair of cards or a pair for one opened card
  const alohomora = () => {
    if (isXRayActive) {
      return;
    }
    const cardsNotGuessed = cards.filter(cards => !cards.guessed);
    let firstCard = cardsNotGuessed.find(card => card.open);
    let secondCard;

    if (firstCard) {
      secondCard = cards.find(
        card => card.rank === firstCard.rank && card.suit === firstCard.suit && card.id !== firstCard.id,
      );
    } else {
      let randomIndex = Math.floor(cardsNotGuessed.length * Math.random());
      firstCard = cardsNotGuessed[randomIndex];
      secondCard = cardsNotGuessed.find(card => card.rank === firstCard.rank && card.suit === firstCard.suit);
    }

    if (firstCard && secondCard) {
      const nextCards = cards.map(card => {
        if (secondCard.id === card.id || firstCard.id === card.id) {
          return {
            ...card,
            open: true,
            guessed: true,
          };
        }
        return card;
      });

      setCards(nextCards);
      setIsAlohomora(true);
    }
  };
  // superpower logics end

  // added setguessedpairscount to all functions below
  function finishGame(status = STATUS_LOST) {
    setGameEndDate(new Date());
    setStatus(status);
    setGuessedPairsCount(0);

    if (status === STATUS_WON) {
      // added check for achievements
      if (!isAlohomora && !isXRay) {
        addAchievement(1);
      }
      if (!isEnabled) {
        addAchievement(2);
      }
    }
  }

  function startGame() {
    const startDate = new Date();
    setGameEndDate(null);
    setGameStartDate(startDate);
    setTimer(getTimerValue(startDate, null));
    setStatus(STATUS_IN_PROGRESS);
    setGuessedPairsCount(0);
    resetAchievements();
    setIsXRay(false);
    setIsAlohomora(false);
  }

  function resetGame() {
    setGameStartDate(null);
    setGameEndDate(null);
    setTimer(getTimerValue(null, null));
    setStatus(STATUS_PREVIEW);
    setAttempts(isEnabled ? 3 : 1);
    setGuessedPairsCount(0);
    resetAchievements();
    setIsXRay(false);
    setIsAlohomora(false);
  }

  // decreases attempts on player's mistake
  const handleAttempts = () => {
    const updatedAttempts = attempts - 1;
    setAttempts(updatedAttempts);
    if (updatedAttempts <= 0) {
      finishGame(STATUS_LOST);
    }
  };

  // main game logics
  const openCard = clickedCard => {
    if (clickedCard.open || status !== STATUS_IN_PROGRESS) {
      return;
    }

    const openCards = cards.filter(card => card.open && !card.guessed);

    if (openCards.length >= 2) {
      return;
    }

    const nextCards = cards.map(card => {
      if (card.id === clickedCard.id || card.guessed) {
        return {
          ...card,
          open: true,
        };
      }
      return card;
    });
    setCards(nextCards);

    const openPairs = nextCards.filter(card => card.open && !card.guessed);
    const guessedPairs = openPairs.filter(card =>
      openPairs.some(openCard => card.id !== openCard.id && card.suit === openCard.suit && card.rank === openCard.rank),
    );

    if (guessedPairs.length === 2) {
      const updatedCards = nextCards.map(card => {
        if (guessedPairs.some(guessedCard => card.id === guessedCard.id)) {
          return {
            ...card,
            guessed: true,
          };
        }
        return card;
      });
      setCards(updatedCards);
      const isPlayerWon = updatedCards.every(card => card.guessed);
      if (isPlayerWon) {
        finishGame(STATUS_WON);
      }
    } else if (openPairs.length === 2) {
      handleAttempts();
      setTimeout(() => {
        const resetCards = nextCards.map(card => {
          if (!card.guessed) {
            return {
              ...card,
              open: false,
            };
          }
          return card;
        });
        setCards(resetCards);
      }, 1000);
    }
  };

  const isGameEnded = status === STATUS_LOST || status === STATUS_WON;

  useEffect(() => {
    if (status !== STATUS_PREVIEW) {
      return;
    }
    if (pairsCount > 36) {
      alert("Impossible to make this amount of pairs");
      return;
    }
    setCards(() => {
      return shuffle(generateDeck(pairsCount, 10));
    });

    const timerId = setTimeout(() => {
      startGame();
    }, previewSeconds * 1000);

    return () => {
      clearTimeout(timerId);
    };
    // eslint-disable-next-line
    // eslint-disable-next-line
  }, [status, pairsCount, previewSeconds]);

  // added stopping the timer on x-ray use
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (isTimerStop) {
        return;
      }
      setTimer(getTimerValue(gameStartDate, gameEndDate));
    }, 300);
    return () => {
      clearInterval(intervalId);
    };
  }, [gameStartDate, gameEndDate, isTimerStop]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.timer}>
          {status === STATUS_PREVIEW ? (
            <div>
              <p className={styles.previewText}>Запоминайте пары!</p>
              <p className={styles.previewDescription}>Игра начнется через {previewSeconds} секунд</p>
            </div>
          ) : (
            <>
              <div className={styles.timerValue}>
                <div className={styles.timerDescription}>мин</div>
                <div>{timer.minutes.toString().padStart("2", "0")}</div>
              </div>
              .
              <div className={styles.timerValue}>
                <div className={styles.timerDescription}>сек</div>
                <div>{timer.seconds.toString().padStart("2", "0")}</div>
              </div>
            </>
          )}
        </div>
        {status === STATUS_IN_PROGRESS ? (
          <div className={styles.bar}>
            {/* Superpower buttons start */}
            <div className={styles.bar_element}>
              <button
                disabled={isXRay}
                title="Прозрение"
                hint="На 5 секунд показываются все карты. Таймер длительности игры на это время останавливается."
                className={styles.xray}
                onClick={xRay}
              ></button>
              <button
                title="Алохомора"
                hint="Открывается случайная пара карт."
                disabled={isAlohomora || isXRayActive}
                onClick={alohomora}
                className={styles.alohomora}
              ></button>
            </div>
            {/* Superpower buttons end */}
            <Button onClick={resetGame}>Играть сначала</Button>
          </div>
        ) : null}
      </div>

      <div className={styles.cards}>
        {cards.map(card => (
          <Card
            key={card.id}
            onClick={() => openCard(card)}
            open={status !== STATUS_IN_PROGRESS ? true : card.open}
            suit={card.suit}
            rank={card.rank}
            disabled={card.disabled}
          />
        ))}
      </div>

      <div className={styles.footer_box}>
        {/* attempts counter moved here */}
        <div className={styles.bar_element}>
          {isEnabled ? <p className={styles.attempts_txt}>Попыток: </p> : ""}
          {isEnabled ? (
            <p className={styles.attempts_counter}>
              {attempts} / {maxAttempts}
            </p>
          ) : (
            ""
          )}
        </div>
        {/* added guessed cards counter */}
        <p className={styles.attempts_txt}>Найденные пары: {guessedPairsCount}</p>
      </div>

      {isGameEnded ? (
        <div className={styles.modalContainer}>
          <EndGameModal
            isWon={status === STATUS_WON}
            gameDurationSeconds={timer.seconds}
            gameDurationMinutes={timer.minutes}
            onClick={resetGame}
          />
        </div>
      ) : null}
    </div>
  );
}
