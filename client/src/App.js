import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import gql from "graphql-tag";
import { graphql, compose } from "react-apollo";
import Form from './Form'

const ToDosQuery = gql`
  {
    todos {
      id,
      text,
      complete
    }
  }
`
const UpdateMutation = gql`
  mutation($id: ID!, $complete: Boolean!) {
    updateTodo(id: $id, complete: $complete)
  }
`
const RemoveMutation = gql`
  mutation($id: ID!) {
    removeTodo(id: $id)
  }
`

class App extends Component {

  updateTodo = async todo => {
    await this.props.updateTodo({
      variables: {
        id: todo.id,
        complete: !todo.complete
      },
      update: store => {
        const data = store.readQuery({ query: ToDosQuery });
        data.todos = data.todos.map(
          x => x.id === todo.id
            ? {
              ...todo,
              complete: !todo.complete
              }
            : x
        );
        store.writeQuery({ query: ToDosQuery, data });
      },
    })
  };

  removeTodo = async todo => {
    await this.props.removeTodo({
      variables: {
        id: todo.id
      },
      update: store => {
        const data = store.readQuery({ query: ToDosQuery });
        data.todos = data.todos.filter(x => x.id !== todo.id);
        store.writeQuery({ query: ToDosQuery, data });
      },
    })
  };



  render () {
    const {data: { loading, todos }} = this.props;
    if (loading) {
      return <p>loading...</p>
    } else {
      return (
        <div style={{display: 'flex'}}>
          <div style={{margin: 'auto', width: 400}}>
            <Paper elevation={5}>
            <h1 style={{ fontFamily:"Roboto", textAlign:'center', paddingTop:'30px' }}>MERN ToDo List</h1>
            <Form />
              <List>
                {todos.map(todo => (
                  <ListItem
                    key={todo.id}
                    role={undefined}
                    dense
                    onClick={() => this.updateTodo(todo)}
                  >
                    <Checkbox
                      checked={todo.complete}
                      tabIndex={-1}
                      disableRipple
                      iconStyle={{fill: 'lime'}}
                    />
                    <ListItemText primary={todo.text} />
                    <ListItemSecondaryAction>
                      <IconButton onClick={() => this.removeTodo(todo)}>
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </div>
        </div>
      )
    }
  }
}

export default compose(
  graphql(RemoveMutation, { name : "removeTodo" }),
  graphql(UpdateMutation, { name : "updateTodo" }),
  graphql(ToDosQuery)
)(App);
