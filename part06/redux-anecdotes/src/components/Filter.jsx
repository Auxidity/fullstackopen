import { useDispatch } from 'react-redux'
import { filterChange } from '../reducers/filterReducer'

const Filter = (props) => {
    const dispatch = useDispatch()

    const handleChange = (event) => {
        event.preventDefault()
        const content = event.target.value
        dispatch(filterChange(content.trim() === '' ? 'ALL' : content))

    }

    const style = {
        marginBottom: 10
    }

    return (
        <div style={style}>
            filter <input name="filter" onChange={handleChange} />
        </div>
    )
}

export default Filter
