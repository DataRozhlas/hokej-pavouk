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
      return "Rusko";
    case "se":
      return "Švédsko";
    case "sk":
      return "Slovensko";
    case "us":
      return "USA";
    default:
      return code;
  }
}

export default codeToName;
