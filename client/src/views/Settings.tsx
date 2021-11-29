import {Routes, Route} from 'react-router-dom';
import {Nav} from 'reactstrap';

// Components
import Header from '../components/layout/Header';
import NavTab from '../components/layout/NavTab';
import Appearance from '../components/settings/Appearance';
import PeriodCustomization from '../components/settings/PeriodCustomization';
import Features from '../components/settings/Features';
import About from '../components/settings/About';


export default function Settings() {
    return (
        <Header
            heading="Settings"
            nav={
                <Nav fill tabs>
                    <NavTab to="." name="Appearance" />
                    <NavTab to="features" name="Features" />
                    <NavTab to="periods" name="Periods" />
                    <NavTab to="about" name="About" />
                </Nav>
            }
        >
            <Routes>
                <Route path="/" element={<Appearance />}/>
                <Route path="/features" element={<Features />}/>
                <Route path="/periods" element={<PeriodCustomization />}/>
                <Route path="/about" element={<About />}/>
            </Routes>
        </Header>
    );
}
