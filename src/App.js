import { useEffect, useState } from 'react';
import './App.css';
import bgImage from '../src/bg.jpg';
import { auth, db } from './firebase';
import Login from './Login';
import ReactLoading from 'react-loading';
import Alert from 'react-popup-alert'



function Input({ total, addBuilding, building }) {

  
}



function App() {


  const [society, setSociety] = useState("");
  const [heirarchy, setheirarchy] = useState("Building");
  const [totalBuilding, settotalBuilding] = useState(1);
  const [building, setbuilding] = useState([]);

  const [wing, setwing] = useState();
  const [totalfloor, settotalfloor] = useState();
  const [flats, setflats] = useState([]);

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
    console.log(building);
    setloading(true);
    // creating the object to be pushed
    if (society == "") {
      alert("Please enter the valid value");
      setloading(false);
      return;
    }
    if (totalSociety.find(element => (element === society))) {
      alert("Please enter different society name");
      setloading(false);
      return;
    }

    var Hierarchy = {};
    var structure = [];

    if (heirarchy == "Building") {
      Hierarchy = ["Building", "Wing", "Flat"]

      const ref = db.collection("Society").doc(society);
      const res = await ref.set({ "hierarchy": Hierarchy })
      var buildingArr = [];
      if (building.length == 0) { alert("Please enter valid value");setloading(false); return; }
      for (var i = 0; i < building.length; i++) {

        var obj;
        obj = { [building[i].buildingName]: "" };
        await ref.update({ "structure": obj })
        var wingArr = [];
        // if (check(building[i].totalWing) == -1) {
        //   setloading(false)
        //   return;
        // }


        var wingRef=building[i].wing;

        for (var j = 0; j < building[i].wing.length; j++) {
          await ref.update({ "structure": { [building[i].buildingName]: { [wingRef[j].wingName]: "" } } })
          var floorArr = [];
          
          for (var floor = 0; floor < wingRef[j].totalFlats.length; floor++) {

            // if (check(building[i].flatPerFloor) == -1) {
            //   setloading(false);
            //   return;
            // }
            

              floorArr.push(wingRef[j]["totalFlats"][floor]["flatNo"]);
            }
            wingArr[[wingRef[j].wingName]] = floorArr;

          }
          await ref.update({ "structure": { [building[i].buildingName]: { ...wingArr } } })
          buildingArr[[building[i].buildingName]] = { ...wingArr };

        }
        await ref.update({ "structure": { ...buildingArr } })
        .then(data=> alert("Successfully Added"))
        .catch(e=>alert("Error Please try again"));

      

    }
    else if (heirarchy == "Wing") {
      // console.log(society);
      // console.log(floor);

      // console.log(flats);
      Hierarchy = ["Wing", "Flat"];
      const ref = db.collection("Society").doc(society);
      await ref.set({ "Hierarchy": Hierarchy })


      await ref.update({ "structure": {} });

      var wingArr = [];
      var wingRef = building[0]["wing"];
      for (var i = 0; i < wingRef.length; i++) {
        await ref.update({ "structure": { [wingRef[i]["wingName"]]: "" } })
        var floorArr = [];

        for (var j = 0; j < wingRef[i]["totalFlats"].length; j++) {
          

            floorArr.push(wingRef[i]["totalFlats"][j]["flatNo"]);
          
        }
        wingArr[[wingRef[i]["wingName"]]] = floorArr;
        await ref.update({ "structure": { [wingRef[i]["wingName"]]: { ...floorArr } } })
       
        // wingCounter = getNextChar(wingCounter);

      }

      await ref.update({ "structure": { ...wingArr } })
      .then(data=> alert("Successfully Added"))
      .catch(e=>alert("Error Please try again"));

    }
    else {
      Hierarchy = ["Flat"];
      const ref = db.collection("Society").doc(society);
      await ref.set({ "Hierarchy": Hierarchy })
      var floorArr = [];
      await ref.update({ "structure": "" });
      for (var j = 0; j < flats.length; j++) {
        

          floorArr.push(flats[j]["flatNo"]);
        
      }
      await ref.update({ "structure": { ...floorArr } })
      .then(data=>alert("Successfully Added"))
      .catch(e=>alert("Error Please try again"));

    }
    setbuilding([]);
    setloading(false);


  }
  useEffect(() => {
    getTotalSociety();
    auth.onAuthStateChanged((userAuth) => {
      setuser(userAuth);
    })
    console.log(user);
  }, [])
  useEffect(() => {
    // setbuilding([]);
    var newInput = [];
    
    for (var i = 0; i < Math.max(totalBuilding,1); i++) {
      // console.log("Hello");

      newInput.push({ key: i, buildingName: '', totalWing: '',wing:[],totalFloor: '', flatPerFloor: '' })

    }
    setbuilding(newInput);
    // console.log(building);

  }, [totalBuilding])


  const handleTotalWing=(index,e)=>{
    e.preventDefault();
    console.log(building);
    
    var data=[...building];

    var i=data[index].wing.length;

    data[index].wing.push({key:i,wingName:'',totalFlats:[]});
    console.log(data);
    setbuilding(data);
  }


  const handleBuildingOnfo = (index, e) => {
    var data = [...building];
    data[index][e.target.name] = e.target.value;
    setbuilding(data);

  }

  const handleDeleteWing=(index,index2,e)=>{
    e.preventDefault();
    // console.log("Hey")
    var data=[...building];
    var wingArr=data[index].wing;
   wingArr= wingArr.filter(w=>w.key!==index2);
    data[index]["wing"]=[...wingArr];
    setbuilding(data);
  }

  const handleFlatAdd=(index,index2,e)=>{
    e.preventDefault();
    console.log("In")
    var data=[...building];
    var i=data[index]["wing"][index2]["totalFlats"].length;
    console.log(data[index]["wing"][index2]["totalFlats"]);
    data[index]["wing"][index2]["totalFlats"].push({key:i,flatNo:''})
    setbuilding(data);
  }

  const handleWingInfo = (index1,index2, e) => {
    var data = [...building];
    data[index1]["wing"][index2]["wingName"] = e.target.value;
    setbuilding(data);

  }

  const handleDeleteFlat=(index1,index2,index3,e)=>{
    e.preventDefault();
    // console.log("Hey")
    var data=[...building];
    var flatArr=data[index1]["wing"][index2]["totalFlats"];
    flatArr= flatArr.filter(w=>w.key!==index3);
    data[index1]["wing"][index2]["totalFlats"]=[...flatArr];
    setbuilding(data);
  }

  const handleFlatInfo=(index1,index2,index3,e)=>{
    var data=[...building];
    data[index1]["wing"][index2]["totalFlats"][index3]["flatNo"]=e.target.value;
    setbuilding(data);
    console.log(data);
  }
  const [user, setuser] = useState(null);

  const addFlatsForFlatValue=(e)=>{
    e.preventDefault();
    var data=[...flats];
    var i=data.length;
    data.push({key:i,flatNo:''});
    setflats(data);
  }

  const handleFlatsForFlatValue=(index,e)=>{
    e.preventDefault();
    var data=[...flats];
    data[index].flatNo=e.target.value;
    setflats(data);
  }

  const deleteFlatsForFlatValue=(index,e)=>{
    e.preventDefault();
    var data=[...flats];
    data=data.filter(e=>e.key!==index);
    // data=[...flats];
    setflats(data);
  }

  const handleDeleteSociety=(id,e)=>{
    e.preventDefault();
    db.collection("Society").doc(id).delete()
    .then(data=>alert("Successfully Deleted"))
    .catch(e=>alert("Error"))
  }

  return (
    <div className="App h-screen py-5 lg:p-10 "   >
      {user ? (
        loading ? <ReactLoading type={'balls'} color={"black"} height={100} width={100} className="mx-auto my-20" />
          : (
            <div className="flex flex-col gap-4  " >
              <h1 className="font-extrabold text-2xl">Admin Page</h1>
              <form className=" flex flex-col space-y-5 lg:w-4/12 bg-orange-50 rounded-2xl p-4  mx-auto" onSubmit={(e) => { handleSubmit(e); }}>
                <input className="inputApp" placeholder="Enter the society name" onChange={(e) => setSociety(e.target.value)}></input>
                <div > 
                  <select className="inputApp" value={heirarchy} onChange={(e) => {e.preventDefault(); setheirarchy(e.target.value) ;settotalBuilding(1) }}>
                    <option value="Building">Building</option>
                    <option value="Wing">Wing</option>
                    <option value="Flat">FlatNo</option>
                  </select>
                </div>
                <div>
                  {
                    heirarchy == "Building" ? (
                      <div>
                        <input className="inputApp" type="number" min={1} value={totalBuilding} onChange={(e) => { settotalBuilding(e.target.value); }} placeholder="Enter the total number of buildings"></input>
                        {
                          building.map((input, index) => {
                            return (
                              <div className="flex flex-col gap-5 my-10 bg-orange-100 p-3 rounded-2xl ">
                                <input className="inputApp" name='buildingName' value={input.buildingName} onChange={(e) => handleBuildingOnfo(index, e)} placeholder="Enter the building Name"></input>
                                <button className="p-3 bg-green-400 rounded-md lg:w-4/12 mx-auto" onClick={(e) => handleTotalWing(input.key, e)} placeholder="Enter the total wings">Add Wing</button>
                                {
                                  input.wing.map((input2,index2)=>{
                                    return (
                                      <div className="flex flex-col gap-2 bg-gray-300 p-3 rounded-2xl ">
                                      <div className="flex flex-row gap-4 ">
                                      <input className="inputApp" name='wingName' value={input2.wingName} onChange={(e) => handleWingInfo(index,index2, e)} placeholder="Enter the wingName"></input>
                                      <button onClick={(e)=>handleDeleteWing(input.key,input2.key,e)} className="p-3 bg-red-400 rounded-md lg:w-4/12 mx-auto">Delete</button>
                                      </div>
                                      <button onClick={(e)=>handleFlatAdd(input.key,input2.key,e)} className="p-3 bg-green-400 rounded-md lg:w-4/12 mx-auto">Add Flat</button>
                                      {
                                        input2.totalFlats.map((input3,index3)=>{
                                          return (
                                            <div className="flex flex-row gap-4 bg-gray-300 p-3 rounded-2xl">

                                          <input className="inputApp" name='wingName' value={input3.flatNo} onChange={(e) => handleFlatInfo(index,index2,index3 ,e)} placeholder="Enter the flat No"></input>
                                          <button onClick={(e)=>handleDeleteFlat(input.key,input2.key,input3.key,e)} className="p-3 bg-red-400 rounded-md lg:w-4/12 mx-auto">Delete Flat</button>

                                          </div>
                                          )
                                        })
                                      }
                                      {/* <input className="inputApp" name='flatPerFloor' value={input.flatPerFloor} onChange={(e) => handleBuildingOnfo(index, e)} placeholder="Enter the total flat per floor"></input> */}
                                      </div>
                                    )
                                  })
                                }
                                <hr />
                              </div>
                            )
                          })
                        }
                      </div>) : (heirarchy == "Wing" ? (<div className="flex flex-col gap-4">
                      <button className="p-3 bg-green-400 rounded-md lg:w-4/12 mx-auto" onClick={(e) => handleTotalWing(0, e)} placeholder="Enter the total wings">Add Wing</button>
                                {
                                  building[0].wing.map((input2,index2)=>{
                                    return (
                                      <div className="flex flex-col gap-2 bg-gray-300 p-3 rounded-2xl ">
                                      <div className="flex flex-row gap-4 ">
                                      <input className="inputApp" name='wingName' value={input2.wingName} onChange={(e) => handleWingInfo(0,index2, e)} placeholder="Enter the wingName"></input>
                                      <button onClick={(e)=>handleDeleteWing(0,input2.key,e)} className="p-3 bg-red-400 rounded-md lg:w-4/12 mx-auto">Delete</button>
                                      </div>
                                      <button onClick={(e)=>handleFlatAdd(0,input2.key,e)} className="p-3 bg-green-400 rounded-md lg:w-4/12 mx-auto">Add Flat</button>
                                      {
                                        input2.totalFlats.map((input3,index3)=>{
                                          return (
                                            <div className="flex flex-row gap-4 bg-gray-300 p-3 rounded-2xl">

                                          <input className="inputApp" name='wingName' value={input3.flatNo} onChange={(e) => handleFlatInfo(0,index2,index3 ,e)} placeholder="Enter the flat No"></input>
                                          <button onClick={(e)=>handleDeleteFlat(0,input2.key,input3.key,e)} className="p-3 bg-red-400 rounded-md lg:w-4/12 mx-auto">Delete Flat</button>

                                          </div>
                                          )
                                        })
                                      }
                                      {/* <input className="inputApp" name='flatPerFloor' value={input.flatPerFloor} onChange={(e) => handleBuildingOnfo(index, e)} placeholder="Enter the total flat per floor"></input> */}
                                      </div>
                                    )
                                  })
                                }
                                <hr />
                           </div>) : (
                             
                        <div className="flex flex-col gap-4 ">
                          <hr></hr>
                          <button onClick={(e)=>addFlatsForFlatValue(e)} className="p-3 bg-green-400 rounded-md lg:w-4/12 mx-auto">Add Flat</button>
                                      {
                                        flats.map((input3,index3)=>{
                                          return (
                                            <div className="flex flex-row gap-4 bg-gray-300 p-3 rounded-2xl">

                                          <input className="inputApp" name='wingName' value={input3.flatNo} onChange={(e) => handleFlatsForFlatValue(index3 ,e)} placeholder="Enter the flat No"></input>
                                          <button onClick={(e)=>deleteFlatsForFlatValue(input3.key,e)} className="p-3 bg-red-400 rounded-md lg:w-4/12 mx-auto">Delete Flat</button>

                                          </div>
                                          )
                                        })
                                      }
                        </div>
                      ))
                  }
                </div>

                <button className="p-3 bg-blue-400 rounded-md lg:w-4/12 mx-auto" >Submit</button>


              </form>
              <button onClick={() => { auth.signOut() }} className="p-3 bg-blue-400 rounded-md lg:w-4/12 mx-auto" >Logout</button>
              
              <div className="flex flex-col gap-3 lg:w-4/12 mx-auto">
                <div className="text-lg font-extrabold">Current Society</div>
              {
                totalSociety.map((data)=><div className="flex flex-row gap-3">

                  <div className="inputApp">{data}</div>
                 {user.email=="sid507@easeit.com"? <button onClick={(e)=>handleDeleteSociety(data,e)} className="p-3 bg-red-400 rounded-md lg:w-4/12 mx-auto">Delete Society</button>:<div></div>
                  }
                  </div>)
              }
              </div>
            </div>)
      ) : <Login setUser={setuser} />}
    </div>
  );
}

export default App;
