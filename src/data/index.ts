export const cities = [
  {
    name: "New York",
    sales: 9800,
  },
  {
    name: "London",
    sales: 4567,
  },
  {
    name: "Hong Kong",
    sales: 3908,
  },
  {
    name: "San Francisco",
    sales: 2400,
  },
  {
    name: "Singapore",
    sales: 1908,
  },
  {
    name: "Zurich",
    sales: 1398,
  },
];

export const monorepoData = {
  apps: [
    {
      image: "",
      name: "Monoripify",
      domain: "monoripify.io",
      commit: "Launch new landing page",
      date: new Date(),
    },
  ],
  packages: [
    {
      image: "",
      name: "shared-utils",
      moduleName: "@shared-utils",
      commit: "Launch new package",
      date: new Date(),
    },
  ],
};

export type MonorepoData = typeof monorepoData
