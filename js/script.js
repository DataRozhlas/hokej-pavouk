/* eslint-disable max-len */
import React, { Component } from "react";
import { render } from "react-dom";
import Select, { components } from "react-select";
import { codeToName } from "./helperFunctions";
import "core-js/features/array/includes";

const SingleValue = ({ children, data, ...props }) => (
  <components.SingleValue {...props}>
    <img
      alt={children}
      src={`https://data.irozhlas.cz/hokej-pavouk/flags/${data.value}.png`}
      className="flag"
    />
    {children}
  </components.SingleValue>
);

const Option = ({ children, data, ...props }) => (
  <components.Option {...props}>
    <img
      alt={children}
      src={`https://data.irozhlas.cz/hokej-pavouk/flags/${data.value}.png`}
      className="flag"
    />
    {children}
  </components.Option>
);

const selectStyles = {
  menu: provided => ({
    ...provided,
  }),
};

const QuarterSelect = ({
  handler,
  position,
  quarterPool,
  selection,
}) => {
  const options = quarterPool.map(el => (selection.includes(el)
    ? { value: el, isDisabled: true, label: codeToName(el) }
    : { value: el, label: codeToName(el) }
  ));

  return (
    <Select
      options={options}
      className={`hokej-select hokej-select-${position}`}
      value={selection[position] !== 0
        ? { value: selection[position], label: codeToName(selection[position]) }
        : 0}
      onChange={val => handler(val.value, position)}
      placeholder="-- vyberte tým --"
      isSearchable={false}
      components={{ SingleValue, Option }}
      styles={selectStyles}
    />
  );
};

const FilterSelect = ({
  handler,
  position,
  selection,
  pickStart,
}) => {
  const options = selection
    .slice(pickStart, pickStart + 2)
    .filter(el => el !== 0)
    .map(el => ({ value: el, label: codeToName(el) }));

  return (
    <Select
      options={options}
      className={`hokej-select hokej-select-${position}`}
      value={selection[position] !== 0
        ? { value: selection[position], label: codeToName(selection[position]) }
        : 0}
      onChange={val => handler(val.value, position)}
      placeholder="-- vyberte tým --"
      isSearchable={false}
      isDisabled={selection.slice(pickStart, pickStart + 2).every(el => el !== 0) ? null : true}
      components={{ SingleValue, Option }}
    />
  );
};

