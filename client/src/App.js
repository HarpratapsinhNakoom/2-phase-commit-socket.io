import React from "react";
import {io} from 'socket.io-client'
import "./components/componentsStyles.css"
function App() {
	const [socket, setSocket] = React.useState();
	const [finalOutput, setFinalOutput] = React.useState(true);
	React.useEffect(()=>{
		setSocket(io('http://localhost:8080'));
	}, []);

	const [request, setRequest] = React.useState(false);
	const [requestID, setRequestID] = React.useState("");
	const [responseCount, setResponseCount] = React.useState([]);

	// const socket = null;

	const handleReadyResponse = () => {
		socket.emit("response-pts", true, requestID, socket.id);
		setRequest(false);
	}
	const handleNotReadyResponse = () => {
		socket.emit("response-pts", false, requestID, socket.id);
		setRequest(false);
	}

	socket && socket.on('request-stp', (coordinatorID) => {
		setRequest(true);
		setRequestID(coordinatorID);
	})

	const handleTransaction = () => {
		socket.emit('request-cts', socket.id);
	}

	socket && socket.on('response-stc', (resState, resID) => {
		console.log("response recieved from server to coordinator");

		setResponseCount(prevCount => {
			const found = prevCount.find(el => el.id === resID);
			if (!found) {
				if(!resState) setFinalOutput(false);
				return [...prevCount, {id: resID, state: resState}];
			}
			else return prevCount;
		});
	})
	const showResponses = responseCount.map((res) => {
		return (
			<div key={res.id}>
				Recived {res.state ? "commit": "abort"} message from {res.id}
			</div>
		);
	})

  return (
    <div className="app-container"
	style={{
		display:"flex",
		justifyContent:"center",
		alignItems:"center"
	}}>
		{socket && 
			<div className="App"
			style={{
				width: "100vw",
				display:"flex",
				flexDirection:"column",
				justifyContent:"center",
				alignItems:"center",
				maxWidth:"750px"
			}}>
				<div className='request-response-container'>
					<div className="req-res-section">
						<div className="section-header">Request</div>
						<div className="section-data">Request Data</div>
					</div>
					<div className="req-res-section">
						<div className="section-header">Response</div>
						<div className="section-data">Response Data</div>
					</div>
				</div>
				<button className="start-transaction" onClick={handleTransaction}>Start Transaction</button>
				{request && <div className="res-button-container">
					<button className="res-button" onClick={handleReadyResponse}>Ready</button>
					<button className="res-button" onClick={handleNotReadyResponse}>Not Ready</button>
				</div>}
				<div className="log-file-container">
					{ 
						showResponses
					}
				</div>
				<div className="final-output-container">
					{responseCount.length > 0 && 
						(finalOutput ? <h1>Ready</h1> :
						<h1>Not ready</h1>)
					}
				</div>
			</div>
		}
	</div>
  );
}

export default App;
