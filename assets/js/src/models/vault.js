define(['models/bucket'], function(Bucket) {
  function Vault(definitions, repo) {
    this.buckets = repo.buckets.map(function(bucket) {
      return new Bucket(definitions, bucket);
    }).sort(function(a, b) {
      return a.order - b.order;
    });
  }

  return Vault;
});
