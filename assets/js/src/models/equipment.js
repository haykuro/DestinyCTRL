define(function() {
  function createStat(stat, meta) {
    return {
      name : meta.statName,
      value : stat.value,
      description : meta.statDescription,
      icon : 'https://www.bungie.net/' + meta.icon.replace(/^\//, '')
    };
  }

  function Equipment(definitions, repo) {
    var meta = definitions.items[repo.itemHash];

    this.id = repo.itemHash;
    this.name = meta.itemName;
    this.type = meta.itemType;
    this.typeName = meta.itemTypeName;
    this.level = repo.itemLevel;
    this.description = meta.itemDescription;
    this.icon = 'https://www.bungie.net/' + meta.icon.replace(/^\//, '');
    this.stats = {};
    this.primaryStatId = null;
    this.talentGrid = [];
    this.tier = { type : meta.tierType, name : meta.tierTypeName };

    console.log(meta);

    this._definitions = definitions;

    if(repo.baseStats) {
      this._fillBaseStats(repo.baseStats);
    }

    if(meta.primaryBaseStat) {
      this._fillPrimaryStat(meta.primaryBaseStat);
    }

    if(repo.nodes) {
      this._fillTalentGrid(
        repo.nodes,
        definitions.talentGrids[meta.talentGridHash]
      );
    }

    delete this._definitions;
  }

  Equipment.prototype._fillBaseStats = function(stats) {
    stats.forEach(function(stat) {
      var meta = this._definitions.stats[stat.statHash];

      this.stats[meta.statIdentifier] = createStat(stat, meta);
    }, this);
  };

  Equipment.prototype._fillPrimaryStat = function(stat) {
    var meta = this._definitions.stats[stat.statHash];

    this.primaryStatId = meta.statIdentifier;

    this.stats[this.primaryStatId] = createStat(stat, meta);
  };

  Equipment.prototype._fillTalentGrid = function(itemNodes, talentGrid) {
    itemNodes.map(function(node, idx) {
      // The talentGrid maps 1:1 to an
      // item's "nodes"; Thanks for the confusing
      // definitions Bungie!

      var talentNode = talentGrid.nodes[idx];
      var step = talentNode.steps[node.stepIndex];

      return {
        name : step.nodeStepName,
        description : step.nodeStepDescription,
        icon : 'https://www.bungie.net/' + step.icon.replace(/^\//, ''),
        requirements : step.activationRequirement,
        active : node.isActivated,

        // We need the row-column data from the
        // talentGridNode to properly build our
        // items progression matrix, order isn't
        // important (we sort that out later)

        row : talentNode.row,
        column : talentNode.column
      };
    }).forEach(function(node) {
      // We only want rows and columns that
      // are greater than 1, from what I can
      // tell anything but that isn't used

      if(node.row > -1 && node.column > -1) {
        // Build our column-row matrix, again,
        // not worrying about sort order as we
        // will handle that later

        if(! this.talentGrid.hasOwnProperty(node.column)) {
          this.talentGrid[node.column] = [];
        }

        this.talentGrid[node.column].push(node);
      }
    }, this);

    // Sort the row columns just in case
    // we have them in the wrong order from
    // the previous operations

    this.talentGrid.forEach(function(column) {
      column.sort(function(a, b) {
        return a.row - b.row;
      });
    });
  }

  return Equipment;
});
