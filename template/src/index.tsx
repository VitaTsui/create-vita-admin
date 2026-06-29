import "./install-object-has-own-polyfill";

import "./index.less";
import "./styles/antd-overload.less";

import { BrowserRouter } from "react-router-dom";
import Internationalization from "./layout/I18n";
import ReactDOM from "react-dom/client";
import Routes from "./router/Routes";

import { SingleRouter } from "@hsu-react/single-router";

import antDesign from "@iconify/json/json/ant-design.json";
import carbon from "@iconify/json/json/carbon.json";
import ep from "@iconify/json/json/ep.json";
import iconPark from "@iconify/json/json/icon-park.json";
import letsIcons from "@iconify/json/json/lets-icons.json";
import materialSymbols from "@iconify/json/json/material-symbols.json";
import mingcute from "@iconify/json/json/mingcute.json";
import tabler from "@iconify/json/json/tabler.json";
import basil from "@iconify/json/json/basil.json";
import fa from "@iconify/json/json/fa.json";
import faSolid from "@iconify/json/json/fa-solid.json";
import octicon from "@iconify/json/json/octicon.json";
import ph from "@iconify/json/json/ph.json";
import ix from "@iconify/json/json/ix.json";
import mdi from "@iconify/json/json/mdi.json";
import faRegular from "@iconify/json/json/fa-regular.json";
import weui from "@iconify/json/json/weui.json";
import fluent from "@iconify/json/json/fluent.json";
import iconParkSolid from "@iconify/json/json/icon-park-solid.json";
import iconParkOutline from "@iconify/json/json/icon-park-outline.json";
import tdesign from "@iconify/json/json/tdesign.json";
import solar from "@iconify/json/json/solar.json";
import ri from "@iconify/json/json/ri.json";
import eosIcons from "@iconify/json/json/eos-icons.json";
import heroiconsOutline from "@iconify/json/json/heroicons-outline.json";
import mi from "@iconify/json/json/mi.json";
import ci from "@iconify/json/json/ci.json";
import { addCollection, IconifyJSON } from "@iconify/react/dist/iconify.js";
import { ChakraProvider, createSystem, defaultConfig } from "@chakra-ui/react";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";

addCollection(ep);
addCollection(antDesign);
addCollection(mingcute);
addCollection(materialSymbols as IconifyJSON);
addCollection(carbon);
addCollection(letsIcons);
addCollection(iconPark);
addCollection(tabler);
addCollection(basil);
addCollection(fa);
addCollection(faSolid);
addCollection(octicon);
addCollection(ph as IconifyJSON);
addCollection(ix);
addCollection(mdi);
addCollection(faRegular);
addCollection(weui);
addCollection(fluent as IconifyJSON);
addCollection(iconParkSolid);
addCollection(iconParkOutline);
addCollection(tdesign);
addCollection(solar as IconifyJSON);
addCollection(ri as IconifyJSON);
addCollection(eosIcons as IconifyJSON);
addCollection(heroiconsOutline as IconifyJSON);
addCollection(mi as IconifyJSON);
addCollection(ci);

window.minCrtTm = "2025-08-01";

const cache = createCache({
  key: "css",
  prepend: true,
});

const system = createSystem(defaultConfig, {
  disableLayers: true,
  preflight: false,
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <SingleRouter showPath={false}>
      <CacheProvider value={cache}>
        <ChakraProvider value={system}>
          <Internationalization>
            <Routes />
          </Internationalization>
        </ChakraProvider>
      </CacheProvider>
    </SingleRouter>
  </BrowserRouter>,
);