const ThirdPlaceSelect = ({
  handler,
  selection,
}) => {
  const options = selection
    .slice(8, 12)
    .filter(el => !selection.slice(12, 14).includes(el))
    .filter(el => el !== 0)
    .map(el => ({ value: el, label: codeToName(el) }));

  return (
    <Select
      options={options}
      className="hokej-select hokej-select-15"
      value={selection[15] !== 0
        ? { value: selection[15], label: codeToName(selection[15]) }
        : 0}
      onChange={val => handler(val.value, 15, true)}
      placeholder="-- vyberte tým --"
      isSearchable={false}
      isDisabled={selection.slice(12, 14).every(el => el !== 0) ? null : true}
      components={{ SingleValue, Option }}
    />
  );
};

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
    17: third place loser

    first select all quarters

    horní kastlík áčko, spodní kastlík béčko
    */
    this.state = {
      selection: new Array(17).fill(0),
      // selection: ["dk", "at", "fi", "ch", "fr", "cz", "ca", "it",
      //  "dk", "fi", "fr", "ca", "dk", "fr", "dk", "fi", "ca"],
      quarterPool: {
        1: ["ca", "us", "fi", "de", "sk", "dk", "fr", "gb"],
        2: ["se", "ru", "cz", "ch", "no", "lv", "at", "it"],
      },
      shareLink: undefined,
    };

    this.handleSelection = this.handleSelection.bind(this);
    this.sendForm = this.sendForm.bind(this);
    this.FbShare = this.FbShare.bind(this);
    this.TwShare = this.TwShare.bind(this);
  }

  componentDidMount() {
    if (window.location.href.includes("test")) {
      this.setState({
        selection: ["dk", "at", "fi", "ch", "fr", "cz", "ca", "it",
          "dk", "fi", "fr", "ca", "dk", "fr", "dk", "fi", "ca"],
      });
    }
  }

  handleSelection(value, position, thirdPlace = false) {
    const { selection, quarterPool } = this.state;
    selection[position] = value;
    if (position < 2) selection[8] = 0;
    else if (position === 2 || position === 3) selection[9] = 0;
    else if (position === 4 || position === 5) selection[10] = 0;
    else if (position === 6 || position === 7) selection[11] = 0;
    else if (position === 8 || position === 9) selection[12] = 0;
    else if (position === 10 || position === 11) selection[13] = 0;

    if (position < 4) selection[12] = 0;
    if (position >= 4 && position < 8) selection[13] = 0;

    if (position <= 13) {
      selection[14] = 0;
      selection[15] = 0;
      selection[16] = 0;
    }

    // eslint-disable-next-line prefer-destructuring
    if (thirdPlace) selection[16] = selection.slice(8, 12).filter(el => !selection.slice(13, 15).includes(el) && selection[15] !== el)[0];
    this.setState({ selection, quarterPool });
  }

  sendForm() {
    const { selection } = this.state;
    console.log(selection);
    // voheky
    const correctedSelection = selection.slice(0, 14);
    correctedSelection.push(selection[15], selection[16], selection[14], "()");
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "https://jq0d6e5rs6.execute-api.eu-west-1.amazonaws.com/prod");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = () => {
      if (xhr.status === 200) {
        this.setState({ shareLink: JSON.parse(xhr.responseText) });
      }
    };
    xhr.send(JSON.stringify(correctedSelection));
  }

  FbShare() {
    const { shareLink } = this.state;
    window.open(`${`https://www.facebook.com/sharer/sharer.php?u=${shareLink}`}`, "Sdílení", "width=550,height=450,scrollbars=no");
  }

  TwShare() {
    const { shareLink } = this.state;
    window.open(`${`https://twitter.com/share?url=${shareLink}`}`, "Sdílení", "width=550,height=450,scrollbars=no");
  }

  render() {
    const { quarterPool, selection, shareLink } = this.state;
    return (
      <div>
        <div className="hokej-container">
          <span className="hokej-desc-q">Čtvrtfinále</span>
          <QuarterSelect handler={this.handleSelection} position={0} quarterPool={quarterPool[1]} selection={selection} />
          <QuarterSelect handler={this.handleSelection} position={1} quarterPool={quarterPool[2]} selection={selection} />
          <img src="assets/bracket1.png" className="hokej-bracket-1" alt="" />
          <QuarterSelect handler={this.handleSelection} position={2} quarterPool={quarterPool[1]} selection={selection} />
          <QuarterSelect handler={this.handleSelection} position={3} quarterPool={quarterPool[2]} selection={selection} />

          <QuarterSelect handler={this.handleSelection} position={4} quarterPool={quarterPool[1]} selection={selection} />
          <QuarterSelect handler={this.handleSelection} position={5} quarterPool={quarterPool[2]} selection={selection} />
          <img src="assets/bracket1.png" className="hokej-bracket-2" alt="" />
          <QuarterSelect handler={this.handleSelection} position={6} quarterPool={quarterPool[1]} selection={selection} />
          <QuarterSelect handler={this.handleSelection} position={7} quarterPool={quarterPool[2]} selection={selection} />

          <span className="hokej-desc-s">Semifinále</span>
          <FilterSelect handler={this.handleSelection} position={8} pickStart={0} selection={selection} />
          <FilterSelect handler={this.handleSelection} position={9} pickStart={2} selection={selection} />
          <img src="assets/bracket2.png" className="hokej-bracket-3" alt="" />
          <FilterSelect handler={this.handleSelection} position={10} pickStart={4} selection={selection} />
          <FilterSelect handler={this.handleSelection} position={11} pickStart={6} selection={selection} />
          
          <span className="hokej-desc-f">Finále</span>
          <FilterSelect handler={this.handleSelection} position={12} pickStart={8} selection={selection} />
          <FilterSelect handler={this.handleSelection} position={13} pickStart={10} selection={selection} />

          <img src="assets/bracket3.png" className="hokej-bracket-4" alt="" />
          <span className="hokej-desc-w">Mistr světa 2019</span>
          <FilterSelect handler={this.handleSelection} position={14} pickStart={12} selection={selection} />

          <span className="hokej-desc-t">Třetí místo</span>
          <ThirdPlaceSelect handler={this.handleSelection} selection={selection} />
        </div>
        <div className="submit">
          {!shareLink
            ? (
              <button className="btn btn-primary" type="submit" disabled={selection.every(el => el !== 0) ? null : true} onClick={this.sendForm}>Uložit tip</button>
            ) : (
              <div className="btn btn-green">Tip uložen!</div>
            )}
          {window.innerWidth > 600
            ? (
              <span>
                <button className="btn btn-primary" type="submit" onClick={this.FbShare} disabled={shareLink ? null : true}>Sdílet na Facebooku</button>
                <button className="btn btn-primary" type="submit" onClick={this.TwShare} disabled={shareLink ? null : true}>Sdílet na Twitteru</button>
              </span>
            )
            : (
              <span>
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareLink}`} target="_blank" rel="noopener noreferrer"><button className="btn btn-primary" type="submit" disabled={shareLink ? null : true}>Sdílej na FB</button></a>
                <a href={`https://twitter.com/share?url=${shareLink}`} target="_blank" rel="noopener noreferrer"><button className="btn btn-primary" type="submit" disabled={shareLink ? null : true}>Sdílej na TW</button></a>
              </span>
            )}
        </div>
      </div>
    );
  }
}
// ========================================
render(<HokejApp />, document.getElementById("hokej"));
