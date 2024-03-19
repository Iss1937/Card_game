import styles from "./LeaderBoard.module.css";
import { Button } from "../../components/Button/Button";
//import { LeaderBoardItem } from "../../components/LeaderBoardItem/LeaderBoardItem";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getLeaders } from "../../api";
//import { useDispatch, useSelector } from "react-redux";
//import { setLeaders } from "../../store/cardSlice";

export function LeaderBoard() {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [scores, setScores] = useState([]);
  useEffect(() => {
    getLeaders()
      .then(leaders => {
        const sortedScores = [...leaders];
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
      <div className={styles.content}>
        <div className={styles.top}>
          <h1 className={styles.heading}>Лидерборд</h1>
          <Button children={"Начать игру"} onClick={() => navigate("/")} />
        </div>
        {isLoaded ? (
          <>
            <div className={styles.leaderboard_unit}>
              <div className={styles.leaderboard_ttl}>Position</div>
              <div className={styles.leaderboard_ttl}>User</div>
              <div className={styles.leaderboard_ttl}>Time</div>
            </div>
            {scores.map((e, index) => (
              <div key={e.id} className={styles.leaderboard_unit}>
                <div className={styles.leaderboard_text}>{index + 1}</div>
                <div className={styles.leaderboard_text}>{e.name}</div>
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
    </div>
  );
}
