import './App.css';
import React, { useEffect, useState } from 'react'
import User from './components/User';
import AddUser from './components/AddUser';

const App = () => {
  // some constant and global varibles and useState
  const [users, setUsers] = useState([]);
  const [upperLimit,addupperLimit] = useState(200);
  const jsonLink = 'https://jsonplaceholder.typicode.com/todos'
  var lowerLimit=195;

  // useEffect for continous fetching api on component
  useEffect(() => {
    fetchData();

  }, [])


  // fetching data arrow function
  const fetchData = async () => {

    await fetch(jsonLink)
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => {
        console.log(err);
      })
  }

  // add new todo
  const onAdd = async (name) => {

    await fetch(jsonLink, {
      method: 'POST',
      body: JSON.stringify({
      title: name,
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
        setUsers((users) => [...users, data]);
        // upperLimit=upperLimit-1;
        addupperLimit(upperLimit+1);
      })
      .catch((err) => {
        console.log(err)
      });

  }

  // delelte todo
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
        addupperLimit(upperLimit-1);
      }
    }).catch((err) => {
      console.log(err);
    })
  }

  // function to handle edit dummy api
  const handleEditTodos = async (editvalue,id) => {
    
    await fetch(jsonLink+`/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        id: id,
        title: editvalue
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log(data+"==udatedd ")
        setUsers((users) => [...users,data])
        alert(data.title+"  Edited at id-"+id)
      })
      .catch((err) => {
        console.log(err)
      });
  }

// switch check isDone or not
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
  // console.log(users)
  return (
    <div className='App'>
      <h3>CREATE YOUR TODO AS YOUR WISH</h3>
      <br />
      <AddUser onAdd={onAdd} />
      <div className='allList'>
        {
          users.slice(lowerLimit,upperLimit).map((user) => (
            <User 
              id={user.id}
              key={user.id}
              title={user.title}
              completed={user.completed}
              onDelete={onDelete}
              handleEditTodos={handleEditTodos}
              checkComplete={switchComplete}
            />
          ))}
      </div>
    </div>
  )
}

export default App