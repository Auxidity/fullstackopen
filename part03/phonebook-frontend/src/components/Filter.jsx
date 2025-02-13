const Filter = (persons, searchTerm) => 
    persons.filter(person =>
        person.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

export default Filter
