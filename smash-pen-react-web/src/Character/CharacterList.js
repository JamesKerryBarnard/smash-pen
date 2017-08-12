import React, { Component } from 'react';
import '../pure-release-1.0.0/tables-min.css';
import '../pure-release-1.0.0/menus-min.css'
import '../pure-release-1.0.0/menus-core-min.css';
import '../pure-release-1.0.0/menus-dropdown-min.css';

import CharacterRow from "./CharacterRow";
import CharacterDropdown from "./CharacterDropdown";
import {Link} from "react-router-dom";

const characters = [
	"Pikachu",
	"Gannondorf",
	"Jigglypuff",
	"Zelda",
	"Shiek"

];

class CharacterList extends Component {
	constructor(props) {
		super(props);
		this.onDropDownChange = this.onDropDownChange.bind(this);
		this.state = { charDropDownName: '' };
	}

	onDropDownChange(e) {
		this.setState({ charDropDownName: e.target.value.toLowerCase()});
	}

	render() {
		const { match, onEditChar, data } = this.props;

		return (
		<div>
			Characters:
			<br/><br/><br/>
			<table className="pure-table">
				<form className="pure-form">
					<tr>
						<td>Add a new character</td>
						<td>
							<CharacterDropdown
								onDropDownChange={this.onDropDownChange}
								characters={characters}/>
						</td>
						<td>
							<Link to={match.url + "/edit"}>
								<button className="pure-button"
										onClick={() =>
											onEditChar(data.find((it) => {return it.name.toLowerCase() === this.state.charDropDownName}))}
								>Add</button>
							</Link>
						</td>
					</tr>
				</form>
			</table>
			<br/><br/>
			<table className="pure-table">
				{
					data.filter((it)=> it.notes)
						.map((it) =>
						<CharacterRow
							key={it.name}
							data={it}
							match={match}
							onEditChar={onEditChar}/>)
				}
			</table>
		</div>
		);
	}
}

export default CharacterList;