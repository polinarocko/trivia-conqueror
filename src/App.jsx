import { use, useEffect, useState, useSyncExternalStore } from 'react'
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
  const [availablezones, setAvailablezones] = useState(8)
  const [modalshowing, setModalshowing] = useState(false)
  const [data, setData] = useState(null)
  const [buttons, setButtons] = useState([])
  const [answerclass, setAnswerclass] = useState("")
  const [selectedanswer, setSelectedanswer] = useState("")
  const [turn, setTurn] = useState("Red")
  const [redcounter, setRedcounter] = useState(0)
  const [blueconter, setBluecounter] = useState(0)
  const [round, setRound] = useState("Exploration")
  const [charentities, setCharentities] = useState(["&quot;", "&#039;"])

  useEffect(() => {
    console.log(zones)
    let freezones = zones.filter((z) => z.owner == null)
    console.log(freezones);
    if (freezones.length == 0) {
      setRound("Battle")
      setRedcounter(zones.filter((z) => z.owner == "red").length)
      setBluecounter(zones.filter((z) => z.owner == "blue").length)
    }
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
    fetch('https://opentdb.com/api.php?amount=1&difficulty=easy&type=multiple')
      .then(response => response.json())
      .then(data => setData(() => {
        // data.results[0]
        let nextdata = data.results[0]
        nextdata.question = nextdata.question.replace("&quot;", '"')
        nextdata.question = nextdata.question.replace("&#039;", '"')
        // console.log(nextdata);
        
        return nextdata
      }))

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
        modalshowing && <div className={"modal " + turn}>
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
                  } type='button' disabled={selectedanswer == "" ? false : true} >{a}</button>

                })
              }
            </div>
          </form>
        </div>
      }

      <div className="container">
        <h2>Trivia Conqueror</h2>
        <h3>ROUND: {round}</h3>
        <h5 className={turn}>{turn}'s turn</h5>
        <div data-turn={turn} id="zones">
          {
            zones.map((z, i) => {
              return <div onClick={() => handleZone(i)} className={`${z.owner ? z.owner : ""} zone ${z.selected} Battle`}>
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

