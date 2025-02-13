import { useState, useEffect } from 'react'
import './index.css'
import components from './components/Notification'
const { Notification, ErrorNotification } = components;
import Search from './components/Search';
import PersonList from './components/PersonList'
import AddPerson from './components/AddPerson'
import Filter from './components/Filter'
import contactsService from './services/contacts'

const App = () => {
    const [persons, setPersons] = useState([]) 
    const [newName, setNewName] = useState('')
    const [newPhone, setNewPhone] = useState('')
    const [searchTerm, setSearchTerm] = useState('')
    const [errorMessage, setErrorMessage] = useState(null)
    const [notificationMessage, setNotificationMessage] = useState(null)

    useEffect(() => {
        console.log('effect')
        contactsService
            .getAll()
            .then(initialContacts => {
                setPersons(initialContacts
        )})
    }, [])
    console.log('render', persons.length, 'persons')


    const handleNameChange = (event) => {
        setNewName(event.target.value);
    }
    
    const handlePhoneChange =(event) => {
        setNewPhone(event.target.value);
    }
    
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    }

    const handleDelete = (id, name) => {
        const isConfirmed = window.confirm('Are you sure you want to remove ' + name + '?');
        
        if(isConfirmed) {
        contactsService
            .remove(id)
            .then (() => {
                setPersons(persons.filter(person => person.id !== id));
            })
        }
    } 

    const handleAddPerson = (event) => {
        event.preventDefault();
        if (newName.trim() === '' || newPhone.trim() === ''){
            alert('Both name and phone number fields must be filled out!')
            return;
        }

        if (persons.some(person => person.name === newName)) {
            const existingPerson = persons.find(person => person.name === newName);

            const isConfirmed = window.confirm(newName + ' is already added to phonebook, replace the old number with a new one?');
            if (isConfirmed) {
                contactsService
                    .update(existingPerson.id, { name: newName, number: newPhone})
                    .then(updatedPerson => {
                        setPersons(persons.map(person => 
                            person.id === existingPerson.id ? updatedPerson : person
                        ));
                    setNewName('');
                    setNewPhone('');
                })
                .catch(error => {
                    console.log(error.response.data.error)
                    setErrorMessage(error.response.data.error)
                        //setErrorMessage('Information of ' + existingPerson.name + ' has already been removed from server')
                    setTimeout(() => setErrorMessage(null), 5000)
                });
            }

            return;
        }

        contactsService
            .create({ name: newName, number: newPhone })
            .then(returnedPerson => {
                setPersons(persons.concat(returnedPerson))
                setNotificationMessage('Added ' + newName)
                setTimeout(() => setNotificationMessage(null), 3000)
            })
            .catch(error => {
                console.log(error.response.data.error)
                setErrorMessage(error.response.data.error)
                setTimeout(() => setErrorMessage(null), 5000)
            })
        setNewName('')
        setNewPhone('')
    }

    const filteredPersons = Filter(persons, searchTerm);

    return (
        <div>
            <h2>Phonebook</h2>
            <Notification message={notificationMessage} />
            <ErrorNotification message={errorMessage} />
            <Search searchTerm={searchTerm} handleSearchChange={handleSearchChange} />

            <AddPerson handleAddPerson={handleAddPerson} newName={newName} handleNameChange={handleNameChange} newPhone={newPhone} handlePhoneChange={handlePhoneChange} />

            <h2>Numbers</h2>
            <PersonList persons={filteredPersons} handleDelete={handleDelete} />
        </div>
    )
}

export default App
