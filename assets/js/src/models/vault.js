define(['models/bucket'], function(Bucket) {
  function Vault(definitions, repo) {
    this.buckets = [];

    for(var idx in repo.buckets) {
      this.buckets.push(new Bucket(definitions, repo.buckets[idx]));
    }
  }

  return Vault;
});
