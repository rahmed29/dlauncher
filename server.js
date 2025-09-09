import os from "node:os";
import express from "express";
import shell from "shelljs";
const app = express();

const PORT_NUMBER = 2077;

app.use(express.static("./public"));
app.set("view engine", "ejs");

const shell_output = shell.exec("tailscale ip");
const tailnet_ip = shell_output.substring(0, shell_output.indexOf("\n")).trim();
const priv_ip = os.networkInterfaces()["enp2s0"][0]["address"];

app.get("/", async (req, res) => {
  res.status(200).render("index.ejs", {
    albums: JSON.stringify(
      [
        {
          name: "File Browser",
          img: "/app_icons/fb.png",
          port: 7171,
        },
        {
          name: "prods.party",
          img: "/app_icons/cat.png",
          port: "1738/ryaan",
        },
        {
          name: "Jellyfin",
          img: "/app_icons/jf.png",
          port: 8096,
        },
        {
          name: "Kavita",
          img: "/app_icons/kav.svg",
          port: "5000/login?apiKey=5114a417-c7e0-435d-9ac4-a39919ed2a95",
        },
        {
          name: "Cobalt",
          img: "/app_icons/cobalt.png",
          port: 8080,
        },
        {
          name: "Notes",
          img: "/app_icons/book.png",
          port: 5555,
        },
        {
          name: "Deno Blog",
          img: "/app_icons/deno.png",
          port: 8000,
        },
        {
          name: "Code Server",
          img: "/app_icons/coder.png",
          port: 1337,
        },
      ].map((e) => {
        e.lan = `http://${priv_ip}:${e.port}`;
        e.ts = `http://${tailnet_ip}:${e.port}`;
        return e;
      })
    ),
    bio: "Self Hosted Applications",
  });
});

app.listen(PORT_NUMBER, () => {
  console.log(`Server is running on port ${PORT_NUMBER}`);
});
