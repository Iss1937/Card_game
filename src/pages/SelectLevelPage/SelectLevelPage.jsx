import styles from "./SelectLevelPage.module.css";
import { useDispatch, useSelector } from "react-redux";
import { gameModeReducer } from "../../store/cardSlice";
import { Button } from "../../components/Button/Button";
import { setCurrentLevel } from "../../store/cardSlice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export function SelectLevelPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [choosenLevel, setChoosenLevel] = useState(null);

  const handleButtonClick = () => {
    if (choosenLevel !== null) {
      dispatch(setCurrentLevel({ choosenLevel }));
      navigate(`/game/${choosenLevel}`);
    }
  };

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
          <li className={choosenLevel === 3 ? styles.choosenLevel : styles.level} onClick={() => setChoosenLevel(3)}>
            1
          </li>
          <li className={choosenLevel === 6 ? styles.choosenLevel : styles.level} onClick={() => setChoosenLevel(6)}>
            2
          </li>
          <li className={choosenLevel === 9 ? styles.choosenLevel : styles.level} onClick={() => setChoosenLevel(9)}>
            3
          </li>
        </ul>
        <div className={styles.checkbox}>
          <label htmlFor="activateMode">
            <input type="checkbox" className={styles.input} checked={gameRegime} onChange={gameModeReducered}></input>
          </label>
          <h2>Играть до 3-х ошибок</h2>
        </div>
        <Button onClick={handleButtonClick}>Играть</Button>
      </div>
    </div>
  );
}
