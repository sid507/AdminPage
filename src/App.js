import { useEffect, useState } from 'react';
import './App.css';
import bgImage from '../src/bg.jpg';
import { auth, db } from './firebase';
import Login from './Login';
import ReactLoading from 'react-loading';



function Input({ total, addBuilding, building }) {

  var inputBucket = [];

  for (var i = 0; i < total; i++)
    inputBucket.push(<input on={(e) => addBuilding([...building, e.target.value])}></input>)

  return inputBucket;
}



function App() {


  const [society, setSociety] = useState("");
  const [heirarchy, setheirarchy] = useState("Building");
  const [totalBuilding, settotalBuilding] = useState("");
  const [building, setbuilding] = useState([]);

  const [wing, setwing] = useState();
  const [totalfloor, settotalfloor] = useState();
  const [flats, setflats] = useState();

  const [totalSociety, settotalSociety] = useState([]);

  const [loading, setloading] = useState(false);

  var buildingPlaceholder = "Enter the total number of buildings";

  function getNextChar(char) {
    return String.fromCharCode(char.charCodeAt(0) + 1);
  }

  const getTotalSociety = async (e) => {
    db.collection("Society").onSnapshot((snapshot) => {
      settotalSociety(snapshot.docs.map(doc => (
        doc.id
      )))
    })

  }

  function check(val) {
    if (val == "") {
      alert("Invalid Value");
      return -1;
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setloading(true);
    // creating the object to be pushed
    if (society == "") {
      alert("Please enter the valid value");
      setloading(false);
      return;
    }
    if (totalSociety.find(element => (element === society))) {
      alert("Please enter different society name");
      return;
    }

    var Hierarchy = {};
    var structure = [];

    if (heirarchy == "Building") {
      Hierarchy = ["Building", "Wing", "Flat"]

      const ref = db.collection("Society").doc(society);
      const res = await ref.set({ "hierarchy": Hierarchy })
      var buildingArr = [];
      if (totalBuilding == "") { alert("Please enter totalBuilding");setloading(false); return; }
      for (var i = 0; i < totalBuilding; i++) {

        var obj;
        obj = { [building[i].buildingName]: "" };
        await ref.update({ "structure": obj })
        var wingCounter = "A";
        var wingArr = [];
        if (check(building[i].totalWing) == -1) {
          setloading(false)
          return;
        }
        for (var j = 0; j < building[i].totalWing; j++) {
          await ref.update({ "structure": { [building[i].buildingName]: { [wingCounter]: "" } } })
          var floorArr = [];
          if (check(building[i].totalFloor) == -1) {
            setloading(false)
            return;
          }
          for (var floor = 0; floor < building[i].totalFloor; floor++) {

            if (check(building[i].flatPerFloor) == -1) {
              setloading(false);
              return;
            }
            for (var flat = 1; flat <= building[i].flatPerFloor; flat++) {
              var between = "";
              var flatNo = String(floor);
              if (flat < 10) {
                flatNo += "0";
              }

              floorArr.push(flatNo + String(flat));
            }
          }
          wingArr[[wingCounter]] = floorArr;
          await ref.update({ "structure": { [building[i].buildingName]: { ...wingArr } } })

          wingCounter = getNextChar(wingCounter);
        }
        buildingArr[[building[i].buildingName]] = { ...wingArr };
        const resp = await ref.update({ "structure": { ...buildingArr } })

      }

    }
    else if (heirarchy == "Wing") {
      console.log(society);
      console.log(floor);

      console.log(flats);
      Hierarchy = ["Wing", "Flat"];
      const ref = db.collection("Society").doc(society);
      await ref.set({ "Hierarchy": Hierarchy })

      var wingCounter = "A";
      await ref.update({ "structure": {} });

      var wingArr = [];
      for (var i = 0; i < wing; i++) {
        await ref.update({ "structure": { [wingCounter]: "" } })
        var floorArr = [];

        for (var j = 0; j < totalfloor; j++) {
          for (var flat = 1; flat <= flats; flat++) {
            var flatNo = String(j);
            if (flat < 10) {
              flatNo += "0";
            }

            floorArr.push(flatNo + String(flat));
          }
        }
        wingArr[[wingCounter]] = floorArr;
        await ref.update({ "structure": { [wingCounter]: { ...floorArr } } })
        wingCounter = getNextChar(wingCounter);

      }

      await ref.update({ "structure": { ...wingArr } });


    }
    else {
      Hierarchy = ["Flat"];
      const ref = db.collection("Society").doc(society);
      await ref.set({ "Hierarchy": Hierarchy })
      var floorArr = [];
      await ref.update({ "structure": "" });
      for (var j = 0; j < totalfloor; j++) {
        for (var flat = 1; flat <= flats; flat++) {
          var flatNo = String(j);
          if (flat < 10) {
            flatNo += "0";
          }

          floorArr.push(flatNo + String(flat));
        }
      }
      const resp = await ref.update({ "structure": { ...floorArr } });

    }
    setloading(false);


  }
  useEffect(() => {
    getTotalSociety();
    auth.onAuthStateChanged((userAuth) => {
      setuser(userAuth);
    })
  }, [])
  useEffect(() => {
    // setbuilding([]);
    var newInput = [];
    for (var i = 0; i < totalBuilding; i++) {
      console.log("Hello");

      newInput.push({ key: i, buildingName: '', totalWing: '', totalFloor: '', flatPerFloor: '' })

    }
    setbuilding(newInput);
    console.log(building);

  }, [totalBuilding])


  const handleBuildingOnfo = (index, e) => {
    var data = [...building];
    data[index][e.target.name] = e.target.value;
    setbuilding(data);

  }
  const [user, setuser] = useState(null);


  return (
    <div className="App "  >
      {user ? (
        loading ? <ReactLoading type={'balls'} color={"black"} height={100} width={100} className="mx-auto my-20" />
          : (
            <div className="flex flex-col gap-4 my-10 " >
              <form className=" flex flex-col space-y-5 lg:w-4/12 mx-auto" onSubmit={(e) => { handleSubmit(e); }}>
                <input className="inputApp" placeholder="Enter the society name" onChange={(e) => setSociety(e.target.value)}></input>
                <div>
                  <select className="inputApp" value={heirarchy} onChange={(e) => setheirarchy(e.target.value)}>
                    <option value="Building">Building Name</option>
                    <option value="Wing">Wing</option>
                    <option value="Flat">FlatNo</option>
                  </select>
                </div>
                <div>
                  {
                    heirarchy == "Building" ? (
                      <div>
                        <input className="inputApp" onChange={(e) => { settotalBuilding(e.target.value); }} placeholder="Enter the total number of buildings"></input>
                        {
                          building.map((input, index) => {
                            return (
                              <div className="flex flex-col gap-5 my-10 ">
                                <input className="inputApp" name='buildingName' value={input.buildingName} onChange={(e) => handleBuildingOnfo(index, e)} placeholder="Enter the building Name"></input>
                                <input className="inputApp" name='totalWing' value={input.totalWing} onChange={(e) => handleBuildingOnfo(index, e)} placeholder="Enter the total wings"></input>
                                <input className="inputApp" name='totalFloor' value={input.totalFloor} onChange={(e) => handleBuildingOnfo(index, e)} placeholder="Enter the total floor"></input>
                                <input className="inputApp" name='flatPerFloor' value={input.flatPerFloor} onChange={(e) => handleBuildingOnfo(index, e)} placeholder="Enter the total flat per floor"></input>
                                <hr />
                              </div>
                            )
                          })
                        }
                      </div>) : (heirarchy == "Wing" ? (<div className="flex flex-col gap-4">
                        <input className="inputApp" name='totalWing' value={wing} onChange={(e) => setwing(e.target.value)} placeholder="Enter the total wings"></input>
                        <input className="inputApp" name='totalFloor' value={totalfloor} onChange={(e) => settotalfloor(e.target.value)} placeholder="Enter the total floor"></input>
                        <input className="inputApp" name='flatPerFloor' value={flats} onChange={(e) => setflats(e.target.value)} placeholder="Enter the total flat per floor"></input>
                      </div>) : (

                        <div className="flex flex-col gap-4">
                          <hr></hr>
                          <input className="inputApp" name='totalFloor' value={totalfloor} onChange={(e) => settotalfloor(e.target.value)} placeholder="Enter the total floor"></input>
                          <input className="inputApp" name='flatPerFloor' value={flats} onChange={(e) => setflats(e.target.value)} placeholder="Enter the total flat per floor"></input>

                        </div>
                      ))
                  }
                </div>

                <button className="p-3 bg-blue-400 rounded-md lg:w-4/12 mx-auto" >Submit</button>


              </form>
              <button onClick={() => { auth.signOut() }} className="p-3 bg-blue-400 rounded-md lg:w-4/12 mx-auto" >Logout</button>
              
              <div className="lg:w-4/12 mx-auto">
                <div>Current Society</div>
              {
                totalSociety.map((data)=><div className="inputApp">{data}</div>)
              }
              </div>
            </div>)
      ) : <Login setUser={setuser} />}
    </div>
  );
}

export default App;
