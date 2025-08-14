import React, {useState, useEffect} from "react";

function TaskList(){

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newTask, setNewTask] = useState('');
    const [taskStatus, setTaskStatus] = useState('not-completed');

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

    function handleInputChange(event){

        setNewTask(event.target.value);
    }

    function handleStatusChange(event){

        setTaskStatus(event.target.value);
    }

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
                    throw new Error(`Failed To Add New Task: ${response.status} ${response.statusText}`)
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

    function handleEdit(){
        
    }

    return(
        <div className="task-container">
            <input type="text" placeholder="Enter your task" value={newTask} onChange={handleInputChange}/>

            <select name="task-status" id="task-status" value={taskStatus} onChange={handleStatusChange}>
                <option value="">Select an Option</option>
                <option value="completed">Completed</option>
                <option value="not-completed">Not Completed</option>
            </select>
                
            <button className="add-button" onClick={addtask}>Add task</button>
            <ol>
                {tasks.map((task, index) => 
                    <li key={task.id ?? `temp-${index}`}>
                        {task.task_description} - {task.completed ? "✅ Done" : "❌ Not done"}
                    
                        <button className="delete-button" onClick={() => handleDelete(task.id)}>Delete</button>
                        <button className="edit-button" onClick={() => handleEdit(index)}>Edit</button>
                    </li>
                )}
            </ol>
        </div>        
    )
}

export default TaskList