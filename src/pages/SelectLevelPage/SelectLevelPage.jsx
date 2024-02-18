import { Link } from "react-router-dom";
import styles from "./SelectLevelPage.module.css";
import { useSelector, useDispatch } from "react-redux";
import { gameModeReducer } from "../../store/cardSlice";

export function SelectLevelPage() {
  const dispatch = useDispatch();

  const gameModeReducered = event => {
    dispatch(gameModeReducer(event.target.value));
    console.log("click");
    console.log(gameRegime);
  };
  const gameRegime = useSelector(state => state.cards.gameRegime);
  return (
    <div className={styles.container}>
      <div className={styles.modal}>
        <h1 className={styles.title}>Выбери сложность</h1>
        <ul className={styles.levels}>
          <li className={styles.level}>
            <Link className={styles.levelLink} to="/game/3">
              1
            </Link>
          </li>
          <li className={styles.level}>
            <Link className={styles.levelLink} to="/game/6">
              2
            </Link>
          </li>
          <li className={styles.level}>
            <Link className={styles.levelLink} to="/game/9">
              3
            </Link>
          </li>
        </ul>
        <div className={styles.checkbox}>
          <label htmlFor="activateMode">
            <input type="checkbox" className={styles.input} checked={gameRegime} onChange={gameModeReducered}></input>
          </label>
          <h2>Играть до 3-х ошибок</h2>
        </div>
      </div>
    </div>
  );
}
