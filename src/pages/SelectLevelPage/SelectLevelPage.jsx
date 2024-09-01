import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/Button/Button";
import { useContext, useEffect, useState } from "react";
import { ModeContext } from "../../context/ModeContext";
import styles from "./SelectLevelPage.module.css";

export function SelectLevelPage() {
  const { isEnabled, setIsEnabled } = useContext(ModeContext);
  const [difficulty, setDifficulty] = useState("3");

  const navigate = useNavigate();

  useEffect(() => {
    const savedEasyMode = localStorage.getItem("easyMode");
    if (savedEasyMode !== null) {
      setIsEnabled(savedEasyMode === "true");
    }
    const savedDifficulty = localStorage.getItem("currentDifficulty");
    if (savedDifficulty !== null) {
      setDifficulty(savedDifficulty);
    }
  }, [setIsEnabled]);

  const setDifficultyAndSave = pairs => {
    setDifficulty(pairs);
    localStorage.setItem("currentDifficulty", pairs.toString());
  };

  const gameStart = () => {
    localStorage.setItem("easyMode", isEnabled.toString());
    navigate(`/game/${difficulty}`);
  };

  const difficulties = [
    {
      id: 1,
      pairs: 3,
    },
    {
      id: 2,
      pairs: 6,
    },
    {
      id: 3,
      pairs: 9,
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.modal}>
        <h1 className={styles.title}>Выбери сложность</h1>

        <ul className={styles.levels}>
          {difficulties.map(e => (
            <li key={e.id} className={styles.level}>
              <button
                type="button"
                id={e.id}
                className={`${difficulty === e.pairs ? styles._selected_difficulty : ""} ${styles.levelLink}`}
                onClick={() => setDifficultyAndSave(e.pairs)}
              >
                {e.id}
              </button>
            </li>
          ))}
        </ul>

        <div className={styles.checkbox}>
          <label htmlFor="activateMode">
            <input
              type="checkbox"
              className={styles.input}
              checked={isEnabled}
              onChange={() => setIsEnabled(!isEnabled)}
            />
            <span className={styles.titleCheckbox}>Играть до 3-х ошибок</span>
          </label>
        </div>

        <Button onClick={gameStart}>Играть</Button>

        <Link className={styles.title_leaderboard} to="/leaderboard">
          Перейти в лидерборд
        </Link>
      </div>
    </div>
  );
}
