import React, {Component} from 'react';
import './App.css';
import './pure-release-1.0.0/base.css';
import './pure-release-1.0.0/buttons.css';

import {Route} from 'react-router-dom'
import CharacterList from "./Character/CharacterList";
import PlayerList from "./PlayerList";
import Main from "./Main";
import EditCharacter from "./Character/EditCharacter";
import Switch from "react-router-dom/es/Switch";
import {Loading} from "./Loading";
import {MainNav} from "./MainNav";
import {fetchGetInit, fetchPostInit} from "./FetchUtil";

class App extends Component {
	constructor(props) {
		super(props);
		this.setSelectedChar = this.setSelectedChar.bind(this);
		this.updateCharData = this.updateCharData.bind(this);
		this.onCharAdd = this.onCharAdd.bind(this);
		this.onLogIn = this.onLogIn.bind(this);
		this.state = { data: {}, selectedChar: "", isLoggedIn: false, token: "" };
	}

	setSelectedChar(charData) {
		console.log(charData);
		this.setState({ selectedChar: charData });
	}

	updateCharData(charData) {
		//aja request to update data or something
		//this.setState({ data });
		fetch('http://localhost:8080/1/character', fetchPostInit(charData))
			.then(response => console.log(response))
		//TODO THEN MERGE NEW CHAR DATA WITH OLD CHAR DATA IN REACT STATE

	}
	//{"username":username,"password":password}
	onLogIn(username, password) {
		this.setState({showSpinner: true});
		fetch('http://localhost:8080/login', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({"username":username,"password":password})
		})
		.then(response => {
				if (response && response.headers.get('authorization')) {
					localStorage.setItem('token', response.headers.get('authorization'));
					this.setState({showSpinner: false, isLoggedIn: true});
				} else {
					throw "Login failed"
				}
			}
		)
		.then(() => fetch("http://localhost:8080/1/character", fetchGetInit()))
		.then(response => response.json())
		.then(json => this.setState({data: json}))

		.catch(err =>
			this.setState({showSpinner: false, isLoggedIn: false})
		)
	}

	onCharAdd() {

	}

	render() {
		const { isLoggedIn } = this.state;
		return (
			<div className="App">
				<MainNav isLoggedIn={isLoggedIn}/>
				{this.state.showSpinner ? <Loading/> :
					<Switch>
						<Route path="/player" component={PlayerList}/>

						<Route exact path="/" render={(props) => <Main
							{...props}
							onLogIn={this.onLogIn}
							isLoggedIn={isLoggedIn}/>}
						/>

						{this.state.isLoggedIn &&
						<Route exact path="/character" render={(props) => <CharacterList
							{...props}
							onEditChar={this.setSelectedChar}
							data={this.state.data}/> }
						/>}

						{this.state.isLoggedIn &&
						<Route exact path="/character/edit" render={(props) =>
							<EditCharacter
							{...props}
							charData={this.state.selectedChar}
							updateCharData={this.updateCharData}
							handleCharChange={this.handleCharChange}
							successCharMsg={this.state.successCharMsg}/>}
						/>}
					</Switch>
				}
			</div>
		);
	}


}



export default App;
