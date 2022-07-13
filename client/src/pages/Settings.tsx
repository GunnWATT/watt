import {Routes, Route} from 'react-router-dom';

// Components
import HeaderPage from '../components/layout/HeaderPage';
import NavTab from '../components/layout/NavTab';
import Appearance from '../components/settings/Appearance';
import Features from '../components/settings/Features';
import PeriodCustomization from '../components/settings/PeriodCustomization';
import About from '../components/settings/About';


export default function Settings() {
    return (
        <HeaderPage
            heading="Settings"
            nav={<>
                <NavTab to="." name="Appearance" />
                <NavTab to="features" name="Features" />
                <NavTab to="periods" name="Periods" />
                <NavTab to="about" name="About" />
            </>}
        >
            <Routes>
                <Route path="/" element={<Appearance />}/>
                <Route path="/features" element={<Features />}/>
                <Route path="/periods" element={<PeriodCustomization />}/>
                <Route path="/about" element={<About />}/>
            </Routes>
        </HeaderPage>
    );
}
