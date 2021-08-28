import pluginPkg from "../../package.json";
import { Field } from "./components/Field";
import Initializer from "./containers/Initializer";
import lifecycles from "./lifecycles";
import pluginId from "./pluginId";
import trads from "./translations";

export default (strapi) => {
  const pluginDescription =
    pluginPkg.strapi.description || pluginPkg.description;
  const icon = pluginPkg.strapi.icon;
  const name = pluginPkg.strapi.name;

  const plugin = {
    blockerComponent: null,
    blockerComponentProps: {},
    description: pluginDescription,
    icon,
    id: pluginId,
    initializer: Initializer,
    injectedComponents: [],
    isReady: false,
    isRequired: pluginPkg.strapi.required || false,
    layout: null,
    lifecycles,
    mainComponent: null,
    name,
    preventComponentRendering: false,
    trads,
    menu: {
      pluginsSectionLinks: [],
    },
  };

  strapi.registerField({ type: "gridlayout", Component: Field });

  return strapi.registerPlugin(plugin);
};
