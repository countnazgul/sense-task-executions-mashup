import axios from "axios";

export async function Get(path) {
  const xref = generateXref();
  let url = buildUrl(path);
  url += path.indexOf("?") > -1 ? `&Xrfkey=${xref}` : `?Xrfkey=${xref}`;

  return await axios
    .get(url, {
      headers: {
        "X-Qlik-Xrfkey": `${xref}`,
      },
    })
    .catch((e) => {
      console.log(e);
      return e;
    });
}

function generateXref() {
  var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  var string_length = 16;
  var value = "";
  for (var i = 0; i < string_length; i++) {
    var rNum = Math.floor(Math.random() * chars.length);
    value += chars.substring(rNum, rNum + 1);
  }
  return value;
}

function buildUrl(reqPath) {
  const location = window.location;
  const path = location.pathname.split("/");
  const finalPath = path[1] == "extensions" ? "qrs" : `${path[1]}/qrs`;

  return `${location.origin}/${finalPath}/${reqPath}`;
}
