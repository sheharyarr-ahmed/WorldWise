/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import PropTypes from "prop-types";

const CitiesContext = createContext();
const BASE_URL = "http://localhost:8000";

function CitiesProvider({ children }) {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCity, setCurrentCity] = useState({});
  const [lastVisitedPosition, setLastVisitedPosition] = useState(null);
  useEffect(function () {
    async function fetchCities() {
      try {
        setIsLoading(true);
        const res = await fetch(`${BASE_URL}/cities`);
        if (!res.ok) throw new Error("Failed to load cities");
        const data = await res.json();
        setCities(data);
      } catch {
        alert("THERE WAS AN ERROR LOADING DATA");
      } finally {
        setIsLoading(false);
      }
    }
    fetchCities();
  }, []);

  const getCity = useCallback(
    async function getCity(id) {
      if (!id) return;
      const cleanId = String(id).split("?")[0];
      const numericId = Number(cleanId);
      try {
        setIsLoading(true);
        const res = await fetch(`${BASE_URL}/cities/${cleanId}`);
        if (!res.ok) throw new Error("Failed to load city");
        const data = await res.json();
        setCurrentCity(data);
        if (data?.position)
          setLastVisitedPosition([data.position.lat, data.position.lng]);
      } catch {
        const fallback = cities.find(
          (city) =>
            String(city.id) === cleanId ||
            (Number.isFinite(numericId) && city.id === numericId),
        );
        if (fallback) {
          setCurrentCity(fallback);
          if (fallback?.position)
            setLastVisitedPosition([
              fallback.position.lat,
              fallback.position.lng,
            ]);
          return;
        }
        alert("THERE WAS AN ERROR LOADING DATA");
      } finally {
        setIsLoading(false);
      }
    },
    [cities],
  );

  async function createCity(newCity) {
    try {
      setIsLoading(true);
      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("Failed to create city");
      const data = await res.json();
      setCities((prev) => [...prev, data]);
      setCurrentCity(data);
      if (data?.position)
        setLastVisitedPosition([data.position.lat, data.position.lng]);
      return data;
    } catch {
      alert("there was an error loading the data....");
      return null;
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        lastVisitedPosition,
        createCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("useCities must be used within a CitiesProvider");
  return context;
}

CitiesProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { CitiesProvider, useCities };
