import styles from "./EndGameModal.module.css";

import { Button } from "../Button/Button";

import deadImageUrl from "./images/dead.png";
import celebrationImageUrl from "./images/celebration.png";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { addLeader } from "../../api";

export function EndGameModal({ isWon, gameDurationSeconds, gameDurationMinutes, onClick }) {
  const [username, setUsername] = useState("");
  const buttonRef = useRef();
  const currentLevel = localStorage.getItem("currentLevel");

  const handleUsername = e => {
    setUsername(e.target.value);
  };

  const addToLeaderboard = () => {
    if (username.trim() === "") {
      alert("Пожалуйста введите свое имя.");
      console.log("username not set. using default value: 'user'");
      setUsername("user");
      return;
    }
    const timer = gameDurationMinutes * 60 + gameDurationSeconds;
    addLeader({ name: username, time: timer })
      .then(() => {
        alert("Результат сохранен.");
        onClick();
      })
      .catch(error => {
        console.warn(error);
        alert("Ошибка сохранения.");
      });
  };

  const title = isWon ? (currentLevel === "9" ? "Вы попали на Лидерборд!" : "Вы победили!") : "Вы проиграли!";

  const imgSrc = isWon ? celebrationImageUrl : deadImageUrl;

  const imgAlt = isWon ? "celebration emodji" : "dead emodji";

  return (
    <div className={styles.modal}>
      <img className={styles.image} src={imgSrc} alt={imgAlt} />
      <h2 className={styles.title}>{title}</h2>
      {isWon && currentLevel === "9" && (
        <>
          <input
            id="inputName"
            className={styles.username}
            type="text"
            name="name"
            pattern="^[^\s]+(\s.*)?$"
            placeholder="Пользователь"
            value={username}
            onChange={event => handleUsername(event.target.value)}
            required
          />
          <button className={styles.addButton} ref={buttonRef} onClick={() => addToLeaderboard()}>
            Отправить
          </button>
        </>
      )}
      <p className={styles.description}>Затраченное время:</p>
      <div className={styles.time}>
        {gameDurationMinutes.toString().padStart("2", "0")}.{gameDurationSeconds.toString().padStart("2", "0")}
      </div>

      <Button onClick={onClick}>Начать сначала</Button>
      {isWon && currentLevel === "9" && (
        <Link className={styles.leaderboardLink} to="/leaderboard">
          Перейти к лидерборду
        </Link>
      )}
    </div>
  );
}
