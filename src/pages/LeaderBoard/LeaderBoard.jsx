import styles from "./LeaderBoard.module.css";
import { Button } from "../../components/Button/Button";
import { LeaderBoardItem } from "../../components/LeaderBoardItem/LeaderBoardItem";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { getLeaders } from "../../api";
import { useDispatch, useSelector } from "react-redux";
import { setLeaders } from "../../store/cardSlice";

export function LeaderBoard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let position = 1;
  const leaders = useSelector(state => state.cards.leaders);

  useEffect(() => {
    getLeaders().then(leaders => dispatch(setLeaders(leaders)));
  }, [dispatch]);

  const sortedLeaders = useMemo(() => {
    return [...leaders].sort((a, b) => a.time - b.time);
  }, [leaders]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.top}>
          <h1 className={styles.heading}>Лидерборд</h1>
          <Button children={"Начать игру"} onClick={() => navigate("/")} />
        </div>
        <LeaderBoardItem isTemplate={true} />
        {sortedLeaders.map(leader => {
          return (
            <LeaderBoardItem
              key={leader.id}
              position={position++}
              user={leader.name}
              time={leader.time}
              isTemplate={false}
            />
          );
        })}
      </div>
    </div>
  );
}
