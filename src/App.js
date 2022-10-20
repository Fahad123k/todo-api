import './App.css';
import React, { useEffect, useState } from 'react'
import User from './components/User';
import AddUser from './components/AddUser';

const App = () => {
  const [users, setUsers] = useState([]);
  const jsonLink = 'https://jsonplaceholder.typicode.com/todos'
  useEffect(() => {
    fetchData();

  }, [])
  const fetchData = async () => {

    await fetch(jsonLink)
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => {
        console.log(err);
      })
  }

  // add new user
  const onAdd = async (name, email) => {

    await fetch(jsonLink, {
      method: 'POST',
      body: JSON.stringify({
        name: name,
        email: email
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => {
        if (response.status !== 201) {
          return
        }
        else {
          return response.json();
        }
      })
      .then((data) => {
        setUsers((users) => [...users, data])
      })
      .catch((err) => {
        console.log(err)
      });

  }

  // delelte user
  const onDelete = async (id) => {
    await fetch(jsonLink + `/${id}`, {
      method: 'DELETE'
    }).then((response) => {
      if (response.status !== 200) {
        return
      }

      else {
        setUsers(users.filter((user) => {
          return user.id !== id;
        }))
      }
    }).catch((err) => {
      console.log(err);
    })
  }

  const onEdit = async (id) => {
    await fetch(jsonLink + `/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        id: 1,
        title: 'foo',
        body: 'bar',
        userId: 1,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((json) => console.log(json));
  }

  // switchComplete
  const switchComplete = id => {
    const newUser = [...users];
    newUser.forEach((user, index) => {
      if (index+1 === id) {
        user.completed = !user.completed;
      }
    })
    setUsers(newUser)
  }
  // print userss on console
  console.log(users)
  return (
    <div className='App'>
      <h3>App based todo list</h3>
      <br />
      <AddUser onAdd={onAdd} />
      <div className='allList'>
        {
          users.map((user) => (
            <User
              id={user.id}
              key={user.id}
              title={user.title}
              completed={user.completed}
              onDelete={onDelete}
              onEdit={onEdit}
              checkComplete={switchComplete}
            />
          ))}
      </div>
    </div>
  )
}

export default App