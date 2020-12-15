import { Link } from "react-router-dom";

function Header(props) {
  return (
    <header>
      <nav className="site-header sticky-top py-1">
        <div className="container d-flex flex-column flex-md-row justify-content-between">
            <Link className="logo" to="/" aria-label="Product">
                XN<span>B</span>
            </Link>
            <Link className="mt-4"  to="/">Home</Link>
            <Link className="mt-4"  to="/contact">Contact</Link>            
            <Link className="mt-4"  to="/contact">Login</Link>            
        </div>
      </nav>
    </header>
  )
}

export default Header;