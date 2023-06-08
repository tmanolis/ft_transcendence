import { Route, Link, Outlet } from "react-router-dom";

export default function RootRouter() {
  return (
    <>
      <nav>
        <Link to="/">PongStoryShort</Link>
        <Link to="/game">Pong</Link>
        <Link to="/Login">Login</Link>
      </nav>
      <div className="mainDiv">
        <Outlet />
      </div>
      <footer>
        made with ♥ by <a href="https://github.com/Ambervanbree">Amber</a> <a href="https://github.com/edogi">EdoGi</a><a href="https://github.com/tmanolis">Tiffany</a><a href="https://github.com/jas0nhuang">Jas0n</a>
      </footer>
    </>
  )
}
