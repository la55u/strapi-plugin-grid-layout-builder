/*
 *
 * HomePage
 *
 */

import React, { memo } from "react";
import { PluginHeader } from "strapi-helper-plugin";
import pluginPkg from "../../../../package.json";

const HomePage = () => {
  return (
    <div className="container-fluid">
      <PluginHeader
        title={pluginPkg.strapi.name}
        description="TODO description"
      />

      <p>Hello</p>
    </div>
  );
};

export default memo(HomePage);
