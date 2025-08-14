import React, {useState, useEffect} from "react";

function TaskList(){

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newTask, setNewTask] = useState('');
    const [taskStatus, setTaskStatus] = useState('');
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editedText, setEditedText] = useState('');
    const [editedStatus, setEditedStatus] = useState('');

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/tasks/')
            .then(response => {
                if(!response.ok){
                    throw new Error('Failed to fetch tasks');
                }
                return response.json();
            })
            .then(data => {
                setTasks(data);
                setLoading(false);
            })
            .catch(error => {
                console.error(error);
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Loading tasks...</p>;

    function addtask(){

        if(newTask.trim() !== ""){
            const newTaskObject = {
                task_description: newTask,
                completed: taskStatus === 'completed' ? true : false,
                user: 1,
            };
            
            fetch('http://127.0.0.1:8000/api/tasks/', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify(newTaskObject),
            })
            .then(async response => {
                if(!response.ok){
                    const backendResponse = await response.text();
                    console.error('Backend error response:', backendResponse);
                    throw new Error(`Failed To Add New Task: 
                                    ${response.status} ${response.statusText}`)
                }
                return response.json();
            })
            .then(savedTasks => {
                setTasks(t => [...t, savedTasks]);
                setNewTask("");
            })
            .catch(error => {
                console.log('Error adding task:', error);
            });
        }
    }

    function handleDelete(taskId){

        fetch(`http://127.0.0.1:8000/api/tasks/${taskId}/`, {
            method: 'DELETE',
        })
        .then(response => {
            if(!response.ok){
                throw new Error(`Failed to delete task`);
            }
            setTasks(tasks => tasks.filter(task => task.id !== taskId));
        })
        .catch(error => {
            console.log('Error deleting task:', error)
        })            
    }

    function handleEdit(taskId, updatedTask){

        if (!updatedTask.task_description.trim()) {
        alert("Task description cannot be empty.");
        return;
    }
        
        fetch(`http://127.0.0.1:8000/api/tasks/${taskId}/`, {
            method: 'PATCH',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(updatedTask),
        })
        .then(response => {
            if(!response.ok){
                throw new Error(`failed to update task.`)
            }
            return response.json();
        })
        .then(updatedTask => {
            setTasks(tasks => tasks.map(task => 
                task.id === taskId ? updatedTask : task
            ));
        })
        .catch(error => console.error('Error updating task:', error));
    }

    return(
        <div className="task-container">
            <input type="text" 
                   placeholder="Enter your task" 
                   value={newTask} 
                   onChange={event => setNewTask(event.target.value)}/>

            <select name="task-status" id="task-status" 
                    value={taskStatus} 
                    onChange={event => setTaskStatus(event.target.value)}>
                <option value="">Select an Option</option>
                <option value="completed">Completed</option>
                <option value="not-completed">Not Completed</option>
            </select>
                
            <button className="add-button" 
                    onClick={addtask}>Add task</button>
            <ol>
                {tasks.map((task, index) => 
                <li key={task.id ?? `temp-${index}`}>
                    {editingTaskId === task.id ? (
                        <>
                        <input type="text" 
                               value={editedText} 
                               onChange={event => setEditedText(event.target.value)} />
                        <select value={editedStatus} 
                                onChange={event => setEditedStatus(event.target.value)}>
                            <option value="completed">Completed</option>
                            <option value="not-completed">Not Completed</option>
                        </select>
                        <button className="edit-button" 
                                onClick={() => {handleEdit(task.id, {
                                task_description: editedText,
                                completed: editedStatus === 'completed'
                                });
                                setEditingTaskId(null);
                        }}>Save</button>
                        <button onClick={() => setEditingTaskId(null)}>Cancel</button>
                        </>
                    ) : (
                        <>
                        {task.task_description} - {task.completed ? "✅ Done" : "❌ Not done"}
                        <button onClick={() => {setEditingTaskId(task.id);
                                                setEditedText(task.task_description);
                                                setEditedStatus(task.completed ? 'completed' : 'not-completed');}
                                        }>Edit</button>
                    
                        <button className="delete-button" onClick={() => handleDelete(task.id)}>Delete</button>
                        </>
                        )}   
                    </li>
                    )}
            </ol>
        </div>        
    )
}

export default TaskList