import { useState } from 'react'

const Button = (props) => {
    return (
        <button onClick={props.onClick}>
            {props.text}
        </button>
    )
}

const StatisticsLine = ({text, value}) => {
    return (
        <tr>
            <td>{text}</td> 
            <td>{value}</td>
        </tr>
    );
}

const Statistics = ({ good, neutral, bad}) => {
    const sum = good + neutral + bad
    
    if (sum===0){
        return <p>No feedback given</p>
    }

    const average = sum > 0 ? (good - bad) / sum : 0
    const positivePercentage = sum > 0 ? (good/sum) * 100 : 0

    return (
        <div>
            <table>
                <tbody>
                    <StatisticsLine text="Good" value={good} />
                    <StatisticsLine text="Neutral" value={neutral} />
                    <StatisticsLine text="Bad" value={bad} />
                    <StatisticsLine text="All" value={sum} />
                    <StatisticsLine text="Average" value={average} />
                    <StatisticsLine text="Positive" value={positivePercentage} />
                </tbody>
            </table>
        </div>
    )
}

const App = () => {
    const [good, setGood] = useState(0)
    const [neutral, setNeutral] = useState(0)
    const [bad, setBad] = useState(0)

    const increaseByOneGood = () => setGood(good + 1)
    const increaseByOneNeutral = () => setNeutral(neutral + 1)
    const increaseByOneBad = () => setBad(bad + 1)

    return (
        <div>
            <h2>Give feedback</h2>
            
            <Button onClick={increaseByOneGood} text="good" />
            <Button onClick={increaseByOneNeutral} text="neutral" />
            <Button onClick={increaseByOneBad} text="bad" />

            <h2>Statistics</h2>
            <Statistics good={good} neutral={neutral} bad={bad}/>
        </div>
    )
}

export default App
