

import { use, useEffect, useState, useSyncExternalStore } from 'react'

function Modal({ turn, setZones, setModalshowing, setAvailablezones, setTurn }) {

    const [data, setData] = useState(null)
    const [buttons, setButtons] = useState([])
    const [answerclass, setAnswerclass] = useState("")
    const [selectedanswer, setSelectedanswer] = useState("")
    const [charentities, setCharentities] = useState(["&quot;", "&#039;"])
    let modaltimeout = null;

    useEffect(() => {
        data && setButtons(() => {
            let answers = [data.correct_answer, ...data.incorrect_answers]
            answers.sort((a, b) => {
                return Math.random() > 0.5 ? 1 : -1
            })
            return answers
        })
        
    }, [data])
    
    useEffect(() => {
        console.log("15");
        modaltimeout = setTimeout(() => {
    
            setModalshowing(false)
        }, 15000)
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
    }, [])


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
            clearTimeout(modaltimeout)
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
            <div className={"modal " + turn}>
                <form action="">
                    <div className="line"></div>
                    <h3>difficulty : {data && data.difficulty}</h3>
                    <h1>{data && data.question}</h1>
                    <div className="options">
                        {
                            buttons.map((a, i) => {
                                return <button key={i} onClick={() => handleAnswer(a)} className={
                                    (selectedanswer !== "" && a == data.correct_answer && "green")
                                    + " " +
                                    (selectedanswer == a && answerclass)
                                } type='button' disabled={selectedanswer == "" ? false : true} >{a}</button>

                            })
                        }
                    </div>
                </form>
            </div>

        </>
    )
}

export default Modal
