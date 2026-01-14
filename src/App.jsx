import { useEffect, useState, useSyncExternalStore } from 'react'
import './App.css'

function App() {
  // state
  const [zones, setZones] = useState(Array.from({ length: 96 }, (v, i) => {
    return {
      selected: false,
      owner: null
    }
  }))

  // these are states
  const [availablezones, setAvailablezones] = useState(5)
  const [modalshowing, setModalshowing] = useState(false)
  const [data, setData] = useState(null)
  const [buttons, setButtons] = useState([])
  const [answerclass, setAnswerclass] = useState("")
  const [selectedanswer, setSelectedanswer] = useState("")
  const [turn, setTurn] = useState("Red")

  useEffect(() => {
    console.log(zones)
  }, [zones])


  useEffect(() => {
    data && setButtons(() => {
      let answers = [data.correct_answer, ...data.incorrect_answers]
      answers.sort((a, b) => {
        return Math.random() > 0.5 ? 1 : -1
      })
      return answers
    })
  }, [data])


  function handleZone(i) {
    setZones((zones) => {
      let nextzones = [...zones]
      let selectedzone = nextzones[i]
      if (selectedzone.selected) {
        selectedzone.selected = null
        setAvailablezones(az => az + 1)
      }
      else {
        if (availablezones > 0) {
          if (turn == "Blue"){
            selectedzone.selected = "blueselected"
          }
          else{
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
    fetch('https://opentdb.com/api.php?amount=1&category=22&difficulty=medium&type=multiple')
      .then(response => response.json())
      .then(data => setData(data.results[0]))
  }

  function handleAnswer(answer) {
    setSelectedanswer(answer)
    if (answer == data.correct_answer) {
      setAnswerclass("green")
      setZones((zones) => {
        let nextzones = [...zones]
        nextzones.map(el => {
          if (el.selected == true) {
            el.owner = "red"
            el.selected = false
            
          }
        })
        return nextzones
      })
    }
    else {
      setAnswerclass("red")
    }
    setTimeout(() => {
      setModalshowing(false)
      setAvailablezones(5)
      setTurn((t) =>{
        let nextturn = t
        if (t == "Red"){
          nextturn = "Blue"
        }
        else{
          nextturn = "Red"
        }
        return nextturn
      })
      
    }, 2000)
  }

  return (
    <>
      {
        modalshowing && <div className="modal">
          <form action="">
            <h3>difficulty : {data && data.difficulty}</h3>
            <h1>{data && data.question}</h1>
            <div className="options">
              {
                buttons.map((a, i) => {
                  return <button onClick={() => handleAnswer(a)} className={
                    (selectedanswer !== "" && a == data.correct_answer && "green")
                    + " " +
                    (selectedanswer == a && answerclass)
                  } type='button'>{a}</button>
                })
              }
            </div>
          </form>
        </div>
      }

      <div className="container">
        <h2>Trivia Conqueror</h2>
        <h5 className={turn}>{turn}'s turn</h5>
        <div id="zones">
          {
            zones.map((z, i) => {
              return <div onClick={() => handleZone(i)} className={`${z.owner ? z.owner : ""} zone ${z.selected}`}>
              </div>
            }
            )
          }
        </div>
        <h6>{availablezones < 1 ? "hard" : (availablezones < 3 ? "medium" : "easy")}</h6>
        {
          availablezones < 5 && <button onClick={() => handleStartgame()}>start game</button>
        }
      </div>
    </>
  )
}

export default App

// https://opentdb.com/api.php?amount=1&type=multiple
