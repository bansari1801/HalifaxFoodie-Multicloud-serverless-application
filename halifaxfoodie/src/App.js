import ConfigureAWS from './components/configureAWS';
import Navbar from './navigation/Navbar';
import AppRoutes from './routing/Routes';

const showNav = () => {
  if((localStorage.getItem("email") !== null) && (localStorage.getItem("email") !== undefined)){
      console.log(localStorage.getItem("email"),"fgdfgfd")
      return <Navbar/>
  } 
  return false
}

function App() {
  return (
    <div>
      {/* <div style={{visibility:isLoggedIn() ? 'visible' : 'hidden'}}>
        <Navbar />
      </div> */}
      {showNav()}
      <AppRoutes/>
      <ConfigureAWS/>
    </div>


  );
}

export default App;
