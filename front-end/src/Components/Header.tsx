import { Link } from 'react-router'
import './Header.css'

export function Header() {
    return (
        <>
            <nav>
                <Link className="nav-brand" to="/home">Gilded</Link>
                <ul className="nav-links">
                    <li><Link to="/home">Home</Link></li>
                    <li><Link to="/services">Services</Link></li>
                    <li><Link to="/products">Products</Link></li>
                    <li><Link to="/booking">Book Now</Link></li>
                    <li><Link to="/cart">Cart</Link></li>
                    <li><Link to="/account">Account</Link></li>
                </ul>
            </nav>
        </>
    )
}