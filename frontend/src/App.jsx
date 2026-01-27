import TaskList from "./Tasks"
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {

  return(
    <div>
        <h1 className="fw-bold text-center mb-3" style={{color: '#ffffff', fontFamily: 'Verdana, Geneva, Tahoma, sans-serif'}}>PERSONAL TASK MANAGER</h1>
        <TaskList />
    </div>
  )
}

export default App