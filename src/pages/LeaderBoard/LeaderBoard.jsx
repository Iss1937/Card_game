import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/Button/Button";
import { getScores } from "../../api";
import styles from "./LeaderBoard.module.css";

export function LeaderBoard() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [scores, setScores] = useState([]);
  useEffect(() => {
    getScores()
      .then(data => {
        const sortedScores = [...data];
        sortedScores.sort((a, b) => a.time - b.time);
        setScores(sortedScores);
      })
      .catch(error => {
        console.warn(error);
      })
      .finally(() => {
        setIsLoaded(true);
      });
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.headerh1}>Лидерборд</h1>
        <h4 className={styles.headerh4}>Лучшие результаты в сложном режиме</h4>
        <Link to="/">
          <Button>Играть</Button>
        </Link>
      </div>
      {isLoaded ? (
        <>
          <div className={styles.leaderboard_unit}>
            <div className={styles.leaderboard_ttl}>Позиция</div>
            <div className={styles.leaderboard_ttl}>Пользователь</div>
            <div className={styles.leaderboard_ttl}>Достижения</div>
            <div className={styles.leaderboard_ttl}>Время</div>
          </div>
          {scores.map((e, index) => (
            <div key={e.id} className={styles.leaderboard_unit}>
              <div className={styles.leaderboard_text}>{index + 1}</div>
              <div className={styles.leaderboard_text}>{e.name}</div>
              <td className={styles.achievements}>
                {e.achievements && (
                  <div className={styles.block_achievements}>
                    {e.achievements.includes(1) ? (
                      <button className={styles.puzzle} hint1="Игра пройдена в сложном режиме"></button>
                    ) : (
                      <button className={styles.puzzleGray}></button>
                    )}
                  </div>
                )}
                {e.achievements && (
                  <div className={styles.block_achievements}>
                    {e.achievements.includes(2) ? (
                      <button className={styles.vision} hint2="Игра пройдена без супер-сил"></button>
                    ) : (
                      <button className={styles.visionGray}></button>
                    )}
                  </div>
                )}
              </td>
              <div className={styles.leaderboard_text}>{e.time}</div>
            </div>
          ))}
        </>
      ) : (
        <div>
          <p className={styles.leaderboard_ttl}>Loading...</p>
        </div>
      )}
    </div>
  );
}
