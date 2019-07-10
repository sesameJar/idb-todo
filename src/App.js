import React from 'react';
import * as idb from 'idb';
import TodoItem from './TodoItem'


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
        if (this.refs.description.value === '') {
            this.setState({ addError: "Empty description", });
            return;
        }

        let newItem = {
            status: "open",
            created: Date.now(),
            description: this.refs.description.value,
            priority: this.refs.priority.value,
        };

        // EDIT ME: store newItem into the DB
        let db = await dbPromise
        const tx = await db.transaction('items', 'readwrite');
        tx.store.add(newItem);
        await tx.done;
        
        this.refs.description.value = '';
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

    async getCompleteTasks() {
        let db= await dbPromise;
        let complete = await db.getAllFromIndex('items', 'status', 'complete')
        console.log(complete)
        
        return complete;
    }

    render() {
        return <div>
            {/* <fieldset>
                <legend>Add TODO Item</legend>
                <input ref="description" placeholder="description" />
                <select ref="priority" defaultValue="medium">
                    <option value="low">low</option>
                    <option value="medium">medium</option>
                    <option value="high">high</option>
                </select>
                <button onClick={() => this.addItem()}>Add Item</button>

                <div style={{ color: 'red' }}>{this.state.addError}</div>
            </fieldset> */}

            <div>
                {this.state.items.map((item) => <TodoItem item={item} key={item.id} onCompleted={() => this.completeItem(item.id)} />)}
            </div>
            <div>
                <h3>Using indexes</h3>
                <button onClick={this.getCompleteTasks}>Show complete tasks</button>
                <ul>
                    
                </ul>
            </div>
        </div>
    }
}


function TodoItem(props) {
    let status = props.item.status;
    if (status === 'open') status = <button onClick={props.onCompleted}>Completed</button>;

    // return <div>
    //     {props.item.description} / {props.item.priority} / {status}
    // </div>;

}


function App() {
    return <div>
        <TodoApp />
    </div>;
}

export default App;