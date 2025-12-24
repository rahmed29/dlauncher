# dlauncher

![A screenshot of the dlauncher dashboard](./screenshot.png)

[prods.party](https://github.com/rahmed29/prods.party) repurposed into a dead simple app launcher / dashboard / directory for self-hosted
applications that I connect to over LAN or Tailscale.

dlauncher provides 6 different ways to display links to applications:

1. One link, `private-ip:port`. This is the default and is ideal if you have subnet routing enabled on your Tailnet
2. One link, `tailscale-ip:port`
3. One link, `server-hostname:port`. This works if your device can resolve the server's hostname
4. One link, `dlauncher.yourdomain.com/app-name`, that dyanmically routes your request to either of the first 2 based on your connecting IP. This is useful if you do not have subnet routing enabled on your Tailnet. If you are connecting to the launcher using your server's private IP or Tailscale IP, this option is of no use.
5. Two links, one for `private-ip:port` and one for `tailscale-ip:port`. This is useful if you do not have subnet routing enabled on your tailnet and are using a VPN or proxy that masks your connecting IP (iCloud Private Relay, etc.)
6. One link, `app-name.yourdomain.com`. This is useful if your applications are publicly available

Just run `deno -P server.js` and you'll be good to go! The server runs on port `2077`. Of course, if you're not me you'll need to modify the `routes` object in `server.js`.
