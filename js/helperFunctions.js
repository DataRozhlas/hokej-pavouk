export function codeToName(code) {
  switch (code) {
    case "at":
      return "Rakousko";
    case "ca":
      return "Kanada";
    case "ch":
      return "Švýcarsko";
    case "cz":
      return "Česko";
    case "de":
      return "Německo";
    case "dk":
      return "Dánsko";
    case "fi":
      return "Finsko";
    case "fr":
      return "Francie";
    case "gb":
      return "Velká Británie";
    case "it":
      return "Itálie";
    case "lv":
      return "Lotyšsko";
    case "no":
      return "Norsko";
    case "ru":
      return "Ruští sportovci";
    case "se":
      return "Švédsko";
    case "sk":
      return "Slovensko";
    case "us":
      return "USA";
    case "by":
      return "Bělorusko";
    case "kz":
      return "Kazachstán";
    default:
      return code;
  }
}

export function posToTeam(pos) {
  switch (pos) {
    case 0:
      return "A1";
    case 1:
      return "B4";
    case 2:
      return "B2";
    case 3:
      return "A3";
    case 4:
      return "B1";
    case 5:
      return "A4";
    case 6:
      return "A2";
    case 7:
      return "B3";
    default:
      return pos;
  }
}

export default codeToName;
