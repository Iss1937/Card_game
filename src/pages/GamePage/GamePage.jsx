import { useParams } from "react-router-dom";

import { Cards } from "../../components/Cards/Cards";
import { ErrorCounter } from "../../components/ErrorCounter/ErrorCounter";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { getLeaders } from "../../api";
import { useDispatch } from "react-redux";
import { setLeaders } from "../../store/cardSlice";

export function GamePage() {
  const dispatch = useDispatch();
  const { pairsCount } = useParams();
  const gameModeReducer = useSelector(state => state.cards.gameModeReducer);

  useEffect(() => {
    getLeaders().then(leaders => dispatch(setLeaders(leaders)));
  }, [dispatch]);

  return (
    <>
      <Cards pairsCount={parseInt(pairsCount, 10)} previewSeconds={5}></Cards>
      {gameModeReducer && <ErrorCounter />}
    </>
  );
}
