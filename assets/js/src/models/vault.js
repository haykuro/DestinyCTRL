define(['models/bucket'], function(Bucket) {
  function Vault(definitions, repo) {
    for(var idx in repo.buckets) {
      new Bucket(definitions, repo.buckets[idx]);
    }
  }

  return Vault;
});
