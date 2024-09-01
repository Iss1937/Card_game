import { Button } from "../Button/Button";
import { Link } from "react-router-dom";
import { addScore } from "../../api";
import { useState } from "react";
import { useAchievements } from "../../context/AchievementContext";
import deadImageUrl from "./images/dead.png";
import celebrationImageUrl from "./images/celebration.png";
import styles from "./EndGameModal.module.css";

export function EndGameModal({ isWon, gameDurationSeconds, gameDurationMinutes, onClick }) {
  const currentDifficulty = localStorage.getItem("currentDifficulty");
  const { achievementsList } = useAchievements();

  const [username, setUsername] = useState("");
  const handleUsername = e => {
    setUsername(e.target.value);
  };

  const handleScore = () => {
    if (username.trim() === "") {
      alert("Введите имя.");
      console.log("username not set. using default value: 'Пользователь'");
      setUsername("Пользователь");
      return;
    }
    const totalTimeInSeconds = gameDurationMinutes * 60 + gameDurationSeconds;
    addScore({ name: username, time: totalTimeInSeconds, achievements: achievementsList })
      .then(() => {
        alert("Результат сохранен.");
        onClick();
      })
      .catch(error => {
        console.warn(error);
        alert("Ошибка сохранения.");
      });
  };

  const title = isWon ? (currentDifficulty === "9" ? "Вы попали на лидерборд!" : "Вы выиграли!") : "Вы проиграли!";

  const imgSrc = isWon ? celebrationImageUrl : deadImageUrl;

  const imgAlt = isWon ? "celebration emodji" : "dead emodji";

  return (
    <div className={styles.modal}>
      <img className={styles.image} src={imgSrc} alt={imgAlt} />
      <div className={styles.title}>{title}</div>
      {isWon && currentDifficulty === "9" && (
        <input
          className={styles.input_user}
          type="text"
          value={username}
          onChange={handleUsername}
          placeholder="Введите имя"
        />
      )}
      {isWon && currentDifficulty === "9" && (
        <button className={styles.buttonmode_addscore} onClick={() => handleScore()}>
          Добавить
        </button>
      )}
      <p className={styles.description}>Потраченное время:</p>
      <div className={styles.time}>
        {gameDurationMinutes.toString().padStart("2", "0")}.{gameDurationSeconds.toString().padStart("2", "0")}
      </div>

      <Button onClick={onClick}>Играть сначала</Button>
      <Link to="/">
        <Button>Главная</Button>
      </Link>
      {isWon && currentDifficulty === "9" && (
        <Link className={styles.title_leaderboard} to="/leaderboard">
          Перейти в лидерборд
        </Link>
      )}
    </div>
  );
}
