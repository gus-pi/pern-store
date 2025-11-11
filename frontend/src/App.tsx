import Navbar from './components/Navbar';
import { Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage';
import ProductPage from './pages/ProductPage';

const App = () => {
    return (
        <div className="min-h-screen bg-base-200 transition-colors duration-300">
            <Navbar />

            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/product/:id" element={<ProductPage />} />
            </Routes>
        </div>
    );
};
export default App;
