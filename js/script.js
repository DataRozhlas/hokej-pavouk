/* eslint-disable max-len */
import React, { Component } from "react";
import { render } from "react-dom";
import { codeToName } from "./helperFunctions";

const QuarterSelect = ({
  handler,
  position,
  quarterPool,
  selection,
}) => (
  <select value={selection[position]} defaultValue="0" onChange={e => handler(e, position)}>
    <option disabled value={0}> -- vyberte tým-- </option>
    {quarterPool.map(el => (selection.includes(el)
      ? <option key={el} value={el} disabled>{codeToName(el)}</option>
      : <option key={el} value={el}>{codeToName(el)}</option>))}
  </select>
);

const FilterSelect = ({
  handler,
  position,
  selection,
  pickStart,
}) => (
  <select value={selection[position]} defaultValue="0" onChange={e => handler(e, position)}>
    <option disabled value={0}> -- vyberte tým-- </option>
    {selection.slice(pickStart, pickStart + 2).map(el => <option key={el} value={el}>{codeToName(el)}</option>)}
  </select>
);

const ThirdPlaceSelect = ({
  handler,
  selection,
}) => (
  <select value={selection[15]} defaultValue="0" onChange={e => handler(e, 15, true)}>
    <option disabled value={0}> -- vyberte tým-- </option>
    {selection
      .slice(8, 12)
      .filter(el => !selection.slice(13, 15).includes(el))
      .map(el => <option key={el} value={el}>{codeToName(el)}</option>)}
  </select>
);

class HokejApp extends Component {
  constructor(props) {
    super(props);
    /*
    The array:
    1-8: quarters - groups: 1+2, 3+4, 5+6, 7+8
    9-12: semis - groups: 9(from 1+2)+10(from3+4), 11(from5+6)12(from7+8)
    13-14: finals - 13(from 9+10),14(from11+12)
    15: winner (from 13+14)
    16: third place winner (from loser of semis)

    first select all quarters

    horní kastlík áčko, spodní kastlík béčko
    */
    this.state = {
      selection: new Array(17),
      quarterPool: {
        1: ["dk", "fi", "fr", "ca", "de", "sk", "us", "gb"],
        2: ["at", "ch", "cz", "it", "lv", "no", "ru", "se"],
      },
    };

    this.handleSelection = this.handleSelection.bind(this);
  }

  handleSelection(e, position, thirdPlace = false) {
    const { selection, quarterPool } = this.state;
    selection[position] = e.target.value;
    if (thirdPlace) selection[16] = selection.slice(8, 12).filter(el => !selection.slice(13, 15).includes(el) && selection[15] !== el);
    console.log(quarterPool);
    this.setState({ selection, quarterPool });
  }

  render() {
    const { quarterPool, selection } = this.state;
    console.log(selection);
    return (
      <div>
        {`Tohle jsou možnosti! ${selection}`}
        <div className="hokejFlex">
          <div>
            <form>
              <br />
              <QuarterSelect handler={this.handleSelection} position={0} quarterPool={quarterPool[1]} selection={selection} />
              <br />
              <QuarterSelect handler={this.handleSelection} position={1} quarterPool={quarterPool[2]} selection={selection} />
              <br />
              <br />
              <QuarterSelect handler={this.handleSelection} position={2} quarterPool={quarterPool[1]} selection={selection} />
              <br />
              <QuarterSelect handler={this.handleSelection} position={3} quarterPool={quarterPool[2]} selection={selection} />
              <br />
              <br />
              <QuarterSelect handler={this.handleSelection} position={4} quarterPool={quarterPool[1]} selection={selection} />
              <br />
              <QuarterSelect handler={this.handleSelection} position={5} quarterPool={quarterPool[2]} selection={selection} />
              <br />
              <br />
              <QuarterSelect handler={this.handleSelection} position={6} quarterPool={quarterPool[1]} selection={selection} />
              <br />
              <QuarterSelect handler={this.handleSelection} position={7} quarterPool={quarterPool[2]} selection={selection} />
            </form>
          </div>
          <div>
            <form>
              <br />
              <br />
              <br />
              <FilterSelect handler={this.handleSelection} position={8} pickStart={0} selection={selection} />
              <br />
              <FilterSelect handler={this.handleSelection} position={9} pickStart={2} selection={selection} />
              <br />
              <br />
              <br />
              <br />
              <br />
              <FilterSelect handler={this.handleSelection} position={10} pickStart={4} selection={selection} />
              <br />
              <FilterSelect handler={this.handleSelection} position={11} pickStart={6} selection={selection} />
            </form>
          </div>
          <div>
            <form>
              <br />
              <br />
              <br />
              <br />
              <FilterSelect handler={this.handleSelection} position={12} pickStart={8} selection={selection} />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <FilterSelect handler={this.handleSelection} position={13} pickStart={10} selection={selection} />
            </form>
          </div>
          <div>
            <form>
              <br />
              {"1. místo"}
              <FilterSelect handler={this.handleSelection} position={14} pickStart={12} selection={selection} />
              <br />
              <br />
              <br />
              <br />
              <br />
              {"3. místo"}
              <ThirdPlaceSelect handler={this.handleSelection} selection={selection} />
            </form>
          </div>
        </div>
      </div>
    );
  }
}
// ========================================
render(<HokejApp />, document.getElementById("hokej"));
