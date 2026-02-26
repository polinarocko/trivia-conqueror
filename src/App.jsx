import { use, useEffect, useState, useSyncExternalStore } from 'react'
import './App.css'
import Modal from './Modal'

function App() {
  // state
  const [zones, setZones] = useState(Array.from({ length: 96 }, (v, i) => {
    return {
      selected: false,
      owner: null
    }
  }))

  // these are states
  const [availablezones, setAvailablezones] = useState(8)
  const [modalshowing, setModalshowing] = useState(false)
  const [turn, setTurn] = useState("Red")
  const [redcounter, setRedcounter] = useState(0)
  const [blueconter, setBluecounter] = useState(0)
  const [round, setRound] = useState("Exploration")
  const [charentities, setCharentities] = useState(["&quot;", "&#039;"])

  useEffect(() => {
    let freezones = zones.filter((z) => z.owner == null)
    if (freezones.length == 0) {
      setRound("Battle")
      setRedcounter(zones.filter((z) => z.owner == "red").length)
      setBluecounter(zones.filter((z) => z.owner == "blue").length)
    }
  }, [zones])



  function handleZone(i) {
    setZones((zones) => {
      let nextzones = [...zones]
      let selectedzone = nextzones[i]
      if (selectedzone.selected) {
        selectedzone.selected = null
        setAvailablezones(az => az + 1)
      }
      else {
        if (availablezones > 0 && selectedzone.owner == null) {
          if (turn == "Blue") {
            selectedzone.selected = "blueselected"
          }
          else {
            selectedzone.selected = "redselected"
          }
          setAvailablezones(az => az - 1)
        }
      }
      return nextzones
    })

  }

  function handleStartgame() {
    setModalshowing(true)

  }

  function handleAnswer(answer) {
    setSelectedanswer(answer)
    if (answer == data.correct_answer) {
      setAnswerclass("green")
      setZones((zones) => {
        let nextzones = [...zones]
        nextzones.map(el => {
          if (el.selected == "redselected") {
            el.owner = "red"
            el.selected = false
          }
          if (el.selected == "blueselected") {
            el.owner = "blue"
            el.selected = false
          }
        })
        return nextzones
      })
    }
    else {
      setAnswerclass("red")
      setZones((zones) => {
        let nextzones = [...zones]
        nextzones.map(el => {
          el.selected = false
        })
        return nextzones
      })
    }

    setTimeout(() => {
      setAnswerclass(null)
      setSelectedanswer("")
      setModalshowing(false)
      setAvailablezones(8)
      setTurn((t) => {
        let nextturn = t
        if (t == "Red") {
          nextturn = "Blue"
        }
        else {
          nextturn = "Red"
        }
        return nextturn
      })

    }, 2000)
  }

  return (
    <>
      {
        modalshowing && <Modal turn = {turn} setZones = {setZones} setModalshowing = {setModalshowing} setAvailablezones = {setAvailablezones} setTurn = {setTurn}></Modal>
      }

      <div className="container">
        <h2>Trivia Conqueror</h2>
        <h3>ROUND: {round}</h3>
        <h5 className={turn}>{turn}'s turn</h5>
        <div data-turn={turn} id="zones">
          {
            zones.map((z, i) => {
              return <div key={i} onClick={() => handleZone(i)} className={`${z.owner ? z.owner : ""} zone ${z.selected} Battle`}>
              </div>
            }
            )
          }
        </div>
        <h6>{availablezones < 1 ? "hard" : (availablezones < 3 ? "medium" : "easy")}</h6>
        {
          availablezones < 8 && <button onClick={() => handleStartgame()}>start game</button>
        }
        <h4>red collected: {redcounter} spaces</h4>
        <h4>blue collected: {blueconter} spaces</h4>
      </div>
    </>
  )
}

export default App

// https://opentdb.com/api.php?amount=1&type=multiple

// &quot; &quot;

// &#039;

