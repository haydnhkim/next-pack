const { readdirSync } = require('fs');

const fixedOrder = ['react', 'prop-types', 'next', 'graphql', 'apollo'];

module.exports = styleApi => {
  const {
    alias,
    and,
    not,
    dotSegmentCount,
    hasNoMember,
    isAbsoluteModule,
    isNodeModule,
    isRelativeModule,
    moduleName,
    unicode,
    naturally,
  } = styleApi;

  const modules = readdirSync('./node_modules');

  const isFromNodeModules = imported =>
    modules.indexOf(imported.moduleName.split('/')[0]) !== -1;
  const isReactModule = imported =>
    Boolean(
      imported.moduleName.match(/^(react|prop-types|redux|next|graphql|apollo)/)
    );
  const isStylesModule = imported =>
    Boolean(imported.moduleName.match(/\.(s?css|less)$/));

  const reactComparator = (name1, name2) => {
    let i1 = fixedOrder.indexOf(name1);
    let i2 = fixedOrder.indexOf(name2);

    i1 = i1 === -1 ? Number.MAX_SAFE_INTEGER : i1;
    i2 = i2 === -1 ? Number.MAX_SAFE_INTEGER : i2;

    return i1 === i2 ? naturally(name1, name2) : i1 - i2;
  };

  return [
    // import … from "fs";
    {
      match: isNodeModule,
      sort: moduleName(naturally),
      sortNamedMembers: alias(unicode),
    },
    { separator: false },

    // import React from "react";
    {
      match: isReactModule,
      sort: moduleName(reactComparator),
      sortNamedMembers: alias(unicode),
    },
    { separator: false },

    // import uniq from 'lodash/uniq';
    {
      match: isFromNodeModules,
      sort: moduleName(naturally),
      sortNamedMembers: alias(unicode),
    },
    { separator: false },

    // import "foo"
    { match: and(hasNoMember, isAbsoluteModule) },
    { separator: false },

    // import Component from "components/Component.jsx";
    {
      match: isAbsoluteModule,
      sort: moduleName(naturally),
      sortNamedMembers: alias(unicode),
    },
    { separator: false },

    // import "./foo"
    { match: and(hasNoMember, isRelativeModule, not(isStylesModule)) },
    { separator: false },

    // import … from "./foo";
    // import … from "../foo";
    {
      match: and(isRelativeModule, not(isStylesModule)),
      sort: [dotSegmentCount, moduleName(naturally)],
      sortNamedMembers: alias(unicode),
    },
    { separator: false },

    // import "./styles.css";
    { match: and(hasNoMember, isRelativeModule, isStylesModule) },

    // import styles from "./Components.scss";
    {
      match: isStylesModule,
      sort: [dotSegmentCount, moduleName(naturally)],
      sortNamedMembers: alias(unicode),
    },
    { separator: false },
    { separator: true },
  ];
};
