import React from "react"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import { Container } from "react-bootstrap"

// Components
import App from "./App"

const AppRouter = () => {
    return (
        <Router>
            <Container>
                <Switch>
                    <Route path="/" exact component={App} />
                    {/* <Route path="/campaign" component={Dashboard} />
                    <Route path="/user" component={CreateCompetition} /> */}
                </Switch>
            </Container>
        </Router>
    )
}

export default AppRouter;