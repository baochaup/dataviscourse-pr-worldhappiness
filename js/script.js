loadData().then((data) => {

  this.activeCountry = null;
  this.activeYear = "1990";
  this.isImmigration = true;
  let that = this;

  function updateYear(year) {
    that.activeYear = year;
    worldMap.updateYear(that.activeYear);
  }

  function updateFlow(isImmigration) {
    that.isImmigration = isImmigration;
    worldMap.updateFlow(that.isImmigration);
    toggleFlow.updateLabel(that.isImmigration);
  }

  function updateActCountry(countryID) {
    that.activeCountry = countryID;
  }

  // render toggle button
  const toggleFlow = new ToggleButton(this.isImmigration, updateFlow);
  toggleFlow.drawToggle();

  // render year combo box
  const yearBox = new YearBox(data, this.activeYear, updateYear);
  yearBox.drawBox();

  // initialize and draw world map
  const worldMap = new WorldMap(data, this.activeYear, this.isImmigration, updateActCountry);
  d3.json("data/world-geo.json").then((mapData) => {
    worldMap.drawMap(mapData);
  });
});

// ******* DATA LOADING *******

/**
 * A file loading function or CSVs
 * @param file
 * @returns {Promise<T>}
 */
async function loadFile(file) {
  let data = await d3.csv(file).then((d) => {
    let mapped = d.map((g) => {
      for (let key in g) {
        let numKey = +key;
        if (numKey) {
          g[key] = +g[key];
        }
      }
      return g;
    });
    return mapped;
  });
  return data;
}

async function loadData() {
  let gps = await loadFile(
    "data/world_country_latitude_and_longitude_values.csv"
  );
  let mf = await loadFile("data/migflow.csv");

  return {
    coordinates: gps,
    migration: mf,
  };
}
