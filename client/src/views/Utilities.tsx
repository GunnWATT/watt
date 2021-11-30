import {Routes, Route} from 'react-router-dom';
import {Nav} from 'reactstrap';

// Components
import Header from '../components/layout/Header';
import NavTab from '../components/layout/NavTab';
import Staff from '../components/lists/Staff';
import Support from '../components/utilities/Support';
import Map from '../components/utilities/Map';
import Calculator from '../components/utilities/Calculator';
import WIP from '../components/layout/WIP';
import Barcode from '../components/utilities/Barcode';


export default function Utilities() {
    return (
        <Header
            heading="Utilities"
            nav={
                <Nav fill tabs>
                    <NavTab to="." name="Barcode" />
                    {/* <NavTab to="graphing" name="Graphing Calculator"/> */}
                    <NavTab to="map" name="Map" />
                    <NavTab to="support" name="Support" />
                    <NavTab to="calculator" name="Finals Calc." />
                    <NavTab to="staff" name="Staff" />
                    <NavTab to="courses" name="Courses" />
                </Nav>
            }
        >
            <Routes>
                <Route path="/" element={<Barcode />} />
                {/* <Route path="graphing`} element={<GraphingCalculator />}/> */}
                <Route path="/map" element={<Map />}/>
                <Route path="/support" element={<Support />}/>
                <Route path="/calculator" element={<Calculator />}/>
                <Route path="/staff" element={<Staff />}/>
                <Route path="/courses" element={<WIP />}/> {/* WIP is temporary, will replace with courses when it's finished */}
            </Routes>
        </Header>
    );
}
