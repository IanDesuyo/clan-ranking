import "./app.css";
import axios from "axios";
import { useEffect, useState, createContext } from "react";
import { convertDate, handleError } from "./utils";
import Navbar from "./components/navbar";
import RankingTable from "./components/rankingTable";
import Footer from "./components/footer";
import ScrollToTop from "./components/scrollToTop";
import { useToast } from "@chakra-ui/react";
import { HashRouter, Route, useLocation } from "react-router-dom";
import ClanDetails from "./components/clanDetails";

export const Config = createContext({});

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

export default function App() {
  const query = useQuery();
  const queryServer = query.get("server");
  const [config, _setConfig] = useState({
    ...(JSON.parse(localStorage.getItem("rankingConfig")) || queryServer && { server: queryServer } || { server: 1 }),
    datetime: convertDate(new Date()),
  });

  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [isLoading, setLoading] = useState(true);
  const toast = useToast();

  const setConfig = (key, value) => {
    console.log(key, value);
    if (key === "loadMore") {
      return setPage(prev => prev + 1);
    }
    if ((key === "server" && value !== config.server) || key === "datetime") {
      setData([]);
      setPage(0);
    } else if (key === "detailType") {
      value = config.detailType === 1 ? 2 : 1;
    }

    _setConfig(prev => {
      if (key !== "datetime") {
        localStorage.setItem("rankingConfig", JSON.stringify({ ...prev, [key]: value }));
      }

      return { ...prev, [key]: value };
    });
  };

  useEffect(() => {
    setLoading(true);
    const _page = page < 0 ? 0 : page;

    axios
      .get(
        `${process.env.REACT_APP_API_HOST}/ranking/${config.server}` +
        `?ts_start=${config.datetime.getTime() / 1000}&page=${_page}`
      )
      .then(res => {
        setData(prev => [...prev, ...res.data]);
        setLoading(false);
      })
      .catch(error => {
        toast(handleError(error));
        setLoading(false);
      });
  }, [config.server, config.datetime, page]);

  return (
    <Config.Provider value={{ config: config, setConfig: setConfig }}>
      <HashRouter>
        <div style={{ minHeight: "100vh" }}>
          <Navbar />
          <RankingTable data={data} isLoading={isLoading} />
          <Route path="/clan/:server/:leaderHash" component={ClanDetails} />
          <ScrollToTop />
          <Footer />
        </div>
      </HashRouter>
    </Config.Provider>
  );
}
