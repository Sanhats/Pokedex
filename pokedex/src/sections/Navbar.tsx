import React, { useEffect, useState } from "react";
import pokeballIcon from "../assets/assets/pokeball-icon.png";
import { Link, useLocation } from "react-router-dom";
import { useAppDispatch } from "../app/hooks";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navigationRoutes = [
    { name: "Buscar", route: "/search" },
    { name: "Pokemon", route: "/pokemon" },
    { name: "Favoritos", route: "/list" },
  ];

  const location = useLocation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const index = navigationRoutes.findIndex(({ route }) =>
      location.pathname.includes(route)
    );
    ul(index);
  }, [location.pathname, navigationRoutes]);

  function ul(index: number) {
    const underlines = document.querySelectorAll<HTMLElement>(".underline");
    for (let i = 0; i < underlines.length; i++) {
      underlines[i].style.transform = `translate3d(${index * 100}%, 0, 0)`;
    }
  }

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav>
      <div className="block">
        <img src={pokeballIcon} alt="Pokeball Icon" />
      </div>
      <div className={`data ${isOpen ? "open" : ""}`}>
        <ul>
          <div className="underline"></div>
          <div className="underline"></div>
          <div className="underline"></div>
          {navigationRoutes.map(({ name, route }, index) => (
            <Link to={route} key={index}>
              <li onClick={() => setIsOpen(false)}>{name}</li>
            </Link>
          ))}
        </ul>
      </div>
      <div className="block hamburger" onClick={toggleMenu}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
          />
        </svg>
      </div>
    </nav>
  );
}
