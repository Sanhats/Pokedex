import React, { useEffect } from "react";
import pokeballIcon from "../assets/assets/pokeball-icon.png";
import { Link, useLocation } from "react-router-dom";

import { useAppDispatch } from "../app/hooks";
export default function Navbar() {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const navigationRoutes = [
    {
      name: "Buscar",
      route: "/search",
    },
    
    {
      name: "Pokemon",
      route: "/pokemon",
    },
    {
      name: "Favoritos",
      route: "/list",
    },
    
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
    var underlines = document.querySelectorAll<HTMLElement>(".underline");
    for (var i = 0; i < underlines.length; i++) {
      underlines[i].style.transform = "translate3d(" + index * 100 + "%,0,0)";
    }
  }

  return (
    <nav>
      <div className="block">
        <img src={pokeballIcon} alt="" />
      </div>
      <div className="data">
        <ul>
          <div className="underline"></div>
          <div className="underline"></div>
          <div className="underline"></div>
          {navigationRoutes.map(({ name, route }, index) => {
            return (
              <Link
                to={route}
                key={index}
               
              >
                <li>{name}</li>
              </Link>
            );
          })}
        </ul>
      </div>
      
    </nav>
  );
}