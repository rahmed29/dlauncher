import os from "node:os";
import express from "express";
import shell from "shelljs";
const app = express();

const PORT_NUMBER = 2077;

app.use(express.static("./public"));
app.set("view engine", "ejs");

const shellOutput = shell.exec("tailscale ip");
const tailnetIp = shellOutput.substring(0, shellOutput.indexOf("\n")).trim();
const privateIp = os.networkInterfaces()["enp2s0"][0]["address"];

let routingEnabled = false;
let homeIp = undefined;

async function getIp() {
  try {
    const response = await fetch("https://ipv4.icanhazip.com/");
    const text = await response.text();
    homeIp = text.replaceAll("\n", "");
    return true;
  } catch (err) {
    return false;
  }
}

await getIp();

const routes = [
  {
    shorthand: "drive",
    name: "File Browser",
    img: "/app_icons/fb.png",
    port: 7171,
  },
  {
    shorthand: "beats",
    name: "prods.party",
    img: "/app_icons/cat.png",
    port: "1738/ryaan",
  },
  {
    shorthand: "jellyfin",
    name: "Jellyfin",
    img: "/app_icons/jf.png",
    port: 8096,
  },
  {
    shorthand: "kavita",
    name: "Kavita",
    img: "/app_icons/kav.svg",
    port: "5000/login?apiKey=5114a417-c7e0-435d-9ac4-a39919ed2a95",
  },
  {
    shorthand: "cobalt",
    name: "Cobalt",
    img: "/app_icons/cobalt.png",
    port: 8080,
  },
  {
    shorthand: "notes",
    name: "Notes",
    img: "/app_icons/book.png",
    port: 5555,
  },
  {
    shorthand: "blog",
    name: "Deno Blog",
    img: "/app_icons/deno.png",
    port: 8000,
  },
  {
    shorthand: "code",
    name: "Code Server",
    img: "/app_icons/coder.png",
    port: 1337,
  },
];

app.get("/getRoutes", async (req, res) => {
  const albums = routes.map((e) => {
    e.lan = `http://${privateIp}:${e.port}`;
    e.ts = `http://${tailnetIp}:${e.port}`;
    return e;
  });
  res.status(200).json({
    routes: albums,
    routingEnabled,
  });
});

app.get("/", async (req, res) => {
  res.status(200).render("index.ejs");
});

app.post("/_toggleRouting", (req, res) => {
  routingEnabled = !routingEnabled;
  res.status(200).json({ routingEnabled });
});

app.get("/_refetch", async (req, res) => {
  const ok = await getIp();
  if (ok) {
    res
      .status(200)
      .json({ status: "The server has refetched it's public IP." });
  } else {
    res.status(500).json({
      error:
        "The server attempted to refetch it's public IP, but something went wrong.",
    });
  }
});

app.get("/:route", (req, res) => {
  const route = req.params.route;
  const service = routes.find((e) => e.shorthand === route);
  if (!service) {
    return res.status(404).json({ error: "No configured route." });
  }
  // connecting from inside the home network
  if (
    (req.header("CF-Connecting-IP") &&
      req.header("CF-Connecting-IP") === homeIp) ||
    !req.header("CF-Connecting-IP")
  ) {
    res.redirect(`http://${privateIp}:${service.port}`);
    // connecting from outside the home network
  } else {
    res.redirect(`http://${tailnetIp}:${service.port}`);
  }
});

app.listen(PORT_NUMBER, () => {
  console.log(`Server is running on port ${PORT_NUMBER}`);
});
