import { render } from "preact";
import { Route, HashRouter as Router } from "react-router";

import { NotFound } from "./pages/_404.jsx";
import "./style.css";
import { Main } from "./pages/Main/index.js";
import { Start } from "./pages/Start/index.js";
import { GoogleContextProvider } from "./lib/saveProgress/google/context.js";
import { GoogleScripts } from "./lib/saveProgress/google/components.js";
import { Routes } from "react-router";

export function App() {
    return (
        <GoogleContextProvider>
            <main>
                <Router>
                    <GoogleScripts />
                    <Routes>
                        <Route path="/" element={<Start />} />
                        <Route path="/learn" element={<Main />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Router>
            </main>
        </GoogleContextProvider>
    );
}

render(<App />, document.getElementById("app"));
