import './App.css'
import './post.css'
import { Link, Switch, Route, BrowserRouter as Router } from 'react-router-dom'
import Main from './components/Main'

function App() {

  return (
    <Router basename="/7dtd-integration">
      {/* <div className="p-5 space-x-5">
            <Link to="/en" className="underline text-blue-300 visited:text-purple-300">English</Link>
            <Link to="/" className="underline text-blue-300 visited:text-purple-300">Japanese</Link>
      </div> */}
      <Switch>
        <Route path="/en">
          <Main lang="en"></Main>
        </Route>

        <Route path="/">
          <Main lang="ja"></Main>
        </Route>
      </Switch>
    </Router>
  )
}

export default App
