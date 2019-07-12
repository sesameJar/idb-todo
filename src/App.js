import React from 'react'
import * as idb from 'idb'
import List from '@material-ui/core/List';
import TodoItem from './TodoItem'
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import './App.css'


const dbPromise = idb.openDB('todo-db', 1, {
    upgrade(db) {
        let items = db.createObjectStore('items', {
                        keyPath: 'id',
                        autoIncrement: true,
                    });

        items.createIndex('priority', 'priority');
        items.createIndex('created', 'created');
        items.createIndex('status', 'status');
    }
});
class TodoApp extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            items: [],
            complete :[],
            form: false,
        };
        
        this.refreshItems();
    }

    async refreshItems() {
        let items = []; // EDIT ME: get them from the DB
        let db = await dbPromise
        console.log(await db.getAll('items'))
        items = await db.getAll('items')
        this.setState({ items, });
    }

    async addItem() {
        console.log(`ref is : ${this.description.value}`)
        if (this.description.value === '' || this.description.value === undefined) {
            this.setState({ addError: "Empty description", });
            return;
        }

        let newItem = {
            status: "open",
            created: Date.now(),
            description: this.description.value,
            priority: this.priority.value,
        };

        // EDIT ME: store newItem into the DB
        let db = await dbPromise
        const tx = await db.transaction('items', 'readwrite');
        tx.store.add(newItem);
        await tx.done;
        this.description.value = '';
        this.refreshItems();
    }

    async completeItem(id) {
        // EDIT ME: set the "status" field to complete, for the record with this id
        let db = await dbPromise
        const tx = db.transaction('items', "readwrite")
        let item = await db.get('items', id)
        item.status = "complete"
        await db.put('items',item)
        await tx.done
        this.refreshItems();
    }

    async getCompleteTasks(e) {
        let db= await dbPromise;
        let items = await db.getAllFromIndex('items', 'status', this.filter.value)
        console.log(items)
        this.setState({items});
    }  

    openForm(){
        this.setState({form : !this.state.form})
    }

    render() {
        return <div className="todoApp">
            <h2>Todo App!</h2>
            <div className={`newItemWrapper ${this.state.form  ? ' open' : ''}`}>
                <Box className="formBox">

                    <TextField
                        label="Description"
                        placeholder="Description"
                        margin="normal"
                        inputRef={x => this.description = x}
                    />
                    <FormControl className="formControl">
                        <InputLabel htmlFor="age-native-simple">Priority</InputLabel>
                        <Select
                        native
                        
                        inputRef={x => this.priority = x}
                        >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        </Select>
                    </FormControl>
                    <Button
                    margin="normal" 
                    variant="contained"
                    onClick={() => this.addItem()}>
                        Add Item
                    </Button>
                    <div style={{ color: 'red' }}>{this.state.addError}</div>
                </Box>
            </div>
            <Divider />
            <div className={`plusIconBg ${this.state.form  ? ' open' : ''}`}>
                <Fab color="primary" aria-label="Add" className={`plusIcon ${this.state.form  ? ' open' : ''}`} onClick={()=> this.openForm()}>
                    <AddIcon />
                </Fab>
            </div>
            <FormControl className="formContrl filter">
                <InputLabel htmlFor="select-multiple">Filter</InputLabel>
                <Select
                native
                onChange={()=>this.getCompleteTasks()}
                inputRef={x => this.filter = x}
                >
                <option value="complete">Complete</option>
                <option value="open">Not Complete</option>
                </Select>
            </FormControl>
            <List className="listWrapper">
                {this.state.items.map((item) => <TodoItem item={item} key={item.id} onCompleted={() => this.completeItem(item.id)} />)}
            </List>
        </div>
    }
}

function App() {
    return <div className="App">
        <CssBaseline />
        <TodoApp />
    </div>;
}

export default App;