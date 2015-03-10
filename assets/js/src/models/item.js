define(['models/bucket'], function(Bucket) {
  function createStat(stat, meta) {
    return {
      name : meta.statName,
      value : stat.value,
      description : meta.statDescription,
      icon : 'https://www.bungie.net/' + meta.icon.replace(/^\//, '')
    };
  }

  function Item(definitions, repo) {
    this.id = repo.itemHash;
    this.name = repo.itemName;
    this.type = repo.itemType;
    this.typeName = repo.itemType;
    this.description = repo.itemDescription;
    this.icon = 'https://www.bungie.net/' + repo.icon.replace(/^\//, '');
    this.stats = {};
    this.primaryStatId = null;
    this.talentGrid = definitions.talentGrids[repo.talentGridHash];
    this.tier = {
      type : repo.tierType,
      name : repo.tierName
    };

    for(var idx in repo.baseStats) {
      var baseStat = repo.baseStats[idx];
      var baseStatMeta = definitions.stats[baseStat.statHash];

      this.stats[baseStatMeta.statIdentifier] =
        createStat(baseStat, baseStatMeta);
    }

    var primaryBaseStat = repo.primaryBaseStat;
    var primaryBaseStatMeta = definitions.stats[primaryBaseStat.statHash];

    this.primaryStatId = primaryBaseStatMeta.statIdentifier;

    this.stats[this.primaryStatId] =
      createStat(primaryBaseStat, primaryBaseStatMeta);
  }

  return Item;
});
