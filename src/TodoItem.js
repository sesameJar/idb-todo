import React from 'react'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Switch from '@material-ui/core/Switch'



export default function TodoItem(props) {
    return (
      <ListItem className="item">
        <ListItemText id="switch-list-label-wifi" primary={props.item.description} />
        <ListItemSecondaryAction>
          <Switch
            onChange={props.onCompleted}
            checked={props.item.status ==='complete' ? true : false }
            className={props.item.priority}
          />
        </ListItemSecondaryAction>
      </ListItem>
    );
  }