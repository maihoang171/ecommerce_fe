import {Routes, Route} from "react-router-dom"
import { Home } from "../pages/home"
import { Register } from "../pages/register"


export const AppRoute = () => {
    return(
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth/register" element={<Register />} />
        </Routes>
    )
}