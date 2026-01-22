import React, { useState, useEffect } from "react";

function TaskList() {
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
        if (!response.ok) {
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

  if (loading) return <div className="text-center mt-5"><p>Loading tasks...</p></div>;

  function addtask() {
    if (newTask.trim() !== "") {
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
          if (!response.ok) {
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

  function handleDelete(taskId) {
    fetch(`http://127.0.0.1:8000/api/tasks/${taskId}/`, {
      method: 'DELETE',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to delete task`);
        }
        setTasks(tasks => tasks.filter(task => task.id !== taskId));
      })
      .catch(error => {
        console.log('Error deleting task:', error)
      })
  }

  function handleEdit(taskId, updatedTask) {
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
        if (!response.ok) {
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

  return (
    <>
      <link 
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" 
        rel="stylesheet" 
      />
      
      <div className="container-fluid min-vh-100 d-flex flex-column align-items-center py-4" style={{background: '#f8f9fa'}}>
        <h1 className="fw-bold text-center mb-4" style={{color: '#333', fontFamily: 'Verdana, Geneva, Tahoma, sans-serif'}}>
          Task Manager
        </h1>

        <div className="w-100" style={{maxWidth: '900px'}}>
          <div className="card shadow-lg border-0" style={{
            background: 'linear-gradient(180deg, hsla(170, 100%, 55%, 0.605), hsla(0, 7%, 16%, 0.61))',
            borderRadius: '16px'
          }}>
            <div className="card-body p-4">
              {/* Input Section */}
              <div className="row g-3 mb-4">
                <div className="col-12 col-md-5">
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Enter your task" 
                    value={newTask} 
                    onChange={event => setNewTask(event.target.value)}
                    style={{
                      border: '1px solid #ccc',
                      borderRadius: '5px',
                      transition: 'all 0.3s ease',
                      fontSize: '1rem',
                      height: '48px'
                    }}
                  />
                </div>
                
                <div className="col-12 col-md-4">
                  <select 
                    className="form-select" 
                    value={taskStatus} 
                    onChange={event => setTaskStatus(event.target.value)}
                    style={{
                      border: '2px solid #d9dfe5',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      height: '48px'
                    }}
                  >
                    <option value="">Select an Option</option>
                    <option value="completed">Completed</option>
                    <option value="incomplete">Incomplete</option>
                  </select>
                </div>
                
                <div className="col-12 col-md-3">
                  <button 
                    className="btn btn-success w-100 fw-bold" 
                    onClick={addtask}
                    style={{
                      background: 'linear-gradient(135deg, hsl(142, 76%, 36%) 0%, hsl(142, 76%, 32%))',
                      border: 'none',
                      fontSize: '0.95rem',
                      height: '48px'
                    }}
                  >
                    Add Task
                  </button>
                </div>
              </div>

              {/* Task List */}
              <ul className="list-group">
                {tasks.map((task, index) => (
                  <li 
                    key={task.id ?? `temp-${index}`} 
                    className="list-group-item mb-2"
                    style={{
                      background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 250, 252, 0.6) 100%)',
                      border: '1px solid rgba(220, 220, 220, 0.4)',
                      borderRadius: '12px',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {editingTaskId === task.id ? (
                      /* Edit Mode */
                      <div className="d-flex flex-wrap align-items-center gap-2">
                        <input 
                          type="text" 
                          className="form-control flex-grow-1" 
                          value={editedText} 
                          onChange={event => setEditedText(event.target.value)}
                          style={{minWidth: '200px'}}
                        />
                        <select 
                          className="form-select" 
                          value={editedStatus} 
                          onChange={event => setEditedStatus(event.target.value)}
                          style={{width: 'auto', minWidth: '130px'}}
                        >
                          <option value="completed">Completed</option>
                          <option value="incomplete">Incomplete</option>
                        </select>
                        <button 
                          className="btn btn-success fw-bold" 
                          onClick={() => {
                            handleEdit(task.id, {
                              task_description: editedText,
                              completed: editedStatus === 'completed'
                            });
                            setEditingTaskId(null);
                          }}
                          style={{
                            background: 'linear-gradient(135deg, hsl(142, 76%, 36%) 0%, hsl(142, 76%, 32%))',
                            border: 'none'
                          }}
                        >
                          Save
                        </button>
                        <button 
                          className="btn btn-warning fw-bold text-white" 
                          onClick={() => setEditingTaskId(null)}
                          style={{
                            background: 'linear-gradient(135deg, hsl(40, 100%, 50%) 0%, hsl(40, 100%, 46%) 100%)',
                            border: 'none'
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      /* View Mode */
                      <div className="row align-items-center">
                        <div className="col-12 col-md-6 mb-2 mb-md-0">
                          <div className="fw-medium" style={{color: 'hsl(220, 20%, 30%)', wordWrap: 'break-word'}}>
                            {task.task_description}
                          </div>
                        </div>
                        <div className="col-12 col-md-6">
                          <div className="d-flex flex-wrap align-items-center justify-content-md-end gap-2">
                            <span 
                              className="badge fw-semibold px-3 py-2"
                              style={{
                                background: task.completed ? '#d4edda' : '#f8d7da',
                                color: task.completed ? '#155724' : '#721c24',
                                borderRadius: '6px',
                                fontSize: '0.9rem'
                              }}
                            >
                              {task.completed ? "Completed✅" : "Incomplete❌"}
                            </span>
                            <button 
                              className="btn btn-primary btn-sm fw-bold" 
                              onClick={() => {
                                setEditingTaskId(task.id);
                                setEditedText(task.task_description);
                                setEditedStatus(task.completed ? 'completed' : 'incomplete');
                              }}
                              title="Edit Task"
                              style={{
                                background: 'linear-gradient(135deg, hsl(220, 90%, 60%) 0%, hsl(220, 90%, 56%) 100%)',
                                border: 'none'
                              }}
                            >
                              ✏️
                            </button>
                            <button 
                              className="btn btn-danger btn-sm fw-bold" 
                              onClick={() => handleDelete(task.id)}
                              title="Delete Task"
                              style={{
                                background: 'linear-gradient(135deg, hsl(0, 84%, 60%) 0%, hsl(0, 84%, 56%) 100%)',
                                border: 'none'
                              }}
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TaskList;