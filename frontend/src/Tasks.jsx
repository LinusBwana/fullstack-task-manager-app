import React, {useState, useEffect} from "react";

function TaskList(){

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

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

    return(
        <div>
            <ol>
                {tasks.map(task => 
                    <li key={task.id}>
                        {task.task_description} - {task.completed ? "✅ Done" : "❌ Not done"}
                    </li>
                )}
            </ol>
        </div>        
    )
}

export default TaskList