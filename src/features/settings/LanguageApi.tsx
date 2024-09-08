import Axios from "../../lib/Aixo";
interface languageUpdate {
  id: string;
  lang: string;
}
export function updateLanguage({ id, lang }: languageUpdate) {
  return Axios.put("/users", { id: id, lang: lang });
}
